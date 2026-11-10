"use client";

import { useId, useState } from "react";
import { Dither } from "@/components/site/lab/Dither";
import { Plate } from "@/components/site/lab/Plate";
import { STATUS_MARK, type Status } from "@/lib/lab";
import { STATUS_LABEL } from "./status";
import type { Audience } from "@/data/catalog";

export type LogRow = {
  rank: string;
  name: string;
  url: string;
  tagline: string;
  badge?: string;
  status: Status;
  audience: Audience;
  stars: string;
  contributors: number;
  language: string | null;
  languageColor?: string;
  days: number;
  ago: string;
  date: string;
  shot?: string;
};

// The activity track spans the paused window; running is its last 30 days.
const SPAN = 180;

/** Where the last push sits on a 180-day track (today at the right). Older pushes pin to the left edge. */
function Track({ days }: { days: number }) {
  return (
    <span aria-hidden className="relative block h-3 w-full max-w-28 shadow-[inset_0_-1px_0_var(--line)]">
      {/* The running window, checkered */}
      <span className="absolute inset-y-0 right-0 w-[16.67%] bg-[repeating-conic-gradient(var(--line)_0_25%,transparent_0_50%)] bg-size-[2px_2px]" />
      <span className="absolute inset-y-0 w-0.5 bg-(--fg)" style={{ right: `calc(${(Math.min(days, SPAN) / SPAN) * 100}% - 1px)` }} />
    </span>
  );
}

function Choice<T extends string>({ legend, value, options, onChange }: { legend: string; value: T; options: { v: T; label: string; n: number }[]; onChange: (v: T) => void }) {
  const name = useId();
  return (
    <fieldset className="flex flex-wrap items-center gap-1.5">
      <legend className="t-mono float-left mr-2 text-[12px] text-(--fg-subtle)">{legend}</legend>
      {options.map((o) => (
        <label key={o.v} className="cursor-pointer">
          <input type="radio" name={name} value={o.v} checked={value === o.v} onChange={() => onChange(o.v)} className="peer sr-only" />
          <span className="t-mono inline-flex min-h-8 items-center gap-1.5 px-2.5 text-[12px] text-(--fg-muted) shadow-[inset_0_0_0_1px_var(--line)] transition-colors duration-(--d-2) peer-checked:bg-(--fg) peer-checked:text-(--bg) peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-(--focus) hover:text-(--fg)">
            {o.label} <span className="tabular-nums opacity-70">{o.n}</span>
          </span>
        </label>
      ))}
    </fieldset>
  );
}

const COLS = "lg:grid lg:grid-cols-[2.5rem_minmax(0,1fr)_7.5rem_5.5rem_6.5rem_9.5rem_7.5rem] lg:gap-x-5";

