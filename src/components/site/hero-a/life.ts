// Conway's Game of Life on a torus (B3/S23): a cell is born with 3 neighbours, lives with 2 or 3, and dies alone.

/** One generation from `a` into `b`. Returns the population. */
export function step(a: Uint8Array, b: Uint8Array, w: number, h: number) {
  let pop = 0;
  for (let y = 0; y < h; y++) {
    const up = ((y + h - 1) % h) * w;
    const row = y * w;
    const dn = ((y + 1) % h) * w;
    for (let x = 0; x < w; x++) {
      const l = (x + w - 1) % w;
      const r = (x + 1) % w;
      const n = a[up + l] + a[up + x] + a[up + r] + a[row + l] + a[row + r] + a[dn + l] + a[dn + x] + a[dn + r];
      const alive = n === 3 || (n === 2 && a[row + x] === 1) ? 1 : 0;
      b[row + x] = alive;
      pop += alive;
    }
  }
  return pop;
}

type Cells = [number, number][];

// Small seeds that move or grow for a while, so the society keeps changing.
const PATTERNS: Record<string, Cells> = {
  glider: [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]],
  "r-pentomino": [[1, 0], [2, 0], [0, 1], [1, 1], [1, 2]],
  lwss: [[1, 0], [4, 0], [0, 1], [0, 2], [4, 2], [0, 3], [1, 3], [2, 3], [3, 3]],
  "pi-heptomino": [[0, 0], [1, 0], [2, 0], [0, 1], [2, 1], [0, 2], [2, 2]],
  "b-heptomino": [[0, 0], [2, 0], [3, 0], [0, 1], [1, 1], [2, 1], [1, 2]],
};
const NAMES = Object.keys(PATTERNS);

/** FNV-1a: the same login always grows the same organism. */
export function hash(s: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193);
  return h >>> 0;
}

/** A builder's organism: pattern name plus its cells, turned and mirrored by the login's hash. */
export function organism(login: string) {
  const h = hash(login);
  const name = NAMES[h % NAMES.length];
  const rot = (h >>> 8) & 3;
  const flip = (h >>> 10) & 1;
  const cells = PATTERNS[name].map(([x, y]) => {
    const fx = flip ? -x : x;
    return rot === 0 ? [fx, y] : rot === 1 ? [-y, fx] : rot === 2 ? [-fx, -y] : [y, -fx];
  }) as Cells;
  return { name, cells };
}

/** Writes `cells` into the grid around (cx, cy), wrapping at the edges. Calls `born` for each new cell. */
export function plant(grid: Uint8Array, w: number, h: number, cx: number, cy: number, cells: Cells, born?: (i: number) => void) {
  for (const [x, y] of cells) {
    const i = (((cy + y) % h) + h) % h * w + ((((cx + x) % w) + w) % w);
    if (!grid[i]) born?.(i);
    grid[i] = 1;
  }
}

/** One slot per builder on an even lattice, nudged by the hash: 24 builders, 24 seeds. */
export function slots(n: number, w: number, h: number) {
  const cols = Math.max(1, Math.round(Math.sqrt((n * w) / h)));
  const rows = Math.ceil(n / cols);
  return Array.from({ length: n }, (_, i) => {
    const c = i % cols;
    const r = Math.floor(i / cols);
    return [Math.floor(((c + 0.5) * w) / cols), Math.floor(((r + 0.5) * h) / rows)] as [number, number];
  });
}
