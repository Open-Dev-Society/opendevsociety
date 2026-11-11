// Writes public/cert-field.svg: the certificate's watermark, the hero's Turing field (field.ts) frozen.
// Gray–Scott on a 297:210 grid, spots drifting into coral left to right, Bayer 8×8 dithered to 1 bit,
// one SVG path of horizontal runs. Static on purpose: a <canvas> doesn't survive cloneNode into the print clone.
//   node scripts/cert-field.mjs
import { writeFileSync } from "node:fs";

const W = 198, H = 140, STEPS = 9000;
const SPOTS = [0.0367, 0.0649], CORAL = [0.0545, 0.062];
const BAYER = [0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21];

// Seeded, so the file is the same every run.
let seed = 1952;
const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);

let u = new Float32Array(W * H).fill(1), v = new Float32Array(W * H);
let nu = new Float32Array(W * H), nv = new Float32Array(W * H);
for (let k = 0; k < 60; k++) {
  const cx = Math.floor(rand() * W), cy = Math.floor(rand() * H), r = 2 + Math.floor(rand() * 3);
  for (let y = cy - r; y <= cy + r; y++)
    for (let x = cx - r; x <= cx + r; x++) {
      const i = ((y + H) % H) * W + ((x + W) % W);
      u[i] = 0.5;
      v[i] = 0.25 + 0.25 * rand();
    }
}

const smooth = (a, b, t) => ((t = Math.min(1, Math.max(0, (t - a) / (b - a)))), t * t * (3 - 2 * t));
const fk = Array.from({ length: W }, (_, x) => {
  const m = smooth(0.2, 0.85, x / W);
  return [SPOTS[0] + (CORAL[0] - SPOTS[0]) * m, SPOTS[1] + (CORAL[1] - SPOTS[1]) * m];
});

for (let s = 0; s < STEPS; s++) {
  for (let y = 0; y < H; y++) {
    const up = ((y + H - 1) % H) * W, dn = ((y + 1) % H) * W, row = y * W;
    for (let x = 0; x < W; x++) {
      const l = (x + W - 1) % W, r = (x + 1) % W, i = row + x;
      const lap = (a) => -a[i] + 0.2 * (a[row + l] + a[row + r] + a[up + x] + a[dn + x]) + 0.05 * (a[up + l] + a[up + r] + a[dn + l] + a[dn + r]);
      const [f, k] = fk[x], uvv = u[i] * v[i] * v[i];
      nu[i] = u[i] + lap(u) - uvv + f * (1 - u[i]);
      nv[i] = v[i] + 0.5 * lap(v) + uvv - (f + k) * v[i];
    }
  }
  [u, nu] = [nu, u];
  [v, nv] = [nv, v];
}

let d = "";
for (let y = 0; y < H; y++) {
  let start = -1;
  for (let x = 0; x <= W; x++) {
    const on = x < W && smooth(0.1, 0.42, v[y * W + x]) > (BAYER[(y % 8) * 8 + (x % 8)] + 0.5) / 64;
    if (on && start < 0) start = x;
    if (!on && start >= 0) {
      d += `M${start} ${y}h${x - start}v1h${start - x}z`;
      start = -1;
    }
  }
}

writeFileSync(
  new URL("../public/cert-field.svg", import.meta.url),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" shape-rendering="crispEdges"><path fill="#10777b" d="${d}"/></svg>\n`,
);
console.log(`cert-field.svg: ${(d.length / 1024).toFixed(0)} KB of path`);
