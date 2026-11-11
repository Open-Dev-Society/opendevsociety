// Where each colony sits: a deterministic packing (same input, same picture, every load), in fractions of the field.
// x and r are fractions of the field's width, y of its height; `aspect` is the field's height / width.

export type Spot = { x: number; y: number; r: number };
export type Layout = { aspect: number; spots: Spot[] };

/** 0..1 by stars on a log scale, so 21k stars is big and 0 stars still shows. */
const scale = (stars: number[]) => {
  const max = Math.log1p(Math.max(1, ...stars));
  return stars.map((s) => Math.log1p(s) / max);
};

/**
 * Desktop: the biggest colony anchors the left third; each next one (most stars first) takes the point with the most
 * room around it, nudged toward a slow S-curve across the field so the whole reads as one culture, not a scatter.
 * `stars` must be sorted, most first.
 */
export function packDesktop(stars: number[], aspect = 0.58): Layout {
  const f = scale(stars);
  const R0 = 0.03, R1 = 0.155; // radius range, fractions of width
  const LABEL = 0.032; // room under each colony for its name, fractions of width
  const H = aspect;
  const placed: { x: number; y: number; r: number }[] = [];
  const flow = (x: number) => H * (0.5 + 0.16 * Math.sin(x * Math.PI * 2 - 0.6));
  // Free room at (x, y) for a colony of radius r: distance to the nearest neighbour's edge or wall. A colony and the
  // name under it count as one circle, centred half a label lower and half a label wider.
  const room = (x: number, y: number, r: number) => {
    let m = Math.min(x - r, 1 - x - r, y - r, H - y - r - LABEL);
    for (const p of placed) m = Math.min(m, Math.hypot(x - p.x, y - p.y) - p.r - r - LABEL);
    return m;
  };
  for (let i = 0; i < f.length; i++) {
    const r = R0 + (R1 - R0) * f[i];
    if (i === 0) {
      placed.push({ x: 0.27, y: flow(0.27), r });
      continue;
    }
    let best = { x: 0.5, y: H / 2, s: -Infinity };
    for (let x = r; x <= 1 - r; x += 0.004)
      for (let y = r; y <= H - r; y += 0.004) {
        const m = room(x, y, r);
        if (m < 0.012) continue;
        // Prefer room, then closeness to the curve; capped so the biggest holes don't swallow everything.
        const s = Math.min(m, 0.06) - 0.35 * Math.abs(y - flow(x));
        if (s > best.s) best = { x, y, s };
      }
    placed.push({ x: best.x, y: best.y, r });
  }
  return { aspect: H, spots: placed.map(({ x, y, r }) => ({ x, y: y / H, r })) };
}

/** Phones: the biggest colony alone on the first row, then two columns, each row as tall as its larger colony needs. */
export function packMobile(stars: number[]): Layout {
  const f = scale(stars);
  const r = (i: number) => (i === 0 ? 0.3 : 0.075 + 0.13 * f[i]);
  const LABEL = 0.11, GAP = 0.05;
  const rows: number[][] = [[0]];
  for (let i = 1; i < f.length; i += 2) rows.push(i + 1 < f.length ? [i, i + 1] : [i]);
  const spots: Spot[] = [];
  let y = GAP;
  for (const row of rows) {
    const h = 2 * Math.max(...row.map(r)) + LABEL;
    row.forEach((i, k) => {
      // A small, fixed sway off the column centre keeps the grid from reading as a table.
      const sway = row.length === 1 ? 0 : (((i * 37) % 7) - 3) * 0.012;
      spots[i] = { x: row.length === 1 ? 0.5 : (k ? 0.74 : 0.26) + sway, y: y + h / 2 - LABEL / 2, r: r(i) };
    });
    y += h + GAP;
  }
  return { aspect: y, spots: spots.map((s) => ({ ...s, y: s.y / y })) };
}
