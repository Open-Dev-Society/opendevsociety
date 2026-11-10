// PLATE I of the Atlas of Open Software: the society as one composite organism, engraved on the server from repo data.
// Client JS is only the hover leader (Leaders.tsx); draw-in and breathing are CSS.
import { Newsreader } from "next/font/google";
import Link from "next/link";
import type { CSSProperties } from "react";
import { compact } from "@/lib/format";
import type { getWorkshop } from "@/lib/workshop";
import { Leaders } from "./Leaders";
import { colony, orderOf, type Lines } from "./organism";
import { SOCIETY, binomialOf } from "./species";
import s from "./atlas.module.css";

type Workshop = Awaited<ReturnType<typeof getWorkshop>>;

// The roman for the plate; its italic is the site's --font-sign (same family), so nothing loads twice.
const serif = Newsreader({ subsets: ["latin"], style: "normal", axes: ["opsz"], variable: "--font-atlas", display: "swap" });

const SIZE = 1000;
const LIVE_DAYS = 7;
const MONTHS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
const NUMERALS: [number, string][] = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
function roman(n: number) {
  let out = "";
  for (const [v, sym] of NUMERALS) for (; n >= v; n -= v) out += sym;
  return out;
}
const collected = (iso: string) => {
  const d = new Date(iso);
  return `${d.getUTCDate()}.${MONTHS[d.getUTCMonth()]}.${d.getUTCFullYear()}`;
};

/** One specimen's engraving: three line weights, drawn in that order. */
function Engraving({ lines, i }: { lines: Lines; i: number }) {
  return (
    <>
      <path className={s.o} d={lines.o} pathLength={1} style={{ "--i": i } as CSSProperties} />
      <path className={s.s} d={lines.s} pathLength={1} style={{ "--i": i + 0.5 } as CSSProperties} />
      <path className={s.h} d={lines.h} pathLength={1} style={{ "--i": i + 1 } as CSSProperties} />
    </>
  );
}

