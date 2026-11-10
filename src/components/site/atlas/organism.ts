// The Atlas of Open Software's engraver: grows each project into a specimen, deterministically, from its repo data.
// Pure and dependency-free (node runs organism.check.mjs on it directly). Output is SVG path data in three line weights,
// so a plate is a handful of <path>s: o = outline, s = structure, h = hatching and stipple.
//   name hash  → symmetry, phase, ornament
//   language   → order (the body plan)
//   stars      → size and growth rings (one ring per decade)
//   forks      → spines / tentacles
//   discoverers→ chambers / marginal organs
//   recent push→ a slow pulse (decided by the caller)

const TAU = Math.PI * 2;
const GOLDEN = Math.PI * (3 - Math.sqrt(5));

export type Lines = { o: string; s: string; h: string };
export type Grown = Lines & { wash: string };
export type Body = "disc" | "lattice" | "medusa" | "ring";

/** Language → order. Edit names freely; `body` picks the body plan. */
export const ORDERS: Record<string, { order: string; body: Body }> = {
  TypeScript: { order: "Discoidea", body: "disc" },
  JavaScript: { order: "Spumellaria", body: "lattice" },
  Python: { order: "Spumellaria", body: "lattice" },
  Swift: { order: "Discomedusae", body: "medusa" },
};
export const orderOf = (language: string | null) => ORDERS[language ?? ""] ?? { order: "Incertae sedis", body: "ring" as Body };

export type SpecimenData = { name: string; language: string | null; stars: number; forks: number; discoverers: number };

// ── numbers ────────────────────────────────────────────────────────────────
export function hash(s: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193);
  return h >>> 0;
}
export function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pick = <T,>(r: () => number, xs: T[]) => xs[Math.floor(r() * xs.length)];
/** Growth rings: 1 for a seedling, one more per decade of stars. */
export const ringsOf = (stars: number) => 1 + Math.min(5, Math.floor(Math.log10(stars + 1)));
export const spinesOf = (forks: number) => Math.min(48, Math.round(4 * Math.log2(forks + 1)));

// ── path primitives (1 decimal keeps the markup small) ─────────────────────
const f = (v: number) => Math.round(v * 10) / 10;
type P = [number, number];
const at = (r: number, a: number, c: P = [0, 0]): P => [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)];
const M = (p: P) => `M${f(p[0])} ${f(p[1])}`;
const L = (p: P) => `L${f(p[0])} ${f(p[1])}`;
const line = (a: P, b: P) => M(a) + L(b);
export const circle = (c: P, r: number) =>
  `M${f(c[0] - r)} ${f(c[1])}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0`;
const arc = (c: P, r: number, a0: number, a1: number) =>
  M(at(r, a0, c)) + `A${f(r)} ${f(r)} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${f(at(r, a1, c)[0])} ${f(at(r, a1, c)[1])}`;
/** Ellipse with semi-axis `ra` along angle `rot` and `rb` across it. */
const ellipse = (c: P, ra: number, rb: number, rot: number) => {
  const a = at(ra, rot, c), b = at(-ra, rot, c), deg = f((rot * 180) / Math.PI);
  return `${M(a)}A${f(ra)} ${f(rb)} ${deg} 1 0 ${f(b[0])} ${f(b[1])}A${f(ra)} ${f(rb)} ${deg} 1 0 ${f(a[0])} ${f(a[1])}`;
};
/** Closed, softly irregular outline: the hand-coloured wash never quite registers with the engraving. */
export function blob(c: P, r: number, rand: () => number, k = 13) {
  const off: P = [c[0] + (rand() - 0.35) * r * 0.1, c[1] + (rand() - 0.35) * r * 0.1];
  const pts = Array.from({ length: k }, (_, i) => at(r * (0.95 + rand() * 0.1), (i / k) * TAU, off));
  const mid = (a: P, b: P): P => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  let d = M(mid(pts[k - 1], pts[0]));
  pts.forEach((p, i) => {
    const m = mid(p, pts[(i + 1) % k]);
    d += `Q${f(p[0])} ${f(p[1])} ${f(m[0])} ${f(m[1])}`;
  });
  return d + "Z";
}
/** Engraver's shading: concentric arcs thinning into a crescent, light from the upper left. */
export function crescent(c: P, r: number, n: number) {
  let d = "";
  for (let i = 0; i < n; i++) {
    const span = 1.5 * (1 - i / n) ** 0.8;
    d += arc(c, r * (0.97 - i * 0.045), Math.PI / 4 - span / 2, Math.PI / 4 + span / 2);
  }
  return d;
}
/** Points on the visible half of a sphere, near-even (Fibonacci), as [x, y, depth]. */
export function hemisphere(n: number, turn = 0): [number, number, number][] {
  return Array.from({ length: n }, (_, i) => {
    const z = 1 - (i + 0.5) / n, rr = Math.sqrt(1 - z * z), a = i * GOLDEN + turn;
    return [rr * Math.cos(a), rr * Math.sin(a), z];
  });
}

