import type { Metadata } from "next";
import { manualContributors } from "@/data/contributors";
import { expHref, expIds, nextResearcherId, researcherIds } from "@/lib/lab";
import { getWorkshop } from "@/lib/workshop";
import { Record } from "@/components/site/lab/Record";
import { Badge, Vacancy, type Researcher } from "./Badge";

// Matches the GitHub lib's cache.
export const revalidate = 3600;

async function getRoster() {
  const { builders, people, tools } = await getWorkshop();
  const rids = researcherIds(people);
  const exps = expIds(tools);
  const joined = new Map(people.map((p) => [p.login, p.joined]));
  const roles = new Map(manualContributors.map((c) => [c.login.toLowerCase(), c.role ?? ""]));
  const role = (login: string) => {
    const r = roles.get(login.toLowerCase()) ?? "";
    return /Co-Founder/i.test(r) ? "Co-founder" : /Founder/i.test(r) ? "Founder" : /Maintainer/i.test(r) ? "Maintainer" : undefined;
  };
  const researchers: Researcher[] = builders
    .map((b) => ({
      rid: rids.get(b.login)!,
      login: b.login,
      name: b.name,
      avatar: b.avatar,
      url: b.url,
      role: role(b.login),
      joined: joined.get(b.login),
      exps: b.repos.flatMap((r) => (exps.has(r) ? [{ id: exps.get(r)!, href: expHref(r) }] : [])).sort((a, z) => a.id.localeCompare(z.id)),
      contributions: b.contributions,
    }))
    .sort((a, z) => a.rid.localeCompare(z.rid));
  return { researchers, vacancy: nextResearcherId(people) };
}

export async function generateMetadata(): Promise<Metadata> {
  const { researchers, vacancy } = await getRoster();
  return {
    title: `Researchers: ${researchers.length} on file · Open Dev Society`,
    description: `The ODS·LAB roster: every researcher who has shipped to an Open Dev Society experiment, by R-number, join date and experiments. ${vacancy} is vacant.`,
  };
}

// Blank frames close the last row of the sheet at each column count (1 / 2 / 3).
function blanks(n: number) {
  const fill = (cols: number) => (cols - (n % cols)) % cols;
  return Array.from({ length: 2 }, (_, j) => [j < fill(2) ? "sm:block" : "sm:hidden", j < fill(3) ? "lg:block" : "lg:hidden"].join(" "));
}

const KEY = [
  ["R-07", "join order"],
  ["JOINED", "first commit"],
  ["EXP", "experiments worked on"],
  ["CONTRIB", "commits"],
];

export default async function ResearchersPage() {
  const { researchers, vacancy } = await getRoster();
  const total = researchers.reduce((n, r) => n + r.contributions, 0);

  return (
    <div className="mx-auto w-full max-w-(--container) px-(--gutter) pt-14 pb-24 lg:pt-20">
      <Record
        n=""
        name="Researchers"
        as="h1"
        size="page"
        meta={[
          <span key="n"><span className="text-(--fg)">{researchers.length}</span> on file</span>,
          <span key="v" className="text-(--mark-ink)">1 vacancy</span>,
        ]}
        title={
          <span className="block max-w-[14ch]">
            {researchers.length} researchers on file. <span className="text-(--mark-ink)">One badge unissued.</span>
          </span>
        }
      >
        <p className="mt-6 max-w-[60ch] text-[17px] leading-relaxed text-(--fg-muted)">
          Everyone with a commit in an Open Dev Society experiment, numbered in the order they joined. Founders and maintainers carry a role plate.
        </p>
      </Record>

      <p className="t-mono mt-12 flex flex-wrap gap-x-4 gap-y-1 border-y border-(--line) py-2.5 text-[11px] text-(--fg-subtle)">
        <span className="text-(--fg)">How to read a badge:</span>
        {KEY.map(([k, v]) => (
          <span key={k}>
            <span className="text-(--fg)">{k}</span> {v}
          </span>
        ))}
      </p>

      <ol aria-label="Researcher badges" className="mt-6 grid border-t border-l border-(--line) sm:grid-cols-2 lg:grid-cols-3">
        {researchers.map((r) => (
          <li key={r.login} className="border-r border-b border-(--line)">
            <Badge r={r} />
          </li>
        ))}
        <li className="border-r border-b border-(--line)">
          <Vacancy rid={vacancy} />
        </li>
        {blanks(researchers.length + 1).map((c, i) => (
          <li key={i} aria-hidden className={`hidden border-r border-b border-(--line) ${c}`} />
        ))}
      </ol>

      <section aria-labelledby="ledger" className="mt-24">
        <div className="border-t-[3px] border-double border-(--fg)" />
        <h2 id="ledger" className="t-mono mt-3 text-[12px] text-(--fg-muted)">
          § · ROSTER LEDGER · <span className="text-(--fg)">{researchers.length}</span> rows · <span className="text-(--fg)">{total.toLocaleString("en-US")}</span> contributions
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="t-mono w-full min-w-[34rem] text-left text-[12px] tabular-nums">
            <thead className="text-(--fg-subtle)">
              <tr className="border-b border-(--fg)">
                <th className="py-2 pr-4 font-normal">R</th>
                <th className="py-2 pr-4 font-normal">Researcher</th>
                <th className="py-2 pr-4 font-normal">Role</th>
                <th className="py-2 pr-4 font-normal">Joined</th>
                <th className="py-2 pr-4 text-right font-normal">Exp</th>
                <th className="py-2 text-right font-normal">Contrib</th>
              </tr>
            </thead>
            <tbody>
              {researchers.map((r) => (
                <tr key={r.login} className="border-b border-(--line)">
                  <td className="py-1.5 pr-4 text-(--fg)">{r.rid}</td>
                  <td className="py-1.5 pr-4">
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-(--fg) hover:text-(--accent)">
                      @{r.login}
                    </a>
                  </td>
                  <td className="py-1.5 pr-4 text-(--fg-muted)">{r.role ?? "—"}</td>
                  <td className="py-1.5 pr-4 text-(--fg-muted)">{r.joined?.slice(0, 10) ?? "—"}</td>
                  <td className="py-1.5 pr-4 text-right text-(--fg-muted)">{r.exps.length}</td>
                  <td className="py-1.5 text-right text-(--fg)">{r.contributions.toLocaleString("en-US")}</td>
                </tr>
              ))}
              <tr className="text-(--mark-ink)">
                <td className="py-1.5 pr-4">{vacancy}</td>
                <td className="py-1.5 pr-4" colSpan={4}>
                  vacant · issued on your first merged PR
                </td>
                <td className="py-1.5 text-right">0</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t border-(--fg) text-(--fg)">
                <td className="py-2" colSpan={5}>
                  Σ
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