/** Every project: one ruled row each, filterable by status and audience. */
export function Log({ rows }: { rows: LogRow[] }) {
  const [status, setStatus] = useState<Status | "all">("all");
  const [audience, setAudience] = useState<Audience | "all">("all");
  const shown = rows.filter((r) => (status === "all" || r.status === status) && (audience === "all" || r.audience === audience));
  const count = (k: "status" | "audience", v: string) => rows.filter((r) => r[k] === v).length;

  return (
    <div>
      <div className="flex flex-col gap-3 border-b border-(--line) pb-4 md:flex-row md:flex-wrap md:items-center md:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-6">
          <Choice
            legend="status"
            value={status}
            onChange={setStatus}
            options={[
              { v: "all", label: "all", n: rows.length },
              ...(["running", "paused", "archived"] as const).map((s) => ({ v: s, label: `${STATUS_MARK[s]} ${STATUS_LABEL[s]}`, n: count("status", s) })),
            ]}
          />
          <Choice
            legend="for"
            value={audience}
            onChange={setAudience}
            options={[
              { v: "all", label: "all", n: rows.length },
              { v: "everyone", label: "everyone", n: count("audience", "everyone") },
              { v: "builders", label: "developers", n: count("audience", "builders") },
            ]}
          />
        </div>
        <p className="t-mono text-[12px] text-(--fg-subtle)" aria-live="polite">
          showing {shown.length} of {rows.length} projects
        </p>
      </div>

      <div aria-hidden className={`t-mono hidden border-b border-(--fg) py-2 text-[11px] text-(--fg-subtle) uppercase ${COLS}`}>
        <span>#</span>
        <span>Project</span>
        <span>Status</span>
        <span className="text-right">Stars ★</span>
        <span className="text-right">Contributors</span>
        <span>Last push</span>
        <span>Preview</span>
      </div>

      <ol>
        {shown.map((r) => (
          <li
            key={r.name}
            id={r.name}
            data-develop
            className={`group relative grid scroll-mt-24 grid-cols-[minmax(0,1fr)_6rem] gap-x-4 gap-y-2 border-b border-(--line) py-4 transition-colors duration-(--d-2) hover:bg-(--surface-2) target:bg-(--accent-soft) lg:items-center lg:py-3 ${COLS}`}
          >
            <span className="t-mono col-start-1 row-start-1 text-[12px] text-(--fg-subtle) lg:col-auto lg:row-auto lg:text-(--fg)">{r.rank}</span>
            <div className="col-start-1 row-start-2 min-w-0 lg:col-auto lg:row-auto">
              <a href={r.url} className="font-[700] text-(--fg) underline-offset-4 after:absolute after:inset-0 hover:underline focus-visible:outline-none [&:focus-visible]:after:outline-2 [&:focus-visible]:after:outline-(--focus)">
                {r.name}
              </a>
              {r.badge && <span className="t-mono ml-2 text-[11px] text-(--mark-ink)">{r.badge}</span>}
              <span className="mt-0.5 block text-[15px] leading-snug text-(--fg-muted) lg:truncate">{r.tagline}</span>
            </div>
            <span className="col-span-2 row-start-3 flex flex-wrap items-center gap-x-4 gap-y-2 lg:contents">
              <span className="lg:col-auto">
                <Plate tone={r.status === "running" ? "accent" : "plain"}>
                  {STATUS_MARK[r.status]} {STATUS_LABEL[r.status]}
                </Plate>
              </span>
              <span className="t-mono text-[13px] text-(--fg) tabular-nums lg:text-right">
                <span className="text-(--fg-subtle) lg:hidden">★ </span>
                {r.stars}
              </span>
              <span className="t-mono text-[13px] text-(--fg) tabular-nums lg:text-right">
                {r.contributors}
                <span className="text-(--fg-subtle) lg:hidden"> contributors</span>
              </span>
              <span className="t-mono flex min-w-32 flex-col gap-1 text-[12px] text-(--fg-muted)">
                <Track days={r.days} />
                <span>
                  {r.ago} · {r.date}
                </span>
              </span>
            </span>
            <span className="col-start-2 row-span-2 row-start-1 self-start lg:col-auto lg:row-auto lg:self-center">
              {r.shot ? (
                <Dither src={r.shot} negative alt={`${r.name}, screenshot`} width={16} height={10} align="top" cell={1.5} develop className="w-full shadow-[0_0_0_1px_var(--line)]" />
              ) : (
                <span className="t-mono flex aspect-[16/10] w-full items-center justify-center text-[11px] text-(--fg-subtle) shadow-[inset_0_0_0_1px_var(--line)]">
                  {r.language ? (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="size-1.5" style={{ background: r.languageColor ?? "var(--fg-subtle)" }} />
                      {r.language}
                    </span>
                  ) : (
                    "no preview"
                  )}
                </span>
              )}
            </span>
          </li>
        ))}
      </ol>
      {shown.length === 0 && <p className="t-mono border-b border-(--line) py-8 text-[13px] text-(--fg-muted)">No projects match. Clear a filter.</p>}
    </div>
  );
}
