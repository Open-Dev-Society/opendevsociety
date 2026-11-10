import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
import { ArrowRight, ArrowUpRight, GitFork, Star } from "lucide-react";
import { partners, events } from "@/data/partners";
import { mentions } from "@/data/mentions";
import { getWorkshop, type Repo } from "./data";
import { Nav } from "./Nav";
import { sections } from "./sections";
import { FirstPR } from "./FirstPR";
import { Wall } from "./Wall";
import { CopyChip } from "./Copy";
import openstockShot from "./shots/openstock.png";
import openreadmeShot from "./shots/openreadme.png";
import openhavenShot from "./shots/openhaven.png";

export const metadata: Metadata = {
  title: "Open Dev Society — a workshop for public-good software",
  description: "Developers, designers and writers shipping free, open-source tools. No paywalls. No gatekeeping.",
};

// Matches the GitHub lib's cache, so "last push 3h ago" stays roughly true.
export const revalidate = 3600;

const DISCORD = "https://discord.gg/9xywA3pj";
const FORK = "gh repo fork Open-Dev-Society/OpenStock --clone";

const shots: Record<string, StaticImageData> = { openreadme: openreadmeShot, openhaven: openhavenShot };
// Where each thumbnail is worth looking at.
const shotFocus: Record<string, string> = { openreadme: "object-[85%_72%]" };
const langColor: Record<string, string> = { TypeScript: "#3178c6", JavaScript: "#e3b341" };

const compact = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(n));
function ago(iso: string) {
  const d = (Date.now() - Date.parse(iso)) / 864e5;
  if (d < 1) return `${Math.max(1, Math.round(d * 24))}h ago`;
  if (d < 14) return `${Math.round(d)}d ago`;
  if (d < 60) return `${Math.round(d / 7)}w ago`;
  if (d < 365) return `${Math.round(d / 30)}mo ago`;
  return `${Math.round(d / 365)}y ago`;
}

// Mentions: strip wrapping quotes and turn inner ones into curly singles, so our own “ ” never double up.
const quoteText = (s: string) =>
  s
    .replace(/&amp;/g, "&")
    .trim()
    .replace(/^["“]|["”]$/g, "")
    .replace(/"([^"]*)"/g, "‘$1’");
const press = mentions.filter((m) => !m.author.startsWith("Ravi"));
const quotes = press.filter((m) => m.highlight).slice(0, 3);
const outlets = Object.values(
  press.reduce<Record<string, { name: string; url: string; n: number }>>((acc, m) => {
    const name = m.author
      .replace(/^.* (at|via) /, "")
      .replace("community-scripts/ProxmoxVE repository", "ProxmoxVE community");
    acc[name] ??= { name, url: m.url, n: 0 };
    acc[name].n++;
    return acc;
  }, {}),
);
const openStockPress = press.filter((m) => /openstock/i.test(m.title + m.description + m.url)).length;

// Written for this page: one concrete line per partner, never clamped.
const partnerLines: Record<string, string> = {
  "Siray.ai": "Unified AI infrastructure to run and scale models.",
  StellAILoom: "A global hub to publish and discover AI tools.",
  "Atlas Cloud": "One API for hundreds of AI models.",
};

const principles = [
  { title: "Default to open", body: "Every line of code and every lesson is public." },
  { title: "Permissionless", body: "No interviews. Fork it and send the PR." },
  { title: "Ship, then iterate", body: "Code over meetings. Release early, fix in public." },
  { title: "Distributed strength", body: "Everyone teaches, everyone learns, everyone gets credited by name." },
];

