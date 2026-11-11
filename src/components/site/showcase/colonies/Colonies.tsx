import { catalog } from "@/data/catalog";
import { getProject } from "@/lib/github";
import { getWorkshop } from "@/lib/workshop";
import { ArrowRight } from "../../Icon";
import { LabButton } from "../../lab-hero/LabButton";
import { Container } from "../../Section";
import { band, display, label } from "../../home/ui";
import { ColonyField, type Colony } from "./ColonyField";
import { packDesktop, packMobile } from "./layout";

/** Commits in the last 8 weeks, the newest counting most: what sets a colony's pulse. */
const recency = (weeks: number[]) => weeks.slice(-8).reduceRight((n, c, i, a) => n + c * 0.8 ** (a.length - 1 - i), 0);

// A stable number per name (FNV-1a), for each colony's shape and pulse phase.
const hash = (s: string) => [...s].reduce((h, ch) => Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0, 2166136261);

/** Projects as living colonies: size by stars (log), pulse by recent commits. Hover, focus or tap one to see it. */
export async function Colonies() {
  const { tools } = await getWorkshop();
  const sorted = [...tools].sort((a, b) => b.stars - a.stars || a.name.localeCompare(b.name));
  const details = await Promise.all(sorted.map((t) => getProject(t.name)));
  const recent = details.map((d) => recency(d?.weeks.map((w) => w.commits) ?? []));
  const top = Math.log1p(Math.max(1, ...recent));
  const colonies: Colony[] = sorted.map((t, i) => {
    const busy = Math.log1p(recent[i]) / top;
    return {
      name: t.name,
      href: `/projects/${t.name}`,
      tagline: catalog[t.name].tagline,
      shot: catalog[t.name].shot,
      stars: t.stars,
      contributors: details[i]?.contributors.length ?? 0,
      commits: (details[i]?.weeks ?? []).slice(-8).reduce((n, w) => n + w.commits, 0),
      pulse: recent[i] > 0 ? +(0.12 + 0.5 * busy).toFixed(3) : 0,
      regime: recent[i] > 0 ? +(0.55 + 0.45 * busy).toFixed(3) : 0.25,
      seed: +((hash(t.name) / 2 ** 32) * Math.PI * 2).toFixed(4),
    };
  });
  const stars = sorted.map((t) => t.stars);
  const live = colonies.filter((c) => c.pulse > 0).length;

  return (
    <section id="work" aria-labelledby="colonies-h" className={`scroll-mt-16 overflow-x-clip border-t border-(--line) bg-(--bg) ${band}`}>
      <Container>
        <p className={`${label} flex justify-between gap-4 border-b border-(--line) pb-3`}>
          <span>
            Projects · {colonies.length} · {live} with commits in the last 8 weeks
          </span>
          <span className="max-md:hidden">size = stars · pulse = recent commits</span>
        </p>
        <h2 id="colonies-h" className={`${display} mt-6 max-w-[16ch] text-[clamp(2.25rem,1.4rem+3vw,4rem)] md:mt-8`}>
          Every project, growing in the open
        </h2>
        <p className="mt-4 max-w-[60ch] text-[16px] text-(--fg-muted) md:text-[17px]">
          <span className="max-md:hidden">Bigger means more stars; a faster pulse means more commits lately. Hover or tab to a project to see it.</span>
          <span className="md:hidden">Bigger means more stars; a faster pulse means more commits lately. Tap one to see it, tap again to open it.</span>
        </p>
        <div className="mt-10 md:mt-12">
          <ColonyField colonies={colonies} desktop={packDesktop(stars)} mobile={packMobile(stars)} />
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 md:mt-14">
          <p className={`${label} normal-case`}>Still colonies have had no commits in the last 8 weeks.</p>
          <LabButton href="/projects" variant="secondary" size="md" className="max-sm:w-full">
            All {colonies.length} projects <ArrowRight size="1em" />
          </LabButton>
        </div>
      </Container>
    </section>
  );
}
