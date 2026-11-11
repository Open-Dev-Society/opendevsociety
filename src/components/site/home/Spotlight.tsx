"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { compact } from "@/lib/format";
import { STATUS_MARK, type Status } from "@/lib/lab";
import { LabButton } from "../lab-hero/LabButton";
import { display, ext, focus } from "./ui";
import { ArrowRight, External, Star } from "../Icon";

export type SpotRow = {
  name: string;
  tagline: string;
  stars: number;
  contributors: number;
  language: string | null;
  status: Status;
  /** Screenshot of the live site; only projects whose homepage answers have one. */
  shot?: string;
  /** The live site, when it answers. */
  homepage: string | null;
  repo: string;
  /** Commits per week, last 52, oldest first. */
  weeks: number[];
};

const DWELL = 6000;
const PLAIN: Record<Status, string> = { running: "active", paused: "quiet", archived: "archived" };
const media = (q: string) => typeof matchMedia !== "undefined" && matchMedia(q).matches;
const host = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");
const QUIET = ["(prefers-reduced-motion: reduce)", "(hover: none)"];
/** Auto-advance only on pointer devices without reduced motion; false on the server and in the first paint. */
const subscribe = (cb: () => void) => {
  const qs = QUIET.map((q) => matchMedia(q));
  qs.forEach((q) => q.addEventListener("change", cb));
  return () => qs.forEach((q) => q.removeEventListener("change", cb));
};
const canAuto = () => !QUIET.some(media);
const plate = "t-mono inline-flex items-center gap-1.5 px-2 py-1 text-[12px] shadow-[inset_0_0_0_1px_var(--line)]";

/** No screenshot: the name set large on paper, its purpose, and the last 52 weeks of commits as a dithered strip. */
function Fallback({ row }: { row: SpotRow }) {
  const max = Math.max(1, ...row.weeks);
  const total = row.weeks.reduce((a, b) => a + b, 0);
  return (
    <div className="absolute inset-0 flex flex-col justify-between gap-4 p-5 md:p-8">
      <p className="t-mono text-[12px] text-(--fg-muted)">{row.tagline}</p>
      <p className={`${display} text-[clamp(3rem,1rem+8vw,8rem)] text-(--accent)!`}>{row.name}</p>
      <div>
        <div aria-hidden className="flex h-12 items-end gap-px md:h-16">
          {row.weeks.map((n, i) => (
            <span
              key={i}
              className="flex-1 bg-[repeating-conic-gradient(var(--accent-brand)_0_25%,transparent_0_50%)] bg-size-[4px_4px]"
              style={{ height: `${n ? Math.max(6, (n / max) * 100) : 2}%` }}
            />
          ))}
        </div>
        <p className="t-mono mt-2 text-[11px] text-(--fg-muted)">
          {total} commit{total === 1 ? "" : "s"} · last 52 weeks
        </p>
      </div>
    </div>
  );
}

/**
 * The projects as a spotlight: one on the stage, the rest in a tab list beside it. The current tab's progress line
 * fills over DWELL, then the stage moves on. Pointer or focus inside pauses it; reduced motion and touch never auto-advance.
 */
