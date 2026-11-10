import Link from "next/link";
import { catalog } from "@/data/catalog";
import { ago, compact } from "@/lib/format";
import type { OrgRepo } from "@/lib/github";
import { LabButton } from "../lab-hero/LabButton";
import { Dither } from "../lab/Dither";
import { Plate } from "../lab/Plate";
import { Container } from "../Section";
import { band, display, focus, label } from "./ui";

const href = (name: string) => `/projects/${name}`;

/** 02 · paper: OpenStock large, its screenshot developing on hover, then three more and the way to all of them. */
export function Projects({ tools, now, lastPush }: { tools: OrgRepo[]; now: number; lastPush: string }) {
  const lead = tools.find((t) => t.name === "OpenStock") ?? tools[0];
  const rest = [
    ...tools.filter((t) => t !== lead && catalog[t.name].featured),
    ...tools.filter((t) => t !== lead && !catalog[t.name].featured),
  ].slice(0, 3);
  const shot = catalog[lead.name].shot;

  return (
    <section id="work" aria-labelledby="work-h" data-grid="Projects" className={`scroll-mt-16 border-t border-(--line) ${band}`}>
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div>
            <p className={label}>
              {tools.length} projects · updated {ago(lastPush, now)}
            </p>
            <h2 id="work-h" className={`${display} mt-3 text-[clamp(2.5rem,1.6rem+3.6vw,5rem)]`}>
              Free tools, built in the open.
            </h2>
          </div>
          <LabButton href="/projects" variant="secondary" size="md" className="max-md:hidden">
            All {tools.length} projects →
          </LabButton>
        </div>

        <div className="mt-10 grid gap-y-8 md:mt-14 lg:grid-cols-12 lg:gap-x-(--grid-gap)">
          <Link href={href(lead.name)} className={`group block lg:col-span-7 ${focus}`}>
            <span className="relative block">
              {shot && (
                <Dither
                  src={shot}
                  alt={`${lead.name}: index prices, the market clock and a chart`}
                  width={2880}
                  height={1800}
                  align="top"
                  negative
                  develop
                  className="w-full shadow-[0_0_0_1px_var(--line)]"
                />
              )}
              <Plate as="span" tone="ink" className="absolute top-3 left-3">
                ★ {compact(lead.stars)}
              </Plate>
              <Plate as="span" className="absolute right-3 bottom-3 max-md:hidden">
                <span className="group-hover:hidden group-focus-visible:hidden">hover to develop</span>
                <span className="hidden group-hover:inline group-focus-visible:inline">open the project →</span>
              </Plate>
            </span>
            <span className="mt-4 flex items-baseline justify-between gap-4">
              <span className={`${display} text-[clamp(2rem,1.5rem+2vw,3rem)] group-hover:text-(--accent)`}>{lead.name}</span>
              <span className="t-mono shrink-0 text-[12px] text-(--fg-muted)">{lead.language}</span>
            </span>
            <span className="mt-1 block text-[17px] text-(--fg-muted)">{catalog[lead.name].tagline}</span>
          </Link>

          <ol className="border-t border-(--fg) lg:col-span-5">
            {rest.map((r, i) => (
              <li key={r.name}>
                <Link
                  href={href(r.name)}
                  className={`grid grid-cols-[2rem_minmax(0,1fr)_auto] items-baseline gap-x-3 border-b border-(--line) py-4 transition-colors duration-(--d-2) hover:bg-(--surface-2) ${focus}`}
                >
                  <span className="t-mono text-[12px] text-(--fg-subtle)">0{i + 2}</span>
                  <span className="min-w-0">
                    <span className={`${display} block text-[1.75rem]`}>{r.name}</span>
                    <span className="mt-1 block text-[15px] text-(--fg-muted)">{catalog[r.name].tagline}</span>
                  </span>
                  <span className="t-mono text-[12px] text-(--fg)">★ {compact(r.stars)}</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>

        <LabButton href="/projects" variant="secondary" size="md" className="mt-8 w-full md:hidden">
          All {tools.length} projects →
        </LabButton>
      </Container>
    </section>
  );
}
