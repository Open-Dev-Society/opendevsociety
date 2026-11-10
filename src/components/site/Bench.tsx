"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { useHandle } from "@/lib/handle";
import { cn } from "./cn";
import { SegmentedControl } from "./SegmentedControl";
import { Steps } from "./Steps";

type Repo = { name: string; openIssues: number };
type Mode = "terminal" | "agent";
/** A piece of a line. `repo` and `handle` are the tokens that change when the reader picks or claims. */
type Seg = { k: "t" | "repo" | "handle"; s: string };

const ORG = "Open-Dev-Society";
const CHAR_MS = 9;
const LINE_MS = 90;

const terminalLines = (repo: string, handle: string): Seg[][] => [
  [
    { k: "t", s: `gh repo fork ${ORG}/` },
    { k: "repo", s: repo },
    { k: "t", s: " --clone" },
  ],
  [
    { k: "t", s: "cd " },
    { k: "repo", s: repo },
    { k: "t", s: " && git switch -c " },
    { k: "handle", s: handle },
    { k: "t", s: "/first-pr" },
  ],
  [{ k: "t", s: "gh pr create --fill --draft" }],
];

const agentPrompt = (repo: string, handle: string): Seg[] => [
  { k: "t", s: `Fork ${ORG}/` },
  { k: "repo", s: repo },
  { k: "t", s: ', read its README and CONTRIBUTING, pick one open issue labelled "good first issue" or "help wanted", fix it on a branch named ' },
  { k: "handle", s: handle },
  { k: "t", s: "/first-pr, and open a draft pull request that explains the change." },
];

const plain = (segs: Seg[]) => segs.map((s) => s.s).join("");

/** prefers-reduced-motion. False on the server and during hydration, so the first client render matches it. */
function useCalm() {
  return useSyncExternalStore(
    (cb) => {
      const q = matchMedia("(prefers-reduced-motion: reduce)");
      q.addEventListener("change", cb);
      return () => q.removeEventListener("change", cb);
    },
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

/**
 * A token that crossfades (opacity + 3px) under a --mark flash when its value changes after the first paint.
 * `shown` is how many characters are printed so far; the rest keeps its width but is invisible, so wrapping never jumps.
 */
function Tok({ seg, shown, className }: { seg: Seg; shown: number; className?: string }) {
  const reduce = useReducedMotion();
  const value = seg.s;
  const [seen, setSeen] = useState(value);
  const [gen, setGen] = useState(0);
  const [flash, setFlash] = useState(false);

  // Value changed since last render: re-key (crossfade) and start the flash. Derived during render, no effect.
  if (seen !== value) {
    setSeen(value);
    setGen(gen + 1);
    setFlash(seg.k !== "handle" && !reduce); // the handle chip is already --mark; it only crossfades
  }
  useEffect(() => {
    if (!flash) return;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setFlash(false)));
    return () => cancelAnimationFrame(id);
  }, [flash]);

  const n = Math.min(shown, value.length);
  const chip = seg.k === "handle";
  return (
    <motion.span
      key={gen}
      initial={gen === 0 ? false : { opacity: 0, y: reduce ? 0 : 3 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0.1 : 0.16, ease: [0.2, 0, 0, 1] }}
      className={cn(
        "inline-block indent-0 rounded-[4px] [box-decoration-break:clone]",
        chip ? "bg-(--mark) px-[3px] text-(--inv-bg)" : seg.k === "repo" ? "text-(--inv-accent)" : "",
        className,
      )}
      style={{
        opacity: n === 0 ? 0 : undefined,
        ...(seg.k === "repo"
          ? {
              backgroundColor: flash ? "var(--mark)" : "transparent",
              color: flash ? "var(--inv-bg)" : undefined,
              transition: flash ? "none" : "background-color 900ms var(--ease-out), color 900ms var(--ease-out)",
            }
          : null),
      }}
    >
      {value.slice(0, n)}
      <span className="opacity-0">{value.slice(n)}</span>
    </motion.span>
  );
}