export function Spotlight({ rows, total }: { rows: SpotRow[]; total: number }) {
  const [cur, setCur] = useState(0);
  // Indices whose shots may load: the current one, the next one and every one already shown.
  const [seen, setSeen] = useState(() => new Set([0]));
  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [stopped, setStopped] = useState(false);
  const auto = useSyncExternalStore(subscribe, canAuto, () => false);
  const [byUser, setByUser] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const anim = useRef<Animation | null>(null);
  const n = rows.length;
  const paused = !auto || stopped || hover || focused || !visible;

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.25 });
    io.observe(root.current!);
    return () => io.disconnect();
  }, []);

  // Load the current shot and prefetch the next once the section is on screen.
  const next = (cur + 1) % n;
  if (visible && !(seen.has(cur) && seen.has(next))) setSeen(new Set([...seen, cur, next]));

  // The progress line: a Web Animation on the current tab's bar, so pausing holds it where it is.
  useEffect(() => {
    if (!auto || stopped) return;
    const a = bars.current[cur]!.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], { duration: DWELL, easing: "linear" });
    a.pause();
    a.onfinish = () => {
      setByUser(false);
      setCur((c) => (c + 1) % n);
    };
    anim.current = a;
    return () => a.cancel();
  }, [cur, auto, stopped, n]);
  useEffect(() => {
    if (paused) anim.current?.pause();
    else anim.current?.play();
  }, [paused, cur]);

  // On narrow screens the list is a horizontal strip: keep the current chip in view without scrolling the page.
  useEffect(() => {
    const l = list.current!,
      t = tabs.current[cur]!;
    if (l.scrollWidth > l.clientWidth) l.scrollTo({ left: t.offsetLeft - 16, behavior: media("(prefers-reduced-motion: reduce)") ? "auto" : "smooth" });
  }, [cur]);

  const pick = (i: number) => {
    setByUser(true);
    setCur(i);
  };
  const onKey = (e: React.KeyboardEvent) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    const to = step ? (cur + step + n) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : null;
    if (to === null) return;
    e.preventDefault();
    pick(to);
    tabs.current[to]!.focus();
  };

  return (
    <div
      ref={root}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHover(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setFocused(false)}
      className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:gap-10 lg:gap-14"
    >
      {/* The stage: every panel in one grid cell, so the tallest sets the height and switching never shifts the page. */}
      <div className="grid min-w-0">
        {rows.map((r, i) => {
          const url = r.homepage ?? r.repo;
          return (
            <div
              key={r.name}
              id={`spot-panel-${i}`}
              role="tabpanel"
              aria-labelledby={`spot-tab-${i}`}
              inert={i !== cur}
              className={`col-start-1 row-start-1 min-w-0 transition-[opacity,visibility] duration-[250ms] ease-(--ease-ui) motion-reduce:transition-none ${i === cur ? "visible opacity-100" : "invisible opacity-0"}`}
            >
              <figure className="shadow-[0_0_0_1px_var(--line)]">
                <figcaption className="t-mono flex h-9 items-center gap-3 border-b border-(--line) px-3 text-[12px] text-(--fg-muted)">
                  <span aria-hidden className="flex gap-1">
                    <span className="size-1.5 bg-(--line)" />
                    <span className="size-1.5 bg-(--line)" />
                    <span className="size-1.5 bg-(--line)" />
                  </span>
                  <span className="min-w-0 flex-1 truncate">{host(url)}</span>
                  <a href={url} {...ext} className={`-mr-1 p-1 text-(--fg) hover:text-(--accent) ${focus}`}>
                    <External size="1em" label={`${r.name}, ${r.homepage ? "live site" : "repository"} (new tab)`} />
                  </a>
                </figcaption>
                <div className="relative aspect-[16/10] overflow-hidden bg-(--bg)">
                  {r.shot ? (
                    seen.has(i) && (
                      <Image
                        src={r.shot}
                        alt={`${r.name}, its live site`}
                        fill
                        sizes="(min-width: 768px) 66vw, 100vw"
                        className="object-cover object-top"
                      />
                    )
                  ) : (
                    <Fallback row={r} />
                  )}
                </div>
              </figure>

              <div className="mt-6 grid gap-4" aria-live={i === cur && byUser ? "polite" : "off"}>
                <h3 className={`${display} text-[clamp(2.5rem,1rem+4vw,4.5rem)]`}>{r.name}</h3>
                <p className="max-w-[52ch] text-[17px] text-(--fg-muted)">{r.tagline}</p>
                <ul className="flex flex-wrap gap-2 text-(--fg)">
                  <li className={plate}>
                    <Star size="1em" label="Stars" /> {compact(r.stars)}
                  </li>
                  <li className={plate}>
                    {r.contributors} contributor{r.contributors === 1 ? "" : "s"}
                  </li>
                  {r.language && <li className={plate}>{r.language}</li>}
                  <li className={`${plate} ${r.status === "running" ? "text-(--accent)" : "text-(--fg-muted)"}`}>
                    <span aria-hidden>{STATUS_MARK[r.status]}</span> {PLAIN[r.status]}
                  </li>
                </ul>
                <div className="mt-2 flex flex-wrap gap-3">
                  <LabButton href={`/projects/${r.name}`} size="md" className="max-sm:flex-1">
                    Open project <ArrowRight size="1em" />
                  </LabButton>
                  {r.homepage && (
                    <LabButton href={r.homepage} variant="secondary" size="md" className="max-sm:flex-1" {...ext}>
                      Live site <External size="1em" />
                    </LabButton>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* The list: name and stars, most first. Vertical beside the stage; a strip of chips under it on phones. */}
      <div className="min-w-0 max-md:-mx-(--gutter)">
        <div
          ref={list}
          role="tablist"
          aria-label="Projects, most stars first"
          aria-orientation="vertical"
          onKeyDown={onKey}
          className="flex gap-2 overflow-x-auto px-(--gutter) [scrollbar-width:none] md:flex-col md:gap-0 md:overflow-visible md:border-t md:border-(--fg) md:px-0"
        >
          {rows.map((r, i) => (
            <button
              key={r.name}
              ref={(el) => void (tabs.current[i] = el)}
              id={`spot-tab-${i}`}
              type="button"
              role="tab"
              aria-selected={i === cur}
              aria-controls={`spot-panel-${i}`}
              tabIndex={i === cur ? 0 : -1}
              onClick={() => pick(i)}
              onPointerEnter={(e) => e.pointerType === "mouse" && i !== cur && pick(i)}
              className={`group relative flex shrink-0 items-baseline justify-between gap-4 py-3 text-left max-md:px-3 max-md:shadow-[inset_0_0_0_1px_var(--line)] md:border-b md:border-(--line) md:pl-4 ${focus} focus-visible:-outline-offset-2 ${i === cur ? "max-md:shadow-[inset_0_0_0_1px_var(--accent)]" : ""}`}
            >
              {/* The current one's emerald bar. */}
              <span aria-hidden className={`absolute bg-(--accent) max-md:inset-x-0 max-md:top-0 max-md:h-0.5 md:inset-y-0 md:left-0 md:w-0.5 ${i === cur ? "" : "hidden"}`} />
              <span className={`t-mono text-[14px] md:text-[15px] ${i === cur ? "text-(--accent)" : "text-(--fg) group-hover:text-(--accent)"}`}>{r.name}</span>
              <span className="t-mono text-[12px] text-(--fg-muted)">
                <span className="sr-only">Stars: </span>
                <span aria-hidden>★ </span>
                {compact(r.stars)}
              </span>
              {/* Fills over DWELL while it is current, then the stage moves on. */}
              <span
                ref={(el) => void (bars.current[i] = el)}
                aria-hidden
                className={`absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-(--accent) md:left-4 ${i === cur && auto && !stopped ? "" : "hidden"}`}
              />
            </button>
          ))}
        </div>
        <div className="t-mono mt-4 flex items-center justify-between gap-4 px-(--gutter) text-[13px] md:px-0">
          <Link href="/projects" className={`inline-flex items-center gap-1.5 text-(--fg) underline-offset-4 hover:text-(--accent) hover:underline ${focus}`}>
            All {total} projects <ArrowRight size="1em" />
          </Link>
          {auto && (
            <button type="button" onClick={() => setStopped((s) => !s)} className={`text-(--fg-muted) hover:text-(--fg) ${focus}`}>
              {stopped ? "Play" : "Pause"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
