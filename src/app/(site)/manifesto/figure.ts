// The manifesto's figure: the hero's pattern grown from a single seed. The hero's reaction (Gray–Scott, coral regime, same Laplacian) run once
// on the server, sampled at three times and set 1-bit through the same Bayer 8×8, as a PNG used for a CSS mask so
// the ink follows the theme. Deterministic, so the figure never changes between builds.
import { crc32, deflateSync } from "node:zlib";
import { REGIMES } from "@/components/site/lab-hero/field";

const BAYER = [0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21];

export const N = 72; // sim cells per side
export const CELLS = 108; // dither cells per side (1.5 per sim cell, as in the hero)
export const STEPS = [600, 2200, 7000];
export const SEED = [30, 38] as const; // sim cell of the seed, a little off centre

// mulberry32: the seed's ragged edge, the same every time.
function rng(a: number) {
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function simulate() {
  const [f, k] = REGIMES.coral;
  const rand = rng(1952);
  let u = new Float32Array(N * N).fill(1), v = new Float32Array(N * N), nu = new Float32Array(N * N), nv = new Float32Array(N * N);
  for (let y = -3; y <= 3; y++)
    for (let x = -3; x <= 3; x++)
      if (x * x + y * y <= 9 + 4 * rand()) {
        const i = (SEED[1] + y) * N + SEED[0] + x;
        u[i] = 0.5;
        v[i] = 0.25 + 0.25 * rand();
      }
  const c = (n: number) => (n < 0 ? 0 : n >= N ? N - 1 : n);
  const out: Float32Array[] = [];
  for (let t = 1; t <= STEPS[STEPS.length - 1]; t++) {
    for (let y = 0; y < N; y++) {
      const ym = c(y - 1) * N, yp = c(y + 1) * N, y0 = y * N;
      for (let x = 0; x < N; x++) {
        const xm = c(x - 1), xp = c(x + 1), i = y0 + x;
        const lu = -u[i] + 0.2 * (u[y0 + xm] + u[y0 + xp] + u[ym + x] + u[yp + x]) + 0.05 * (u[ym + xm] + u[ym + xp] + u[yp + xm] + u[yp + xp]);
        const lv = -v[i] + 0.2 * (v[y0 + xm] + v[y0 + xp] + v[ym + x] + v[yp + x]) + 0.05 * (v[ym + xm] + v[ym + xp] + v[yp + xm] + v[yp + xp]);
        const a = u[i], b = v[i], abb = a * b * b;
        nu[i] = Math.min(1, Math.max(0, a + lu - abb + f * (1 - a)));
        nv[i] = Math.min(1, Math.max(0, b + 0.5 * lv + abb - (f + k) * b));
      }
    }
    [u, nu] = [nu, u];
    [v, nv] = [nv, v];
    if (STEPS.includes(t)) out.push(v.slice());
  }
  return out;
}

// One frame as 1-bit rows: bilinear V, the hero's tone curve, Bayer threshold.
function dither(v: Float32Array) {
  const stride = Math.ceil(CELLS / 8), bits = new Uint8Array(CELLS * stride);
  const s = (N - 1) / (CELLS - 1);
  for (let y = 0; y < CELLS; y++)
    for (let x = 0; x < CELLS; x++) {
      const sx = x * s, sy = y * s, x0 = Math.floor(sx), y0 = Math.floor(sy), x1 = Math.min(N - 1, x0 + 1), y1 = Math.min(N - 1, y0 + 1);
      const fx = sx - x0, fy = sy - y0;
      const b = (v[y0 * N + x0] * (1 - fx) + v[y0 * N + x1] * fx) * (1 - fy) + (v[y1 * N + x0] * (1 - fx) + v[y1 * N + x1] * fx) * fy;
      const t = Math.min(1, Math.max(0, (b - 0.1) / 0.32)), tone = t * t * (3 - 2 * t);
      if (tone > (BAYER[(y & 7) * 8 + (x & 7)] + 0.5) / 64) bits[y * stride + (x >> 3)] |= 0x80 >> (x & 7);
    }
  return { bits, stride };
}

// A 1-bit palette PNG: index 0 clear, index 1 opaque. Only its alpha matters (it is a mask).
function png({ bits, stride }: { bits: Uint8Array; stride: number }) {
  const chunk = (type: string, data: Uint8Array) => {
    const b = Buffer.alloc(12 + data.length);
    b.writeUInt32BE(data.length, 0);
    b.write(type, 4, "ascii");
    b.set(data, 8);
    b.writeUInt32BE(crc32(b.subarray(4, 8 + data.length)), 8 + data.length);
    return b;
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(CELLS, 0);
  ihdr.writeUInt32BE(CELLS, 4);
  ihdr.set([1, 3, 0, 0, 0], 8); // bit depth 1, palette, deflate, no filter, no interlace
  const raw = new Uint8Array(CELLS * (stride + 1));
  for (let y = 0; y < CELLS; y++) raw.set(bits.subarray(y * stride, (y + 1) * stride), y * (stride + 1) + 1);
  const file = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("PLTE", new Uint8Array(6)),
    chunk("tRNS", new Uint8Array([0, 255])),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", new Uint8Array()),
  ]);
  return `data:image/png;base64,${file.toString("base64")}`;
}

let frames: string[] | undefined;
/** The figure's three panels as PNG data URLs, computed once per server process (~0.3s). */
export const figureFrames = () => (frames ??= simulate().map((v) => png(dither(v))));
