// ponytail: placeholder until getProject/getProjectNames land in src/lib/github.ts (Claude Code 14). Real data only:
// repo + contributors from getWorkshop; activity, issues, release and license stay empty rather than invented.
import type { OrgRepo } from "@/lib/github";
import { getWorkshop } from "@/lib/workshop";

export type Issue = { title: string; number: number; repo: string; labels: string[]; url: string; createdAt: string; comments: number };
export type Release = { repo: string; tag: string; name: string | null; publishedAt: string; url: string };
export type ProjectDetail = {
  repo: OrgRepo & { license?: string | null };
  contributors: { login: string; avatar_url: string; html_url: string; contributions: number }[];
  /** Last 52 weeks, oldest first; [] while GitHub computes them. */
  weeks: { week: string; commits: number }[];
  issues: Issue[];
  release: Release | null;
};

export async function getProjectNames() {
  return (await getWorkshop()).tools.map((t) => t.name);
}

export async function getProject(name: string): Promise<ProjectDetail | null> {
  const { tools, people } = await getWorkshop();
  const repo = tools.find((t) => t.name.toLowerCase() === name.toLowerCase());
  if (!repo) return null;
  return {
    repo,
    contributors: people.filter((p) => p.repos.includes(repo.name)),
    weeks: [],
    issues: [],
    release: null,
  };
}
