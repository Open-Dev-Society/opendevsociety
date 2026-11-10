import { Fragment } from "react";
import { ago, compact } from "@/lib/format";
import type { getWorkshop } from "@/lib/workshop";
import { REGIMES } from "./field";
import { LabButton } from "./LabButton";
import { LabClock, TuringField } from "./TuringField";

type Workshop = Awaited<ReturnType<typeof getWorkshop>>;

const H1 = "Software for everyone, built by anyone who shows up.";
const num = (x: number) => x.toFixed(3).replace(/^0/, "");

// Specimen plates: one size, one hairline, pinned to the same 16/20px inset. data-plate also hushes the field around them (field.ts).
function Label({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <div
      data-plate
      className={`t-mono absolute flex flex-col bg-(--bg) px-2.5 py-1.5 text-[11px] leading-[1.5] text-(--fg-muted) shadow-[0_0_0_1px_var(--line)] ${className}`}
    >
      {children}
    </div>
  );
}

/** "ODS presents itself as a lab": Turing's 1952 morphogenesis, live, with the H1 grown out of it. */
export function LabHero({ now, tools, people, lastPush, stars }: Pick<Workshop, "now" | "tools" | "people" | "lastPush"> & { stars: number }) {
  const latest = tools.find((t) => t.pushed_at === lastPush);
  const { spots, coral } = REGIMES;

  return (
    // Exactly one screen, field to the top edge: on Home the nav is fixed and hidden while this is in view (data-under-nav, Nav.tsx).
    <section
      aria-labelledby="lab-h1"
      data-under-nav
      className="group relative isolate h-svh min-h-[560px] cursor-crosshair overflow-hidden border-b border-(--line)"
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
        <span>est. July 2024 · free, open source</span>
      </Label>
      <Label className="right-5 bottom-5 hidden text-right md:flex">
        <span className="text-(--fg)">
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
          className="max-w-[13ch] text-[clamp(3rem,0.9rem+6.4vw,8.25rem)] leading-[0.88] font-[800] tracking-[-0.018em] text-balance text-(--fg) transition-colors duration-(--d-5) [font-stretch:75%] group-data-[live]:text-transparent"
        >
          {H1.split(" ").map((w, i) => (
            <Fragment key={i}>
              {i > 0 && " "}
              <span data-w>{w}</span>
            </Fragment>
          ))}
        </h1>
        <p className="mt-8 flex flex-wrap items-center justify-center gap-3 md:mt-10">
          <LabButton href="/contribute" data-plate>
            Join the lab →
          </LabButton>
          <LabButton href="/projects" variant="secondary" data-plate>
            Experiments
          </LabButton>
        </p>
      </div>
    </section>
  );
}
