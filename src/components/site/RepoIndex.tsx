"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Audience } from "@/data/catalog";
import { compact } from "@/lib/format";
import { languageColors } from "@/data/catalog";
import { Badge } from "./Card";
import { SegmentedControl } from "./SegmentedControl";
import type { RepoSummary } from "./RepoTile";

export type IndexRepo = RepoSummary & { audience: Audience; goodFirst: number };

type Filter = "all" | Audience;
const audienceLabel: Record<Audience, string> = { everyone: "For everyone", builders: "For builders and agents" };

/**
 * Every tool as hairline rows, filterable by audience. "First issues (n)" shows only when n > 0.
 * Phones show `mobileRows` rows behind a "Show all" button (pass Infinity on the full index).
 */
export function RepoIndex({ repos, mobileRows = 6 }: { repos: IndexRepo[]; mobileRows?: number }) {
  const [filter, setFilter] = useState<Filter>("all");
  // Phones show the first few rows until asked; desktop always shows everything.
  const [expanded, setExpanded] = useState(false);
  const shown = filter === "all" ? repos : repos.filter((r) => r.audience === filter);

  return (
    <div>
      <SegmentedControl<Filter>
        label="Filter tools"
        value={filter}
        onChange={setFilter}
        options={[
          { value: "all", label: "All", count: repos.length },
          { value: "everyone", label: "For everyone", count: repos.filter((r) => r.audience === "everyone").length },
          { value: "builders", label: "For builders and agents", count: repos.filter((r) => r.audience === "builders").length },
        ]}
      />
      <ul className="mt-6 border-t border-(--line)">
        {shown.map((r, i) => (
          <li key={r.name} className={`${!expanded && i >= mobileRows ? "max-lg:hidden " : ""}group relative border-b border-(--line) transition-colors duration-(--d-2) hover:bg-(--surface-2)`}>
            <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-x-3 gap-y-0.5 px-2 py-2.5 lg:min-h-14 lg:grid-cols-[11rem_minmax(0,1fr)_12rem_6.5rem_5.5rem_6.5rem_1rem] lg:gap-x-4 lg:py-2">
              <span className="flex items-center gap-2">
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-(--fg) after:absolute after:inset-0"
                >
                  {r.name}
                </a>
                {r.badge && <Badge>{r.badge}</Badge>}
              </span>
              {/* phones: two lines, name + signal, then the tagline */}
              <span className="t-mono text-(--fg-muted) lg:order-6">
                {r.stars >= 50 ? `★ ${compact(r.stars)}` : `${r.builders} ${r.builders === 1 ? "builder" : "builders"}`}
              </span>
              <ArrowUpRight className="size-4 text-(--fg-subtle) transition-colors duration-(--d-2) group-hover:text-(--fg) lg:order-7" strokeWidth={1.75} />
              <span className="col-span-3 min-w-0 truncate text-sm text-(--fg-muted) lg:order-2 lg:col-span-1 lg:text-[15px]">{r.tagline}</span>
              <span className="t-meta hidden truncate text-(--fg-subtle) lg:order-3 lg:block">{audienceLabel[r.audience]}</span>
              <span className="t-meta hidden items-center gap-1.5 text-(--fg-muted) lg:order-4 lg:inline-flex">
                {r.language && (
                  <>
                    <span className="size-2 rounded-full" style={{ background: languageColors[r.language] ?? "var(--fg-subtle)" }} />
                    {r.language}
                  </>
                )}
              </span>
              <span className="t-mono hidden text-(--fg-muted) lg:order-5 lg:block">{r.pushedAgo}</span>
            </div>
            {r.goodFirst > 0 && (
              <a
                href={`${r.url}/issues?q=${encodeURIComponent('is:issue is:open label:"good first issue"')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="t-meta relative z-10 -mt-1 mb-2 ml-2 inline-block text-(--accent) hover:underline"
              >
                First issues ({r.goodFirst})
              </a>
            )}
          </li>
        ))}
      </ul>
      {!expanded && shown.length > mobileRows && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-4 inline-flex h-11 items-center rounded-full px-1 text-[15px] font-medium text-(--fg) hover:text-(--accent) lg:hidden"
        >
          Show all {shown.length}
        </button>
      )}
    </div>
  );
}
