import { getActivity, getCommitsThisWeek, getGoodFirstIssues, getOrgTotals, getProject } from "@/lib/github";
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
  // Org-wide commits per week: the projects' 52-week series (same cached calls as their pages), summed, last 12.
  const series = (await Promise.all(tools.map((t) => getProject(t.name)))).map((p) => p?.weeks.map((w) => w.commits) ?? []);
  const weeks = Array.from({ length: 12 }, (_, i) => series.reduce((n, s) => n + (s[s.length - 12 + i] ?? 0), 0));
  return (
    <>
      <About tools={tools} builders={builders} stars={totals.stars} commits={commits.count} weeks={weeks} now={now} />
      <Projects tools={tools} builders={builders} now={now} />
      {activity.length > 0 && <Now activity={activity} now={now} />}
      <People builders={builders} />
      <Start issues={issues} tools={tools} />
      <Founders />
    </>
  );
}
