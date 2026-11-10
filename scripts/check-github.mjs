// Calls src/lib/github.ts and asserts the numbers are real (live or the snapshot), not invented.
//   node scripts/check-github.mjs           check (unauthenticated: ~19 of the 60 req/hr)
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

const gh = await import("../src/lib/github.ts");
const snap = await import("../src/data/fallback.ts");

const [repos, totals, contributors] = await Promise.all([gh.getOrgRepos(), gh.getOrgTotals(), gh.getOrgContributors()]);

const openStock = repos.find((r) => r.name === "OpenStock");
assert.ok(openStock && openStock.stars > 10_000, `OpenStock stars look invented: ${openStock?.stars}`);
assert.ok(totals.stars >= openStock.stars && totals.stars === repos.reduce((n, r) => n + r.stars, 0));
assert.equal(totals.repos, repos.length);
assert.ok(contributors.length >= 10, `only ${contributors.length} contributors`);
assert.equal(new Set(contributors.map((c) => c.login)).size, contributors.length, "duplicate logins");
assert.ok(!contributors.some((c) => /\[bot\]$|^cursoragent$/.test(c.login)), "bot in contributors");
assert.ok(contributors.some((c) => c.login === "ravixalgorithm"));
assert.ok(snap.fallbackStats.stars > 10_000 && snap.fallbackStats.list.find((r) => r.name === "OpenStock").stargazers_count > 10_000);

const source = (live, s) => (JSON.stringify(live) === JSON.stringify(s) ? `matches snapshot ${snap.snapshotTakenAt}` : "differs from snapshot");
console.log(`repos ${repos.length} (${source(repos, snap.snapshotRepos)}), stars ${totals.stars}, forks ${totals.forks}`);
console.log(`contributors ${contributors.length} (${source(contributors, snap.snapshotContributors)})`);
console.log(`OpenStock ★${openStock.stars} / ${openStock.forks} forks`);
if (process.argv.includes("--print")) console.log(JSON.stringify({ repos, contributors }, null, 2));
console.log("ok");