// ── body plans. Local coords centred on 0,0; `phase` is the direction to the colony's centre. ──
/** Shared by every diatom: discoverers as marginal processes, forks as radial spines. */
function margin(d: SpecimenData, r: number, phase: number) {
  const o = "";
  let s = "";
  const cham = Math.max(1, Math.min(24, d.discoverers));
  for (let j = 0; j < cham; j++) s += circle(at(r * 0.955, phase + (j / cham) * TAU + Math.PI / cham), r * 0.025);
  const sp = spinesOf(d.forks);
  for (let j = 0; j < sp; j++) {
    const a = phase + (j / sp) * TAU;
    s += line(at(r, a), at(r * (j % 2 ? 1.12 : 1.2), a));
  }
  return { o, s };
}

// Four diatom genera; the name's hash picks one, so an order of many TypeScript tools still reads as a varied plate.
function disc(d: SpecimenData, r: number, phase: number, rand: () => number): Lines {
  const plan = pick(rand, [rays, star, valve, spiral]);
  const body = plan(d, r, phase, rand), m = margin(d, r, phase);
  return { o: body.o + m.o, s: body.s + m.s, h: body.h };
}

/** Asteromphalus: smooth wedge rays from a hyaline centre, areolae between. */
function star(d: SpecimenData, r: number, phase: number, rand: () => number): Lines {
  const k = pick(rand, [5, 6, 7, 9]), c: P = [0, 0], rings = ringsOf(d.stars);
  const o = circle(c, r);
  let s = circle(c, r * 0.93) + circle(c, r * 0.3), h = crescent(c, r * 0.9, 4 + rings);
  for (let j = 0; j < k; j++) {
    const a = phase + (j / k) * TAU, w = Math.PI / k / 2.6;
    s += M(at(r * 0.3, a - w * 1.4)) + L(at(r * 0.86, a - w * 0.35)) + L(at(r * 0.86, a + w * 0.35)) + L(at(r * 0.3, a + w * 1.4));
    s += line(at(r * 0.3, a), at(r * 0.06, a));
  }
  const n = 40 + rings * 22;
  for (let i = 0; i < n; i++) {
    const rr = r * (0.36 + 0.54 * Math.sqrt((i + 0.5) / n)), a = i * GOLDEN + phase;
    const sector = ((((a - phase) % (TAU / k)) + TAU / k) % (TAU / k)) / (TAU / k);
    if (sector < 0.2 || sector > 0.8) continue; // keep the rays clear
    h += circle(at(rr, a), r * 0.022);
  }
  return { o, s, h };
}

/** Triceratium: a polygonal valve with concave sides and ocelli at the corners. */
function valve(d: SpecimenData, r: number, phase: number, rand: () => number): Lines {
  const k = pick(rand, [3, 4, 5]), c: P = [0, 0], rings = ringsOf(d.stars);
  const poly = (rr: number, sag: number) => {
    const v = Array.from({ length: k }, (_, j) => at(rr, phase + (j / k) * TAU));
    return v.reduce((acc, p, j) => {
      const q = v[(j + 1) % k], cp = at(rr * Math.cos(Math.PI / k) * sag, phase + ((j + 0.5) / k) * TAU);
      return acc + `Q${f(cp[0])} ${f(cp[1])} ${f(q[0])} ${f(q[1])}`;
    }, M(v[0])) + "Z";
  };
  const o = poly(r * 0.9, 0.82) + circle(c, r);
  let s = poly(r * 0.78, 0.8) + circle(c, r * 0.12), h = crescent(c, r * 0.6, 3 + rings);
  for (let j = 0; j < k; j++) {
    const p = at(r * 0.76, phase + (j / k) * TAU);
    s += circle(p, r * 0.1);
    h += circle(p, r * 0.05);
    s += line(at(r * 0.12, phase + (j / k) * TAU), at(r * 0.66, phase + (j / k) * TAU));
  }
  const n = 30 + rings * 16, inner = r * 0.55 * Math.cos(Math.PI / k);
  for (let i = 0; i < n; i++) h += circle(at(inner * Math.sqrt((i + 0.5) / n) + r * 0.14, i * GOLDEN + phase), r * 0.024);
  return { o, s, h };
}

