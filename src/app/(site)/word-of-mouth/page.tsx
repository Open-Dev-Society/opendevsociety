import type { Metadata } from "next";
import { Button, Card, Ledger, PartnerCard, Quote, Section, SectionHeader } from "@/components/site";
import { contactEmail, partnershipMailto } from "@/content";
import { mentions, type MentionSource } from "@/data/mentions";
import { events, partners } from "@/data/partners";
import { MentionLedger, type Kind, type MentionRow } from "./MentionLedger";

export const metadata: Metadata = {
  title: "Word of mouth: Open Dev Society",
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

// "Tattva Tarang at Medium" → author and outlet; a bare name gets its site's host as the outlet.
const rows: MentionRow[] = mentions.map((m) => {
  const [author, at] = m.author.split(/ (?:at|via) /);
  const outlet = (at ?? new URL(m.url).hostname.replace(/^www\./, "")).replace("community-scripts/ProxmoxVE repository", "ProxmoxVE");
  // The old "Got mentioned by…" titles say nothing, so those rows show what the post said, or where it ran.
  const said = /^got mentioned|mention$/i.test(m.title) ? m.description || m.highlight || `A post on ${outlet}.` : m.title;
  const title = said.replace(/&amp;/g, "&").replace(/^["“”]+|["“”]+$/g, "").trim();
  return { kind: kinds[m.source], outlet, author, title: title[0].toUpperCase() + title.slice(1), year: m.date, href: m.url };
});

const feature = rows.find((r) => r.author === "Tattva Tarang")!;

// Ours, two lines each (brief §11).
const partnerLines: Record<string, string> = {
  "Siray.ai": "Unified AI infrastructure: run and scale models behind one fast, affordable API.",
  StellAILoom: "A hub where creators publish AI tools and everyone else finds and tries them.",
  "Atlas Cloud": "One API for hundreds of AI models, plus the infrastructure to run them.",
};

export default function WordOfMouth() {
  return (
    <>
      <section className="mx-auto w-full max-w-(--container) px-(--gutter) pt-16 lg:pt-24">
        <SectionHeader
          as="h1"
          eyebrow="Word of mouth"
          count={`${mentions.length} mentions`}
          title="What people wrote when they found it."
          description="Articles, threads and posts from people who found the tools on their own. Wrote one? Send us the link."
        />
      </section>

      <Section className="pt-0 lg:pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-(--grid-gap)">
          <Quote
            variant="feature"
            className="lg:col-span-8 lg:col-start-4"
            quote="…great tools shouldn't hide behind logins or price tiers."
            name={feature.author}
            source={feature.outlet}
            year={feature.year}
            href={feature.href}
          />
        </div>
        <div className="mt-16 lg:mt-24">
          <MentionLedger mentions={rows} />
        </div>
        <p className="t-meta mt-8 text-(--fg-muted)">
          Wrote about a tool?{" "}
          <a href={`mailto:${contactEmail}?subject=ODS mention`} className="ink-link">
            Send us the link →
          </a>
        </p>
      </Section>

      <Section id="partners" tone="muted">
        <SectionHeader
          eyebrow="Partners"
          count={`${partners.length} partners · ${events.length} events`}
          title="Who backs the work."
          description="Companies that help keep the tools free, and the events we stand behind."
        />
        <div className="grid grid-cols-1 gap-(--grid-gap) md:grid-cols-3">
          {partners.map((p) => (
            <PartnerCard key={p.name} name={p.name} logo={p.logo} invertLogo={p.invertLogo} href={p.url} line={partnerLines[p.name] ?? p.description} />
          ))}
        </div>

        <h3 className="t-title mt-16 text-(--fg)">Events</h3>
        <Ledger
          className="mt-6"
          caption="Events"
          columns={[
            { key: "name", label: "Event" },
            { key: "organizer", label: "Organised by", width: "minmax(0,1fr)" },
            { key: "role", label: "Our role", width: "12rem" },
            { key: "year", label: "Year", width: "3.5rem", mono: true },
          ]}
          rows={events.map((e) => ({
            key: e.name,
            cells: { name: e.name, organizer: e.organizer, role: e.role, year: <span className="tabular-nums">{e.date}</span> },
          }))}
        />

        <Card className="mt-16 lg:mt-24">
          <div id="partner-cta" className="flex scroll-mt-24 flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h3 className="display-3 max-w-[22ch] text-(--fg)">Back free software. Partner with us.</h3>
              <p className="mt-3 max-w-[52ch] text-(--fg-muted)">
                Brands reach the people building in the open. Communities get us as a partner for their event, hackathon or program.
              </p>
            </div>
            <div className="flex flex-col gap-2 md:items-end">
              <Button href={partnershipMailto} icon="arrow">
                Write to us
              </Button>
              <span className="t-mono text-(--fg-subtle)">{contactEmail}</span>
            </div>
          </div>
        </Card>
      </Section>
    </>
  );
}
