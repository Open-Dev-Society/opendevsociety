import type { Metadata } from "next";
import { Fragment } from "react";
import { Cite } from "@/components/site/Cite";
import { LabButton } from "@/components/site/lab-hero/LabButton";
import { REGIMES } from "@/components/site/lab-hero/field";
import { contactEmail, social } from "@/content";
import { manualContributors, roleLabel, signers } from "@/data/contributors";
import { mentions } from "@/data/mentions";
import { ago } from "@/lib/format";
import { projectHref } from "@/lib/lab";
import { getWorkshop } from "@/lib/workshop";
import { figureFrames, N, SEED, STEPS } from "./figure";

export const revalidate = 3600;

const DATE = "10 Nov 2026";
const TITLE = "Technology Should Belong to Everyone";

const maintainers = manualContributors.filter((c) => c.role && /Maintainer/i.test(c.role));

export const metadata: Metadata = {
  title: `Manifesto: ${TITLE} · Open Dev Society`,
  description:
    "The Open Dev Society manifesto: why we build free, open-source tools in public. Four principles, what we build, three promises, and who owns your work.",
};

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

const rules = [
  { title: "Default to open", body: "Every line of code and every decision is public." },
  { title: "No permission needed", body: "No interviews. Fork it and send the PR." },
  { title: "Ship, then improve", body: "Release early and fix it in the open." },
  { title: "Lift each other", body: "Everyone teaches, everyone learns." },
];
const promise = ["We will never lock knowledge.", "We will never charge for access.", "We will never trade trust for money."];

const tarang = mentions.find((m) => m.author.startsWith("Tattva Tarang"))!;

// Further reading, at the foot of the page.
const reading = [
  { by: "Open Dev Society", title: "Every project: source code and history", where: "GitHub, 2024–2026", href: "https://github.com/Open-Dev-Society" },
  { by: "T. Tarang", title: "OpenStock: the free, open-source stock market app built for everyone", where: "Coding Nexus (Medium), 2025", href: tarang.url },
  { by: "Free Software Foundation", title: "GNU Affero General Public License, version 3", where: "19 Nov 2007", href: "https://www.gnu.org/licenses/agpl-3.0.html" },
  { by: "A. M. Turing", title: "The chemical basis of morphogenesis", where: "Phil. Trans. R. Soc. Lond. B 237 (641): 37–72, 1952", href: "https://doi.org/10.1098/rstb.1952.0012" },
  { by: "J. E. Pearson", title: "Complex patterns in a simple system", where: "Science 261 (5118): 189–192, 1993", href: "https://doi.org/10.1126/science.261.5118.189" },
  { by: "B. E. Bayer", title: "An optimum method for two-level rendition of continuous-tone pictures", where: "IEEE International Conference on Communications, 1973", href: "https://en.wikipedia.org/wiki/Ordered_dithering" },
];

const A = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} className="ink-link" {...(href.startsWith("http") ? ext : {})}>
    {children}
  </a>
);

// The footnotes, numbered in reading order.
const NOTES: Record<number, React.ReactNode> = {
  1: <>Founded July 2024. Everything we make lives at <A href="https://github.com/Open-Dev-Society">github.com/Open-Dev-Society</A>.</>,
  2: <>Free to use and free to fork. OpenStock, for one, is under the <A href="https://www.gnu.org/licenses/agpl-3.0.html">GNU AGPL v3.0</A>, so a copy served to others must stay open too.</>,
  3: <>There is no application form. Your first pull request is the application.</>,
  4: <>The same pattern runs live at the top of the home page, seeded by the letters of its headline.</>,
  5: <>Our partners and what they support are listed on <A href="/word-of-mouth#partners">What people say</A>.</>,
  6: <>Every licence we use grants the right to fork. Leaving costs one <span className="whitespace-nowrap">git remote set-url</span>.</>,
};

const ownership = [
  { q: "Can I show the project as my own work?", a: "Yes. You keep full credit. We support your growth, we don't claim it." },
  { q: "Do I lose ownership?", a: "No. ODS is a platform, not a company claiming your IP." },
  { q: "Can I take my project back?", a: <>Any time. There&apos;s <Cite n={6} note={NOTES[6]}>no lock-in</Cite>.</> },
];

function H2({ n, id, children }: { n: number; id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="mt-16 mb-5 flex scroll-mt-24 items-baseline gap-4 text-[1.375rem] leading-tight font-[650] tracking-[-0.012em] text-(--fg)">
      <span className="font-mono text-[15px] font-normal text-(--accent)">{n}</span>
      {children}
    </h2>
  );
}

