"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { compact } from "@/lib/format";
import { LabButton } from "../lab-hero/LabButton";
import { Dither } from "../lab/Dither";
import { display, focus } from "./ui";
import { ArrowRight, ArrowUp, Star } from "../Icon";

export type IndexRow = {
  name: string;
  href: string;
  stars: number;
  /** 0..1, log-scaled to the most-starred project. */
  bar: number;
  status: "active" | "quiet" | "archived";
  language: string | null;
  tagline: string;
  shot?: string;
  contributors: number;
};

const GAP = 24; // between the cursor and the frame
const HYSTERESIS = 8; // px the pointer must be inside another row before it takes over
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const touch = () => matchMedia("(hover: none)").matches;

/** Tells a preview's Dither to develop (or rest coarse), through the [data-develop] wrapper it listens on. */
const develop = (el: Element | null | undefined, on: boolean) => el?.dispatchEvent(new PointerEvent(on ? "pointerenter" : "pointerleave"));

function Shot({ row }: { row: IndexRow }) {
  return row.shot ? (
    <Dither src={row.shot} alt={`${row.name}, screenshot`} width={16} height={10} align="top" negative develop className="w-full" />
  ) : (
    // No screenshot: the purpose, set large in the frame.
    <span className={`${display} flex aspect-[16/10] items-end bg-(--surface-2) p-4 text-[1.75rem] text-(--accent)`}>{row.tagline}</span>
  );
}

const caption = (r: IndexRow) => (
  <>
    <Star size="1em" label="Stars" /> {compact(r.stars)} · {r.contributors} contributor{r.contributors === 1 ? "" : "s"}
  </>
);

/**
 * The projects as a type specimen. Pointer: a preview frame follows the cursor (lerped, clamped to the list) and develops.
 * Keyboard: the preview pins beside the focused row. Touch: a tap opens the row inline.
 */
