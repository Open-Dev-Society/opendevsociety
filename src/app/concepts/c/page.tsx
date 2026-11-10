import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight, CircleDot, GitFork, Star } from "lucide-react";
import { fallbackStats } from "@/data/fallback";
import { manualContributors } from "@/data/contributors";
import { partners, events } from "@/data/partners";
import { mentions } from "@/data/mentions";
import { Nav } from "./Nav";
import { sections } from "./sections";
import { FirstPR } from "./FirstPR";

export const metadata: Metadata = {
  title: "Open Dev Society — a workshop for public-good software",
  description: "Developers, designers and writers shipping free, open-source tools. No paywalls. No gatekeeping.",
};

const ORG = "https://github.com/Open-Dev-Society";

// ponytail: concept copy; production should use each repo's GitHub description.
const blurbs: Record<string, string> = {
  OpenStock:
    "Real-time prices, personalised alerts and company insights. The free, open alternative to paywalled market terminals.",
  openreadme: "Bento-style GitHub profile banners with live stats. Your README, minus the config.",
  booktrace: "A gateway to free books: find where knowledge is already open.",
  opencosmos: "Space, visualised for the curious.",
  ByteMyCV: "Resume tooling for developers getting their first break.",
  OpenCine: "Open media discovery, without the walled garden.",
  openhaven: "A calmer corner of the internet for peer support.",
};

const repos = fallbackStats.list;
const fmt = (n: number) => n.toLocaleString("en-US");
const clean = (s: string) => s.replace(/&amp;/g, "&").replace(/^"([^]*)"$/, "$1");

const openStockPress = mentions.filter((m) => /openstock/i.test(m.title + m.description + m.url));
const quotes = mentions.filter((m) => m.highlight && !m.author.startsWith("Ravi")).slice(0, 3);

const principles = [
  {
    title: "Default to open",
    body: "All code is open-source. All knowledge is public. Transparency is the only way to build trust at scale.",
  },
  {
    title: "Permissionless access",
    body: "No gatekeepers. No interviews. You don't need permission to fork, contribute, or start building.",
  },
  {
    title: "Ship, then iterate",
    body: "We solve real problems with code, not endless meetings. Release early, improve in public.",
  },
  {
    title: "Distributed strength",
    body: "We mentor the next generation and lift each other up. Everyone teaches, everyone learns.",
  },
];

// Spans for the 12-col bento, in featuredModules order.
const spans = [
  "md:col-span-7 md:row-span-2",
  "md:col-span-5",
  "md:col-span-5",
  ...Array(4).fill("md:col-span-6 lg:col-span-3"),
];

const SEATS = 40;

