import type { Metadata } from "next";
import { Badge, Button, Quote, Section, Steps } from "@/components/site";
import { social } from "@/content";
import { manualContributors } from "@/data/contributors";
import { getWorkshop } from "@/lib/workshop";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Manifesto: Open Dev Society",
  description:
    "Technology should belong to everyone. Why Open Dev Society builds free, open-source tools in public, and the promise behind them.",
};

const repoUrl = (name: string) => `https://github.com/Open-Dev-Society/${name}`;

// Brief §11: four rules, one sentence each.
const rules = [
  { title: "Default to open.", body: "Every line of code and every decision is public." },
  { title: "No permission needed.", body: "No interviews. Fork it and send the PR." },
  { title: "Ship, then improve.", body: "Release early and fix it in the open." },
  { title: "Lift each other.", body: "Everyone teaches, everyone learns." },
];

const promise = ["We will never lock knowledge.", "We will never charge for access.", "We will never trade trust for money."];

// The old manifesto's FAQ, kept for anyone bringing a project.
const ownership = [
  { q: "Can I show the project as my own work?", a: "Yes. You keep full credit. We support your growth, we don't claim it." },
  { q: "Do I lose ownership?", a: "No. ODS is a platform, not a company claiming your IP." },
  { q: "Can I take my project back?", a: "Any time. There's no lock-in." },
];

const col = "lg:col-span-8 lg:col-start-3";
const h2 = "display-3 text-(--fg)";
const body = "text-[17px] leading-[1.7] text-(--fg-muted)";

export default async function Manifesto() {
  const { tools, people } = await getWorkshop();
  const has = (name: string) => tools.some((r) => r.name === name);
  const founder = manualContributors.find((c) => c.role && /^(?!.*Co-Founder).*Founder/i.test(c.role));

  // "What we build": the old ecosystem list, mapped to real repos where they exist; the rest is labelled planned.
  type Row = { name: string; what: string; links?: { label: string; href: string }[] };
  const build: Row[] = [
    {
      name: "Tools",
      what: "Simple utilities, free to use.",
      links: [
        ...["OpenStock", "openreadme"].filter(has).map((n) => ({ label: n, href: repoUrl(n) })),
        { label: `all ${tools.length}`, href: "/projects" },
      ],
    },
    { name: "Library", what: "A gateway to free books.", links: has("booktrace") ? [{ label: "booktrace", href: repoUrl("booktrace") }] : undefined },
    { name: "Learn", what: "Roadmaps and mentorship." },
    { name: "Education", what: "Free courses and workshops." },
    { name: "Media", what: "Podcasts and tutorials." },
    { name: "Events", what: "Hackathons and conferences.", links: [{ label: "Apretre 3.0 and JWOC 2026", href: "/word-of-mouth#partners" }] },
    { name: "News", what: "Information without an agenda." },
    { name: "Community", what: "A home for contributors.", links: [{ label: `${people.length} builders`, href: "/contributors" }] },
  ];

  return (
    <>
      <header className="mx-auto grid w-full max-w-(--container) grid-cols-1 px-(--gutter) pt-16 lg:grid-cols-12 lg:gap-x-(--grid-gap) lg:pt-24">
        <div className={col}>
          <p className="rise t-meta text-(--fg-muted)" style={{ "--i": 0 } as React.CSSProperties}>
            Manifesto · July 2024
          </p>
          <h1 className="rise display-2 mt-6 max-w-[16ch] text-(--fg)" style={{ "--i": 1 } as React.CSSProperties}>
            Technology should belong to <span className="sign text-(--accent)">everyone.</span>
          </h1>
          <p
            className="rise mt-8 max-w-[52ch] text-[19px] leading-[1.55] text-pretty text-(--fg-muted) md:text-[22px]"
            style={{ "--i": 2 } as React.CSSProperties}
          >
            Knowledge is hidden behind paywalls. Tools are locked in subscriptions. Newcomers are told they&apos;re not good enough.
            We think there&apos;s a better way, and we&apos;re building it.
          </p>
        </div>
      </header>

      <Section className="pt-16 lg:pt-24" containerClassName="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-(--grid-gap)">
        <div className={col}>
          <h2 className={h2}>Four rules.</h2>
          <Steps className="mt-8" items={rules} />
        </div>

        <Quote
          variant="feature"
          className="my-20 lg:col-span-10 lg:col-start-2 lg:my-32"
          quote="Knowledge isn't just code—it's conversation, collaboration, and connection."
          name={founder?.name ?? "Open Dev Society"}
          source="Manifesto"
          year="2024"
        />

        <div className={col}>
          <h2 className={h2}>What we build.</h2>
          <p className={`${body} mt-4 max-w-[64ch]`}>Where a piece already ships, it links to the code. The rest is next.</p>
          <ul className="mt-8 divide-y divide-(--line) border-y border-(--line)">
            {build.map((r) => (
              <li key={r.name} className="grid grid-cols-1 gap-x-6 gap-y-1 py-4 sm:grid-cols-[7.5rem_minmax(0,1fr)_auto] sm:items-baseline">
                <span className="font-semibold text-(--fg)">{r.name}</span>
                <span className="text-(--fg-muted)">{r.what}</span>
                <span className="t-meta">
                  {r.links ? (
                    r.links.map((l, i) => (
                      <span key={l.href}>
                        {i > 0 && <span className="text-(--fg-subtle)"> · </span>}
                        <a href={l.href} className="ink-link" {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                          {l.label}
                          {l.href.startsWith("http") ? " ↗" : " →"}
                        </a>
                      </span>
                    ))
                  ) : (
                    <Badge>planned</Badge>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section className="pt-0" containerClassName="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-(--grid-gap)">
        <div className={col}>
          <div className="tone-inverse rounded-(--radius-lg) p-8 shadow-(--shadow-lg) sm:p-12">
            <h2 className="t-meta text-(--fg-subtle)">The promise</h2>
            <ul className="mt-6 space-y-3">
              {promise.map((l) => (
                <li key={l} className="t-title text-(--fg)">
                  {l}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-(--fg-muted)">Running on transparency, donations and community.</p>
            {founder && (
              <p className="t-meta mt-10 border-t border-(--line) pt-6 text-(--fg-muted)">
                <a href={founder.html_url} target="_blank" rel="noopener noreferrer" className="sign text-[22px] text-(--accent) hover:text-(--accent-hover)">
                  {founder.name}
                </a>
                <span className="ml-2">founder</span>
              </p>
            )}
          </div>

          <h2 className={`${h2} mt-24 lg:mt-32`}>Platform, not gatekeeper.</h2>
          <p className={`${body} mt-4 max-w-[64ch]`}>
            Bring your project and it stays yours: the credit, the decisions and the right to leave. We bring contributors,
            visibility and public review, and we never take the credit. Your project. Your vision. Our community.
          </p>
          <dl className="mt-8 divide-y divide-(--line) border-y border-(--line)">
            {ownership.map((f) => (
              <div key={f.q} className="py-4">
                <dt className="font-semibold text-(--fg)">{f.q}</dt>
                <dd className="mt-1 text-(--fg-muted)">{f.a}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8">
            <Button href={social.discord.href} icon="external" external>
              Bring it to the Discord
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
