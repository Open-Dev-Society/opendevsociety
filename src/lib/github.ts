// Server-only: call from Server Components / route handlers. GITHUB_TOKEN is read here and never sent to the client.
// Every function falls back to the snapshot in src/data/fallback.ts and never throws.
//
// Call budget per hourly refresh (every fetch is cached for 3600s; same URL = one call), R = public repos (17), C = catalogued (15):
//   core API (60/hr without a token): 1 repos list + R contributors + R stats/contributors + C releases = 1 + 34 + 15 = 50
//   search API (10/min without a token, separate quota): open issues, merged PRs, commits this week = 3
// getProject adds nothing: it reuses the contributors, stats, releases and issues URLs above.
import { catalog } from "../data/catalog";
import { manualContributors } from "../data/contributors";
import {
    snapshotCommits,
    snapshotContributors,
    snapshotIssues,
    snapshotProjectContributors,
    snapshotPullRequests,
    snapshotReleases,
    snapshotRepos,
    snapshotWeeks,
} from "../data/fallback";

export const GITHUB_ORG = "Open-Dev-Society";

export type OrgRepo = {
    name: string;
    description: string | null;
    html_url: string;
    homepage: string | null;
    language: string | null;
    topics: string[];
    license: string | null; // SPDX id
    stars: number;
    forks: number;
    open_issues: number;
    good_first_issues: number;
    pushed_at: string;
    created_at: string;
};

export type OrgTotals = { stars: number; forks: number; repos: number };

export type OrgContributor = {
    login: string;
    avatar_url: string;
    html_url: string;
    contributions: number; // summed across the org's repos
    repos: string[];
    /** ISO date of the first week with a commit in any org repo (GitHub's contributor stats); undefined while GitHub is still computing them. */
    joined?: string;
};

// The fields we read from the REST responses.
type ApiRepo = Pick<OrgRepo, "name" | "description" | "html_url" | "homepage" | "language" | "pushed_at" | "created_at"> & {
    topics?: string[];
    license: { spdx_id: string } | null;
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
};
type ApiContributor = Pick<OrgContributor, "login" | "avatar_url" | "html_url" | "contributions"> & { type: string };
type ApiStats = { author: { login: string } | null; weeks: { w: number; c: number }[] }[];
type ApiUser = { login: string; avatar_url: string; type: string };
type ApiIssue = {
    title: string;
    number: number;
    html_url: string;
    repository_url: string;
    created_at: string;
    comments: number;
    labels: { name: string }[];
    user: ApiUser;
    pull_request?: { merged_at: string | null };
};
type ApiRelease = { tag_name: string; name: string | null; html_url: string; published_at: string; author: ApiUser | null };

export type Issue = { title: string; number: number; repo: string; labels: string[]; url: string; createdAt: string; comments: number };
export type Release = { repo: string; tag: string; name: string; publishedAt: string; url: string };
/** A merged PR as getActivity reads it (also the snapshot shape). */
export type PullRequest = { repo: string; title: string; number: number; url: string; mergedAt: string; who: string; avatar: string };
export type Activity = {
    kind: "pr" | "release" | "contributor"; // contributor = someone's first merged PR
    at: string; // ISO: merged or published
    repo: string;
    title: string; // PR title or release name
    url: string;
    who: string | null;
    avatar: string | null;
    number?: number; // PRs
    tag?: string; // releases
};
export type CommitsThisWeek = { count: number; since: string /* YYYY-MM-DD */; asOf: string /* ISO */ };
export type ProjectContributor = Pick<OrgContributor, "login" | "avatar_url" | "html_url" | "contributions">;
export type CommitWeek = { week: string /* ISO week start (Sunday, UTC) */; commits: number };
export type ProjectDetail = {
    repo: OrgRepo;
    contributors: ProjectContributor[]; // humans, most commits first
    weeks: CommitWeek[]; // last 52, oldest first
    issues: Issue[]; // open good first / help wanted
    release: Release | null; // latest
};