export function ProjectIndex({ rows }: { rows: IndexRow[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const shots = useRef<(HTMLDivElement | null)[]>([]);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const raf = useRef(0);
  // Row bands (top/bottom, relative to the list), measured when the pointer comes in and after scrolls/resizes.
  const bands = useRef<{ top: number; bottom: number }[] | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);

  // The frame as laid out (it narrows to fit small windows), and a position clamped inside the list.
  const size = () => [frame.current!.offsetWidth, frame.current!.offsetHeight] as const;
  const aim = (x: number, y: number) => {
    const [fw, fh] = size();
    target.current = { x: Math.min(Math.max(0, x), wrap.current!.clientWidth - fw), y: Math.min(Math.max(0, y), wrap.current!.clientHeight - fh) };
  };
  // Beside the cursor, never under it: to the right, or to the left when there's no room.
  const beside = (cx: number, cy: number) => {
    const [fw, fh] = size();
    aim(cx + GAP + fw <= wrap.current!.clientWidth ? cx + GAP : cx - GAP - fw, cy - fh / 2);
  };

  useEffect(() => {
    const stale = () => void (bands.current = null);
    addEventListener("scroll", stale, { passive: true });
    addEventListener("resize", stale);
    return () => {
      removeEventListener("scroll", stale);
      removeEventListener("resize", stale);
    };
  }, []);

  /** The row under y, holding on to the current one until the pointer is HYSTERESIS px clearly inside another. */
  const hit = (y: number, current: number | null) => {
    if (!bands.current) {
      const top = wrap.current!.getBoundingClientRect().top;
      bands.current = [...wrap.current!.querySelectorAll("ol > li > a")].map((a) => {
        const r = a.getBoundingClientRect();
        return { top: r.top - top, bottom: r.bottom - top };
      });
    }
    const b = bands.current;
    if (current !== null && y >= b[current].top - HYSTERESIS && y <= b[current].bottom + HYSTERESIS) return current;
    const i = b.findIndex((r) => y >= r.top + (current === null ? 0 : HYSTERESIS) && y < r.bottom - (current === null ? 0 : HYSTERESIS));
    return i < 0 ? current : i;
  };
  const place = () => {
    frame.current!.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
  };

  useEffect(() => {
    if (active === null) return;
    develop(shots.current[active], true);
    const tick = () => {
      const p = pos.current,
        t = target.current;
      p.x += (t.x - p.x) * 0.18;
      p.y += (t.y - p.y) * 0.18;
      place();
      raf.current = requestAnimationFrame(tick);
    };
    if (!reduced()) raf.current = requestAnimationFrame(tick);
    const was = shots.current[active];
    return () => {
      cancelAnimationFrame(raf.current);
      develop(was, false);
    };
  }, [active]);

  /** Make row i active; the frame's target is already set. */
  const enter = (i: number) => {
    // Coming in from nothing: start where the cursor is, not where the frame was left.
    if (active === null || reduced()) {
      pos.current = { ...target.current };
      place();
    }
    setActive(i);
  };

  return (
    <div
      ref={wrap}
      className="relative"
      // One pointermove on the whole list drives the active row and the frame; only leaving the list clears it.
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = wrap.current!.getBoundingClientRect(),
          x = e.clientX - r.left,
          y = e.clientY - r.top;
        const i = hit(y, active);
        if (i === null) return;
        beside(x, y);
        if (i !== active) enter(i);
        else if (reduced()) {
          pos.current = { ...target.current };
          place();
        }
      }}
      onPointerLeave={(e) => e.pointerType === "mouse" && setActive(null)}
    >
      <ol className="border-t border-(--fg)">
        {rows.map((r, i) => (
          <li key={r.name} className={`transition-opacity duration-(--d-3) ${active !== null && active !== i ? "opacity-40" : ""}`}>
            <Link
              href={r.href}
              aria-expanded={open === i ? true : undefined}
              onFocus={(e) => {
                if (touch()) return;
                // Pinned beside the row: at the right edge, just under it (or over it near the bottom).
                const row = e.currentTarget.getBoundingClientRect(),
                  box = wrap.current!.getBoundingClientRect();
                const below = row.bottom - box.top + 8,
                  fh = size()[1];
                aim(box.width, below + fh > box.height ? row.top - box.top - fh - 8 : below);
                enter(i);
              }}
              onBlur={() => setActive(null)}
              onClick={(e) => {
                if (!touch()) return;
                e.preventDefault();
                setOpen(open === i ? null : i);
              }}
              className={`group flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-(--line) py-3 md:grid md:grid-cols-[minmax(0,1fr)_9rem_3.5rem_5rem_6.5rem_1.25rem] md:py-2 ${focus}`}
            >
              <span className={`${display} basis-full text-[clamp(2.5rem,0.9rem+5.2vw,6rem)] ${active === i ? "text-(--accent)!" : ""}`}>
                {r.name}
              </span>
              <span aria-hidden className="h-2.5 w-24 md:w-full">
                <span
                  className="block h-full bg-[repeating-conic-gradient(var(--accent-brand)_0_25%,transparent_0_50%)] bg-size-[4px_4px]"
                  style={{ width: `${Math.max(4, r.bar * 100)}%` }}
                />
              </span>
              <span className="t-mono text-[13px] text-(--fg)">
                <span className="sr-only">Stars: </span>
                {compact(r.stars)}
              </span>
              <span className={`t-mono text-[12px] ${r.status === "active" ? "text-(--accent)" : "text-(--fg-subtle)"}`}>{r.status}</span>
              <span className="t-mono text-[12px] text-(--fg-muted)">{r.language}</span>
              <span
                aria-hidden
                className={`t-mono ml-auto text-(--fg) transition-transform duration-(--d-2) md:ml-0 ${active === i ? "translate-x-1" : ""}`}
              >
                {open === i ? <ArrowUp size="1em" /> : <ArrowRight size="1em" />}
              </span>
            </Link>
            {open === i && (
              <div className="grid gap-3 border-b border-(--line) pt-1 pb-5">
                <Shot row={r} />
                <p className="text-[16px] text-(--fg-muted)">{r.tagline}</p>
                <p className="t-mono text-[12px] text-(--fg-muted)">{caption(r)}</p>
                <LabButton href={r.href} size="md" className="justify-self-start">
                  Open project <ArrowRight size="1em" />
                </LabButton>
              </div>
            )}
          </li>
        ))}
      </ol>

      {/* The cursor's preview: pointer devices only, never in the layout flow. */}
      <div
        ref={frame}
        aria-hidden
        className={`pointer-events-none absolute [&_*]:pointer-events-none top-0 left-0 z-10 hidden w-[min(22.5rem,100%)] bg-(--bg) shadow-[0_0_0_1px_var(--fg)] transition-opacity duration-(--d-2) will-change-transform [@media(hover:hover)]:block ${active === null ? "opacity-0" : "opacity-100"}`}
      >
        <div className="grid">
          {rows.map((r, i) => (
            <div
              key={r.name}
              ref={(el) => void (shots.current[i] = el)}
              data-develop
              className={`col-start-1 row-start-1 ${active === i ? "visible" : "invisible"}`}
            >
              <Shot row={r} />
            </div>
          ))}
        </div>
        {active !== null && (
          <p className="t-mono flex justify-between gap-3 border-t border-(--fg) px-2.5 py-2 text-[11px] text-(--fg-muted)">
            <span className="truncate">{rows[active].tagline}</span>
            <span className="shrink-0 text-(--fg)">{caption(rows[active])}</span>
          </p>
        )}
      </div>
    </div>
  );
}
