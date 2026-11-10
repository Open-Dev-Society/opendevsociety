import Link from "next/link";
import { featuredModules } from "@/data/projects";
import { manualContributors } from "@/data/contributors";
import { partners, events } from "@/data/partners";
import { mentions } from "@/data/mentions";

const GITHUB = "https://github.com/Open-Dev-Society";
const DISCORD = "https://discord.gg/9xywA3pj";
const EMAIL = "mailto:opendevsociety@gmail.com";
const FIRST_ISSUES = `https://github.com/search?q=${encodeURIComponent('org:Open-Dev-Society label:"good first issue" state:open')}&type=issues`;

const NAV = [
  { href: "#manifesto", label: "Manifesto" },
  { href: "#work", label: "Work" },
  { href: "#people", label: "People" },
  { href: "#proof", label: "Proof" },
];

// Mission list and promises from /manifesto, roles from /contribute.
const ARTICLES = [
  "Tools without subscription barriers.",
  "Knowledge platforms free forever.",
  "Education without paywalls.",
  "Guidance, not judgment.",
  "Resources running on trust.",
  "Events that connect and inspire.",
];
const NUMERALS = ["I", "II", "III", "IV", "V", "VI"];
const PROMISES = ["lock knowledge.", "charge for access.", "trade trust for money."];
const ROLES = ["developers", "writers", "educators", "designers", "organizers", "translators"];

// Only the projects the current site actually describes get a dek; the rest show their tags.
const DEKS: Record<string, string> = {
  OpenStock: "Real-time prices, personalised alerts and company insights. A market terminal for students and indie devs, with no login wall and no price tier.",
  openreadme: "Bento-style GitHub profile banners with live stats that keep themselves up to date.",
  booktrace: "A gateway to free books, and the first shelf of the OpenDev Library.",
};

const repoUrl = (name: string) => `${GITHUB}/${name}`;
const unquote = (s: string) => s.replace(/^["“]|["”]$/g, "");

const [lead, ...rest] = featuredModules;
const features = rest.filter((m) => DEKS[m.name]);
const index = rest.filter((m) => !DEKS[m.name]);

const pullQuote = mentions.find((m) => m.author.includes("brightcoding"));
const leadHeadline = mentions.find((m) => m.author.includes("AI Empire"));
const quotes = mentions.filter((m) => m.highlight && m !== pullQuote).slice(0, 3);
const articleCount = mentions.filter((m) => m.source === "article").length;

function Folio({ n, title, href, cta }: { n: string; title: string; href?: string; cta?: string }) {
  return (
    <div className="mono flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-(--rule) pt-3 text-[11px] uppercase tracking-[0.14em]">
      <span className="text-(--signal)">§ {n}</span>
      <span>{title}</span>
      {href && (
        <Link href={href} className="ml-auto text-(--muted) transition-colors hover:text-(--ink)">
          {cta} →
        </Link>
      )}
    </div>
  );
}

