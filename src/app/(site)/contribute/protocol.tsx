"use client";

import { useState } from "react";
import { isValidHandle, useHandle } from "@/lib/handle";

export type Experiment = { id: string; name: string; language: string | null; open: number; goodFirst: number };
type Mode = "terminal" | "agent";

const ORG = "Open-Dev-Society";
const stamp = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });

/** A hand-crossed box: a real checkbox under a mono "[ ]" / "[×]". The time it was ticked is written beside it, like a run sheet. */
function Tick({ label, at, onChange, children }: { label: string; at?: string; onChange: (on: boolean) => void; children?: React.ReactNode }) {
  return (
    <label className="group/tick flex min-h-11 cursor-pointer items-baseline gap-3 py-2.5 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-(--focus)">
      <input type="checkbox" className="sr-only" checked={!!at} onChange={(e) => onChange(e.target.checked)} />
      <span aria-hidden className={`t-mono shrink-0 ${at ? "text-(--accent)" : "text-(--fg-subtle) group-hover/tick:text-(--fg)"}`}>
        [{at ? "×" : " "}]
      </span>
      <span className="min-w-0 flex-1">
        <span className={`text-(--fg) ${at ? "line-through decoration-(--fg-subtle) decoration-1" : ""}`}>{label}</span>
        {children}
      </span>
      <span className="t-mono w-11 shrink-0 text-right text-[11px] text-(--fg-subtle)">{at}</span>
    </label>
  );
}

function useTicks() {
  const [ticks, setTicks] = useState<Record<string, string>>({});
  const set = (k: string) => (on: boolean) =>
    setTicks((t) => {
      const next = { ...t };
      if (on) next[k] = stamp();
      else delete next[k];
      return next;
    });
  return [ticks, set] as const;
}

/** §2. Local state only: nothing leaves the page. */
export function Materials({ items }: { items: { label: string; note: React.ReactNode }[] }) {
  const [ticks, set] = useTicks();
  const n = Object.keys(ticks).length;
  return (
    <div>
      <ul className="divide-y divide-(--line) border-y border-(--line)">
        {items.map((m) => (
          <li key={m.label}>
            <Tick label={m.label} at={ticks[m.label]} onChange={set(m.label)}>
              <span className="mt-0.5 block text-[15px] text-(--fg-muted)">{m.note}</span>
            </Tick>
          </li>
        ))}
      </ul>
      <p className="t-mono mt-3 text-[12px] text-(--fg-subtle)" aria-live="polite">
        {n === items.length ? "All materials at hand. Proceed to §3." : `${n} of ${items.length} at hand`}
      </p>
    </div>
  );
}

function CopyText({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          // clipboard blocked: the text stays selectable
        }
      }}
      className="t-mono min-h-9 shrink-0 px-2.5 text-[12px] text-(--fg-muted) shadow-[inset_0_0_0_1px_var(--line)] transition-colors duration-(--d-2) hover:bg-(--fg) hover:text-(--bg)"
    >
      <span aria-live="polite">{copied ? "copied" : "copy"}</span>
      <span className="sr-only"> command</span>
    </button>
  );
}

/** "your words go here": rose, because it's yours. */
const Yours = ({ children }: { children: React.ReactNode }) => <span className="text-(--mark-ink)">{children}</span>;

type Step = { title: string; note?: React.ReactNode; cmd?: { text: string; view: React.ReactNode } };

