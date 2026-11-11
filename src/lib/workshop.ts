// Server-only: the live GitHub data, shaped once for every page that shows tools or people.
import { catalog } from "@/data/catalog";
import { manualContributors } from "@/data/contributors";
import { getOrgContributors, getOrgRepos } from "@/lib/github";

export type Builder = {
  login: string;
  name?: string;
  avatar: string;
  url: string;
  contributions: number;
  repos: string[];
  core?: boolean;
  /** First week with a commit (ISO), when GitHub's stats have it. */
  joined?: string;
  role?: "Founder" | "Co-founder" | "Maintainer";
};

const roleOf = (r = "") => (/Co-Founder/i.test(r) ? "Co-founder" : /Founder/i.test(r) ? "Founder" : /Maintainer/i.test(r) ? "Maintainer" : undefined);

export async function getWorkshop() {
  const [repos, people] = await Promise.all([getOrgRepos(), getOrgContributors()]);
  const now = Date.now();

  // Only catalogued repos are public (hides .github, the site repo, and anything new until it gets a tagline).
  const tools = repos.filter((r) => catalog[r.name]);

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
    joined: p.joined,
    role: roleOf(core.get(p.login.toLowerCase())?.role),
  }));

  return {
    now,
    tools,
    builders,
    people,
    lastPush: tools.reduce((a, r) => (r.pushed_at > a ? r.pushed_at : a), ""),
  };
}
