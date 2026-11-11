"use client";

import { useEffect, useRef, useState } from "react";
import { compact } from "@/lib/format";
import { ArrowRight, Star } from "../../Icon";
import { watchTheme } from "../../lab-hero/field";
import { SHOT_W, SHOT_H, startColonies, staticColonies, type Disc, type Engine, type Rect } from "./engine";
import type { Layout } from "./layout";

export type Colony = {
  name: string;
  href: string;
  tagline: string;
  shot?: string;
  stars: number;
  contributors: number;
  /** Commits in the last 8 weeks. */
  commits: number;
  /** Pulses per second, 0 = still (no commits lately). */
  pulse: number;
  /** 0 = spots (quiet) .. 1 = coral (busy). */
  regime: number;
  seed: number;
};

/** `under`: colonies whose name the picture or its plate covers (their labels step aside). */
type Focus = { i: number; rect: Rect; below: boolean; under: number[] };

const mono = "t-mono text-[11px] tracking-[0.04em]";
const people = (n: number) => `${n} contributor${n === 1 ? "" : "s"}`;
const pct = (n: number) => `${(n * 100).toFixed(3)}%`;

/** The screenshot, cover-cropped from the top to the reveal's 16:10, or the name set large when there is none. */
function plate(c: Colony, box: HTMLElement): Promise<{ src: HTMLCanvasElement; negative: boolean }> {
  const cv = document.createElement("canvas");
  cv.width = SHOT_W;
  cv.height = SHOT_H;
  const ctx = cv.getContext("2d", { willReadFrequently: true })!;
  const cs = getComputedStyle(box);
  const v = (n: string, f: string) => cs.getPropertyValue(n).trim() || f;
  if (!c.shot) {
    return document.fonts.ready.then(() => {
      ctx.fillStyle = v("--bg", "#f8f9fa");
      ctx.fillRect(0, 0, SHOT_W, SHOT_H);
      ctx.fillStyle = v("--fg", "#051c20");
      ctx.fontStretch = "condensed";
      let size = 280;
      do ctx.font = `800 ${(size -= 8)}px ${cs.fontFamily}`;
      while (ctx.measureText(c.name).width > SHOT_W - 200);
      const base = 140 + size * 0.8;
      ctx.fillText(c.name, 100, base);
      // The purpose, wrapped, big enough to read once the card is shrunk into the reveal.
      ctx.fontStretch = "normal";
      ctx.font = `500 76px ${cs.fontFamily}`;
      ctx.fillStyle = v("--fg-muted", "#43565b");
      let line = "", y = base + 130;
      for (const word of c.tagline.split(" ")) {
        if (line && ctx.measureText(`${line} ${word}`).width > SHOT_W - 200) {
          ctx.fillText(line, 104, y);
          [line, y] = [word, y + 92];
        } else line = line ? `${line} ${word}` : word;
      }
      ctx.fillText(line, 104, y);
      return { src: cv, negative: false };
    });
  }
  return new Promise((done) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      const s = Math.min(img.naturalWidth / SHOT_W, img.naturalHeight / SHOT_H);
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, (img.naturalWidth - SHOT_W * s) / 2, 0, SHOT_W * s, SHOT_H * s, 0, 0, SHOT_W, SHOT_H);
      // Dark UIs print as a negative while they develop (light strokes take the ink), like the lab's Dither.
      const d = ctx.getImageData(0, 0, SHOT_W, SHOT_H).data;
      let sum = 0, n = 0;
      for (let i = 0; i < d.length; i += 4 * 97, n++) sum += 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
      done({ src: cv, negative: sum / n / 255 < 0.45 });
    };
    img.src = c.shot!;
  });
}

/**
 * The colonies, positioned from the server (no layout shift), with a canvas underneath. Each colony is a link; hover,
 * focus or a first tap develops it, a click (or second tap) opens the project.
 */
