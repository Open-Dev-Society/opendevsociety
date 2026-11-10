import type { Metadata } from "next";
import { Fragment } from "react";
import { LabButton } from "@/components/site/lab-hero/LabButton";
import { REGIMES } from "@/components/site/lab-hero/field";
import { contactEmail, social } from "@/content";
import { manualContributors } from "@/data/contributors";
import { mentions } from "@/data/mentions";
import { ago } from "@/lib/format";
import { expHref, expId } from "@/lib/lab";
import { getWorkshop } from "@/lib/workshop";
import { CopyButton } from "./CopyButton";
import { figureFrames, N, SEED, STEPS } from "./figure";

export const revalidate = 3600;

const ID = "ODS-WP-001";
const VERSION = "3";
const DATE = "10 Nov 2026";
const TITLE = "Technology Should Belong to Everyone";
const PAPER_URL = "https://opendevsociety.vercel.app/manifesto";

const founders = manualContributors.filter((c) => c.role && /Founder/i.test(c.role)); // Founder first, then Co-Founder
const maintainers = manualContributors.filter((c) => c.role && /Maintainer/i.test(c.role));
const role = (r?: string) => (r && /Co-Founder/i.test(r) ? "Co-founder" : "Founder");

export const metadata: Metadata = {
  title: `${ID}: ${TITLE} · Open Dev Society`,
  description:
    "Working paper ODS-WP-001: why Open Dev Society builds free, open-source tools in public. Four rules, what we build, the promise, and who owns what.",
  // Highwire tags, the ones Google Scholar reads from a paper's landing page.
  other: {
    citation_title: TITLE,
    citation_author: founders.map((f) => f.name!),
    citation_publication_date: "2026/11/10",
    citation_technical_report_institution: "Open Dev Society Lab",
    citation_technical_report_number: ID,
  },
};

const repoUrl = (name: string) => `https://github.com/Open-Dev-Society/${name}`;
const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

const rules = [
  { title: "Default to open", body: "Every line of code and every decision is public." },
  { title: "No permission needed", body: "No interviews. Fork it and send the PR." },
  { title: "Ship, then improve", body: "Release early and fix it in the open." },
  { title: "Lift each other", body: "Everyone teaches, everyone learns." },
];
const promise = ["We will never lock knowledge.", "We will never charge for access.", "We will never trade trust for money."];
const ownership = [
  { q: "Can I show the project as my own work?", a: "Yes. You keep full credit. We support your growth, we don't claim it." },
  { q: "Do I lose ownership?", a: "No. ODS is a platform, not a company claiming your IP." },
  { q: "Can I take my project back?", a: "Any time. There's no lock-in." },
];

const tarang = mentions.find((m) => m.author.startsWith("Tattva Tarang"))!;

// The reference list, in order of first citation. `cite("turing")` prints [5] linked to it.
const refs = {
  org: { by: "Open Dev Society", title: "Experiments: source code and history", where: "GitHub, 2024–2026", href: "https://github.com/Open-Dev-Society" },
  openstock: { by: "Open Dev Society", title: "OpenStock: market prices, alerts and company data. Free", where: "GitHub, 2025–2026", href: repoUrl("OpenStock") },
  agpl: { by: "Free Software Foundation", title: "GNU Affero General Public License, version 3", where: "19 Nov 2007", href: "https://www.gnu.org/licenses/agpl-3.0.html" },
  tarang: { by: "T. Tarang", title: "OpenStock: the free, open-source stock market app built for everyone", where: "Coding Nexus (Medium), 2025", href: tarang.url },
  protocol: { by: "Open Dev Society", title: "Protocol 01: First contribution", where: "Lab protocol", href: "/contribute" },
  turing: { by: "A. M. Turing", title: "The chemical basis of morphogenesis", where: "Phil. Trans. R. Soc. Lond. B 237 (641): 37–72, 1952", href: "https://doi.org/10.1098/rstb.1952.0012" },
  pearson: { by: "J. E. Pearson", title: "Complex patterns in a simple system", where: "Science 261 (5118): 189–192, 1993", href: "https://doi.org/10.1126/science.261.5118.189" },
  bayer: { by: "B. E. Bayer", title: "An optimum method for two-level rendition of continuous-tone pictures", where: "IEEE International Conference on Communications, 1973", href: "https://en.wikipedia.org/wiki/Ordered_dithering" },
  citations: { by: "Open Dev Society", title: `Citations: every mention so far (${mentions.length})`, where: "Bibliography", href: "/word-of-mouth" },
} as const;
type RefKey = keyof typeof refs;
const order = Object.keys(refs) as RefKey[];

