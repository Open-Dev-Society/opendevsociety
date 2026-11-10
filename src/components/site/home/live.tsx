"use client";

import { useEffect, useRef, useState } from "react";
import { compact } from "@/lib/format";

const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Calls `fn` once, the first time `el` is half in view; `away` while it's still out of view (to set the start frame). */
function onceInView(el: Element, fn: () => void, away: () => void) {
  const io = new IntersectionObserver(
    ([e]) => {
      if (!e.isIntersecting) return away();
      io.disconnect();
      fn();
    },
    { threshold: 0.5 },
  );
  io.observe(el);
  return () => io.disconnect();
}

/** A number that counts up from 0 once, on first view. Server and reduced motion render the final value. */
export function CountUp({ to, short = false }: { to: number; short?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(to);
  useEffect(() => {
    if (reduced()) return;
    let raf = 0;
    const stop = onceInView(
      ref.current!,
      () => {
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / 1400);
          setN(Math.round(to * (1 - (1 - p) ** 3)));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      () => setN(0),
    );
    return () => {
      stop();
      cancelAnimationFrame(raf);
    };
  }, [to]);
  return (
    <span ref={ref} className="tabular-nums">
      {short ? compact(n) : n.toLocaleString("en-US")}
    </span>
  );
}

/** Types `text` in once, on first view. The untyped rest keeps its space (no reflow); screen readers get the whole line. */
export function TypeLine({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(text.length);
  useEffect(() => {
    if (reduced()) return;
    let timer = 0;
    const stop = onceInView(
      ref.current!,
      () => {
        setN(0);
        timer = window.setInterval(() => setN((i) => (i >= text.length ? (clearInterval(timer), i) : i + 1)), 32);
      },
      () => setN(0),
    );
    return () => {
      stop();
      clearInterval(timer);
    };
  }, [text]);
  return (
    <span ref={ref}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        <span className={n < text.length ? "shadow-[2px_0_0_currentColor]" : ""}>{text.slice(0, n)}</span>
        <span className="invisible">{text.slice(n)}</span>
      </span>
    </span>
  );
}

/** One child at a time, every 7s, in a stack sized to the tallest (no reflow). Pauses on hover/focus; reduced motion stays on the first. */
export function Rotator({ children, label }: { children: React.ReactNode[]; label: string }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || reduced()) return;
    const t = setInterval(() => setI((x) => (x + 1) % children.length), 7000);
    return () => clearInterval(t);
  }, [paused, children.length]);
  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="grid"
    >
      {children.map((c, k) => (
        <div
          key={k}
          aria-hidden={k !== i}
          inert={k !== i}
          className={`col-start-1 row-start-1 transition-[opacity,visibility] duration-(--d-4) ${k === i ? "visible opacity-100" : "invisible opacity-0"}`}
        >
          {c}
        </div>
      ))}
    </div>
  );
}
