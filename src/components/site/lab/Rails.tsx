"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import s from "./Rails.module.css";

type Tone = "" | "tone-inverse" | "tone-emerald";
type Band = { top: number; bottom: number; tone: Tone };
type GridRef = { y: number; letter: string; name: string; tone: Tone };
type Sheet = { height: number; start: number; bands: Band[]; refs: GridRef[] };

const toneOf = (el: Element | null): Tone =>
  el?.classList.contains("tone-emerald") ? "tone-emerald" : el?.classList.contains("tone-inverse") ? "tone-inverse" : "";

// Everything in page px. The sheet starts under a [data-under-nav] hero (its corner plates sit flush on the edges),
// and is cut into bands wherever a full-bleed ink or emerald section runs, so each band re-points the tokens.
function measure(site: HTMLElement): Sheet {
  const y = scrollY;
  const w = document.documentElement.clientWidth;
  const hero = document.querySelector("[data-under-nav]");
  const start = hero ? Math.round(hero.getBoundingClientRect().bottom + y) : 0;
  const height = site.offsetHeight;
  const bands: Band[] = [];
  let at = start;
  for (const el of document.querySelectorAll(".tone-inverse, .tone-emerald")) {
    const r = el.getBoundingClientRect();
    const top = Math.round(r.top + y);
    const bottom = Math.round(r.bottom + y);
    // Full-bleed only; nested bands end inside their parent, so they're skipped here.
    if (r.width < w - 1 || bottom <= at) continue;
    if (top > at) bands.push({ top: at, bottom: top, tone: "" });
    bands.push({ top: Math.max(at, top), bottom, tone: toneOf(el) });
    at = bottom;
  }
  if (at < height) bands.push({ top: at, bottom: height, tone: "" });
  const refs = [...document.querySelectorAll<HTMLElement>("[data-grid]")]
    .map((el) => ({ el, y: Math.round(el.getBoundingClientRect().top + y) }))
    .filter((r) => r.y >= start)
    .map(({ el, y }, i) => ({
      y,
      letter: String.fromCharCode(65 + i),
      name: el.dataset.grid ?? "",
      tone: toneOf(el.closest(".tone-inverse, .tone-emerald")),
    }));
  return { height, start, bands, refs };
}

/**
 * Architect's scale rails: page-Y rulers on both viewport edges, A/B/C grid references for [data-grid] sections,
 * and a construction frame (guides on the container edges, a rule and crosshairs at each section).
 * The sheet is absolutely positioned in the document, so it scrolls natively; only the centre marker is fixed.
 */
export function Rails() {
  const path = usePathname();
  const layer = useRef<HTMLDivElement>(null);
  const marker = useRef<HTMLDivElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const [sheet, setSheet] = useState<Sheet | null>(null);
  // Ruler numbers exist only around the viewport, in 500px blocks.
  const [blocks, setBlocks] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    const site = layer.current?.parentElement;
    if (!site) return;
    const ro = new ResizeObserver(() => {
      setSheet(measure(site));
    });
    ro.observe(site);
    return () => ro.disconnect();
  }, [path]);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const c = Math.round(scrollY + innerHeight / 2);
      readout.current!.textContent = String(c);
      marker.current!.dataset.on = String(!!sheet && c >= sheet.start && c < sheet.height);
      const b0 = Math.floor((scrollY - innerHeight / 2) / 500);
      const b1 = Math.floor((scrollY + innerHeight * 1.5) / 500);
      setBlocks((b) => (b[0] === b0 && b[1] === b1 ? b : [b0, b1]));
    };
    const onScroll = () => {
      raf ||= requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, [sheet]);

  const nums: number[] = [];
  if (sheet) for (let n = Math.max(blocks[0], 0) * 5; n < (blocks[1] + 1) * 5; n++) nums.push(n * 100);

  return (
    <>
      <div ref={layer} className={s.layer} style={{ height: sheet?.height ?? 0 }} aria-hidden="true">
        {sheet?.bands.map((b) => (
          <div key={b.top} className={`${s.band} ${b.tone}`} style={{ top: b.top, height: b.bottom - b.top, "--y": `${-b.top}px` } as CSSProperties}>
            <div className={s.rail} data-side="l" />
            <div className={s.rail} data-side="r" />
            <div className={s.guides} />
            {nums
              .filter((n) => n >= b.top && n < b.bottom - 32)
              .map((n) => (
                <span key={n} className={s.num} style={{ top: n - b.top + 3 }}>
                  {n}
                </span>
              ))}
          </div>
        ))}
        {sheet?.refs.map((r) => (
          <div key={r.letter} className={`${s.ref} ${r.tone}`} style={{ top: r.y }}>
            <i className={s.cross} />
            <i className={s.cross} />
            <i className={s.cross} />
            <i className={s.cross} />
            <span className={s.letter}>{r.letter}</span>
            {r.name && (
              <span className={s.tag}>
                {r.letter} · {r.name}
              </span>
            )}
          </div>
        ))}
      </div>
      <div ref={marker} className={s.marker} data-on="false" aria-hidden="true">
        <span ref={readout} />
      </div>
    </>
  );
}

/** A drawing-sheet scale bar in real px: 0 · 50 · 100 · 200, alternating filled and empty. */
export function ScaleBar({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`${s.scale} ${className}`}>
      <span className={s.bar}>
        {[0, 50, 100, 200].map((n) => (
          <span key={n} className={s.mark} style={{ left: n }}>
            {n === 200 ? "200 px" : n}
          </span>
        ))}
      </span>
      <span>scale 1:1</span>
    </div>
  );
}
