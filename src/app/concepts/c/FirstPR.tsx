"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { CopyIcon, useCopy } from "./Copy";

const ORG = "Open-Dev-Society";
const GH = `https://github.com/${ORG}`;

const labels = [
  { label: "good first issue", who: "Newcomers" },
  { label: "help wanted", who: "Some experience" },
  { label: "documentation", who: "Writers" },
];

const roles = [
  { name: "Writing", href: "/contribute#content" },
  { name: "Teaching", href: "/contribute#education" },
  { name: "Media & design", href: "/contribute#media" },
  { name: "Events", href: "/contribute#events" },
];

const issuesUrl = (repo: string, label: string) =>
  `${GH}/${repo}/issues?q=${encodeURIComponent(`is:issue is:open label:"${label}"`)}`;

type Mode = "terminal" | "agent";

// Outsiders can't push to the org, so the path is fork → branch → PR.
function Bench({ repo, mode, setMode }: { repo: string; mode: Mode; setMode: (m: Mode) => void }) {
  const { copied, copy } = useCopy();
  const commands = [
    `gh repo fork ${ORG}/${repo} --clone`,
    `cd ${repo} && git switch -c fix/your-change`,
    `gh pr create --fill`,
  ];
  // None of the repos ship an AGENTS.md yet, so the prompt points the agent at the README.
  const prompt = `Fork ${ORG}/${repo} and read its README. Pick an open issue labelled "good first issue", make the fix on a new branch, and open a draft pull request that explains the change.`;

  return (
    <div className="overflow-hidden rounded-2xl bg-[#2a231d] text-(--paper) shadow-[0_0_0_1px_rgb(255_255_255/0.08),0_24px_48px_-24px_rgb(0_0_0/0.6)]">
      <div className="flex items-center gap-2 border-b border-white/10 py-1.5 pl-1.5 pr-1.5">
        <div className="flex rounded-lg bg-white/[0.06] p-0.5" role="tablist" aria-label="How you'll work">
          {(["terminal", "agent"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={`rounded-md px-3 py-1.5 text-[13px] capitalize transition-[background-color,color] duration-150 ${
                mode === m ? "bg-white/[0.12] text-white" : "text-white/55 hover:text-white"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <span className="ml-auto hidden truncate font-mono text-xs text-white/45 sm:block">~/{repo}</span>
        <button
          type="button"
          onClick={() => copy(mode === "terminal" ? commands.join("\n") : prompt)}
          aria-label={copied ? "Copied" : mode === "terminal" ? "Copy commands" : "Copy prompt"}
          className="ml-auto grid size-10 place-items-center rounded-lg text-white/60 transition-[color,background-color,scale] duration-150 hover:bg-white/10 hover:text-white active:scale-[0.96] sm:ml-0"
        >
          <CopyIcon copied={copied} />
        </button>
      </div>
      {mode === "terminal" ? (
        <pre className="whitespace-pre-wrap break-words p-4 font-mono text-[13px] leading-7">
          {commands.map((c) => (
            <div key={c} className="pl-[2ch] -indent-[2ch]">
              <span className="select-none text-(--accent)">$ </span>
              {c}
            </div>
          ))}
          <div className="text-white/45"># that&apos;s it. you&apos;re a contributor.</div>
        </pre>
      ) : (
        <div className="p-4">
          <p className="text-[15px] leading-relaxed text-white/85">{prompt}</p>
          <p className="mt-3 text-[13px] text-white/50">Paste into Claude Code, Codex or Cursor. You still review and sign the PR.</p>
        </div>
      )}
    </div>
  );
}

export function FirstPR({ repos }: { repos: { name: string; openIssues: number; goodFirst: number }[] }) {
  const [repo, setRepo] = useState(repos[0].name);
  const [mode, setMode] = useState<Mode>("terminal");
  const picked = repos.find((r) => r.name === repo);
  const issues = picked?.openIssues ?? 0;
  const firsts = picked?.goodFirst ?? 0;

  const step = "relative pl-12 pb-8 last:pb-0 lg:pb-10";
  const num =
    "absolute left-0 top-0 grid size-8 place-items-center rounded-full bg-(--ink) font-mono text-xs tabular-nums text-white/70 shadow-[0_0_0_1px_rgb(255_255_255/0.14)]";
  const link =
    "inline-flex items-center gap-1 font-medium text-(--paper) underline decoration-white/25 underline-offset-4 transition-[text-decoration-color] duration-150 hover:decoration-(--accent)";

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:gap-14">
      <ol className="relative before:absolute before:bottom-4 before:left-4 before:top-4 before:w-px before:bg-white/15">
        <li className={step}>
          <span className={num}>01</span>
          <h3 className="display-sm text-xl font-semibold text-white">Pick a project</h3>
          <p className="mt-1 text-[15px] text-white/65">The commands and links below follow your pick.</p>
          <div className="mt-4 flex flex-wrap gap-2" role="radiogroup" aria-label="Project">
            {repos.map(({ name }) => (
              <button
                key={name}
                type="button"
                role="radio"
                aria-checked={name === repo}
                onClick={() => setRepo(name)}
                className={`rounded-full px-3.5 py-2 text-sm transition-[background-color,color,scale] duration-150 active:scale-[0.96] ${
                  name === repo
                    ? "bg-(--accent) text-white"
                    : "bg-white/[0.07] text-white/75 hover:bg-white/[0.12] hover:text-white"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
          {/* On phones the bench sits right under the picker, so a tap visibly changes the commands. */}
          <div className="mt-5 lg:hidden">
            <Bench repo={repo} mode={mode} setMode={setMode} />
          </div>
        </li>

        <li className={step}>
          <span className={num}>02</span>
          <h3 className="display-sm text-xl font-semibold text-white">Find something to fix</h3>
          {issues > 0 ? (
            <>
              <p className="mt-1 text-[15px] text-white/65">
                <a
                  href={firsts > 0 ? issuesUrl(repo, "good first issue") : `${GH}/${repo}/issues`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={link}
                >
                  {firsts > 0
                    ? `${firsts} good first ${firsts === 1 ? "issue" : "issues"}`
                    : `${issues} open ${issues === 1 ? "issue" : "issues"}`}{" "}
                  in {repo}
                  <ArrowUpRight className="size-3.5" />
                </a>
                . Filter by who they&apos;re for:
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {labels.map((l) => (
                  <a
                    key={l.label}
                    href={issuesUrl(repo, l.label)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-white/[0.07] px-3 py-1.5 text-sm text-white/80 transition-[background-color] duration-150 hover:bg-white/[0.12]"
                  >
                    <span className="size-1.5 rounded-full bg-(--accent)" />
                    {l.label}
                    <span className="text-white/45">{l.who}</span>
                  </a>
                ))}
              </div>
            </>
          ) : (
            <p className="mt-1 text-[15px] text-white/65">
              {repo} has no open issues right now. Use it, find the rough edge, and{" "}
              <a href={`${GH}/${repo}/issues/new`} target="_blank" rel="noopener noreferrer" className={link}>
                open the first one
              </a>
              . That counts too.
            </p>
          )}
        </li>

        <li className={step}>
          <span className={num}>03</span>
          <h3 className="display-sm text-xl font-semibold text-white">Say hi before you start</h3>
          <p className="mt-1 text-[15px] text-white/65">
            Someone from the crew will point you at the right corner of the codebase.
          </p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <a href="https://discord.gg/9xywA3pj" className={link}>
              Discord <ArrowUpRight className="size-3.5" />
            </a>
            <a href="mailto:opendevsociety@gmail.com" className={link}>
              opendevsociety@gmail.com
            </a>
          </div>
        </li>

        <li className={step}>
          <span className={num}>04</span>
          <h3 className="display-sm text-xl font-semibold text-white">Open the pull request</h3>
          <p className="mt-1 text-[15px] text-white/65">
            Your work stays yours: credited by name, on your profile and on the wall.
          </p>
        </li>
      </ol>

      <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
        <div className="mb-5 hidden lg:block">
          <Bench repo={repo} mode={mode} setMode={setMode} />
        </div>
        <div className="lg:rounded-2xl lg:p-4 lg:shadow-[inset_0_0_0_1px_rgb(255_255_255/0.1)]">
          <p className="text-sm text-white/65">Not writing code? The society needs every kind of builder.</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {roles.map((r) => (
              <a
                key={r.name}
                href={r.href}
                className="rounded-full bg-white/[0.07] px-3 py-1.5 text-sm text-white/80 transition-[background-color] duration-150 hover:bg-white/[0.12]"
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
