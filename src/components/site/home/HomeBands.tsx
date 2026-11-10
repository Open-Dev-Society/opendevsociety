import { getActivity, getCommitsThisWeek, getGoodFirstIssues, getOrgTotals } from "@/lib/github";
import { getWorkshop } from "@/lib/workshop";
import { DitherEdge } from "../lab/DitherEdge";
import { About } from "./About";

import { Founders } from "./Founders";
import { Now } from "./Now";
import { People } from "./People";
import { Projects } from "./Projects";
import { Start } from "./Start";

// The grounds as root tokens: inside a .tone-* band --bg is re-pointed, so the edges sit between the bands.
const PAPER = "var(--bg)";
const EMERALD = "var(--accent)";
const INK = "var(--inv-bg)";

/** Home, everything below the hero: six bands joined by 1-bit edges. The Footer brings its own edge in. */
export async function HomeBands() {
  const [{ now, tools, builders, lastPush }, totals, activity, issues, commits] = await Promise.all([
    getWorkshop(),
    getOrgTotals(),
    getActivity(),
    getGoodFirstIssues(),
    getCommitsThisWeek(),
  ]);
  return (
    <>
      <About stars={totals.stars} contributors={builders.length} projects={tools.length} commits={commits.count} />
      <DitherEdge from={EMERALD} to={PAPER} />
      <Projects tools={tools} now={now} lastPush={lastPush} />
      {activity.length > 0 && (
        <>
          <DitherEdge from={PAPER} to={INK} />
          <Now activity={activity} now={now} />
          <DitherEdge from={INK} to={PAPER} />
        </>
      )}
      <People builders={builders} />
      <DitherEdge from={PAPER} to={EMERALD} />
      <Start issues={issues} tools={tools} />
      <DitherEdge from={EMERALD} to={PAPER} />
      <Founders />
    </>
  );
}