export function ColonyField({ colonies, desktop, mobile }: { colonies: Colony[]; desktop: Layout; mobile: Layout }) {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  // The still fallback gets its own canvas: once `canvas` has had a WebGL context it can never hand out a 2D one.
  const still = useRef<HTMLCanvasElement>(null);
  const links = useRef<(HTMLAnchorElement | null)[]>([]);
  const engine = useRef<Engine | null>(null);
  const plates = useRef(new Map<number, ReturnType<typeof plate>>());
  const closer = useRef(0);
  const want = useRef(-1);
  const [focus, setFocus] = useState<Focus | null>(null);
  const [gl, setGl] = useState(true);

  // Each disc as the engine sees it, read from where the DOM put it.
  const discs = (): Disc[] => {
    const b = box.current!.getBoundingClientRect();
    return colonies.map((c, i) => {
      const r = links.current[i]!.getBoundingClientRect();
      return { x: r.left - b.left + r.width / 2, y: r.top - b.top + r.height / 2, r: r.width / 2, pulse: c.pulse, regime: c.regime, seed: c.seed };
    });
  };

  useEffect(() => {
    const b = box.current!, c = canvas.current!, sc = still.current!;
    const e = startColonies(b, c, discs, b.clientWidth < 768);
    if (e) {
      engine.current = e;
      return () => e.stop();
    }
    setGl(false);
    // Observers can fire between React detaching the refs and this effect's cleanup: skip once unmounted.
    const draw = () => {
      if (!box.current || !still.current) return;
      staticColonies(b, sc, discs());
    };
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(b);
    const unwatch = watchTheme(draw);
    return () => {
      ro.disconnect();
      unwatch();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- discs reads refs; started once
  }, []);

  function open(i: number) {
    clearTimeout(closer.current);
    const b = box.current!.getBoundingClientRect(), r = links.current[i]!.getBoundingClientRect();
    const W = b.width, H = b.height, cx = r.left - b.left + r.width / 2, cy = r.top - b.top + r.height / 2;
    const wide = W >= 768;
    const w = wide ? Math.min(Math.max(r.width * 1.35, 360), 480) : W;
    const h = (w * SHOT_H) / SHOT_W;
    const rect = { x: Math.min(Math.max(cx - w / 2, 0), W - w), y: Math.min(Math.max(cy - h / 2, 0), H - h), w, h };
    const below = rect.y + h + 150 < H + 64;
    // The picture plus its plate (about 150px), in page coordinates.
    const top = b.top + rect.y - (below ? 0 : 150), bottom = b.top + rect.y + h + (below ? 150 : 0);
    const under = links.current.flatMap((a, k) => {
      const l = a!.firstElementChild!.getBoundingClientRect();
      return l.right > b.left + rect.x && l.left < b.left + rect.x + w && l.bottom > top && l.top < bottom ? [k] : [];
    });
    setFocus({ i, rect, below, under });
    want.current = i;
    if (!plates.current.has(i)) plates.current.set(i, plate(colonies[i], box.current!));
    plates.current.get(i)!.then(({ src, negative }) => {
      if (want.current === i) engine.current?.focus(i, rect, src, negative); // still the one in focus?
    });
  }
  function close() {
    clearTimeout(closer.current);
    want.current = -1;
    engine.current?.focus(-1, null, null, false);
    setFocus(null);
  }
  const closeSoon = () => {
    clearTimeout(closer.current);
    closer.current = window.setTimeout(() => {
      if (!box.current?.contains(document.activeElement)) close();
    }, 140);
  };

  // Touch: a tap off every colony and the picture, or Escape, puts it back.
  useEffect(() => {
    if (!focus) return;
    const down = (e: PointerEvent) => {
      const a = (e.target as Element).closest("a");
      if (!a || !box.current?.contains(a)) close();
    };
    const key = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("pointerdown", down);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("keydown", key);
    };
  });

  const f = focus && colonies[focus.i];
  return (
    <div
      ref={box}
      className="relative aspect-[1/var(--am)] md:aspect-[1/var(--ad)]"
      style={{ "--ad": desktop.aspect, "--am": mobile.aspect } as React.CSSProperties}
    >
      <canvas ref={canvas} aria-hidden className={`absolute inset-0 size-full [image-rendering:pixelated] ${gl ? "" : "hidden"}`} />
      <canvas ref={still} aria-hidden className={`absolute inset-0 size-full [image-rendering:pixelated] ${gl ? "hidden" : ""}`} />
      <ul className="contents">
        {colonies.map((c, i) => {
          const d = desktop.spots[i], m = mobile.spots[i];
          const hot = focus?.i === i;
          return (
            <li key={c.name} className="contents">
              <a
                ref={(el) => {
                  links.current[i] = el;
                }}
                href={c.href}
                aria-label={`${c.name}: ${c.tagline} ${c.stars.toLocaleString("en")} stars, ${people(c.contributors)}, ${c.commits} commits in the last 8 weeks.`}
                onPointerEnter={(e) => e.pointerType !== "touch" && open(i)}
                onPointerLeave={(e) => e.pointerType !== "touch" && closeSoon()}
                onFocus={() => open(i)}
                onBlur={closeSoon}
                onClick={(e) => {
                  // Touch: the first tap develops it, the second opens it.
                  if (!hot && matchMedia("(hover: none)").matches) {
                    e.preventDefault();
                    open(i);
                  }
                }}
                style={{ "--x": pct(d.x), "--y": pct(d.y), "--r": pct(d.r), "--mx": pct(m.x), "--my": pct(m.y), "--mr": pct(m.r) } as React.CSSProperties}
                className="group absolute top-(--my) left-(--mx) aspect-square w-[calc(var(--mr)*2)] -translate-1/2 rounded-full outline-offset-4 focus-visible:outline-2 focus-visible:outline-(--focus) md:top-(--y) md:left-(--x) md:w-[calc(var(--r)*2)]"
              >
                <span
                  aria-hidden
                  className={`${mono} absolute top-full left-1/2 mt-1.5 -translate-x-1/2 whitespace-nowrap transition-opacity duration-150 ${
                    focus?.under.includes(i) ? "opacity-0" : hot ? "text-(--accent)" : focus ? "text-(--fg-muted) opacity-40" : "text-(--fg)"
                  }`}
                >
                  {c.name} <span className="text-(--fg-muted)"><Star size="1em" label="stars" /> {compact(c.stars)}</span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
      {focus && f && (
        // The developed picture and its plate: the same link again, for the pointer only (the colony carries the name).
        <a
          href={f.href}
          aria-hidden
          tabIndex={-1}
          onPointerEnter={() => clearTimeout(closer.current)}
          onPointerLeave={(e) => e.pointerType !== "touch" && closeSoon()}
          className="absolute z-10 block"
          style={{ left: focus.rect.x, top: focus.rect.y, width: focus.rect.w, height: focus.rect.h }}
        >
          {!gl &&
            (f.shot ? (
              // eslint-disable-next-line @next/next/no-img-element -- fallback only, the canvas draws it otherwise
              <img src={f.shot} alt="" className="size-full object-cover object-top" />
            ) : (
              <span className="flex size-full items-center bg-(--bg) p-6 text-[40px] font-[800] [font-stretch:75%]">{f.name}</span>
            ))}
          <span
            className={`absolute inset-x-0 flex flex-col gap-1.5 bg-(--bg) px-4 py-3 shadow-[inset_0_0_0_1px_var(--fg)] ${focus.below ? "top-full mt-2" : "bottom-full mb-2"}`}
          >
            <span className="flex items-baseline justify-between gap-3">
              <span className="text-[22px] leading-none font-[800] text-(--fg) [font-stretch:75%]">{f.name}</span>
              <span className={`${mono} flex items-center gap-1 text-(--accent)`}>
                Open project <ArrowRight size="1em" />
              </span>
            </span>
            <span className="text-[14px] leading-snug text-(--fg-muted)">{f.tagline}</span>
            <span className={`${mono} flex flex-wrap gap-x-3 text-(--fg-muted) tabular-nums`}>
              <span className="inline-flex items-center gap-1">
                <Star size="1em" /> {f.stars.toLocaleString("en")}
              </span>
              <span>{people(f.contributors)}</span>
              <span>{f.commits ? `${f.commits} commits in 8 weeks` : "no commits in 8 weeks"}</span>
            </span>
          </span>
        </a>
      )}
    </div>
  );
}
