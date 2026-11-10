import type { Metadata } from "next";
import { Container } from "@/components/site";
import { LabButton } from "@/components/site/lab-hero/LabButton";
import { Dither } from "@/components/site/lab/Dither";
import { Plate } from "@/components/site/lab/Plate";
import { Record } from "@/components/site/lab/Record";
import { catalog, languageColors } from "@/data/catalog";
import { ago, compact } from "@/lib/format";
import { labDate, status, STATUS_MARK } from "@/lib/lab";
import { getWorkshop } from "@/lib/workshop";
import { Log, type LogRow } from "./Log";
import { STATUS_LABEL } from "./status";

// Matches the GitHub lib's cache.
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const { tools, now } = await getWorkshop();
  const running = tools.filter((t) => status(t, now) === "running").length;
  return {
    title: `Projects: ${tools.length} free, open-source tools, ${running} active · Open Dev Society`,
    description: `Every Open Dev Society project, free to use and free to fork: what it does, its stars, contributors and last push. Have a project? Bring it to ODS.`,
  };
}

const DAY = 864e5;

export default async function ProjectsPage() {
  const { now, tools, people, lastPush } = await getWorkshop();
  const byStars = [...tools].sort((a, b) => b.stars - a.stars || a.name.localeCompare(b.name));
  const team = (name: string) => people.filter((p) => p.repos.includes(name));

  const rows: LogRow[] = byStars.map((r, i) => ({
    rank: String(i + 1).padStart(2, "0"),
    name: r.name,
    url: r.html_url,
    tagline: catalog[r.name].tagline,
    badge: catalog[r.name].badge,
    status: status(r, now),
    audience: catalog[r.name].audience,
    stars: compact(r.stars),
    contributors: team(r.name).length,
    language: r.language,
    languageColor: r.language ? languageColors[r.language] : undefined,
    days: (now - Date.parse(r.pushed_at)) / DAY,
    ago: ago(r.pushed_at, now),
    date: labDate(r.pushed_at),
    shot: catalog[r.name].shot,
  }));
  const counts = (s: string) => rows.filter((r) => r.status === s).length;

  const lead = byStars[0];
  const leadTeam = team(lead.name);
  const leadStatus = status(lead, now);
  const live = lead.homepage ?? lead.html_url;
  // The lead's facts, read left to right.
  const sheet: [string, React.ReactNode][] = [
    ["Status", `${STATUS_MARK[leadStatus]} ${STATUS_LABEL[leadStatus]}`],
    ["Started", lead.created_at ? labDate(lead.created_at) : "—"],
    ["Stars", `${lead.stars.toLocaleString("en-US")} ★`],
    ["Forks", lead.forks.toLocaleString("en-US")],
    ["Contributors", leadTeam.length],
    ["Language", lead.language ?? "—"],
    ["Last push", `${ago(lead.pushed_at, now)} · ${labDate(lead.pushed_at)}`],
    ["Open issues", lead.open_issues],
  ];

  return (
    <>
      <Container data-grid="Projects" className="pt-14 lg:pt-20">
        <Record
          as="h1"
          size="page"
          name="Projects"
          meta={[tools.length, `updated ${ago(lastPush, now)}`]}
          title={
            <>
              {tools.length} projects.
              <br />
              <span className="text-(--accent)">{counts("running")} active.</span>
            </>
          }
        >
          <p className="mt-6 max-w-[60ch] text-[17px] leading-relaxed text-(--fg-muted)">
            Every tool Open Dev Society builds, free to use and free to fork, most starred first. A project is{" "}
            <i className="not-italic text-(--fg)">active</i> if someone pushed to it in the last 30 days, <i className="not-italic text-(--fg)">quiet</i> within 180
            days, and <i className="not-italic text-(--fg)">archived</i> after that.
          </p>
        </Record>
      </Container>

      {/* The most starred project: its screenshot and its facts. */}
      <Container data-grid="Most starred" className="pt-14 lg:pt-20">
        <article id={lead.name} aria-labelledby="lead-name" className="scroll-mt-24 border-t-[3px] border-double border-(--fg) pt-3">
          <div className="t-mono flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-[12px] text-(--fg-muted)">
            <span>
              <span className="text-(--fg)">Most starred</span> · {compact(lead.stars)} ★
            </span>
            <span>{live.replace(/^https?:\/\//, "")}</span>
          </div>

          <a href={live} className="group relative mt-3 block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--focus)">
            <Dither
              src="/shots/openstock-desktop.jpg"
              alt={`${lead.name}, live: index prices, the market clock and a chart`}
              width={2880}
              height={1800}
              align="top"
              negative
              develop
              eager
              className="w-full shadow-[0_0_0_1px_var(--line)]"
            />
            <Plate as="div" tone="ink" className="absolute top-3 left-3 md:top-4 md:left-4">
              {lead.name}
            </Plate>
            <Plate as="div" tone={leadStatus === "running" ? "accent" : "plain"} className="absolute top-3 right-3 md:top-4 md:right-4">
              {STATUS_MARK[leadStatus]} {STATUS_LABEL[leadStatus]}
            </Plate>
            <Plate as="div" className="absolute bottom-3 left-3 hidden md:bottom-4 md:left-4 md:inline-flex">
              <span className="group-hover:hidden group-focus-visible:hidden">hover to see it</span>
              <span className="hidden group-hover:inline group-focus-visible:inline">open the live site ↗</span>
            </Plate>
          </a>

          <div className="mt-8 grid gap-x-(--grid-gap) gap-y-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 id="lead-name" className="text-[clamp(2.5rem,1rem+4vw,4.5rem)] leading-[0.9] font-[800] tracking-[-0.018em] text-(--fg) [font-stretch:75%]">
                {lead.name}
              </h2>
              <p className="mt-4 max-w-[48ch] text-[17px] leading-relaxed text-(--fg-muted)">
                {catalog[lead.name].tagline}
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
                <dt className="t-mono text-[11px] text-(--fg-subtle) uppercase">People who built it</dt>
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

      <Container data-grid="All projects" className="pt-24 lg:pt-32">
        <Record
          name="All projects"
          meta={[`${counts("running")} active`, `${counts("paused")} quiet`, `${counts("archived")} archived`]}
          title="Every project, by stars."
          className="mb-8"
        />
        <Log rows={rows} />
      </Container>

      {/* For founders: the next row, still empty. Rose, because it's theirs. */}
      <Container data-grid="Your project" className="pt-24 mb-(--section-y) lg:pt-32">
        <section aria-labelledby="bring" className="p-5 shadow-[inset_0_0_0_1px_var(--mark)] md:p-8">
          <div className="t-mono flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-[12px] text-(--mark-ink)">
            <span>#{String(tools.length + 1).padStart(2, "0")} · your project here</span>
            <span>you keep ownership and credit</span>
          </div>
          <div className="mt-8 grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <h2 id="bring" className="text-[clamp(2.25rem,1rem+3.5vw,4rem)] leading-[0.92] font-[800] tracking-[-0.018em] text-balance text-(--fg) [font-stretch:75%]">
                Have a project? Bring it to ODS.
              </h2>
              <p className="mt-4 max-w-[52ch] text-[17px] leading-relaxed text-(--fg-muted)">
                Building something worth doing in the open? List it here next to OpenStock. The community brings contributors, code review and visibility; you keep every
                decision.
              </p>
            </div>
            <p className="flex flex-wrap gap-3 md:col-span-5 md:justify-end">
              <LabButton href="/contribute">Bring your project →</LabButton>
              <LabButton href="/manifesto" variant="secondary">
                See how it works
              </LabButton>
            </p>
          </div>
        </section>
      </Container>
    </>
  );
}
