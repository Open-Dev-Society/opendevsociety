"use client";

import { useId, useRef } from "react";

/** The fixed nav (h-16) plus a little air: a card that would sit under it flips below its link. */
const TOP = 72;
const GAP = 8;
const EDGE = 8;

// One card open at a time, page-wide: opening one closes the last.
let current: (() => void) | null = null;

type Props = Omit<React.ComponentProps<"a">, "title"> & { tip: React.ReactNode };

/**
 * A link with a designed tooltip: a paper card with an ink hairline and a notch, above the link (below it near the nav),
 * clamped to the screen. Hover or keyboard focus shows it; on touch the first tap shows it and the second follows the link.
 * Escape, a tap elsewhere or a scroll closes it. The card is a manual popover (top layer, no portal), always in the DOM
 * while hidden, so aria-describedby reads it.
 */
export function Tooltip({ tip, children, onClick, ...a }: Props) {
  const id = useId();
  const card = useRef<HTMLSpanElement>(null);
  const link = useRef<HTMLAnchorElement>(null);
  const off = useRef<AbortController | null>(null);
  // Set on a touch or pen press: whether the card was already open (null for mouse and keyboard).
  const tapped = useRef<boolean | null>(null);

  const isOpen = () => !!card.current?.matches(":popover-open");
  const hide = () => {
    off.current?.abort();
    if (isOpen()) card.current!.hidePopover();
  };
  const show = () => {
    const el = card.current!;
    if (isOpen()) return;
    current?.();
    current = hide;
    el.showPopover();

    const r = link.current!.getBoundingClientRect();
    const { offsetWidth: w, offsetHeight: h } = el;
    const mid = r.left + r.width / 2;
    const left = Math.min(Math.max(EDGE, mid - w / 2), innerWidth - w - EDGE);
    const below = r.top - h - GAP < TOP;
    el.style.left = `${left}px`;
    el.style.top = `${below ? r.bottom + GAP : r.top - h - GAP}px`;
    el.style.setProperty("--notch", `${Math.min(Math.max(10, mid - left), w - 10)}px`);
    el.toggleAttribute("data-below", below);

    off.current = new AbortController();
    const { signal } = off.current;
    document.addEventListener("keydown", (e) => e.key === "Escape" && hide(), { signal });
    document.addEventListener("pointerdown", (e) => !link.current?.contains(e.target as Node) && hide(), { signal });
    addEventListener("scroll", hide, { signal, capture: true, passive: true });
  };

  return (
    <>
      <a
        {...a}
        ref={link}
        aria-describedby={id}
        onPointerDown={(e) => (tapped.current = e.pointerType === "mouse" ? null : isOpen())}
        onPointerEnter={(e) => e.pointerType === "mouse" && show()}
        onPointerLeave={(e) => e.pointerType === "mouse" && hide()}
        onFocus={() => tapped.current === null && show()}
        onBlur={hide}
        onClick={(e) => {
          if (tapped.current === false) {
            e.preventDefault();
            show();
          }
          tapped.current = null;
          onClick?.(e);
        }}
      >
        {children}
      </a>
      <span
        ref={card}
        id={id}
        role="tooltip"
        popover="manual"
        className="group pointer-events-none fixed inset-auto m-0 w-max max-w-[min(17rem,calc(100vw-16px))] overflow-visible border border-(--fg) bg-(--bg) px-3 py-2.5 text-left text-(--fg) opacity-0 transition-[opacity,display,overlay] transition-discrete duration-[120ms] ease-(--ease-ui) open:opacity-100 motion-reduce:transition-none starting:open:opacity-0"
      >
        {tip}
        <span
          aria-hidden
          className="absolute -bottom-[5px] left-(--notch) size-2 -translate-x-1/2 rotate-45 border-r border-b border-(--fg) bg-(--bg) group-data-below:top-[-5px] group-data-below:bottom-auto group-data-below:border-t group-data-below:border-r-0 group-data-below:border-b-0 group-data-below:border-l"
        />
      </span>
    </>
  );
}
