import type { Metadata } from "next";
import {
  Avatar,
  Button,
  CopyCommand,
  FORK_COMMAND,
  PartnerCard,
  Print,
  Quote,
  RepoIndex,
  RepoTile,
  Section,
  SectionHeader,
  SectionLink,
  SourceLine,
  type IndexRepo,
} from "@/components/site";
import { catalog } from "@/data/catalog";
import { manualContributors } from "@/data/contributors";
import { mentions } from "@/data/mentions";
import { partners } from "@/data/partners";
import { ago, compact, isLive } from "@/lib/format";
import { getOrgContributors, getOrgRepos, getOrgTotals, type OrgContributor } from "@/lib/github";

// Matches the GitHub lib's cache, so "last commit 14h ago" stays true.
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const [totals, people] = await Promise.all([getOrgTotals(), getOrgContributors()]);
  return {
    title: "Open Dev Society: free, open-source software, built in public",
    description: `A public workshop of developers, designers and writers building free, open-source tools. ${compact(totals.stars)} stars, ${people.length} builders, no paywalls.`,
  };
}

const list = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs.at(-1)}`);
const DAY = 864e5;

// Brief §10 §5: the three quotes, excerpted with honest ellipses, matched to their mention for source, year and link.
const quotes = [
  { author: "Tattva Tarang", text: "…great tools shouldn't hide behind logins or price tiers." },
  { author: "Mohamed IDBRAHIM", text: "…the democratization of financial information and tools previously available only to institutional investors." },
  { author: "Built At Lightspeed", text: "It's more than just an app; it's a movement towards transparency in the financial sector." },
].map((q) => {
  const m = mentions.find((x) => x.author.startsWith(q.author))!;
  const [name, source] = m.author.split(/ (?:at|via) /);
  return { ...q, name, source, year: m.date, href: m.url };
});
const press = mentions.filter((m) => !m.author.startsWith("Ravi"));
const outlets = [
  ...new Map(
    press
      .filter((m) => !quotes.some((q) => q.href === m.url))
      .map((m) => {
        const name = m.author.replace(/^.* (at|via) /, "").replace("community-scripts/ProxmoxVE repository", "ProxmoxVE");
        return [name, { name, href: m.url }] as const;
      }),
  ).values(),
];

// Ours, one line each (brief §10 §5).
const partnerLines: Record<string, string> = {
  "Siray.ai": "AI infrastructure behind one API.",
  StellAILoom: "A hub for publishing and finding AI tools.",
  "Atlas Cloud": "One API for hundreds of models.",
};

function masthead() {
  const by = (re: RegExp) => manualContributors.filter((c) => c.role && re.test(c.role));
  const sign = (cs: typeof manualContributors) =>
    cs.map((c, i) => (
      <span key={c.login}>
        {i > 0 && (i === cs.length - 1 ? " and " : ", ")}
        <a href={c.html_url} target="_blank" rel="noopener noreferrer" className="sign text-(--fg) hover:text-(--accent)">
          {c.name}
        </a>
      </span>
    ));
  return (
    <p className="text-sm text-(--fg-muted)">
      Founded by {sign(by(/^(?!.*Co-Founder).*Founder/i))}. Co-founded by {sign(by(/Co-Founder/i))}. Maintained with {sign(by(/Maintainer/i))}.
    </p>
  );
}

export default async function Home() {
  const [repos, people] = await Promise.all([getOrgRepos(), getOrgContributors()]);
  const now = Date.now();

  const builtBy = (name: string) => people.filter((p) => p.repos.includes(name));
  const tools = repos.filter((r) => catalog[r.name]);
  const lastPush = tools.reduce((a, r) => (r.pushed_at > a ? r.pushed_at : a), "");
  const thisWeek = tools.filter((r) => now - Date.parse(r.pushed_at) < 7 * DAY).map((r) => r.name);

  const summary = (r: (typeof tools)[number]) => ({
    name: r.name,
    url: r.html_url,
    tagline: catalog[r.name].tagline,
    language: r.language,
    pushedAgo: ago(r.pushed_at, now),
    stars: r.stars,
    builders: builtBy(r.name).length,
    badge: catalog[r.name].badge,
  });
  const index: IndexRepo[] = [...tools]
    .sort((a, b) => Number(b.name === "OpenStock") - Number(a.name === "OpenStock") || b.stars - a.stars || b.pushed_at.localeCompare(a.pushed_at))
    .map((r) => ({ ...summary(r), audience: catalog[r.name].audience, goodFirst: r.good_first_issues }));
  const featured = ["kine-ui", "openreadme", "kitbash"].flatMap((n) => tools.filter((r) => r.name === n));

  const openstock = tools.find((r) => r.name === "OpenStock")!;
  const osPeople = builtBy("OpenStock");
  const seat = people.length + 1;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-(--container) px-(--gutter) pt-16 lg:pt-24">
        <p className="rise t-meta flex flex-wrap items-center gap-x-2 gap-y-1 text-(--fg-muted)" style={{ "--i": 0 } as React.CSSProperties}>
          <span>Est. July 2024</span>
          <span aria-hidden>·</span>
          <span className="tabular-nums">{tools.length} tools</span>
          <span aria-hidden>·</span>
          <span className="tabular-nums">{people.length} builders</span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1.5 tabular-nums">
            {isLive(lastPush, now) && <span className="size-1.5 rounded-full bg-(--live)" aria-hidden />}
            last commit {ago(lastPush, now)}
          </span>
        </p>
        <h1 className="rise display-1 mt-6 max-w-[14ch] text-(--fg)" style={{ "--i": 1 } as React.CSSProperties}>
          Software for everyone, built by <span className="sign text-(--accent)">anyone who shows up.</span>
        </h1>
        <p className="rise t-lede mt-6 max-w-[52ch] text-(--fg-muted)" style={{ "--i": 2 } as React.CSSProperties}>
          A public workshop of developers, designers and writers making free, open-source tools. No paywalls. No interviews. Send a
          pull request and you&apos;re one of us.
        </p>
        <div className="rise mt-8 flex flex-col gap-3 sm:flex-row sm:items-center" style={{ "--i": 3 } as React.CSSProperties}>
          <Button href="#start" size="lg" icon="arrow">
            Make your first PR
          </Button>
          <CopyCommand command={FORK_COMMAND} className="sm:w-[24rem]" />
        </div>
        <Print
          className="rise mt-12 lg:mt-16"
          priority
          desktop={{ src: "/shots/openstock-desktop.jpg", width: 2880, height: 1800 }}
          mobile={{ src: "/shots/openstock-mobile.jpg", width: 1170, height: 2532 }}
          alt="OpenStock, live: index prices, the market clock and a chart"
          url={(openstock.homepage ?? openstock.html_url).replace(/^https?:\/\//, "")}
          href={openstock.homepage ?? openstock.html_url}
          name="OpenStock"
          tagline={catalog.OpenStock.tagline}
          people={osPeople.map((p) => ({ src: p.avatar_url, name: p.login }))}
          builders={osPeople.length}
          stats={`★ ${compact(openstock.stars)} · ${compact(openstock.forks)} forks`}
        />
      </section>

      {/* ── Work: the shelf ──────────────────────────────────── */}
      <Section id="work">
        <SectionHeader
          eyebrow="Work"
          count={`${tools.length} tools`}
          title={`${tools.length} tools. 0 paywalls.`}
          description={
            thisWeek.length ? `Free to use, free to fork. Pushed to this week: ${list(thisWeek)}.` : "Free to use, free to fork."
          }
        />
        <div className="-mx-(--gutter) flex snap-x snap-mandatory scroll-px-(--gutter) gap-3 overflow-x-auto px-(--gutter) pb-2 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-(--grid-gap) lg:overflow-visible lg:px-0 lg:pb-0">
          {featured.map((r) => (
            <RepoTile key={r.name} repo={summary(r)} shot={catalog[r.name].shot} className="w-[78vw] max-w-sm shrink-0 snap-start lg:w-auto lg:max-w-none" />
          ))}
        </div>
        <div className="mt-16">
          <RepoIndex repos={index} />
        </div>
        <SectionLink href="/projects">All tools</SectionLink>
      </Section>

      {/* ── People: the wall ─────────────────────────────────── */}
      <Section id="people" tone="muted">
        <SectionHeader
          eyebrow="People"
          count={`${people.length} builders`}
          title={`${people.length} people built all of this. Seat ${seat} is yours.`}
          description="Every merged pull request puts a face on this wall. No interview, no invite."
        />
        {/* TODO(Claude Code 6): swap for <Wall builders={…} size="home" /> */}
        <WallPlaceholder people={people} />
        <div className="mt-8">{masthead()}</div>
        <SectionLink href="/contributors">Everyone, by name</SectionLink>
      </Section>

      {/* ── Start: the bench ─────────────────────────────────── */}
      <Section id="start" tone="inverse">
        <SectionHeader eyebrow="Start" count="3 commands" title="Three commands from here to the wall." />
        {/* TODO(Claude Code 6): swap for <Bench repos={…} /> */}
        <CopyCommand command={FORK_COMMAND} className="sm:w-[28rem]" />
      </Section>

      {/* ── Word of mouth ────────────────────────────────────── */}
      <Section id="signal">
        <SectionHeader eyebrow="Word of mouth" count={`${mentions.length} mentions`} title="What people wrote when they found it." />
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-(--grid-gap)">
          <Quote variant="feature" className="lg:col-span-8 lg:pr-12" quote={quotes[0].text} name={quotes[0].name} source={quotes[0].source} year={quotes[0].year} href={quotes[0].href} />
          <div className="flex flex-col gap-10 lg:col-span-4">
            {quotes.slice(1).map((q) => (
              <Quote key={q.href} quote={q.text} name={q.name} source={q.source} year={q.year} href={q.href} />
            ))}
          </div>
        </div>
        <SourceLine className="mt-12" items={outlets} all={{ label: `All ${mentions.length} mentions`, href: "/word-of-mouth" }} />

        <h3 className="t-title mt-16 text-(--fg)">Who backs the work</h3>
        <div className="mt-6 grid grid-cols-1 gap-(--grid-gap) md:grid-cols-3">
          {partners.map((p) => (
            <PartnerCard key={p.name} name={p.name} logo={p.logo} invertLogo={p.invertLogo} href={p.url} line={partnerLines[p.name] ?? p.description} />
          ))}
        </div>
        <p className="mt-6 text-sm text-(--fg-muted)">
          Community partner at Apretre 3.0 (Resourcio Community) and JWOC 2026 (JGEC).{" "}
          <a href="/word-of-mouth#partner-cta" className="ink-link whitespace-nowrap">
            Partner with us →
          </a>
        </p>
      </Section>
    </>
  );
}

function WallPlaceholder({ people }: { people: OrgContributor[] }) {
  return (
    <ul className="grid grid-cols-8 gap-1.5 sm:grid-cols-12 lg:grid-cols-16">
      {people.map((p) => (
        <li key={p.login}>
          <Avatar src={p.avatar_url} name={p.login} href={p.html_url} size={56} shape="square" className="size-full" />
        </li>
      ))}
    </ul>
  );
}
