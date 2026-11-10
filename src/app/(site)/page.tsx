import type { Metadata } from "next";
import Link from "next/link";
import { Container, FORK_COMMAND, sizedAvatar } from "@/components/site";
import { Dither } from "@/components/site/lab/Dither";
import { Plate } from "@/components/site/lab/Plate";
import { Record } from "@/components/site/lab/Record";
import { LabButton } from "@/components/site/lab-hero/LabButton";
import { LabHero } from "@/components/site/lab-hero/LabHero";
import { catalog } from "@/data/catalog";
import { manualContributors } from "@/data/contributors";
import { mentions } from "@/data/mentions";
import { events, partners } from "@/data/partners";
import { ago, compact } from "@/lib/format";
import { getOrgContributors, getOrgTotals } from "@/lib/github";
import { expHref, expIds, nextResearcherId, researcherIds, status, STATUS_MARK } from "@/lib/lab";
import { getWorkshop } from "@/lib/workshop";
import { SILHOUETTE } from "./contributors/Badge";
import { CopyButton } from "./manifesto/CopyButton";

// Matches the GitHub lib's cache, so "updated 14h ago" stays true.
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const [totals, people] = await Promise.all([getOrgTotals(), getOrgContributors()]);
  return {
    title: "Open Dev Society: free, open-source software, built in public",
    description: `A public workshop of developers, designers and writers building free, open-source tools. ${compact(totals.stars)} stars, ${people.length} builders, no paywalls.`,
  };
}

// §03 excerpts ODS-WP-001 (manifesto/page.tsx): keep these in step with the paper.
const PAPER = { id: "ODS-WP-001", version: "3", date: "10 Nov 2026", title: "Technology Should Belong to Everyone" };
const promise = ["We will never lock knowledge.", "We will never charge for access.", "We will never trade trust for money."];
const founders = manualContributors.filter((c) => c.role && /Founder/i.test(c.role));

