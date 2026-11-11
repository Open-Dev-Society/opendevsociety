import type { Metadata } from "next";
import { Fragment } from "react";
import { Record } from "@/components/site/lab/Record";
import { LabButton } from "@/components/site/lab-hero/LabButton";
import { contactEmail, partnershipMailto } from "@/content";
import { mentions, type MentionSource } from "@/data/mentions";
import { events, partners } from "@/data/partners";
import { projectHref } from "@/lib/lab";
import { getWorkshop } from "@/lib/workshop";
import { Bibliography, type Kind, type Ref } from "./Bibliography";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Word of mouth: what people say about Open Dev Society",
  description: `Every article, thread and post about Open Dev Society's free, open-source tools (${mentions.length} so far), plus the partners and events behind the work.`,
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

// Ours, two lines each (brief §11).
const partnerLines: Record<string, string> = {
  "Siray.ai": "Unified AI infrastructure: run and scale models behind one fast, affordable API.",
  StellAILoom: "A hub where creators publish AI tools and everyone else finds and tries them.",
  "Atlas Cloud": "One API for hundreds of AI models, plus the infrastructure to run them.",
};

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

      {/* Partners, thanked in prose, then the logos and events. */}
      <section id="partners" aria-labelledby="partners-h" data-grid="Partners" className="pt-24 scroll-mt-20 lg:pt-32">
        <div className="grid gap-y-6 lg:grid-cols-12 lg:gap-x-(--grid-gap)">
          <Record
            name="Partners"
            meta={[`${partners.length} partners`, `${events.length} events`]}
            id="partners-h"
            title="Who backs the work."
            className="lg:col-span-5"
          />
          <p className="max-w-[62ch] text-[17px] leading-[1.7] text-(--fg) hyphens-auto lg:col-span-6 lg:col-start-7 lg:pt-9">
            The tools are kept free with help from {list(partners.map((p) => p.name))}, our technology partners. We also thank the
            organisers of{" "}
            {events.map((e, i) => (
              <Fragment key={e.name}>
                {i > 0 && (i === events.length - 1 ? " and " : ", ")}
                {e.name} ({e.organizer}, {e.date})
              </Fragment>
            ))}{" "}
            for having us as a {events[0]?.role.toLowerCase()}.
          </p>
        </div>

        {/* Partners on a visible grid, logos in ink. */}
        <ul className="mt-12 grid grid-cols-1 gap-px border border-(--line) bg-(--line) md:grid-cols-3">
          {partners.map((p) => (
            <li key={p.name} className="flex flex-col bg-(--bg) p-5 sm:p-6">
              <p className="t-mono text-[12px] text-(--fg-subtle)">{p.type} partner</p>
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="group mt-8 block" aria-label={`${p.name} (opens in a new tab)`}>
                <span
                  aria-hidden
                  className="block h-8 w-44 bg-(--fg) transition-colors duration-(--d-2) group-hover:bg-(--accent)"
                  style={{ maskImage: `url(${p.logo})`, WebkitMaskImage: `url(${p.logo})`, maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat", maskPosition: "left center", WebkitMaskPosition: "left center" }}
                />
              </a>
              <p className="mt-6 text-[15px] leading-[1.55] text-(--fg-muted)">{partnerLines[p.name] ?? p.description}</p>
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="t-mono mt-auto pt-6 text-[12px] text-(--accent) hover:underline">
                {p.url.replace(/^https?:\/\//, "")} ↗
              </a>
            </li>
          ))}
        </ul>

        <table className="mt-10 w-full border-y border-(--fg) text-left text-[15px]">
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
            <p className="t-mono text-[12px] text-(--fg-muted)">Partnerships</p>
            <h3 className="mt-3 max-w-[18ch] text-[clamp(2rem,1.4rem+2.4vw,3.25rem)] leading-[0.92] font-[800] tracking-[-0.018em] text-(--fg) [font-stretch:75%]">
              Back free software. Partner with us.
            </h3>
            <p className="mt-4 max-w-[52ch] text-[16px] leading-[1.6] text-(--fg-muted)">
              Brands reach the people building in the open. Communities get us as a partner for their event, hackathon or program.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end">
            <LabButton href={partnershipMailto}>Write to us →</LabButton>
            <span className="t-mono text-[12px] text-(--fg-subtle)">{contactEmail}</span>
          </div>
        </div>
      </section>
    </article>
  );
}
