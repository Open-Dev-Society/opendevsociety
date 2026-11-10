import Link from "next/link";
import { CopyButton } from "@/app/(site)/manifesto/CopyButton";
import type { Issue, OrgRepo } from "@/lib/github";
import { FORK_COMMAND } from "../Footer";
import { LabButton } from "../lab-hero/LabButton";
import { Plate } from "../lab/Plate";
import { Container } from "../Section";

import { band, display, ext, focus, label } from "./ui";

// The /contribute role anchors (ids on its "Not a coder?" rows).
const roles = [
  {
    who: "Designers",
    what: "improve a tool's interface, logos and launch graphics",
    href: "/contribute#design",
  },
  {
    who: "Writers",
    what: "docs, tutorials and guides",
    href: "/contribute#content",
  },
  {
    who: "Educators",
    what: "workshops, course material and mentoring",
    href: "/contribute#education",
  },
];

/** 05 · emerald: real good first issues (topped up with projects that have open issues), one fork command, and the roles beyond code. */
export function Start({ issues, tools }: { issues: Issue[]; tools: OrgRepo[] }) {
  const busy = tools.filter((t) => t.open_issues > 0 && !issues.some((i) => i.repo === t.name)).slice(0, Math.max(0, 5 - issues.length));
  return (
    <section id="start" aria-labelledby="start-h" data-grid="Start contributing" className={`scroll-mt-16 border-t border-(--line) ${band}`}>
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-x-(--grid-gap)">
        <div className="lg:col-span-6">
          <h2 id="start-h" className={`${display} text-[clamp(2.75rem,1.6rem+4.4vw,5.5rem)]`}>
            Start contributing.
          </h2>
          <p className="mt-5 max-w-[42ch] text-[18px] leading-snug text-(--fg-muted)">
            Pick an issue, fork the project, open a pull request. Maintainers review it in public.
          </p>

          <div className="mt-8 flex flex-col gap-3 bg-(--surface) p-3 sm:flex-row sm:items-center sm:pl-4">
            <code className="t-mono min-w-0 flex-1 text-[14px] text-(--fg) [overflow-wrap:anywhere]">
              <span className="text-(--fg-subtle) select-none">$ </span>
              {FORK_COMMAND}
            </code>
            <CopyButton text={FORK_COMMAND} label="Copy command" />
          </div>

          <p className={`${label} mt-10`}>Not a coder?</p>
          <ul className="mt-3 border-t border-(--line)">
            {roles.map((r) => (
              <li key={r.who}>
                <Link
                  href={r.href}
                  className={`flex items-baseline justify-between gap-4 border-b border-(--line) py-3 hover:bg-(--surface-2) ${focus}`}
                >
                  <span className="text-[16px] text-(--fg-muted)">
                    <span className="font-[650] text-(--fg)">{r.who}:</span> {r.what}
                  </span>
                  <span aria-hidden className="t-mono text-(--fg)">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <p className={label}>{issues.length ? "Good first issues" : "Open issues"} · from GitHub</p>
          <ol className="mt-3 border-t border-(--fg)">
            {issues.map((i) => (
              <li key={i.url}>
                <a href={i.url} {...ext} className={`block border-b border-(--line) py-4 hover:bg-(--surface-2) ${focus}`}>
                  <span className="block text-[17px] leading-snug font-[650] text-(--fg)">{i.title} ↗</span>
                  <span className="mt-2 flex flex-wrap gap-1.5">
                    <Plate tone="ink">
                      {i.repo} #{i.number}
                    </Plate>
                    {i.labels.map((l) => (
                      <Plate key={l}>{l}</Plate>
                    ))}
                  </span>
                </a>
              </li>
            ))}
            {busy.map((t) => (
              <li key={t.name}>
                <a
                  href={`${t.html_url}/issues`}
                  {...ext}
                  className={`flex items-baseline justify-between gap-4 border-b border-(--line) py-4 hover:bg-(--surface-2) ${focus}`}
                >
                  <span className="text-[17px] font-[650] text-(--fg)">{t.name} ↗</span>
                  <span className="t-mono text-[12px] text-(--fg-muted)">
                    {t.open_issues} open issue{t.open_issues === 1 ? "" : "s"}
                  </span>
                </a>
              </li>
            ))}
          </ol>
          <LabButton href="/contribute" className="mt-8">
            The step-by-step guide →
          </LabButton>
        </div>
      </Container>
    </section>
  );
}
