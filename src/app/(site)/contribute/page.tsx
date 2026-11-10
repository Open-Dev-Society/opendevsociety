import type { Metadata } from "next";
import { LabButton } from "@/components/site/lab-hero/LabButton";
import { contactEmail, social } from "@/content";
import { manualContributors } from "@/data/contributors";
import { getWorkshop } from "@/lib/workshop";
import { type Experiment, Materials, Procedure } from "./protocol";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Protocol 01: First contribution · Open Dev Society",
  description:
    "Your first contribution, from fork to draft pull request, as a lab protocol: materials, procedure with copyable commands, expected result, and ways in for writers, designers, teachers and creators.",
};

const ORG = "https://github.com/Open-Dev-Society";
const GUIDE = `${ORG}/.github/blob/main/CONTRIBUTING.md`;
const CONDUCT = `${ORG}/OpenStock/blob/main/CODE_OF_CONDUCT.md`;
const ISSUES = "https://github.com/search?q=org%3AOpen-Dev-Society+is%3Aissue+is%3Aopen&type=issues";
const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

// The ids keep the old page's anchors (#code, #content, …).
const roles = [
  {
    id: "code",
    title: "Code",
    who: "Developers and engineers",
    tasks: ["Fix a bug or build a feature.", "Review open pull requests.", "Improve performance and security."],
    link: { label: "Open issues", href: ISSUES },
  },
  {
    id: "content",
    title: "Writing",
    who: "Writers and editors",
    tasks: ["Write docs and tutorials.", "Turn a fix into a guide or post.", "Translate or proofread what's there."],
    link: { label: "Contributing guide", href: GUIDE },
  },
  {
    id: "design",
    title: "Design",
    who: "Designers",
    tasks: ["Design logos and graphics.", "Improve a tool's interface.", "Make launch and social assets."],
    link: { label: "This site is open source too", href: `${ORG}/opendevsociety` },
  },
  {
    id: "education",
    title: "Teaching",
    who: "Educators and mentors",
    tasks: ["Write course material.", "Lead a workshop or session.", "Mentor someone through their first PR."],
    link: { label: "Join the Discord", href: social.discord.href },
  },
  {
    id: "media",
    title: "Media",
    who: "Podcasters and creators",
    tasks: ["Record a podcast or video.", "Write about a tool you use.", "Share what ships."],
    link: { label: "Follow on X", href: social.twitter.href },
  },
];

const review = [
  ["Draft opened.", "Push your branch and open a draft PR early. Say what you changed and why."],
  ["Reviewed in public.", "A maintainer comments on the PR, where anyone can read it."],
  ["You iterate.", "Push fixes to the same branch and the PR updates itself."],
  ["Merged.", "Your name is on the commit, and your badge is on the roster."],
];

const values = [
  ["Open and transparent.", "We build in the open and welcome feedback."],
  ["Inclusive and welcoming.", "Everyone belongs here, whatever their experience."],
  ["Free and accessible.", "We never lock knowledge or tools behind paywalls."],
  ["Community-driven.", "We listen to the people who show up."],
  ["Quality and impact.", "We aim for changes that make a difference."],
  ["Respectful and collaborative.", "We treat each other with kindness."],
];

const questions: { q: string; a: React.ReactNode }[] = [
  {
    q: "Do I need experience?",
    a: "No. Pick an open issue, open a draft and ask. Review happens in the open, so you learn as you go.",
  },
  {
    q: "Where do I ask a question?",
    a: (
      <>
        Open a GitHub Discussion on the repo, or ask in the{" "}
        <a href={social.discord.href} className="ink-link" {...ext}>
          Discord ↗
        </a>
        .
      </>
    ),
  },
  { q: "I found a bug. What now?", a: "Open an issue labelled bug on that tool's repository." },
  { q: "Do I keep the credit?", a: "Yes. Every merged PR carries your GitHub name, and your badge goes on the roster." },
  {
    q: "Can I bring my own project?",
    a: (
      <>
        Yes, and it stays yours.{" "}
        <a href="/manifesto" className="ink-link">
          Read the working paper →
        </a>
      </>
    ),
  },
];

