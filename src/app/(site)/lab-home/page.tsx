// TEMP preview of the new home (Claude Code 15). Delete once src/app/(site)/page.tsx uses HomeBands.
import { HomeBands } from "@/components/site/home/HomeBands";
import { LabHero } from "@/components/site/lab-hero/LabHero";
import { getOrgTotals } from "@/lib/github";
import { getWorkshop } from "@/lib/workshop";

export default async function Preview() {
  const [{ now, tools, people, lastPush }, totals] = await Promise.all([getWorkshop(), getOrgTotals()]);
  return (
    <>
      <LabHero now={now} tools={tools} people={people} lastPush={lastPush} stars={totals.stars} />
      <HomeBands />
    </>
  );
}
