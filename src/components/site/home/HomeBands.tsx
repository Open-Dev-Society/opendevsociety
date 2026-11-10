import { getActivity, getCommitsThisWeek, getGoodFirstIssues, getOrgTotals } from "@/lib/github";
import { getWorkshop } from "@/lib/workshop";
import { About } from "./About";
import { Founders } from "./Founders";
import { Now } from "./Now";
import { People } from "./People";
import { Projects } from "./Projects";
import { Start } from "./Start";

/** Home, everything below the hero: six bands on paper, told apart by hairlines, the rails' tags and composition. */
export async function HomeBands() {
  const [{ now, tools, builders }, totals, activity, issues, commits] = await Promise.all([
    getWorkshop(),
    getOrgTotals(),
    getActivity(),
    getGoodFirstIssues(),
    getCommitsThisWeek(),
  ]);
  return (
    <>
      <About stars={totals.stars} contributors={builders.length} projects={tools.length} commits={commits.count} />
      <Projects tools={tools} builders={builders} now={now} />
      {activity.length > 0 && <Now activity={activity} now={now} />}
      <People builders={builders} />
      <Start issues={issues} tools={tools} />
      <Founders />
    </>
  );
}
