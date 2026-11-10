"use client";

import { useState } from "react";
import { Ledger, SegmentedControl, type LedgerColumn } from "@/components/site";

export type Kind = "article" | "social" | "community";
export type MentionRow = { kind: Kind; outlet: string; author: string; title: string; year?: string; href: string };

const columns: LedgerColumn[] = [
  { key: "outlet", label: "Source", width: "9rem" },
  { key: "author", label: "Author", width: "11rem" },
  { key: "title", label: "What they wrote" },
  { key: "year", label: "Year", width: "3.5rem", mono: true },
  { key: "go", label: "", width: "1rem", align: "end" },
];

/** Every mention, filterable by kind: All · Articles · Social · Community. */
export function MentionLedger({ mentions }: { mentions: MentionRow[] }) {
  const [kind, setKind] = useState<Kind | "all">("all");
  const count = (k: Kind) => mentions.filter((m) => m.kind === k).length;
  const shown = kind === "all" ? mentions : mentions.filter((m) => m.kind === kind);

  return (
    <>
      <SegmentedControl
        label="Filter mentions"
        value={kind}
        onChange={setKind}
        options={(
          [
            ["all", "All", mentions.length],
            ["article", "Articles", count("article")],
            ["social", "Social", count("social")],
            ["community", "Community", count("community")],
          ] as const
        ).map(([value, label, n]) => ({
          value,
          // Counts drop below 640 so all four fit at 375 without scrolling.
          label: (
            <>
              {label}
              <span className="ml-1.5 font-mono text-xs tabular-nums text-(--fg-subtle) max-sm:hidden">{n}</span>
            </>
          ),
        }))}
      />
      <Ledger
        className="mt-8"
        caption="Every mention"
        columns={columns}
        rows={shown.map((m) => ({
          key: m.href,
          cells: {
            outlet: <span className="t-meta">{m.outlet}</span>,
            author: <span className="sign text-(--fg)">{m.author}</span>,
            title: (
              <a href={m.href} target="_blank" rel="noopener noreferrer" className="text-(--fg) transition-colors duration-(--d-2) hover:text-(--accent)">
                {m.title}
                <span className="md:hidden"> ↗</span>
              </a>
            ),
            year: <span className="tabular-nums">{m.year}</span>,
            go: (
              <span aria-hidden className="max-md:hidden">
                ↗
              </span>
            ),
          },
        }))}
      />
    </>
  );
}
