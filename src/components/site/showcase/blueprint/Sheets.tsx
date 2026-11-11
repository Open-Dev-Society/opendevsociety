"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { LabButton } from "../../lab-hero/LabButton";
import { display, focus } from "../../home/ui";
import { ArrowRight, External, Star } from "../../Icon";
import s from "./Blueprint.module.css";
import { lineart } from "./lineart";

export type SheetData = {
  name: string;
  tagline: string;
  shot?: string;
  repo: string;
  homepage: string | null;
  stars: string;
  contributors: number;
  /** "Sep 2025": repo created */
  since: string;
  /** "2d ago": last push */
  pushed: string;
  license: string | null;
  language: string | null;
  status: string;
  forks: number;
  issues: number;
  goodFirst: number;
};

const pad = (n: number) => String(n).padStart(2, "0");
const plural = (n: number, one: string) => `${n} ${one}${n === 1 ? "" : "s"}`;
const ink = (el: Element) => getComputedStyle(el).getPropertyValue("--accent-brand").trim() || "#10777b";

function Dim({ side, children, start, end, className = "" }: { side: "top" | "left" | "bottom"; children?: React.ReactNode; start?: React.ReactNode; end?: React.ReactNode; className?: string }) {
  const tick = side === "left" ? [{ top: 0 }, { top: "100%" }] : [{ left: 0 }, { left: "100%" }];
  return (
    <span className={`${s.dim} ${className}`} data-side={side} aria-hidden>
      <i className={s.ext} />
      <i className={s.line} />
      {tick.map((t, i) => (
        <i key={i} className={s.tick} style={t} />
      ))}
      {children && <span className={s.lbl}>{children}</span>}
      {start && (
        <span className={`${s.lbl} max-md:hidden`} data-at="start">
          {start}
        </span>
      )}
      {end && (
        <span className={s.lbl} data-at="end">
          {end}
        </span>
      )}
    </span>
  );
}

