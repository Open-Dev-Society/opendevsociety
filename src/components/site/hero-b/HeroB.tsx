import { Button } from "@/components/site";
import { ago, isLive } from "@/lib/format";
import { getWorkshop } from "@/lib/workshop";
import { Boot, Clock, Scope } from "./Scope";
import css from "./hero-b.module.css";

const DAY = 864e5;
const MANIFESTO = "Technology should belong to everyone.";
const B64 = Buffer.from(MANIFESTO).toString("base64");
const SERIAL = `ODS.SIG.${Buffer.from("ODS").toString("hex").toUpperCase()}`;

// From the first living machine to the next contributor.
const lineage: [string, string][] = [
  ["cell", "3.8 Gya"],
  ["abacus", "2700 BC"],
  ["transistor", "1947"],
  ["kernel", "1969"],
  ["open source", "1998"],
  ["git", "2005"],
];

/** Hero take B, "Signal": the workshop's live activity as a heartbeat, ringed by small version-tagged instruments. */
export async function HeroB() {
  const { now, tools, people, thisWeek, lastPush } = await getWorkshop();

  // CH1: the twelve most recent pushes (one full sweep at 1440 without repeats), newest beats tallest.
  const beats = [...tools]
    .sort((a, b) => b.pushed_at.localeCompare(a.pushed_at))
    .slice(0, 12)
    .map((r) => ({
      label: `${r.name} ${ago(r.pushed_at, now).replace(" ago", "")}`,
      w: 0.4 + 0.6 * Math.exp(-(now - Date.parse(r.pushed_at)) / DAY / 14),
    }));
  const active = people.filter((p) => p.repos.some((r) => thisWeek.includes(r))).length;
  const bpm = Math.min(100, 54 + thisWeek.length * 6);
  const gain = 0.6 + 0.4 * Math.min(1, active / 10);
  const rise = (i: number) => ({ "--i": i }) as React.CSSProperties;

  return (
    <section className="mx-auto w-full max-w-(--container) px-(--gutter) pt-16 lg:pt-24">
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-(--grid-gap)">
        <div className="lg:col-span-8">
          <p className="rise t-meta flex flex-wrap items-center gap-x-2 gap-y-1 text-(--fg-muted)" style={rise(0)}>
            <span>Est. July 2024</span>
            <span aria-hidden>·</span>
            <span className="tabular-nums">{tools.length} tools</span>
            <span aria-hidden>·</span>
            <span className="tabular-nums">{people.length} builders</span>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1.5 tabular-nums">
              {isLive(lastPush, now) && <span className="size-1.5 rounded-full bg-(--live)" aria-hidden />}
              last commit {ago(lastPush, now)}
            </span>
          </p>
          <h1 className="rise display-1 mt-6 max-w-[14ch] text-(--fg)" style={rise(1)}>
            Software for everyone, built by <span className="sign text-(--accent)">anyone who shows up.</span>
          </h1>
        </div>
        <div className="lg:col-span-4">
          <p className="rise t-lede max-w-[52ch] text-(--fg-muted)" style={rise(2)}>
            A public workshop of developers, designers and writers making free, open-source tools. No paywalls. No interviews. Send a pull
            request and you&apos;re one of us.
          </p>
          <div className="rise mt-8 flex flex-col gap-3 sm:flex-row sm:items-center" style={rise(3)}>
            <Button href="/contribute" size="lg" icon="arrow">
              Contribute
            </Button>
            <Button href="/projects" size="lg" variant="secondary">
              See the tools
            </Button>
          </div>
        </div>
      </div>

      <div data-signal className="rise t-mono mt-12 overflow-hidden rounded-(--radius-lg) bg-(--surface) shadow-(--shadow-md) lg:mt-16" style={rise(4)}>
        <div aria-hidden className="flex items-center justify-between gap-4 border-b border-(--line) px-4 py-2.5 text-[11px] text-(--fg-subtle)">
          <span className="flex min-w-0 items-center gap-3">
            <span className="text-(--fg)">Signal 0.1</span>
            <span className="hidden sm:inline">
              <Boot />
            </span>
          </span>
          <span className="flex items-center gap-3">
            <span className="hidden sm:inline">Clock 1.0</span>
            <span className="text-(--fg-muted)">
              <Clock />
            </span>
            <span className="hidden lg:inline">∿ ⌁</span>
          </span>
        </div>

        <div className={`relative h-44 sm:h-64 lg:h-72 ${css.graticule}`}>
          <Scope beats={beats} bpm={bpm} voices={Math.max(1, active)} gain={gain} />
          <span aria-hidden className="absolute top-2.5 left-4 text-[11px] text-(--fg-subtle)">
            CH1 1 beat = 1 push
            <span className="hidden sm:inline"> · CH2 Σ {active} builders</span>
          </span>
          <span aria-hidden className="absolute right-4 bottom-2.5 hidden text-[11px] text-(--fg-subtle) sm:inline">
            ⏚ {bpm} bpm · 18 col/beat
          </span>
        </div>

        <div className="grid gap-px border-t border-(--line) bg-(--line) sm:grid-cols-2 lg:grid-cols-[1fr_1.7fr_1.3fr]">
          <div className="bg-(--surface) px-4 py-4">
            <p className="text-[11px] text-(--fg-subtle)">Pulse 0.3</p>
            <p className="mt-2 flex items-baseline gap-2 text-(--fg)">
              <span className="text-[28px] leading-none font-medium tracking-tight">{bpm}</span>
              <span className="text-(--fg-muted)">bpm</span>
            </p>
            <p className="mt-2 text-[12px] text-(--fg-muted)">
              {thisWeek.length} repos pushed this week · {active} builders
            </p>
          </div>

          <div className="bg-(--surface) px-4 py-4">
            <p className="text-[11px] text-(--fg-subtle)">Lineage 1.0</p>
            <ol className="mt-2 flex flex-wrap items-baseline gap-x-1.5 gap-y-2 text-[12px]" aria-label="From the first cell to you">
              {lineage.map(([name, when]) => (
                <li key={name} className="flex items-baseline gap-1.5">
                  <span className="text-(--fg)">{name}</span>
                  <span className="text-[10px] text-(--fg-subtle)">{when}</span>
                  <span aria-hidden className="text-(--fg-subtle)">
                    →
                  </span>
                </li>
              ))}
              <li className="text-(--accent)">
                you
                <span aria-hidden className={css.caret} />
              </li>
            </ol>
          </div>

          <div className="bg-(--surface) px-4 py-4 sm:col-span-2 lg:col-span-1">
            <p className="flex justify-between text-[11px] text-(--fg-subtle)">
              <span>Decoder 0.2 · b64</span>
              <span aria-hidden>{SERIAL}</span>
            </p>
            <p className="group relative mt-2 text-[12px] break-all text-(--fg-muted)">
              <span aria-hidden className="line-clamp-2 transition-opacity duration-(--d-3) group-hover:opacity-0">
                {B64}
              </span>
              <span className="absolute inset-0 text-(--fg) opacity-0 transition-opacity duration-(--d-3) group-hover:opacity-100">
                {MANIFESTO}
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