function steps(mode: Mode, x: Experiment, you: string): Step[] {
  const branch = `${you}/first-pr`;
  if (mode === "agent") {
    const label = x.goodFirst > 0 ? `"good first issue"` : `"good first issue" or "help wanted"`;
    const prompt = `Fork ${ORG}/${x.name}, read its README and CONTRIBUTING, pick one open issue labelled ${label}, fix it on a branch named ${branch}, and open a draft pull request that explains the change.`;
    return [
      {
        title: "Give your agent the protocol.",
        note: "Paste into any coding agent (Claude Code, Codex, Cursor…) in an empty folder.",
        cmd: {
          text: prompt,
          view: (
            <>
              Fork {ORG}/<Yours>{x.name}</Yours>, read its README and CONTRIBUTING, pick one open issue labelled {label}, fix it on a branch named{" "}
              <Yours>{branch}</Yours>, and open a draft pull request that explains the change.
            </>
          ),
        },
      },
      { title: "Read the diff before it's pushed.", note: "You are the author; the agent is the instrument. If you can't explain a line, ask it to." },
      { title: "Run the project and check the fix by hand.", note: "The README says how. A screenshot in the PR helps the reviewer." },
      { title: "Answer review yourself.", note: "Comments are for you, not the agent. Push fixes to the same branch." },
    ];
  }
  const list = `gh issue list --repo ${ORG}/${x.name}${x.goodFirst > 0 ? ` --label "good first issue"` : ""}`;
  return [
    {
      title: "Fork and clone the experiment.",
      cmd: {
        text: `gh repo fork ${ORG}/${x.name} --clone`,
        view: (
          <>
            gh repo fork {ORG}/<Yours>{x.name}</Yours> --clone
          </>
        ),
      },
      note: "Without the GitHub CLI: Fork on github.com, then git clone your copy.",
    },
    {
      title: "Choose one open issue and say you're on it.",
      cmd: { text: list, view: list },
      note: "Comment on the issue so nobody doubles up. Small is good.",
    },
    {
      title: "Branch.",
      cmd: {
        text: `cd ${x.name} && git switch -c ${branch}`,
        view: (
          <>
            cd {x.name} && git switch -c <Yours>{branch}</Yours>
          </>
        ),
      },
    },
    {
      title: "Make the change, then commit it.",
      cmd: {
        text: `git add -A && git commit -m "Fix #<issue>: <what changed>"`,
        view: (
          <>
            git add -A && git commit -m &quot;Fix #<Yours>&lt;issue&gt;</Yours>: <Yours>&lt;what changed&gt;</Yours>&quot;
          </>
        ),
      },
      note: "Run the project first and check the fix by hand. The README says how.",
    },
    {
      title: "Push and open a draft pull request.",
      cmd: {
        text: `git push -u origin ${branch} && gh pr create --draft --fill`,
        view: (
          <>
            git push -u origin <Yours>{branch}</Yours> && gh pr create --draft --fill
          </>
        ),
      },
      note: "Say what you changed and why, and link the issue.",
    },
  ];
}