export default async function ConceptC() {
  const { repos, builders, totals, lastPush } = await getWorkshop();
  const [flagship, ...rest] = repos;
  // Open seats: at least 6, rounded so the 16-column wall ends on a full row.
  const open = 6 + ((16 - ((builders.length + 6) % 16)) % 16);
  const crew = builders.filter((b) => b.core);

  return (
    <>
      <Nav />
      <main id="top">
        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 pb-16 pt-10 sm:px-6 md:pt-16 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center lg:gap-10 lg:pb-24">
          <div>
            <p
              className="rise inline-flex items-center gap-2 rounded-full bg-(--card) py-1 pl-2.5 pr-3 text-[13px] text-(--ink-2) shadow-(--sh)"
              style={{ "--i": 0 } as React.CSSProperties}
            >
              <span className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-(--moss) opacity-40 motion-reduce:hidden" />
                <span className="relative size-2 rounded-full bg-(--moss)" />
              </span>
              Last push {ago(lastPush)} · open since July 2024
            </p>
            <h1
              className="rise display mt-5 text-[42px] leading-[0.95] sm:text-6xl lg:text-[58px] xl:text-[66px]"
              style={{ "--i": 1 } as React.CSSProperties}
            >
              <span className="lg:block">Software for everyone, </span>
              <span className="lg:block">
                built by <span className="text-(--accent)">anyone</span>{" "}
              </span>
              <span className="text-(--accent) lg:block">who shows up.</span>
            </h1>
            <p
              className="rise mt-6 max-w-xl text-[17px] leading-relaxed text-(--ink-2) sm:text-lg"
              style={{ "--i": 2 } as React.CSSProperties}
            >
              Open Dev Society is a workshop of developers, designers and writers shipping free, open-source tools. No
              paywalls, no gatekeeping, and your name on everything you ship.
            </p>
            <div className="rise mt-8 grid gap-3 sm:flex sm:flex-wrap" style={{ "--i": 3 } as React.CSSProperties}>
              <a
                href="#start"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-(--accent) pl-5 pr-4 font-medium text-white shadow-[0_1px_0_rgb(255_255_255/0.25)_inset,0_6px_16px_-6px_rgb(207_83_32/0.6)] transition-[background-color,scale] duration-150 hover:bg-(--accent-2) active:scale-[0.96]"
              >
                Make your first PR
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2} />
              </a>
              <a
                href="#work"
                className="inline-flex h-12 items-center justify-center rounded-full bg-(--card) px-5 font-medium shadow-(--sh) transition-[box-shadow,scale] duration-150 hover:shadow-(--sh-hi) active:scale-[0.96]"
              >
                See what we&apos;ve shipped
              </a>
            </div>
            <dl
              className="rise mt-8 hidden flex-wrap gap-x-6 gap-y-2 text-[15px] text-(--ink-2) sm:flex"
              style={{ "--i": 4 } as React.CSSProperties}
            >
              {[
                [compact(totals.stars), "stars"],
                [compact(totals.forks), "forks"],
                [String(totals.builders), "builders"],
                [String(mentions.length), "press mentions"],
              ].map(([v, k]) => (
                <div key={k} className="flex items-baseline gap-1.5">
                  <dt className="sr-only">{k}</dt>
                  <dd className="font-semibold tabular-nums text-(--ink)">{v}</dd>
                  <dd aria-hidden>{k}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Proof object: the thing we built, pinned to the bench */}
          <figure className="rise relative" style={{ "--i": 3 } as React.CSSProperties}>
            <div className="absolute -inset-3 -z-10 hidden rotate-[1.5deg] rounded-[28px] bg-(--paper-2) sm:block" aria-hidden />
            <div className="rounded-3xl bg-(--card) p-2 shadow-(--sh-hi)">
              <a href={flagship.homepage ?? flagship.url} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-2xl">
                <Image
                  src={openstockShot}
                  alt="OpenStock's dashboard: index prices for the S&P 500, Nasdaq 100, Dow 30 and Russell 2000"
                  priority
                  sizes="(min-width: 1024px) 540px, 100vw"
                  className="avatar h-[220px] w-full rounded-2xl object-cover object-top sm:h-auto"
                />
              </a>
              <figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-3 pb-1.5 pt-3 text-sm">
                <span className="font-medium">OpenStock</span>
                <span className="tabular-nums text-(--ink-2)">
                  ★ {compact(flagship.stars)} · {compact(flagship.forks)} forks · built by {flagship.contributors} people
                </span>
              </figcaption>
              <ul className="mt-1 hidden rounded-2xl bg-(--paper) p-1 sm:block">
                {rest.slice(0, 3).map((r) => (
                  <li key={r.name}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl px-3 py-2 text-sm transition-[background-color] duration-150 hover:bg-(--card)"
                    >
                      <span className="truncate">
                        <span className="font-medium">{r.name}</span>
                        <span className="text-(--ink-3)"> · {r.tags.join(", ")}</span>
                      </span>
                      <span className="text-[13px] tabular-nums text-(--ink-3)">{ago(r.pushedAt)}</span>
                    </a>
                  </li>
                ))}
                <li>
                  <a href="#work" className="block rounded-xl px-3 py-2 text-sm text-(--accent-2) transition-[background-color] duration-150 hover:bg-(--card)">
                    +{rest.length - 3} more in the workshop →
                  </a>
                </li>
              </ul>
            </div>
            <span className="absolute -right-2 -top-3 rotate-[6deg] rounded-md border-2 border-(--accent) bg-(--paper) px-2 py-0.5 font-mono text-xs font-bold uppercase tracking-widest text-(--accent) shadow-(--sh) sm:-right-4">
              Forever free
            </span>
          </figure>
        </section>

        {/* ── Work ─────────────────────────────────────────── */}
        <section id="work" className="pad-section mx-auto max-w-6xl px-4 sm:px-6">
          <Head
            n="01"
            kicker="Work"
            title={`${compact(totals.stars)} stars across ${totals.repos} repos, all built in the open.`}
            route="/projects"
            routeLabel={`All ${totals.repos} projects`}
          />

          <Flagship repo={flagship} />

          <div className="-mx-4 mt-3 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-12 md:overflow-visible md:px-0 md:pb-0">
            {[...rest].sort((a, b) => Number(!!shots[b.name]) - Number(!!shots[a.name])).map((r) => (
              <Tile key={r.name} repo={r} shot={shots[r.name]} />
            ))}
          </div>
        </section>

        {/* ── People: full-bleed band ──────────────────────── */}
        <section id="people" className="pad-section bg-(--paper-2)">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
              <div className="max-w-2xl">
                <Kicker n="02" label="People" />
                <h2 className="display-md mt-3 text-[34px] leading-[1.05] sm:text-[44px]">
                  {totals.builders} people built this. Every one credited by name.
                </h2>
              </div>
              <p className="font-mono text-[13px] tabular-nums text-(--ink-2)">
                {totals.builders} builders · {open} open seats
              </p>
            </div>

            <Wall builders={builders} open={open} />

            <div className="mt-8 flex flex-col justify-between gap-4 text-[15px] text-(--ink-2) md:flex-row md:items-start">
              <p className="max-w-2xl">
                <span className="mr-2 inline-block size-2.5 rounded-full ring-2 ring-(--accent) ring-offset-1 ring-offset-(--paper-2)" />
                Core crew:{" "}
                {crew.map((c, i) => (
                  <span key={c.login}>
                    <span className="font-medium text-(--ink)">{c.name}</span> ({c.role?.toLowerCase()})
                    {i < crew.length - 1 ? ", " : "."}
                  </span>
                ))}
              </p>
              <a href="#start" className="shrink-0 font-medium text-(--accent-2) underline decoration-(--accent)/30 underline-offset-4 hover:decoration-(--accent)">
                The dashed seat is yours. Here&apos;s how →
              </a>
            </div>
          </div>
        </section>

        {/* ── Start: the workbench, an ink band ────────────── */}
        <section id="start" className="pad-section bg-(--ink) text-(--paper)">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
              <div className="max-w-2xl">
                <Kicker n="03" label="Start" dark />
                <h2 className="display-md mt-3 text-[34px] leading-[1.05] text-white sm:text-[44px]">
                  From visitor to first PR, in four steps.
                </h2>
              </div>
              <a href="/contribute" className="group inline-flex items-center gap-1.5 text-sm font-medium text-white/70 transition-colors duration-150 hover:text-white">
                Contributor handbook
                <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
            </div>
            <FirstPR repos={repos.map((r) => ({ name: r.name, openIssues: r.openIssues, goodFirst: r.goodFirst }))} />
          </div>
        </section>

        {/* ── Signal: press + partners ─────────────────────── */}
        <section id="signal" className="pad-section mx-auto max-w-6xl px-4 sm:px-6">
          <Head n="04" kicker="Signal" title="What people wrote about the work." route="/word-of-mouth" routeLabel={`All ${mentions.length} mentions`} />

          <div className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0">
            {quotes.map((m) => (
              <a
                key={m.url}
                href={m.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-[82vw] max-w-sm shrink-0 snap-start flex-col justify-between gap-6 rounded-2xl bg-(--card) p-5 shadow-(--sh) transition-[box-shadow,translate] duration-200 hover:-translate-y-0.5 hover:shadow-(--sh-hi) md:w-auto md:max-w-none"
              >
                <p className="display-sm text-lg font-medium leading-snug">“{quoteText(m.highlight!)}”</p>
                <span className="flex items-center justify-between gap-3 text-sm text-(--ink-2)">
                  {m.author}
                  <ArrowUpRight className="size-4 shrink-0 text-(--ink-3) transition-[color,translate] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-(--ink)" />
                </span>
              </a>
            ))}
          </div>

          <p className="mt-6 text-[15px] leading-loose text-(--ink-2)">
            <span className="mr-2 text-(--ink-3)">Also covered by</span>
            {outlets.map((o, i) => (
              <span key={o.name}>
                <a href={o.url} target="_blank" rel="noopener noreferrer" className="font-medium text-(--ink) underline decoration-(--line) underline-offset-4 transition-[text-decoration-color] duration-150 hover:decoration-(--accent)">
                  {o.name}
                </a>
                {o.n > 1 && <span className="text-(--ink-3)"> ×{o.n}</span>}
                {i < outlets.length - 1 && <span className="mx-2 text-(--ink-3)">·</span>}
              </span>
            ))}
          </p>

          <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_2fr]">
            <div>
              <h3 className="display-md text-2xl">Who backs the work</h3>
              <p className="mt-2 text-[15px] text-(--ink-2)">
                Community partner at{" "}
                {events.map((e, i) => (
                  <span key={e.name}>
                    <span className="font-medium text-(--ink)">{e.name}</span> ({e.organizer}){i < events.length - 1 ? " and " : `, ${e.date}.`}
                  </span>
                ))}
              </p>
              <a href="/partners#partner-cta" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-(--accent-2) underline decoration-(--accent)/30 underline-offset-4 hover:decoration-(--accent)">
                Partner with us <ArrowRight className="size-3.5" />
              </a>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {partners.map((p) => (
                <a
                  key={p.name}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl bg-(--card) p-4 shadow-(--sh) transition-[box-shadow] duration-200 hover:shadow-(--sh-hi) sm:flex-col sm:items-start"
                >
                  <span className="flex h-10 w-28 shrink-0 items-center sm:w-auto">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.logo}
                      alt={p.name}
                      className="h-7 w-auto max-w-full object-contain sm:h-8 sm:max-w-[140px] opacity-80 grayscale transition-[opacity,filter] duration-200 group-hover:opacity-100 group-hover:grayscale-0"
                      style={p.invertLogo ? { filter: "invert(1)" } : undefined}
                    />
                  </span>
                  <span className="text-sm text-(--ink-2)">{partnerLines[p.name] ?? p.description}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── Principles, condensed ────────────────────────── */}
        <section id="principles" className="pad-section mx-auto max-w-6xl border-t border-(--line) px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
            <div>
              <Kicker n="05" label="Principles" />
              <blockquote className="display-md mt-4 text-[22px] leading-snug sm:text-[32px]">
                “Knowledge is hidden behind paywalls. Tools are locked in subscriptions. Newcomers are told they&apos;re not
                good enough. We believe there&apos;s a better way.”
              </blockquote>
              <a href="/manifesto" className="group mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-(--ink-2) transition-colors duration-150 hover:text-(--ink)">
                Read the full manifesto
                <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
            </div>
            <div>
              <ol className="divide-y divide-(--line) border-y border-(--line)">
                {principles.map((p, i) => (
                  <li key={p.title} className="grid grid-cols-[2.25rem_1fr] gap-x-3 py-3.5 sm:grid-cols-[2.5rem_13rem_1fr] sm:py-4">
                    <span className="font-mono text-sm tabular-nums text-(--accent-2)">0{i + 1}</span>
                    <h3 className="display-sm text-lg font-semibold">{p.title}</h3>
                    <p className="col-start-2 text-[15px] text-(--ink-2) sm:col-start-3">{p.body}</p>
                  </li>
                ))}
              </ol>
              <div className="mt-6 rounded-2xl bg-(--ink) p-5 text-(--paper)">
                <p className="text-sm font-medium text-(--accent)">The promise</p>
                <ul className="mt-2 space-y-1 text-[15px] font-medium">
                  <li>We will never lock knowledge.</li>
                  <li>We will never charge for access.</li>
                  <li>We will never trade trust for money.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer: the last CTA ─────────────────────────── */}
      <footer className="bg-(--ink) text-(--paper)">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <p className="display max-w-3xl text-[40px] leading-[1] text-white sm:text-6xl">
            There&apos;s a seat with <span className="text-(--accent)">your name</span> on it.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center">
            <a
              href="#start"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-(--accent) px-5 font-medium text-white transition-[background-color,scale] duration-150 hover:bg-(--accent-2) active:scale-[0.96]"
            >
              Make your first PR <ArrowRight className="size-4" strokeWidth={2} />
            </a>
            <a
              href={DISCORD}
              className="inline-flex h-12 items-center justify-center rounded-full px-5 font-medium text-white shadow-[inset_0_0_0_1px_rgb(255_255_255/0.2)] transition-[background-color,scale] duration-150 hover:bg-white/10 active:scale-[0.96]"
            >
              Join the Discord
            </a>
            <div className="hidden sm:block">
              <CopyChip text={FORK} />
            </div>
          </div>

          <div className="mt-14 grid grid-cols-3 gap-4 text-sm sm:gap-8">
            <FooterCol title="The society" links={sections.map((s) => [s.route, s.label === "Signal" ? "Word of mouth" : s.label])} />
            <FooterCol title="More" links={[["/partners", "Partners"], ["/certificate", "Certificates"], ["/contribute#values", "Code of conduct"]]} />
            <FooterCol
              title="Elsewhere"
              links={[
                ["https://github.com/Open-Dev-Society", "GitHub"],
                [DISCORD, "Discord"],
                ["https://www.linkedin.com/company/opendevsociety-in/", "LinkedIn"],
                ["https://x.com/opendevsociety", "X / Twitter"],
                ["mailto:opendevsociety@gmail.com", "Email"],
              ]}
            />
          </div>
          <p className="mt-14 border-t border-white/10 pt-6 text-[13px] text-white/50">
            Founded July 2024 by Ravi Pratap Singh. Repo numbers come from GitHub and refresh hourly.
          </p>
        </div>
      </footer>
    </>
  );
}

function Kicker({ n, label, dark }: { n: string; label: string; dark?: boolean }) {
  return (
    <p className="flex items-center gap-2 text-sm font-medium">
      <span className={`font-mono text-xs tabular-nums ${dark ? "text-white/50" : "text-(--ink-3)"}`}>{n}</span>
      <span className={dark ? "text-(--accent)" : "text-(--accent-2)"}>{label}</span>
    </p>
  );
}

function Head({ n, kicker, title, route, routeLabel }: { n: string; kicker: string; title: string; route: string; routeLabel: string }) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
      <div className="max-w-2xl">
        <Kicker n={n} label={kicker} />
        <h2 className="display-md mt-3 text-[34px] leading-[1.05] sm:text-[44px]">{title}</h2>
      </div>
      <a href={route} className="group inline-flex items-center gap-1.5 text-sm font-medium text-(--ink-2) transition-colors duration-150 hover:text-(--ink)">
        {routeLabel}
        <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}

