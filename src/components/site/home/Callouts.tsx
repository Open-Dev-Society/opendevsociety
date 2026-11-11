"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Num } from "../Cite";
import { display, focus } from "./ui";

export type Part = string | { word: string; note: string };

/** The fixed nav (h-16) plus a little air: a card that would sit under it flips below its word. */
const TOP = 72;
const GAP = 10;

/**
 * A display statement with citations: each marked word is underlined with its number in a square on its top-right.
 * Hover, keyboard focus or a tap shows its note as a card over the word. The cards are always in the DOM (hidden) so
 * each word's aria-describedby reads its note; one is open at a time, and Escape or a click outside closes it.
 */
export function Callouts({ parts }: { parts: Part[] }) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const pointer = useRef("");
  const [open, setOpen] = useState<number | null>(null);
  const [pos, setPos] = useState({
    i: -1,
    left: 0,
    top: 0,
    notch: 0,
    below: false,
  });
  const notes = parts.filter((p) => typeof p !== "string");

  useLayoutEffect(() => {
    if (open === null) return;
    const el = root.current!;
    const box = el.getBoundingClientRect();
    const word = el.querySelector(`[data-word="${open}"]`)!.getBoundingClientRect();
    const card = el.querySelector<HTMLElement>(`[data-card="${open}"]`)!;
    const { offsetWidth: w, offsetHeight: h } = card;
    const mid = word.left + word.width / 2 - box.left;
    const left = Math.min(Math.max(0, mid - w / 2), box.width - w);
    const below = word.top - h - GAP < TOP;
    setPos({
      i: open,
      left,
      top: below ? word.bottom - box.top + GAP : word.top - box.top - h - GAP,
      notch: Math.min(Math.max(14, mid - left), w - 14),
      below,
    });
  }, [open]);

  useEffect(() => {
    if (open === null) return;
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    const down = (e: PointerEvent) => !(e.target as Element).closest?.("[data-word]") && setOpen(null);
    document.addEventListener("keydown", key);
    document.addEventListener("pointerdown", down);
    return () => {
      document.removeEventListener("keydown", key);
      document.removeEventListener("pointerdown", down);
    };
  }, [open]);

  let n = -1;
  return (
    <div ref={root} className="relative">
      <p className={`${display} leading-[1.25] md:leading-[1.06] text-[clamp(2.25rem,1.3rem+3.6vw,4.75rem)]`}>
        {parts.map((p, i) => {
          if (typeof p === "string") return p;
          const k = ++n;
          return (
            <button
              key={i}
              type="button"
              data-word={k}
              aria-describedby={`${id}-${k}`}
              onPointerDown={(e) => (pointer.current = e.pointerType)}
              onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(k)}
              onPointerLeave={(e) => e.pointerType === "mouse" && setOpen((o) => (o === k ? null : o))}
              onFocus={(e) => e.currentTarget.matches(":focus-visible") && setOpen(k)}
              onBlur={() => setOpen((o) => (o === k ? null : o))}
              onClick={() => {
                // A mouse already opened it on hover; a tap or Enter toggles.
                if (pointer.current === "mouse") setOpen(k);
                else setOpen((o) => (o === k ? null : k));
                pointer.current = "";
              }}
              className={`relative cursor-help whitespace-nowrap underline decoration-(--accent) decoration-2 underline-offset-[0.12em] [text-decoration-skip-ink:none] ${focus}`}
            >
              {p.word}
              <span className="absolute top-[0.04em] right-0 translate-x-[60%] -translate-y-1/4 md:translate-x-1/2 md:translate-y-0">
                <Num n={k + 1} on={open === k} />
              </span>
            </button>
          );
        })}
      </p>
      {notes.map((p, i) => {
        const at = pos.i === i ? pos : null; // keeps its last place while it fades out
        return (
          <span
            key={i}
            id={`${id}-${i}`}
            role="tooltip"
            data-card={i}
            style={at ? { left: at.left, top: at.top } : undefined}
            className={`pointer-events-none absolute top-0 left-0 z-20 flex w-[min(20rem,100%)] gap-3 border border-(--fg) bg-(--bg) p-3 text-[15px] leading-snug text-(--fg) transition-[opacity,translate] duration-150 motion-reduce:transition-none ${
              open === i
                ? "visible translate-y-0 opacity-100"
                : `invisible opacity-0 ${at?.below ? "-translate-y-1" : "translate-y-1"}`
            }`}
          >
            <Num n={i + 1} on />
            {typeof p !== "string" && p.note}
            <span
              aria-hidden
              style={{ left: at?.notch ?? 14 }}
              className={`absolute size-2.5 -translate-x-1/2 rotate-45 border-(--fg) bg-(--bg) ${at?.below ? "-top-[6px] border-t border-l" : "-bottom-[6px] border-r border-b"}`}
            />
          </span>
        );
      })}
    </div>
  );
}
