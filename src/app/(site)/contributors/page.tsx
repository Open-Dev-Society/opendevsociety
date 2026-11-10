import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { Avatar, Ledger, Masthead, Section, SectionHeader, SectionLink, Wall } from "@/components/site";
import { getWorkshop } from "@/lib/workshop";

// Matches the GitHub lib's cache.
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const { builders } = await getWorkshop();
  return {
    title: `People: ${builders.length} builders, credited by name · Open Dev Society`,
    description: `Everyone who has shipped code to Open Dev Society, by name and contribution. Seat ${builders.length + 1} is open.`,
  };
}

const MAX_REPOS = 3;

export default async function PeoplePage() {
  const { builders } = await getWorkshop();
  const seat = builders.length + 1;

  return (
    <>
      <Section className="pt-16 lg:pt-24">
        <SectionHeader
          as="h1"
          eyebrow="People"
          count={`${builders.length} builders`}
          title={`${builders.length} people, credited by name.`}
          description="Everyone with a merged pull request in an Open Dev Society repo. Hover a face to see what they built."
        />
        <Masthead className="mb-8" />
        <Wall builders={builders} size="page" />
      </Section>

      <Section tone="muted">
        <SectionHeader eyebrow="The ledger" count={`${builders.length} rows`} title="Who built what." />
        <Ledger
          caption="Contributors by number of contributions"
          columns={[
            { key: "who", label: "Builder", width: "minmax(0,1fr)" },
            { key: "n", label: "Contributions", width: "8rem", mono: true, align: "end" },
            { key: "repos", label: "Repos", width: "minmax(0,16rem)" },
            { key: "go", label: "", width: "1.5rem", align: "end" },
          ]}
          rows={builders.map((b) => ({
            key: b.login,
            cells: {
              who: (
                <span className="flex min-w-0 items-center gap-3">
                  <Avatar src={b.avatar} name="" size={32} />
                  <span className="min-w-0 truncate">
                    {b.name && <span className="sign mr-2 text-(--fg)">{b.name}</span>}
                    <a href={b.url} target="_blank" rel="noopener noreferrer" className="t-mono text-(--fg-muted) hover:text-(--fg)">
                      @{b.login}
                    </a>
                  </span>
                </span>
              ),
              n: (
                <span>
                  {b.contributions.toLocaleString("en-US")}
                  <span className="md:hidden"> {b.contributions === 1 ? "contribution" : "contributions"}</span>
                </span>
              ),
              repos:
                b.repos.slice(0, MAX_REPOS).join(", ") + (b.repos.length > MAX_REPOS ? ` +${b.repos.length - MAX_REPOS}` : ""),
              go: (
                <a href={b.url} target="_blank" rel="noopener noreferrer" aria-label={`@${b.login} on GitHub`} className="inline-grid size-6 place-items-center text-(--fg-subtle) hover:text-(--fg)">
                  <ArrowUpRight className="size-4" strokeWidth={1.75} />
                </a>
              ),
            },
          }))}
        />
        <SectionLink href="/contribute">Seat {seat} is open</SectionLink>
      </Section>
    </>
  );
}
