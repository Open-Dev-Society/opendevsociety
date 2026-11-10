import { Button } from "@/components/site";
import { ago, isLive } from "@/lib/format";
import type { getWorkshop } from "@/lib/workshop";
import { Clock } from "./Clock";
import { Society } from "./Society";

type Workshop = Awaited<ReturnType<typeof getWorkshop>>;

const H1 = "Software for everyone, built by anyone who shows up.";
const DAYS = 30;

/** Pushes in the last 30 days as beats on one line, one slot per day, taller when several repos moved that day. Now is the right edge. */
function pulse(tools: Workshop["tools"], now: number) {
  const days = Array<number>(DAYS).fill(0);
  for (const t of tools) {
    const d = Math.floor((now - Date.parse(t.pushed_at)) / 864e5);
    if (d < DAYS) days[DAYS - 1 - d]++;
  }
  const u = 120 / DAYS;
  let d = "M0 22";
  days.forEach((n, i) => {
    if (!n) return;
    const x = i * u + u / 2;
    d += ` L${(x - 1.2).toFixed(1)} 22 L${x.toFixed(1)} ${22 - Math.min(18, 6 + n * 4)} L${(x + 1).toFixed(1)} 25 L${(x + 2).toFixed(1)} 22`;
  });
  return { d: `${d} L120 22`, count: days.reduce((a, n) => a + n, 0) };
}

// Two lineages meet at the same place: life (cell → society) and tech (bit → network) both end in open source.
const LINEAGE = `cell > organism > society \\
                           > open source
bit  > program  > network /`;

function Instrument({ name, version, className, children }: { name: string; version: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={`flex flex-col gap-2 px-4 py-3.5 ${className ?? ""}`}>
      <p className="t-mono flex items-center gap-1.5 text-[12px] text-(--fg-subtle)">
        <span className="text-(--fg-muted)">{name}</span>
        <span className="rounded-[4px] px-1 shadow-[inset_0_0_0_1px_var(--line)]">{version}</span>
      </p>
      {children}
    </div>
  );
}

export function HeroA({ now, tools, people, lastPush }: Pick<Workshop, "now" | "tools" | "people" | "lastPush">) {
  const logins = people.map((p) => p.login);
  const latest = tools.find((t) => t.pushed_at === lastPush);
  const { d, count } = pulse(tools, now);
  const live = isLive(lastPush, now);

  return (
    <section className="mx-auto grid w-full max-w-(--container) gap-10 px-(--gutter) pt-12 pb-16 lg:grid-cols-12 lg:items-center lg:gap-(--grid-gap) lg:pt-16 lg:pb-24">
      <div className="lg:col-span-5 lg:pr-6">
        <p className="rise t-meta flex flex-wrap items-center gap-x-2 gap-y-1 text-(--fg-muted)" style={{ "--i": 0 } as React.CSSProperties}>
          <span>Est. July 2024</span>
          <span aria-hidden>·</span>
          <span className="tabular-nums">{tools.length} tools</span>
          <span aria-hidden>·</span>
          <span className="tabular-nums">{people.length} builders</span>
        </p>
        <h1
          className="rise display-1 mt-6 max-w-[14ch] text-(--fg) lg:text-[clamp(2.75rem,0.5rem+3.4vw,4rem)]!"
          style={{ "--i": 1 } as React.CSSProperties}
        >
          Software for everyone, built by <span className="sign text-(--accent)">anyone who shows up.</span>
        </h1>
        <p className="rise t-lede mt-6 max-w-[46ch] text-(--fg-muted)" style={{ "--i": 2 } as React.CSSProperties}>
          A public workshop of developers, designers and writers making free, open-source tools. No paywalls. No interviews. Send a
          pull request and you&apos;re one of us.
        </p>
        <div className="rise mt-8 flex flex-col gap-3 sm:flex-row sm:items-center" style={{ "--i": 3 } as React.CSSProperties}>
          <Button href="/contribute" size="lg" icon="arrow">
            Contribute
          </Button>
          <Button href="/projects" size="lg" variant="secondary">
            See the {tools.length} tools
          </Button>
        </div>
      </div>

      <figure
        className="rise min-w-0 overflow-hidden rounded-(--radius-md) bg-(--surface) shadow-(--shadow-md) lg:col-span-7"
        style={{ "--i": 4 } as React.CSSProperties}
        aria-label={`The Game of Life, seeded with one organism per builder: ${people.length} of them.`}
      >
        <Society logins={logins} />

        <div className="grid grid-cols-2 border-t border-(--line) [&>*]:border-(--line)">
          <Instrument name="Clock" version="1.0" className="border-r">
            <Clock />
          </Instrument>
          <Instrument name="Pulse" version="1.0">
            <p className="t-mono flex items-center gap-1.5 text-[12px] text-(--fg-muted)">
              {live && <span className="size-1.5 rounded-full bg-(--live)" aria-hidden />}
              last commit {ago(lastPush, now)}
              <span className="hidden truncate text-(--fg-subtle) sm:inline">· {latest?.name}</span>
            </p>
            <svg viewBox="0 0 120 28" preserveAspectRatio="none" className="h-7 w-full overflow-visible" aria-hidden>
              <path d={d} fill="none" stroke="var(--fg-muted)" strokeWidth="1.25" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
              <circle cx="120" cy="22" r="1.6" fill={live ? "var(--live)" : "var(--fg-subtle)"} />
            </svg>
            <p className="t-mono flex justify-between text-[12px] text-(--fg-subtle)" aria-hidden>
              <span>{DAYS}d</span>
              <span>{count} repos pushed</span>
              <span>now</span>
            </p>
          </Instrument>
          <Instrument name="Rule" version="B3/S23" className="col-span-2 border-t sm:col-span-1 sm:border-r">
            <p className="text-sm leading-snug text-pretty text-(--fg-muted)">
              A cell lives with two or three neighbours. Alone, it dies. <span className="text-(--fg)">So does a project.</span>
            </p>
          </Instrument>
          <Instrument name="Lineage" version="0.1" className="hidden border-t sm:flex">
            <pre aria-hidden className="font-mono text-[11px] leading-[1.45] text-(--fg-muted)">
              {LINEAGE}
            </pre>
            <p className="sr-only">Cell to organism to society, and bit to program to network: both end in open source.</p>
          </Instrument>
        </div>

        <p aria-hidden className="t-mono hidden items-center gap-2 overflow-hidden border-t border-(--line) px-4 py-2 text-[12px] whitespace-nowrap text-(--fg-subtle) sm:flex">
          <span className="text-(--fg-muted)">b64</span>
          <span className="[mask-image:linear-gradient(90deg,#000_80%,transparent)] overflow-hidden">{Buffer.from(H1).toString("base64")}</span>
          <span className="ml-auto pl-2 text-(--fg-muted)">ODS·SOC·{String(people.length).padStart(4, "0")}</span>
        </p>
      </figure>
    </section>
  );
}
