// A screenshot as a technical drawing: Sobel edges, thinned to one pixel (non-maximum suppression), inked in one colour
// on transparent. Drawn once per shot at 1440×900 (1:1 with a ~720px sheet at DPR 2) and kept as a canvas for the session.
// ponytail: main-thread, ~40ms per shot; move to a worker if many shots get drawn at once.
const W = 1440;
const H = 900;
const cache = new Map<string, Promise<HTMLCanvasElement>>();

/** A colour (any CSS syntax) as sRGB bytes. */
function rgb(color: string): [number, number, number] {
  const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true })!;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const d = ctx.getImageData(0, 0, 1, 1).data;
  return [d[0], d[1], d[2]];
}

export function lineart(src: string, ink: string): Promise<HTMLCanvasElement> {
  const key = `${src} ${ink}`;
  let p = cache.get(key);
  if (!p) {
    p = draw(src, rgb(ink));
    p.catch(() => cache.delete(key));
    cache.set(key, p);
  }
  return p;
}

async function draw(src: string, [r, g, b]: [number, number, number]) {
  const img = new Image();
  img.src = src;
  await img.decode();
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  // Cover-crop from the top: screenshots keep their header.
  const s = Math.min(img.naturalWidth / W, img.naturalHeight / H);
  ctx.drawImage(img, (img.naturalWidth - W * s) / 2, 0, W * s, H * s, 0, 0, W, H);
  const out = ctx.getImageData(0, 0, W, H);
  const d = out.data;

  // Luminance, then a 3×3 box blur so text and anti-aliasing don't turn into noise.
  const L = new Float32Array(W * H);
  for (let i = 0; i < L.length; i++) L[i] = 0.2126 * d[i * 4] + 0.7152 * d[i * 4 + 1] + 0.0722 * d[i * 4 + 2];
  const B = new Float32Array(W * H);
  for (let y = 1; y < H - 1; y++)
    for (let x = 1; x < W - 1; x++) {
      const i = y * W + x;
      B[i] = (L[i - W - 1] + L[i - W] + L[i - W + 1] + L[i - 1] + L[i] + L[i + 1] + L[i + W - 1] + L[i + W] + L[i + W + 1]) / 9;
    }

  // Sobel magnitude and direction (0: horizontal edge normal, 1: 45°, 2: vertical, 3: 135°).
  const M = new Float32Array(W * H);
  const dir = new Uint8Array(W * H);
  for (let y = 1; y < H - 1; y++)
    for (let x = 1; x < W - 1; x++) {
      const i = y * W + x;
      const gx = B[i - W + 1] + 2 * B[i + 1] + B[i + W + 1] - B[i - W - 1] - 2 * B[i - 1] - B[i + W - 1];
      const gy = B[i + W - 1] + 2 * B[i + W] + B[i + W + 1] - B[i - W - 1] - 2 * B[i - W] - B[i - W + 1];
      M[i] = Math.hypot(gx, gy);
      const a = ((Math.atan2(gy, gx) * 180) / Math.PI + 180) % 180;
      dir[i] = a < 22.5 || a >= 157.5 ? 0 : a < 67.5 ? 1 : a < 112.5 ? 2 : 3;
    }

  // Thresholds from the image itself: the strongest ~9% of edges, fully inked from the top 3%.
  const sample: number[] = [];
  for (let i = 0; i < M.length; i += 37) if (M[i] > 0) sample.push(M[i]);
  sample.sort((p, q) => p - q);
  const lo = Math.max(sample[Math.floor(sample.length * 0.91)] ?? 0, 24);
  const hi = Math.max(sample[Math.floor(sample.length * 0.97)] ?? 0, lo + 40);

  const step = [1, W + 1, W, W - 1];
  for (let i = 0; i < M.length; i++) {
    const m = M[i];
    const o = step[dir[i]];
    // Keep a pixel only where it's the ridge across the edge: one-pixel lines.
    const keep = m >= lo && m >= (M[i - o] ?? 0) && m >= (M[i + o] ?? 0);
    d[i * 4] = r;
    d[i * 4 + 1] = g;
    d[i * 4 + 2] = b;
    d[i * 4 + 3] = keep ? Math.min(255, 170 + (85 * (m - lo)) / (hi - lo)) : 0;
  }
  ctx.putImageData(out, 0, 0);
  return c;
}
