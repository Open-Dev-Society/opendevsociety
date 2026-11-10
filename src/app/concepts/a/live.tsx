"use client";

import { useEffect, useState } from "react";
import { featuredModules } from "@/data/projects";
import { manualContributors } from "@/data/contributors";
import { partners, events } from "@/data/partners";
import { mentions } from "@/data/mentions";

type Line = { kind: string; subject: string; detail: string };

// Every line is a real fact from src/data, interleaved so the stream reads like a running process.
const pools: Line[][] = [
  featuredModules.map((m) => ({ kind: "module", subject: m.name, detail: m.tags.join(" · ").toLowerCase() })),
  manualContributors.map((c) => ({ kind: "member", subject: `@${c.login}`, detail: (c.role ?? "contributor").toLowerCase() })),
  mentions.map((m) => ({ kind: "press", subject: m.author.split(" at ").pop()!.split(" via ").pop()!, detail: m.source })),
  [
    ...partners.map((p) => ({ kind: "partner", subject: p.name, detail: `${p.type} partner` })),
    ...events.map((e) => ({ kind: "event", subject: e.name, detail: `${e.role.toLowerCase()} · ${e.date}` })),
  ],
];
const STREAM: Line[] = [];
for (let i = 0; STREAM.length < pools.reduce((n, p) => n + p.length, 0); i++)
  for (const p of pools) if (p[i]) STREAM.push(p[i]);

const VISIBLE = 9;
const pad = (n: number) => String(n).padStart(4, "0");

export function ActivityLog() {
  const [count, setCount] = useState(VISIBLE);
  const [clock, setClock] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setClock(new Date().toISOString().slice(11, 19));
    tick();
    const clockId = setInterval(tick, 1000);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return () => clearInterval(clockId);
    const logId = setInterval(() => setCount((c) => c + 1), 2400);
    return () => {
      clearInterval(clockId);
      clearInterval(logId);
    };
  }, []);

  const lines = Array.from({ length: VISIBLE }, (_, i) => {
    const seq = count - VISIBLE + i;
    return { seq, ...STREAM[seq % STREAM.length] };
  });

  return (
    <div className="rounded-xl bg-white/[0.03] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.08)]">
      <div className="flex items-center justify-between gap-4 px-4 py-3 text-[11px] text-zinc-500 shadow-[inset_0_-1px_0_rgb(255_255_255/0.06)]">
        <span className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-[var(--acc)] motion-safe:animate-pulse" />
          ods tail --follow society.log
        </span>
        <span className="tabular-nums">{clock ? `${clock} utc` : "--:--:-- utc"}</span>
      </div>
      <ol aria-live="off" className="flex h-[17.5rem] flex-col justify-end overflow-hidden px-4 py-3 text-[12px] leading-7">
        {lines.map((l) => (
          <li key={l.seq} className="a-line grid grid-cols-[3.25rem_4.5rem_minmax(0,1fr)] gap-x-2 whitespace-nowrap">
            <span className="tabular-nums text-zinc-600">{pad(l.seq)}</span>
            <span className={l.kind === "module" ? "text-[var(--acc)]" : "text-zinc-500"}>{l.kind}</span>
            <span className="truncate text-zinc-300">
              {l.subject} <span className="text-zinc-600">{l.detail}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function KeyNav({ ids }: { ids: string[] }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if ((e.target as HTMLElement).closest("input, textarea, select, [contenteditable]")) return;
      const id = e.key === "0" ? "top" : ids[Number(e.key) - 1];
      if (!id) return;
      e.preventDefault();
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ids]);
  return null;
}

const ROLES = [
  { flag: "code", name: "Code Ops", who: "Developers, Engineers, Innovators", tasks: ["Fix bugs or implement features", "Review pull requests", "Improve performance & security"], label: "good first issue" },
  { flag: "write", name: "Content Ops", who: "Writers, Editors, Documentarians", tasks: ["Write documentation & tutorials", "Create guides and blog posts", "Proofread existing content"], label: "documentation" },
  { flag: "teach", name: "Education Ops", who: "Educators, Mentors, Trainers", tasks: ["Develop course materials", "Lead workshops & sessions", "Mentor newcomers"], label: "help wanted" },
  { flag: "create", name: "Media Ops", who: "Podcasters, Designers, Creators", tasks: ["Create podcasts & videos", "Design logos & graphics", "Create social media assets"], label: "help wanted" },
  { flag: "organize", name: "Event Ops", who: "Organizers, Facilitators", tasks: ["Organize hackathons & meetups", "Facilitate workshops", "Moderate community channels"], label: "help wanted" },
  { flag: "translate", name: "Global Ops", who: "Translators, Polyglots", tasks: ["Translate docs & sites", "Localize UI elements", "Adapt content for culture"], label: "documentation" },
];

export function RolePicker() {
  const [i, setI] = useState(0);
  const r = ROLES[i];
  const issues = `https://github.com/search?q=org%3AOpen-Dev-Society+is%3Aissue+is%3Aopen+label%3A%22${encodeURIComponent(r.label)}%22&type=issues`;

  return (
    <div className="rounded-xl bg-white/[0.03] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.08)]">
      <div role="tablist" aria-label="Contribution role" className="flex flex-wrap gap-1 p-2 shadow-[inset_0_-1px_0_rgb(255_255_255/0.06)]">
        {ROLES.map((role, j) => (
          <button
            key={role.flag}
            role="tab"
            aria-selected={i === j}
            onClick={() => setI(j)}
            className={`min-h-10 rounded-md px-3 text-[12px] transition-[color,background-color] duration-150 active:scale-[0.96] ${
              i === j ? "bg-white/[0.08] text-zinc-100" : "text-zinc-500 hover:text-zinc-200"
            }`}
          >
            --{role.flag}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="space-y-5 p-5 text-[13px] leading-6">
        <p className="text-zinc-500">
          <span className="text-[var(--acc)]">$</span> ods contribute --{r.flag}
        </p>
        <p className="text-zinc-300">
          <span className="text-zinc-100">{r.name}</span> <span className="text-zinc-600">·</span> for {r.who.toLowerCase()}
        </p>
        <ol className="space-y-1 text-zinc-400">
          {r.tasks.map((t, n) => (
            <li key={t} className="flex gap-3">
              <span className="text-zinc-600 tabular-nums">{n + 1}.</span>
              {t}
            </li>
          ))}
        </ol>
        <p className="text-zinc-500">
          start with issues labelled <span className="text-zinc-200">&quot;{r.label}&quot;</span>
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <a href={issues} target="_blank" rel="noreferrer" className="a-btn a-btn-primary">
            find an issue ↗
          </a>
          <a href="https://discord.gg/9xywA3pj" target="_blank" rel="noreferrer" className="a-btn">
            join discord ↗
          </a>
        </div>
      </div>
    </div>
  );
}
