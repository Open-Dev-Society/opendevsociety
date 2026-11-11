// The seismograph's pure parts: lane order, month ticks, and the 1-bit trace drawn into a canvas.

type Ordered = { name: string; stars: number; weeks: number[] };
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

/** Most alive first: commits in the last 8 weeks, then in the last 52, then stars. */
export const byActivity = (a: Ordered, b: Ordered) =>
  sum(b.weeks.slice(-8)) - sum(a.weeks.slice(-8)) || sum(b.weeks) - sum(a.weeks) || b.stars - a.stars;
export const byStars = (a: Ordered, b: Ordered) => b.stars - a.stars || a.name.localeCompare(b.name);

export type Tick = { at: number; label: string; /** Too close to the end for a label after it: set flush right instead. */ end?: boolean };
const month = (t: number) =>
  new Date(t).toLocaleDateString("en-GB", { month: "short", year: new Date(t).getUTCMonth() ? undefined : "numeric", timeZone: "UTC" });

/** Month starts between `from` and `to` (ms), as 0..1 along the axis; the year shows on January only. */
export function monthTicks(from: number, to: number): Tick[] {
  const d = new Date(from);
  const ticks: Tick[] = [];
  for (let m = Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1); m <= to; ) {
    const next = new Date(m);
    ticks.push({ at: (m - from) / (to - from), label: month(m) });
    m = Date.UTC(next.getUTCFullYear(), next.getUTCMonth() + 1, 1);
  }
  const last = ticks[ticks.length - 1];
  if (last && last.at > 0.92) last.end = true;
  return ticks;
}

// 4×4 Bayer: the stipple under the trace's envelope.
const BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const STIPPLE = 3; // of 16: how dense the envelope's dither is
const STEP = 3; // css px between the pen's zigzag samples

/** A deterministic 0..1 per (seed, i): the same scribble on every render. */
function rand(seed: number, i: number) {
  let h = (seed ^ Math.imul(i + 1, 0x9e3779b1)) >>> 0;
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
export const seedOf = (s: string) => [...s].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619), 2166136261);

/** `css` (any CSS colour) as sRGB bytes. */
export function rgb(css: string): [number, number, number] {
  const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true })!;
  ctx.fillStyle = "#10777b";
  ctx.fillStyle = css;
  ctx.fillRect(0, 0, 1, 1);
  const d = ctx.getImageData(0, 0, 1, 1).data;
  return [d[0], d[1], d[2]];
}

/**
 * One lane's trace, 1-bit on transparent, on a grid of whole CSS pixels (each dpr×dpr device pixels, so it stays crisp):
 * a dotted centre line, a Bayer stipple filling each week's envelope, and the pen's zigzag through it.
 * Amplitude is log-scaled to `max`, the busiest week of any lane, so lanes compare.
 */
export function drawTrace(canvas: HTMLCanvasElement, weeks: number[], max: number, color: [number, number, number], seed: number) {
  const dpr = Math.max(1, Math.min(3, Math.round(devicePixelRatio || 1)));
  const w = canvas.clientWidth, h = canvas.clientHeight;
  if (!w || !h) return;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(w * dpr, h * dpr);
  const px = img.data;
  const dot = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    for (let dy = 0; dy < dpr; dy++)
      for (let dx = 0; dx < dpr; dx++) {
        const i = ((y * dpr + dy) * w * dpr + x * dpr + dx) * 4;
        px[i] = color[0];
        px[i + 1] = color[1];
        px[i + 2] = color[2];
        px[i + 3] = 255;
      }
  };
  const mid = Math.floor(h / 2);
  const top = mid - 1; // the most a trace swings either way
  const scale = Math.log1p(Math.max(1, max));
  const amp = (x: number) => {
    const c = weeks[Math.min(weeks.length - 1, Math.floor((x / w) * weeks.length))];
    return c ? Math.max(1.5, (top * Math.log1p(c)) / scale) : 0;
  };

  for (let x = 0; x < w; x++) {
    const a = Math.round(amp(x));
    if (!a && x % 2 === 0) dot(x, mid);
    for (let y = mid - a; y <= mid + a; y++) if (BAYER4[(x & 3) + (y & 3) * 4] < STIPPLE) dot(x, y);
  }

  // The pen: alternate up and down each STEP, a random share of the envelope, joined by Bresenham lines.
  let x0 = 0, y0 = mid;
  for (let k = 1, x1 = STEP; x0 < w; k++, x1 += STEP) {
    const a = amp(Math.min(x1, w - 1));
    const y1 = Math.round(mid + (k % 2 ? -1 : 1) * a * (0.3 + 0.7 * rand(seed, k)));
    let x = x0, y = y0;
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
    for (let err = dx + dy; ; ) {
      dot(x, y);
      if (x === x1 && y === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) {
        err += dy;
        x += 1;
      }
      if (e2 <= dx) {
        err += dx;
        y += sy;
      }
    }
    x0 = x1;
    y0 = y1;
  }
  ctx.putImageData(img, 0, 0);
}
