import type { Metadata } from "next";
import { manualContributors } from "@/data/contributors";
import { memberNos, nextMemberNo, projectHref } from "@/lib/lab";
import { getWorkshop } from "@/lib/workshop";
import { Record } from "@/components/site/lab/Record";
import { Badge, OpenSpot, type Contributor } from "./Badge";

// Matches the GitHub lib's cache.
export const revalidate = 3600;

async function getRoster() {
  const { builders, people, tools } = await getWorkshop();
  const nos = memberNos(people);
  // A person's projects, most stars first.
  const rank = new Map([...tools].sort((a, b) => b.stars - a.stars || a.name.localeCompare(b.name)).map((r, i) => [r.name, i]));
  const joined = new Map(people.map((p) => [p.login, p.joined]));
  const roles = new Map(manualContributors.map((c) => [c.login.toLowerCase(), c.role ?? ""]));
  const role = (login: string) => {
    const r = roles.get(login.toLowerCase()) ?? "";
    return /Co-Founder/i.test(r) ? "Co-founder" : /Founder/i.test(r) ? "Founder" : /Maintainer/i.test(r) ? "Maintainer" : undefined;
  };
  const contributors: Contributor[] = builders
    .map((b) => ({
      no: nos.get(b.login)!,
      login: b.login,
      name: b.name,
      avatar: b.avatar,
      url: b.url,
      role: role(b.login),
      joined: joined.get(b.login),
      projects: b.repos
        .filter((r) => rank.has(r))
        .sort((a, z) => rank.get(a)! - rank.get(z)!)
        .map((r) => ({ name: r, href: projectHref(r) })),
      contributions: b.contributions,
    }))
    .sort((a, z) => a.no.localeCompare(z.no));
  return { contributors, open: nextMemberNo(people) };
}

export async function generateMetadata(): Promise<Metadata> {
  const { contributors } = await getRoster();
  return {
    title: `Contributors: ${contributors.length} people · Open Dev Society`,
    description: `Everyone who has shipped to an Open Dev Society project: ${contributors.length} people, when they joined, what they worked on and how many commits. One spot is open for you.`,
  };
}

// Blank frames close the last row of the sheet at each column count (1 / 2 / 3).
function blanks(n: number) {
  const fill = (cols: number) => (cols - (n % cols)) % cols;
  return Array.from({ length: 2 }, (_, j) => [j < fill(2) ? "sm:block" : "sm:hidden", j < fill(3) ? "lg:block" : "lg:hidden"].join(" "));
}

export default async function ContributorsPage() {
  const { contributors, open } = await getRoster();
  const total = contributors.reduce((n, r) => n + r.contributions, 0);

  return (
    <div className="mx-auto w-full max-w-(--container) px-(--gutter) pt-14 pb-24 lg:pt-20">
      <Record
        name="Contributors"
        as="h1"
        size="page"
        meta={[
          <span key="n"><span className="text-(--fg)">{contributors.length}</span> people</span>,
          <span key="v" className="text-(--mark-ink)">1 open spot</span>,
        ]}
        title={
          <span className="block max-w-[16ch]">
            {contributors.length} people have shipped here. <span className="text-(--mark-ink)">One spot is open.</span>
          </span>
        }
      >
        <p className="mt-6 max-w-[60ch] text-[17px] leading-relaxed text-(--fg-muted)">
          Everyone with a commit in an Open Dev Society project, in the order they joined, with what they worked on. Founders and maintainers are
          marked.
        </p>
      </Record>

      <ol aria-label="Contributors" className="mt-12 grid border-t border-l border-(--line) sm:grid-cols-2 lg:grid-cols-3">
        {contributors.map((c) => (
          <li key={c.login} className="border-r border-b border-(--line)">
            <Badge c={c} />
          </li>
        ))}
        <li className="border-r border-b border-(--line)">
          <OpenSpot no={open} />
        </li>
        {blanks(contributors.length + 1).map((c, i) => (
          <li key={i} aria-hidden className={`hidden border-r border-b border-(--line) ${c}`} />
        ))}
      </ol>

      <section aria-labelledby="ledger" className="mt-24">
        <div className="border-t-[3px] border-double border-(--fg)" />
        <h2 id="ledger" className="t-mono mt-3 text-[12px] text-(--fg-muted)">
          ALL CONTRIBUTORS · <span className="text-(--fg)">{contributors.length}</span> people · <span className="text-(--fg)">{total.toLocaleString("en-US")}</span> commits
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="t-mono w-full min-w-[34rem] text-left text-[12px] tabular-nums">
            <thead className="text-(--fg-subtle)">
              <tr className="border-b border-(--fg)">
                <th className="py-2 pr-4 font-normal">#</th>
                <th className="py-2 pr-4 font-normal">Contributor</th>
                <th className="py-2 pr-4 font-normal">Role</th>
                <th className="py-2 pr-4 font-normal">Joined</th>
                <th className="py-2 pr-4 text-right font-normal">Projects</th>
                <th className="py-2 text-right font-normal">Commits</th>
              </tr>
            </thead>
            <tbody>
              {contributors.map((r) => (
                <tr key={r.login} className="border-b border-(--line)">
                  <td className="py-1.5 pr-4 text-(--fg)">{r.no}</td>
                  <td className="py-1.5 pr-4">
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-(--fg) hover:text-(--accent)">
                      @{r.login}
                    </a>
                  </td>
                  <td className="py-1.5 pr-4 text-(--fg-muted)">{r.role ?? "—"}</td>
                  <td className="py-1.5 pr-4 text-(--fg-muted)">{r.joined?.slice(0, 10) ?? "—"}</td>
                  <td className="py-1.5 pr-4 text-right text-(--fg-muted)">{r.projects.length}</td>
                  <td className="py-1.5 text-right text-(--fg)">{r.contributions.toLocaleString("en-US")}</td>
                </tr>
              ))}
              <tr className="text-(--mark-ink)">
                <td className="py-1.5 pr-4">{open}</td>
                <td className="py-1.5 pr-4" colSpan={4}>
                  <a href="/contribute" className="hover:underline">
                    you · open spot · make your first contribution →
                  </a>
                </td>
                <td className="py-1.5 text-right">0</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t border-(--fg) text-(--fg)">
                <td className="py-2" colSpan={5}>
                  Total
                </td>
                <td className="py-2 text-right">{total.toLocaleString("en-US")}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </div>
  );
}
