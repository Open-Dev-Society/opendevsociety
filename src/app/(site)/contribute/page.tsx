import type { Metadata } from "next";
import { ChevronDown } from "lucide-react";
import { Bench, Card, Section, SectionHeader, Steps } from "@/components/site";
import { contactEmail, social } from "@/content";
import { getWorkshop } from "@/lib/workshop";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Contribute: Open Dev Society",
  description:
    "Your first contribution, from fork to merged. Three commands for coders, and real ways in for writers, designers, teachers and creators.",
};

const ORG = "https://github.com/Open-Dev-Society";
const GUIDE = `${ORG}/.github/blob/main/CONTRIBUTING.md`;
const CONDUCT = `${ORG}/OpenStock/blob/main/CODE_OF_CONDUCT.md`;
const ISSUES = "https://github.com/search?q=org%3AOpen-Dev-Society+is%3Aissue+is%3Aopen&type=issues";

// Brief §11: five ways in, each with who it's for, three tasks and one real link (the old page's href="#" CTAs are gone).
// The ids keep the old page's anchors.
const roles = [
  {
    id: "code",
    title: "Code",
    who: "For developers and engineers",
    tasks: ["Fix a bug or build a feature.", "Review open pull requests.", "Improve performance and security."],
    link: { label: "Open issues", href: ISSUES },
  },
  {
    id: "content",
    title: "Writing",
    who: "For writers and editors",
    tasks: ["Write docs and tutorials.", "Turn a fix into a guide or post.", "Translate or proofread what's there."],
    link: { label: "Contributing guide", href: GUIDE },
  },
  {
    id: "design",
    title: "Design",
    who: "For designers",
    tasks: ["Design logos and graphics.", "Improve a tool's interface.", "Make launch and social assets."],
    link: { label: "This site is open source too", href: `${ORG}/opendevsociety` },
  },
  {
    id: "education",
    title: "Teaching",
    who: "For educators and mentors",
    tasks: ["Write course material.", "Lead a workshop or session.", "Mentor someone through their first PR."],
    link: { label: "Join the Discord", href: social.discord.href },
  },
  {
    id: "media",
    title: "Media",
    who: "For podcasters and creators",
    tasks: ["Record a podcast or video.", "Write about a tool you use.", "Share what ships."],
    link: { label: "Follow on X", href: social.twitter.href },
  },
];

const review = [
  { title: "Open a draft.", body: "Push your branch and open a draft PR early. Say what you changed and why." },
  { title: "A maintainer reviews it in public.", body: "Comments land on the PR, where anyone can read them." },
  { title: "You iterate.", body: "Push fixes to the same branch and the PR updates itself." },
  {
    title: "It merges, and you're on the wall.",
    body: (
      <a href="/contributors" className="ink-link">
        Find your seat →
      </a>
    ),
  },
];

const values = [
  ["Open and transparent.", "We build in the open and welcome feedback."],
  ["Inclusive and welcoming.", "Everyone belongs here, whatever their experience."],
  ["Free and accessible.", "We never lock knowledge or tools behind paywalls."],
  ["Community-driven.", "We listen to the people who show up."],
  ["Quality and impact.", "We aim for changes that make a difference."],
  ["Respectful and collaborative.", "We treat each other with kindness."],
];

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

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
  {
    q: "Do I keep the credit?",
    a: "Yes. Every merged PR carries your GitHub name, and your face goes on the wall.",
  },
  {
    q: "Can I bring my own project?",
    a: (
      <>
        Yes, and it stays yours.{" "}
        <a href="/manifesto" className="ink-link">
          Read the manifesto →
        </a>
      </>
    ),
  },
];

