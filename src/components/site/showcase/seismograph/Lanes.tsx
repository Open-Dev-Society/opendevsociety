"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { compact } from "@/lib/format";
import { labDate } from "@/lib/lab";
import { sizedAvatar } from "../../Avatar";
import { display, focus, label } from "../../home/ui";
import { ArrowRight, Star } from "../../Icon";
import { Dither } from "../../lab/Dither";
import { labButton } from "../../lab-hero/LabButton";
import { Container } from "../../Section";
import s from "./seismograph.module.css";
import { byActivity, byStars, drawTrace, monthTicks, rgb, seedOf } from "./trace";

export type Lane = {
  name: string;
  href: string;
  stars: number;
  status: "active" | "quiet" | "archived";
  tagline: string;
  shot?: string;
  contributors: { login: string; avatar: string }[];
  /** Commits per week, the shared 52-week grid, oldest first. */
  weeks: number[];
};
type Sort = "activity" | "stars";

const WEEK = 7 * 864e5;
const MOBILE = "(max-width: 767px)";
const subscribe = (cb: () => void) => {
  const m = matchMedia(MOBILE);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
/** Phones get the last 26 weeks (and no cursor line); the server renders the desktop view. */
const useMobile = () => useSyncExternalStore(subscribe, () => matchMedia(MOBILE).matches, () => false);
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

/** A full-width box slid to week `w` by `translate` (so the cursor never counts as a layout shift); its left edge is the cursor. Clip its parent. */
const At = ({ w, className = "", children }: { w: number; className?: string; children?: React.ReactNode }) => (
  <span aria-hidden className={`pointer-events-none absolute inset-0 ${className}`} style={{ translate: `${((w + 0.5) / 52) * 100}%` }}>
    {children}
  </span>
);

/** Lane i's slot when lane o is open (-1: none), as the CSS variables seismograph.module.css places it with. */
const slot = (i: number, o: number) =>
  (o < 0
    ? { "--y": `calc(${i} * var(--idle))`, "--h": "var(--idle)", "--t": "calc((var(--idle) - var(--lc)) / 2)" }
    : {
        "--y": i <= o ? `calc(${i} * var(--lc))` : `calc(${i - 1} * var(--lc) + var(--le))`,
        "--h": i === o ? "var(--le)" : "var(--lc)",
        "--t": "0px",
      }) as React.CSSProperties;

// Desktop columns: name · trace · stars. Phones: name and stars over a full-width trace.
const cols = "grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 md:grid-cols-[15rem_minmax(0,1fr)_4.5rem] md:gap-x-6";
const traceCol = "md:left-[calc(15rem+1.5rem)] md:right-[calc(4.5rem+1.5rem)]";

function Trace({ weeks, n, max, seed }: { weeks: number[]; n: number; max: number; seed: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const color = rgb(getComputedStyle(c).color);
    const visible = weeks.slice(-n);
    // Fires once on observe, then on every width change.
    const ro = new ResizeObserver(() => drawTrace(c, visible, max, color, seed));
    ro.observe(c);
    return () => ro.disconnect();
  }, [weeks, n, max, seed]);
  return <canvas ref={ref} aria-hidden className="block size-full text-(--accent-brand) [image-rendering:pixelated]" />;
}

function Axis({ weeks, n, week = null, className = "", ref }: { weeks: string[]; n: number; week?: number | null; className?: string; ref?: React.Ref<HTMLDivElement> }) {
  const from = Date.parse(weeks[weeks.length - n]);
  const ticks = monthTicks(from, Date.parse(weeks[weeks.length - 1]) + WEEK);
  return (
    <div className={`${cols} ${className}`}>
      <span className="max-md:hidden" />
      <div ref={ref} data-axis aria-hidden className="relative col-span-2 h-8 border-t border-(--fg) md:col-span-1">
        <span
          className="absolute inset-x-0 top-0 h-1"
          style={{ background: `repeating-linear-gradient(to right, var(--fg-subtle) 0 1px, transparent 1px calc(100% / ${n}))` }}
        />
        {ticks.map((t) => (
          <span key={t.at}>
            <span className="absolute top-0 h-2 w-px bg-(--fg)" style={{ left: `${t.at * 100}%` }} />
            {/* Each month's name starts at its tick; the last one, if there's no room after it, sits flush right. */}
            <span
              className={`t-mono absolute top-3 text-[11px] whitespace-nowrap text-(--fg-muted) ${t.end ? "right-0" : "pl-1"}`}
              style={t.end ? undefined : { left: `${t.at * 100}%` }}
            >
              {t.label}
            </span>
          </span>
        ))}
        {week !== null && (
          <span className="absolute inset-x-0 -top-px bottom-0 overflow-hidden">
            <At w={week} className="border-l border-(--fg)">
              <span
                className={`t-mono absolute bottom-0 bg-(--fg) px-1.5 py-1 text-[11px] leading-none whitespace-nowrap text-(--bg) ${week < 5 ? "" : week > 46 ? "-translate-x-full" : "-translate-x-1/2"}`}
              >
                week of {labDate(weeks[week])}
              </span>
            </At>
          </span>
        )}
      </div>
    </div>
  );
}

