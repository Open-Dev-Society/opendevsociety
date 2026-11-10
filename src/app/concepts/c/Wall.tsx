"use client";

import { useEffect, useRef, useState } from "react";
import type { Builder } from "./data";

// The page's one signature motion: seats fill in when the wall scrolls into view, then "Your seat" pulses once.
// Without JS, or with reduced motion, the wall renders filled.
export function Wall({ builders, open }: { builders: Builder[]; open: number }) {
  const ref = useRef<HTMLUListElement>(null);
  const [state, setState] = useState<"static" | "armed" | "in">("static");

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < innerHeight * 0.9) return; // already on screen: don't hide it
    setState("armed");
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setState("in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <ul ref={ref} data-wall={state} className="c-wall grid grid-cols-8 gap-1.5 sm:gap-2 md:grid-cols-16">
      {builders.map((b, i) => (
        <li key={b.login} className="c-seat group relative aspect-square" style={{ "--i": i } as React.CSSProperties}>
          <a
            href={b.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={b.name ? `${b.name}, ${b.role}` : `@${b.login}`}
            className="block size-full rounded-[22%]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={b.avatar}
              alt=""
              loading="lazy"
              className={`avatar size-full rounded-[22%] bg-(--paper) ${b.core ? "ring-2 ring-(--accent) ring-offset-2 ring-offset-(--paper-2)" : ""}`}
            />
          </a>
          <span
            role="tooltip"
            className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md bg-(--ink) px-2 py-1 text-xs text-(--paper) opacity-0 transition-[opacity,translate] duration-150 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100"
          >
            {b.name ? `${b.name} · ${b.role}` : `@${b.login}`}
          </span>
        </li>
      ))}

      <li className="c-seat aspect-square" style={{ "--i": builders.length } as React.CSSProperties}>
        <a
          href="#start"
          className="c-yours grid size-full place-items-center rounded-[22%] border-[1.5px] border-dashed border-(--accent) bg-(--card) text-(--accent-2) transition-[background-color] duration-150 hover:bg-(--accent-soft)"
          style={{ "--i": builders.length } as React.CSSProperties}
        >
          <span className="flex flex-col items-center leading-none">
            <span className="text-lg font-medium">+</span>
            <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide sm:text-xs">You</span>
          </span>
          <span className="sr-only">Your seat: make your first pull request</span>
        </a>
      </li>
      {Array.from({ length: open - 1 }, (_, i) => (
        <li
          key={i}
          aria-hidden
          className="c-seat aspect-square rounded-[22%] shadow-[inset_0_0_0_1px_var(--line)]"
          style={{ "--i": builders.length + 1 + i } as React.CSSProperties}
        />
      ))}
    </ul>
  );
}
