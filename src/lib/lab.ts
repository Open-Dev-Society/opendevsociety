// ODS·LAB numbering, kept in one place (docs/lab.md): experiments are EXP-001… by stars, researchers R-01… by join order.
// Pure functions over getWorkshop()'s data, so server and client pages number things the same way.
import type { OrgContributor, OrgRepo } from "@/lib/github";

const DAY = 864e5;
const pad = (n: number, w: number) => String(n).padStart(w, "0");

/** repo name → "EXP-001", most stars first (ties by name, so the order is stable). */
export function expIds(tools: Pick<OrgRepo, "name" | "stars">[]) {
  const sorted = [...tools].sort((a, b) => b.stars - a.stars || a.name.localeCompare(b.name));
  return new Map(sorted.map((r, i) => [r.name, `EXP-${pad(i + 1, 3)}`]));
}

/** One repo's ID. Pass the full public list (getWorkshop().tools). */
export const expId = (name: string, tools: Pick<OrgRepo, "name" | "stars">[]) => expIds(tools).get(name) ?? "EXP-???";

/** Where an experiment's record lives: its repo name is the anchor (EXP numbers drift with stars, names don't). */
export const expHref = (name: string) => `/projects#${name}`;

/**
 * login → "R-01", in join order: the first week with a commit in any org repo (OrgContributor.joined).
 * People GitHub hasn't computed stats for yet go last, in the order given (getWorkshop: most contributions first).
 */
export function researcherIds(people: Pick<OrgContributor, "login" | "joined">[]) {
  const at = (p: (typeof people)[number]) => (p.joined ? Date.parse(p.joined) : Infinity);
  const sorted = people.map((p, i) => ({ p, i })).sort((a, b) => at(a.p) - at(b.p) || a.i - b.i);
  return new Map(sorted.map(({ p }, n) => [p.login, `R-${pad(n + 1, 2)}`]));
}

/** The next free R-number: the vacant badge ("R-25 · you"). */
export const nextResearcherId = (people: unknown[]) => `R-${pad(people.length + 1, 2)}`;

export type Status = "running" | "paused" | "archived";

/** running: pushed within 30 days · paused: within 180 · archived: older. */
export function status(repo: Pick<OrgRepo, "pushed_at">, now = Date.now()): Status {
  const d = (now - Date.parse(repo.pushed_at)) / DAY;
  return d <= 30 ? "running" : d <= 180 ? "paused" : "archived";
}

/** "10 Nov 2026" */
export const labDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