/** Coscinodiscus: areolae in a sunflower spiral, larger towards the rim, striae on the margin. */
function spiral(d: SpecimenData, r: number, phase: number): Lines {
  const c: P = [0, 0], rings = ringsOf(d.stars);
  const o = circle(c, r);
  let s = circle(c, r * 0.9), h = crescent(c, r * 0.88, 4 + rings);
  const n = 50 + rings * 30;
  for (let i = 0; i < n; i++) {
    const t = Math.sqrt((i + 0.5) / n);
    s += circle(at(r * 0.84 * t, i * GOLDEN + phase), r * (0.012 + 0.03 * t));
  }
  for (let j = 0; j < 72; j++) h += line(at(r * 0.9, phase + (j / 72) * TAU), at(r * 0.97, phase + (j / 72) * TAU));
  return { o, s, h };
}

/** Arachnoidiscus: ribs and growth rings like a web, alternate sectors stippled. */
function rays(d: SpecimenData, r: number, phase: number, rand: () => number): Lines {
  const k = pick(rand, [6, 8, 10, 12]), rings = ringsOf(d.stars), c: P = [0, 0];
  const o = circle(c, r);
  let s = circle(c, r * 0.92) + circle(c, r * 0.16), h = crescent(c, r * 0.9, 4 + rings);
  const radii = Array.from({ length: rings }, (_, i) => r * (0.22 + (0.7 * (i + 1)) / (rings + 1)));
  radii.forEach((rr) => (s += circle(c, rr)));
  for (let j = 0; j < 2 * k; j++) {
    const a = phase + (j / (2 * k)) * TAU;
    s += line(at(j % 2 ? r * 0.22 : r * 0.16, a), at(r * 0.92, a));
    // Alternate sectors carry areolae (Actinoptychus): stipple along each band.
    if (j % 2) continue;
    const bands = [r * 0.16, ...radii, r * 0.92];
    for (let b = 1; b < bands.length; b++) {
      const rr = (bands[b - 1] + bands[b]) / 2, m = Math.max(1, Math.round((rr * TAU) / (2 * k) / (r * 0.12)));
      for (let q = 0; q < m; q++) h += circle(at(rr, a + ((q + 0.5) / m) * (TAU / (2 * k))), r * 0.022);
    }
  }
  return { o, s, h };
}

function lattice(d: SpecimenData, r: number, phase: number, rand: () => number): Lines {
  const k = pick(rand, [5, 6, 7]), rings = ringsOf(d.stars), c: P = [0, 0];
  let o = circle(c, r), s = circle(c, r * 0.95), h = crescent(c, r * 0.93, 3 + rings);
  const shells = Math.min(3, rings);
  for (let i = 0; i < shells; i++) s += circle(c, r * (0.22 + 0.17 * i));
  for (let j = 0; j < k; j++) s += line(at(r * 0.22, phase + (j / k) * TAU), at(r * 0.95, phase + (j / k) * TAU));
  // Pores of the cortical shell, foreshortened towards the rim.
  const n = 16 + 6 * rings, pr = r * 0.62 * Math.sqrt(1 / n);
  for (const [x, y, z] of hemisphere(n, rand() * TAU)) {
    if (z < 0.12) continue;
    h += ellipse([x * r * 0.8, y * r * 0.8], pr * (0.4 + 0.6 * z), pr, Math.atan2(y, x));
  }
  const cham = Math.max(1, Math.min(12, d.discoverers));
  for (let j = 0; j < cham; j++) s += circle(at(cham > 1 ? r * 0.1 : 0, (j / cham) * TAU), r * 0.045);
  // Spines: the k main ones long and tapered, fork-grown ones fine.
  const sp = Math.max(k, spinesOf(d.forks));
  for (let j = 0; j < sp; j++) {
    const a = phase + (j / sp) * TAU, main = j % Math.max(1, Math.round(sp / k)) === 0, w = main ? 0.06 : 0.025;
    const tip = at(r * (main ? 1.42 : 1.2), a);
    if (main) o += M(at(r, a - w)) + L(tip) + L(at(r, a + w));
    else s += line(at(r, a), tip);
  }
  return { o, s, h };
}