/** §3: pick the experiment, pick the instrument (terminal or agent), work down the steps. */
export function Procedure({ experiments }: { experiments: Experiment[] }) {
  const [handle, setHandle] = useHandle();
  const [draft, setDraft] = useState<string | null>(null);
  const [pick, setPick] = useState(experiments[0]?.name);
  const [mode, setMode] = useState<Mode>("terminal");
  const [ticks, set] = useTicks();
  const x = experiments.find((e) => e.name === pick) ?? experiments[0];
  const you = handle ?? "you";
  const bad = !!draft && !isValidHandle(draft);
  const list = x ? steps(mode, x, you) : [];
  const done = list.filter((_, i) => ticks[`${mode}-${i}`]).length;

  return (
    <div className="grid gap-y-10">
      {/* The run sheet's blanks: who is operating, on which experiment, with which instrument. */}
      <div className="grid gap-px bg-(--line) shadow-[0_0_0_1px_var(--line)] sm:grid-cols-[minmax(0,1fr)_auto]">
        <label className="flex min-h-13 items-center gap-3 bg-(--bg) px-4">
          <span className="t-mono shrink-0 text-[11px] tracking-[0.08em] text-(--fg-subtle) uppercase">Operator</span>
          <span className="t-mono text-(--mark-ink)">@</span>
          <input
            value={draft ?? handle ?? ""}
            onChange={(e) => {
              const v = e.target.value.trim();
              setDraft(v);
              setHandle(v && isValidHandle(v) ? v : null);
            }}
            placeholder="your GitHub handle"
            autoComplete="username"
            spellCheck={false}
            aria-label="Your GitHub handle, used in the branch name"
            aria-invalid={bad || undefined}
            className="t-mono -ml-2 min-w-0 flex-1 bg-transparent py-3 text-(--mark-ink) outline-none placeholder:text-(--fg-subtle)"
          />
          {bad && <span className="t-mono shrink-0 text-[11px] text-(--fg-subtle)">not a handle</span>}
        </label>
        <div role="group" aria-label="Instrument" className="flex bg-(--bg)">
          {(["terminal", "agent"] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => setMode(m)}
              className={`t-mono min-h-13 flex-1 px-5 text-[13px] capitalize transition-colors duration-(--d-2) sm:flex-none ${
                mode === m ? "bg-(--fg) text-(--bg)" : "text-(--fg-muted) hover:text-(--fg)"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <fieldset>
        <legend className="t-mono mb-3 text-[12px] text-(--fg-subtle)">3.0 Select one experiment · {experiments.length} have open issues</legend>
        <div className="border-t border-(--fg)">
          {experiments.map((e) => {
            const on = e.name === x?.name;
            return (
              <label
                key={e.name}
                className={`t-mono grid min-h-11 cursor-pointer grid-cols-[2.5ch_7ch_minmax(0,1fr)_auto] items-center gap-x-3 border-b border-(--line) px-2 text-[13px] transition-colors duration-(--d-1) has-focus-visible:outline-2 has-focus-visible:outline-(--focus) sm:grid-cols-[2.5ch_8ch_minmax(0,1fr)_12ch_auto] ${
                  on ? "bg-(--fg) text-(--bg)" : "text-(--fg-muted) hover:bg-(--surface-2)"
                }`}
              >
                <input type="radio" name="experiment" value={e.name} checked={on} onChange={() => setPick(e.name)} className="sr-only" />
                <span aria-hidden>{on ? "●" : "○"}</span>
                <span className={on ? "" : "text-(--fg-subtle)"}>{e.id}</span>
                <span className={`truncate ${on ? "" : "text-(--fg)"}`}>{e.name}</span>
                <span className="max-sm:hidden">{e.language ?? "—"}</span>
                <span className="text-right whitespace-nowrap">
                  {e.open} open{e.goodFirst > 0 && <span className="max-sm:hidden"> · {e.goodFirst} first</span>}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div>
        <p className="t-mono mb-3 flex justify-between gap-4 text-[12px] text-(--fg-subtle)" aria-live="polite">
          <span>
            {x?.id} · {x?.name} · by {mode}
          </span>
          <span>
            {done}/{list.length} done
          </span>
        </p>
        <ol className="border-t border-(--fg)">
          {list.map((s, i) => {
            const k = `${mode}-${i}`;
            return (
              <li key={k} className="grid grid-cols-[3.5ch_minmax(0,1fr)] gap-x-3 border-b border-(--line) py-4 sm:grid-cols-[5ch_minmax(0,1fr)]">
                <span className="t-mono pt-3 text-(--fg-subtle)">3.{i + 1}</span>
                <div className="min-w-0">
                  <Tick label={s.title} at={ticks[k]} onChange={set(k)} />
                  {s.cmd && (
                    <div className="mt-1 flex items-start gap-3 bg-(--surface-2) py-2 pr-2 pl-3">
                      <code className="t-mono min-w-0 flex-1 py-1.5 text-[13px] whitespace-pre-wrap text-(--fg) [overflow-wrap:anywhere]">
                        {mode === "terminal" && <span className="text-(--fg-subtle) select-none">$ </span>}
                        {s.cmd.view}
                      </code>
                      <CopyText text={s.cmd.text} />
                    </div>
                  )}
                  {s.note && <p className="mt-2 max-w-[60ch] text-[15px] text-(--fg-muted)">{s.note}</p>}
                </div>
              </li>
            );
          })}
        </ol>
        {mode === "terminal" && (
          <p className="t-mono mt-3 text-[12px] text-(--fg-subtle)">
            Rose = yours to fill in. Needs the GitHub CLI:{" "}
            <a href="https://cli.github.com" target="_blank" rel="noopener noreferrer" className="ink-link">
              cli.github.com ↗
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
