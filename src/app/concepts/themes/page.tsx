import type { Metadata } from "next";
import type { CSSProperties } from "react";
import {
  Bricolage_Grotesque,
  Funnel_Display,
  Funnel_Sans,
  Geist_Mono,
  Inter,
  JetBrains_Mono,
  Mona_Sans,
  Newsreader,
} from "next/font/google";
import { snapshotContributors, snapshotRepos } from "@/data/fallback";

export const metadata: Metadata = {
  title: "Theme specimens · Open Dev Society",
  robots: { index: false },
};

const mona = Mona_Sans({ subsets: ["latin"], axes: ["wdth"], variable: "--f-mona" });
const newsreader = Newsreader({ subsets: ["latin"], style: "italic", axes: ["opsz"], variable: "--f-news" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--f-geistmono" });
const funnelD = Funnel_Display({ subsets: ["latin"], variable: "--f-funneld" });
const funnelS = Funnel_Sans({ subsets: ["latin"], variable: "--f-funnels" });
const jbMono = JetBrains_Mono({ subsets: ["latin"], variable: "--f-jb" });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], axes: ["opsz", "wdth"], variable: "--f-bric" });
const inter = Inter({ subsets: ["latin"], variable: "--f-inter" });

const fontVars = [mona, newsreader, geistMono, funnelD, funnelS, jbMono, bricolage, inter].map((f) => f.variable).join(" ");

// Real numbers from the 2026-11-10 snapshot.
const stock = snapshotRepos.find((r) => r.name === "OpenStock")!;
const kitbash = snapshotRepos.find((r) => r.name === "kitbash")!;
const stockBuilders = snapshotContributors.filter((c) => c.repos.includes("OpenStock"));
const builders = snapshotContributors.length;
const compact = (n: number) => new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);

type Theme = {
  id: string;
  name: string;
  mode: string;
  concept: string;
  fonts: [string, string][];
  vars: Record<string, string>;
  swatches: [string, string][];
  /** How the display face is tuned. */
  display: CSSProperties;
  /** How the emphasis clause in the H1 is set. */
  emphasis: CSSProperties;
};

