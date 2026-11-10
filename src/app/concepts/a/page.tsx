/* eslint-disable @next/next/no-img-element -- remote GitHub avatars and local SVG logos, no next/image config needed for a concept */
import type { Metadata } from "next";
import Link from "next/link";
import { featuredModules } from "@/data/projects";
import { manualContributors } from "@/data/contributors";
import { partners, events } from "@/data/partners";
import { mentions } from "@/data/mentions";
import { ActivityLog, KeyNav, RolePicker } from "./live";
import "./concept.css";

export const metadata: Metadata = {
  title: "Open Dev Society — Concept A",
  description: "Redesign concept: the society presented as a running process.",
};

const SECTIONS = [
  { id: "manifesto", label: "manifesto", href: "/manifesto" },
  { id: "projects", label: "projects", href: "/projects" },
  { id: "people", label: "people", href: "/contributors" },
  { id: "proof", label: "proof", href: "/word-of-mouth" },
  { id: "join", label: "join", href: "/contribute" },
];

const PRINCIPLES = [
  ["default_to_open", "All code is open-source. All knowledge is public. Transparency is the only way to build trust at scale."],
  ["permissionless", "No gatekeepers. No interviews. You don't need permission to fork, contribute, or start building."],
  ["rapid_iteration", "We ship fast. We solve real problems with code, not endless meetings."],
  ["distributed_strength", "We are stronger together. We mentor the next generation and lift each other up."],
];

const FOOTER: [string, [string, string][]][] = [
  ["society", [["manifesto", "/manifesto"], ["projects", "/projects"], ["contributors", "/contributors"], ["contribute", "/contribute"]]],
  ["network", [["partners", "/partners"], ["word of mouth", "/word-of-mouth"]]],
  ["elsewhere", [["github", "https://github.com/Open-Dev-Society"], ["discord", "https://discord.gg/9xywA3pj"], ["linkedin", "https://www.linkedin.com/company/opendevsociety-in/"], ["x", "https://x.com/opendevsociety"]]],
];

const PROMISES = ["lock knowledge", "charge for access", "trade trust for money"];

// Only the two modules whose purpose is documented in src/data/mentions get a one-liner.
const NOTES: Record<string, string> = {
  OpenStock: "Real-time prices, personalised alerts and company insights. No paywalls.",
  openreadme: "Bento-style GitHub profile banners with live stats.",
};

const repo = (name: string) => `https://github.com/Open-Dev-Society/${name}`;
const unquote = (s: string) => s.trim().replace(/^["“]|["”]$/g, "");
const quotes = mentions.filter((m) => m.highlight).slice(0, 4);
const press = new Set(mentions.map((m) => m.author.split(/ at | via /).pop())).size;

function SectionHead({ n, id, cmd, title, href }: { n: string; id: string; cmd: string; title: string; href: string }) {
  return (
    <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="mb-3 text-[12px] text-zinc-500">
          <span className="text-zinc-600 tabular-nums">{n}</span>
          <span className="mx-2 text-[var(--acc)]">$</span>
          {cmd}
        </p>
        <h2 id={`${id}-title`} className="font-sans text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">
          {title}
        </h2>
      </div>
      <Link href={href} className="w-fit text-[12px] text-zinc-500 underline decoration-zinc-700 underline-offset-4 transition-colors hover:text-zinc-200">
        open {href} →
      </Link>
    </header>
  );
}

