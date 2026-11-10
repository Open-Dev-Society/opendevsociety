import type { Metadata } from "next";
import {
  Bench,
  Button,
  CopyCommand,
  FORK_COMMAND,
  Masthead,
  PartnerCard,
  Quote,
  RepoIndex,
  RepoTile,
  Section,
  SectionHeader,
  SectionLink,
  Showpiece,
  SourceLine,
  StatRow,
  Wall,
} from "@/components/site";
import { mentions } from "@/data/mentions";
import { partners } from "@/data/partners";
import { ago, compact, isLive } from "@/lib/format";
import { getOrgContributors, getOrgTotals } from "@/lib/github";
import { getWorkshop, listNames } from "@/lib/workshop";

// Matches the GitHub lib's cache, so "last commit 14h ago" stays true.
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const [totals, people] = await Promise.all([getOrgTotals(), getOrgContributors()]);
  return {
    title: "Open Dev Society: free, open-source software, built in public",
    description: `A public workshop of developers, designers and writers building free, open-source tools. ${compact(totals.stars)} stars, ${people.length} builders, no paywalls.`,
  };
}


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

export default async function Home() {
  const [{ now, tools, index, featured, builders, people, lastPush, thisWeek, benchRepos, openstockPrint }, totals] = await Promise.all([
    getWorkshop(),
    getOrgTotals(),
  ]);
  const seat = people.length + 1;
  const [lead, second, third] = featured;

  return (
    <>
      {/* ── Hero: headline split (Linear), the showpiece on the ink plate (Cursor), the proof row (Stripe) ── */}
      <section className="pt-12 lg:pt-14">
        <div className="mx-auto grid w-full max-w-(--container) grid-cols-1 gap-y-6 px-(--gutter) lg:grid-cols-12 lg:items-end lg:gap-x-(--grid-gap)">
          <div className="lg:col-span-8">
            <p className="rise t-meta text-(--fg-muted)" style={{ "--i": 0 } as React.CSSProperties}>
              Open Dev Society · est. July 2024
            </p>
            <h1 className="rise display-1 mt-5 max-w-[14ch] text-(--fg)" style={{ "--i": 1 } as React.CSSProperties}>
              Software for everyone, built by{" "}
              <span className="sign text-(--accent)">
                <span className="mark-sweep">anyone who shows up.</span>
              </span>
            </h1>
          </div>
          <div className="lg:col-span-4 lg:pb-2">
            <p className="rise t-lede max-w-[44ch] text-(--fg-muted)" style={{ "--i": 2 } as React.CSSProperties}>
              A public workshop of developers, designers and writers making free, open-source tools. No paywalls. No interviews. Send a
              pull request and you&apos;re one of us.
            </p>
            <div className="rise mt-6 flex flex-col gap-3" style={{ "--i": 3 } as React.CSSProperties}>
              <Button href="#start" size="lg" icon="arrow" className="sm:self-start">
                Make your first PR
              </Button>
              <CopyCommand command={FORK_COMMAND} className="w-full" />
            </div>
          </div>
        </div>

        <div className="rise mx-auto mt-12 w-full max-w-[88rem] px-(--gutter) lg:mt-14" style={{ "--i": 3 } as React.CSSProperties}>
          <Showpiece {...openstockPrint} />
        </div>

        <div className="mx-auto mt-16 w-full max-w-(--container) px-(--gutter) lg:mt-20">
          <StatRow
            items={[
              { value: compact(totals.stars), label: "stars across the org" },
              { value: compact(totals.forks), label: "forks" },
              { value: String(people.length), label: "builders, by name" },
              { value: String(tools.length), label: "free tools" },
              { value: ago(lastPush, now), label: "since the last commit", live: isLive(lastPush, now) },
            ]}
          />
        </div>
      </section>

      {/* ── Work: the showcase (Stripe bento, Works captions), then the whole shelf ── */}
      <Section id="work">
        <SectionHeader
          layout="split"
          eyebrow="Work"
          count={`${tools.length} tools`}
          title={`${tools.length} tools. 0 paywalls.`}
          description={
            thisWeek.length ? `Free to use, free to fork. Pushed to this week: ${listNames(thisWeek)}.` : "Free to use, free to fork."
          }
          link={{ href: "/projects", label: "All tools" }}
        />
        <div className="grid grid-cols-1 gap-x-(--grid-gap) gap-y-12 lg:grid-cols-12 lg:gap-y-16">
          {lead && <RepoTile variant="plate" {...lead} repo={lead.repo} className="lg:col-span-7 lg:h-[34rem]" />}
          {second && <RepoTile variant="plate" {...second} repo={second.repo} className="lg:col-span-5 lg:h-[34rem]" />}
          {third && <RepoTile variant="plate" {...third} repo={third.repo} className="lg:col-span-12 lg:h-[22rem]" />}
        </div>

        <div className="mt-20 lg:mt-28">
          <h3 className="t-title mb-6 text-(--fg)">
            The whole shelf <span className="t-mono ml-1 text-(--fg-subtle)">{index.length}</span>
          </h3>
          <RepoIndex repos={index} />
        </div>
        <SectionLink href="/projects">All tools</SectionLink>
      </Section>

      {/* ── People: the wall, one centred column ────────────── */}
      <Section id="people" tone="muted">
        <SectionHeader
          layout="center"
          eyebrow="People"
          count={`${people.length} builders`}
          title={`${people.length} people built all of this. Seat ${seat} is yours.`}
          description="Every merged pull request puts a face on this wall. No interview, no invite."
        />
        <Wall builders={builders} size="home" />
        <Masthead className="mx-auto mt-10 max-w-3xl text-center" />
        <SectionLink href="/contributors" className="justify-center">Everyone, by name</SectionLink>
      </Section>

      {/* ── Start: the bench, in the lit inkwell (Resend) ───── */}
      <Section id="start" tone="inverse" className="ink-wash">
        <SectionHeader
          layout="split"
          eyebrow="Start"
          count="3 commands"
          title="Three commands from here to the wall."
          description="Pick a repo with open issues. The bench writes the commands with it, and with your handle once you claim a seat."
        />
        <Bench repos={benchRepos} />
      </Section>

      {/* ── Word of mouth: one voice, credit roll (cinematic), then two ── */}
      <Section id="signal">
        <SectionHeader
          layout="split"
          eyebrow="Word of mouth"
          count={`${mentions.length} mentions`}
          title="What people wrote when they found it."
          link={{ href: "/word-of-mouth", label: `All ${mentions.length} mentions` }}
        />
        <Quote variant="cinematic" className="py-6 lg:py-12" quote={quotes[0].text} name={quotes[0].name} source={quotes[0].source} year={quotes[0].year} href={quotes[0].href} />
        <div className="mt-16 grid grid-cols-1 gap-x-(--grid-gap) gap-y-10 md:grid-cols-2">
          {quotes.slice(1).map((q) => (
            <Quote key={q.href} className="border-t border-(--line) pt-8" quote={q.text} name={q.name} source={q.source} year={q.year} href={q.href} />
          ))}
        </div>
        <SourceLine className="mt-12" items={outlets} all={{ label: `All ${mentions.length} mentions`, href: "/word-of-mouth" }} />

        <h3 className="t-title mt-20 text-(--fg)">Who backs the work</h3>
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