function Lang({ language }: { language: string | null }) {
  if (!language) return null;
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="size-2 rounded-full" style={{ background: langColor[language] ?? "var(--ink-3)" }} />
      {language}
    </span>
  );
}

// Star counts only when they say something; small repos show who built them and when they last moved.
function Meta({ repo }: { repo: Repo }) {
  return (
    <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] tabular-nums text-(--ink-2)">
      <Lang language={repo.language} />
      {repo.stars >= 50 ? (
        <span className="inline-flex items-center gap-1">
          <Star className="size-3.5" strokeWidth={1.75} />
          {compact(repo.stars)}
        </span>
      ) : (
        repo.contributors > 0 && (
          <span>
            {repo.contributors} {repo.contributors === 1 ? "builder" : "builders"}
          </span>
        )
      )}
      <span>updated {ago(repo.pushedAt)}</span>
    </span>
  );
}

function Flagship({ repo }: { repo: Repo }) {
  return (
    <article className="group relative grid overflow-hidden rounded-3xl bg-(--card) shadow-(--sh) transition-[box-shadow,translate] duration-200 hover:-translate-y-0.5 hover:shadow-(--sh-hi) lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="flex flex-col p-5 sm:p-7">
        <div className="flex flex-wrap gap-1.5">
          {repo.tags.map((t, i) => (
            <span key={t} className={`rounded-full px-2.5 py-0.5 text-xs ${i === 0 ? "bg-(--accent) text-white" : "bg-(--paper-2) text-(--ink-2)"}`}>
              {t}
            </span>
          ))}
        </div>
        <h3 className="display-md mt-5 text-[36px] leading-none">
          <a href={repo.url} target="_blank" rel="noopener noreferrer" className="after:absolute after:inset-0 after:rounded-3xl">
            {repo.name}
          </a>
        </h3>
        <p className="mt-3 max-w-md text-[17px] leading-relaxed text-(--ink-2)">{repo.blurb}</p>
        <div className="mt-5 hidden flex-wrap gap-1.5 sm:flex">
          {["Next.js", "TypeScript", "MongoDB", "Inngest", "TradingView", "Finnhub"].map((s) => (
            <span key={s} className="rounded-md px-2 py-1 font-mono text-xs text-(--ink-2) shadow-[inset_0_0_0_1px_var(--line)]">
              {s}
            </span>
          ))}
        </div>
        <figure className="mt-6 hidden rounded-2xl bg-(--paper) p-4 sm:block">
          <blockquote className="text-[15px] leading-relaxed">“Great tools shouldn&apos;t hide behind logins or price tiers.”</blockquote>
          <figcaption className="mt-1.5 text-[13px] text-(--ink-2)">Tattva Tarang on Medium · covered by {openStockPress} outlets</figcaption>
        </figure>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
          <span className="flex items-center gap-4 text-[15px] tabular-nums">
            <span className="inline-flex items-center gap-1.5 font-semibold">
              <Star className="size-4" strokeWidth={1.75} />
              {compact(repo.stars)}
            </span>
            <span className="inline-flex items-center gap-1.5 text-(--ink-2)">
              <GitFork className="size-4" strokeWidth={1.75} />
              {compact(repo.forks)}
            </span>
            <span className="text-(--ink-2)">{repo.contributors} builders</span>
          </span>
          <span className="relative z-10 flex gap-2">
            {repo.goodFirst > 0 && (
              <a
                href={`${repo.url}/issues?q=${encodeURIComponent('is:issue is:open label:"good first issue"')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-full bg-(--paper) px-3 py-1.5 text-[13px] font-medium text-(--ink-2) transition-[background-color,color] duration-150 hover:bg-(--accent-soft) hover:text-(--accent-2)"
              >
                {repo.goodFirst} first issues <ArrowUpRight className="size-3.5" />
              </a>
            )}
            {repo.homepage && (
              <a href={repo.homepage} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full bg-(--ink) px-3 py-1.5 text-[13px] font-medium text-(--paper) transition-[background-color] duration-150 hover:bg-black">
                Live site <ArrowUpRight className="size-3.5" />
              </a>
            )}
          </span>
        </div>
      </div>
      <div className="relative hidden min-h-[360px] overflow-hidden bg-[#0b0b0b] lg:block">
        <Image src={openstockShot} alt="" sizes="600px" className="absolute left-8 top-8 w-[150%] max-w-none rounded-tl-xl shadow-[0_0_0_1px_rgb(255_255_255/0.08)]" />
      </div>
    </article>
  );
}

function Tile({ repo, shot }: { repo: Repo; shot?: StaticImageData }) {
  return (
    <article
      className={`group relative flex w-[78vw] max-w-sm shrink-0 snap-start flex-col overflow-hidden rounded-3xl bg-(--card) shadow-(--sh) transition-[box-shadow,translate] duration-200 hover:-translate-y-0.5 hover:shadow-(--sh-hi) md:w-auto md:max-w-none ${
        shot ? "md:col-span-6" : "md:col-span-6 lg:col-span-3"
      }`}
    >
      {shot && (
        <div className="relative h-36 overflow-hidden bg-(--paper-2) sm:h-44">
          <Image src={shot} alt="" sizes="(min-width: 768px) 560px, 78vw" className={`size-full object-cover ${shotFocus[repo.name] ?? "object-top"}`} />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="display-sm text-[22px] font-semibold leading-tight">
          <a href={repo.url} target="_blank" rel="noopener noreferrer" className="after:absolute after:inset-0 after:rounded-3xl">
            {repo.name}
          </a>
        </h3>
        <p className="mt-1.5 text-[15px] leading-relaxed text-(--ink-2)">{repo.blurb}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
          <Meta repo={repo} />
          {repo.homepage && (
            <a
              href={repo.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-flex items-center gap-1 rounded-full bg-(--paper) px-2.5 py-1 text-[13px] font-medium text-(--ink-2) transition-[background-color,color] duration-150 hover:bg-(--accent-soft) hover:text-(--accent-2)"
            >
              Live <ArrowUpRight className="size-3.5" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function FooterCol({ title, links }: { title: string; links: string[][] }) {
  return (
    <div>
      <p className="text-[13px] font-medium text-white/50">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map(([href, label]) => (
          <li key={href + label}>
            <a href={href} className="text-white/75 transition-colors duration-150 hover:text-white">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
