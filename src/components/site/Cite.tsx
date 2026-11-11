"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { focus } from "./home/ui";

/** The fixed nav (h-16) plus a little air: a card that would sit under it flips below its word. */
const TOP = 72;
const GAP = 10;

/** A citation number in a small square; `on` fills it. `size` sets the square and its digits. */
export function Num({ n, on, size = "size-[18px] text-[10px] md:size-5 md:text-[11px]" }: { n: number; on?: boolean; size?: string }) {
  return (
    <span
      aria-hidden
      className={`t-mono grid ${size} shrink-0 place-items-center border border-(--accent) leading-none font-normal tracking-normal not-italic transition-colors duration-150 motion-reduce:transition-none ${on ? "bg-(--accent) text-(--accent-fg)" : "bg-(--bg) text-(--accent)"}`}
    >
      {n}
    </span>
  );
}

// The open citation's setter, so opening another closes it.
let shut: ((v: boolean) => void) | null = null;

/**
 * An inline citation in running text: the phrase is underlined with its number in a square on its top-right. Hover,
 * keyboard focus or a tap shows the note as a card over the phrase, clamped inside the nearest [data-column]. The card
 * is always in the DOM (hidden) so the phrase's aria-describedby reads it. It stays open while the pointer crosses into
 * it and its links can be tabbed to; Escape or a click outside closes it.
 */
export function Cite({ n, note, children }: { n: number; note: React.ReactNode; children: React.ReactNode }) {
  const id = useId();
  const root = useRef<HTMLSpanElement>(null);
  const word = useRef<HTMLButtonElement>(null);
  const card = useRef<HTMLSpanElement>(null);
  const pointer = useRef("");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ left: number; top: number; notch: number; below: boolean } | null>(null);

  const show = () => {
    clearTimeout(timer.current);
    if (shut !== setOpen) shut?.(false);
    shut = setOpen;
    setOpen(true);
  };

  useLayoutEffect(() => {
    if (!open) return;
    const at = root.current!.getBoundingClientRect();
    const w = word.current!.getBoundingClientRect();
    const { offsetWidth: cw, offsetHeight: ch } = card.current!;
    const col = root.current!.closest("[data-column]")?.getBoundingClientRect() ?? { left: 16, right: innerWidth - 16 };
    const mid = w.left + w.width / 2;
    const left = Math.min(Math.max(col.left, mid - cw / 2), col.right - cw);
    const below = w.top - ch - GAP < TOP;
    setPos({
      left: left - at.left,
      top: below ? w.bottom - at.top + GAP : w.top - at.top - ch - GAP,
      notch: Math.min(Math.max(14, mid - left), cw - 14),
      below,
    });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (root.current!.contains(document.activeElement)) word.current!.focus();
      setOpen(false);
    };
    const down = (e: PointerEvent) => !root.current!.contains(e.target as Node) && setOpen(false);
    document.addEventListener("keydown", key);
    document.addEventListener("pointerdown", down);
    return () => {
      document.removeEventListener("keydown", key);
      document.removeEventListener("pointerdown", down);
    };
  }, [open]);

  return (
    <span
      ref={root}
      className="relative"
      onPointerEnter={(e) => e.pointerType === "mouse" && show()}
      // A short delay bridges the gap between the phrase and its card.
      onPointerLeave={(e) => e.pointerType === "mouse" && (timer.current = setTimeout(() => setOpen(false), 150))}
      onFocus={(e) => e.target === word.current && e.target.matches(":focus-visible") && show()}
      onBlur={(e) => !root.current!.contains(e.relatedTarget) && setOpen(false)}
    >
      <button
        ref={word}
        type="button"
        aria-describedby={`${id}-note`}
        aria-expanded={open}
        onPointerDown={(e) => (pointer.current = e.pointerType)}
        onClick={() => {
          // A mouse already opened it on hover; a tap or Enter toggles.
          if (pointer.current === "mouse" || !open) show();
          else setOpen(false);
          pointer.current = "";
        }}
        className={`cursor-help whitespace-nowrap underline decoration-(--accent) decoration-2 underline-offset-[0.18em] [text-decoration-skip-ink:none] ${focus}`}
      >
        {children}
        <span className="relative -top-[0.5em] ml-0.5 inline-block align-baseline">
          <Num n={n} on={open} size="size-[15px] text-[10px]" />
        </span>
      </button>
      <span
        ref={card}
        id={`${id}-note`}
        // Until it first opens it hangs left of the phrase, where it can't widen the page.
        style={pos ? { left: pos.left, top: pos.top } : { right: 0, top: 0 }}
        className={`absolute z-20 flex w-[min(20rem,calc(100vw-2*var(--gutter)))] gap-3 border border-(--fg) bg-(--bg) p-3 text-left indent-0 text-[15px] leading-snug font-normal tracking-normal whitespace-normal text-(--fg) not-italic [hyphens:manual] transition-[opacity,translate] duration-150 motion-reduce:transition-none ${
          open ? "visible translate-y-0 opacity-100" : `pointer-events-none invisible opacity-0 ${pos?.below ? "-translate-y-1" : "translate-y-1"}`
        }`}
      >
        <Num n={n} on />
        <span>{note}</span>
        <span
          aria-hidden
          style={{ left: pos?.notch ?? 14 }}
          className={`absolute size-2.5 -translate-x-1/2 rotate-45 border-(--fg) bg-(--bg) ${pos?.below ? "-top-[6px] border-t border-l" : "-bottom-[6px] border-r border-b"}`}
        />
      </span>
    </span>
  );
}
