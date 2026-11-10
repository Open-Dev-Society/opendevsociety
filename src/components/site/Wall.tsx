"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { useHandle, isValidHandle } from "@/lib/handle";
import { cn } from "./cn";
import { Tooltip } from "./Tooltip";

export type Builder = {
  login: string;
  name?: string;
  avatar: string;
  url: string;
  contributions: number;
  repos: string[];
  core?: boolean;
};

const STAGGER = 14; // ms between seats
const SEAT_IN = 280; // ms, one seat
const DRAW = 600; // ms, the open seat's outline
const DRAW_GAP = 200; // ms after the last seat

/** Column counts per breakpoint (brief §9): 16 / 12 / 8 on home; page seats are 1.25x, so ~13 / 10 / 6. */
const COLS = {
  home: [8, 12, 16],
  page: [6, 10, 13],
} as const;

function useColumns(size: "home" | "page") {
  const [small, mid, large] = COLS[size];
  const subscribe = (cb: () => void) => {
    const qs = [matchMedia("(min-width: 640px)"), matchMedia("(min-width: 1024px)")];
    qs.forEach((q) => q.addEventListener("change", cb));
    return () => qs.forEach((q) => q.removeEventListener("change", cb));
  };
  const get = () => (matchMedia("(min-width: 1024px)").matches ? large : matchMedia("(min-width: 640px)").matches ? mid : small);
  return useSyncExternalStore(subscribe, get, () => large);
}

const avatarSrc = (url: string, px: number) => `${url}${url.includes("?") ? "&" : "?"}s=${px}`;
const fmt = (n: number) => n.toLocaleString("en-US");

function tip(b: Builder) {
  const shown = b.repos.slice(0, 2).join(", ");
  const more = b.repos.length - 2;
  return (
    <>
      {b.name ? <span className="sign block text-[15px]">{b.name}</span> : <span className="block font-mono text-xs">@{b.login}</span>}
      <span className="text-(--inv-fg-muted)">
        {fmt(b.contributions)} contribution{b.contributions === 1 ? "" : "s"}
        {shown && ` · ${shown}`}
        {more > 0 && ` +${more}`}
      </span>
    </>
  );
}

/**
 * Signature 1, "Take a seat" (brief §7). Renders the seats, the open seat, the claim line and the claim field;
 * the page renders the H2. Builders come sorted by contributions.
 */
