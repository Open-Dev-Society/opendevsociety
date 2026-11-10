// Throwaway test route for the two signature components (Wall, Bench). Delete once the home page uses them.
import { getOrgContributors, getOrgRepos } from "@/lib/github";
import { manualContributors } from "@/data/contributors";
import { Section, SectionHeader } from "@/components/site/Section";
import { Wall } from "@/components/site/Wall";
import { Bench } from "@/components/site/Bench";

export const metadata = { title: "Signature components", robots: { index: false } };

export default async function SigPage() {
  const [contributors, repos] = await Promise.all([getOrgContributors(), getOrgRepos()]);
  const core = new Map(manualContributors.map((c) => [c.login.toLowerCase(), c]));
  const builders = contributors.map((c) => ({
    login: c.login,
    name: core.get(c.login.toLowerCase())?.name,
    avatar: c.avatar_url,
    url: c.html_url,
    contributions: c.contributions,
    repos: c.repos,
    core: core.has(c.login.toLowerCase()),
  }));
  const benchRepos = repos
    .filter((r) => r.open_issues > 0)
    .map((r) => ({ name: r.name, openIssues: r.open_issues }))
    .sort((a, b) => Number(b.name === "OpenStock") - Number(a.name === "OpenStock"));

  return (
    <div className="site">
      <Section id="people" tone="muted">
        <SectionHeader title={`${builders.length} people built all of this. Seat ${builders.length + 1} is yours.`} />
        <Wall builders={builders} />
      </Section>
      <Section id="start" tone="inverse">
        <SectionHeader title="Three commands from here to the wall." />
        <Bench repos={benchRepos} />
      </Section>
    </div>
  );
}