/** Tells the screenshot's Dither to develop (or rest coarse) through its [data-develop] wrapper, as ProjectIndex does. */
const develop = (el: Element | null, on: boolean) => el?.dispatchEvent(new PointerEvent(on ? "pointerenter" : "pointerleave"));

function Shot({ lane }: { lane: Lane }) {
  return lane.shot ? (
    <Dither src={lane.shot} alt={`${lane.name}, screenshot`} width={16} height={10} align="top" negative develop className="h-full max-w-full shrink-0" />
  ) : (
    // No screenshot: the name, set large, and what it's for.
    <span className="flex aspect-[16/10] h-full max-w-full shrink-0 flex-col justify-between bg-(--surface-2) p-4">
      <span className={`${display} text-[clamp(2.25rem,1rem+3vw,3.5rem)] break-words text-(--accent)`}>{lane.name}</span>
      <span className="text-[14px] text-(--fg-muted)">{lane.tagline}</span>
    </span>
  );
}

function Detail({ lane, weeks, open }: { lane: Lane; weeks: string[]; open: boolean }) {
  // The lane's pointerenter came before this mounted, so the screenshot develops when its lane opens instead.
  const shot = useRef<HTMLDivElement>(null);
  useEffect(() => void develop(shot.current, open), [open]);
  const total = sum(lane.weeks);
  const peak = lane.weeks.indexOf(Math.max(...lane.weeks));
  const people = lane.contributors.length;
  const facts = [
    `${total} commit${total === 1 ? "" : "s"} in 52 weeks`,
    `${sum(lane.weeks.slice(-8))} in the last 8 weeks`,
    total ? `busiest: ${lane.weeks[peak]}, week of ${labDate(weeks[peak])}` : "no commits this year",
    `${people} contributor${people === 1 ? "" : "s"}`,
  ];
  return (
    <div className={`${s.detail} ${cols} relative z-[2] content-start gap-y-3 bg-(--bg) pt-1 pb-4`}>
      <div className="col-span-2 grid content-start gap-3 md:col-span-1 md:row-start-1">
        <p className="text-[15px] leading-snug text-(--fg-muted) md:text-[16px]">{lane.tagline}</p>
        {people > 0 && (
          <span className="flex items-center gap-1 max-md:hidden">
            {lane.contributors.slice(0, 6).map((c) => (
              <Dither key={c.login} src={sizedAvatar(c.avatar, 24)} alt={c.login} width={1} height={1} tone="duotone" cell={1} className="size-6" />
            ))}
            {people > 6 && <span className="t-mono pl-1 text-[11px] text-(--fg-muted)">+{people - 6}</span>}
          </span>
        )}
      </div>
      <div className="col-span-2 row-start-1 flex h-48 gap-6 md:col-span-1 md:col-start-2 md:h-[14.75rem]">
        <div ref={shot} data-develop className="pointer-events-none h-full shrink-0">
          <Shot lane={lane} />
        </div>
        <div className="flex min-w-0 flex-col justify-between max-md:hidden">
          <ul className="t-mono border-t border-(--line) text-[12px] text-(--fg-muted)">
            {facts.map((f) => (
              <li key={f} className="border-b border-(--line) py-1.5 whitespace-nowrap">
                {f}
              </li>
            ))}
          </ul>
          <span className={labButton("primary", "sm", "self-start")}>
            Open project <ArrowRight size="1em" />
          </span>
        </div>
      </div>
      <span className={labButton("primary", "sm", "col-span-2 justify-self-start md:hidden")}>
        Open project <ArrowRight size="1em" />
      </span>
    </div>
  );
}