function medusa(d: SpecimenData, r: number, phase: number, rand: () => number): Lines {
  const k = rand() < 0.5 ? 4 : 8, c: P = [0, 0], lap = 4 * k;
  // Scalloped bell margin.
  let o = M(at(r * 0.97, phase));
  for (let j = 0; j < lap; j++) {
    const a0 = phase + (j / lap) * TAU, a1 = phase + ((j + 1) / lap) * TAU, cp = at(r * 1.08, (a0 + a1) / 2), e = at(r * 0.97, a1);
    o += `Q${f(cp[0])} ${f(cp[1])} ${f(e[0])} ${f(e[1])}`;
  }
  let s = circle(c, r * 0.86), h = crescent(c, r * 0.84, 3 + ringsOf(d.stars));
  for (let j = 0; j < 2 * k; j++) {
    const a = phase + (j / (2 * k)) * TAU;
    if (j % 2 === 0) s += line(at(r * 0.16, a), at(r * 0.86, a));
    else s += line(at(r * 0.5, a), at(r * 0.7, a)) + line(at(r * 0.7, a), at(r * 0.86, a - 0.12)) + line(at(r * 0.7, a), at(r * 0.86, a + 0.12));
  }
  // Gonads: k horseshoes. Mouth: k oral arms.
  for (let j = 0; j < k; j++) {
    const a = phase + ((j + 0.5) / k) * TAU, half = (TAU / k) * 0.28;
    s += arc(c, r * 0.46, a - half, a + half) + arc(c, r * 0.36, a - half * 0.8, a + half * 0.8);
    const tip = at(r * 0.3, a - (TAU / k) * 0.5), cp = at(r * 0.22, a - (TAU / k) * 0.2);
    h += M(c) + `Q${f(cp[0])} ${f(cp[1])} ${f(tip[0])} ${f(tip[1])}`;
  }
  // Tentacles from forks, sense organs (rhopalia) from discoverers.
  const sp = spinesOf(d.forks) || k;
  for (let j = 0; j < sp; j++) {
    const a = phase + ((j + 0.5) / sp) * TAU;
    let t = M(at(r * 1.02, a));
    for (let q = 1; q <= 4; q++) t += L(at(r * (1.02 + q * 0.07), a + (q % 2 ? 0.035 : -0.035)));
    h += t;
  }
  const cham = Math.max(1, Math.min(16, d.discoverers));
  for (let j = 0; j < cham; j++) o += circle(at(r * 0.92, phase + (j / cham) * TAU), r * 0.03);
  return { o, s, h };
}

function ring(d: SpecimenData, r: number, phase: number, rand: () => number): Lines {
  const k = pick(rand, [3, 5]), c: P = [0, 0];
  const v = Array.from({ length: k }, (_, j) => at(r * 0.82, phase + (j / k) * TAU));
  let o = circle(c, r * 0.6), s = circle(c, r * 0.52), h = crescent(c, r * 0.58, 4);
  v.forEach((p, j) => {
    const q = v[(j + 1) % k], a = phase + (j / k) * TAU;
    s += line(p, q);
    o += circle(p, r * 0.1);
    // Branching spine at each vertex.
    const tip = at(r * 1.12, a);
    s += line(at(r * 0.92, a), tip) + line(tip, at(r * 1.3, a - 0.12)) + line(tip, at(r * 1.3, a + 0.12));
  });
  const cham = Math.max(1, Math.min(12, d.discoverers));
  for (let j = 0; j < cham; j++) h += circle(at(r * 0.3, phase + (j / cham) * TAU), r * 0.05);
  const sp = spinesOf(d.forks);
  for (let j = 0; j < sp; j++) h += line(at(r * 0.6, phase + (j / sp) * TAU), at(r * 0.72, phase + (j / sp) * TAU));
  return { o, s, h };
}

const PLANS = { disc, lattice, medusa, ring };

