import type { Metadata } from "next";
import { Container } from "@/components/site";
import { LabButton } from "@/components/site/lab-hero/LabButton";
import { Dither } from "@/components/site/lab/Dither";
import { Plate } from "@/components/site/lab/Plate";
import { Record } from "@/components/site/lab/Record";
import { catalog, languageColors } from "@/data/catalog";
import { ago, compact } from "@/lib/format";
import { expIds, labDate, status } from "@/lib/lab";
import { getWorkshop } from "@/lib/workshop";
import { Log, STATUS_MARK, type LogRow } from "./Log";

// Matches the GitHub lib's cache.
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const { tools, now } = await getWorkshop();
  const running = tools.filter((t) => status(t, now) === "running").length;
  return {
    title: `Experiments: ${tools.length} open-source tools, ${running} running · ODS·LAB`,
    description: `The Open Dev Society lab log: every tool as an experiment record, with its status, subjects (GitHub stars), researchers and last activity. Free to use, free to fork.`,
  };
}

const DAY = 864e5;

export default async function ExperimentsPage() {
  const { now, tools, people, lastPush } = await getWorkshop();
  const ids = expIds(tools);
  const byId = [...tools].sort((a, b) => ids.get(a.name)!.localeCompare(ids.get(b.name)!));
  const team = (name: string) => people.filter((p) => p.repos.includes(name));

  const rows: LogRow[] = byId.map((r) => ({
    id: ids.get(r.name)!,
    name: r.name,
    url: r.html_url,
    tagline: catalog[r.name].tagline,
    badge: catalog[r.name].badge,
    status: status(r, now),
    audience: catalog[r.name].audience,
    stars: compact(r.stars),
    researchers: team(r.name).length,
    language: r.language,
    languageColor: r.language ? languageColors[r.language] : undefined,
    days: (now - Date.parse(r.pushed_at)) / DAY,
    ago: ago(r.pushed_at, now),
    date: labDate(r.pushed_at),
    shot: catalog[r.name].shot,
  }));
  const counts = (s: string) => rows.filter((r) => r.status === s).length;

  const lead = byId[0];
  const leadId = ids.get(lead.name)!;
  const leadTeam = team(lead.name);
  const leadStatus = status(lead, now);
  const live = lead.homepage ?? lead.html_url;
  const nextId = `EXP-${String(tools.length + 1).padStart(3, "0")}`;

  // The lead's record, in the order a lab sheet reads.
  const sheet: [string, React.ReactNode][] = [
    ["Status", `${STATUS_MARK[leadStatus]} ${leadStatus}`],
    ["Started", lead.created_at ? labDate(lead.created_at) : "—"],
    ["Subjects", `${lead.stars.toLocaleString("en-US")} ★`],
    ["Forks", lead.forks.toLocaleString("en-US")],
    ["Researchers", leadTeam.length],
    ["Language", lead.language ?? "—"],
    ["Last activity", `${ago(lead.pushed_at, now)} · ${labDate(lead.pushed_at)}`],
    ["Open issues", lead.open_issues],
  ];

  return (
    <>
      <Container className="pt-14 lg:pt-20">
        <Record
          as="h1"
          size="page"
          n="02"
          name="Experiments"
          meta={[`${tools.length} records`, `updated ${ago(lastPush, now)}`]}
          title={
            <>
              {tools.length} experiments.
              <br />
              <span className="text-(--accent)">{counts("running")} running</span> in the open.
            </>
          }
        >
          <p className="mt-6 max-w-[60ch] text-[17px] leading-relaxed text-(--fg-muted)">
            Every tool the society makes is logged here as an experiment: free to use, free to fork, numbered by the people who starred it. A record is{" "}
            <i className="not-italic text-(--fg)">running</i> if it was pushed to in the last 30 days, <i className="not-italic text-(--fg)">paused</i> within
            180, <i className="not-italic text-(--fg)">archived</i> after that.
          </p>
        </Record>
      </Container>

      {/* The lead experiment: plate, figure and record sheet. */}
      <Container className="mt-14 lg:mt-20">
        <article id={lead.name} aria-labelledby="lead-name" className="scroll-mt-24 border-t-[3px] border-double border-(--fg) pt-3">
          <div className="t-mono flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-[12px] text-(--fg-muted)">
            <span>
              <span className="text-(--fg)">{leadId}</span> · lead record · most subjects
            </span>
            <span>
              fig. 1 · {live.replace(/^https?:\/\//, "")} · Bayer 8×8, 1-bit
            </span>
          </div>

          <a href={live} className="group relative mt-3 block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--focus)">
            <Dither
              src="/shots/openstock-desktop.jpg"
              alt={`${lead.name}, live: index prices, the market clock and a chart`}
              width={2880}
              height={1800}
              align="top"
              develop
              eager
              className="w-full shadow-[0_0_0_1px_var(--line)]"
            />
            <Plate as="div" tone="ink" className="absolute top-3 left-3 md:top-4 md:left-4">
              {leadId} / {lead.name}
            </Plate>
            <Plate as="div" tone={leadStatus === "running" ? "accent" : "plain"} className="absolute top-3 right-3 md:top-4 md:right-4">
              {STATUS_MARK[leadStatus]} {leadStatus}
            </Plate>
            <Plate as="div" className="absolute bottom-3 left-3 hidden md:bottom-4 md:left-4 md:inline-flex">
              <span className="group-hover:hidden group-focus-visible:hidden">hover to develop</span>
              <span className="hidden group-hover:inline group-focus-visible:inline">developed · open the live site ↗</span>
            </Plate>
          </a>

          <div className="mt-8 grid gap-x-(--grid-gap) gap-y-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 id="lead-name" className="text-[clamp(2.5rem,1rem+4vw,4.5rem)] leading-[0.9] font-[800] tracking-[-0.018em] text-(--fg) [font-stretch:75%]">
                {lead.name}
              </h2>
              <p className="mt-4 max-w-[48ch] text-[17px] leading-relaxed text-(--fg-muted)">
                <span className="text-(--fg)">Purpose:</span> {catalog[lead.name].tagline}
              </p>
              <p className="mt-6 flex flex-wrap gap-3">
                <LabButton href={live} size="sm">
                  Open the live site ↗
                </LabButton>
                <LabButton href={lead.html_url} size="sm" variant="secondary">
                  Source on GitHub
                </LabButton>
              </p>
            </div>

            <dl className="grid grid-cols-2 self-start shadow-[inset_0_1px_0_var(--fg)] sm:grid-cols-4 lg:col-span-7">
              {sheet.map(([k, v]) => (
                <div key={k} className="border-r border-b border-(--line) px-3 py-3 [&:nth-child(2n)]:border-r-0 sm:[&:nth-child(2n)]:border-r sm:[&:nth-child(4n)]:border-r-0">
                  <dt className="t-mono text-[11px] text-(--fg-subtle) uppercase">{k}</dt>
                  <dd className="t-mono mt-1 text-[14px] text-(--fg) tabular-nums">{v}</dd>
                </div>
              ))}
              <div className="col-span-full border-b border-(--line) px-3 py-3">
                <dt className="t-mono text-[11px] text-(--fg-subtle) uppercase">Researchers on this record</dt>
                <dd className="mt-2 flex flex-wrap gap-1">
                  {leadTeam.map((p) => (
                    <a key={p.login} href={p.html_url} title={p.login} className="block size-8 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-(--focus)">
                      <Dither src={`${p.avatar_url}${p.avatar_url.includes("?") ? "&" : "?"}s=64`} alt={p.login} width={1} height={1} tone="duotone" cell={1} />
                    </a>
                  ))}
                </dd>
              </div>
            </dl>
          </div>
        </article>
      </Container>

      <Container className="mt-24 lg:mt-32">
        <Record
          n="02.1"
          name="The log"
          meta={[`${counts("running")} running`, `${counts("paused")} paused`, `${counts("archived")} archived`]}
          title="Every record, by subjects."
          className="mb-8"
        />
        <Log rows={rows} />
      </Container>

      {/* The next row of the log, still empty: rose, because it's yours. */}
      <Container className="mt-24 mb-(--section-y) lg:mt-32">
        <section aria-labelledby="propose" className="p-5 shadow-[inset_0_0_0_1px_var(--mark)] md:p-8">
          <div className="t-mono flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-[12px] text-(--mark-ink)">
            <span>{nextId} · vacant</span>
            <span>status: proposed · subjects 0 · researchers: you</span>
          </div>
          <div className="mt-8 grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <h2 id="propose" className="text-[clamp(2.25rem,1rem+3.5vw,4rem)] leading-[0.92] font-[800] tracking-[-0.018em] text-balance text-(--fg) [font-stretch:75%]">
                Propose an experiment.
              </h2>
              <p className="mt-4 max-w-[52ch] text-[17px] leading-relaxed text-(--fg-muted)">
                Bring a tool worth building in the open, or pick up an open issue on one above. Protocol 01 walks you from fork to merged pull request.
              </p>
            </div>
            <p className="md:col-span-4 md:text-right">
              <LabButton href="/contribute">Propose an experiment →</LabButton>
            </p>
          </div>
        </section>
      </Container>
    </>
  );
}
