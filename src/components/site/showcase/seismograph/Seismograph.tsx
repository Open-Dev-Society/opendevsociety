// Server: every public project's last 52 weeks of commits, shaped for the seismograph's lanes.
import { catalog } from "@/data/catalog";
import { getProject } from "@/lib/github";
import { status } from "@/lib/lab";
import { getWorkshop } from "@/lib/workshop";
import { Lanes, type Lane } from "./Lanes";

const PLAIN = { running: "active", paused: "quiet", archived: "archived" } as const;
const WEEK = 7 * 864e5;

/** Projects as stacked lanes of a seismograph: one line of real weekly commits each. */
export async function Seismograph() {
  const { tools, now } = await getWorkshop();
  const projects = await Promise.all(tools.map((t) => getProject(t.name)));

  // One shared week grid (live and snapshot weeks can end a week apart): the newest week any project reports, 52 back.
  const end = Math.max(...projects.flatMap((p) => (p ? [Date.parse(p.weeks[p.weeks.length - 1].week)] : [])));
  const grid = Array.from({ length: 52 }, (_, i) => end - (51 - i) * WEEK);

  const lanes: Lane[] = tools.map((t, k) => {
    const p = projects[k];
    const by = new Map(p?.weeks.map((w) => [Date.parse(w.week), w.commits]));
    return {
      name: t.name,
      href: `/projects/${t.name}`,
      stars: t.stars,
      status: PLAIN[status(t, now)],
      tagline: catalog[t.name].tagline,
      shot: catalog[t.name].shot,
      contributors: (p?.contributors ?? []).map((c) => ({ login: c.login, avatar: c.avatar_url })),
      weeks: grid.map((w) => by.get(w) ?? 0),
    };
  });

  return <Lanes lanes={lanes} weeks={grid.map((w) => new Date(w).toISOString())} />;
}
