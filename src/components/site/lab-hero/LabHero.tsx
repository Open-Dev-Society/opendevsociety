import Image from "next/image";
import { Fragment } from "react";
import { ago, compact } from "@/lib/format";
import type { getWorkshop } from "@/lib/workshop";
import { DitherEdge } from "../lab/DitherEdge";
import { REGIMES } from "./field";
import { LabButton } from "./LabButton";
import { LabClock, TuringField } from "./TuringField";

type Workshop = Awaited<ReturnType<typeof getWorkshop>>;

// One line per beat; each line may still wrap on narrow screens.
const H1 = ["Open source", "is a living", "system."];
const num = (x: number) => x.toFixed(3).replace(/^0/, "");

// Specimen plates: solid emerald, flush in the corners. data-plate also hushes the field around them (field.ts).
function Label({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <div
      data-plate
      className={`t-mono absolute flex flex-col bg-(--accent) px-3 py-2 text-[11px] leading-[1.5] text-(--accent-fg)/90 ${className}`}
    >
      {children}
    </div>
  );
}

/** Turing's 1952 reaction–diffusion pattern, live, with the H1 grown out of it. The look is a lab; the words stay plain (docs/lab.md). */
export function LabHero({ now, tools, people, lastPush, stars }: Pick<Workshop, "now" | "tools" | "people" | "lastPush"> & { stars: number }) {
  const latest = tools.find((t) => t.pushed_at === lastPush);
  const { spots, coral } = REGIMES;

  return (
    // Exactly one screen, field to the top edge: on Home the nav is fixed and hidden while this is in view (data-under-nav, Nav.tsx).
    <section
      aria-labelledby="lab-h1"
      data-under-nav
      className="group relative isolate h-svh min-h-[560px] overflow-hidden"
    >
      <TuringField />
      {/* The field dissolves into the emerald band below (§01); the bottom plates stand on it like tabs. */}
      <DitherEdge from="transparent" to="var(--accent)" height={48} className="absolute inset-x-0 bottom-0" />

      {/* The nav is hidden over the hero, so the brand hangs from the top edge like a tab. */}
      <div
        data-plate
        className="absolute top-0 left-1/2 flex -translate-x-1/2 items-center gap-2.5 border-x border-b border-(--line) bg-(--bg) py-2.5 pr-4 pl-3 whitespace-nowrap md:gap-3 md:py-3 md:pr-5 md:pl-3.5"
      >
        <Image src="/logo.png" alt="" width={40} height={40} priority className="size-8 md:size-10" />
        <span className="text-[19px] leading-none font-[800] tracking-[-0.01em] text-(--fg) [font-stretch:75%] md:text-[23px]">Open Dev Society</span>
      </div>

      <Label className="top-[65px] left-0 lg:top-0">
        <span className="text-(--accent-fg)">Reaction–diffusion</span>
        <span>Alan Turing, 1952</span>
      </Label>
      <Label className="top-0 right-0 hidden text-right lg:flex">
        <span className="text-(--accent-fg)">
          Gray–Scott · f {num(spots[0])}→{num(coral[0])} · k {num(spots[1])}→{num(coral[1])}
        </span>
        <span>dither Bayer 8×8 · 1-bit</span>
      </Label>
      <Label className="bottom-0 left-0">
        <span>
          <span className="text-(--accent-fg)">{people.length}</span> contributors · <span className="text-(--accent-fg)">{tools.length}</span> projects ·{" "}
          <span className="text-(--accent-fg)">{compact(stars)}</span> ★
        </span>
        <span>est. July 2024 · free, open source</span>
      </Label>
      <Label className="right-0 bottom-0 hidden text-right md:flex">
        <span className="text-(--accent-fg)">
          <LabClock />
        </span>
        <span>
          last commit {ago(lastPush, now)} · {latest?.name}
        </span>
      </Label>

      <div className="mx-auto flex h-full max-w-(--container) flex-col items-center justify-center px-(--gutter) pt-6 pb-14 text-center md:pb-10">
        {/* Real text: readable before the field starts and without WebGL. Once the field runs it fades out and the canvas grows the same glyphs in place. */}
        <h1
          id="lab-h1"
          className="text-[clamp(2.75rem,0.5rem+6vw,8rem)] leading-[0.88] font-[800] tracking-[-0.018em] text-(--fg) transition-colors duration-(--d-5) [font-stretch:75%] group-data-[live]:text-transparent"
        >
          {H1.map((line, l) => (
            <span key={l} className="block">
              {line.split(" ").map((w, i) => (
                <Fragment key={i}>
                  {i > 0 && " "}
                  <span data-w>{w}</span>
                </Fragment>
              ))}
            </span>
          ))}
        </h1>
        <p className="mt-8 flex flex-wrap items-center justify-center gap-3 md:mt-10">
          <LabButton href="/contribute" data-plate>
            Start contributing →
          </LabButton>
          <LabButton href="/projects" variant="secondary" data-plate>
            See projects
          </LabButton>
        </p>
      </div>
    </section>
  );
}