export function Wall({ builders, size = "home" }: { builders: Builder[]; size?: "home" | "page" }) {
  const reduce = useReducedMotion();
  const cols = useColumns(size);
  const [handle, setHandle] = useHandle();
  const root = useRef<HTMLDivElement>(null);
  const [claiming, setClaiming] = useState(false);
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "error">("idle");
  const [fresh, setFresh] = useState(false); // avatar just loaded: animate it into the seat

  const n = builders.length;
  const open = n + 1;
  const fillers = (cols - (open % cols)) % cols; // quiet seats only finish the last row
  const px = size === "page" ? 200 : 160;

  // The fill is driven by root's data-phase, set on the DOM (not React state) so SSR and no-JS show the final state:
  // no attribute = final · "armed" = hidden, waiting for 35% in view · "in" = playing once.
  useLayoutEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.dataset.phase = "armed";
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.dataset.phase = "in";
        io.disconnect();
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // "scale: none" once visible keeps seats out of a stacking context, so tooltips sit above their neighbours.
  const SEAT =
    "in-data-[phase=armed]:scale-[0.92] in-data-[phase=armed]:opacity-0 in-data-[phase=in]:transition-[opacity,scale] in-data-[phase=in]:duration-[280ms] in-data-[phase=in]:ease-(--ease-out) in-data-[phase=in]:[transition-delay:var(--delay)]";
  // delays ride a variable and apply only while playing: a transition-delay with a 0s duration would hold the old value
  const delay = (i: number) => ({ "--delay": `${i * STAGGER}ms` }) as React.CSSProperties;
  const drawDelay = (open - 1) * STAGGER + SEAT_IN + DRAW_GAP; // after the last seat settles

  function claim() {
    setClaiming(true);
    setTimeout(() => document.getElementById("wall-handle")?.focus(), 60); // after the field un-inerts
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const h = draft.trim().replace(/^@/, "");
    if (!isValidHandle(h)) return setStatus("error");
    setStatus("checking");
    const img = new Image();
    img.onload = () => {
      setFresh(true);
      setHandle(h);
      setStatus("idle");
      setClaiming(false);
      setDraft("");
    };
    img.onerror = () => setStatus("error");
    img.src = `https://github.com/${h}.png?size=96`;
  }

  const miss = draft.trim().replace(/^@/, "");

  return (
    <div ref={root}>
      <ul
        className={cn(
          "grid list-none gap-1.5 p-0",
          size === "home" ? "grid-cols-8 sm:grid-cols-12 lg:grid-cols-16" : "grid-cols-6 sm:grid-cols-10 lg:grid-cols-13",
        )}
        aria-label={`${n} builders`}
      >
        {builders.map((b, i) => (
          <li key={b.login} className={SEAT} style={delay(i)}>
            <Tooltip content={tip(b)}>
              <a
                href={b.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${b.name ?? b.login}, ${fmt(b.contributions)} contributions${b.repos.length ? `, ${b.repos.slice(0, 2).join(", ")}${b.repos.length > 2 ? ` and ${b.repos.length - 2} more` : ""}` : ""}`}
                className={cn("block aspect-square rounded-(--radius-sm)", b.core && "ring-2 ring-(--accent-soft)")}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- external GitHub avatars */}
                <img
                  src={avatarSrc(b.avatar, px)}
                  alt=""
                  width={px / 2}
                  height={px / 2}
                  loading="lazy"
                  decoding="async"
                  className="size-full rounded-[inherit] bg-(--surface-2) object-cover outline-1 -outline-offset-1 outline-(--img-outline)"
                />
              </a>
            </Tooltip>
          </li>
        ))}

        {/* The open seat: position N+1, directly after the last face. */}
        <li className={SEAT} style={delay(n)}>
          <button
            type="button"
            onClick={claim}
            aria-label={handle ? `Seat ${open}, saved for @${handle}` : `Seat ${open} is open. Claim it`}
            className="relative block aspect-square w-full rounded-(--radius-sm)"
          >
            <span
              key={handle ? "claimed" : "open"}
              aria-hidden
              className={cn(
                "absolute inset-0 rounded-[inherit]",
                handle
                  ? "bg-(--surface-2)"
                  : "bg-(--mark-soft) in-data-[phase=armed]:bg-transparent in-data-[phase=in]:transition-[background-color] in-data-[phase=in]:duration-(--d-3) in-data-[phase=in]:ease-(--ease-ui) in-data-[phase=in]:[transition-delay:var(--delay)]",
              )}
              style={handle ? undefined : ({ "--delay": `${drawDelay + DRAW}ms` } as React.CSSProperties)}
            />
            {handle ? (
              <motion.img
                key={handle}
                src={`https://github.com/${handle}.png?size=${px}`}
                alt={`@${handle}`}
                width={px / 2}
                height={px / 2}
                initial={fresh && !reduce ? { opacity: 0, scale: 0.9 } : false}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 size-full rounded-[inherit] object-cover ring-2 ring-(--mark) outline-1 -outline-offset-1 outline-(--img-outline)"
              />
            ) : (
              <>
                <svg aria-hidden className="absolute inset-0 size-full overflow-visible">
                  <rect
                    pathLength={1}
                    fill="none"
                    stroke="var(--mark)"
                    strokeWidth={1.5}
                    strokeDasharray={1}
                    className="[stroke-dashoffset:0] in-data-[phase=armed]:[stroke-dashoffset:1] in-data-[phase=in]:transition-[stroke-dashoffset] in-data-[phase=in]:duration-[600ms] in-data-[phase=in]:ease-(--ease-in-out) in-data-[phase=in]:[transition-delay:var(--delay)]"
                    style={
                      {
                        x: "0.75px",
                        y: "0.75px",
                        width: "calc(100% - 1.5px)",
                        height: "calc(100% - 1.5px)",
                        rx: "calc(var(--radius-sm) - 0.75px)",
                        "--delay": `${drawDelay}ms`,
                      } as React.CSSProperties
                    }
                  />
                </svg>
                <Plus
                  aria-hidden
                  className="absolute left-1/2 top-1/2 size-[28%] -translate-x-1/2 -translate-y-1/2 text-(--mark-ink) in-data-[phase=armed]:opacity-0 in-data-[phase=in]:transition-opacity in-data-[phase=in]:duration-(--d-3) in-data-[phase=in]:ease-(--ease-ui) in-data-[phase=in]:[transition-delay:var(--delay)]"
                  style={{ "--delay": `${drawDelay + DRAW + 120}ms` } as React.CSSProperties}
                />
              </>
            )}
          </button>
        </li>

        {Array.from({ length: fillers }, (_, i) => (
          <li key={`q${i}`} aria-hidden className={SEAT} style={delay(open + i)}>
            <div className="aspect-square rounded-(--radius-sm) bg-(--line)" />
          </li>
        ))}
      </ul>

      {/* Caption: swaps when a handle is saved. */}
      <div className="mt-5 min-h-6 text-sm text-(--fg-muted)">
        <AnimatePresence mode="wait" initial={false}>
          {handle ? (
            <motion.p
              key="saved"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: [0.2, 0, 0, 1] }}
              className="flex flex-wrap items-center gap-x-1.5"
            >
              <span>
                Saved for <span className="sign text-(--accent)">@{handle}</span>. It&rsquo;s yours after your first merged PR.
              </span>
              <Link href="#start" className="ink-link">
                Show me how ↓
              </Link>
              <button
                type="button"
                onClick={() => {
                  setHandle(null);
                  setFresh(false);
                }}
                aria-label="Clear my handle"
                className="-m-2 grid size-8 place-items-center rounded-full text-(--fg-subtle) transition-colors duration-(--d-2) hover:text-(--fg)"
              >
                <X className="size-3.5" />
              </button>
            </motion.p>
          ) : (
            <motion.p
              key="open"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: [0.2, 0, 0, 1] }}
            >
              <span>Seat {open} is open. </span>
              <button type="button" onClick={claim} className="sign text-[1.08em] text-(--accent) underline decoration-[color-mix(in_oklch,var(--accent)_30%,transparent)] underline-offset-[0.2em] transition-[text-decoration-color] duration-(--d-2) hover:decoration-(--accent)">
                Claim it
              </button>
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Claim field: inline, not a modal. Grid-rows 0fr to 1fr animates the height. */}
      <div
        className="grid transition-[grid-template-rows] duration-(--d-3) ease-(--ease-in-out)"
        style={{ gridTemplateRows: claiming && !handle ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <form onSubmit={submit} className="pt-4" inert={!(claiming && !handle)}>
            <label className="sr-only" htmlFor="wall-handle">
              Your GitHub handle
            </label>
            <div className="flex max-w-md items-center gap-2">
              <div className="flex h-11 min-w-0 flex-1 items-center rounded-(--radius-sm) bg-(--surface) px-3 font-mono text-[15px] shadow-(--shadow-sm) focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-(--focus)">
                <span className="text-(--fg-subtle)">@</span>
                <input
                  id="wall-handle"
                  value={draft}
                  onChange={(e) => {
                    setDraft(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  placeholder="your-github-handle"
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  className="min-w-0 flex-1 bg-transparent pl-0.5 text-(--fg) outline-none placeholder:text-(--fg-subtle)"
                />
              </div>
              <button
                type="submit"
                disabled={!draft.trim() || status === "checking"}
                className="h-11 shrink-0 rounded-full bg-(--accent) px-5 text-[15px] font-medium text-(--accent-fg) transition-[background-color,scale] duration-(--d-2) hover:bg-(--accent-hover) active:scale-[0.97] disabled:opacity-50"
              >
                {status === "checking" ? "Checking…" : "Save my seat"}
              </button>
            </div>
            <p className="mt-2 min-h-5 text-sm text-(--fg-muted)" aria-live="polite">
              {status === "error" && `No GitHub account called @${miss}.`}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