const materials = [
  {
    label: "A GitHub account",
    note: (
      <>
        Free.{" "}
        <a href="https://github.com/signup" className="ink-link" {...ext}>
          github.com/signup ↗
        </a>
      </>
    ),
  },
  {
    label: "git, or the GitHub CLI",
    note: (
      <>
        The CLI does fork, clone and PR in one tool.{" "}
        <a href="https://cli.github.com" className="ink-link" {...ext}>
          cli.github.com ↗
        </a>
      </>
    ),
  },
  { label: "An AI coding agent (optional)", note: "Any agent works. §3 has a prompt for it; you stay the author." },
  { label: "One open issue", note: "Chosen in step 3.2. Small is good: a typo fix is a real contribution." },
];

const pad = (n: number, w: number) => String(n).padStart(w, "0");

/** The protocol's section head: a numeral, a condensed title, and the mono record line. */
function Head({ n, title, meta, id }: { n: number; title: React.ReactNode; meta: string; id?: string }) {
  return (
    <div className="mb-8 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-(--fg) pt-3 md:mb-10">
      <span className="t-mono text-[13px] text-(--fg-subtle)">§{n}</span>
      <h2 id={id} className="scroll-mt-24 text-[clamp(2rem,1.4rem+2.2vw,3.25rem)] leading-[0.95] font-[800] tracking-[-0.015em] text-(--fg) [font-stretch:75%]">
        {title}
      </h2>
      <span className="t-mono ml-auto text-[12px] text-(--fg-subtle)">{meta}</span>
    </div>
  );
}

/** Fig. 1, the whole procedure as a branch diagram. Upstream in ink, everything that's yours in rose. */
function Figure({ repo }: { repo: string }) {
  return (
    <figure className="mt-12 max-w-[560px]">
      <svg viewBox="0 0 420 150" className="w-full font-mono text-[12px]" role="img" aria-labelledby="fig1">
        <title id="fig1">{`Fork ${repo}, branch, commit, then open a pull request back into main.`}</title>
        <g fill="var(--fg-muted)">
          <text x="0" y="14">{`Open-Dev-Society/${repo} · main`}</text>
          <text x="0" y="146" fill="var(--mark-ink)">
            you/first-pr
          </text>
          <text x="232" y="68" fill="var(--accent)">
            draft PR → review
          </text>
        </g>
        <path d="M0 30 H420" stroke="var(--fg)" strokeWidth="1.5" />
        {[20, 70, 120, 330, 390].map((x) => (
          <rect key={x} x={x - 4} y={26} width="8" height="8" fill="var(--bg)" stroke="var(--fg)" strokeWidth="1.5" />
        ))}
        <path d="M120 30 V122 H290" fill="none" stroke="var(--mark)" strokeWidth="1.5" />
        {[170, 220, 270].map((x) => (
          <rect key={x} x={x - 4} y={118} width="8" height="8" fill="var(--mark)" />
        ))}
        <path d="M290 122 H330 V38" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="3 3" />
        <path d="M325 44 L330 36 L335 44" fill="none" stroke="var(--accent)" strokeWidth="1.5" />
      </svg>
      <figcaption className="t-mono mt-3 text-[12px] text-(--fg-subtle)">
        Fig. 1 · Fork → branch → commit → draft PR → merge into main.
      </figcaption>
    </figure>
  );
}

