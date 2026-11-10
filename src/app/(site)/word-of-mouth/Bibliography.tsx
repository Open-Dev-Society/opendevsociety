"use client";

import { useState } from "react";

export type Kind = "article" | "social" | "community";
export type Ref = {
  n: number;
  kind: Kind;
  author: string;
  /** What they said, quoted; or a plain description when there is nothing to quote. */
  text: string;
  quoted: boolean;
  excerpt?: string;
  outlet: string;
  year?: string;
  href: string;
  re?: { name: string; href: string };
};

const KINDS: [Kind | "all", string][] = [
  ["all", "All"],
  ["article", "Articles"],
  ["social", "Social"],
  ["community", "Community"],
];
const cjk = (s: string) => (/[぀-鿿]/.test(s) ? "zh-Hant" : undefined);

/** Every mention, numbered and filterable by kind. Numbers stay with their entry when filtered. */
export function Bibliography({ refs }: { refs: Ref[] }) {
  const [kind, setKind] = useState<Kind | "all">("all");
  const shown = kind === "all" ? refs : refs.filter((r) => r.kind === kind);

  return (
    <>
      <div role="group" aria-label="Filter mentions by kind" className="flex w-fit flex-wrap gap-px bg-(--line) p-px max-sm:grid max-sm:w-full max-sm:grid-cols-2">
        {KINDS.map(([k, label]) => {
          const on = k === kind;
          return (
            <button
              key={k}
              type="button"
              aria-pressed={on}
              onClick={() => setKind(k)}
              className={`min-h-10 px-3.5 font-mono text-[13px] transition-colors duration-(--d-2) ease-(--ease-ui) focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--focus) ${
                on ? "bg-(--fg) text-(--bg)" : "bg-(--bg) text-(--fg-muted) hover:text-(--fg)"
              }`}
            >
              {label}
              <span className={`ml-2 tabular-nums ${on ? "" : "text-(--fg-subtle)"}`}>{k === "all" ? refs.length : refs.filter((r) => r.kind === k).length}</span>
            </button>
          );
        })}
      </div>

      <ol className="mt-8 border-t border-(--fg)" aria-live="polite">
        {shown.map((r) => (
          <li
            key={r.href}
            id={`cite-${r.n}`}
            className="grid scroll-mt-24 grid-cols-[2.75rem_minmax(0,1fr)] gap-y-2 border-b border-(--line) py-5 md:grid-cols-[3.5rem_minmax(0,1fr)_11rem] md:gap-x-6"
          >
            <span className="font-mono text-[13px] leading-[1.75] text-(--fg)">[{r.n}]</span>
            <div className="min-w-0 text-[16px] leading-[1.6] text-(--fg-muted)">
              <span className="font-[650] text-(--fg)">{r.author.replace(/\.$/, "")}.</span>{" "}
              <a href={r.href} target="_blank" rel="noopener noreferrer" className="text-(--fg) decoration-(--accent) underline-offset-[0.2em] hover:underline">
                <span lang={cjk(r.text)}>{r.quoted ? <>&ldquo;{r.text}&rdquo;</> : r.text}</span>
              </a>{" "}
              <span className="whitespace-nowrap">
                {r.outlet}
                {r.year && <>, {r.year}</>}.{" "}
                <span aria-hidden className="text-(--accent)">
                  ↗
                </span>
              </span>
              {r.excerpt && (
                <p lang={cjk(r.excerpt)} className="mt-2 border-l border-(--line) pl-3 text-[14px] leading-[1.55] text-(--fg-muted)">
                  {r.excerpt}
                </p>
              )}
            </div>
            <p className="t-mono col-start-2 text-[12px] text-(--fg-subtle) md:col-start-3 md:text-right md:leading-[2]">
              {r.kind}
              {r.re && (
                <>
                  {" · "}
                  <a href={r.re.href} className="text-(--fg-muted) hover:text-(--accent)">
                    on {r.re.name}
                  </a>
                </>
              )}
            </p>
          </li>
        ))}
      </ol>
    </>
  );
}