/**
 * Every project as one lane of a seismograph: its last 52 weeks of commits as a 1-bit trace.
 * Pointer: a cursor line reads one week across every lane; resting on a lane opens it. Keyboard: focus opens it.
 * Touch: the first tap opens a lane, the next one follows its link.
 */
export function Lanes({ lanes, weeks }: { lanes: Lane[]; weeks: string[] }) {
  const [sort, setSort] = useState<Sort>("activity");
  const [open, setOpen] = useState<string | null>(null);
  // Lanes opened at least once keep their detail mounted (its dithers load on first open, not up front).
  const [seen, setSeen] = useState<ReadonlySet<string>>(() => new Set());
  const [week, setWeek] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const axis = useRef<HTMLDivElement>(null);
  const timer = useRef(0);
  const tops = useRef(new Map<string, number>());
  const mobile = useMobile();
  const n = mobile ? 26 : 52;

  const max = useMemo(() => Math.max(1, ...lanes.flatMap((l) => l.weeks)), [lanes]);
  const ordered = useMemo(() => [...lanes].sort(sort === "activity" ? byActivity : byStars), [lanes, sort]);
  const active = lanes.filter((l) => l.status === "active").length;
  const openAt = ordered.findIndex((l) => l.name === open);

  const show = (name: string | null) => {
    setOpen(name);
    if (name) setSeen((v) => (v.has(name) ? v : new Set(v).add(name)));
  };
  // Hover intent: a short rest before a lane opens, so sweeping across them doesn't churn the stack.
  const later = (name: string | null, ms: number) => {
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => show(name), ms);
  };
  useEffect(() => () => clearTimeout(timer.current), []);

  // The pen: traces stay hidden until the stack scrolls in, then draw once (CSS). Reduced motion: drawn already.
  useEffect(() => {
    const el = root.current!;
    if (reduced()) return;
    el.dataset.pen = "armed";
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.dataset.pen = "go";
        io.disconnect();
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Re-ordering glides each lane from where it was (FLIP).
  const resort = (next: Sort) => {
    if (next === sort) return;
    for (const li of list.current!.children as HTMLCollectionOf<HTMLElement>) tops.current.set(li.dataset.name!, li.getBoundingClientRect().top);
    list.current!.dataset.instant = "";
    setSort(next);
  };
  useLayoutEffect(() => {
    if (!tops.current.size) return;
    const ul = list.current!;
    if (!reduced())
      for (const li of ul.children as HTMLCollectionOf<HTMLElement>) {
        const now = li.getBoundingClientRect().top;
        const d = (tops.current.get(li.dataset.name!) ?? now) - now;
        if (d) li.animate([{ translate: `0 ${d}px` }, { translate: "0 0" }], { duration: 360, easing: "cubic-bezier(0.65, 0, 0.35, 1)" });
      }
    tops.current.clear();
    requestAnimationFrame(() => delete ul.dataset.instant);
  }, [sort]);

  const first = labDate(weeks[weeks.length - n]);
  const last = labDate(new Date(Date.parse(weeks[weeks.length - 1]) + WEEK - 864e5).toISOString());

  return (
    <section aria-labelledby="seismograph-h" className="border-t border-(--line) py-12 md:py-24">
      <Container>
        <p className={`${label} flex justify-between gap-4 border-b border-(--line) pb-3`}>
          <span>
            Projects · {lanes.length} · {active} active
          </span>
          <span className="max-md:hidden">
            Commits per week · {first} – {last}
          </span>
        </p>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-5 md:mt-8">
          <h2 id="seismograph-h" className={`${display} max-w-[14ch] text-[clamp(2.5rem,1rem+5vw,5rem)]`}>
            See which projects are alive.
          </h2>
          <div role="group" aria-label="Order the projects" className="flex shadow-[inset_0_0_0_1px_var(--fg)]">
            {(["activity", "stars"] as const).map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={sort === k}
                onClick={() => resort(k)}
                className={`t-mono h-9 px-3.5 text-[12px] tracking-[0.04em] uppercase transition-colors duration-(--d-2) ${
                  sort === k ? "bg-(--accent) text-(--accent-fg)" : "text-(--fg-muted) hover:text-(--fg)"
                } ${focus}`}
              >
                by {k}
              </button>
            ))}
          </div>
        </div>
        <p className="t-mono mt-3 text-[12px] text-(--fg-subtle) md:hidden">
          Commits per week · last 26 weeks · tap a project to open it
        </p>

        <div
          ref={root}
          className="relative mt-8 md:mt-12"
          onPointerMove={(e) => {
            if (e.pointerType !== "mouse" || mobile) return;
            const r = axis.current!.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width;
            setWeek(x < 0 || x >= 1 ? null : Math.floor(x * 52));
          }}
          onPointerLeave={(e) => {
            if (e.pointerType !== "mouse") return;
            setWeek(null);
            later(null, 240);
          }}
        >
          <ul
            ref={list}
            data-open={open ? "" : undefined}
            className={`${s.stack} box-content border-t border-(--fg)`}
            style={{ "--n": lanes.length } as React.CSSProperties}
          >
            {ordered.map((l, i) => {
              const isOpen = open === l.name;
              const c = week === null ? 0 : l.weeks[week];
              return (
                <li key={l.name} data-name={l.name} data-open={isOpen ? "" : undefined} className={s.lane} style={slot(i, openAt)}>
                  <Link
                    href={l.href}
                    aria-expanded={isOpen}
                    onPointerEnter={(e) => e.pointerType === "mouse" && later(l.name, open ? 90 : 160)}
                    // Keyboard focus opens at once; a tap's focus is left to onClick.
                    onFocus={(e) => {
                      if (!e.currentTarget.matches(":focus-visible")) return;
                      clearTimeout(timer.current);
                      show(l.name);
                    }}
                    onBlur={() => setOpen((o) => (o === l.name ? null : o))}
                    onClick={(e) => {
                      if (isOpen || !matchMedia("(hover: none)").matches) return;
                      e.preventDefault();
                      show(l.name);
                    }}
                    className={`block h-(--h) ${focus} focus-visible:outline-offset-[-2px]`}
                  >
                    <div className={`${s.top} ${cols} content-center items-center gap-y-1`}>
                      <span className="col-start-1 row-start-1 flex min-w-0 items-baseline gap-2.5">
                        <span className={`${display} truncate text-[28px] leading-[1.05] md:text-[32px] ${isOpen ? "text-(--accent)" : ""}`}>
                          {l.name}
                        </span>
                        <span className={`t-mono shrink-0 text-[11px] ${l.status === "active" ? "text-(--accent)" : "text-(--fg-subtle)"}`}>
                          {l.status}
                        </span>
                      </span>
                      <span className="t-mono col-start-2 row-start-1 justify-self-end text-[13px] text-(--fg) md:col-start-3">
                        <Star size="1em" label="Stars" /> {compact(l.stars)}
                      </span>
                      <span className={`${s.trace} relative col-span-2 overflow-hidden row-start-2 h-7 md:col-span-1 md:col-start-2 md:row-start-1 md:h-9`}>
                        <Trace weeks={l.weeks} n={n} max={max} seed={seedOf(l.name)} />
                        <span className="sr-only">
                          {sum(l.weeks)} commits in the last 52 weeks, {sum(l.weeks.slice(-8))} in the last 8.
                        </span>
                        {week !== null && !mobile && (
                          <At w={week}>
                            <span
                              className={`t-mono absolute top-0 bg-(--bg) px-0.5 text-[11px] leading-none ${week > 46 ? "-translate-x-[calc(100%+4px)]" : "translate-x-1"} ${c ? "text-(--fg)" : "text-(--fg-subtle)"}`}
                            >
                              {c}
                            </span>
                          </At>
                        )}
                      </span>
                    </div>
                    {seen.has(l.name) && <Detail lane={l} weeks={weeks} open={isOpen} />}
                  </Link>
                  <span aria-hidden className={s.rule} />
                  {/* This lane's piece of the cursor line: the whole lane, or just its trace row when open. */}
                  {week !== null && !mobile && (
                    <span className={`pointer-events-none absolute inset-x-0 top-0 overflow-hidden ${traceCol}`} style={{ height: isOpen ? "var(--lc)" : "var(--h)" }}>
                      <At w={week} className="border-l border-(--fg)" />
                    </span>
                  )}
                </li>
              );
            })}
          </ul>

          <Axis ref={axis} weeks={weeks} n={52} week={mobile ? null : week} className="max-md:hidden" />
          <Axis weeks={weeks} n={26} className="md:hidden" />

          {/* The recorder's pen, over the trace column on first view. */}
          <div aria-hidden className={`pointer-events-none absolute inset-y-0 right-0 left-0 z-[1] overflow-hidden ${traceCol}`}>
            <span className={`${s.pen} absolute inset-0 border-l border-(--accent-brand)`} />
          </div>
        </div>
      </Container>
    </section>
  );
}
