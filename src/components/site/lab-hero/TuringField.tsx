"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { startField, staticField, watchTheme } from "./field";

/** The canvas behind the lab hero. Must sit inside the hero <section>. */
export function TuringField() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvas.current!;
    const section = c.closest("section")!;
    const mobile = section.clientWidth < 768;
    let stop: (() => void) | null = null;
    let gone = false;
    // The glyphs are drawn from the loaded font, so wait for it.
    document.fonts.ready.then(() => {
      if (gone) return;
      stop = startField(section, c, { mobile });
      // No WebGL2: a CPU still, redrawn if the theme changes.
      if (!stop) {
        staticField(section, c);
        stop = watchTheme(() => staticField(section, c));
      }
    });
    return () => {
      gone = true;
      stop?.();
    };
  }, []);

  return <canvas ref={canvas} aria-hidden className="absolute inset-0 -z-10 size-full [image-rendering:pixelated]" />;
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
