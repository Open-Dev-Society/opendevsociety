import type { Metadata } from "next";
import { Fragment } from "react";
import { Record } from "@/components/site/lab/Record";
import { LabButton } from "@/components/site/lab-hero/LabButton";
import { contactEmail, partnershipMailto } from "@/content";
import { mentions, type MentionSource } from "@/data/mentions";
import { activePartners, events, pastPartners, sponsorUrl, supporters } from "@/data/partners";
import { Photo } from "@/components/site/Avatar";
import { External } from "@/components/site/Icon";
import { PartnerLogo } from "@/components/site/PartnerLogo";
import { Plate } from "@/components/site/lab/Plate";
import { projectHref } from "@/lib/lab";
import { getWorkshop } from "@/lib/workshop";
import { Bibliography, type Kind, type Ref } from "./Bibliography";

export const revalidate = 3600;

/** An empty cell in a partner grid, offered to the next sponsor (rose: a spot that is yours to take). */
function OpenSlot({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  return (
    <li className={`bg-(--bg) ${className}`}>
      <a
        href={sponsorUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Become a sponsor on GitHub Sponsors (opens in a new tab)"
        className={`group flex h-full flex-col bg-[repeating-linear-gradient(135deg,transparent_0_7px,var(--line)_7px_8px)] hover:bg-(--surface-2) ${compact ? "p-5" : "p-5 sm:p-6"}`}
      >
        <div className="flex items-start justify-between gap-4">
          <p className="t-mono text-[12px] text-(--fg-subtle)">open to any sponsor</p>
          <Plate tone="mark">your logo here</Plate>
        </div>
        <p className={`${compact ? "mt-6 text-[17px]" : "mt-8 text-[22px]"} font-semibold leading-tight text-(--fg) group-hover:text-(--accent)`}>Become a sponsor</p>
        <p className="mt-3 max-w-[52ch] text-[15px] leading-[1.55] text-(--fg-muted)">
          Get your logo featured on every Open Dev Society project, and keep the tools free for everyone.
        </p>
        <span className="t-mono mt-auto pt-6 text-[12px] text-(--accent) group-hover:underline">Sponsor on GitHub ↗</span>
      </a>
    </li>
  );
}

export const metadata: Metadata = {
  title: "Word of mouth: what people say about Open Dev Society",
  description: `Every article, thread and post about Open Dev Society's free, open-source tools (${mentions.length} so far), plus the sponsors, partners and events behind the work.`,
};

const kinds: Record<MentionSource, Kind> = {
  article: "article",
  youtube: "social",
  twitter: "social",
  instagram: "social",
  linkedin: "social",
  facebook: "social",
  other: "community",
};

const clean = (s: string) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/^["“”]+|["“”]+$/g, "")
    .trim();
const years = [...new Set(mentions.map((m) => m.date).filter(Boolean))].sort();

const host = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "");
const list = (xs: string[]) => xs.map((x, i) => (i === 0 ? x : i === xs.length - 1 ? ` and ${x}` : `, ${x}`)).join("");

