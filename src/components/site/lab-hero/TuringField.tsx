"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { ALGOS, startField, staticField } from "./field";

/** The canvas behind the lab hero, plus the instrument label that rides the lens. Must sit inside the hero <section>. */
export function TuringField() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const label = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const c = canvas.current!;
    const section = c.closest("section")!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = section.clientWidth < 768;
    let stop: (() => void) | null = null;
    let gone = false;
    // The glyphs are drawn from the loaded font, so wait for it.
    document.fonts.ready.then(() => {
      if (gone) return;
      stop = startField(section, c, {
        reduced,
        mobile,
        onLens: (x, y, r, algo) => {
          const el = label.current!;
          const text = `lens · ${ALGOS[algo]}`;
          if (el.textContent !== text) el.textContent = text;
          // Bottom-right of the ring, or bottom-left when that would run off the hero.
          const right = x + r * 0.72 + 4;
          const lx = right + el.offsetWidth > section.clientWidth - 8 ? x - r * 0.72 - 4 - el.offsetWidth : right;
          el.style.transform = `translate(${Math.round(lx)}px, ${Math.round(y + r * 0.72 + 4)}px)`;
        },
      });
      if (!stop) staticField(section, c);
    });
    return () => {
      gone = true;
      stop?.();
    };
  }, []);

  return (
    <>
      <canvas ref={canvas} aria-hidden className="absolute inset-0 -z-10 size-full [image-rendering:pixelated]" />
      <p
        ref={label}
        aria-hidden
        className="t-mono pointer-events-none absolute top-0 left-0 z-10 bg-(--bg) px-1.5 text-[11px] whitespace-nowrap text-(--fg) opacity-0 transition-opacity duration-(--d-4) group-data-[live]:opacity-100"
      />
    </>
  );
}

const tick = (cb: () => void) => {
  const id = setInterval(cb, 1000);
  return () => clearInterval(id);
};
const second = () => Math.floor(Date.now() / 1000);

/** "10 Nov 2026 · 14:03:22", in the reader's zone. The server renders a fixed-width placeholder. */
export function LabClock() {
  const s = useSyncExternalStore(tick, second, () => 0);
  const d = s ? new Date(s * 1000) : null;
  return (
    <time dateTime={d?.toISOString()} className="tabular-nums">
      {d ? `${d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} · ${d.toLocaleTimeString("en-GB", { hour12: false })}` : "·· ··· ···· · --:--:--"}
    </time>
  );
}
