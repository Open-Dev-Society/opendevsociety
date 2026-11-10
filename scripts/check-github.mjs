// Calls src/lib/github.ts and asserts the numbers are real (live or the snapshot), not invented.
//   node scripts/check-github.mjs             check live (unauthenticated: 50 of the 60 core req/hr + 3 search, see github.ts)
//   node scripts/check-github.mjs --offline   check the snapshot path (every fetch fails)
//   GITHUB_TOKEN=$(gh auth token) node scripts/check-github.mjs --print   also dump live JSON for refreshing fallback.ts
import assert from "node:assert/strict";
import { registerHooks } from "node:module";

// Next resolves extensionless TS imports; plain node doesn't.
registerHooks({
    resolve(specifier, context, next) {
        try {
            return next(specifier, context);
        } catch (e) {
            if (specifier.startsWith(".")) return next(specifier + ".ts", context);
            throw e;
        }
    },
});

const offline = process.argv.includes("--offline");
if (offline) {
    globalThis.fetch = () => Promise.reject(new Error("offline"));
    console.warn = () => {};
} else {
    // One request per URL, like Next's fetch cache: otherwise every caller spends its own call.
    const realFetch = globalThis.fetch;
    const seen = new Map();
    globalThis.fetch = (url, init) => {
        if (!seen.has(url)) seen.set(url, realFetch(url, init));
        return seen.get(url).then((r) => r.clone());
    };
}

const gh = await import("../src/lib/github.ts");
const snap = await import("../src/data/fallback.ts");

const [repos, totals, contributors, activity, issues, commits, names] = await Promise.all([
    gh.getOrgRepos(),
    gh.getOrgTotals(),
    gh.getOrgContributors(),
    gh.getActivity(50),
    gh.getGoodFirstIssues(100),
    gh.getCommitsThisWeek(),
    gh.getProjectNames(),
]);
const projects = await Promise.all(names.map((n) => gh.getProject(n)));

const openStock = repos.find((r) => r.name === "OpenStock");
assert.ok(openStock && openStock.stars > 10_000, `OpenStock stars look invented: ${openStock?.stars}`);
assert.equal(openStock.license, "AGPL-3.0");
assert.ok(totals.stars >= openStock.stars && totals.stars === repos.reduce((n, r) => n + r.stars, 0));
assert.equal(totals.repos, repos.length);

assert.ok(contributors.length >= 10, `only ${contributors.length} contributors`);
assert.equal(new Set(contributors.map((c) => c.login.toLowerCase())).size, contributors.length, "duplicate logins");
assert.ok(!contributors.some((c) => /\[bot\]$|^cursoragent$/.test(c.login)), "bot in contributors");
for (const login of ["ravixalgorithm", "bipin325", "error404p"]) assert.ok(contributors.some((c) => c.login === login), `${login} missing`);

assert.ok(activity.length > 0 && activity.length <= 50);
assert.ok(activity.every((a, i) => i === 0 || activity[i - 1].at >= a.at), "activity not newest first");
assert.ok(activity.some((a) => a.kind === "pr" || a.kind === "contributor") && activity.some((a) => a.kind === "release"));
assert.ok(activity.every((a) => a.url.startsWith("https://github.com/Open-Dev-Society/")));
assert.equal((await gh.getActivity()).length, 12);

assert.ok(issues.every((i) => i.labels.some((l) => l === "good first issue" || l === "help wanted")));
assert.ok(commits.count >= 0 && /^\d{4}-\d{2}-\d{2}$/.test(commits.since) && commits.asOf);

assert.ok(names.includes("OpenStock") && !names.includes(".github"));
assert.equal(await gh.getProject("nope"), null);
assert.equal((await gh.getProject("openstock"))?.repo.name, "OpenStock");
for (const p of projects) {
    assert.equal(p.weeks.length, 52, `${p.repo.name} weeks`);
    assert.ok(p.weeks.every((w, i) => i === 0 || w.week > p.weeks[i - 1].week));
}
const os = projects.find((p) => p.repo.name === "OpenStock");
assert.ok(os.contributors.length >= 10 && os.weeks.some((w) => w.commits > 0) && os.release?.tag.startsWith("v"));

const source = (live, s) => (JSON.stringify(live) === JSON.stringify(s) ? `snapshot ${snap.snapshotTakenAt}` : "live");
console.log(`repos ${repos.length} (${source(repos, snap.snapshotRepos)}), stars ${totals.stars}, forks ${totals.forks}`);
console.log(`contributors ${contributors.length}, activity ${activity.length} (newest ${activity[0].at}), issues ${issues.length}`);
console.log(`commits since ${commits.since}: ${commits.count} (as of ${commits.asOf}), projects ${names.length}`);
if (process.argv.includes("--print")) console.log(JSON.stringify({ repos, contributors, activity, issues, commits, projects }, null, 2));
console.log("ok");
