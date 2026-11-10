// Server-only: call from Server Components / route handlers. GITHUB_TOKEN is read here and never sent to the client.
// Every function falls back to the snapshot in src/data/fallback.ts and never throws.
import { snapshotContributors, snapshotRepos } from "../data/fallback";

export const GITHUB_ORG = "Open-Dev-Society";

export type OrgRepo = {
    name: string;
    description: string | null;
    html_url: string;
    homepage: string | null;
    language: string | null;
    topics: string[];
    stars: number;
    forks: number;
    open_issues: number;
    good_first_issues: number;
    pushed_at: string;
};

export type OrgTotals = { stars: number; forks: number; repos: number };

export type OrgContributor = {
    login: string;
    avatar_url: string;
    html_url: string;
    contributions: number; // summed across the org's repos
    repos: string[];
};

// Agent accounts GitHub reports as type "User".
const NON_HUMAN = new Set(["cursoragent"]);

async function gh<T>(path: string): Promise<T> {
    const token = process.env.GITHUB_TOKEN;
    const res = await fetch(`https://api.github.com/${path}`, {
        headers: {
            Accept: "application/vnd.github+json",
            "User-Agent": "Open-Dev-Society-Site",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`GitHub ${res.status} for ${path}`);
    return res.status === 204 ? ([] as T) : res.json();
}

/** All public org repos, most-starred first. 2 API calls. */
export async function getOrgRepos(): Promise<OrgRepo[]> {
    try {
        const q = encodeURIComponent(`org:${GITHUB_ORG} label:"good first issue" state:open is:issue`);
        const [repos, gfi] = await Promise.all([
            gh<any[]>(`orgs/${GITHUB_ORG}/repos?per_page=100&type=public`),
            gh<{ items: { repository_url: string }[] }>(`search/issues?q=${q}&per_page=100`).catch(() => null),
        ]);
        const gfiCount = (name: string) =>
            gfi
                ? gfi.items.filter((i) => i.repository_url.endsWith(`/${name}`)).length
                : (snapshotRepos.find((r) => r.name === name)?.good_first_issues ?? 0);
        return repos
            .map((r) => ({
                name: r.name,
                description: r.description,
                html_url: r.html_url,
                homepage: r.homepage || null,
                language: r.language,
                topics: r.topics ?? [],
                stars: r.stargazers_count,
                forks: r.forks_count,
                open_issues: r.open_issues_count,
                good_first_issues: gfiCount(r.name),
                pushed_at: r.pushed_at,
            }))
            .sort((a, b) => b.stars - a.stars);
    } catch (e) {
        console.warn("[github] repos: using snapshot:", (e as Error).message);
        return snapshotRepos;
    }
}

/** Org-wide stars, forks and public repo count. Same calls as getOrgRepos (deduped by fetch cache). */
export async function getOrgTotals(): Promise<OrgTotals> {
    const repos = await getOrgRepos();
    return {
        stars: repos.reduce((n, r) => n + r.stars, 0),
        forks: repos.reduce((n, r) => n + r.forks, 0),
        repos: repos.length,
    };
}

/** Unique human contributors across every org repo, most contributions first. 1 call per repo. */
export async function getOrgContributors(): Promise<OrgContributor[]> {
    try {
        const repos = await getOrgRepos();
        const lists = await Promise.all(
            repos.map((r) =>
                gh<any[]>(`repos/${GITHUB_ORG}/${r.name}/contributors?per_page=100`).then((cs) =>
                    cs.map((c) => ({ ...c, repo: r.name })),
                ),
            ),
        );
        const byLogin = new Map<string, OrgContributor>();
        for (const c of lists.flat()) {
            if (c.type === "Bot" || c.login.endsWith("[bot]") || NON_HUMAN.has(c.login)) continue;
            const seen = byLogin.get(c.login);
            if (seen) {
                seen.contributions += c.contributions;
                seen.repos.push(c.repo);
            } else {
                byLogin.set(c.login, {
                    login: c.login,
                    avatar_url: c.avatar_url,
                    html_url: c.html_url,
                    contributions: c.contributions,
                    repos: [c.repo],
                });
            }
        }
        return [...byLogin.values()].sort((a, b) => b.contributions - a.contributions);
    } catch (e) {
        console.warn("[github] contributors: using snapshot:", (e as Error).message);
        return snapshotContributors;
    }
}
