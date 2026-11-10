import Link from "next/link";
import { Fragment } from "react";
import { ago, compact } from "@/lib/format";
import type { getWorkshop } from "@/lib/workshop";
import { REGIMES } from "./field";
import { LabClock, TuringField } from "./TuringField";

type Workshop = Awaited<ReturnType<typeof getWorkshop>>;

const H1 = "Software for everyone, built by anyone who shows up.";
const num = (x: number) => x.toFixed(3).replace(/^0/, "");

function Label({ className, children }: { className: string; children: React.ReactNode }) {
  return <div className={`t-mono absolute flex flex-col bg-(--bg) px-1.5 py-1 text-[11px] leading-[1.45] text-(--fg-muted) ${className}`}>{children}</div>;
}

function Cta({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="-mx-1 inline-flex min-h-11 items-center bg-(--bg) px-1 font-mono text-[15px] text-(--fg) transition-colors duration-(--d-2) ease-(--ease-ui) hover:bg-(--fg) hover:text-(--bg) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--focus) md:text-base"
    >
      <span aria-hidden>[&nbsp;</span>
      {children}
      <span aria-hidden>&nbsp;]</span>
    </Link>
  );
}

/** "ODS presents itself as a lab": Turing's 1952 morphogenesis, live, with the H1 grown out of it. */
export function LabHero({ now, tools, people, lastPush, stars }: Pick<Workshop, "now" | "tools" | "people" | "lastPush"> & { stars: number }) {
  const latest = tools.find((t) => t.pushed_at === lastPush);
  const { spots, coral } = REGIMES;

  return (
    <section
      aria-labelledby="lab-h1"
      className="group relative isolate h-[clamp(520px,78svh,640px)] cursor-crosshair overflow-hidden md:h-[clamp(600px,calc(85svh-4rem),860px)]"
    >
      <TuringField />

      <Label className="top-4 left-4 md:top-5 md:left-5">
        <span className="text-(--fg)">ODS·LAB / EXP-000</span>
        <span>Morphogenesis · after Turing, 1952</span>
      </Label>
      <Label className="top-5 right-5 hidden text-right md:flex">
        <span className="text-(--fg)">
          Gray–Scott · f {num(spots[0])}→{num(coral[0])} · k {num(spots[1])}→{num(coral[1])}
        </span>
        <span>dither Bayer 8×8 · 1-bit</span>
      </Label>
      <Label className="bottom-4 left-4 md:bottom-5 md:left-5">
        <span>
          <span className="text-(--fg)">{people.length}</span> researchers · <span className="text-(--fg)">{tools.length}</span> experiments ·{" "}
          <span className="text-(--fg)">{compact(stars)}</span> ★
        </span>
      </Label>
      <Label className="right-5 bottom-5 hidden text-right md:flex">
        <span className="text-(--fg)">
          <LabClock />
        </span>
        <span>
          last commit {ago(lastPush, now)} · {latest?.name}
        </span>
      </Label>

      <div className="mx-auto flex h-full max-w-(--container) flex-col justify-center px-(--gutter) pt-6 pb-14 md:pb-10">
        {/* Real text: readable before the field starts and without WebGL. Once the field runs it fades out and the canvas grows the same glyphs in place. */}
        <h1
          id="lab-h1"
          className="max-w-[13ch] text-[clamp(3rem,0.9rem+6.4vw,8.25rem)] leading-[0.88] font-[800] tracking-[-0.018em] text-balance text-(--fg) transition-colors duration-(--d-5) [font-stretch:75%] group-data-[live]:text-transparent"
        >
          {H1.split(" ").map((w, i) => (
            <Fragment key={i}>
              {i > 0 && " "}
              <span data-w>{w}</span>
            </Fragment>
          ))}
        </h1>
        <p className="mt-7 flex flex-wrap gap-x-7 md:mt-9">
          <Cta href="/contribute">Join the lab →</Cta>
          <Cta href="/projects">Experiments</Cta>
        </p>
      </div>
    </section>
  );
}
