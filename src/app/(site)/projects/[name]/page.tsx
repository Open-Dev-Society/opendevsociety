import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Container, sizedAvatar } from "@/components/site";
import { LabButton } from "@/components/site/lab-hero/LabButton";
import { Dither } from "@/components/site/lab/Dither";
import { DitherEdge } from "@/components/site/lab/DitherEdge";
import { Plate } from "@/components/site/lab/Plate";
import { Record } from "@/components/site/lab/Record";
import { catalog } from "@/data/catalog";
import { ago, compact } from "@/lib/format";
import { labDate, status, STATUS_MARK } from "@/lib/lab";
import { getWorkshop } from "@/lib/workshop";
import { CopyButton } from "../../manifesto/CopyButton";
import { STATUS_LABEL } from "../status";
import { Activity } from "./Activity";
import { getProject, getProjectNames } from "@/lib/github";

// Matches the GitHub lib's cache.
export const revalidate = 3600;

type Props = { params: Promise<{ name: string }> };

export async function generateStaticParams() {
  return (await getProjectNames()).map((name) => ({ name }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProject((await params).name);
  if (!p) return {};
  const { name } = p.repo;
  const title = `${name}: ${catalog[name].tagline} · Open Dev Society`;
  const description = `${p.repo.description ?? catalog[name].tagline} Free and open source: ${p.repo.stars.toLocaleString("en-US")} stars, ${p.contributors.length} contributors.`;
  const shot = catalog[name].shot;
  return {
    title,
    description,
    alternates: { canonical: `/projects/${name}` },
    openGraph: { title, description, type: "website", url: `/projects/${name}`, ...(shot && { images: [{ url: shot, alt: `${name}, screenshot` }] }) },
    twitter: { card: shot ? "summary_large_image" : "summary", title, description },
  };
}

const MAX_PEOPLE = 24;

export default async function ProjectPage({ params }: Props) {
  const { name: asked } = await params;
  const p = await getProject(asked);
  if (!p) notFound();
  const { repo } = p;
  if (repo.name !== asked) permanentRedirect(`/projects/${repo.name}`);

  const { now, tools, builders } = await getWorkshop();
  const entry = catalog[repo.name];
  const st = status(repo, now);
  const live = repo.homepage ?? repo.html_url;
  const byStars = [...tools].sort((a, b) => b.stars - a.stars || a.name.localeCompare(b.name));
  const rank = byStars.findIndex((t) => t.name === repo.name) + 1;
  const fork = `gh repo fork Open-Dev-Society/${repo.name} --clone`;
  const realName = (login: string) => builders.find((b) => b.login === login)?.name;
  // Same audience first, then by stars.
  const more = byStars.filter((t) => t.name !== repo.name).sort((a, b) => Number(catalog[b.name].audience === entry.audience) - Number(catalog[a.name].audience === entry.audience)).slice(0, 3);
  const commits = p.weeks.reduce((n, w) => n + w.commits, 0);
  const people = p.contributors.length;

  // Its facts, read left to right.
  const sheet: [string, React.ReactNode][] = [
    ["Status", `${STATUS_MARK[st]} ${STATUS_LABEL[st]}`],
    ["Stars", `${repo.stars.toLocaleString("en-US")} ★`],
    ["Forks", repo.forks.toLocaleString("en-US")],
    ["Contributors", people],
    ["Language", repo.language ?? "—"],
    ["License", repo.license ?? "—"],
    ["Last push", `${ago(repo.pushed_at, now)} · ${labDate(repo.pushed_at)}`],
    ["Started", labDate(repo.created_at)],
  ];

  return (
    <>
      <Container data-grid={repo.name} className="pt-14 lg:pt-20">
        <Record
          as="h1"
          size="page"
          name="Project"
          meta={[
            <Link key="all" href="/projects" className="underline-offset-4 hover:text-(--fg) hover:underline">
              all {tools.length} projects
            </Link>,
            `#${rank} by stars`,
            `updated ${ago(repo.pushed_at, now)}`,
          ]}
          title={repo.name}
        >
          <p className="mt-5 max-w-[40ch] text-[clamp(1.25rem,1rem+1vw,1.75rem)] leading-snug text-(--fg)">
            {entry.tagline}
            {entry.badge && (
              <Plate tone="mark" className="ml-3 align-middle">
                {entry.badge}
              </Plate>
            )}
          </p>
          {repo.description && <p className="mt-4 max-w-[65ch] text-[17px] leading-relaxed text-(--fg-muted)">{repo.description}</p>}
          <p className="mt-8 flex flex-wrap gap-3">
            {repo.homepage && <LabButton href={repo.homepage}>Open the project ↗</LabButton>}
            <LabButton href={repo.html_url} variant={repo.homepage ? "secondary" : "primary"}>
              Source on GitHub ↗
            </LabButton>
          </p>
        </Record>

        <dl className="mt-12 grid grid-cols-2 shadow-[inset_0_1px_0_var(--fg)] sm:grid-cols-4">
          {sheet.map(([k, v]) => (
            <div key={k} className="border-r border-b border-(--line) px-3 py-3 [&:nth-child(2n)]:border-r-0 sm:[&:nth-child(2n)]:border-r sm:[&:nth-child(4n)]:border-r-0">
              <dt className="t-mono text-[11px] text-(--fg-subtle) uppercase">{k}</dt>
              <dd className="t-mono mt-1 text-[14px] text-(--fg) tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>
      </Container>

      {entry.shot && (
        <Container data-grid="Screenshot" className="pt-14 lg:pt-20">
          <a href={live} className="group relative block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--focus)">
            <Dither src={entry.shot} alt={`${repo.name}, screenshot`} width={2880} height={1800} align="top" negative develop className="w-full shadow-[0_0_0_1px_var(--line)]" />
            <Plate as="div" tone="ink" className="absolute top-3 left-3 md:top-4 md:left-4">
              {repo.name}
            </Plate>
            <Plate as="div" className="absolute bottom-3 left-3 hidden md:bottom-4 md:left-4 md:inline-flex">
              <span className="group-hover:hidden group-focus-visible:hidden">hover to see it</span>
              <span className="hidden group-hover:inline group-focus-visible:inline">{repo.homepage ? "open the project ↗" : "open on GitHub ↗"}</span>
            </Plate>
          </a>
        </Container>
      )}

      <Container data-grid="Activity" className="pt-24 lg:pt-32">
        <Record
          name="Activity"
          meta={p.weeks.length ? [`${commits.toLocaleString("en-US")} commits`, "last 52 weeks"] : ["last 52 weeks"]}
          title={!p.weeks.length ? "A year of commits." : commits ? `${commits.toLocaleString("en-US")} ${commits === 1 ? "commit" : "commits"} in the past year.` : "Quiet this past year."}
          className="mb-8"
        />
        {p.weeks.length ? (
          <Activity weeks={p.weeks} />
        ) : (
          <p className="t-mono border-b border-(--line) py-8 text-[13px] text-(--fg-muted)">
            GitHub is still counting this project&apos;s commits. Check back in a few minutes, or{" "}
            <a href={`${repo.html_url}/commits`} className="text-(--accent) underline underline-offset-4">
              see them on GitHub ↗
            </a>
          </p>
        )}
      </Container>

      <Container data-grid="Built by" className="pt-24 lg:pt-32">
        <Record name="Built by" meta={[`${people} ${people === 1 ? "person" : "people"}`, "all-time commits, most first"]} title={`The people behind ${repo.name}.`} className="mb-8" />
        <ul className="grid grid-cols-1 shadow-[inset_0_1px_0_var(--fg)] sm:grid-cols-2 lg:grid-cols-4">
          {p.contributors.slice(0, MAX_PEOPLE).map((c) => (
            <li key={c.login} className="border-b border-(--line) sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(4n)]:border-r-0">
              <a href={c.html_url} className="group flex items-center gap-3 px-3 py-3 transition-colors duration-(--d-2) hover:bg-(--surface-2) focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--focus)">
                <Dither src={sizedAvatar(c.avatar_url, 48)} alt="" width={1} height={1} tone="duotone" cell={1} develop className="size-12 shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-[700] text-(--fg) group-hover:underline group-hover:underline-offset-4">{realName(c.login) ?? c.login}</span>
                  <span className="t-mono block truncate text-[12px] text-(--fg-muted)">@{c.login}</span>
                </span>
                <span className="t-mono shrink-0 text-right text-[12px] leading-tight text-(--fg-subtle) tabular-nums">
                  <span className="block text-[14px] text-(--fg)">{c.contributions.toLocaleString("en-US")}</span>
                  {c.contributions === 1 ? "commit" : "commits"}
                </span>
              </a>
            </li>
          ))}
        </ul>
        {people > MAX_PEOPLE && (
          <p className="t-mono mt-4 text-[13px]">
            <a href={`${repo.html_url}/graphs/contributors`} className="text-(--accent) underline underline-offset-4">
              and {people - MAX_PEOPLE} more on GitHub ↗
            </a>
          </p>
        )}
      </Container>

      {/* Emerald: the band that asks you to act. */}
      <DitherEdge from="var(--bg)" to="var(--accent)" className="mt-24 lg:mt-32" />
      <section aria-labelledby="help" className="tone-emerald bg-(--bg) py-16 lg:py-24">
        <Container data-grid="Help out" className="grid gap-x-(--grid-gap) gap-y-12 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-5">
            <Record name="Help out" meta={[`${p.issues.length} good first ${p.issues.length === 1 ? "issue" : "issues"}`]} title={`Make ${repo.name} better.`} id="help">
              <p className="mt-5 max-w-[48ch] text-[17px] leading-relaxed text-(--fg-muted)">
                Fork it, pick an issue, open a pull request. Code, design, docs and bug reports all count, and your name goes on this page.
              </p>
            </Record>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <code className="t-mono min-w-0 max-w-full overflow-x-auto px-3 py-2 text-[13px] whitespace-nowrap text-(--fg) shadow-[inset_0_0_0_1px_var(--line)]">{fork}</code>
              <CopyButton text={fork} label="Copy command" />
            </div>
            <p className="mt-8">
              <LabButton href="/contribute" variant="secondary" size="md">
                How to contribute →
              </LabButton>
            </p>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <h3 className="t-mono border-b border-(--fg) pb-2 text-[12px] text-(--fg) uppercase">Good first issues</h3>
            {p.issues.length ? (
              <ol>
                {p.issues.map((i) => (
                  <li key={i.number} className="border-b border-(--line)">
                    <a href={i.url} className="group flex items-baseline gap-4 py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--focus)">
                      <span className="t-mono shrink-0 text-[12px] text-(--fg-subtle) tabular-nums">#{i.number}</span>
                      <span className="min-w-0 flex-1 text-(--fg) group-hover:underline group-hover:underline-offset-4">{i.title}</span>
                      <span className="t-mono shrink-0 text-[12px] text-(--fg-subtle)">{ago(i.createdAt, now)} ↗</span>
                    </a>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="border-b border-(--line) py-6 text-[16px] leading-relaxed text-(--fg-muted)">
                None open right now.{" "}
                <a href={`${repo.html_url}/issues${repo.open_issues ? "" : "/new"}`} className="text-(--fg) underline underline-offset-4">
                  {repo.open_issues ? `See all ${repo.open_issues} open issues ↗` : "Open an issue ↗"}
                </a>{" "}
                {repo.open_issues ? "or suggest an improvement of your own." : "with a bug or an idea."}
              </p>
            )}
          </div>
        </Container>
      </section>
      <DitherEdge from="var(--accent)" to="var(--bg)" />

      {(p.release || repo.topics.length > 0) && (
        <Container data-grid="Release and topics" className="grid gap-x-(--grid-gap) gap-y-12 pt-24 lg:grid-cols-12 lg:pt-32">
          {p.release && (
            <div className="lg:col-span-5">
              <h2 className="t-mono border-b border-(--fg) pb-2 text-[12px] text-(--fg) uppercase">Latest release</h2>
              <a href={p.release.url} className="group mt-4 block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--focus)">
                <span className="block text-[clamp(1.75rem,1rem+2vw,2.5rem)] leading-none font-[800] text-(--fg) [font-stretch:75%] group-hover:underline group-hover:underline-offset-4">
                  {p.release.tag}
                </span>
                <span className="t-mono mt-2 block text-[12px] text-(--fg-muted)">
                  {p.release.name && p.release.name !== p.release.tag && `${p.release.name} · `}
                  {labDate(p.release.publishedAt)} · release notes ↗
                </span>
              </a>
            </div>
          )}
          {repo.topics.length > 0 && (
            <div className={p.release ? "lg:col-span-7" : "lg:col-span-12"}>
              <h2 className="t-mono border-b border-(--fg) pb-2 text-[12px] text-(--fg) uppercase">Topics</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {repo.topics.map((t) => (
                  <li key={t}>
                    <Plate>{t}</Plate>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Container>
      )}

      <Container data-grid="More projects" className="pt-24 mb-(--section-y) lg:pt-32">
        <Record name="More projects" meta={[<Link key="all" href="/projects" className="underline-offset-4 hover:text-(--fg) hover:underline">see all {tools.length}</Link>]} title="Keep exploring." className="mb-8" />
        <ul className="grid shadow-[inset_0_1px_0_var(--fg)] md:grid-cols-3">
          {more.map((t) => (
            <li key={t.name} className="border-b border-(--line) md:border-r md:last:border-r-0">
              <Link href={`/projects/${t.name}`} className="group block p-3 transition-colors duration-(--d-2) hover:bg-(--surface-2) focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--focus)">
                {catalog[t.name].shot ? (
                  <Dither src={catalog[t.name].shot!} negative alt={`${t.name}, screenshot`} width={16} height={10} align="top" cell={1.5} develop className="w-full shadow-[0_0_0_1px_var(--line)]" />
                ) : (
                  <span className="t-mono flex aspect-[16/10] w-full items-center justify-center text-[11px] text-(--fg-subtle) shadow-[inset_0_0_0_1px_var(--line)]">{t.language ?? "no preview"}</span>
                )}
                <span className="mt-3 flex items-baseline justify-between gap-3">
                  <span className="font-[700] text-(--fg) group-hover:underline group-hover:underline-offset-4">{t.name}</span>
                  <span className="t-mono text-[12px] text-(--fg-muted) tabular-nums">{compact(t.stars)} ★</span>
                </span>
                <span className="mt-0.5 block text-[15px] leading-snug text-(--fg-muted)">{catalog[t.name].tagline}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
