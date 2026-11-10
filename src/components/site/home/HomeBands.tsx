import { getActivity, getCommitsThisWeek, getGoodFirstIssues, getOrgTotals } from "@/lib/github";
import { getWorkshop } from "@/lib/workshop";
import { About } from "./About";
import { Founders } from "./Founders";
import { Now } from "./Now";
import { People } from "./People";
import { Projects } from "./Projects";
import { Start } from "./Start";

/**
 * Home, everything below the hero: six bands on one emerald ground, told apart by hairlines, the rails' tags and composition.
 * The hero's edge dissolves into it; --page-end tells the Footer's edge to dissolve from emerald, not paper.
 */
export async function HomeBands() {
  const [{ now, tools, builders, lastPush }, totals, activity, issues, commits] = await Promise.all([
    getWorkshop(),
    getOrgTotals(),
    getActivity(),
    getGoodFirstIssues(),
    getCommitsThisWeek(),
  ]);
  return (
    <div className="tone-emerald">
      <style>{"body{--page-end:var(--accent)}"}</style>
      <About stars={totals.stars} contributors={builders.length} projects={tools.length} commits={commits.count} />
      <Projects tools={tools} now={now} lastPush={lastPush} />
      {activity.length > 0 && <Now activity={activity} now={now} />}
      <People builders={builders} />
      <Start issues={issues} tools={tools} />
      <Founders />
    </div>
  );
}