const themes: Theme[] = [
  {
    id: "ink",
    name: "Signed in ink",
    mode: "Light, with an inkwell band",
    concept:
      "Daylight workshop: made in public, so it's light. Every name is signed in cobalt ink, and a highlighter marks what's yours (the open seat, the changed command).",
    fonts: [
      ["Mona Sans", "GitHub's own OFL typeface, the native voice of open source; its width axis gives one family a confident wide display and a calm text cut."],
      ["Newsreader Italic", "Used only for names, signatures and quotes: the human hand signing the work, with optical sizes so it stays crisp from 14 to 96px."],
      ["Geist Mono", "A neutral, tight mono for commands and counts that doesn't fight Mona's width."],
    ],
    vars: {
      "--bg": "oklch(0.975 0.004 95)",
      "--surface": "oklch(0.995 0.002 95)",
      "--surface-2": "oklch(0.948 0.006 95)",
      "--fg": "oklch(0.2 0.025 265)",
      "--fg-muted": "oklch(0.43 0.025 265)",
      "--fg-subtle": "oklch(0.53 0.02 265)",
      "--line": "oklch(0.2 0.025 265 / 0.1)",
      "--accent": "oklch(0.48 0.2 265)",
      "--accent-hover": "oklch(0.42 0.19 265)",
      "--accent-fg": "oklch(1 0 0)",
      "--accent-soft": "oklch(0.94 0.03 265)",
      "--mark": "oklch(0.925 0.125 102)",
      "--live": "oklch(0.52 0.12 152)",
      "--inv-bg": "oklch(0.19 0.03 268)",
      "--inv-surface": "oklch(0.245 0.035 268)",
      "--inv-fg": "oklch(0.96 0.006 95)",
      "--inv-fg-muted": "oklch(0.8 0.02 265)",
      "--inv-accent": "oklch(0.76 0.12 262)",
      "--f-display": "var(--f-mona)",
      "--f-body": "var(--f-mona)",
      "--f-sign": "var(--f-news)",
      "--f-mono": "var(--f-geistmono)",
    },
    swatches: [
      ["--bg", "oklch(0.975 0.004 95)"],
      ["--surface-2", "oklch(0.948 0.006 95)"],
      ["--fg", "oklch(0.2 0.025 265)"],
      ["--fg-muted", "oklch(0.43 0.025 265)"],
      ["--accent", "oklch(0.48 0.2 265)"],
      ["--mark", "oklch(0.925 0.125 102)"],
      ["--live", "oklch(0.52 0.12 152)"],
      ["--inv-bg", "oklch(0.19 0.03 268)"],
    ],
    display: { fontWeight: 680, fontVariationSettings: '"wdth" 112', letterSpacing: "-0.035em" },
    emphasis: {
      fontFamily: "var(--f-sign)",
      fontStyle: "italic",
      fontWeight: 400,
      letterSpacing: "-0.01em",
      color: "var(--accent)",
    },
  },
  {
    id: "night",
    name: "Night shift",
    mode: "Dark",
    concept:
      "The workshop after hours: warm black, bone text, and one amber lamp over the bench. The most 'premium dev tool', but darker and more inward than the idea wants.",
    fonts: [
      ["Funnel Display", "Cut-in joins read like machined parts. Technical, with warmth at size."],
      ["Funnel Sans", "Same superfamily, quiet at text sizes, so the pair stays coherent."],
      ["JetBrains Mono", "A workhorse code face, as tall as Funnel's x-height."],
    ],
    vars: {
      "--bg": "oklch(0.16 0.008 70)",
      "--surface": "oklch(0.205 0.01 70)",
      "--surface-2": "oklch(0.185 0.009 70)",
      "--fg": "oklch(0.94 0.012 85)",
      "--fg-muted": "oklch(0.76 0.015 80)",
      "--fg-subtle": "oklch(0.63 0.015 80)",
      "--line": "oklch(1 0 0 / 0.08)",
      "--accent": "oklch(0.8 0.145 75)",
      "--accent-hover": "oklch(0.85 0.13 80)",
      "--accent-fg": "oklch(0.16 0.008 70)",
      "--accent-soft": "oklch(0.8 0.145 75 / 0.14)",
      "--mark": "oklch(0.8 0.145 75 / 0.22)",
      "--live": "oklch(0.75 0.14 150)",
      "--inv-bg": "oklch(0.12 0.006 70)",
      "--inv-surface": "oklch(0.18 0.008 70)",
      "--inv-fg": "oklch(0.94 0.012 85)",
      "--inv-fg-muted": "oklch(0.7 0.015 80)",
      "--inv-accent": "oklch(0.8 0.145 75)",
      "--f-display": "var(--f-funneld)",
      "--f-body": "var(--f-funnels)",
      "--f-sign": "var(--f-funneld)",
      "--f-mono": "var(--f-jb)",
    },
    swatches: [
      ["--bg", "oklch(0.16 0.008 70)"],
      ["--surface", "oklch(0.205 0.01 70)"],
      ["--fg", "oklch(0.94 0.012 85)"],
      ["--fg-muted", "oklch(0.76 0.015 80)"],
      ["--accent", "oklch(0.8 0.145 75)"],
      ["--live", "oklch(0.75 0.14 150)"],
    ],
    display: { fontWeight: 600, letterSpacing: "-0.035em" },
    emphasis: { color: "var(--accent)" },
  },
  {
    id: "kiln",
    name: "Kiln (concept C, evolved)",
    mode: "Light warm paper",
    concept:
      "The control: C's warm paper and kiln orange, with AA-safe ink and Bricolage's width and optical-size axes. Characterful, but the paper reads beige and Bricolage reads as TanStack.",
    fonts: [
      ["Bricolage Grotesque", "Quirky optical-size display with real personality, though TanStack uses it too."],
      ["Inter", "The safe text face. Everyone uses it."],
      ["JetBrains Mono", "Code and counts."],
    ],
    vars: {
      "--bg": "oklch(0.958 0.012 80)",
      "--surface": "oklch(0.992 0.006 80)",
      "--surface-2": "oklch(0.925 0.018 78)",
      "--fg": "oklch(0.215 0.012 65)",
      "--fg-muted": "oklch(0.44 0.02 65)",
      "--fg-subtle": "oklch(0.515 0.022 68)",
      "--line": "oklch(0.215 0.012 65 / 0.1)",
      "--accent": "oklch(0.585 0.17 40)",
      "--accent-hover": "oklch(0.5 0.145 39)",
      "--accent-fg": "oklch(1 0 0)",
      "--accent-soft": "oklch(0.925 0.038 58)",
      "--mark": "oklch(0.925 0.038 58)",
      "--live": "oklch(0.5 0.09 145)",
      "--inv-bg": "oklch(0.205 0.012 60)",
      "--inv-surface": "oklch(0.255 0.013 60)",
      "--inv-fg": "oklch(0.95 0.012 80)",
      "--inv-fg-muted": "oklch(0.78 0.016 75)",
      "--inv-accent": "oklch(0.72 0.15 48)",
      "--f-display": "var(--f-bric)",
      "--f-body": "var(--f-inter)",
      "--f-sign": "var(--f-bric)",
      "--f-mono": "var(--f-jb)",
    },
    swatches: [
      ["--bg", "oklch(0.958 0.012 80)"],
      ["--surface-2", "oklch(0.925 0.018 78)"],
      ["--fg", "oklch(0.215 0.012 65)"],
      ["--fg-muted", "oklch(0.44 0.02 65)"],
      ["--accent", "oklch(0.585 0.17 40)"],
      ["--accent-soft", "oklch(0.925 0.038 58)"],
      ["--live", "oklch(0.5 0.09 145)"],
    ],
    display: { fontWeight: 650, fontVariationSettings: '"opsz" 96, "wdth" 92', letterSpacing: "-0.02em" },
    emphasis: { color: "var(--accent)" },
  },
];