function Segs({ segs, shown }: { segs: Seg[]; shown: number }) {
  return (
    <>
      {segs.map((seg, i) => {
        const n = Math.max(0, shown - segs.slice(0, i).reduce((a, x) => a + x.s.length, 0));
        return seg.k === "t" ? (
          <span key={i}>
            {seg.s.slice(0, n)}
            <span className="opacity-0">{seg.s.slice(Math.min(n, seg.s.length))}</span>
          </span>
        ) : (
          <Tok key={i} seg={seg} shown={n} />
        );
      })}
    </>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard can be blocked; the text stays selectable
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : "Copy"}
      className="grid size-9 shrink-0 place-items-center rounded-(--radius-sm) text-(--fg-muted) transition-[background-color,color,scale] duration-(--d-2) hover:bg-(--surface-2) hover:text-(--fg) active:scale-[0.96]"
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={copied ? "check" : "copy"}
          className="grid place-items-center"
          initial={{ opacity: 0, filter: "blur(2px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(2px)" }}
          transition={{ duration: 0.16 }}
        >
          {copied ? <Check className="size-4 text-(--accent)" /> : <Copy className="size-4" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

function Terminal({
  repo,
  handle,
  mode,
  setMode,
  typed,
  done,
  attach,
}: {
  repo: string;
  handle: string;
  mode: Mode;
  setMode: (m: Mode) => void;
  typed: number;
  done: boolean;
  attach: (el: HTMLElement | null) => void;
}) {
  const reduce = useCalm();
  const lines = terminalLines(repo, handle);
  const prompt = agentPrompt(repo, handle);
  const lens = lines.map((l) => plain(l).length);
  const copyText = mode === "terminal" ? lines.map(plain).join("\n") : plain(prompt);

  // Panel height follows the active panel (--d-3, ease-in-out).
  const inner = useRef<HTMLDivElement>(null);
  const [h, setH] = useState<number | "auto">("auto");
  useLayoutEffect(() => {
    const el = inner.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setH(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, [mode]);

  // chars printed per line; the caret sits on the line being printed
  const shown = lens.map((len, i) => {
    const before = lens.slice(0, i).reduce((a, b) => a + b, 0);
    return done ? len : Math.max(0, Math.min(len, typed - before));
  });
  const active = done ? lines.length - 1 : Math.max(0, shown.findIndex((n, i) => n < lens[i]));

  return (
    <div ref={attach} className="rounded-(--radius-lg) bg-(--inv-surface) text-(--inv-fg) shadow-(--shadow-lg)">
      <div className="flex items-center justify-between gap-3 border-b border-(--inv-line) px-3 py-2.5">
        <SegmentedControl
          label="Bench mode"
          value={mode}
          onChange={setMode}
          options={[
            { value: "terminal", label: "Terminal" },
            { value: "agent", label: "Agent" },
          ]}
        />
        <CopyButton text={copyText} />
      </div>

      <motion.div
        initial={false}
        animate={{ height: h }}
        transition={{ duration: reduce ? 0 : 0.24, ease: [0.65, 0, 0.35, 1] }}
        className="overflow-hidden"
      >
        <div ref={inner} className="p-5 sm:p-6">
          <AnimatePresence mode="wait" initial={false}>
            {mode === "terminal" ? (
              <motion.div
                key="terminal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.16 }}
              >
                <p className="sr-only">{lines.map(plain).join(". ")}</p>
                <div aria-hidden className="space-y-1.5 font-mono text-[13px] leading-[1.6]">
                  {lines.map((segs, i) => (
                    <div key={i} className="whitespace-pre-wrap break-words pl-[2ch] -indent-[2ch]">
                      <span className="select-none text-(--inv-fg-subtle)">$ </span>
                      <Segs segs={segs} shown={shown[i]} />
                      {i === active && !reduce && (
                        <span className="relative inline-block h-[1.1em] w-0 align-text-bottom">
                          <motion.span
                            className="absolute left-0 top-0 h-full w-[0.6em] bg-(--inv-fg)"
                            animate={{ opacity: [1, 1, 0, 0] }}
                            transition={{ duration: 1.06, times: [0, 0.5, 0.5, 1], repeat: Infinity, ease: "linear" }}
                          />
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <p className="mt-4 font-mono text-xs text-(--inv-fg-subtle)">
                  Needs the GitHub CLI ·{" "}
                  <a href="https://cli.github.com" target="_blank" rel="noopener noreferrer" className="underline decoration-(--inv-line) underline-offset-2 hover:text-(--inv-fg)">
                    cli.github.com
                  </a>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="agent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.16 }}
              >
                <p className="text-[15px] leading-[1.6] text-pretty">
                  <Segs segs={prompt} shown={Infinity} />
                </p>
                <p className="mt-4 text-sm text-(--inv-fg-subtle)">Paste into any coding agent.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Signature 2, "The bench" (brief §7, §10 §4). The whole interactive content of the Start section: wrap it in
 * <Section tone="inverse"> and put the SectionHeader above it. `repos` = repos with open issues, OpenStock first.
 */
export function Bench({
  repos,
  wallHref = "#people",
  notCoderHref = "/contribute",
}: {
  repos: Repo[];
  /** step 4's link to the wall: "#people" on Home, "/contributors" elsewhere */
  wallHref?: string;
  /** the "Not a coder?" link: "/contribute" on Home, an in-page anchor on /contribute */
  notCoderHref?: string;
}) {
  const reduce = useCalm();
  const [handle] = useHandle();
  const [pick, setPick] = useState(repos[0]?.name ?? "OpenStock");
  const [mode, setMode] = useState<Mode>("terminal");
  const repo = repos.some((r) => r.name === pick) ? pick : (repos[0]?.name ?? "OpenStock");
  const you = handle ?? "you";

  // Print once, the first time the terminal is 35% in view. State lives here so a layout switch (mobile <-> desktop) can't replay it.
  const [typed, setTyped] = useState(0);
  const [done, setDone] = useState(false);
  const started = useRef(false);
  const io = useRef<IntersectionObserver | null>(null);
  const total = useRef(0);
  const lens = useRef<number[]>([]);
  lens.current = terminalLines(repo, you).map((l) => plain(l).length);
  total.current = lens.current.reduce((a, b) => a + b, 0);

  const print = useCallback(() => {
    if (started.current) return;
    started.current = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setDone(true);
    const starts = new Set<number>();
    lens.current.reduce((acc, n) => (starts.add(acc), acc + n), 0);
    let n = 0;
    const tick = () => {
      n++;
      setTyped(n);
      if (n >= total.current) return setDone(true);
      setTimeout(tick, starts.has(n) ? LINE_MS : CHAR_MS);
    };
    setTimeout(tick, LINE_MS);
  }, []);

  // Both placements (phone, desktop) attach; the hidden one never intersects, so whichever is visible starts it.
  const attach = useCallback(
    (el: HTMLElement | null) => {
      if (!el || started.current) return;
      io.current ??= new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting)) return;
          io.current?.disconnect();
          print();
        },
        { threshold: 0.35 },
      );
      io.current.observe(el);
    },
    [print],
  );
  useEffect(() => () => io.current?.disconnect(), []);

  // Reduced motion: final state at once.
  const finished = done || reduce === true;

  const terminal = (
    <Terminal repo={repo} handle={you} mode={mode} setMode={setMode} typed={typed} done={finished} attach={attach} />
  );
  const notCoder = (
    <p className="text-sm text-(--fg-muted)">
      Not a coder? Writers, designers and teachers start here{" "}
      <Link href={notCoderHref} className="ink-link">
        →
      </Link>
    </p>
  );

  return (
    <div className="grid grid-cols-1 gap-x-(--grid-gap) gap-y-8 lg:grid-cols-12">
      <div className="min-w-0 lg:col-span-5">
        <Steps
          items={[
            {
              title: "Pick a repo.",
              children: (
                <div className="space-y-5">
                  <SegmentedControl
                    wrap
                    label="Repo"
                    value={repo}
                    onChange={setPick}
                    options={repos.map((r) => ({ value: r.name, label: r.name, count: r.openIssues }))}
                  />
                  <div className="lg:hidden">{terminal}</div>
                </div>
              ),
            },
            { title: "Fork it and branch." },
            { title: "Open a draft PR.", body: "A maintainer reviews it in the open." },
            {
              title: (
                <>
                  Get merged.{" "}
                  <Link href={wallHref} className="ink-link">
                    Your face lands on the wall.
                  </Link>
                </>
              ),
            },
          ]}
        />
        <div className="mt-6 lg:hidden">{notCoder}</div>
      </div>

      <div className="min-w-0 max-lg:hidden lg:col-span-7">
        <div className="sticky top-24 space-y-5">
          {terminal}
          {notCoder}
        </div>
      </div>
    </div>
  );
}