export default function ConceptC() {
  const crew = manualContributors;
  const [flagship, ...rest] = repos;

  return (
    <>
      <Nav />
      <main id="top">
        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="mx-auto grid max-w-6xl gap-12 px-4 pb-16 pt-14 sm:px-6 md:pt-20 grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center lg:gap-16 lg:pb-24">
          <div>
            <p
              className="rise inline-flex items-center gap-2 rounded-full bg-(--card) py-1 pl-2 pr-3 text-[13px] text-(--ink-2) shadow-(--sh)"
              style={{ "--i": 0 } as React.CSSProperties}
            >
              <span className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-(--moss) opacity-40 motion-reduce:hidden" />
                <span className="relative size-2 rounded-full bg-(--moss)" />
              </span>
              {repos.length} projects shipped · open since July 2024
            </p>
            <h1
              className="rise display mt-6 text-[44px] font-semibold leading-[0.98] sm:text-6xl lg:text-[76px]"
              style={{ "--i": 1 } as React.CSSProperties}
            >
              Software for everyone, built by <span className="text-(--accent)">anyone who shows up.</span>
            </h1>
            <p
              className="rise mt-6 max-w-xl text-lg leading-relaxed text-(--ink-2)"
              style={{ "--i": 2 } as React.CSSProperties}
            >
              Open Dev Society is a workshop of developers, designers and writers shipping free, open-source public goods.
              No paywalls. No gatekeeping. Just code.
            </p>
            <div className="rise mt-8 flex flex-wrap gap-3" style={{ "--i": 3 } as React.CSSProperties}>
              <a
                href="#start"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-(--accent) pl-5 pr-4 font-medium text-white shadow-[0_1px_0_rgb(255_255_255/0.25)_inset,0_6px_16px_-6px_rgb(207_83_32/0.6)] transition-[background-color,scale] duration-150 hover:bg-(--accent-2) active:scale-[0.96]"
              >
                Make your first PR
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2} />
              </a>
              <a
                href="#work"
                className="inline-flex h-12 items-center rounded-full bg-(--card) px-5 font-medium shadow-(--sh) transition-[box-shadow,scale] duration-150 hover:shadow-(--sh-hi) active:scale-[0.96]"
              >
                See what we&apos;ve shipped
              </a>
            </div>
          </div>

          {/* Build sheet: the whole org at a glance */}
          <div className="rise relative" style={{ "--i": 4 } as React.CSSProperties}>
            <div className="absolute -inset-3 -z-10 hidden rotate-[1.5deg] sm:block rounded-[28px] bg-(--paper-2)" aria-hidden />
            <div className="rounded-3xl bg-(--card) p-2 shadow-(--sh-hi)">
              <div className="flex items-center justify-between px-3 pb-2 pt-2.5">
                <span className="font-mono text-[11px] uppercase tracking-wider text-(--ink-3)">Build sheet · main</span>
                <span className="font-mono text-[11px] text-(--ink-3)">{repos.length} modules</span>
              </div>
              <ul className="rounded-2xl bg-(--paper) p-1">
                {repos.map((r, i) => (
                  <li key={r.id}>
                    <a
                      href={r.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl px-3 py-2.5 transition-[background-color] duration-150 hover:bg-(--card)"
                    >
                      <span className="font-mono text-[11px] tabular-nums text-(--ink-3)">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex min-w-0 items-center gap-2">
                        <span className="truncate font-medium">{r.name}</span>
                        <span className="hidden truncate text-xs text-(--ink-3) sm:inline">{r.customTags?.join(" · ")}</span>
                      </span>
                      <span className="flex items-center gap-1 font-mono text-xs tabular-nums text-(--ink-2)">
                        <Star className="size-3" strokeWidth={2} />
                        {fmt(r.stargazers_count)}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between px-3 pb-1.5 pt-3">
                <div className="flex -space-x-1.5">
                  {crew.map((c) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={c.login}
                      src={c.avatar_url}
                      alt={c.name ?? c.login}
                      width={24}
                      height={24}
                      className="avatar size-6 rounded-full bg-(--paper-2) ring-2 ring-(--card)"
                    />
                  ))}
                </div>
                <span className="font-mono text-xs tabular-nums text-(--ink-2)">★ {fmt(fallbackStats.stars)} total</span>
              </div>
            </div>
            <span className="absolute -bottom-4 -left-2 rotate-[-6deg] rounded-md border-2 border-(--accent) bg-(--paper) px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-widest text-(--accent) sm:-left-5">
              Forever free
            </span>
          </div>
        </section>

        {/* Stats strip */}
        <div className="border-y border-(--line)">
          <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-(--line) md:grid-cols-4">
            {[
              ["1,000+", "members"],
              [String(repos.length), "projects shipped"],
              [fmt(fallbackStats.stars), "GitHub stars"],
              [String(mentions.length), "mentions in the wild"],
            ].map(([v, k]) => (
              <div key={k} className="flex flex-col-reverse bg-(--paper) px-4 py-5 sm:px-6">
                <dt className="mt-0.5 text-sm text-(--ink-2)">{k}</dt>
                <dd className="display text-3xl font-semibold tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ── Work ─────────────────────────────────────────── */}
        <Section
          id="work"
          n="01"
          kicker="Work"
          title="Things we built, and still maintain."
          route="/projects"
          routeLabel="All projects"
        >
          <div className="grid gap-3 md:auto-rows-[minmax(190px,auto)] md:grid-cols-12">
            <Tile repo={flagship} index={0} className={spans[0]} flagship />
            {rest.map((r, i) => (
              <Tile key={r.id} repo={r} index={i + 1} className={spans[i + 1]} />
            ))}
          </div>
          <p className="mt-4 font-mono text-[11px] text-(--ink-3)">
            Snapshot data. In production, stars, forks and issues are read live from the GitHub API.
          </p>
        </Section>

        {/* ── Principles ───────────────────────────────────── */}
        <Section
          id="principles"
          n="02"
          kicker="Principles"
          title="Four rules every decision runs through."
          route="/manifesto"
          routeLabel="Read the manifesto"
        >
          <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr] lg:gap-12">
            <div className="flex flex-col gap-4">
              <blockquote className="display text-2xl font-medium leading-snug text-(--ink) sm:text-[28px]">
                &ldquo;Knowledge is hidden behind paywalls. Tools are locked in subscriptions. Newcomers are told
                they&apos;re not good enough. We believe there&apos;s a better way.&rdquo;
              </blockquote>
              <div className="mt-2 rounded-2xl bg-(--ink) p-5 text-(--paper)">
                <p className="font-mono text-[11px] uppercase tracking-wider text-white/50">The promise</p>
                <ul className="mt-3 space-y-1.5 text-[15px] font-medium">
                  <li>We will never lock knowledge.</li>
                  <li>We will never charge for access.</li>
                  <li>We will never trade trust for money.</li>
                </ul>
                <p className="mt-4 text-sm text-white/55">Running on transparency, donations, and community strength.</p>
              </div>
            </div>
            <ol className="divide-y divide-(--line) border-y border-(--line)">
              {principles.map((p, i) => (
                <li key={p.title} className="group grid grid-cols-[2.5rem_1fr] gap-x-4 py-6 sm:grid-cols-[3rem_14rem_1fr]">
                  <span className="font-mono text-sm tabular-nums text-(--accent)">0{i + 1}</span>
                  <h3 className="display text-xl font-semibold">{p.title}</h3>
                  <p className="col-start-2 mt-1 text-[15px] leading-relaxed text-(--ink-2) sm:col-start-3 sm:mt-0">{p.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </Section>

        {/* ── People ───────────────────────────────────────── */}
        <Section
          id="people"
          n="03"
          kicker="People"
          title="Built by people, credited by name."
          route="/contributors"
          routeLabel="All contributors"
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {crew.map((c) => (
              <a
                key={c.login}
                href={c.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-2xl bg-(--card) p-3 shadow-(--sh) transition-[box-shadow,translate] duration-200 hover:-translate-y-0.5 hover:shadow-(--sh-hi)"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.avatar_url}
                  alt=""
                  width={48}
                  height={48}
                  loading="lazy"
                  className="avatar size-12 rounded-xl bg-(--paper-2)"
                />
                <span className="min-w-0">
                  <span className="block truncate font-medium">{c.name ?? c.login}</span>
                  <span className="block truncate text-sm text-(--ink-2)">{c.role?.replace(/.*\/\/\s*/, "")}</span>
                  <span className="block truncate font-mono text-[11px] text-(--ink-3)">@{c.login}</span>
                </span>
              </a>
            ))}
          </div>

          <div className="mt-6 rounded-3xl bg-(--card) p-4 shadow-(--sh) sm:p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="display text-lg font-semibold">The wall</h3>
              <p className="text-sm text-(--ink-2)">Every merged PR takes a seat. Filled live from contributor graphs across all repos.</p>
            </div>
            <ul className="mt-5 grid grid-cols-8 gap-1.5 sm:grid-cols-12 lg:grid-cols-[repeat(20,minmax(0,1fr))]">
              {Array.from({ length: SEATS }, (_, i) => {
                const c = crew[i];
                return (
                  <li key={i} className="aspect-square">
                    {c ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={c.avatar_url}
                        alt={c.name ?? c.login}
                        title={c.name ?? c.login}
                        loading="lazy"
                        className="avatar size-full rounded-lg bg-(--paper-2)"
                      />
                    ) : (
                      <a
                        href="#start"
                        aria-label="Open seat: make your first PR"
                        className="group grid size-full place-items-center rounded-lg bg-(--paper) shadow-[inset_0_0_0_1px_var(--line-2)] transition-[background-color,box-shadow] duration-150 hover:bg-(--accent-soft) hover:shadow-[inset_0_0_0_1px_var(--accent)]"
                      >
                        <span className="text-xs text-(--ink-3) opacity-0 transition-opacity duration-150 group-hover:text-(--accent-2) group-hover:opacity-100">
                          +
                        </span>
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 text-sm text-(--ink-3)">
              Hover an empty seat: it&apos;s yours. <a href="#start" className="text-(--accent-2) underline underline-offset-4">Here&apos;s how →</a>
            </p>
          </div>
        </Section>

        {/* ── Signal: word of mouth + partners ─────────────── */}
        <Section
          id="signal"
          n="04"
          kicker="Signal"
          title="What people wrote when they found our work."
          route="/word-of-mouth"
          routeLabel={`All ${mentions.length} mentions`}
        >
          <div className="grid gap-3 md:grid-cols-3">
            {quotes.map((m) => (
              <a
                key={m.url}
                href={m.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between gap-6 rounded-2xl bg-(--card) p-5 shadow-(--sh) transition-[box-shadow,translate] duration-200 hover:-translate-y-0.5 hover:shadow-(--sh-hi)"
              >
                <p className="display text-lg font-medium leading-snug">&ldquo;{clean(m.highlight!)}&rdquo;</p>
                <span className="flex items-center justify-between text-sm text-(--ink-2)">
                  {m.author}
                  <ArrowUpRight className="size-4 shrink-0 text-(--ink-3) transition-[color,translate] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-(--ink)" />
                </span>
              </a>
            ))}
          </div>

          <ul className="mt-6 divide-y divide-(--line) border-y border-(--line)">
            {mentions.slice(0, 8).map((m) => (
              <li key={m.url}>
                <a
                  href={m.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid grid-cols-[5rem_1fr_auto] items-baseline gap-3 py-3 text-sm transition-[background-color] duration-150 hover:bg-(--card) sm:grid-cols-[6rem_14rem_1fr_auto] sm:px-2"
                >
                  <span className="font-mono text-[11px] uppercase tracking-wider text-(--ink-3)">{m.source}</span>
                  <span className="truncate font-medium">{m.author.replace(/ (at|via) .*/, "")}</span>
                  <span className="hidden truncate text-(--ink-2) sm:block">{clean(m.title)}</span>
                  <span className="font-mono text-[11px] tabular-nums text-(--ink-3)">{m.date}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_2fr]">
            <div>
              <h3 className="display text-2xl font-semibold">Partners & events</h3>
              <p className="mt-2 text-[15px] text-(--ink-2)">
                Organizations and events powering the mission to make open source accessible to everyone.
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
                  className="group flex flex-col gap-4 rounded-2xl bg-(--card) p-4 shadow-(--sh) transition-[box-shadow,translate] duration-200 hover:-translate-y-0.5 hover:shadow-(--sh-hi)"
                >
                  <span className="flex h-10 items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.logo}
                      alt={p.name}
                      className="h-8 w-auto max-w-[140px] object-contain opacity-80 grayscale transition-[opacity,filter] duration-200 group-hover:opacity-100 group-hover:grayscale-0"
                      style={p.invertLogo ? { filter: "invert(1)" } : undefined}
                    />
                  </span>
                  <span className="line-clamp-3 text-sm text-(--ink-2)">{p.description}</span>
                </a>
              ))}
              {events.map((e) => (
                <div key={e.name} className="flex items-center justify-between gap-3 rounded-2xl p-4 shadow-[inset_0_0_0_1px_var(--line)] sm:col-span-3 sm:py-3">
                  <span className="min-w-0">
                    <span className="block font-medium">{e.name}</span>
                    <span className="block text-sm text-(--ink-2)">by {e.organizer}</span>
                  </span>
                  <span className="shrink-0 rounded-full bg-(--accent-soft) px-2.5 py-1 font-mono text-[11px] text-(--accent-2)">
                    {e.role} · {e.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── Start ────────────────────────────────────────── */}
        <Section
          id="start"
          n="05"
          kicker="Start"
          title="From visitor to first PR, in four steps."
          route="/contribute"
          routeLabel="Contributor handbook"
        >
          <FirstPR repos={repos.map((r) => r.name)} />
        </Section>
      </main>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="bg-(--ink) text-(--paper)">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <p className="display max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
            Let&apos;s build the future together, <span className="text-(--accent)">openly.</span>
          </p>
          <div className="mt-14 grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
            <FooterCol
              title="The society"
              links={sections.map((s) => [s.route, s.label === "Signal" ? "Word of mouth" : s.label])}
            />
            <FooterCol title="More" links={[["/partners", "Partners"], ["/certificate", "Certificates"], ["/contribute#values", "Code of conduct"]]} />
            <FooterCol
              title="Elsewhere"
              links={[
                [ORG, "GitHub"],
                ["https://discord.gg/9xywA3pj", "Discord"],
                ["https://www.linkedin.com/company/opendevsociety-in/", "LinkedIn"],
                ["https://x.com/opendevsociety", "X / Twitter"],
                ["mailto:opendevsociety@gmail.com", "Email"],
              ]}
            />
          </div>
          <div className="mt-14 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:justify-between">
            <span>Founded July 2024 by Ravi Pratap Singh. Build openly, for everyone, forever free.</span>
            <span className="font-mono">concept c · builder&apos;s workshop</span>
          </div>
        </div>
      </footer>
    </>
  );
}

function Section({
  id,
  n,
  kicker,
  title,
  route,
  routeLabel,
  children,
}: {
  id: string;
  n: string;
  kicker: string;
  title: string;
  route: string;
  routeLabel: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div className="max-w-2xl">
          {/* Tool-tag label: a punched hole, a number, a name */}
          <p className="inline-flex items-center gap-2 rounded-full bg-(--paper-2) py-1 pl-1.5 pr-3 font-mono text-[11px] uppercase tracking-wider text-(--ink-2)">
            <span className="size-2.5 rounded-full bg-(--paper) shadow-[inset_0_1px_1px_rgb(31_26_21/0.25)]" />
            {n} — {kicker}
          </p>
          <h2 className="display mt-4 text-[34px] font-semibold leading-[1.05] sm:text-5xl">{title}</h2>
        </div>
        <a
          href={route}
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-(--ink-2) transition-colors duration-150 hover:text-(--ink)"
        >
          {routeLabel}
          <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </a>
      </div>
      {children}
    </section>
  );
}

function Tile({
  repo,
  index,
  className,
  flagship,
}: {
  repo: (typeof repos)[number];
  index: number;
  className: string;
  flagship?: boolean;
}) {
  const issues = `${repo.html_url}/issues?q=${encodeURIComponent('is:issue is:open label:"good first issue"')}`;
  return (
    <article
      className={`group relative flex flex-col rounded-3xl bg-(--card) p-5 shadow-(--sh) transition-[box-shadow,translate] duration-200 hover:-translate-y-0.5 hover:shadow-(--sh-hi) sm:p-6 ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[11px] tabular-nums text-(--ink-3)">ODS·{String(index + 1).padStart(2, "0")}</span>
        <span className="flex gap-1.5">
          {repo.customTags?.map((t: string, i: number) => (
            <span
              key={t}
              className={`rounded-full px-2 py-0.5 text-[11px] ${i === 0 && flagship ? "bg-(--accent) text-white" : "bg-(--paper-2) text-(--ink-2)"}`}
            >
              {t}
            </span>
          ))}
        </span>
      </div>

      <h3 className={`display mt-5 font-semibold ${flagship ? "text-4xl sm:text-5xl" : "text-2xl"}`}>
        <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="after:absolute after:inset-0 after:rounded-3xl">
          {repo.name}
        </a>
      </h3>
      <p className={`mt-2 text-(--ink-2) ${flagship ? "max-w-md text-[17px] leading-relaxed" : "text-[15px]"}`}>
        {blurbs[repo.name]}
      </p>

      {flagship && (
        <>
          <div className="mt-5 flex flex-wrap gap-1.5">
            {["Next.js", "TypeScript", "MongoDB", "TradingView"].map((s) => (
              <span key={s} className="rounded-md px-2 py-1 font-mono text-[11px] text-(--ink-2) shadow-[inset_0_0_0_1px_var(--line)]">
                {s}
              </span>
            ))}
          </div>
          <figure className="mt-6 rounded-2xl bg-(--paper) p-4">
            <blockquote className="text-[15px] leading-relaxed">
              &ldquo;Great tools shouldn&apos;t hide behind logins or price tiers.&rdquo;
            </blockquote>
            <figcaption className="mt-2 text-sm text-(--ink-3)">
              Tattva Tarang, Medium · covered by {openStockPress.length} outlets
            </figcaption>
          </figure>
        </>
      )}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-3 pt-6">
        <span className="flex items-center gap-3.5 font-mono text-xs tabular-nums text-(--ink-2)">
          <span className="flex items-center gap-1" title="Stars">
            <Star className="size-3.5" strokeWidth={1.75} />
            {fmt(repo.stargazers_count)}
          </span>
          <span className="flex items-center gap-1" title="Forks">
            <GitFork className="size-3.5" strokeWidth={1.75} />
            {repo.forks_count}
          </span>
          <span className="flex items-center gap-1" title="Open issues">
            <CircleDot className="size-3.5" strokeWidth={1.75} />
            {repo.open_issues_count}
          </span>
        </span>
        <a
          href={issues}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-(--paper) px-2.5 py-1 text-xs font-medium text-(--ink-2) transition-[background-color,color] duration-150 hover:bg-(--accent-soft) hover:text-(--accent-2)"
        >
          First issues <ArrowUpRight className="size-3" />
        </a>
      </div>
    </article>
  );
}

function FooterCol({ title, links }: { title: string; links: string[][] }) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-wider text-white/40">{title}</p>
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