export default async function Manifesto() {
  const { tools, people, lastPush, now } = await getWorkshop();
  const latest = tools.find((t) => t.pushed_at === lastPush)?.name;
  const frames = figureFrames();
  const num = (x: number) => x.toFixed(4).replace(/0+$/, "");

  type Status = { label: string; href: string }[] | null;
  const tool = (n: string) => (tools.some((r) => r.name === n) ? [{ label: n, href: projectHref(n) }] : []);
  const table: { area: string; aim: string; status: Status }[] = [
    { area: "Tools", aim: "Simple utilities, free to use.", status: [...tool("OpenStock"), ...tool("openreadme"), { label: `all ${tools.length} →`, href: "/projects" }] },
    { area: "Library", aim: "A gateway to free books.", status: tool("booktrace").length ? tool("booktrace") : null },
    { area: "Learn", aim: "Roadmaps and mentorship.", status: null },
    { area: "Education", aim: "Free courses and workshops.", status: null },
    { area: "Media", aim: "Podcasts and tutorials.", status: null },
    { area: "Events", aim: "Hackathons and conferences.", status: [{ label: "Apretre 3.0, JWOC 2026 →", href: "/word-of-mouth#partners" }] },
    { area: "News", aim: "Information without an agenda.", status: null },
    { area: "Community", aim: "A home for contributors.", status: [{ label: `${people.length} contributors →`, href: "/contributors" }] },
  ];

  const body = "text-[17px] leading-[1.7] text-(--fg) hyphens-auto sm:text-justify [&>p+p]:indent-6";

  return (
    <article data-grid="Manifesto" className="mx-auto w-full max-w-(--container) px-(--gutter) pt-10 pb-24 lg:pt-14 lg:pb-32">
      {/* The header strip: what this is, before anything else. */}
      <header className="border-y-[3px] border-double border-(--fg) py-2.5">
        <p className="t-mono flex flex-wrap justify-between gap-x-6 gap-y-1 text-[12px] text-(--fg-muted)">
          <span>
            <span className="text-(--fg)">MANIFESTO</span> · Open Dev Society · updated {DATE}
          </span>
          <span className="max-sm:hidden">5 min read</span>
        </p>
      </header>

      <div className="mt-14 lg:grid lg:grid-cols-[minmax(0,68ch)_13rem] lg:justify-center lg:gap-x-10">

        <div data-column className="min-w-0">
          {/* Title page */}
          <div className="text-center">
            <h1 className="mx-auto max-w-[14ch] text-[clamp(2.5rem,1.6rem+3.6vw,4.25rem)] leading-[0.92] font-[800] tracking-[-0.018em] text-balance text-(--fg) [font-stretch:75%]">
              {TITLE}
            </h1>
            <p className="mt-9 flex flex-wrap justify-center gap-x-8 gap-y-2 text-[22px]">
              {signers.map((f) => (
                <span key={f.login}>
                  <a href={f.html_url} {...ext} className="sign text-(--fg) transition-colors duration-(--d-2) hover:text-(--accent)">
                    {f.name}
                  </a>
                </span>
              ))}
            </p>
            <p className="t-mono mt-3 text-[12px] text-(--fg-muted)">
              Open Dev Society ·{" "}
              <a href={social.github.href} {...ext} className="hover:text-(--accent)">
                github.com/Open-Dev-Society
              </a>{" "}
              ·{" "}
              <a href={`mailto:${contactEmail}`} className="hover:text-(--accent)">
                {contactEmail}
              </a>
            </p>
            <p className="t-mono mt-5 text-[12px] text-(--fg-subtle)">Written July 2024 · updated {DATE}</p>
          </div>

          {/* The short version, in a ruled box with its label set into the top rule. */}
          <section aria-labelledby="short" className="relative mt-12 border border-(--fg) px-5 pt-7 pb-6 sm:px-8">
            <h2 id="short" className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-(--bg) px-3 font-mono text-[12px] tracking-[0.2em] whitespace-nowrap text-(--fg) uppercase">
              The short version
            </h2>
            <p className="text-[16px] leading-[1.65] text-(--fg) hyphens-auto sm:text-justify">
              Knowledge is hidden behind paywalls. Tools are locked in subscriptions. Newcomers are told they&apos;re not good enough. We think
              there&apos;s a better way, and we&apos;re building it: {tools.length} free, open-source projects so far, by {people.length}{" "}
              contributors. Below are the four principles we work by, what we build, the three promises we keep, and who owns the work.
            </p>
          </section>

          <div className={body}>
            <H2 n={1} id="introduction">
              Why we exist
            </H2>
            <p>
              <Cite n={1} note={NOTES[1]}>Open Dev Society</Cite> is a community that builds free software in public. What we believe is short: technology should belong to everyone. Not licensed to them,
              rented to them, or shown to them after a sign-up form, but theirs, to use, read, change and pass on.
            </p>
            <p>
              The obstacles are familiar. Knowledge sits behind paywalls; tools sit behind subscriptions; the newcomer is asked for experience
              they could only have gained by being let in. As <A href={tarang.url}>one reviewer of OpenStock</A> put it, great tools &ldquo;shouldn&apos;t
              hide behind logins or price tiers&rdquo;. Our answer is not a policy but a practice: build the tools in
              the open, <Cite n={2} note={NOTES[2]}>free</Cite>, and let anyone who shows up help.
            </p>
            <blockquote className="my-8 border-l-2 border-(--accent) py-1 pl-5 text-left indent-0 sm:pl-6">
              <p className="text-[19px] leading-[1.5] text-(--fg)">Knowledge isn&apos;t just code: it&apos;s conversation, collaboration, and connection.</p>
              <footer className="t-mono mt-2 text-[12px] text-(--fg-muted)">
                <span className="sign text-[16px] text-(--fg)">{signers[0].name}</span>, {roleLabel(signers[0].role).toLowerCase()}, 2024
              </footer>
            </blockquote>

            <H2 n={2} id="principles">
              What we believe
            </H2>
            <p>We work by four principles. Each is one sentence, followed by how it shows up in practice.</p>
            <div className="mt-6 space-y-6 indent-0">
              {rules.map((r, i) => (
                <div key={r.title} className="border-l border-(--line) pl-5 text-left">
                  <p>
                    <span className="font-[650]">{r.title}.</span> {r.body}
                  </p>
                  <p className="mt-1.5 text-[15px] leading-[1.6] text-(--fg-muted)">
                    <span className="font-mono text-[13px] text-(--fg)">In practice:</span>{" "}
                    {
                      [
                        <>
                          All {tools.length} projects are <A href="https://github.com/Open-Dev-Society">public repositories</A>; the
                          decisions happen in their issues and pull requests.
                        </>,
                        <>
                          The whole onboarding is <A href="/contribute">one page</A>: fork, branch, <Cite n={3} note={NOTES[3]}>pull request</Cite>.
                        </>,
                        <>
                          The last commit landed {ago(lastPush, now)}{latest && <>, to {latest}</>}.
                        </>,
                        <>Ask anything in the <A href={social.discord.href}>Discord</A>; someone who learned it last month will answer.</>,
                      ][i]
                    }
                  </p>
                </div>
              ))}
            </div>

            <H2 n={3} id="method">
              What we build
            </H2>
            <p>
              We work the way the pattern below grows: a few simple rules, followed by everyone, produce something nobody drew alone. For us
              that something is software. The table lists what we build; where a piece already ships, it links to the project. The rest is
              next.
            </p>

            <figure className="my-10 indent-0">
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {frames.map((src, i) => (
                  <div key={i}>
                    <div className="relative aspect-square shadow-[0_0_0_1px_var(--line)]">
                      <div
                        role="img"
                        aria-label={`Panel ${"abc"[i]}: the pattern after ${STEPS[i].toLocaleString("en")} steps`}
                        className="absolute inset-0 bg-(--accent-brand) [image-rendering:pixelated]"
                        style={{ maskImage: `url(${src})`, WebkitMaskImage: `url(${src})`, maskSize: "100% 100%", WebkitMaskSize: "100% 100%" }}
                      />
                      {i === 0 && (
                        <span
                          aria-hidden
                          className="absolute size-3 -translate-1/2 before:absolute before:top-1/2 before:left-0 before:h-px before:w-full before:bg-(--mark) after:absolute after:top-0 after:left-1/2 after:h-full after:w-px after:bg-(--mark)"
                          style={{ left: `${(SEED[0] / (N - 1)) * 100}%`, top: `${(SEED[1] / (N - 1)) * 100}%` }}
                        />
                      )}
                    </div>
                    <p className="t-mono mt-1.5 text-[11px] text-(--fg-muted)">
                      ({"abc"[i]}) t = {STEPS[i].toLocaleString("en")}
                    </p>
                  </div>
                ))}
              </div>
              <figcaption className="mt-4 text-left text-[14px] leading-[1.6] text-(--fg-muted) hyphens-auto">
                <span className="font-[650] text-(--fg)">One seed, one rule.</span> <Cite n={4} note={NOTES[4]}>The pattern</Cite> grows from a single point (
                <span className="text-(--mark-ink)">+</span>, a first contribution). It&apos;s a reaction–diffusion pattern, first described by
                Alan Turing in 1952 (Gray–Scott model, f = {num(REGIMES.coral[0])}, k = {num(REGIMES.coral[1])}), drawn 1-bit with an 8×8
                dither. One simple rule, followed everywhere, fills the frame.
              </figcaption>
            </figure>

            <div className="my-10 indent-0">
              <p className="t-mono text-left text-[12px] text-(--fg-muted)">
                <span className="font-sans text-[14px] font-[650] text-(--fg)">What we build</span>, and where each part stands on {DATE}.
              </p>
              <table className="mt-3 w-full border-y-2 border-(--fg) text-left text-[15px] leading-[1.45]">
                <thead className="border-b border-(--fg)">
                  <tr className="t-mono text-[12px] text-(--fg-muted)">
                    <th scope="col" className="py-2 pr-4 font-normal">
                      Area
                    </th>
                    <th scope="col" className="py-2 pr-4 font-normal max-sm:hidden">
                      Aim
                    </th>
                    <th scope="col" className="py-2 font-normal">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {table.map((r) => (
                    <tr key={r.area} className="border-b border-(--line) align-baseline last:border-0">
                      <th scope="row" className="py-2.5 pr-4 font-[650]">
                        {r.area}
                        <span className="block text-[13px] font-normal text-(--fg-muted) sm:hidden">{r.aim}</span>
                      </th>
                      <td className="py-2.5 pr-4 text-(--fg-muted) max-sm:hidden">{r.aim}</td>
                      <td className="t-mono py-2.5 text-[12px]">
                        {r.status ? (
                          r.status.map((l, i) => (
                            <Fragment key={l.href}>
                              {i > 0 && <br />}
                              <a href={l.href} className="ink-link" {...(l.href.startsWith("http") ? ext : {})}>
                                {l.label}
                              </a>
                            </Fragment>
                          ))
                        ) : (
                          <span className="text-(--fg-subtle)">planned</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <H2 n={4} id="promise">
              The promise
            </H2>
            <p>Our principles can change as we learn. These three promises cannot.</p>
            <ol className="my-8 space-y-3 border-y border-(--fg) py-6 text-left indent-0">
              {promise.map((l, i) => (
                <li key={l} className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-baseline text-[clamp(1.25rem,1rem+1vw,1.625rem)] leading-tight font-[650] tracking-[-0.015em]">
                  <span className="font-mono text-[13px] font-normal text-(--fg-muted)">({["i", "ii", "iii"][i]})</span>
                  {l}
                </li>
              ))}
            </ol>
            <p>
              We run on transparency, <Cite n={5} note={NOTES[5]}>donations</Cite> and community.
            </p>
            <div className="mt-10 grid grid-cols-1 gap-8 indent-0 sm:grid-cols-2">
              {signers.map((f) => (
                <div key={f.login} className="text-left">
                  <a href={f.html_url} {...ext} className="sign block text-[30px] leading-none text-(--fg) transition-colors duration-(--d-2) hover:text-(--accent)">
                    {f.name}
                  </a>
                  <p className="t-mono mt-2 border-t border-(--fg) pt-1.5 text-[12px] text-(--fg-muted)">
                    {f.name} · {roleLabel(f.role)} · July 2024
                  </p>
                </div>
              ))}
            </div>

            <H2 n={5} id="ownership">
              Ownership
            </H2>
            <p>
              If we ask for your contributions, we owe you an answer to the obvious question: whose is the work? Bring your project and it stays
              yours: the credit, the decisions and the right to leave. We bring contributors, visibility and public review, and we never take
              the credit. Your project. Your vision. Our community. Three questions come up every time.
            </p>
            {ownership.map((f) => (
              <p key={f.q} className="mt-2 indent-0!">
                <span className="font-[650]">{f.q}</span>{" "}
                {f.a}
              </p>
            ))}
            <p className="mt-8 indent-0">
              <LabButton href={social.discord.href} {...ext}>
                Bring it to the Discord ↗
              </LabButton>
            </p>

            <h2 className="mt-16 mb-4 text-[1.0625rem] font-[650] text-(--fg)">Thanks</h2>
            <p>
              Maintained with{" "}
              {maintainers.map((m, i) => (
                <Fragment key={m.login}>
                  {i > 0 && (i === maintainers.length - 1 ? " and " : ", ")}
                  <a href={m.html_url} {...ext} className="sign hover:text-(--accent)">
                    {m.name}
                  </a>
                </Fragment>
              ))}
              , and written in public with{" "}
              <a href="/contributors" className="ink-link">
                {people.length} contributors
              </a>
              .
            </p>
          </div>

          <section aria-labelledby="reading" className="mt-16 border-t-[3px] border-double border-(--fg) pt-6">
            <h2 id="reading" className="mb-4 text-[1.0625rem] font-[650] text-(--fg)">
              Further reading
            </h2>
            <ul className="space-y-2.5 text-[14px] leading-[1.55] text-(--fg-muted)">
              {reading.map((r) => (
                <li key={r.href}>
                  {r.by}. <span className="text-(--fg)">{r.title}.</span> {r.where}.{" "}
                  <a href={r.href} {...ext} className="t-mono text-[12px] break-all text-(--accent) hover:underline">
                    {r.href.replace(/^https:\/\/(www\.)?/, "")} ↗
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </article>
  );
}