export function Plate({ now, tools, people, lastPush }: Pick<Workshop, "now" | "tools" | "people" | "lastPush">) {
  const ranked = [...tools].sort((a, b) => b.stars - a.stars || b.pushed_at.localeCompare(a.pushed_at));
  const discoverers = (name: string) => people.filter((p) => p.repos.includes(name)).length;
  const col = colony(
    ranked.map((t) => ({ name: t.name, language: t.language, stars: t.stars, forks: t.forks, discoverers: discoverers(t.name) })),
    people.map((p) => p.contributions),
    SIZE,
  );
  const stars = tools.reduce((a, t) => a + t.stars, 0);
  const year = roman(new Date(now).getUTCFullYear());
  const top = col.slots[0];
  const v = col.vacant;

  return (
    <section className={`${serif.variable} ${s.plate}`} aria-labelledby="plate-title">
      <div className={s.sheet}>
        <header className={s.head}>
          <span>Atlas of Open Software · Vol. I</span>
          <span className={s.plateNo}>Plate I.</span>
          <span>Open Dev Society · {year}</span>
        </header>
        <h1 id="plate-title" className={s.h1}>
          Software for everyone, <i>built by anyone who shows&nbsp;up.</i>
        </h1>

        <div className={s.figure} data-plate>
          <svg
            className={s.svg}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            role="img"
            aria-labelledby="plate-fig-title"
          >
            <title id="plate-fig-title">
              {`${SOCIETY}: the society drawn as one organism. A lattice shell of ${people.length} cells, one per builder, and one vacant cell; ${tools.length} specimens, one per tool, grown on its spines.`}
            </title>
            <g className={s.breath}>
              <path className={s.wash} d={col.shell.wash} />
              <Engraving lines={col.spines} i={0} />
              <Engraving lines={col.shell} i={1} />
              <path className={s.cells} d={col.shell.cells} pathLength={1} />
              <ellipse
                className={s.vacant}
                cx={v.x}
                cy={v.y}
                rx={v.ry}
                ry={v.rx}
                pathLength={1}
              />
              {col.slots.map((sl) => {
                const live = now - Date.parse(ranked[sl.fig - 1].pushed_at) < LIVE_DAYS * 864e5;
                // Fig. number sits off the specimen's outer shoulder, clockwise on the right half and anticlockwise on the left.
                const side = sl.theta >= 0 ? 1 : -1;
                const na = sl.theta + side * ((sl.r * 0.9 + 16) / (SIZE * 0.36));
                const nr = SIZE * 0.36 + sl.r * 0.55;
                return (
                  <g key={sl.data.name} className={s.specimen} data-fig={sl.fig} data-x={sl.x} data-y={sl.y} data-r={sl.r}>
                    <g transform={`translate(${sl.x.toFixed(1)} ${sl.y.toFixed(1)})`}>
                      <g
                        className={live ? s.live : undefined}
                        style={{ "--beat": `${5 + (sl.fig % 4)}s` } as CSSProperties}
                      >
                        <path className={s.wash} d={sl.grown.wash} />
                        <Engraving lines={sl.grown} i={2 + sl.fig * 0.35} />
                      </g>
                      <circle r={sl.r * 1.25} className={s.hit} />
                    </g>
                    <text
                      className={s.num}
                      x={SIZE / 2 + nr * Math.sin(na)}
                      y={SIZE / 2 - nr * Math.cos(na)}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {sl.fig}
                    </text>
                  </g>
                );
              })}
            </g>
            {/* Standing leaders: fig. 1 up to its caption, the vacant cell down to its own. */}
            <path className={s.leader} d={`M${top.x} 0V${(top.y - top.r * 1.3).toFixed(1)}`} pathLength={1} />
            <path className={s.leader} d={`M${v.x} ${(v.y + v.rx + 4).toFixed(1)}V${SIZE}`} pathLength={1} />
            <circle className={s.dot} cx={v.x} cy={v.y + v.rx + 4} r={3} />
          </svg>

          <h2 className={s.explicatio}>Explanation of the plate</h2>
          <ol className={s.legend} role="list">
            {col.slots.map((sl) => {
              const t = ranked[sl.fig - 1];
              const n = discoverers(t.name);
              // Desktop: fig. 1 heads the plate; the rest flank it on their own side, top to bottom.
              const place =
                sl.fig === 1
                  ? { gridColumn: 2, gridRow: 1 }
                  : { gridColumn: sl.theta > 0 ? 3 : 1, gridRow: 1 + Math.ceil((sl.fig - 1) / 2) };
              return (
                <li key={t.name} data-fig={sl.fig} className={sl.fig === 1 ? s.capTop : sl.theta > 0 ? s.capR : s.capL} style={place}>
                  <span className={s.figNo}>fig. {sl.fig}</span>{" "}
                  <a href={t.html_url} className={s.name}>
                    {t.name}
                  </a>
                  , <i className={s.bin}>{binomialOf(t.name)}</i>
                  <span className={s.meta}>
                    <span className={s.order}>Ord. {orderOf(t.language).order}</span>
                    {compact(t.stars)} ★ · {compact(t.forks)} fork
                    {t.forks === 1 ? "" : "s"} · {n} discoverer{n === 1 ? "" : "s"}
                  </span>
                </li>
              );
            })}
            <li data-fig="vacant" className={s.capFoot} style={{ gridColumn: 2, gridRow: 9 }}>
              <span className={s.figNo}>fig. {col.slots.length + 1}</span> <span className={s.mark}>the vacant cell</span>,{" "}
              <i className={s.bin}>Species tua</i>
              <span className={s.meta}>
                <span className={s.order}>Ord. nova</span>
                yours · not yet described
              </span>
            </li>
          </ol>
          <Leaders />
        </div>

        <div className={s.title}>
          <p className={s.kicker}>
            {SOCIETY}, <i>colonia</i>. {tools.length} species, {people.length} discoverers, one cell vacant
          </p>
          <p className={s.lede}>
            Technology should belong to everyone. Every specimen in this atlas is free, grown in public and described by
            whoever showed up. The vacant cell is yours.
          </p>
          <p className={s.links}>
            <Link href="/contribute">Describe a new species&nbsp;→</Link>
            <span aria-hidden>·</span>
            <Link href="/projects">Open the atlas&nbsp;→</Link>
          </p>
        </div>

        <footer className={s.label}>
          <span>
            Coll. no. <span className={s.mono}>ODS·{String(tools.length).padStart(3, "0")}·{String(people.length).padStart(3, "0")}</span>
          </span>
          <span className={s.scale} aria-label="Scale: one growth ring per tenfold stars">
            <svg viewBox="0 0 150 22" aria-hidden>
              {[0, 1, 2, 3, 4].map((i) => (
                <rect key={i} x={i * 30} y={2} width={30} height={4} className={i % 2 ? s.barOpen : s.barFill} />
              ))}
              {["1", "10", "100", "1k", "10k"].map((t, i) => (
                <text key={t} x={i * 30 + (i ? 0 : 1)} y={19} textAnchor={i ? "middle" : "start"}>
                  {t}
                </text>
              ))}
            </svg>
            <span>one ring per decade of ★ · Σ {compact(stars)}</span>
          </span>
          <span>
            Collected <span className={s.mono}>{collected(lastPush)}</span>
          </span>
        </footer>
      </div>
      <p className={s.credits}>
        <i>The builders del.</i>
        <i>organism.ts sculp.</i>
      </p>
    </section>
  );
}