/** Grow one specimen of radius `r`. Same data, same organism. */
export function grow(d: SpecimenData, r: number, phase = 0): Grown {
  const rand = rng(hash(d.name));
  const lines = PLANS[orderOf(d.language).body](d, r, phase, rand);
  return { ...lines, wash: blob([0, 0], r * 0.42, rand) };
}

// ── The colony: PLATE I ─────────────────────────────────────────────────────
export type Slot = { fig: number; data: SpecimenData; x: number; y: number; r: number; theta: number; grown: Grown };
export type Colony = {
  size: number;
  slots: Slot[];
  shell: Lines & { wash: string; cells: string };
  spines: Lines;
  vacant: { x: number; y: number; rx: number; ry: number };
};

/**
 * The society as one composite organism: a lattice shell whose cells are the builders (plus one vacant cell),
 * with each tool grown on a radial spine. Tools must arrive ranked (fig. 1 first): fig. 1 sits on the axis at the top,
 * then the figures alternate right and left, so the plate is bilaterally balanced and leaves a gap at the foot.
 */
export function colony(tools: SpecimenData[], cells: number[], size = 1000): Colony {
  const C: P = [size / 2, size / 2], R = size / 2;
  const ringR = R * 0.7, shellR = R * 0.33;
  // Size: log of stars, fitted so the specimens fill ~62% of the ring, and fig. 1 never outgrows its slot.
  const w = tools.map((t) => 1 + 0.36 * Math.log10(t.stars + 1));
  const fit = Math.min((0.78 * TAU * ringR) / (2 * w.reduce((a, b) => a + b, 0)), (R * 0.2) / Math.max(...w));
  const radii = w.map((v) => v * fit);

  const theta = new Array<number>(tools.length).fill(0);
  const footGap = 0.3; // radians kept clear at the foot for the vacant cell's leader
  const half = (i: number) => (radii[i] + R * 0.02) / ringR;
  for (const side of [1, -1]) {
    const idx = tools.map((_, i) => i).filter((i) => i > 0 && (i % 2 === 1) === (side === 1));
    const need = half(0) + idx.reduce((a, i) => a + 2 * half(i), 0) + footGap / 2;
    const extra = Math.max(0, Math.PI - need) / (idx.length + 1);
    let a = half(0) + extra;
    for (const i of idx) {
      a += half(i);
      theta[i] = side * a;
      a += half(i) + extra;
    }
  }

  const slots: Slot[] = tools.map((t, i) => {
    const x = C[0] + ringR * Math.sin(theta[i]), y = C[1] - ringR * Math.cos(theta[i]);
    return { fig: i + 1, data: t, x, y, r: radii[i], theta: theta[i], grown: grow(t, radii[i], Math.atan2(C[1] - y, C[0] - x)) };
  });

  // Shell: builders as lattice cells (most contributions face the viewer), one vacant cell on the axis below centre.
  const pts = hemisphere(cells.length + 1);
  const vi = pts.reduce((best, p, i) => (Math.abs(p[2] - 0.6) < Math.abs(pts[best][2] - 0.6) ? i : best), 0);
  const turn = Math.PI / 2 - Math.atan2(pts[vi][1], pts[vi][0]); // rotate the vacant cell onto the downward axis
  const sorted = [...cells].sort((a, b) => b - a);
  const maxC = Math.log10(Math.max(2, sorted[0] ?? 2));
  const proj = pts.map(([x, y, z]) => {
    const a = Math.atan2(y, x) + turn, rr = Math.hypot(x, y);
    return { p: [C[0] + shellR * 0.86 * rr * Math.cos(a), C[1] + shellR * 0.86 * rr * Math.sin(a)] as P, z, a };
  });
  let cellsD = "", bars = "", vacant = { x: 0, y: 0, rx: 0, ry: 0 };
  let k = 0;
  proj.forEach((q, i) => {
    const pr = shellR * 0.115;
    if (i === vi) {
      vacant = { x: q.p[0], y: q.p[1], rx: pr * (0.4 + 0.6 * q.z), ry: pr };
      return;
    }
    const c = sorted[k++] ?? 1, big = pr * (0.75 + 0.25 * (Math.log10(c + 1) / maxC));
    cellsD += ellipse(q.p, big * (0.4 + 0.6 * q.z), big, q.a) + ellipse(q.p, big * 0.55 * (0.4 + 0.6 * q.z), big * 0.55, q.a);
  });
  // Lattice bars between neighbouring cells (nearest three on the sphere).
  pts.forEach((a, i) => {
    pts
      .map((b, j) => ({ j, d: Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) }))
      .filter((e) => e.j > i)
      .sort((x, y) => x.d - y.d)
      .slice(0, 3)
      .forEach(({ j }) => {
        const p = proj[i].p, q = proj[j].p, dx = q[0] - p[0], dy = q[1] - p[1], len = Math.hypot(dx, dy), cut = shellR * 0.12;
        if (len > cut * 2.2) bars += line([p[0] + (dx / len) * cut, p[1] + (dy / len) * cut], [q[0] - (dx / len) * cut, q[1] - (dy / len) * cut]);
      });
  });
  const shell = {
    o: circle(C, shellR) + circle(C, shellR * 0.4),
    s: circle(C, shellR * 0.95) + bars + circle(C, shellR * 0.33),
    h: crescent(C, shellR * 0.93, 9) + crescent(C, shellR * 0.38, 4),
    cells: cellsD,
    wash: blob(C, shellR * 0.36, rng(hash("Societas aperta"))),
  };

  // Spines: a tube from the shell to each specimen, with whorls of barbs; fine radial hairs between.
  let so = "", ss = "", sh = "";
  slots.forEach((sl) => {
    const a = Math.atan2(sl.y - C[1], sl.x - C[0]), end = ringR - sl.r * 1.02;
    // Tapered, three-edged spine (Acanthometra): two outlines converging, a ridge down the middle.
    so += M(at(shellR, a - 7 / shellR, C)) + L(at(end, a - 1.6 / end, C)) + M(at(shellR, a + 7 / shellR, C)) + L(at(end, a + 1.6 / end, C));
    sh += line(at(shellR + 6, a, C), at(end - 4, a, C));
    ss += circle(at(shellR + 6, a, C), 5);
    for (const t of [0.4, 0.7]) {
      const rr = shellR + (end - shellR) * t, b = at(rr, a, C);
      for (const side of [-1, 1]) ss += line(b, at(rr + 10, a + side * (14 / rr), C));
    }
  });
  // The arcade: a web of sagging arches strung between neighbouring spines, doubled, knotted at each spine.
  const arcR = shellR * 1.42;
  const ring2 = [...slots].sort((p, q) => Math.atan2(p.y - C[1], p.x - C[0]) - Math.atan2(q.y - C[1], q.x - C[0]));
  ring2.forEach((p, i) => {
    const q = ring2[(i + 1) % ring2.length];
    const a1 = Math.atan2(p.y - C[1], p.x - C[0]);
    let a2 = Math.atan2(q.y - C[1], q.x - C[0]);
    if (a2 <= a1) a2 += TAU;
    for (const [rr, sag, into] of [[arcR, 0.9, "o"], [arcR * 1.1, 0.93, "s"], [arcR * 0.9, 0.9, "h"]] as const) {
      const cp = at(rr * sag, (a1 + a2) / 2, C), e = at(rr, a2, C);
      const d = M(at(rr, a1, C)) + `Q${f(cp[0])} ${f(cp[1])} ${f(e[0])} ${f(e[1])}`;
      if (into === "o") so += d;
      else if (into === "s") ss += d;
      else sh += d;
    }
    ss += circle(at(arcR, a1, C), 3.2);
  });
  const sorted2 = [...slots].sort((p, q) => Math.atan2(p.y - C[1], p.x - C[0]) - Math.atan2(q.y - C[1], q.x - C[0]));
  sorted2.forEach((p, i) => {
    const q = sorted2[(i + 1) % sorted2.length];
    const a1 = Math.atan2(p.y - C[1], p.x - C[0]);
    let a2 = Math.atan2(q.y - C[1], q.x - C[0]);
    if (a2 <= a1) a2 += TAU;
    const mid = (a1 + a2) / 2;
    if (Math.abs(Math.sin(mid) - 1) < 0.02) return; // the foot stays clear for the vacant cell's leader
    sh += line(at(shellR, mid, C), at(shellR * 1.3, mid, C));
    sh += line(at(shellR, (a1 + mid) / 2, C), at(shellR * 1.16, (a1 + mid) / 2, C)) + line(at(shellR, (mid + a2) / 2, C), at(shellR * 1.16, (mid + a2) / 2, C));
  });

  return { size, slots, shell, spines: { o: so, s: ss, h: sh }, vacant };
}