/** No screenshot yet: a generic app layout in the same hairlines, with the project's name as its headline. */
function Wireframe({ name }: { name: string }) {
  const cards = 3 + (name.length % 2);
  const w = (1248 - (cards - 1) * 24) / cards;
  const box = (x: number, y: number, bw: number, bh: number, k: string) => (
    <g key={k}>
      <rect x={x} y={y} width={bw} height={bh} />
      <path d={`M${x} ${y}L${x + bw} ${y + bh}M${x + bw} ${y}L${x} ${y + bh}`} opacity={0.45} />
    </g>
  );
  return (
    <svg viewBox="0 0 1440 900" className="absolute inset-0 size-full text-(--accent-brand)" fill="none" stroke="currentColor" aria-hidden>
      <g vectorEffect="non-scaling-stroke" style={{ vectorEffect: "non-scaling-stroke" }}>
        <path d="M0 56H1440" />
        {[28, 50, 72].map((x) => (
          <circle key={x} cx={x} cy={28} r={6} />
        ))}
        <rect x={480} y={16} width={480} height={24} />
        <text x={720} y={33} textAnchor="middle" fill="currentColor" stroke="none" fontSize={13} fontFamily="var(--font-mono)">
          github.com/Open-Dev-Society/{name}
        </text>
        <rect x={96} y={88} width={32} height={32} />
        {[900, 984, 1068, 1152].map((x) => (
          <path key={x} d={`M${x} 104H${x + 56}`} />
        ))}
        <rect x={1240} y={84} width={104} height={40} />
        <text
          x={96}
          y={300}
          fontSize={128}
          fontWeight={800}
          letterSpacing={-2}
          style={{ fontFamily: "var(--font-sans)", fontStretch: "75%" }}
          strokeWidth={1.5}
        >
          {name}
        </text>
        <path d="M96 360H736M96 392H576" />
        <rect x={96} y={432} width={160} height={48} />
        <rect x={272} y={432} width={160} height={48} />
        {box(896, 196, 448, 284, "hero")}
        {Array.from({ length: cards }, (_, i) => {
          const x = 96 + i * (w + 24);
          return (
            <g key={i}>
              {box(x, 560, w, 180, `c${i}`)}
              <path d={`M${x} 772H${x + w * 0.7}M${x} 800H${x + w * 0.45}`} />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

/** The drawing: line-art traced from the screenshot (or a wireframe), which develops into the screenshot itself. */
function Drawing({ sheet, on }: { sheet: SheetData; on: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const c = canvas.current;
    if (!sheet.shot || !c) return;
    let live = true;
    lineart(sheet.shot, ink(c)).then(
      (art) => {
        if (!live) return;
        c.getContext("2d")!.drawImage(art, 0, 0);
        setReady(true);
      },
      () => {},
    );
    return () => {
      live = false;
    };
  }, [sheet.shot]);

  if (!sheet.shot) return <Wireframe name={sheet.name} />;
  return (
    <div className="absolute inset-0" data-on={on}>
      <canvas
        ref={canvas}
        width={1440}
        height={900}
        className={`absolute inset-0 size-full transition-opacity duration-(--d-3) ${ready ? "" : "opacity-0"}`}
      />
      <Image src={sheet.shot} alt="" fill unoptimized className={`${s.photo} object-cover object-top`} />
      <i className={s.scan} />
    </div>
  );
}

function Cell({ k, children, className = "" }: { k: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`border-b border-(--hair) px-3 py-2 ${className}`}>
      <div className="t-mono text-[9.5px] tracking-[0.08em] text-(--fg-subtle) uppercase">{k}</div>
      <div className="t-mono mt-1 text-[12.5px] text-(--fg)">{children}</div>
    </div>
  );
}

/**
 * Projects as blueprint plates, one at a time: ← → / buttons / sheet numbers / swipe to flip.
 * Hover or focus the drawing (tap on touch) and it develops into the real screenshot; leave and it goes back.
 */
export function Sheets({ sheets }: { sheets: SheetData[] }) {
  const [i, setI] = useState(0);
  const [on, setOn] = useState(false);
  const row = useRef<HTMLDivElement>(null);
  const press = useRef<{ x: number; y: number } | null>(null);
  const n = sheets.length;
  const sheet = sheets[i];
  const go = (to: number) => {
    setI(((to % n) + n) % n);
    setOn(false);
  };

  // Keep the current sheet number in view in the (scrollable, on phones) row, without moving the page.
  useEffect(() => {
    const r = row.current;
    const b = r?.children[i] as HTMLElement | undefined;
    if (r && b) r.scrollTo({ left: b.offsetLeft - (r.clientWidth - b.offsetWidth) / 2, behavior: "smooth" });
    // Trace the neighbours ahead of time so flipping lands on finished line-art.
    if (r)
      for (const j of [i + 1, i - 1]) {
        const shot = sheets[(j + n) % n].shot;
        if (shot) lineart(shot, ink(r)).catch(() => {});
      }
  }, [i, n, sheets]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    go(i + (e.key === "ArrowRight" ? 1 : -1));
  };
  const onDown = (e: React.PointerEvent) => {
    press.current = { x: e.clientX, y: e.clientY };
  };
  const onUp = (e: React.PointerEvent) => {
    const p = press.current;
    press.current = null;
    if (!p) return;
    const dx = e.clientX - p.x;
    const dy = e.clientY - p.y;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) go(i + (dx < 0 ? 1 : -1));
    // A tap on the drawing (touch has no hover) toggles the screenshot.
    else if (e.pointerType !== "mouse" && Math.hypot(dx, dy) < 10 && (e.target as Element).closest("[data-drawing]")) setOn((v) => !v);
  };

  const live = sheet.homepage ?? sheet.repo;
  return (
    <div role="region" aria-roledescription="carousel" aria-label="Projects, one sheet at a time" onKeyDown={onKey}>
      <p className="sr-only" aria-live="polite">
        Sheet {i + 1} of {n}: {sheet.name}
      </p>
      <div
        className={`${s.sheet} relative grid border border-(--hair) p-4 touch-pan-y select-none md:p-5 lg:aspect-[16/10]`}
        onPointerDown={onDown}
        onPointerUp={onUp}
        onPointerCancel={() => (press.current = null)}
      >
        {/* Grid references on the margin: 1–8 across, A–F down. */}
        {(["top-0", "bottom-0"] as const).map((pos) => (
          <div key={pos} aria-hidden className={`absolute inset-x-4 ${pos} grid h-4 grid-cols-8 md:inset-x-5 md:h-5`}>
            {Array.from({ length: 8 }, (_, k) => (
              <span key={k} className="t-mono flex items-center justify-center border-l border-(--hair) text-[9.5px] text-(--accent-brand) first:border-l-0">
                {k + 1}
              </span>
            ))}
          </div>
        ))}
        {(["left-0", "right-0"] as const).map((pos) => (
          <div key={pos} aria-hidden className={`absolute inset-y-4 ${pos} grid w-4 grid-rows-6 md:inset-y-5 md:w-5`}>
            {"ABCDEF".split("").map((l) => (
              <span key={l} className="t-mono flex items-center justify-center border-t border-(--hair) text-[9.5px] text-(--accent-brand) first:border-t-0">
                {l}
              </span>
            ))}
          </div>
        ))}

        <div key={i} className={`${s.appear} grid border border-(--accent-brand) lg:grid-cols-[minmax(0,1fr)_16rem]`}>
          <div className="flex items-center pt-11 pr-3 pb-11 pl-11 md:pr-8 lg:py-14 lg:pr-24 lg:pl-12">
            <div
              data-drawing
              className={`relative aspect-[16/10] w-full border border-(--hair) ${sheet.shot ? `cursor-crosshair ${focus}` : ""}`}
              tabIndex={sheet.shot ? 0 : undefined}
              role="img"
              aria-label={`${sheet.name}, ${sheet.shot ? "traced from a screenshot; hover or focus to see the screenshot" : "no screenshot yet, drawn as a generic layout"}`}
              onPointerEnter={(e) => e.pointerType === "mouse" && setOn(true)}
              onPointerLeave={(e) => e.pointerType === "mouse" && setOn(false)}
              onFocus={() => setOn(true)}
              onBlur={() => setOn(false)}
            >
              <Drawing sheet={sheet} on={on} />
              <Dim side="top">
                <Star size={11} /> {sheet.stars} stars
              </Dim>
              <Dim side="left">{plural(sheet.contributors, "contributor")}</Dim>
              <Dim side="bottom" start={`since ${sheet.since}`} end={`last push ${sheet.pushed}`} />
              {sheet.license && (
                <span className={`${s.leader} top-[14%]`} aria-hidden>
                  <i />
                  {sheet.license}
                </span>
              )}
            </div>
          </div>

          <div className="grid border-t border-(--accent-brand) md:grid-cols-2 lg:grid-cols-1 lg:grid-rows-[1fr_auto] lg:border-t-0 lg:border-l">
            <div className="t-mono px-3 py-3 text-[11px] leading-[1.6] text-(--fg-muted) max-md:hidden md:border-r md:border-(--accent-brand) lg:border-r-0">
              <div className="text-[9.5px] tracking-[0.08em] text-(--fg-subtle) uppercase">Notes</div>
              <ol className="mt-1.5 list-decimal space-y-1 pl-4">
                <li>{sheet.license ? `${sheet.license} licence: free to use and fork.` : "No licence file yet."}</li>
                <li>
                  {plural(sheet.forks, "fork")}, {plural(sheet.issues, "open issue")}
                  {sheet.goodFirst > 0 && `, ${sheet.goodFirst} good first`}.
                </li>
                <li>{sheet.shot ? "Traced from a screenshot. Hover the drawing to see it." : "No screenshot yet: drawn as a generic layout."}</li>
              </ol>
            </div>

            <div className="grid grid-cols-2 border-(--accent-brand) lg:border-t">
              <Cell k="Project" className="col-span-2">
                <span className={`${display} block text-[2rem] [font-family:var(--font-sans)]`}>{sheet.name}</span>
              </Cell>
              <Cell k="Purpose" className="col-span-2">
                <span className="font-sans text-[14px] leading-snug">{sheet.tagline}</span>
              </Cell>
              <Cell k="Sheet" className="border-r">
                {pad(i + 1)} / {pad(n)}
              </Cell>
              <Cell k="Scale">1:1</Cell>
              <Cell k="Language" className="border-r">
                {sheet.language ?? "n/a"}
              </Cell>
              <Cell k="Status">{sheet.status}</Cell>
              <div className="col-span-2 flex flex-wrap gap-2 p-3">
                <LabButton href={`/projects/${sheet.name}`} size="sm">
                  Open project <ArrowRight size="1em" />
                </LabButton>
                <LabButton href={live} variant="secondary" size="sm" target="_blank" rel="noopener noreferrer">
                  {sheet.homepage ? "Live site" : "Source"} <External size="1em" />
                </LabButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flip: previous, the sheet numbers, next. */}
      <div className="mt-3 flex items-stretch gap-2">
        <button type="button" onClick={() => go(i - 1)} aria-label="Previous sheet" className={`grid size-11 shrink-0 place-items-center border border-(--line) text-(--fg) hover:border-(--fg) ${focus}`}>
          <ArrowRight className="rotate-180" />
        </button>
        <div ref={row} className="flex min-w-0 flex-1 overflow-x-auto [scrollbar-width:none]">
          {sheets.map((x, k) => (
            <button
              key={x.name}
              type="button"
              onClick={() => go(k)}
              aria-label={`Sheet ${k + 1}: ${x.name}`}
              aria-current={k === i ? "true" : undefined}
              className={`t-mono flex min-w-11 flex-1 flex-col items-center justify-center border-y border-l border-(--line) px-1 text-[11px] last:border-r ${
                k === i ? "bg-(--accent) text-(--accent-fg)" : "text-(--fg-muted) hover:text-(--fg)"
              } ${focus} focus-visible:-outline-offset-2`}
            >
              {pad(k + 1)}
              <span className="max-w-full truncate text-[9.5px] max-xl:hidden">{x.name}</span>
            </button>
          ))}
        </div>
        <button type="button" onClick={() => go(i + 1)} aria-label="Next sheet" className={`grid size-11 shrink-0 place-items-center border border-(--line) text-(--fg) hover:border-(--fg) ${focus}`}>
          <ArrowRight />
        </button>
      </div>
    </div>
  );
}
