import { catalog } from "@/data/catalog";
import { getProject, type OrgRepo } from "@/lib/github";
import { status } from "@/lib/lab";
import type { Builder } from "@/lib/workshop";
import { Container } from "../Section";
import { Spotlight, type SpotRow } from "./Spotlight";
import { band, label } from "./ui";

/** 02 · Projects as a spotlight: the eight most-starred, one on the stage at a time. */
export async function Projects({ tools, builders, now }: { tools: OrgRepo[]; builders: Builder[]; now: number }) {
  const active = tools.filter((t) => status(t, now) === "running").length;
  const top = [...tools].sort((a, b) => b.stars - a.stars).slice(0, 8);
  // Same cached calls as each project's page; only the weeks are used (the fallback stage's activity strip).
  const details = await Promise.all(top.map((t) => getProject(t.name)));
  const rows: SpotRow[] = top.map((t, i) => {
    const shot = catalog[t.name].shot;
    return {
      name: t.name,
      tagline: catalog[t.name].tagline,
      stars: t.stars,
      contributors: builders.filter((b) => b.repos.includes(t.name)).length,
      language: t.language,
      status: status(t, now),
      shot,
      // A shot is only captured when the homepage answers (scripts/capture-shots.mjs), so it vouches for the link.
      homepage: shot ? t.homepage : null,
      repo: t.html_url,
      weeks: details[i]?.weeks.map((w) => w.commits) ?? [],
    };
  });

  return (
    <section id="work" aria-labelledby="work-h" data-grid="Projects" className={`scroll-mt-16 border-t border-(--line) ${band}`}>
      <Container>
        <h2 id="work-h" className={`${label} flex justify-between gap-4 border-b border-(--line) pb-3`}>
          <span>
            Projects · {tools.length} · {active} active
          </span>
          <span className="max-md:hidden">most stars first</span>
        </h2>
        <div className="mt-6 md:mt-10">
          <Spotlight rows={rows} total={tools.length} />
        </div>
      </Container>
    </section>
  );
}