export default function ThemeSpecimens() {
  return (
    <div className={`${fontVars} min-h-dvh bg-[oklch(0.93_0_0)] text-[oklch(0.2_0_0)]`}>
      <header className="mx-auto max-w-6xl px-5 pb-6 pt-10 sm:px-8">
        <p className="font-mono text-xs text-[oklch(0.45_0_0)]">concepts/themes · art direction · 2026-11-10</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Three themes for Open Dev Society</h1>
        <p className="mt-1 max-w-2xl text-[15px] text-[oklch(0.4_0_0)]">
          Same content, same data, three palettes and type systems. The first is recommended and is the one specified in{" "}
          <code className="font-mono text-[13px]">docs/design-brief.md</code>.
        </p>
      </header>
      <main className="flex flex-col gap-6 pb-16">
        {themes.map((t, i) => (
          <Specimen key={t.id} theme={t} n={i + 1} recommended={i === 0} />
        ))}
      </main>
    </div>
  );
}

function Specimen({ theme: t, n, recommended }: { theme: Theme; n: number; recommended: boolean }) {
  const display = { fontFamily: "var(--f-display)", ...t.display };
  return (
    <section
      id={t.id}
      style={{ ...(t.vars as CSSProperties), fontFamily: "var(--f-body)" }}
      className="mx-auto w-full max-w-6xl overflow-hidden bg-(--bg) text-(--fg) sm:rounded-[22px] sm:shadow-[0_0_0_1px_oklch(0_0_0/0.08),0_24px_60px_-30px_oklch(0_0_0/0.35)]"
    >
      {/* Spec strip */}
      <div className="grid grid-cols-1 gap-6 border-b border-(--line) px-5 py-6 sm:px-8 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="flex items-center gap-2 text-[13px] font-medium text-(--fg-muted)">
            <span className="font-(family-name:--f-mono) tabular-nums">0{n}</span>
            {recommended && (
              <span className="rounded-[6px] bg-(--mark) px-1.5 py-0.5 text-(--fg)">Recommended</span>
            )}
            <span>{t.mode}</span>
          </p>
          <h2 className="mt-2 text-[32px] leading-none" style={display}>
            {t.name}
          </h2>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-(--fg-muted)">{t.concept}</p>
        </div>
        <dl className="grid gap-3 text-[14px] leading-snug">
          {t.fonts.map(([family, why]) => (
            <div key={family} className="grid grid-cols-[9.5rem_1fr] gap-3">
              <dt className="font-semibold">{family}</dt>
              <dd className="text-(--fg-muted)">{why}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Swatches */}
      <ul className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] border-b border-(--line)">
        {t.swatches.map(([token, value]) => (
          <li key={token} className="p-3 shadow-[inset_-1px_-1px_0_var(--line)]">
            <span className="block h-10 rounded-[8px] shadow-[inset_0_0_0_1px_oklch(0_0_0/0.08)]" style={{ background: value }} />
            <span className="mt-2 block font-(family-name:--f-mono) text-[12px]">{token}</span>
            <span className="block font-(family-name:--f-mono) text-[11px] text-(--fg-subtle)">{value.replace("oklch", "")}</span>
          </li>
        ))}
      </ul>

      {/* Mini hero */}
      <div className="grid grid-cols-1 gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1.25fr_1fr] lg:gap-12 lg:py-16">
        <div>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-(--fg-muted)">
            Est. July 2024 · {snapshotRepos.length - 2} tools · {builders} builders ·
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-(--live)" /> last commit 14h ago
            </span>
          </p>
          <h3 className="mt-5 max-w-[14ch] text-balance text-[44px] leading-[0.98] sm:text-[60px] lg:text-[68px]" style={display}>
            Software for everyone, built by <span style={t.emphasis}>anyone who shows up.</span>
          </h3>
          <p className="mt-6 max-w-[46ch] text-[17px] leading-[1.55] text-(--fg-muted)">
            A public workshop of developers, designers and writers making free, open-source tools. No paywalls. No
            interviews. Send a pull request and you&apos;re one of us.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-(--accent) px-6 text-[15px] font-medium text-(--accent-fg) transition-[background-color,scale] duration-150 hover:bg-(--accent-hover) active:scale-[0.97]"
            >
              Make your first PR →
            </a>
            <a
              href="#"
              className="inline-flex h-12 items-center rounded-full bg-(--surface) px-6 text-[15px] font-medium shadow-[0_0_0_1px_var(--line)] transition-[scale] duration-150 active:scale-[0.97]"
            >
              See the work
            </a>
          </div>
          <p className="mt-3 inline-flex h-11 max-w-full items-center gap-2 overflow-hidden rounded-[10px] bg-(--surface) px-3.5 font-(family-name:--f-mono) text-[13px] shadow-[0_0_0_1px_var(--line)]">
            <span className="text-(--fg-subtle)">$</span>
            <span className="truncate">gh repo fork Open-Dev-Society/OpenStock --clone</span>
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {/* Project card, signed */}
          <article className="rounded-[16px] bg-(--surface) p-5 shadow-[0_0_0_1px_var(--line),0_12px_32px_-18px_oklch(0_0_0/0.25)]">
            <div className="flex items-baseline justify-between gap-3">
              <h4 className="text-[24px] leading-none" style={display}>
                OpenStock
              </h4>
              <span className="font-(family-name:--f-mono) text-[13px] tabular-nums text-(--fg-muted)">
                ★ {compact(stock.stars)} · {compact(stock.forks)} forks
              </span>
            </div>
            <p className="mt-2 text-[15px] text-(--fg-muted)">Market prices, alerts and company data. Free.</p>
            <div className="mt-5 flex items-center justify-between gap-3 border-t border-(--line) pt-4">
              <span className="flex -space-x-1.5">
                {stockBuilders.slice(0, 5).map((c) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={c.login}
                    src={`${c.avatar_url}&s=64`}
                    alt=""
                    width={24}
                    height={24}
                    className="size-6 rounded-full ring-2 ring-(--surface)"
                  />
                ))}
              </span>
              <span className="text-[14px] text-(--fg-muted)">
                Signed by{" "}
                <span style={{ fontFamily: "var(--f-sign)", fontStyle: t.id === "ink" ? "italic" : undefined }} className="text-(--accent)">
                  {stockBuilders.length} builders
                </span>
              </span>
            </div>
          </article>

          {/* Index row */}
          <div className="grid grid-cols-[1fr_auto] items-baseline gap-x-3 border-y border-(--line) py-3 text-[15px]">
            <span>
              <span className="font-semibold">kitbash</span>
              <span className="text-(--fg-muted)"> · Tells your agent what already exists on GitHub.</span>
            </span>
            <span className="font-(family-name:--f-mono) text-[13px] tabular-nums text-(--fg-muted)">★ {kitbash.stars}</span>
          </div>

          {/* Quote */}
          <figure className="pt-2">
            <blockquote
              className="text-[22px] leading-[1.25]"
              style={t.id === "ink" ? { fontFamily: "var(--f-sign)", fontStyle: "italic", fontSize: 26 } : display}
            >
              “…great tools shouldn&apos;t hide behind logins or price tiers.”
            </blockquote>
            <figcaption className="mt-2 text-[13px] text-(--fg-muted)">Tattva Tarang · Medium · 2025</figcaption>
          </figure>
        </div>
      </div>

      {/* Wall + bench */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="bg-(--surface-2) px-5 py-8 sm:px-8">
          <p className="text-[13px] text-(--fg-muted)">The wall</p>
          <p className="mt-1 text-[22px] leading-tight" style={display}>
            {builders} people built all of this. Seat {builders + 1} is yours.
          </p>
          <ul className="mt-5 grid grid-cols-8 gap-1.5 sm:grid-cols-10">
            {snapshotContributors.slice(0, 13).map((c) => (
              <li key={c.login} className="aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${c.avatar_url}&s=96`} alt={c.login} className="size-full rounded-[8px] shadow-[0_0_0_1px_var(--line)]" />
              </li>
            ))}
            <li className="grid aspect-square place-items-center rounded-[8px] bg-(--mark) text-[18px] text-(--fg) shadow-[inset_0_0_0_1.5px_var(--accent)]">
              +
            </li>
          </ul>
          <p className="mt-3 text-[13px] text-(--fg-muted)">
            Seat {builders + 1} is open.{" "}
            <span style={{ fontFamily: "var(--f-sign)", fontStyle: t.id === "ink" ? "italic" : undefined }} className="text-[15px] text-(--accent)">
              Claim it
            </span>
          </p>
        </div>
        <div className="bg-(--inv-bg) px-5 py-8 text-(--inv-fg) sm:px-8">
          <p className="text-[13px] text-(--inv-fg-muted)">The bench</p>
          <div className="mt-3 rounded-[16px] bg-(--inv-surface) p-4 font-(family-name:--f-mono) text-[13px] leading-[1.7]">
            <p>
              <span className="text-(--inv-fg-muted)">$ </span>gh repo fork Open-Dev-Society/<span className="text-(--inv-accent)">OpenStock</span> --clone
            </p>
            <p>
              <span className="text-(--inv-fg-muted)">$ </span>cd <span className="text-(--inv-accent)">OpenStock</span> &amp;&amp; git switch -c{" "}
              <span className="rounded-[3px] bg-(--mark) px-0.5 text-(--fg)">you</span>/first-pr
            </p>
            <p>
              <span className="text-(--inv-fg-muted)">$ </span>gh pr create --fill --draft
            </p>
          </div>
          <p className="mt-4 text-[22px] leading-tight" style={display}>
            Technology should belong to <span style={{ ...t.emphasis, color: "var(--inv-accent)" }}>everyone.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