// §05: a reference as the bibliography numbers it ([n] = its place in mentions), with the line we quote.
function cite(author: string, quote: string) {
  const i = mentions.findIndex((m) => m.author.startsWith(author));
  const m = mentions[i];
  const [name, at] = m.author.split(/ (?:at|via) /);
  return { n: i + 1, name, outlet: at ?? new URL(m.url).hostname.replace(/^www\./, ""), year: m.date, quote };
}
const epigraph = cite("Tattva Tarang", "…great tools shouldn't hide behind logins or price tiers.");
const refs = [
  cite("Tattva Tarang", "It's designed for students, indie devs, and anyone who enjoys learning about markets without the distraction."),
  cite("Mohamed IDBRAHIM", "…the democratization of financial information and tools previously available only to institutional investors."),
  cite("Built At Lightspeed", "It's more than just an app; it's a movement towards transparency in the financial sector."),
];
const and = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs.at(-1)}`);

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;
const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--focus)";

export default async function Home() {
  const [{ now, tools, builders, people, lastPush }, totals] = await Promise.all([getWorkshop(), getOrgTotals()]);

  // §01
  const ids = expIds(tools);
  const log = [...tools].sort((a, b) => ids.get(a.name)!.localeCompare(ids.get(b.name)!)).slice(0, 5);
  const lead = log[0];
  const leadStatus = status(lead, now);
  const live = lead.homepage ?? lead.html_url;
  const running = tools.filter((t) => status(t, now) === "running").length;

  // §02: the contact sheet, in join order, closed by the vacant frame.
  const rids = researcherIds(people);
  const roster = builders.map((b) => ({ ...b, rid: rids.get(b.login)! })).sort((a, z) => a.rid.localeCompare(z.rid));
  const vacancy = nextResearcherId(people);
  const frames = roster.length + 1;
  // Blank frames close the last row: 5 across on phones, two rows from sm, one strip from lg.
  const half = Math.ceil(frames / 2);
  const blanks = Math.max((5 - (frames % 5)) % 5, half * 2 - frames);

  // §04
  const withIssues = tools.filter((r) => r.open_issues > 0);
  const open = withIssues.reduce((n, r) => n + r.open_issues, 0);
  const steps = [
    { title: "Fork and clone.", note: <>One command with the GitHub CLI, or Fork on github.com and clone your copy.</> },
    { title: "Choose one open issue.", note: <>{open} open across {withIssues.length} experiments. Comment so nobody doubles up; small is good.</> },
    { title: "Branch, change, commit.", note: <>Run the project and check the fix by hand. The README says how.</> },
    { title: "Open a draft pull request.", note: <>Reviewed in public. Once it&apos;s merged, badge <span className="text-(--mark-ink)">{vacancy}</span> is issued to you.</> },
  ];

  return (
    <>
      {/* ── EXP-000 ─────────────────────────────────────────── */}
      <LabHero now={now} tools={tools} people={people} lastPush={lastPush} stars={totals.stars} />

      {/* ── §01 Experiments: the lead figure, and the head of the log ── */}
      <section id="work" aria-labelledby="work-h" className="scroll-mt-16 pt-(--section-y)">
        <Container>
          <Record
            n="01"
            name="Experiments"
            id="work-h"
            meta={[`${tools.length} records`, `updated ${ago(lastPush, now)}`]}
            title={
              <>
                {tools.length} experiments. <span className="text-(--accent)">{running} running</span>.
              </>
            }
          />

          <div className="mt-10 grid gap-y-8 lg:mt-14 lg:grid-cols-12 lg:gap-x-(--grid-gap)">
            <figure className="lg:col-span-7">
              <a href={live} {...ext} className={`group relative block ${focus}`}>
                <Dither
                  src="/shots/openstock-desktop.jpg"
                  alt={`${lead.name}, live: index prices, the market clock and a chart`}
                  width={2880}
                  height={1800}
                  align="top"
                  negative
                  develop
                  className="w-full shadow-[0_0_0_1px_var(--line)]"
                />
                <Plate as="div" tone="ink" className="absolute top-3 left-3">
                  {ids.get(lead.name)} / {lead.name}
                </Plate>
                <Plate as="div" tone={leadStatus === "running" ? "accent" : "plain"} className="absolute top-3 right-3">
                  {STATUS_MARK[leadStatus]} {leadStatus}
                </Plate>
                <Plate as="div" className="absolute bottom-3 left-3 hidden md:inline-flex">
                  <span className="group-hover:hidden group-focus-visible:hidden">hover to develop</span>
                  <span className="hidden group-hover:inline group-focus-visible:inline">developed · open the live site ↗</span>
                </Plate>
              </a>
              <figcaption className="t-mono mt-2 flex flex-wrap justify-between gap-x-4 text-[12px] text-(--fg-muted)">
                <span>
                  <span className="text-(--fg)">fig. 1</span> · {live.replace(/^https?:\/\//, "")}
                </span>
                <span>Bayer 8×8 · 1-bit negative</span>
              </figcaption>
            </figure>

            <div className="flex flex-col lg:col-span-5">
              <p className="t-mono flex justify-between border-b border-(--fg) pb-2 text-[11px] text-(--fg-subtle) uppercase">
                <span>The log · by subjects</span>
                <span>★</span>
              </p>
              <ol>
                {log.map((r) => {
                  const s = status(r, now);
                  return (
                    <li key={r.name}>
                      <Link
                        href={expHref(r.name)}
                        className={`grid grid-cols-[4.75rem_minmax(0,1fr)_auto] items-baseline gap-x-3 border-b border-(--line) py-3 transition-colors duration-(--d-2) hover:bg-(--surface-2) ${focus}`}
                      >
                        <span className="t-mono text-[12px] text-(--fg)">{ids.get(r.name)}</span>
                        <span className="min-w-0">
                          <span className="font-[700] text-(--fg)">{r.name}</span>
                          <span className="block truncate text-[14px] text-(--fg-muted)">{catalog[r.name].tagline}</span>
                        </span>
                        <span className="t-mono text-right text-[12px] text-(--fg) tabular-nums">
                          <span className={s === "running" ? "text-(--accent)" : "text-(--fg-subtle)"} title={s}>
                            {STATUS_MARK[s]}
                          </span>{" "}
                          {compact(r.stars)}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
              <p className="t-mono mt-2 text-[12px] text-(--fg-subtle)">
                + {tools.length - log.length} more · ● running · ◐ paused · ○ archived
              </p>
              <p className="mt-8 lg:mt-auto lg:pt-8">
                <LabButton href="/projects">All {tools.length} records →</LabButton>
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ── §02 Researchers: one contact sheet, the last frame unexposed ── */}
      <section id="people" aria-labelledby="people-h" className="scroll-mt-16 pt-(--section-y)">
        <Container>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <Record
              n="02"
              name="Researchers"
              id="people-h"
              meta={[`${roster.length} on file`, "in join order"]}
              title={
                <>
                  {roster.length} researchers.
                  <br />
                  <span className="text-(--mark-ink)">{vacancy} is yours.</span>
                </>
              }
              className="lg:flex-1"
            />
            <p className="max-w-[40ch] text-[17px] leading-relaxed text-(--fg-muted) lg:pb-2">
              Everyone with a commit in an experiment gets a badge and a number. No interview, no invite: the first merged pull request is the
              application.
            </p>
          </div>

          <ol
            aria-label="Researcher badges"
            style={{ "--half": half, "--frames": frames } as React.CSSProperties}
            className="mt-10 grid grid-cols-5 border-t border-l border-(--line) sm:grid-cols-[repeat(var(--half),minmax(0,1fr))] lg:mt-14 lg:grid-cols-[repeat(var(--frames),minmax(0,1fr))]"
          >
            {roster.map((r) => (
              <li key={r.login} className="border-r border-b border-(--line) p-1">
                <a href={r.url} {...ext} title={`${r.rid} · ${r.name ?? `@${r.login}`}`} className={`block ${focus}`}>
                  <Dither src={sizedAvatar(r.avatar, 48)} alt={`${r.rid}, ${r.name ?? r.login}`} width={1} height={1} tone="duotone" cell={1} className="w-full" />
                  <span className="t-mono mt-1 block text-center text-[10px] leading-none text-(--fg-muted)">{r.rid}</span>
                </a>
              </li>
            ))}
            <li className="border-r border-b border-(--line) bg-(--mark-soft)/40 p-1 shadow-[inset_0_0_0_1px_var(--mark)]">
              <Link href="/contribute" className={`block ${focus}`}>
                <Dither src={SILHOUETTE} alt={`${vacancy}, vacant: issued on your first merged pull request`} width={1} height={1} variant="mark" tone="duotone" cell={1} develop className="w-full" />
                <span className="t-mono mt-1 block text-center text-[10px] leading-none text-(--mark-ink)">{vacancy}</span>
              </Link>
            </li>
            {Array.from({ length: blanks }, (_, i) => (
              <li key={i} aria-hidden className={`border-r border-b border-(--line) lg:hidden ${i >= (5 - (frames % 5)) % 5 ? "max-sm:hidden" : ""} ${i >= half * 2 - frames ? "sm:hidden" : ""}`} />
            ))}
          </ol>

          <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="t-mono text-[12px] text-(--fg-muted)">
              duotone · Bayer 8×8 · <span className="text-(--mark-ink)">{vacancy} · you · not yet on file</span>
            </p>
            <LabButton href="/contributors" variant="secondary" size="sm">
              The roster →
            </LabButton>
          </div>
        </Container>
      </section>

      {/* ── §03 Working paper: the first page, abstract and promise ── */}
      <section aria-labelledby="paper-h" className="pt-(--section-y)">
        <Container>
          <Record n="03" name="Working paper" id="paper-h" meta={[PAPER.id, `v${PAPER.version}`, PAPER.date]} title="Why the lab exists, on one page." />

          <div className="mx-auto mt-12 max-w-[44rem] lg:mt-16">
            <p className="t-mono flex flex-wrap justify-between gap-x-6 border-y-[3px] border-double border-(--fg) py-2 text-[12px] text-(--fg-muted)">
              <span>
                <span className="text-(--fg)">{PAPER.id}</span> · v{PAPER.version} · cs.SE
              </span>
              <span>preprint · not peer reviewed</span>
            </p>
            <p className="mt-8 text-center text-[clamp(1.75rem,1.3rem+1.6vw,2.5rem)] leading-[0.95] font-[800] tracking-[-0.018em] text-balance text-(--fg) [font-stretch:75%]">
              {PAPER.title}
            </p>

            {/* The abstract box, its label set into the top rule, as in the paper. */}
            <div className="relative mt-10 border border-(--fg) px-5 pt-7 pb-6 sm:px-8">
              <p className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-(--bg) px-3 font-mono text-[12px] tracking-[0.2em] text-(--fg) uppercase">Abstract</p>
              <p className="text-[16px] leading-[1.65] text-(--fg) hyphens-auto sm:text-justify">
                Knowledge is hidden behind paywalls. Tools are locked in subscriptions. Newcomers are told they&apos;re not good enough. We think
                there&apos;s a better way, and we&apos;re building it: {tools.length} free, open-source experiments so far, by {people.length} researchers.
              </p>
            </div>

            <p className="t-mono mt-10 text-[12px] text-(--fg-muted)">
              <span className="text-(--accent)">4</span> The promise
            </p>
            <ol className="mt-3 space-y-3 border-y border-(--fg) py-6">
              {promise.map((l, i) => (
                <li key={l} className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-baseline text-[clamp(1.25rem,1rem+1vw,1.625rem)] leading-tight font-[650] tracking-[-0.015em] text-(--fg)">
                  <span className="font-mono text-[13px] font-normal text-(--fg-muted)">({["i", "ii", "iii"][i]})</span>
                  {l}
                </li>
              ))}
            </ol>

            <div className="mt-8 grid grid-cols-2 gap-6">
              {founders.map((f) => (
                <p key={f.login}>
                  <span className="sign block text-[clamp(1.375rem,1.1rem+1vw,1.875rem)] leading-none text-(--fg)">{f.name}</span>
                  <span className="t-mono mt-2 block border-t border-(--fg) pt-1.5 text-[12px] text-(--fg-muted)">
                    {/Co-Founder/i.test(f.role!) ? "Co-founder" : "Founder"} · July 2024
                  </span>
                </p>
              ))}
            </div>

            <p className="mt-10 text-center">
              <LabButton href="/manifesto">Read {PAPER.id} →</LabButton>
            </p>
          </div>
        </Container>
      </section>

      {/* ── §04 Protocol 01: the procedure, on the bench ── */}
      <section aria-labelledby="protocol-h" className="tone-inverse mt-(--section-y) py-(--section-y)">
        <Container>
          <Record
            n="04"
            name="Protocol 01"
            id="protocol-h"
            meta={["first contribution", "30–60 min", "yield: 1 pull request"]}
            title="From fork to merged, in four steps."
          />

          <ol className="mt-12 grid border-t border-(--line) md:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="border-b border-(--line) py-6 md:px-5 md:odd:border-r md:odd:pl-0 md:even:pr-0 lg:border-r lg:px-5 lg:odd:pl-5 lg:even:pr-5 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0">
                <p className="t-mono text-[12px] text-(--fg-subtle)">3.{i + 1}</p>
                <p className="mt-3 text-[20px] leading-tight font-[650] tracking-[-0.01em] text-(--fg)">{s.title}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-(--fg-muted)">{s.note}</p>
              </li>
            ))}
          </ol>

          <div className="mt-8 flex flex-col gap-3 bg-(--surface) p-3 sm:flex-row sm:items-center sm:pl-4">
            <code className="t-mono min-w-0 flex-1 text-[14px] text-(--fg) [overflow-wrap:anywhere]">
              <span className="text-(--fg-subtle) select-none">3.1 $ </span>
              {FORK_COMMAND}
            </code>
            <CopyButton text={FORK_COMMAND} label="Copy command" />
          </div>

          <p className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <LabButton href="/contribute">Run the protocol →</LabButton>
            <span className="t-mono text-[12px] text-(--fg-muted)">materials, procedure, safety notes, troubleshooting</span>
          </p>
        </Container>
      </section>

      {/* ── §05 Citations: an epigraph, three references, the acknowledgements ── */}
      <section id="signal" aria-labelledby="signal-h" className="scroll-mt-16 py-(--section-y)">
        <Container>
          <Record
            n="05"
            name="Citations"
            id="signal-h"
            meta={[`${mentions.length} references`, `${partners.length} partners`]}
            title={
              <>
                Cited by <span className="text-(--accent) tabular-nums">{mentions.length}</span>.
              </>
            }
          />

          <figure className="mt-12 lg:mt-16 lg:ml-[25%]">
            <blockquote className="text-right text-[clamp(1.75rem,1.1rem+2.4vw,3.25rem)] leading-[1.02] font-[700] tracking-[-0.015em] text-balance text-(--fg) [font-stretch:75%]">
              <span className="text-(--fg-subtle)">&ldquo;</span>
              {epigraph.quote}
              <span className="text-(--fg-subtle)">&rdquo;</span>
            </blockquote>
            <figcaption className="t-mono mt-4 text-right text-[12px] text-(--fg-muted)">
              <span className="sign text-[17px] text-(--fg)">{epigraph.name}</span>, {epigraph.outlet}, {epigraph.year}{" "}
              <Link href={`/word-of-mouth#cite-${epigraph.n}`} className="text-(--accent) hover:underline">
                [{epigraph.n}]
              </Link>
            </figcaption>
          </figure>

          <ol className="mt-14 grid gap-px border-y-[3px] border-double border-(--fg) bg-(--line) md:grid-cols-3">
            {refs.map((r) => (
              <li key={r.quote} className="grid grid-cols-[2.75rem_minmax(0,1fr)] bg-(--bg) py-5 md:px-5 md:first:pl-0 md:last:pr-0">
                <Link href={`/word-of-mouth#cite-${r.n}`} className="t-mono text-[13px] text-(--accent) hover:underline">
                  [{r.n}]
                </Link>
                <p className="text-[15px] leading-relaxed text-(--fg-muted)">
                  <span className="text-(--fg)">{r.name}.</span> &ldquo;{r.quote}&rdquo; <i>{r.outlet}</i>, {r.year}.
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-8 grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <p className="max-w-[62ch] text-[15px] leading-relaxed text-(--fg-muted)">
              <span className="t-mono mr-2 text-[11px] text-(--fg-subtle) uppercase">Acknowledgements</span>
              Supported in part by {and(partners.map((p) => p.name))}. With thanks to {and(events.map((e) => e.organizer))}.{" "}
              <Link href="/word-of-mouth#partners" className="ink-link whitespace-nowrap">
                Funding &amp; acknowledgements →
              </Link>
            </p>
            <LabButton href="/word-of-mouth" variant="secondary">
              All {mentions.length} citations →
            </LabButton>
          </div>
        </Container>
      </section>
    </>
  );
}
