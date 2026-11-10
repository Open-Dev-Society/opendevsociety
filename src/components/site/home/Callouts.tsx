"use client";

import { useEffect, useRef, useState } from "react";
import { display } from "./ui";

export type Part = string | { word: string; note: string };

/**
 * A display statement with architect-style callouts: each marked word gets a ticked dimension line under it and a
 * leader out to its numbered note in the margin. The leaders are an SVG overlay measured from the DOM (lg and up);
 * below that, the numbers alone pair words with the notes listed underneath.
 */
export function Callouts({ parts }: { parts: Part[] }) {
  const root = useRef<HTMLDivElement>(null);
  const [d, setD] = useState("");
  const notes = parts.filter((p) => typeof p !== "string");
  const count = notes.length;

  useEffect(() => {
    const el = root.current!;
    const draw = () => {
      const box = el.getBoundingClientRect();
      const text = el.querySelector("[data-statement]")!.getBoundingClientRect();
      const lines = new Map<number, number>(); // words already on a line, to space their leaders apart
      const path = Array.from({ length: count }, (_, i) => {
        const word = el.querySelector(`[data-word="${i}"]`)!;
        const w = word.getClientRects()[0];
        // An inline box runs well below the baseline; the zero-size marker at the word's end sits on it.
        const base = word.querySelector("i")!.getBoundingClientRect().top;
        const em = parseFloat(getComputedStyle(word).fontSize);
        const n = el.querySelector(`[data-note="${i}"]`)!.getBoundingClientRect();
        const k = lines.get(Math.round(base)) ?? 0;
        lines.set(Math.round(base), k + 1);
        const x0 = w.left - box.left,
          x1 = w.right - box.left;
        // Just clear of the descenders, in the gap before the next line.
        const y = Math.round(base - box.top + em * 0.2) + k * 4 + 0.5;
        const elbow = Math.round(text.right - box.left) + 20 + i * 8 + 0.5;
        const ny = Math.round(n.top - box.top + 11) + 0.5;
        const nx = n.left - box.left - 8;
        // Ticked dimension line under the word, then the leader: along the line gap, down/up the margin, into the note.
        return `M${x0} ${y - 4}v8M${x0} ${y}H${x1}M${x1} ${y - 4}v8M${x1} ${y}H${elbow}V${ny}H${nx}`;
      });
      setD(path.join(""));
    };
    const ro = new ResizeObserver(draw);
    ro.observe(el);
    document.fonts.ready.then(draw);
    return () => ro.disconnect();
  }, [count]);

  let n = -1;
  return (
    <div ref={root} className="relative grid gap-8 lg:grid-cols-12 lg:gap-x-(--grid-gap)">
      <p data-statement className={`${display} self-start leading-[1.06] text-[clamp(2.25rem,1.3rem+3.6vw,4.75rem)] lg:col-span-8 lg:max-w-[16ch]`}>
        {parts.map((p, i) => {
          if (typeof p === "string") return p;
          n++;
          return (
            <span key={i}>
              <span data-word={n}>
                {p.word}
                <i className="inline-block size-0 align-baseline" />
              </span>
              <sup className="t-mono ml-0.5 align-super text-[max(11px,0.2em)] font-normal text-(--accent)">{n + 1}</sup>
            </span>
          );
        })}
      </p>
      <ol className="self-center lg:col-span-3 lg:col-start-10">
        {notes.map((p, i) => (
          <li
            key={i}
            data-note={i}
            className="grid grid-cols-[1.5rem_minmax(0,1fr)] border-t border-(--line) py-2.5 text-[15px] leading-snug text-(--fg-muted)"
          >
            <span className="t-mono text-[12px] text-(--accent)">{i + 1}</span>
            {typeof p !== "string" && p.note}
          </li>
        ))}
      </ol>
      <svg aria-hidden className="pointer-events-none absolute inset-0 hidden size-full overflow-visible lg:block" shapeRendering="crispEdges">
        <path d={d} fill="none" stroke="var(--accent)" strokeWidth="1" />
      </svg>
    </div>
  );
}
