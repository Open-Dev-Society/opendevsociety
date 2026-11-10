import { featuredModules } from "@/data/projects";
import { manualContributors } from "@/data/contributors";
import { getOrgContributors, getOrgRepos, getOrgTotals } from "@/lib/github";

// The one seam between concept C and its data: live GitHub (revalidated hourly, snapshot fallback) shaped for this page.

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

export type Repo = {
  name: string;
  url: string;
  homepage: string | null;
  blurb: string;
  tags: string[];
  language: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  goodFirst: number;
  pushedAt: string;
  contributors: number;
};
export type Builder = { login: string; name?: string; role?: string; core: boolean; avatar: string; url: string };

const sized = (url: string) => `${url}${url.includes("?") ? "&" : "?"}s=96`;

export async function getWorkshop() {
  const [all, totals, people] = await Promise.all([getOrgRepos(), getOrgTotals(), getOrgContributors()]);

  const repos: Repo[] = featuredModules.flatMap((m) => {
    const r = all.find((x) => x.name.toLowerCase() === m.name.toLowerCase());
    if (!r) return [];
    return [
      {
        name: r.name,
        url: r.html_url,
        homepage: r.homepage || null,
        blurb: blurbs[m.name] ?? r.description ?? "",
        tags: m.tags,
        language: r.language,
        stars: r.stars,
        forks: r.forks,
        openIssues: r.open_issues,
        goodFirst: r.good_first_issues,
        pushedAt: r.pushed_at,
        contributors: people.filter((p) => p.repos.includes(r.name)).length,
      },
    ];
  });

  // Core crew first (they may have no commits in the graph), then everyone else by contributions.
  const avatars = new Map(people.map((p) => [p.login.toLowerCase(), p.avatar_url]));
  const logins = [...manualContributors.map((c) => c.login), ...people.map((p) => p.login)];
  const unique = logins.filter((l, i) => logins.findIndex((x) => x.toLowerCase() === l.toLowerCase()) === i);
  const builders: Builder[] = unique.map((login) => {
    const m = manualContributors.find((c) => c.login.toLowerCase() === login.toLowerCase());
    return {
      login,
      name: m?.name,
      role: m?.role?.replace(/.*\/\/\s*/, ""),
      core: !!m,
      avatar: sized(avatars.get(login.toLowerCase()) ?? `https://avatars.githubusercontent.com/${login}`),
      url: `https://github.com/${login}`,
    };
  });

  return {
    repos,
    builders,
    totals: { ...totals, builders: builders.length },
    lastPush: repos.reduce((a, r) => (r.pushedAt > a ? r.pushedAt : a), ""),
  };
}
