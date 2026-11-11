import { compact } from "@/lib/format";
import type { OrgRepo } from "@/lib/github";
import { status } from "@/lib/lab";
import type { Builder } from "@/lib/workshop";
import { sizedAvatar } from "../Avatar";
import { Dither } from "../lab/Dither";
import { Container } from "../Section";
import { Callouts } from "./Callouts";
import { CountUp } from "./live";
import { band, display, label } from "./ui";

// The 1-bit fill every bar on the page uses: a 2px checker in the dither ink.
const checker = "bg-[repeating-conic-gradient(var(--accent-brand)_0_25%,transparent_0_50%)] bg-size-[4px_4px]";
const FACES = 7;

/** "MIT, AGPL-3.0 and GPL-2.0" */
const and = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs.at(-1)}`);

/**
 * 01 · What Open Dev Society is: the statement with cited words (hover, focus or tap for its note), and four real numbers that each show themselves.
 * `weeks` is org-wide commits per week, oldest first (the last 12).
 */
export function About({
  tools,
  builders,
  stars,
  commits,
  weeks,
  now,
}: {
  tools: OrgRepo[];
  builders: Builder[];
  stars: number;
  commits: number;
  weeks: number[];
  now: number;
}) {
  const lead = tools.reduce((a, t) => (t.stars > a.stars ? t : a));
  const licenses = [...new Set(tools.map((t) => t.license).filter((l): l is string => !!l))];
  const states = [...tools].sort((a, b) => b.stars - a.stars).map((t) => ({ name: t.name, active: status(t, now) === "running" }));
  const active = states.filter((s) => s.active).length;
  const peak = Math.max(1, ...weeks);

  // One 24px slot for every visual, contents on its bottom edge, so the four captions share a baseline.
  const slot = "flex h-6 items-end";
  const numbers = [
    {
      n: stars,
      short: true,
      what: "GitHub stars",
      show: (
        <>
          <span className={slot} aria-hidden>
            <span className="flex h-2.5 w-full gap-0.5">
              <span className={checker} style={{ flex: lead.stars }} />
              <span className="bg-(--fg-subtle)" style={{ flex: Math.max(stars - lead.stars, stars / 200) }} />
            </span>
          </span>
          <span className="mt-1.5 block">
            {lead.name} {compact(lead.stars)} · {tools.length - 1} others {compact(stars - lead.stars)}
          </span>
        </>
      ),
    },
    {
      n: builders.length,
      what: "contributors",
      show: (
        <>
          <span className={`${slot} items-center`} aria-hidden>
            {builders.slice(0, FACES).map((b) => (
              <Dither
                key={b.login}
                src={sizedAvatar(b.avatar, 24)}
                alt=""
                width={1}
                height={1}
                tone="duotone"
                cell={1}
                className="-mr-1 size-6 ring-2 ring-(--bg)"
              />
            ))}
            {builders.length > FACES && <span className="ml-2.5">+{builders.length - FACES}</span>}
          </span>
          <span className="mt-1.5 block">since July 2024</span>
        </>
      ),
    },
    {
      n: tools.length,
      what: "projects",
      show: (
        <>
          <span className={`${slot} flex-wrap content-end gap-1`} aria-hidden>
            {states.map((s) => (
              <span key={s.name} title={s.name} className={`size-2.5 ${s.active ? "bg-(--accent)" : "shadow-[inset_0_0_0_1px_var(--fg-subtle)]"}`} />
            ))}
          </span>
          <span className="mt-1.5 block">{active} active right now</span>
        </>
      ),
    },
    {
      n: commits,
      what: "commits this week",
      show: (
        <>
          <span className={`${slot} gap-0.5`} aria-hidden>
            {weeks.map((c, i) => (
              <span key={i} className={`flex-1 ${checker}`} style={{ height: `${Math.max(8, (c / peak) * 100)}%` }} />
            ))}
          </span>
          <span className="mt-1.5 block">last {weeks.length} weeks</span>
        </>
      ),
    },
  ];

  return (
    <section aria-labelledby="about-h" data-grid="About" className={`${band} pt-10 md:pt-16`}>
      <Container>
        <h2 id="about-h" className={`${label} mb-6 md:mb-10`}>
          What Open Dev Society is
        </h2>
        <Callouts
          parts={[
            "A ",
            { word: "community", note: `${builders.length} contributors since July 2024. Anyone can join: code, design, writing or teaching.` },
            " building ",
            { word: "free", note: "No paywalls, no gatekeeping, ever." },
            ", ",
            { word: "open-source", note: `${and(licenses)} licensed: fork any of it.` },
            " tools ",
            { word: "in public", note: "Every pull request is reviewed in the open." },
            ".",
          ]}
        />

        <dl className="mt-10 grid grid-cols-2 border-t border-(--fg) md:mt-16 md:grid-cols-4">
          {numbers.map((x, i) => (
            <div
              key={x.what}
              className={`flex flex-col border-b border-(--line) py-5 md:border-b-0 md:px-5 md:first:pl-0 ${i % 2 ? "pl-4" : "border-r pr-4 md:pr-5"} md:border-r md:last:border-r-0`}
            >
              <dt className="t-mono order-2 mt-2 text-[12px] text-(--fg)">{x.what}</dt>
              <dd className={`${display} order-1 text-[clamp(3rem,2rem+4.4vw,6.5rem)]`}>
                <CountUp to={x.n} short={x.short} />
              </dd>
              <dd className="t-mono order-3 mt-4 text-[11px] text-(--fg-muted)">{x.show}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