export default async function WordOfMouth() {
  const { tools } = await getWorkshop();
  const names = tools.map((r) => r.name);

  const refs: Ref[] = mentions.map((m, i) => {
    // "Tattva Tarang at Medium" → author and outlet; a bare name gets its site's host.
    const [author, at] = m.author.split(/ (?:at|via) /);
    const outlet = (at ?? new URL(m.url).hostname.replace(/^www\./, "")).replace("community-scripts/ProxmoxVE repository", "ProxmoxVE");
    // The old "Got mentioned by…" titles say nothing: those entries quote what the post said, or say where it ran.
    const empty = /^got mentioned|mention$/i.test(m.title);
    const said = clean(empty ? m.description || m.highlight || "" : m.title);
    const excerpt = clean(m.highlight ?? "");
    const hay = `${m.title} ${m.description} ${m.highlight ?? ""} ${m.url}`.toLowerCase();
    const tool = names.find((t) => new RegExp(`\\b${t.toLowerCase()}\\b`).test(hay));
    return {
      n: i + 1,
      kind: kinds[m.source],
      author,
      text: said ? said[0].toUpperCase() + said.slice(1) : `A post on ${outlet}.`,
      quoted: !!said,
      excerpt: excerpt && excerpt !== said ? excerpt : undefined,
      outlet,
      year: m.date,
      href: m.url,
      re: tool ? { name: tool, href: projectHref(tool) } : undefined,
    };
  });
  const epigraph = refs.find((r) => r.author === "Tattva Tarang")!;

  return (
    <article data-grid="What people say" className="mx-auto w-full max-w-(--container) px-(--gutter) pt-12 pb-24 lg:pt-16 lg:pb-32">
      {/* Title block: the record, then the count as the headline; the epigraph beside it. */}
      <div className="grid gap-y-10 lg:grid-cols-12 lg:gap-x-(--grid-gap)">
        <Record
          as="h1"
          size="page"
          name="Word of mouth"
          meta={[`${refs.length} mentions`, `${years[0]}–${years.at(-1)}`]}
          title={
            <>
              Written up <span className="tabular-nums text-(--accent)">{refs.length}</span> times.
            </>
          }
          className="lg:col-span-7"
        >
          <p className="mt-6 max-w-[48ch] text-[17px] leading-[1.6] text-(--fg-muted)">
            Articles, threads and posts from people who found the tools on their own. Wrote one?{" "}
            <a href={`mailto:${contactEmail}?subject=ODS mention`} className="ink-link">
              Send us the link
            </a>
            .
          </p>
        </Record>

        {/* The epigraph: the most-quoted line, set large and flush right, as at the head of a book. */}
        <figure className="self-end lg:col-span-5 lg:pb-2">
          <blockquote className="text-right text-[clamp(1.5rem,1.1rem+1.4vw,2.25rem)] leading-[1.08] font-[700] tracking-[-0.015em] text-balance text-(--fg) [font-stretch:75%]">
            <span className="text-(--fg-subtle)">&ldquo;…</span>great tools shouldn&apos;t hide behind logins or price tiers.
            <span className="text-(--fg-subtle)">&rdquo;</span>
          </blockquote>
          <figcaption className="t-mono mt-4 text-right text-[12px] text-(--fg-muted)">
            <span className="sign text-[17px] text-(--fg)">{epigraph.author}</span>, {epigraph.outlet}, {epigraph.year}{" "}
            <a href={`#cite-${epigraph.n}`} className="text-(--accent) hover:underline">
              [{epigraph.n}]
            </a>
          </figcaption>
        </figure>
      </div>

      <section aria-label="Mentions" data-grid="Mentions" className="pt-16 lg:pt-24">
        <Bibliography refs={refs} />
      </section>

      {/* Sponsors and partners: who backs the work now, who did before, the people, the events, then how to join them. */}
      <section id="partners" aria-labelledby="partners-h" data-grid="Sponsors and partners" className="pt-24 scroll-mt-20 lg:pt-32">
        <div className="grid gap-y-6 lg:grid-cols-12 lg:gap-x-(--grid-gap)">
          <Record
            name="Sponsors and partners"
            meta={[`${activePartners.length} active`, `${pastPartners.length} past`, `${supporters.length} past supporters`]}
            id="partners-h"
            title="Who backs the work."
            className="lg:col-span-5"
          />
          <p className="max-w-[62ch] text-[17px] leading-[1.7] text-(--fg) hyphens-auto lg:col-span-6 lg:col-start-7 lg:pt-9">
            The tools stay free with help from {list(activePartners.map((p) => p.name))}. Before them, {list(pastPartners.map((p) => p.name))}{" "}
            sponsored the work, and {list(supporters.map((s) => s.name))} backed it on GitHub Sponsors. We also thank the organisers of{" "}
            {events.map((e, i) => (
              <Fragment key={e.name}>
                {i > 0 && (i === events.length - 1 ? " and " : ", ")}
                {e.name} ({e.organizer}, {e.date})
              </Fragment>
            ))}{" "}
            for having us as a {events[0]?.role.toLowerCase()}.
          </p>
        </div>

        {/* Active: full cards, logos in ink. */}
        <h3 className="t-mono mt-12 text-[12px] text-(--fg-muted)">Active · {activePartners.length}</h3>
        <ul className={`mt-3 grid grid-cols-1 gap-px border border-(--line) bg-(--line) md:grid-cols-2`}>
          {activePartners.map((p) => (
            <li key={p.name} className="flex flex-col bg-(--bg) p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <p className="t-mono text-[12px] text-(--fg-subtle)">
                  {p.kind}
                  {p.tier && ` · ${p.tier.toLowerCase()} tier`}
                </p>
                <Plate tone="accent">● active</Plate>
              </div>
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="group mt-8 block w-fit" aria-label={`${p.name} (opens in a new tab)`}>
                <PartnerLogo p={p} className="h-8 w-44 text-[22px] text-(--fg) transition-colors duration-(--d-2) group-hover:text-(--accent)" />
              </a>
              <p className="mt-6 max-w-[52ch] text-[15px] leading-[1.55] text-(--fg-muted)">{p.line}</p>
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="t-mono mt-auto pt-6 text-[12px] text-(--accent) hover:underline">
                {host(p.url)} ↗
              </a>
            </li>
          ))}
          <OpenSlot className={activePartners.length % 2 ? "" : "md:col-span-2"} />
        </ul>

        {/* Past: the same grid, quieter. Logos in the subtle ink, ink again on hover. */}
        <h3 className="t-mono mt-10 text-[12px] text-(--fg-muted)">Past sponsors and partners · {pastPartners.length}</h3>
        <ul className="mt-3 grid grid-cols-1 gap-px border border-(--line) bg-(--line) sm:grid-cols-2 lg:grid-cols-4">
          {pastPartners.map((p) => (
            <li key={p.name} className="bg-(--bg)">
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="group flex h-full flex-col p-5 hover:bg-(--surface-2)" aria-label={`${p.name}, past ${p.kind} (opens in a new tab)`}>
                <div className="flex items-start justify-between gap-3">
                  <p className="t-mono text-[12px] text-(--fg-subtle)">{p.tier ? `${p.tier.toLowerCase()} tier` : p.kind}</p>
                  <Plate>past{p.period && ` · ${p.period}`}</Plate>
                </div>
                <PartnerLogo p={p} className="mt-6 h-6 w-36 text-[17px] text-(--fg-subtle) transition-colors duration-(--d-2) group-hover:text-(--fg)" />
                <p className="mt-4 text-[14px] leading-[1.5] text-(--fg-subtle)">{p.line}</p>
                <span className="t-mono mt-auto pt-4 text-[12px] text-(--fg-muted) group-hover:text-(--accent)">{host(p.url)} ↗</span>
              </a>
            </li>
          ))}
          {pastPartners.length % 2 > 0 && <OpenSlot compact />}
        </ul>

        {/* People who sponsor publicly, in their real colours. */}
        <h3 className="t-mono mt-10 text-[12px] text-(--fg-muted)">Past individual supporters · {supporters.length}</h3>
        <ul className="mt-3 flex flex-wrap gap-x-8 gap-y-4 border-t border-(--line) pt-4">
          {supporters.map((s) => (
            <li key={s.login}>
              <a href={`https://github.com/${s.login}`} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3">
                <Photo src={`https://avatars.githubusercontent.com/${s.login}`} px={40} className="size-10" />
                <span>
                  <span className="sign block text-[18px] leading-tight text-(--fg) group-hover:text-(--accent)">{s.name}</span>
                  <span className="t-mono block text-[12px] text-(--fg-muted)">@{s.login}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <table className="mt-12 w-full border-y border-(--fg) text-left text-[15px]">
          <caption className="t-mono mb-3 text-left text-[12px] text-(--fg-muted)">Community events</caption>
          <tbody>
            {events.map((e) => (
              <tr key={e.name} className="border-b border-(--line) align-baseline last:border-0">
                <th scope="row" className="py-3 pr-4 font-[650] text-(--fg)">
                  {e.name}
                  <span className="block text-[13px] font-normal text-(--fg-muted) sm:hidden">
                    {e.organizer} · {e.role}
                  </span>
                </th>
                <td className="py-3 pr-4 text-(--fg-muted) max-sm:hidden">{e.organizer}</td>
                <td className="py-3 pr-4 text-(--fg-muted) max-sm:hidden">{e.role}</td>
                <td className="t-mono py-3 text-right text-[12px] text-(--fg-muted)">{e.date}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div id="partner-cta" className="mt-16 grid scroll-mt-24 gap-8 border border-(--fg) p-6 sm:p-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end lg:mt-24 lg:p-10">
          <div>
            <p className="t-mono text-[12px] text-(--fg-muted)">Sponsorship</p>
            <h3 className="mt-3 max-w-[18ch] text-[clamp(2rem,1.4rem+2.4vw,3.25rem)] leading-[0.92] font-[800] tracking-[-0.018em] text-(--fg) [font-stretch:75%]">
              Sponsor Open Dev Society.
            </h3>
            <p className="mt-4 max-w-[52ch] text-[16px] leading-[1.6] text-(--fg-muted)">
              Sponsorship pays for hosting, data and the time it takes to keep the tools free. Monthly tiers run from $5 to $500 on GitHub
              Sponsors. Companies and communities can also write to us about a partnership or an event.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end">
            <LabButton href={sponsorUrl} target="_blank" rel="noopener noreferrer">
              Sponsor on GitHub <External size="1em" />
            </LabButton>
            <a href={partnershipMailto} className="t-mono text-[12px] text-(--fg-muted) hover:text-(--accent)">
              {contactEmail}
            </a>
          </div>
        </div>
      </section>
    </article>
  );
}