// Agent accounts GitHub reports as type "User".
const NON_HUMAN = new Set(["cursoragent"]);
const isHuman = (u: { login: string; type: string }) => u.type !== "Bot" && !u.login.endsWith("[bot]") && !NON_HUMAN.has(u.login);
const repoOf = (apiUrl: string) => apiUrl.slice(apiUrl.lastIndexOf("/") + 1);
const search = (q: string, n = 100) => `search/issues?q=${encodeURIComponent(`org:${GITHUB_ORG} ${q}`)}&per_page=${n}`;
const DAY = 24 * 3600 * 1000;

// Fail fast when GitHub is unreachable or rate-limited: each call gets 4s, and after any failure every call skips
// straight to the snapshot for 5 minutes instead of waiting on GitHub again (throttled renders took ~20s).
// ponytail: one process-wide cool-down; per-endpoint breakers if one endpoint failing should not mute the rest.
const TIMEOUT_MS = 4000;
const COOL_DOWN_MS = 5 * 60 * 1000;
let coolUntil = 0;

async function gh<T>(path: string): Promise<T> {
    if (Date.now() < coolUntil) throw new Error("GitHub cooling down after a failure");
    const token = process.env.GITHUB_TOKEN;
    try {
        const res = await fetch(`https://api.github.com/${path}`, {
            headers: {
                Accept: "application/vnd.github+json",
                "User-Agent": "Open-Dev-Society-Site",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            next: { revalidate: 3600 },
            signal: AbortSignal.timeout(TIMEOUT_MS),
        });
        if (!res.ok) throw new Error(`GitHub ${res.status} for ${path}`);
        return res.status === 204 ? ([] as T) : res.json();
    } catch (e) {
        coolUntil = Date.now() + COOL_DOWN_MS;
        throw e;
    }
}

/** Open "good first issue" / "help wanted" issues across the org, newest first. 1 search call, shared by everything below. */
async function openIssues(): Promise<Issue[]> {
    try {
        const res = await gh<{ items: ApiIssue[] }>(search(`is:issue is:open label:"good first issue","help wanted" sort:created-desc`));
        return res.items.map((i) => ({
            title: i.title,
            number: i.number,
            repo: repoOf(i.repository_url),
            labels: i.labels.map((l) => l.name),
            url: i.html_url,
            createdAt: i.created_at,
            comments: i.comments,
        }));
    } catch (e) {
        console.warn("[github] issues: using snapshot:", (e as Error).message);
        return snapshotIssues;
    }
}

/** All public org repos, most-starred first. 1 call + the shared issue search. */
export async function getOrgRepos(): Promise<OrgRepo[]> {
    try {
        const [repos, issues] = await Promise.all([gh<ApiRepo[]>(`orgs/${GITHUB_ORG}/repos?per_page=100&type=public`), openIssues()]);
        const gfiCount = (name: string) => issues.filter((i) => i.repo === name && i.labels.includes("good first issue")).length;
        return repos
            .map((r) => ({
                name: r.name,
                description: r.description,
                html_url: r.html_url,
                homepage: r.homepage || null,
                language: r.language,
                topics: r.topics ?? [],
                license: r.license?.spdx_id && r.license.spdx_id !== "NOASSERTION" ? r.license.spdx_id : null,
                stars: r.stargazers_count,
                forks: r.forks_count,
                open_issues: r.open_issues_count,
                good_first_issues: gfiCount(r.name),
                pushed_at: r.pushed_at,
                created_at: r.created_at,
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

/**
 * Unique human contributors across every org repo, most contributions first, then the maintainers from
 * src/data/contributors.ts that GitHub's stats don't list (contributions 0, repos [], no joined). 2 calls per repo.
 */
export async function getOrgContributors(): Promise<OrgContributor[]> {
    const people = await fetchContributors();
    const have = new Set(people.map((p) => p.login.toLowerCase()));
    const maintainers = manualContributors
        .filter((c) => c.role === "Maintainer" && !have.has(c.login.toLowerCase()))
        .map((c) => ({ login: c.login, avatar_url: c.avatar_url, html_url: c.html_url, contributions: 0, repos: [] }));
    return [...people, ...maintainers];
}

async function fetchContributors(): Promise<OrgContributor[]> {
    try {
        const repos = await getOrgRepos();
        const [lists, stats] = await Promise.all([
            Promise.all(
                repos.map((r) =>
                    gh<ApiContributor[]>(`repos/${GITHUB_ORG}/${r.name}/contributors?per_page=100`).then((cs) =>
                        cs.map((c) => ({ ...c, repo: r.name })),
                    ),
                ),
            ),
            // First week with a commit, per author. GitHub answers 202 (no body) while it computes stats: those repos just don't count.
            Promise.all(repos.map((r) => gh<ApiStats>(`repos/${GITHUB_ORG}/${r.name}/stats/contributors`).catch(() => []))),
        ]);
        const joined = new Map<string, number>();
        for (const s of stats.flat()) {
            const w = Array.isArray(s.weeks) && s.author ? s.weeks.find((x) => x.c > 0)?.w : undefined;
            if (w && w < (joined.get(s.author!.login) ?? Infinity)) joined.set(s.author!.login, w);
        }
        const byLogin = new Map<string, OrgContributor>();
        for (const c of lists.flat()) {
            if (!isHuman(c)) continue;
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
                    joined: joined.has(c.login) ? new Date(joined.get(c.login)! * 1000).toISOString() : undefined,
                });
            }
        }
        return [...byLogin.values()].sort((a, b) => b.contributions - a.contributions);
    } catch (e) {
        console.warn("[github] contributors: using snapshot:", (e as Error).message);
        return snapshotContributors;
    }
}

/** Merged PRs by people (not bots), newest merge first. 1 search call. */
async function mergedPullRequests(): Promise<PullRequest[]> {
    try {
        const res = await gh<{ items: ApiIssue[] }>(search("is:pr is:merged sort:updated-desc", 50));
        return res.items
            .filter((i) => isHuman(i.user) && i.pull_request?.merged_at)
            .map((i) => ({
                repo: repoOf(i.repository_url),
                title: i.title,
                number: i.number,
                url: i.html_url,
                mergedAt: i.pull_request!.merged_at!,
                who: i.user.login,
                avatar: i.user.avatar_url,
            }))
            .sort((a, b) => b.mergedAt.localeCompare(a.mergedAt));
    } catch (e) {
        console.warn("[github] pull requests: using snapshot:", (e as Error).message);
        return snapshotPullRequests;
    }
}

/** A repo's latest releases, newest first. 1 call per repo, shared by getActivity and getProject. */
async function releases(repo: string): Promise<Release[]> {
    try {
        const rs = await gh<ApiRelease[]>(`repos/${GITHUB_ORG}/${repo}/releases?per_page=3`);
        return rs.map((r) => ({ repo, tag: r.tag_name, name: r.name || r.tag_name, publishedAt: r.published_at, url: r.html_url }));
    } catch {
        return snapshotReleases.filter((r) => r.repo === repo);
    }
}

/** Recent merged PRs, first PRs from new contributors and releases across the public projects, newest first. */
export async function getActivity(limit = 12): Promise<Activity[]> {
    const [prs, people, repos] = await Promise.all([mergedPullRequests(), getOrgContributors(), getOrgRepos()]);
    const rels = (await Promise.all(repos.filter((r) => catalog[r.name]).map((r) => releases(r.name)))).flat();
    // ponytail: "first merged PR" = the author's oldest PR in this batch of 50, when GitHub's stats first saw a commit
    // from them at most 30 days before it. Exact needs one search per author; switch if it ever mislabels someone.
    const joined = new Map(people.map((p) => [p.login, p.joined]));
    const oldest = new Map(prs.map((pr) => [pr.who, pr] as const).reverse());
    const isFirst = (pr: PullRequest) => {
        const j = joined.get(pr.who);
        return oldest.get(pr.who) === pr && !!j && Date.parse(j) >= Date.parse(pr.mergedAt) - 30 * DAY;
    };
    const items: Activity[] = [
        ...prs
            .filter((pr) => catalog[pr.repo])
            .map((pr) => ({
                kind: isFirst(pr) ? ("contributor" as const) : ("pr" as const),
                at: pr.mergedAt,
                repo: pr.repo,
                title: pr.title,
                url: pr.url,
                who: pr.who,
                avatar: pr.avatar,
                number: pr.number,
            })),
        ...rels.map((r) => ({ kind: "release" as const, at: r.publishedAt, repo: r.repo, title: r.name, url: r.url, who: null, avatar: null, tag: r.tag })),
    ];
    return items.sort((a, b) => b.at.localeCompare(a.at)).slice(0, limit);
}

/** Open "good first issue" / "help wanted" issues in the public projects, newest first. */
export async function getGoodFirstIssues(limit = 6): Promise<Issue[]> {
    return (await openIssues()).filter((i) => catalog[i.repo]).slice(0, limit);
}

/** Commits on default branches across the org in the last 7 days. 1 search call. */
export async function getCommitsThisWeek(): Promise<CommitsThisWeek> {
    const since = new Date(Date.now() - 7 * DAY).toISOString().slice(0, 10);
    try {
        const q = encodeURIComponent(`org:${GITHUB_ORG} committer-date:>=${since}`);
        const res = await gh<{ total_count: number }>(`search/commits?q=${q}&per_page=1`);
        return { count: res.total_count, since, asOf: new Date().toISOString() };
    } catch (e) {
        console.warn("[github] commits: using snapshot:", (e as Error).message);
        return snapshotCommits;
    }
}

/** Names of the public projects (catalogued repos), most stars first: for generateStaticParams. */
export async function getProjectNames(): Promise<string[]> {
    return (await getOrgRepos()).filter((r) => catalog[r.name]).map((r) => r.name);
}

/** Everything one project page shows. Case-insensitive; null for an unknown or uncatalogued repo. */
export async function getProject(name: string): Promise<ProjectDetail | null> {
    const repo = (await getOrgRepos()).find((r) => catalog[r.name] && r.name.toLowerCase() === name.toLowerCase());
    if (!repo) return null;
    const path = `repos/${GITHUB_ORG}/${repo.name}`;
    const [contributors, weeks, rels, issues] = await Promise.all([
        gh<ApiContributor[]>(`${path}/contributors?per_page=100`)
            .then((cs) => cs.filter(isHuman).map(({ login, avatar_url, html_url, contributions }) => ({ login, avatar_url, html_url, contributions })))
            .catch(() => snapshotProjectContributors[repo.name] ?? []),
        gh<ApiStats>(`${path}/stats/contributors`)
            .then(commitWeeks)
            .catch(() => null),
        releases(repo.name),
        openIssues(),
    ]);
    return {
        repo,
        contributors,
        weeks: weeks ?? snapshotCommitWeeks(repo.name),
        issues: issues.filter((i) => i.repo === repo.name),
        release: rels[0] ?? null,
    };
}

/** Commits per week (all authors) for the last 52 weeks, from stats/contributors; null while GitHub computes them (202). */
function commitWeeks(stats: ApiStats): CommitWeek[] | null {
    if (!Array.isArray(stats) || !stats.length) return null;
    const by = new Map<number, number>();
    for (const s of stats) for (const w of s.weeks) by.set(w.w * 1000, (by.get(w.w * 1000) ?? 0) + w.c);
    const now = new Date();
    const sunday = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - now.getUTCDay());
    return Array.from({ length: 52 }, (_, i) => {
        const t = sunday - (51 - i) * 7 * DAY;
        return { week: new Date(t).toISOString(), commits: by.get(t) ?? 0 };
    });
}

function snapshotCommitWeeks(name: string): CommitWeek[] {
    const to = Date.parse(snapshotWeeks.to);
    return (snapshotWeeks.repos[name] ?? Array<number>(52).fill(0)).map((commits, i) => ({
        week: new Date(to - (51 - i) * 7 * DAY).toISOString(),
        commits,
    }));
}
