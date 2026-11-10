// Server-only: the live GitHub data, shaped once for every page that shows tools or people (Home, Work, People).
import type { Builder, IndexRepo, RepoSummary } from "@/components/site";
import { catalog } from "@/data/catalog";
import { manualContributors } from "@/data/contributors";
import { ago, compact } from "@/lib/format";
import { getOrgContributors, getOrgRepos, type OrgRepo } from "@/lib/github";

const DAY = 864e5;
const FEATURED = ["kine-ui", "openreadme", "kitbash"];

export async function getWorkshop() {
  const [repos, people] = await Promise.all([getOrgRepos(), getOrgContributors()]);
  const now = Date.now();

  const builtBy = (name: string) => people.filter((p) => p.repos.includes(name));
  // Only catalogued repos are public (hides .github, the site repo, and anything new until it gets a tagline).
  const tools = repos.filter((r) => catalog[r.name]);

  const summary = (r: OrgRepo): RepoSummary => ({
    name: r.name,
    url: r.html_url,
    tagline: catalog[r.name].tagline,
    language: r.language,
    pushedAgo: ago(r.pushed_at, now),
    stars: r.stars,
    builders: builtBy(r.name).length,
    badge: catalog[r.name].badge,
  });

  // OpenStock first, then by stars, then most recently pushed.
  const index: IndexRepo[] = [...tools]
    .sort((a, b) => Number(b.name === "OpenStock") - Number(a.name === "OpenStock") || b.stars - a.stars || b.pushed_at.localeCompare(a.pushed_at))
    .map((r) => ({ ...summary(r), audience: catalog[r.name].audience, goodFirst: r.good_first_issues }));
  const featured = FEATURED.flatMap((n) => tools.filter((r) => r.name === n)).map((r) => ({ repo: summary(r), shot: catalog[r.name].shot }));

  // Everyone in the contributor graph, most contributions first; core crew named and ringed.
  const core = new Map(manualContributors.map((c) => [c.login.toLowerCase(), c]));
  const builders: Builder[] = people.map((p) => ({
    login: p.login,
    name: core.get(p.login.toLowerCase())?.name,
    avatar: p.avatar_url,
    url: p.html_url,
    contributions: p.contributions,
    repos: p.repos.filter((r) => catalog[r]), // only public tools, never .github or the site repo
    core: core.has(p.login.toLowerCase()),
  }));

  const openstock = tools.find((r) => r.name === "OpenStock")!;
  const osPeople = builtBy("OpenStock");

  return {
    now,
    tools,
    index,
    featured,
    builders,
    people,
    lastPush: tools.reduce((a, r) => (r.pushed_at > a ? r.pushed_at : a), ""),
    thisWeek: tools.filter((r) => now - Date.parse(r.pushed_at) < 7 * DAY).map((r) => r.name),
    // The bench: public tools with open issues, OpenStock first.
    benchRepos: tools
      .filter((r) => r.open_issues > 0)
      .sort((a, b) => Number(b.name === "OpenStock") - Number(a.name === "OpenStock") || b.open_issues - a.open_issues)
      .map((r) => ({ name: r.name, openIssues: r.open_issues })),
    // Props for the OpenStock <Print>: the proof object on Home and Work.
    openstockPrint: {
      desktop: { src: "/shots/openstock-desktop.jpg", width: 2880, height: 1800 },
      mobile: { src: "/shots/openstock-mobile.jpg", width: 1170, height: 2532 },
      alt: "OpenStock, live: index prices, the market clock and a chart",
      url: (openstock.homepage ?? openstock.html_url).replace(/^https?:\/\//, ""),
      href: openstock.homepage ?? openstock.html_url,
      name: "OpenStock",
      tagline: catalog.OpenStock.tagline,
      people: osPeople.map((p) => ({ src: p.avatar_url, name: p.login })),
      builders: osPeople.length,
      stats: `★ ${compact(openstock.stars)} · ${compact(openstock.forks)} forks`,
    },
  };
}

/** "Agents like kitbash, zomb and ports" style lists. */
export const listNames = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs.at(-1)}`);
