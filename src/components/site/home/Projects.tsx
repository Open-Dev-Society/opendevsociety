import { catalog } from "@/data/catalog";
import type { OrgRepo } from "@/lib/github";
import { status } from "@/lib/lab";
import type { Builder } from "@/lib/workshop";
import { LabButton } from "../lab-hero/LabButton";
import { Container } from "../Section";
import { ProjectIndex, type IndexRow } from "./ProjectIndex";
import { band, label } from "./ui";
import { ArrowRight } from "../Icon";

const PLAIN = { running: "active", paused: "quiet", archived: "archived" } as const;

/** 02 · Projects as a type index, most stars first; hovering a name brings up its dithered preview. */
export function Projects({ tools, builders, now }: { tools: OrgRepo[]; builders: Builder[]; now: number }) {
  const max = Math.log1p(Math.max(...tools.map((t) => t.stars)));
  const active = tools.filter((t) => status(t, now) === "running").length;
  const rows: IndexRow[] = [...tools]
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 8)
    .map((t) => ({
      name: t.name,
      href: `/projects/${t.name}`,
      stars: t.stars,
      bar: Math.log1p(t.stars) / max,
      status: PLAIN[status(t, now)],
      language: t.language,
      tagline: catalog[t.name].tagline,
      shot: catalog[t.name].shot,
      contributors: builders.filter((b) => b.repos.includes(t.name)).length,
    }));

  return (
    <section id="work" aria-labelledby="work-h" data-grid="Projects" className={`scroll-mt-16 border-t border-(--line) ${band}`}>
      <Container>
        <h2 id="work-h" className={`${label} flex justify-between gap-4 border-b border-(--line) pb-3`}>
          <span>
            Projects · {tools.length} · {active} active
          </span>
          <span className="max-md:hidden">by stars · hover for a preview</span>
        </h2>
        <div className="mt-6 md:mt-8">
          <ProjectIndex rows={rows} />
        </div>
        <LabButton href="/projects" variant="secondary" size="md" className="mt-8 max-sm:w-full">
          All {tools.length} projects <ArrowRight size="1em" />
        </LabButton>
      </Container>
    </section>
  );
}
