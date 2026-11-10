"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Copy } from "lucide-react";

const ORG = "https://github.com/Open-Dev-Society";

// Labels from the contribute handbook, each mapped to who it's for.
const labels = [
  { label: "good first issue", who: "Newcomers" },
  { label: "help wanted", who: "Some experience" },
  { label: "documentation", who: "Writers" },
];

const roles = [
  { name: "Code", href: "/contribute#code" },
  { name: "Writing", href: "/contribute#content" },
  { name: "Teaching", href: "/contribute#education" },
  { name: "Media & design", href: "/contribute#media" },
  { name: "Events", href: "/contribute#events" },
];

const issuesUrl = (repo: string, label: string) =>
  `${ORG}/${repo}/issues?q=${encodeURIComponent(`is:issue is:open label:"${label}"`)}`;

export function FirstPR({ repos }: { repos: string[] }) {
  const [repo, setRepo] = useState(repos[0]);
  const [copied, setCopied] = useState(false);

  const commands = [
    `git clone ${ORG}/${repo}.git`,
    `cd ${repo} && git checkout -b fix/your-change`,
    `gh pr create --fill`,
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(commands.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be blocked (insecure origin, permissions); the commands stay selectable.
    }
  }

  const step = "relative pl-12 pb-10 last:pb-0";
  const num =
    "absolute left-0 top-0 grid size-8 place-items-center rounded-full bg-(--card) font-mono text-xs text-(--ink-2) shadow-(--sh) tabular-nums";

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:gap-14">
      <ol className="relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-px before:bg-(--line)">
        <li className={step}>
          <span className={num}>01</span>
          <h3 className="display text-xl font-semibold">Pick a project</h3>
          <p className="mt-1 text-[15px] text-(--ink-2)">Everything below updates for the repo you choose.</p>
          <div className="mt-4 flex flex-wrap gap-2" role="radiogroup" aria-label="Project">
            {repos.map((r) => (
              <button
                key={r}
                type="button"
                role="radio"
                aria-checked={r === repo}
                onClick={() => setRepo(r)}
                className={`rounded-full px-3.5 py-2 text-sm transition-[background-color,color,box-shadow,scale] duration-150 active:scale-[0.96] ${
                  r === repo
                    ? "bg-(--ink) text-(--paper)"
                    : "bg-(--card) text-(--ink-2) shadow-(--sh) hover:text-(--ink)"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </li>

        <li className={step}>
          <span className={num}>02</span>
          <h3 className="display text-xl font-semibold">Say hi</h3>
          <p className="mt-1 text-[15px] text-(--ink-2)">
            Tell us what you want to work on. Someone from the crew will point you at the right corner of the codebase.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <a href="https://discord.gg/9xywA3pj" className="inline-flex items-center gap-1 font-medium text-(--accent-2) underline decoration-(--accent)/30 underline-offset-4 transition-[text-decoration-color] hover:decoration-(--accent)">
              Discord <ArrowUpRight className="size-3.5" />
            </a>
            <a href="mailto:opendevsociety@gmail.com" className="inline-flex items-center gap-1 font-medium text-(--accent-2) underline decoration-(--accent)/30 underline-offset-4 transition-[text-decoration-color] hover:decoration-(--accent)">
              opendevsociety@gmail.com
            </a>
          </div>
        </li>

        <li className={step}>
          <span className={num}>03</span>
          <h3 className="display text-xl font-semibold">Grab a labeled issue</h3>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {labels.map((l) => (
              <a
                key={l.label}
                href={issuesUrl(repo, l.label)}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-xl bg-(--card) p-3.5 shadow-(--sh) transition-[box-shadow,translate] duration-200 hover:-translate-y-0.5 hover:shadow-(--sh-hi)"
              >
                <span className="inline-flex items-center gap-1.5 rounded-full bg-(--accent-soft) px-2 py-0.5 font-mono text-[11px] text-(--accent-2)">
                  <span className="size-1.5 rounded-full bg-(--accent)" />
                  {l.label}
                </span>
                <span className="mt-2.5 flex items-center justify-between text-sm text-(--ink-2)">
                  {l.who}
                  <ArrowUpRight className="size-4 text-(--ink-3) transition-[color,translate] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-(--ink)" />
                </span>
              </a>
            ))}
          </div>
        </li>

        <li className={step}>
          <span className={num}>04</span>
          <h3 className="display text-xl font-semibold">Open the pull request</h3>
          <p className="mt-1 text-[15px] text-(--ink-2)">
            Your work stays yours: full credit, on your profile and your résumé. We review, you ship.
          </p>
        </li>
      </ol>

      <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
        <div className="overflow-hidden rounded-2xl bg-(--ink) text-(--paper) shadow-(--sh-hi)">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
            <span className="font-mono text-xs text-white/50">~/workshop/{repo}</span>
            <button
              type="button"
              onClick={copy}
              aria-label={copied ? "Copied" : "Copy commands"}
              className="relative grid size-9 place-items-center rounded-lg text-white/60 transition-[color,background-color,scale] duration-150 hover:bg-white/10 hover:text-white active:scale-[0.96]"
            >
              <AnimatePresence initial={false} mode="popLayout">
                <motion.span
                  key={copied ? "check" : "copy"}
                  initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                  transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                >
                  {copied ? <Check className="size-4 text-[#9fd49f]" /> : <Copy className="size-4" />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-[12.5px] leading-7">
            {commands.map((c) => (
              <div key={c}>
                <span className="select-none text-(--accent)">$ </span>
                {c}
              </div>
            ))}
            <div className="text-white/40"># that&apos;s it. you&apos;re a contributor.</div>
          </pre>
        </div>

        <div className="mt-5 rounded-2xl bg-(--card) p-4 shadow-(--sh)">
          <p className="text-sm text-(--ink-2)">Not writing code? The society needs every kind of builder.</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {roles.map((r) => (
              <a
                key={r.name}
                href={r.href}
                className="rounded-full px-3 py-1.5 text-sm text-(--ink) shadow-[inset_0_0_0_1px_var(--line)] transition-[background-color] duration-150 hover:bg-(--paper-2)"
              >
                {r.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
