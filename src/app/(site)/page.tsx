import type { Metadata } from "next";
import { HomeBands } from "@/components/site/home/HomeBands";
import { LabHero } from "@/components/site/lab-hero/LabHero";
import { compact } from "@/lib/format";
import { getOrgTotals } from "@/lib/github";
import { getWorkshop } from "@/lib/workshop";

// Matches the GitHub lib's cache, so "updated 14h ago" stays true.
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const [totals, { people }] = await Promise.all([getOrgTotals(), getWorkshop()]);
  return {
    title: "Open Dev Society: free, open-source software, built in public",
    description: `A community of developers, designers and writers building free, open-source tools in public. ${compact(totals.stars)} stars, ${people.length} contributors, no paywalls.`,
  };
}

export default async function Home() {
  const [{ now, tools, people, lastPush }, totals] = await Promise.all([getWorkshop(), getOrgTotals()]);
  return (
    <>
      <LabHero now={now} tools={tools} people={people} lastPush={lastPush} stars={totals.stars} />
      <HomeBands />
    </>
  );
}