export default function ConceptA() {
  const [flagship, ...rest] = featuredModules;

  return (
    <div id="top" className="a-root">
      <KeyNav ids={SECTIONS.map((s) => s.id)} />

      <nav className="sticky top-0 z-10 bg-[#09090b]/85 shadow-[inset_0_-1px_0_rgb(255_255_255/0.06)] backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 sm:px-6">
          <a href="#top" className="flex shrink-0 items-center gap-2 text-[13px] text-zinc-100">
            <img src="/logo.png" alt="" className="size-5 rounded outline outline-1 -outline-offset-1 outline-white/10" />
            ods
          </a>
          <ul className="-mx-2 flex min-w-0 flex-1 items-center gap-1 overflow-x-auto text-[12px] [scrollbar-width:none]">
            {SECTIONS.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="flex min-h-10 items-center gap-2 rounded-md px-2 text-zinc-500 transition-colors hover:text-zinc-100">
                  <span className="a-kbd max-md:hidden">{i + 1}</span>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <a href="https://github.com/Open-Dev-Society" target="_blank" rel="noreferrer" className="shrink-0 text-[12px] text-zinc-400 transition-colors hover:text-zinc-100 max-sm:hidden">
            github ↗
          </a>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero */}
        <section className="grid gap-12 pb-24 pt-16 sm:pt-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,27rem)] lg:items-end">
          <div>
            <p className="mb-8 text-[12px] text-zinc-500">
              ~/open-dev-society <span className="text-[var(--acc)]">$</span> ods status
            </p>
            <h1 className="font-sans text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.035em] text-zinc-50 sm:text-6xl">
              An open-source society, running in public.
            </h1>
            <p className="mt-6 max-w-xl font-sans text-[17px] leading-relaxed text-zinc-400">
              Developers, designers and writers building public goods. No paywalls. No gatekeeping. Just code.
            </p>
            <dl className="mt-10 grid max-w-xl grid-cols-3 gap-y-5 text-[12px] sm:grid-cols-6">
              {[
                ["state", "running"],
                ["since", "2024"],
                ["modules", featuredModules.length],
                ["operators", "1000+"],
                ["partners", partners.length],
                ["press", press],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-zinc-600">{k}</dt>
                  <dd className={`tabular-nums ${k === "state" ? "text-[var(--acc)]" : "text-zinc-200"}`}>{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-10 flex flex-wrap gap-2">
              <a href="#join" className="a-btn a-btn-primary">
                start contributing <span className="a-kbd !text-[#09090b]/60 ![box-shadow:inset_0_0_0_1px_rgb(0_0_0/0.2)]">5</span>
              </a>
              <a href="#manifesto" className="a-btn">
                read the manifesto
              </a>
            </div>
          </div>
          <ActivityLog />
        </section>

        {/* 01 Manifesto */}
        <section id="manifesto" aria-labelledby="manifesto-title" className="scroll-mt-20 py-20 shadow-[0_-1px_0_rgb(255_255_255/0.06)]">
          <SectionHead n="01" id="manifesto" cmd="cat MANIFESTO.md" title="Four constants. Three promises." href="/manifesto" />
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <ol className="divide-y divide-white/[0.06]">
              {PRINCIPLES.map(([key, text], i) => (
                <li key={key} className="grid gap-2 py-5 first:pt-0 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-6">
                  <span className="text-[13px] text-zinc-200">
                    <span className="mr-3 text-zinc-600 tabular-nums">0{i + 1}</span>
                    {key}
                  </span>
                  <p className="font-sans text-[15px] leading-relaxed text-zinc-400">{text}</p>
                </li>
              ))}
            </ol>
            <aside className="space-y-8 text-[13px]">
              <div>
                <p className="mb-3 text-zinc-600">// we will never</p>
                <ul className="space-y-1.5">
                  {PROMISES.map((p) => (
                    <li key={p} className="text-zinc-300">
                      <span className="mr-2 text-[var(--acc)]">✕</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-3 text-zinc-600">// platform, not gatekeeper</p>
                <p className="font-sans text-[14px] leading-relaxed text-zinc-400">
                  You keep full credit and ownership of your work. Leave any time and take your project with you: no lock-in.
                </p>
              </div>
            </aside>
          </div>
        </section>

        {/* 02 Projects */}
        <section id="projects" aria-labelledby="projects-title" className="scroll-mt-20 py-20 shadow-[0_-1px_0_rgb(255_255_255/0.06)]">
          <SectionHead n="02" id="projects" cmd="ls modules/" title="Software released as public goods." href="/projects" />
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <a
              href={repo(flagship.name)}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col justify-between gap-10 rounded-xl bg-white/[0.03] p-6 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.08)] transition-colors hover:bg-white/[0.05]"
            >
              <div>
                <p className="mb-6 flex flex-wrap gap-x-3 text-[12px] text-zinc-500">
                  <span className="text-[var(--acc)]">● flagship</span>
                  {flagship.tags.slice(1).map((t) => (
                    <span key={t}>{t.toLowerCase()}</span>
                  ))}
                </p>
                <h3 className="font-sans text-3xl font-semibold tracking-tight text-zinc-50">{flagship.name}</h3>
                <p className="mt-3 max-w-md font-sans text-[15px] leading-relaxed text-zinc-400">{NOTES[flagship.name]}</p>
              </div>
              {quotes[0] && (
                <figure className="text-[13px]">
                  <blockquote className="font-sans leading-relaxed text-zinc-300">“{unquote(quotes[0].highlight!)}”</blockquote>
                  <figcaption className="mt-2 text-zinc-600">— {quotes[0].author}</figcaption>
                </figure>
              )}
              <span className="text-[12px] text-zinc-500 transition-colors group-hover:text-zinc-200">Open-Dev-Society/{flagship.name} ↗</span>
            </a>
            <ul className="divide-y divide-white/[0.06] rounded-xl shadow-[inset_0_0_0_1px_rgb(255_255_255/0.08)]">
              {rest.map((m) => (
                <li key={m.name}>
                  <a href={repo(m.name)} target="_blank" rel="noreferrer" className="group flex min-h-14 items-center gap-4 px-5 py-3 transition-colors hover:bg-white/[0.03]">
                    <span className="w-28 shrink-0 text-[13px] text-zinc-200">{m.name}</span>
                    <span className="min-w-0 flex-1 truncate text-[12px] text-zinc-500">
                      {NOTES[m.name] ?? m.tags.join(" · ").toLowerCase()}
                    </span>
                    <span className="text-zinc-600 transition-colors group-hover:text-zinc-200">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 03 People */}
        <section id="people" aria-labelledby="people-title" className="scroll-mt-20 py-20 shadow-[0_-1px_0_rgb(255_255_255/0.06)]">
          <SectionHead n="03" id="people" cmd="who --core" title="Code is the currency. Trust is the network." href="/contributors" />
          <ul className="grid gap-px overflow-hidden rounded-xl bg-white/[0.06] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.06)] sm:grid-cols-2 lg:grid-cols-4">
            {manualContributors.map((c) => (
              <li key={c.login} className="bg-[#09090b]">
                <a href={c.html_url} target="_blank" rel="noreferrer" className="flex h-full items-center gap-4 p-5 transition-colors hover:bg-white/[0.03]">
                  <img src={c.avatar_url} alt="" width={44} height={44} className="size-11 shrink-0 rounded-full outline outline-1 -outline-offset-1 outline-white/10" />
                  <span className="min-w-0">
                    <span className="block truncate font-sans text-[15px] font-medium text-zinc-100">{c.name}</span>
                    <span className="block truncate text-[12px] text-zinc-500">@{c.login}</span>
                    <span className="block truncate text-[12px] text-zinc-600">{c.role?.toLowerCase()}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[12px] text-zinc-500">
            <span className="text-zinc-300 tabular-nums">+1000</span> operators across every module.{" "}
            <Link href="/contributors" className="underline decoration-zinc-700 underline-offset-4 hover:text-zinc-200">
              see everyone →
            </Link>
          </p>
        </section>

        {/* 04 Proof */}
        <section id="proof" aria-labelledby="proof-title" className="scroll-mt-20 py-20 shadow-[0_-1px_0_rgb(255_255_255/0.06)]">
          <SectionHead n="04" id="proof" cmd={`grep -r "open dev society" ./internet | wc -l  # ${mentions.length}`} title="Backed by partners. Talked about in public." href="/word-of-mouth" />
          <div className="grid gap-12 lg:grid-cols-[20rem_minmax(0,1fr)]">
            <div className="space-y-10 text-[13px]">
              <div>
                <p className="mb-4 text-zinc-600">// partners</p>
                <ul className="space-y-1">
                  {partners.map((p) => (
                    <li key={p.name}>
                      <a href={p.url} target="_blank" rel="noreferrer" className="flex min-h-11 items-center gap-3 text-zinc-300 transition-colors hover:text-zinc-50">
                        <span className="grid h-7 w-20 shrink-0 place-items-start">
                          {p.logo && <img src={p.logo} alt="" className="max-h-6 max-w-20 opacity-70 brightness-0 invert" />}
                        </span>
                        {p.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-4 text-zinc-600">// community partner at</p>
                <ul className="space-y-3">
                  {events.map((e) => (
                    <li key={e.name}>
                      <span className="text-zinc-300">{e.name}</span>
                      <span className="block text-[12px] text-zinc-600">
                        {e.organizer} · {e.date}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <a href="mailto:opendevsociety@gmail.com?subject=Partnership%20Inquiry" className="a-btn">
                partner with us ↗
              </a>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2">
              {quotes.map((m) => (
                <li key={m.url}>
                  <a href={m.url} target="_blank" rel="noreferrer" className="flex h-full flex-col justify-between gap-6 rounded-xl bg-white/[0.03] p-5 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.08)] transition-colors hover:bg-white/[0.05]">
                    <blockquote className="font-sans text-[15px] leading-relaxed text-zinc-300">“{unquote(m.highlight!)}”</blockquote>
                    <span className="flex justify-between gap-4 text-[12px] text-zinc-600">
                      <span className="truncate">{m.author}</span>
                      <span className="shrink-0">{m.source}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 05 Join */}
        <section id="join" aria-labelledby="join-title" className="scroll-mt-20 py-20 shadow-[0_-1px_0_rgb(255_255_255/0.06)]">
          <SectionHead n="05" id="join" cmd="ods contribute --help" title="One way in. Pick a flag." href="/contribute" />
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,34rem)]">
            <div className="max-w-md space-y-6 font-sans text-[15px] leading-relaxed text-zinc-400">
              <p>
                You don&apos;t need permission. Choose what you&apos;re good at, pick a labelled issue, open a pull request. Maintainers review in the
                open and every merge is credited to you.
              </p>
              <ol className="space-y-2 font-mono text-[13px] text-zinc-500">
                <li><span className="mr-3 text-zinc-600">1</span>pick a flag</li>
                <li><span className="mr-3 text-zinc-600">2</span>claim an issue</li>
                <li><span className="mr-3 text-zinc-600">3</span>say hi on discord</li>
                <li><span className="mr-3 text-zinc-600">4</span>ship a pull request</li>
              </ol>
              <p className="font-mono text-[12px] text-zinc-600">
                questions → <a href="mailto:opendevsociety@gmail.com" className="text-zinc-400 underline decoration-zinc-700 underline-offset-4 hover:text-zinc-200">opendevsociety@gmail.com</a>
              </p>
            </div>
            <RolePicker />
          </div>
        </section>
      </main>

      <footer className="shadow-[0_-1px_0_rgb(255_255_255/0.06)]">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 text-[12px] sm:px-6 md:grid-cols-[minmax(0,1fr)_auto_auto_auto] md:gap-16">
          <div>
            <p className="text-zinc-500">
              <span className="text-[var(--acc)]">$</span> exit 0
            </p>
            <p className="mt-3 max-w-xs font-sans text-[15px] leading-relaxed text-zinc-300">Because when knowledge is free, innovation is limitless.</p>
            <p className="mt-6 text-zinc-600">© {new Date().getFullYear()} Open Dev Society</p>
          </div>
          {FOOTER.map(([head, links]) => (
            <div key={head}>
              <p className="mb-3 text-zinc-600">{head}</p>
              <ul>
                {links.map(([label, href]) => (
                  <li key={href}>
                    <a href={href} className="flex min-h-8 items-center text-zinc-400 transition-colors hover:text-zinc-100">
                      {label}
                      {href.startsWith("http") && " ↗"}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mx-auto max-w-6xl px-4 pb-8 text-[11px] text-zinc-700 max-md:hidden sm:px-6">
          keys: <span className="a-kbd">1</span>–<span className="a-kbd">5</span> jump to section · <span className="a-kbd">0</span> top
        </p>
      </footer>
    </div>
  );
}
