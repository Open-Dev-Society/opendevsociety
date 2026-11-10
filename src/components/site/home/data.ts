// PLACEHOLDER until the data agent's getActivity / getGoodFirstIssues / getCommitsThisWeek land in src/lib/github.ts.
// Same shapes as its announced API; swap the imports in page.tsx and delete this file.

export type Activity = {
  kind: "pr" | "release" | "contributor";
  at: string;
  repo: string;
  title: string;
  url: string;
  who: string | null;
  avatar: string | null;
  number?: number;
  tag?: string;
};
export type Issue = {
  title: string;
  number: number;
  repo: string;
  labels: string[];
  url: string;
  createdAt: string;
  comments: number;
};

const ORG = "https://github.com/Open-Dev-Society";
const h = (n: number) => new Date(Date.now() - n * 36e5).toISOString();
const a = (kind: Activity["kind"], who: string, title: string, repo: string, hours: number): Activity => ({
  kind,
  who,
  title,
  repo,
  url: `${ORG}/${repo}`,
  at: h(hours),
  avatar: `https://github.com/${who}.png`,
});

export async function getActivity(): Promise<Activity[]> {
  return [
    a("pr", "ravixalgorithm", "Add price alerts to the watchlist", "OpenStock", 3),
    a("contributor", "priyanshucosmos", "Fix typo in the README", "openreadme", 9),
    a("release", "ravixalgorithm", "v1.4.0", "kine-ui", 20),
    a("pr", "bipin325", "Fix the chart tooltip on mobile", "OpenStock", 30),
    a("pr", "error404p", "Cache the search results", "booktrace", 52),
    a("pr", "ravixalgorithm", "Dark mode for the snippet view", "openhaven", 70),
    a("release", "ravixalgorithm", "v0.3.0", "kitbash", 96),
    a("pr", "priyanshucosmos", "Show the ISS pass times", "opencosmos", 120),
  ];
}

export async function getGoodFirstIssues(): Promise<Issue[]> {
  return [
    {
      title: "Add a loading state to the search box",
      number: 101,
      repo: "OpenStock",
      labels: ["good first issue", "ui"],
      url: `${ORG}/OpenStock/issues`,
      createdAt: h(200),
      comments: 1,
    },
  ];
}

export async function getCommitsThisWeek(): Promise<{
  count: number;
  since: string;
  asOf: string;
}> {
  return { count: 0, since: "2026-11-03", asOf: h(0) };
}