export default function ConceptB() {
  return (
    <>
      {/* Masthead + IA */}
      <header className="sticky top-0 z-20 border-b border-(--rule) bg-(--paper)/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 py-3 md:px-8">
          <Link href="/concepts/b" className="flex items-center gap-2 font-semibold tracking-tight">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="" width={22} height={22} className="size-[22px]" />
            <span className="hidden sm:inline">Open Dev Society</span>
                      </Link>
          <nav aria-label="Sections" className="ml-auto flex items-center text-[13px] sm:text-sm md:gap-2">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="rounded-full px-1.5 py-2 text-(--muted) sm:px-2 transition-colors hover:text-(--ink) md:px-3">
                {item.label}
              </a>
            ))}
            <a href="#join" className="ml-1 rounded-full bg-(--ink) px-3 py-2 sm:px-3.5 font-medium text-(--paper) transition-[background-color,scale] hover:bg-(--signal) active:scale-[0.96]">
              Join
            </a>
          </nav>
        </div>
      </header>

      <main>
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        {/* Hero: the manifesto's core belief, set as the headline */}
        <section className="pb-16 pt-10 md:pb-24 md:pt-16">
          <div className="mono mb-8 flex flex-wrap justify-between gap-2 text-[11px] uppercase tracking-[0.14em] text-(--muted) md:mb-12">
            <span>A manifesto, published in the open</span>
            <span>Est. 2024 · Global collective</span>
          </div>
          <h1 className="text-[12vw] font-extrabold leading-[0.88] tracking-[-0.045em] md:text-[10.5vw] xl:text-[9.5rem]">
            <span className="rise block">Technology</span>
            <span className="rise block [animation-delay:90ms]">should belong</span>
            <span className="rise block [animation-delay:180ms]">
              to <span className="serif italic tracking-[-0.02em] text-(--signal)">everyone.</span>
            </span>
          </h1>

          <div className="rise mt-10 grid gap-8 [animation-delay:320ms] md:mt-16 md:grid-cols-12">
            <p className="text-xl leading-snug md:col-span-6 md:text-2xl">
              Open Dev Society builds free, open-source tools, knowledge and community.{" "}
              <span className="text-(--muted)">No paywalls. No gatekeeping. Just code, and the people who write it.</span>
            </p>
            <div className="flex flex-wrap items-start gap-3 md:col-span-5 md:col-start-8 md:justify-end">
              <a href="#join" className="rounded-full bg-(--ink) px-5 py-3 font-medium text-(--paper) transition-[background-color,scale] hover:bg-(--signal) active:scale-[0.96]">
                Join the society
              </a>
              <a href="#manifesto" className="rounded-full px-5 py-3 font-medium shadow-[inset_0_0_0_1px_var(--ink)] transition-[background-color,scale] hover:bg-(--ink)/5 active:scale-[0.96]">
                Read the principles
              </a>
            </div>
          </div>

          <dl className="mt-14 grid grid-cols-3 border-t border-(--rule) md:mt-20">
            {[
              [featuredModules.length, "projects in public"],
              [manualContributors.length, "core maintainers"],
              [mentions.length, "mentions in the wild"],
            ].map(([value, label], i) => (
              <div key={label} className={`flex flex-col pt-4 ${i > 0 ? "border-l border-(--rule) pl-3 md:pl-6" : ""}`}>
                <dt className="mono order-2 text-[10px] uppercase tracking-[0.14em] text-(--muted) md:text-[11px]">{label}</dt>
                <dd className="serif text-5xl tabular-nums md:text-7xl">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Manifesto, distilled */}
        <section id="manifesto" className="pb-20 md:pb-28">
          <Folio n="01" title="The principles" href="/manifesto" cta="Full manifesto" />
          <div className="grid gap-10 pt-10 md:grid-cols-12 md:pt-14">
            <p className="mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-(--muted) md:col-span-3">
              From the manifesto
              <br />
              by Ravi Pratap Singh
            </p>
            <blockquote className="serif text-[2rem] leading-[1.05] tracking-[-0.01em] md:col-span-9 md:text-[3.6rem]">
              “We live in a world where knowledge is hidden behind paywalls. Where tools are locked in subscriptions. Where newcomers are told they’re not{" "}
              <em>good enough</em>.” <span className="text-(--signal)">We believe there’s a better way.</span>
            </blockquote>
          </div>

          <ol className="mt-14 grid border-t border-(--rule) sm:grid-cols-2 md:mt-20 lg:grid-cols-3">
            {ARTICLES.map((text, i) => (
              <li key={text} className="flex gap-4 border-b border-(--rule)/25 py-6 sm:pr-6 lg:[&:nth-child(n+4)]:border-b-0">
                <span className="serif w-8 shrink-0 text-xl italic text-(--signal)">{NUMERALS[i]}.</span>
                <span className="text-xl font-medium leading-tight tracking-[-0.01em] md:text-2xl">{text}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* The promise: one inverted spread for rhythm */}
      <section aria-label="The promise" className="bg-(--ink) text-(--paper)">
        <div className="mx-auto max-w-[1400px] px-4 py-20 md:px-8 md:py-28">
          <p className="mono mb-10 text-[11px] uppercase tracking-[0.14em] text-(--paper)/60">The promise</p>
          <ul className="space-y-2 md:space-y-1">
            {PROMISES.map((p) => (
              <li key={p} className="text-[8.6vw] font-extrabold leading-[0.95] tracking-[-0.04em] md:text-[6.4vw] xl:text-[6rem]">
                <span className="text-(--paper)/40">We will never </span>
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-14 grid gap-8 border-t border-(--paper)/25 pt-8 md:grid-cols-12">
            <p className="text-lg text-(--paper)/70 md:col-span-4">Running on transparency, donations, and community strength.</p>
            <div className="md:col-span-4">
              <h3 className="font-semibold">Ownership stays with you.</h3>
              <p className="mt-2 text-(--paper)/70">You keep full credit and decision-making power. Leave any time and take your project with you: no lock-in.</p>
            </div>
            <div className="md:col-span-4">
              <h3 className="font-semibold">Platform, not gatekeeper.</h3>
              <p className="mt-2 text-(--paper)/70">We bring contributors, visibility and support, and amplify the impact without taking the credit.</p>
            </div>
          </div>
          <p className="serif mt-14 text-3xl italic md:text-5xl">Your project. Your vision. Our community. Our support.</p>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        {/* The work, laid out as features */}
        <section id="work" className="py-20 md:py-28">
          <Folio n="02" title="The work" href="/projects" cta="All projects" />

          <article className="grid gap-8 pt-10 md:grid-cols-12 md:pt-14">
            <div className="md:col-span-7">
              <p className="mono text-[11px] uppercase tracking-[0.14em] text-(--signal)">Cover story · {lead.tags.join(" / ")}</p>
              <h2 className="mt-4 text-[17vw] font-extrabold leading-[0.85] tracking-[-0.05em] md:text-[9vw] xl:text-[8.5rem]">{lead.name}</h2>
              <p className="mt-6 max-w-xl text-xl leading-snug">{DEKS[lead.name]}</p>
              <a href={repoUrl(lead.name)} target="_blank" rel="noopener noreferrer" className="group mt-6 inline-flex items-center gap-2 py-2 font-medium">
                Read the source <span className="transition-transform group-hover:translate-x-1">↗</span>
              </a>
            </div>
            {leadHeadline && (
              <figure className="self-end border-t border-(--rule) pt-5 md:col-span-4 md:col-start-9">
                <blockquote className="serif text-3xl leading-[1.05] md:text-4xl">
                  “{leadHeadline.title.replace(/^OpenStock:\s*/, "")}.”
                </blockquote>
                <figcaption className="mono mt-4 text-[11px] uppercase tracking-[0.14em] text-(--muted)">{leadHeadline.author}</figcaption>
              </figure>
            )}
          </article>

          <div className="mt-16 grid gap-px bg-(--rule) md:grid-cols-2">
            {features.map((m) => (
              <a key={m.name} href={repoUrl(m.name)} target="_blank" rel="noopener noreferrer" className="group bg-(--paper) py-8 transition-colors md:p-8 md:first:pl-0">
                <p className="mono text-[11px] uppercase tracking-[0.14em] text-(--muted)">Feature · {m.tags.join(" / ")}</p>
                <h3 className="mt-3 text-5xl font-extrabold tracking-[-0.04em] md:text-6xl">
                  {m.name} <span className="inline-block text-3xl text-(--signal) transition-transform group-hover:-translate-y-1 group-hover:translate-x-1">↗</span>
                </h3>
                <p className="mt-4 max-w-md text-lg text-(--muted)">{DEKS[m.name]}</p>
              </a>
            ))}
          </div>

          <div className="mt-16">
            <p className="mono mb-2 text-[11px] uppercase tracking-[0.14em] text-(--muted)">Also in this issue</p>
            <ul className="border-t border-(--rule)">
              {index.map((m, i) => (
                <li key={m.name} className="border-b border-(--rule)/25">
                  <a href={repoUrl(m.name)} target="_blank" rel="noopener noreferrer" className="group flex items-baseline gap-4 py-4 transition-colors hover:text-(--signal) md:gap-8">
                    <span className="mono w-6 text-xs tabular-nums text-(--muted)">{String(i + 4).padStart(2, "0")}</span>
                    <span className="text-3xl font-bold tracking-[-0.03em] md:text-5xl">{m.name}</span>
                    <span className="mono ml-auto hidden text-[11px] uppercase tracking-[0.14em] text-(--muted) sm:inline">{m.tags.join(" / ")}</span>
                    <span className="transition-transform group-hover:translate-x-1">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* People, as a masthead */}
        <section id="people" className="pb-20 md:pb-28">
          <Folio n="03" title="The masthead" href="/contributors" cta="Every contributor" />
          <div className="grid gap-10 pt-10 md:grid-cols-12 md:pt-14">
            <h2 className="text-5xl font-extrabold leading-[0.92] tracking-[-0.04em] md:col-span-5 md:text-7xl">
              Code is the currency. <span className="serif font-normal italic tracking-[-0.01em] text-(--signal)">Trust is the network.</span>
            </h2>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:col-span-7 md:grid-cols-4">
              {manualContributors.map((p) => (
                <li key={p.login}>
                  <a href={p.html_url} target="_blank" rel="noopener noreferrer" className="group block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.avatar_url}
                      alt={p.name ?? p.login}
                      width={320}
                      height={400}
                      loading="lazy"
                      className="aspect-[4/5] w-full object-cover outline outline-1 -outline-offset-1 outline-black/10 grayscale transition-[filter] duration-300 group-hover:grayscale-0"
                    />
                    <p className="serif mt-3 text-2xl leading-none">{p.name}</p>
                    <p className="mono mt-2 text-[10px] uppercase tracking-[0.14em] text-(--muted)">{p.role}</p>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Social proof: press + partners */}
        <section id="proof" className="pb-20 md:pb-28">
          <Folio n="04" title="Word of mouth" href="/word-of-mouth" cta={`All ${mentions.length} mentions`} />
          {pullQuote?.highlight && (
            <figure className="pt-10 md:pt-14">
              <blockquote className="serif max-w-[22ch] text-[2.4rem] leading-[1.02] tracking-[-0.01em] md:text-[5rem]">
                “{unquote(pullQuote.highlight).replace(" - ", " — ")}”
              </blockquote>
              <figcaption className="mono mt-6 text-[11px] uppercase tracking-[0.14em] text-(--muted)">— {pullQuote.author}</figcaption>
            </figure>
          )}

          <div className="mt-16 grid gap-8 border-t border-(--rule) pt-8 md:grid-cols-3">
            {quotes.map((m) => (
              <figure key={m.url}>
                <blockquote className="text-lg leading-snug">“{unquote(m.highlight!)}”</blockquote>
                <figcaption className="mono mt-3 text-[10px] uppercase tracking-[0.14em] text-(--muted)">
                  <a href={m.url} target="_blank" rel="noopener noreferrer" className="hover:text-(--ink)">
                    {m.author} ↗
                  </a>
                </figcaption>
              </figure>
            ))}
          </div>

          <p className="mt-12 text-lg leading-relaxed text-(--muted)">
            <span className="text-(--ink)">Also seen in </span>
            {articleCount} articles, threads, Reddit and GitHub lists, by{" "}
            {mentions.map((m, i) => (
              <span key={m.url + i}>
                <a href={m.url} target="_blank" rel="noopener noreferrer" className="underline decoration-(--rule)/25 underline-offset-4 transition-colors hover:text-(--ink) hover:decoration-(--signal)">
                  {m.author.replace(/ (at|via) .*/, "")}
                </a>
                {i < mentions.length - 1 ? ", " : "."}
              </span>
            ))}
          </p>

          <div className="mt-20 grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <Folio n="04" title="Partners & events" href="/partners" cta="Partner with us" />
              <p className="mt-6 text-xl leading-snug">The infrastructure and communities that back free software alongside us.</p>
            </div>
            <ul className="grid gap-px bg-(--rule)/25 sm:grid-cols-3 md:col-span-8">
              {partners.map((p) => (
                <li key={p.name} className="bg-(--paper) sm:px-5 sm:first:pl-0">
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="group block py-6">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.logo} alt={p.name} className={`h-8 w-auto max-w-[160px] object-contain object-left ${p.invertLogo ? "invert" : ""}`} />
                    <p className="mt-4 text-sm text-(--muted) transition-colors group-hover:text-(--ink)">{p.description}</p>
                  </a>
                </li>
              ))}
              {events.map((e) => (
                <li key={e.name} className="bg-(--paper) py-6 sm:px-5 sm:first:pl-0 sm:[&:nth-child(4)]:pl-0">
                  <p className="mono text-[10px] uppercase tracking-[0.14em] text-(--signal)">{e.role} · {e.date}</p>
                  <p className="mt-2 font-semibold">{e.name}</p>
                  <p className="text-sm text-(--muted)">{e.organizer}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* One clear path in */}
      <section id="join" className="border-t border-(--rule) bg-(--signal) text-(--ink)">
        <div className="mx-auto max-w-[1400px] px-4 py-20 md:px-8 md:py-28">
          <p className="mono text-[11px] uppercase tracking-[0.14em]">§ 05 · Join</p>
          <h2 className="mt-6 text-[15vw] font-extrabold leading-[0.85] tracking-[-0.05em] md:text-[11vw] xl:text-[10rem]">
            You belong <span className="serif font-normal italic tracking-[-0.02em]">here.</span>
          </h2>
          <p className="mt-8 max-w-2xl text-xl leading-snug md:text-2xl">
            If you’ve ever felt you didn’t belong, or struggled to find free resources: build with us. We need {ROLES.slice(0, -1).join(", ")} and {ROLES.at(-1)}.
          </p>

          <ol className="mt-14 grid border-t border-(--ink) md:grid-cols-4">
            {[
              ["Pick a project", "OpenStock, OpenReadme, BookTrace and more, all on GitHub."],
              ["Say hello", "Join the Discord, or write to opendevsociety@gmail.com."],
              ["Find a task", "Look for good first issue, help wanted or documentation."],
              ["Ship it", "Open a pull request. Credit stays with you."],
            ].map(([title, body], i) => (
              <li key={title} className={`border-b border-(--ink)/30 py-6 md:border-b-0 md:pr-6 ${i > 0 ? "md:border-l md:border-(--ink)/30 md:pl-6" : ""}`}>
                <span className="serif text-4xl italic">{i + 1}</span>
                <p className="mt-3 text-xl font-semibold">{title}</p>
                <p className="mt-1">{body}</p>
              </li>
            ))}
          </ol>

          <div className="mt-12 flex flex-wrap items-center gap-3">
            <a href={FIRST_ISSUES} target="_blank" rel="noopener noreferrer" className="rounded-full bg-(--ink) px-6 py-3.5 font-medium text-(--paper) transition-[background-color,color,scale] hover:bg-(--paper) hover:text-(--ink) active:scale-[0.96]">
              Find a good first issue ↗
            </a>
            <a href={DISCORD} target="_blank" rel="noopener noreferrer" className="rounded-full px-6 py-3.5 font-medium shadow-[inset_0_0_0_1.5px_var(--ink)] transition-[background-color,scale] hover:bg-(--ink)/10 active:scale-[0.96]">
              Join the Discord ↗
            </a>
            <Link href="/contribute" className="px-2 py-3.5 font-medium underline underline-offset-4">
              Contribution guidelines
            </Link>
          </div>
        </div>
      </section>

      </main>

      <footer className="bg-(--ink) text-(--paper)">
        <div className="mx-auto max-w-[1400px] px-4 pb-10 pt-16 md:px-8">
          <div className="grid gap-10 sm:grid-cols-3 md:grid-cols-12">
            {[
              { title: "Read", links: [["Manifesto", "/manifesto"], ["Projects", "/projects"], ["Contributors", "/contributors"], ["Word of mouth", "/word-of-mouth"]] },
              { title: "Join", links: [["Contribute", "/contribute"], ["GitHub", GITHUB], ["Discord", DISCORD], ["LinkedIn", "https://www.linkedin.com/company/opendevsociety-in/"], ["X / Twitter", "https://x.com/opendevsociety"]] },
              { title: "Partner", links: [["For brands", "/partners#partner-cta"], ["For communities", "/partners#partner-cta"], ["Email us", `${EMAIL}?subject=Partnership Inquiry`]] },
            ].map((col) => (
              <div key={col.title} className="md:col-span-2">
                <p className="mono mb-4 text-[11px] uppercase tracking-[0.14em] text-(--paper)/50">{col.title}</p>
                <ul className="space-y-1">
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      <a href={href} className="inline-block py-1 text-(--paper)/80 transition-colors hover:text-(--signal)">{label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <p className="serif text-2xl italic leading-tight text-(--paper)/80 md:col-span-4 md:col-start-9">
              Free forever. We will never lock knowledge, charge for access, or trade trust for money.
            </p>
          </div>
          <p className="mt-16 text-[17.5vw] font-extrabold leading-[0.8] tracking-[-0.055em] md:text-[15vw] xl:text-[13.5rem]" aria-hidden>
            Open Dev
            <br />
            <span className="serif font-normal italic tracking-[-0.03em] text-(--signal)">Society.</span>
          </p>
          <div className="mono mt-10 flex flex-wrap justify-between gap-2 border-t border-(--paper)/20 pt-4 text-[10px] uppercase tracking-[0.14em] text-(--paper)/50">
            <span>Set in Inter Tight &amp; Instrument Serif</span>
            <span>Concept B · Editorial manifesto</span>
          </div>
        </div>
      </footer>
    </>
  );
}