function Cite({ k }: { k: RefKey[] }) {
  return (
    <span className="whitespace-nowrap">
      [
      {k.map((key, i) => (
        <Fragment key={key}>
          {i > 0 && ", "}
          <a href={`#ref-${key}`} className="text-(--accent) hover:underline">
            {order.indexOf(key) + 1}
          </a>
        </Fragment>
      ))}
      ]
    </span>
  );
}

// The footnotes, numbered in reading order.
const NOTES: Record<number, React.ReactNode> = {
  1: <>Founded July 2024. Everything it makes lives at github.com/Open-Dev-Society <Cite k={["org"]} />.</>,
  2: <>Free to use and free to fork. OpenStock, for one, is under the GNU AGPL v3.0 <Cite k={["agpl"]} />, so a copy served to others must stay open too.</>,
  3: <>There is no application form. The first pull request is the application.</>,
  4: <>The same reaction runs live at the top of the home page, seeded by the letters of its headline.</>,
  5: <>Partners and what they back are listed in full under Funding &amp; acknowledgements, on the Citations page <Cite k={["citations"]} />.</>,
  6: <>Every licence we use grants the right to fork. Leaving costs one <span className="whitespace-nowrap">git remote set-url</span>.</>,
};

// Footnotes: a superscript in the text; the note sits in the right margin on desktop, and at the foot of its section below that.
const S = "font-mono text-[0.68em] leading-none align-super";
function Note({ n }: { n: number }) {
  return (
    <>
      <sup id={`fnref-${n}`} className={S}>
        <a href={`#fn-${n}`} aria-label={`Note ${n}`} className="px-px text-(--accent) hover:underline">
          {n}
        </a>
      </sup>
      <span className="float-right clear-right -mr-[15.5rem] mb-4 hidden w-52 text-left indent-0 font-mono text-[12px] leading-[1.55] text-(--fg-muted) [hyphens:manual] lg:block">
        <span className="text-(--fg)">{n}</span>&ensp;{NOTES[n]}
      </span>
    </>
  );
}
function Notes({ ns }: { ns: number[] }) {
  return (
    <ol className="mt-6 space-y-2 border-t border-(--line) pt-4 font-mono text-[12px] leading-[1.55] text-(--fg-muted) lg:hidden">
      {ns.map((n) => (
        <li key={n} id={`fn-${n}`} className="grid scroll-mt-24 grid-cols-[1.5rem_minmax(0,1fr)]">
          <a href={`#fnref-${n}`} aria-label={`Back to note ${n}`} className="text-(--fg)">
            {n}
          </a>
          <span>{NOTES[n]}</span>
        </li>
      ))}
    </ol>
  );
}

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
  const tool = (n: string) => (tools.some((r) => r.name === n) ? [{ label: `${expId(n, tools)} ${n}`, href: expHref(n) }] : []);
  const table: { area: string; aim: string; status: Status }[] = [
    { area: "Tools", aim: "Simple utilities, free to use.", status: [...tool("OpenStock"), ...tool("openreadme"), { label: `all ${tools.length} →`, href: "/projects" }] },
    { area: "Library", aim: "A gateway to free books.", status: tool("booktrace").length ? tool("booktrace") : null },
    { area: "Learn", aim: "Roadmaps and mentorship.", status: null },
    { area: "Education", aim: "Free courses and workshops.", status: null },
    { area: "Media", aim: "Podcasts and tutorials.", status: null },
    { area: "Events", aim: "Hackathons and conferences.", status: [{ label: "Apretre 3.0, JWOC 2026 →", href: "/word-of-mouth#partners" }] },
    { area: "News", aim: "Information without an agenda.", status: null },
    { area: "Community", aim: "A home for contributors.", status: [{ label: `${people.length} researchers →`, href: "/contributors" }] },
  ];

  const bibtex = `@techreport{${ID.toLowerCase()},
  title       = {${TITLE}},
  author      = {${founders.map((f) => f.name!.replace(/^(.*) (\S+)$/, "$2, $1")).join(" and ")}},
  institution = {Open Dev Society Lab},
  type        = {Working Paper},
  number      = {${ID}},
  note        = {Version ${VERSION}},
  year        = {2026},
  month       = nov,
  url         = {${PAPER_URL}}
}`;
  const plain = `${founders.map((f) => f.name).join(" and ")} (2026). ${TITLE}. Working Paper ${ID}, v${VERSION}. Open Dev Society Lab. ${PAPER_URL}`;

  const stamp = `${ID}v${VERSION} [cs.SE] ${DATE}`;
  const body = "text-[17px] leading-[1.7] text-(--fg) hyphens-auto sm:text-justify [&>p+p]:indent-6";

  return (
    <article className="mx-auto w-full max-w-(--container) px-(--gutter) pt-10 pb-24 lg:pt-14 lg:pb-32">
      {/* The header strip: what kind of document this is, before anything else. */}
      <header className="border-y-[3px] border-double border-(--fg) py-2.5">
        <p className="t-mono flex flex-wrap justify-between gap-x-6 gap-y-1 text-[12px] text-(--fg-muted)">
          <span>
            <span className="text-(--fg)">{ID}</span> · v{VERSION} · {DATE} · cs.SE · Open Dev Society Lab
          </span>
          <span className="max-sm:hidden">Working paper · preprint · not peer reviewed</span>
        </p>
      </header>

      <div className="mt-14 lg:grid lg:grid-cols-[minmax(0,68ch)_13rem] lg:justify-center lg:gap-x-10 xl:grid-cols-[5rem_minmax(0,68ch)_13rem]">
        {/* arXiv's grey margin stamp, turned up the left edge. */}
        <aside aria-hidden className="hidden xl:block">
          <p className="sticky top-24 font-mono text-[15px] tracking-[0.04em] whitespace-nowrap text-(--fg-subtle) [writing-mode:vertical-rl] rotate-180">
            {stamp}
          </p>
        </aside>

        <div className="min-w-0">
          {/* Title page */}
          <div className="text-center">
            <h1 className="mx-auto max-w-[14ch] text-[clamp(2.5rem,1.6rem+3.6vw,4.25rem)] leading-[0.92] font-[800] tracking-[-0.018em] text-balance text-(--fg) [font-stretch:75%]">
              {TITLE}
            </h1>
            <p className="mt-9 flex flex-wrap justify-center gap-x-8 gap-y-2 text-[22px]">
              {founders.map((f, i) => (
                <span key={f.login}>
                  <a href={f.html_url} {...ext} className="sign text-(--fg) transition-colors duration-(--d-2) hover:text-(--accent)">
                    {f.name}
                  </a>
                  <sup className={`${S} ml-0.5 text-(--fg-muted)`}>1{i === 0 && ",*"}</sup>
                </span>
              ))}
            </p>
            <p className="t-mono mt-3 text-[12px] text-(--fg-muted)">
              <sup className={S}>1</sup>Open Dev Society Lab,{" "}
              <a href={social.github.href} {...ext} className="hover:text-(--accent)">
                github.com/Open-Dev-Society
              </a>
              <br />
              <sup className={S}>*</sup>Correspondence:{" "}
              <a href={`mailto:${contactEmail}`} className="hover:text-(--accent)">
                {contactEmail}
              </a>
            </p>
            <p className="t-mono mt-5 text-[12px] text-(--fg-subtle)">First circulated July 2024 · this version {DATE}</p>
          </div>

          {/* Abstract, in a ruled box with its label set into the top rule. */}
          <section aria-labelledby="abstract" className="relative mt-12 border border-(--fg) px-5 pt-7 pb-6 sm:px-8">
            <h2 id="abstract" className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-(--bg) px-3 font-mono text-[12px] tracking-[0.2em] text-(--fg) uppercase">
              Abstract
            </h2>
            <p className="text-[16px] leading-[1.65] text-(--fg) hyphens-auto sm:text-justify">
              Knowledge is hidden behind paywalls. Tools are locked in subscriptions. Newcomers are told they&apos;re not good enough. We think
              there&apos;s a better way, and we&apos;re building it. This paper states the four rules the lab works by (§2), what it builds with
              them, {tools.length} free, open-source experiments so far by {people.length} researchers (§3), the promise that binds it (§4), and
              who owns the work (§5).
            </p>
            <p className="t-mono mt-4 text-[12px] text-(--fg-muted)">
              <span className="text-(--fg)">Keywords</span> · open source · free software · building in public · mentorship
            </p>
          </section>

          <div className={body}>
            <H2 n={1} id="introduction">
              Introduction
            </H2>
            <p>
              Open Dev Society
              <Note n={1} />{" "}
              is a lab that builds free software in public. Its premise is short: technology should belong to everyone. Not licensed to them,
              rented to them, or shown to them after a sign-up form, but theirs, to use, read, change and pass on.
            </p>
            <p>
              The obstacles are familiar. Knowledge sits behind paywalls; tools sit behind subscriptions; the newcomer is asked for experience
              they could only have gained by being let in. As one reader of our first experiment put it, great tools &ldquo;shouldn&apos;t hide
              behind logins or price tiers&rdquo; <Cite k={["tarang"]} />. The fix we propose is not a policy but a practice: build the tools in
              the open, free
              <Note n={2} />
              , and let anyone who shows up help.
            </p>
            <blockquote className="my-8 border-l-2 border-(--accent) py-1 pl-5 text-left indent-0 sm:pl-6">
              <p className="text-[19px] leading-[1.5] text-(--fg)">Knowledge isn&apos;t just code: it&apos;s conversation, collaboration, and connection.</p>
              <footer className="t-mono mt-2 text-[12px] text-(--fg-muted)">
                <span className="sign text-[16px] text-(--fg)">{founders[0]?.name}</span>, {role(founders[0]?.role).toLowerCase()}, 2024
              </footer>
            </blockquote>
            <Notes ns={[1, 2]} />

            <H2 n={2} id="principles">
              Principles
            </H2>
            <p>The lab has four rules. Each is one sentence, stated here as a proposition with the evidence that it holds.</p>
            <div className="mt-6 space-y-6 indent-0">
              {rules.map((r, i) => (
                <div key={r.title} className="border-l border-(--line) pl-5 text-left">
                  <p>
                    <span className="font-[650]">Proposition 2.{i + 1}</span> <span className="text-(--fg-muted)">({r.title}).</span> {r.body}
                  </p>
                  <p className="mt-1.5 text-[15px] leading-[1.6] text-(--fg-muted)">
                    <span className="font-mono text-[13px] text-(--fg)">Proof.</span>{" "}
                    {
                      [
                        <>
                          All {tools.length} experiments are public repositories <Cite k={["org"]} />; the decisions are their issues and pull
                          requests.
                        </>,
                        <>
                          Protocol 01 <Cite k={["protocol"]} /> is the whole of the onboarding: fork, branch, pull request.
                          <Note n={3} />
                        </>,
                        <>
                          The last commit landed {ago(lastPush, now)}{latest && <>, to {latest}</>}.
                        </>,
                        <>Left as an exercise for the reader, preferably in the Discord.</>,
                      ][i]
                    }
                    <span aria-hidden className="float-right ml-3 text-(--fg)">
                      ∎
                    </span>
                  </p>
                </div>
              ))}
            </div>
            <Notes ns={[3]} />

            <H2 n={3} id="method">
              Method
            </H2>
            <p>
              We work the way a reaction–diffusion system does: a few local rules (§2), followed by everyone, produce structure nobody drew
              (Fig. 1). In practice that structure is software. Table 1 lists what we build; where a piece already ships it carries its
              experiment number and links to its record. The rest is next.
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
                <span className="font-[650] text-(--fg)">Fig. 1.</span> EXP-000 grown from a single seed (<span className="text-(--mark-ink)">+</span>
                , a first contribution) after Turing <Cite k={["turing"]} />: the Gray–Scott model as in Pearson <Cite k={["pearson"]} />, f ={" "}
                {num(REGIMES.coral[0])}, k = {num(REGIMES.coral[1])}, shown 1-bit through a Bayer 8×8 ordered dither <Cite k={["bayer"]} />.
                One local rule, followed everywhere, fills the plate.
                <Note n={4} />
              </figcaption>
            </figure>

            <div className="my-10 indent-0">
              <p className="t-mono text-left text-[12px] text-(--fg-muted)">
                <span className="font-sans text-[14px] font-[650] text-(--fg)">Table 1.</span> What the lab builds, and its status on {DATE}.
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
            <Notes ns={[4]} />

            <H2 n={4} id="promise">
              The promise
            </H2>
            <p>The rules can change as the lab learns. These three lines cannot.</p>
            <ol className="my-8 space-y-3 border-y border-(--fg) py-6 text-left indent-0">
              {promise.map((l, i) => (
                <li key={l} className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-baseline text-[clamp(1.25rem,1rem+1vw,1.625rem)] leading-tight font-[650] tracking-[-0.015em]">
                  <span className="font-mono text-[13px] font-normal text-(--fg-muted)">({["i", "ii", "iii"][i]})</span>
                  {l}
                </li>
              ))}
            </ol>
            <p>
              The lab runs on transparency, donations and community.
              <Note n={5} />
            </p>
            <div className="mt-10 grid grid-cols-1 gap-8 indent-0 sm:grid-cols-2">
              {founders.map((f) => (
                <div key={f.login} className="text-left">
                  <a href={f.html_url} {...ext} className="sign block text-[30px] leading-none text-(--fg) transition-colors duration-(--d-2) hover:text-(--accent)">
                    {f.name}
                  </a>
                  <p className="t-mono mt-2 border-t border-(--fg) pt-1.5 text-[12px] text-(--fg-muted)">
                    {f.name} · {role(f.role)} · July 2024
                  </p>
                </div>
              ))}
            </div>
            <Notes ns={[5]} />

            <H2 n={5} id="ownership">
              Ownership
            </H2>
            <p>
              A lab that asks for contributions owes an answer to the obvious question: whose is the work? Bring your project and it stays
              yours: the credit, the decisions and the right to leave. We bring contributors, visibility and public review, and we never take
              the credit. Your project. Your vision. Our community. Three questions come up every time.
            </p>
            {ownership.map((f, i) => (
              <p key={f.q} className="mt-2 indent-0!">
                <span className="font-[650]">
                  5.{i + 1}&ensp;{f.q}
                </span>{" "}
                {f.a}
                {i === 2 && (
                  <Note n={6} />
                )}
              </p>
            ))}
            <p className="mt-8 indent-0">
              <LabButton href={social.discord.href} {...ext}>
                Bring it to the Discord ↗
              </LabButton>
            </p>
            <Notes ns={[6]} />

            <h2 className="mt-16 mb-4 text-[1.0625rem] font-[650] text-(--fg)">Acknowledgements</h2>
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
                {people.length} researchers
              </a>{" "}
              <Cite k={["org"]} />.
            </p>
          </div>

          <section aria-labelledby="references" className="mt-16">
            <h2 id="references" className="mb-4 text-[1.0625rem] font-[650] text-(--fg)">
              References
            </h2>
            <ol className="space-y-2.5 text-[14px] leading-[1.55] text-(--fg-muted)">
              {order.map((k, i) => {
                const r = refs[k];
                const out = r.href.startsWith("http");
                return (
                  <li key={k} id={`ref-${k}`} className="grid scroll-mt-24 grid-cols-[2.25rem_minmax(0,1fr)] target:bg-(--accent-soft)">
                    <span className="font-mono text-[12px] leading-[1.9] text-(--fg)">[{i + 1}]</span>
                    <span>
                      {r.by}. <span className="text-(--fg)">{r.title}.</span> {r.where}.{" "}
                      <a href={r.href} className="t-mono text-[12px] break-all text-(--accent) hover:underline" {...(out ? ext : {})}>
                        {r.href.replace(/^https:\/\/(www\.)?/, "")}
                        {out ? " ↗" : " →"}
                      </a>
                    </span>
                  </li>
                );
              })}
            </ol>
          </section>

          {/* Cite this paper */}
          <section aria-labelledby="cite" className="mt-16 border-t-[3px] border-double border-(--fg) pt-6">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 id="cite" className="text-[1.0625rem] font-[650] text-(--fg)">
                Cite this paper
              </h2>
              <CopyButton text={bibtex} label="Copy BibTeX" />
            </div>
            <p className="mt-4 text-[14px] leading-[1.6] text-(--fg-muted)">{plain}</p>
            <pre className="mt-4 overflow-x-auto bg-(--surface) p-4 font-mono text-[12px] leading-[1.6] text-(--fg) shadow-[0_0_0_1px_var(--line)]">
              <code>{bibtex}</code>
            </pre>
          </section>
        </div>
      </div>
    </article>
  );
}
