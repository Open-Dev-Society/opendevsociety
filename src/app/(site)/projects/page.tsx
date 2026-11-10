import type { Metadata } from "next";
import { Button, Print, RepoIndex, RepoTile, Section, SectionHeader } from "@/components/site";
import { social } from "@/content";
import { compact } from "@/lib/format";
import { getOrgTotals } from "@/lib/github";
import { getWorkshop, listNames } from "@/lib/workshop";

// Matches the GitHub lib's cache.
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const [{ tools }, totals] = await Promise.all([getWorkshop(), getOrgTotals()]);
  return {
    title: `Work: ${tools.length} free, open-source tools · Open Dev Society`,
    description: `Every Open Dev Society tool, free to use and free to fork. ${compact(totals.stars)} stars on GitHub, built in public.`,
  };
}

// What the society gives a project that joins (from the manifesto's "Platform, not gatekeeper").
const gives = [
  { title: "Contributors", body: "People who fork it, fix it and review each other's pull requests." },
  { title: "Visibility", body: "A shelf next to OpenStock, and a community whose work gets written about." },
  { title: "Review", body: "Maintainers review in the open. You keep full credit and every decision." },
];

export default async function WorkPage() {
  const { tools, index, featured, thisWeek, openstockPrint } = await getWorkshop();

  return (
    <>
      <Section className="pt-16 lg:pt-24">
        <SectionHeader
          as="h1"
          eyebrow="Work"
          count={`${tools.length} tools`}
          title={`${tools.length} tools. 0 paywalls.`}
          description={
            thisWeek.length
              ? `Free to use, free to fork, all public on GitHub. Pushed to this week: ${listNames(thisWeek)}.`
              : "Free to use, free to fork, all public on GitHub."
          }
        />
        <Print priority {...openstockPrint} />

        <h2 className="t-title mt-20 text-(--fg) lg:mt-24">Recently on the bench</h2>
        <div className="-mx-(--gutter) mt-6 flex snap-x snap-mandatory scroll-px-(--gutter) gap-3 overflow-x-auto px-(--gutter) pb-2 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-(--grid-gap) lg:overflow-visible lg:px-0 lg:pb-0">
          {featured.map(({ repo, shot }) => (
            <RepoTile key={repo.name} repo={repo} shot={shot} className="w-[78vw] max-w-sm shrink-0 snap-start lg:w-auto lg:max-w-none" />
          ))}
        </div>

        <h2 className="t-title mt-20 text-(--fg) lg:mt-24">Every tool</h2>
        <div className="mt-6">
          <RepoIndex repos={index} mobileRows={Infinity} />
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeader
          eyebrow="Bring your project"
          title="Your project. Your vision. Our community."
          description="Have something worth building in the open? Bring it here and build it with us."
        />
        <ul className="grid grid-cols-1 gap-x-(--grid-gap) gap-y-8 md:grid-cols-3 lg:ml-[25%]">
          {gives.map((g) => (
            <li key={g.title} className="border-t border-(--line) pt-5">
              <h3 className="t-title text-(--fg)">{g.title}</h3>
              <p className="mt-2 text-(--fg-muted)">{g.body}</p>
            </li>
          ))}
        </ul>
        <div className="mt-10 lg:ml-[25%]">
          <Button href={social.discord.href} external icon="external" size="lg">
            Pitch it on Discord
          </Button>
        </div>
      </Section>
    </>
  );
}
