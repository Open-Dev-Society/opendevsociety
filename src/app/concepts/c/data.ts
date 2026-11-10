import { featuredModules } from "@/data/projects";
import { manualContributors } from "@/data/contributors";

// The one seam between concept C and its data. Swap the snapshot for src/lib/github.ts when it lands.
// ponytail: real GitHub API snapshot taken 2026-11-10, not live; upgrade path is the shared lib above.
export const SNAPSHOT_DATE = "2026-11-10";

const repoStats = [
  { name: "OpenStock", stars: 21406, forks: 2669, openIssues: 8, language: "TypeScript", pushedAt: "2026-11-09T19:21:59Z", homepage: "https://openstock-ods.vercel.app", contributors: 21 },
  { name: "openreadme", stars: 33, forks: 7, openIssues: 0, language: "TypeScript", pushedAt: "2026-11-08T04:55:11Z", homepage: "https://openreadme.vercel.app", contributors: 2 },
  { name: "booktrace", stars: 18, forks: 6, openIssues: 1, language: "TypeScript", pushedAt: "2025-10-08T20:27:13Z", homepage: null, contributors: 1 },
  { name: "opencosmos", stars: 12, forks: 5, openIssues: 0, language: "JavaScript", pushedAt: "2026-10-11T22:28:31Z", homepage: null, contributors: 1 },
  { name: "ByteMyCV", stars: 1, forks: 1, openIssues: 0, language: null, pushedAt: "2025-11-23T22:27:05Z", homepage: null, contributors: 1 },
  { name: "OpenCine", stars: 2, forks: 1, openIssues: 0, language: "JavaScript", pushedAt: "2025-12-12T18:29:34Z", homepage: null, contributors: 1 },
  { name: "openhaven", stars: 4, forks: 2, openIssues: 0, language: "TypeScript", pushedAt: "2026-01-13T21:38:27Z", homepage: "https://openhaven.vercel.app", contributors: 1 },
];

// Commit counts summed across the featured repos (bots excluded).
const graph: [string, number][] = [
  ["ravixalgorithm", 3859],
  ["keshav-005", 9],
  ["landerdevelopers", 7],
  ["PriyanshuCosmos", 4],
  ["nb-src", 3],
  ["akoweicollinxx", 2],
  ["pawisoon", 2],
  ["octo-patch", 2],
  ["cosmind-rusu", 2],
  ["chinnsenn", 2],
  ["ahmaddirar-ios", 2],
  ["ettoreciolli", 2],
  ["Bortlesboat", 2],
  ["alexander-schneider", 2],
  ["BambaSatoru", 1],
  ["Chukwuebuka-2003", 1],
  ["NicolasBohn", 1],
  ["samki6576", 1],
  ["dajiaohuang", 1],
  ["Yi-111-a", 1],
  ["cosark", 1],
  ["kuishou68", 1],
  ["muskanbandta23", 1],
];

// One concrete sentence each, condensed from the repos' GitHub descriptions.
const blurbs: Record<string, string> = {
  OpenStock: "Real-time prices, personal alerts and company insights. The open alternative to expensive market platforms.",
  openreadme: "Auto-updating GitHub profile banners, laid out as customizable bento grids.",
  booktrace: "Book discovery that indexes free, verified and purchasable books from many sources.",
  opencosmos: "Live space data: ISS tracking and real-time charts.",
  ByteMyCV: "AI resume analysis: skill extraction, ATS scoring and structured feedback.",
  OpenCine: "Trending and popular films via TMDB, growing into a community for movie lovers.",
  openhaven: "Share, discover and collaborate on code snippets. Gist meets a social network.",
};

export type Repo = (typeof repoStats)[number] & { url: string; blurb: string; tags: string[] };
export type Builder = { login: string; name?: string; role?: string; core: boolean; avatar: string; url: string };

export function getWorkshop() {
  const repos: Repo[] = featuredModules.map((m) => {
    const s = repoStats.find((r) => r.name === m.name)!;
    return { ...s, url: `https://github.com/Open-Dev-Society/${m.name}`, blurb: blurbs[m.name], tags: m.tags };
  });

  const core = manualContributors.map((c) => c.login.toLowerCase());
  const logins = [...manualContributors.map((c) => c.login), ...graph.map(([l]) => l)];
  const unique = logins.filter((l, i) => logins.findIndex((x) => x.toLowerCase() === l.toLowerCase()) === i);
  const builders: Builder[] = unique.map((login) => {
    const m = manualContributors.find((c) => c.login.toLowerCase() === login.toLowerCase());
    return {
      login,
      name: m?.name,
      role: m?.role?.replace(/.*\/\/\s*/, ""),
      core: core.includes(login.toLowerCase()),
      avatar: `https://avatars.githubusercontent.com/${login}?s=96`,
      url: `https://github.com/${login}`,
    };
  });

  const lastPush = repos.reduce((a, r) => (r.pushedAt > a ? r.pushedAt : a), "");
  return {
    repos,
    builders,
    totals: {
      stars: repos.reduce((n, r) => n + r.stars, 0),
      forks: repos.reduce((n, r) => n + r.forks, 0),
      builders: builders.length,
    },
    lastPush,
  };
}
