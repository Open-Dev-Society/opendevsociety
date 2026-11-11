import { catalog } from "@/data/catalog";
import { ago, compact } from "@/lib/format";
import type { OrgRepo } from "@/lib/github";
import { status } from "@/lib/lab";
import type { Builder } from "@/lib/workshop";
import { label } from "../../home/ui";
import { Container } from "../../Section";
import { Sheets, type SheetData } from "./Sheets";

const PLAIN = { running: "active", paused: "quiet", archived: "archived" } as const;
const month = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

/** Projects as blueprint plates: one sheet at a time, the screenshot drawn as line-art, real numbers as dimensions. */
export function Blueprint({ tools, builders, now }: { tools: OrgRepo[]; builders: Builder[]; now: number }) {
  const sheets: SheetData[] = [...tools]
    .sort((a, b) => b.stars - a.stars)
    .map((t) => {
      const c = catalog[t.name];
      const state = PLAIN[status(t, now)];
      return {
        name: t.name,
        tagline: c.tagline,
        shot: c.shot,
        repo: t.html_url,
        homepage: t.homepage,
        stars: compact(t.stars),
        contributors: builders.filter((b) => b.repos.includes(t.name)).length,
        since: month.format(Date.parse(t.created_at)),
        pushed: ago(t.pushed_at, now),
        license: t.license,
        language: t.language,
        status: c.badge ? `${state} · ${c.badge}` : state,
        forks: t.forks,
        issues: t.open_issues,
        goodFirst: t.good_first_issues,
      };
    });
  const active = tools.filter((t) => status(t, now) === "running").length;

  return (
    <section id="work" aria-labelledby="work-h" data-grid="Projects" className="scroll-mt-16 border-t border-(--line) py-12 md:py-24">
      <Container>
        <h2 id="work-h" className={`${label} mb-6 flex justify-between gap-4 border-b border-(--line) pb-3`}>
          <span>
            Projects · {tools.length} · {active} active
          </span>
          <span className="max-md:hidden">← → to flip · hover a drawing for the screenshot</span>
        </h2>
        <Sheets sheets={sheets} />
      </Container>
    </section>
  );
}