export default async function Contribute() {
  const { benchRepos, people } = await getWorkshop();
  const open = benchRepos.reduce((a, r) => a + r.openIssues, 0);

  return (
    <>
      <header className="mx-auto w-full max-w-(--container) px-(--gutter) pt-16 pb-16 lg:pt-24 lg:pb-24">
        <SectionHeader
          as="h1"
          className="mb-0 lg:mb-0"
          eyebrow="Contribute"
          count={`${open} open issues`}
          title="Your first contribution, from fork to merged."
          description={`Pick a repo, fork it, open a draft. ${people.length} people have done it so far, and every one of them is on the wall.`}
        />
      </header>

      <Section id="start" tone="inverse">
        <SectionHeader eyebrow="The bench" count="3 commands" title="Three commands, then a review." />
        <Bench repos={benchRepos} wallHref="/contributors" notCoderHref="#roles" />
      </Section>

      <Section id="roles">
        <SectionHeader
          eyebrow="Not a coder?"
          count={`${roles.length} ways in`}
          title="Code is one way in. Here are four more."
          description="Writers, designers, teachers and creators ship here too. Every contribution is credited by name."
        />
        <div className="grid grid-cols-1 gap-(--grid-gap) md:grid-cols-2 lg:grid-cols-6">
          {roles.map((r, i) => (
            <Card key={r.id} className={`flex flex-col ${i < 3 ? "lg:col-span-2" : "lg:col-span-3"}`}>
              <div id={r.id} className="scroll-mt-24" />
              <h3 className="t-title text-(--fg)">{r.title}</h3>
              <p className="t-meta mt-1 text-(--fg-subtle)">{r.who}</p>
              <ul className="mt-5 flex-1 space-y-1.5 text-sm text-(--fg-muted)">
                {r.tasks.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <a href={r.link.href} className="ink-link t-meta mt-6 inline-flex min-h-11 items-center self-start" {...ext}>
                {r.link.label} ↗
              </a>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="review" tone="muted">
        <SectionHeader
          eyebrow="Review"
          count={`${review.length} steps`}
          title="How review works."
          description="Every pull request is reviewed in the open, by a maintainer, on GitHub."
        />
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-(--grid-gap)">
          <Steps className="lg:col-span-9 lg:col-start-4" items={review} />
        </div>
      </Section>

      <Section id="values">
        <SectionHeader
          eyebrow="Conduct"
          count={`${values.length} values`}
          title={
            <span id="conduct" className="scroll-mt-24">
              Code of conduct.
            </span>
          }
          description="Be respectful and welcoming. Harassment and discrimination are not tolerated, anywhere we work."
        />
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-(--grid-gap)">
          <div className="lg:col-span-9 lg:col-start-4">
            <dl className="grid grid-cols-1 border-t border-(--line) md:grid-cols-2 md:gap-x-(--grid-gap)">
              {values.map(([v, line]) => (
                <div key={v} className="border-b border-(--line) py-4">
                  <dt className="font-semibold text-(--fg)">{v}</dt>
                  <dd className="mt-1 text-(--fg-muted)">{line}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-8 text-(--fg-muted)">
              Report anything to{" "}
              <a href={`mailto:${contactEmail}`} className="ink-link">
                {contactEmail}
              </a>
              .{" "}
              <a href={CONDUCT} className="ink-link whitespace-nowrap" {...ext}>
                Read the full code of conduct ↗
              </a>
            </p>
          </div>
        </div>
      </Section>

      <Section id="questions" className="pt-0">
        <SectionHeader eyebrow="Questions" count={`${questions.length} answers`} title="Questions, answered." />
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-(--grid-gap)">
          <div className="divide-y divide-(--line) border-y border-(--line) lg:col-span-9 lg:col-start-4">
            {questions.map((f) => (
              <details
                key={f.q}
                className="group [interpolate-size:allow-keywords] [&::details-content]:h-0 [&::details-content]:overflow-hidden [&::details-content]:transition-[height,content-visibility] [&::details-content]:[transition-behavior:allow-discrete] [&::details-content]:duration-(--d-3) [&::details-content]:ease-(--ease-in-out) open:[&::details-content]:h-auto"
              >
                <summary className="t-title flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-5 text-(--fg) [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown
                    aria-hidden
                    className="size-5 shrink-0 text-(--fg-subtle) transition-transform duration-(--d-3) ease-(--ease-in-out) group-open:rotate-180"
                    strokeWidth={1.75}
                  />
                </summary>
                <p className="max-w-[64ch] pb-6 text-(--fg-muted)">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