export default async function Contribute() {
  const { tools, people } = await getWorkshop();
  // ponytail: EXP ids computed here (stars order, OpenStock = EXP-001) until src/lib/lab.ts lands; swap to expId then.
  const byStars = [...tools].sort((a, b) => Number(b.name === "OpenStock") - Number(a.name === "OpenStock") || b.stars - a.stars);
  const experiments: Experiment[] = byStars
    .map((r, i) => ({ id: `EXP-${pad(i + 1, 3)}`, name: r.name, language: r.language, open: r.open_issues, goodFirst: r.good_first_issues }))
    .filter((e) => e.open > 0);
  const open = experiments.reduce((a, e) => a + e.open, 0);
  const seat = `R-${pad(people.length + 1, 2)}`;
  const signers = [
    ["founder", manualContributors.find((c) => c.role && /^(?!.*Co-Founder).*Founder/i.test(c.role))],
    ["co-founder", manualContributors.find((c) => c.role && /Co-Founder/i.test(c.role))],
  ] as const;

  const sheet = [
    ["Estimated time", "30–60 min"],
    ["Difficulty", "beginner ■□□"],
    ["Subjects", `${open} open issues · ${experiments.length} experiments`],
    ["Yield", "1 draft pull request"],
  ];

  return (
    <article className="mx-auto w-full max-w-(--container) px-(--gutter) pt-10 pb-(--section-y) md:pt-16">
      {/* The protocol header: a ruled form, like the top of a printed lab procedure. */}
      <header className="border-y-[3px] border-double border-(--fg)">
        <div className="t-mono flex flex-wrap justify-between gap-x-6 gap-y-1 border-b border-(--line) py-2.5 text-[12px] text-(--fg-subtle)">
          <span>
            <span className="text-(--fg)">ODS·LAB / PROTOCOL 01</span> · version 1.0
          </span>
          <span>Open Dev Society · open protocol, reuse freely</span>
        </div>
        <div className="grid gap-8 py-10 md:py-14 lg:grid-cols-12 lg:gap-(--grid-gap)">
          <div className="lg:col-span-8">
            <h1 className="text-[clamp(3rem,1rem+6vw,7rem)] leading-[0.88] font-[800] tracking-[-0.018em] text-balance text-(--fg) [font-stretch:75%]">
              First contribution.
            </h1>
            <p className="t-lede mt-6 max-w-[52ch] text-(--fg-muted)">
              From fork to a draft pull request on one of our experiments. {people.length} researchers have run this protocol; every one of them is on the
              roster.
            </p>
            <p className="mt-8 flex flex-wrap gap-3">
              <LabButton href="#procedure">Begin procedure ↓</LabButton>
              <LabButton href="#alternatives" variant="secondary">
                Not a coder?
              </LabButton>
            </p>
          </div>
          <dl className="grid content-start gap-px self-start bg-(--line) shadow-[0_0_0_1px_var(--line)] sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
            {sheet.map(([k, v]) => (
              <div key={k} className="bg-(--bg) px-4 py-3">
                <dt className="t-mono text-[11px] tracking-[0.08em] text-(--fg-subtle) uppercase">{k}</dt>
                <dd className="t-mono mt-0.5 text-(--fg)">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="flex flex-wrap items-end gap-x-12 gap-y-6 border-t border-(--line) py-5">
          <span className="t-mono text-[11px] tracking-[0.08em] text-(--fg-subtle) uppercase">Approved by</span>
          {signers.map(
            ([role, p]) =>
              p && (
                <a key={role} href={p.html_url} {...ext} className="group block min-w-[13rem]">
                  <span className="sign block border-b border-(--fg-subtle) pb-1 text-[26px] leading-none text-(--accent) group-hover:text-(--accent-hover)">
                    {p.name}
                  </span>
                  <span className="t-mono mt-1.5 block text-[11px] text-(--fg-subtle)">{role}</span>
                </a>
              ),
          )}
        </div>
      </header>

      <div className="mt-16 grid gap-y-20 md:mt-24 md:gap-y-28">
        {/* §1 is one sentence, set large. */}
        <section aria-labelledby="purpose">
          <Head n={1} id="purpose" title="Purpose" meta="why run this" />
          <p className="max-w-[34ch] text-[clamp(1.375rem,1.1rem+1vw,2rem)] leading-[1.25] font-[500] tracking-[-0.01em] text-balance text-(--fg)">
            To change one real thing in a tool people use, have it reviewed in the open, and leave with your name on it.
          </p>
        </section>

        <section aria-labelledby="materials" className="grid gap-y-8 lg:grid-cols-12 lg:gap-x-(--grid-gap)">
          <div className="lg:col-span-12">
            <Head n={2} id="materials" title="Materials" meta={`${materials.length} items · tick as you go`} />
          </div>
          <div className="lg:col-span-7">
            <Materials items={materials} />
          </div>
          <p className="t-mono text-[12px] leading-[1.6] text-(--fg-subtle) lg:col-span-4 lg:col-start-9">
            Note. No local setup beyond what the experiment&apos;s README asks for. No experience required: review is part of the protocol, not a gate.
          </p>
        </section>

        <section aria-labelledby="procedure" className="grid gap-y-8 lg:grid-cols-12 lg:gap-x-(--grid-gap)">
          <div className="lg:col-span-12">
            <Head n={3} id="procedure" title="Procedure" meta="choose an experiment, then work down" />
          </div>
          <div className="min-w-0 lg:col-span-8">
            <Procedure experiments={experiments} />
          </div>
          <aside className="t-mono text-[12px] leading-[1.6] text-(--fg-subtle) lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <p>
                <span className="text-(--fg)">Instrument.</span> Terminal gives you the commands. Agent gives you one prompt for a coding agent; you
                review its work before it&apos;s pushed.
              </p>
              <p className="mt-4">
                <span className="text-(--fg)">Operator.</span> Your handle names the branch. It stays in this browser.
              </p>
              <Figure repo={experiments[0]?.name ?? "OpenStock"} />
            </div>
          </aside>
        </section>

        {/* §4: the yield, as the specimen it produces: a vacant rose badge, and the review it passes through. */}
        <section aria-labelledby="result" className="grid gap-y-10 lg:grid-cols-12 lg:gap-x-(--grid-gap)">
          <div className="lg:col-span-12">
            <Head n={4} id="result" title="Expected result" meta="on merge" />
          </div>
          <a
            href="/contributors"
            className="group grid content-between self-start bg-(--bg) p-5 shadow-[inset_0_0_0_1px_var(--mark)] outline-offset-4 lg:col-span-4 lg:aspect-[3/4]"
          >
            <span className="t-mono flex justify-between text-[12px] text-(--mark-ink)">
              <span>ODS·LAB / RESEARCHER</span>
              <span>vacant</span>
            </span>
            <span className="my-10 block text-[clamp(4rem,2rem+6vw,7.5rem)] leading-[0.85] font-[800] text-(--mark-ink) [font-stretch:75%]">{seat}</span>
            <span className="t-mono flex justify-between border-t border-(--mark) pt-3 text-[12px] text-(--mark-ink)">
              <span>you</span>
              <span className="group-hover:underline">on /contributors →</span>
            </span>
          </a>
          <ol className="self-end lg:col-span-7 lg:col-start-6">
            {review.map(([t, b], i) => (
              <li key={t} className="grid grid-cols-[4ch_minmax(0,1fr)] gap-x-3 border-t border-(--line) py-4 last:border-b">
                <span className="t-mono text-(--fg-subtle)">4.{i + 1}</span>
                <p>
                  <span className="font-semibold text-(--fg)">{t}</span> <span className="text-(--fg-muted)">{b}</span>
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="alternatives">
          <Head n={5} id="alternatives" title="Alternative procedures" meta={`${roles.length} ways in · no code required for B–E`} />
          <div className="border-t border-(--fg)">
            {roles.map((r, i) => (
              <div
                key={r.id}
                id={r.id}
                className="grid scroll-mt-24 grid-cols-[3ch_minmax(0,1fr)] gap-x-4 gap-y-3 border-b border-(--line) py-6 md:grid-cols-[4ch_minmax(0,3fr)_minmax(0,5fr)_minmax(0,3fr)] md:items-baseline"
              >
                <span className="t-mono text-(--fg-subtle)">5{"ABCDE"[i]}</span>
                <div>
                  <h3 className="text-[1.75rem] leading-none font-[800] text-(--fg) [font-stretch:75%]">{r.title}</h3>
                  <p className="t-mono mt-1.5 text-[12px] text-(--fg-subtle)">{r.who}</p>
                </div>
                <ul className="col-start-2 space-y-1 text-(--fg-muted) md:col-start-auto">
                  {r.tasks.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <a href={r.link.href} {...ext} className="ink-link t-mono col-start-2 inline-flex min-h-11 items-center text-[13px] md:col-start-auto md:justify-self-end">
                  {r.link.label} ↗
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* §6 sits in a double-ruled box, as safety notes do in a printed protocol. */}
        <section id="values" aria-labelledby="conduct" className="scroll-mt-24 border-[3px] border-double border-(--fg) p-5 md:p-10">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="t-mono text-[13px] text-(--fg-subtle)">§6</span>
            <h2 id="conduct" className="scroll-mt-24 text-[clamp(2rem,1.4rem+2.2vw,3.25rem)] leading-[0.95] font-[800] tracking-[-0.015em] text-(--fg) [font-stretch:75%]">
              Safety notes
            </h2>
            <span className="t-mono ml-auto text-[12px] text-(--fg-subtle)">code of conduct · {values.length} values</span>
          </div>
          <p className="t-lede mt-6 max-w-[56ch] text-(--fg)">
            Be respectful and welcoming. Harassment and discrimination are not tolerated, anywhere we work.
          </p>
          <dl className="mt-8 grid border-t border-(--line) md:grid-cols-2 md:gap-x-(--grid-gap)">
            {values.map(([v, line], i) => (
              <div key={v} className="grid grid-cols-[4ch_minmax(0,1fr)] gap-x-3 border-b border-(--line) py-4">
                <span className="t-mono text-(--fg-subtle)">S{i + 1}</span>
                <div>
                  <dt className="font-semibold text-(--fg)">{v}</dt>
                  <dd className="mt-0.5 text-(--fg-muted)">{line}</dd>
                </div>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-(--fg-muted)">
            Report anything to{" "}
            <a href={`mailto:${contactEmail}`} className="ink-link">
              {contactEmail}
            </a>
            .{" "}
            <a href={CONDUCT} className="ink-link whitespace-nowrap" {...ext}>
              Read the full code of conduct ↗
            </a>
          </p>
        </section>

        <section aria-labelledby="troubleshooting">
          <Head n={7} id="troubleshooting" title="Troubleshooting" meta={`${questions.length} known problems`} />
          <div className="border-t border-(--fg)">
            {questions.map((f, i) => (
              <details
                key={f.q}
                className="group border-b border-(--line) [interpolate-size:allow-keywords] [&::details-content]:h-0 [&::details-content]:overflow-hidden [&::details-content]:transition-[height,content-visibility] [&::details-content]:duration-(--d-3) [&::details-content]:ease-(--ease-in-out) [&::details-content]:[transition-behavior:allow-discrete] open:[&::details-content]:h-auto"
              >
                <summary className="grid min-h-11 cursor-pointer list-none grid-cols-[4ch_minmax(0,1fr)_auto] items-baseline gap-x-3 py-5 [&::-webkit-details-marker]:hidden">
                  <span className="t-mono text-(--fg-subtle)">T{i + 1}</span>
                  <span className="text-[1.125rem] font-semibold text-(--fg)">{f.q}</span>
                  <span aria-hidden className="t-mono text-(--fg-subtle) group-open:hidden">
                    [+]
                  </span>
                  <span aria-hidden className="t-mono hidden text-(--fg-subtle) group-open:inline">
                    [−]
                  </span>
                </summary>
                <p className="grid grid-cols-[4ch_minmax(0,1fr)] gap-x-3 pb-6">
                  <span className="t-mono text-[12px] text-(--fg-subtle)">fix</span>
                  <span className="max-w-[64ch] text-(--fg-muted)">{f.a}</span>
                </p>
              </details>
            ))}
          </div>
        </section>

        <footer className="flex flex-col items-start gap-6 border-t-[3px] border-double border-(--fg) pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="t-mono text-[12px] text-(--fg-subtle)">End of PROTOCOL 01. Stuck at any step? Ask in the Discord.</p>
          <p className="flex flex-wrap gap-3">
            <LabButton href="#procedure">Begin procedure ↑</LabButton>
            <LabButton href={social.discord.href} variant="secondary" {...ext}>
              Discord ↗
            </LabButton>
          </p>
        </footer>
      </div>
    </article>
  );
}
