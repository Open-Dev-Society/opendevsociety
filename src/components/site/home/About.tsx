import { Container } from "../Section";
import { CountUp } from "./live";
import { band, display, label } from "./ui";

/** 01 · emerald: what Open Dev Society is, in three sentences, and four real numbers that count up once. */
export function About({ stars, contributors, projects, commits }: { stars: number; contributors: number; projects: number; commits: number }) {
  const numbers = [
    { n: stars, short: true, what: "GitHub stars" },
    { n: contributors, what: "contributors" },
    { n: projects, what: "projects" },
    { n: commits, what: "commits this week" },
  ];
  return (
    <section aria-labelledby="about-h" data-grid="About" className={`tone-emerald ${band} pt-10 md:pt-16`}>
      <Container>
        <h2 id="about-h" className={label}>
          What Open Dev Society is
        </h2>
        <p className={`${display} mt-5 max-w-[22ch] text-[clamp(2rem,1.3rem+3vw,4.25rem)]`}>
          A community building free, open-source tools in public.
        </p>
        <p className="mt-6 max-w-[48ch] text-[clamp(1.125rem,1rem+0.5vw,1.375rem)] leading-snug text-(--fg-muted)">
          Anyone can contribute: code, design, writing or teaching. No paywalls, no gatekeeping, and the work stays open for everyone.
        </p>

        <dl className="mt-12 grid grid-cols-2 border-t border-(--fg) md:mt-16 md:grid-cols-4">
          {numbers.map((x, i) => (
            <div
              key={x.what}
              className={`flex flex-col-reverse border-b border-(--line) py-5 md:border-b-0 md:px-5 md:first:pl-0 ${i % 2 ? "pl-4" : "border-r pr-4 md:pr-5"} md:border-r md:last:border-r-0`}
            >
              <dt className="t-mono mt-2 text-[12px] text-(--fg-muted)">{x.what}</dt>
              <dd className={`${display} text-[clamp(3rem,2rem+4.4vw,6.5rem)]`}>
                <CountUp to={x.n} short={x.short} />
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
