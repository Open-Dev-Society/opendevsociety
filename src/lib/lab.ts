// Shared helpers over getWorkshop()'s data (docs/lab.md), so server and client pages agree: project links,
// contributor numbers (#01… by join order) and project status.
import type { OrgContributor, OrgRepo } from "@/lib/github";

const DAY = 864e5;
const pad = (n: number, w: number) => String(n).padStart(w, "0");

/** Where a project's entry lives on /projects: its repo name is the anchor. */
export const projectHref = (name: string) => `/projects#${name}`;

/**
 * login → "#01", in join order: the first week with a commit in any org repo (OrgContributor.joined).
 * People GitHub hasn't computed stats for yet go last, in the order given (getWorkshop: most contributions first).
 */
export function memberNos(people: Pick<OrgContributor, "login" | "joined">[]) {
  const at = (p: (typeof people)[number]) => (p.joined ? Date.parse(p.joined) : Infinity);
  const sorted = people.map((p, i) => ({ p, i })).sort((a, b) => at(a.p) - at(b.p) || a.i - b.i);
  return new Map(sorted.map(({ p }, n) => [p.login, `#${pad(n + 1, 2)}`]));
}

/** The next free number: the open spot ("#25 · you"). */
export const nextMemberNo = (people: unknown[]) => `#${pad(people.length + 1, 2)}`;

export type Status = "running" | "paused" | "archived";
/** The glyph each status carries on its plate. */
export const STATUS_MARK: Record<Status, string> = { running: "●", paused: "◐", archived: "○" };

/** running: pushed within 30 days · paused: within 180 · archived: older. */
export function status(repo: Pick<OrgRepo, "pushed_at">, now = Date.now()): Status {
  const d = (now - Date.parse(repo.pushed_at)) / DAY;
  return d <= 30 ? "running" : d <= 180 ? "paused" : "archived";
}

/** "10 Nov 2026" */
/** "09 Nov 2026", joined by non-breaking spaces so a date never wraps in the middle. */
export const labDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).replaceAll(" ", "\u00a0");
