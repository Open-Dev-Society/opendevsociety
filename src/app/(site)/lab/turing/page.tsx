import type { Metadata } from "next";
import { LabHero } from "@/components/site/lab-hero/LabHero";
import { getOrgTotals } from "@/lib/github";
import { getWorkshop } from "@/lib/workshop";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Lab hero: Turing patterns (preview)", robots: { index: false } };

export default async function TuringPreview() {
  const [{ now, tools, people, lastPush }, totals] = await Promise.all([getWorkshop(), getOrgTotals()]);
  return (
    <>
      <LabHero now={now} tools={tools} people={people} lastPush={lastPush} stars={totals.stars} />
      {/* Room to scroll the hero off-screen (the field pauses). */}
      <div aria-hidden className="h-[150vh]" />
    </>
  );
}
