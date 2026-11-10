"use client";

import { useEffect, useRef } from "react";
import { watchTheme } from "../lab-hero/field";

type Matrix = 4 | 8 | "atkinson";

export type DitherProps = {
  /** Public path ("/shots/x.jpg") or a CORS-enabled URL (GitHub avatars are). */
  src: string;
  alt: string;
  /** Intrinsic size: only the ratio is used, to reserve the box before anything loads (no CLS). */
  width: number;
  height: number;
  /** teal ink on paper (default), or rose: "yours / you / vacant / new". */
  variant?: "teal" | "mark";
  /** 1-bit: one ink on paper. duotone: ink (--fg) for the shadows, the colour for the mid-tones, paper for the lights. */
  tone?: "1bit" | "duotone";
  matrix?: Matrix;
  /** CSS px per dither cell at full resolution. */
  cell?: number;
  /** Print as a negative: light strokes take the ink. For dark UIs (most screenshots), which otherwise flood with colour. */
  negative?: boolean;
  /** Which part of the image survives the crop: screenshots want "top". */
  align?: "top" | "center";
  /** Rests coarse (5× cell), and resolves to `cell` in hard steps on hover/focus of the closest link or [data-develop] (on touch: once, when in view). */
  develop?: boolean;
  /** Above the fold: load now instead of when near the viewport. */
  eager?: boolean;
  className?: string;
};

const BAYER8 = [0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21];
const BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
// The darkroom: coarse to fine, one hard step each.
const STEPS = [5, 3, 2, 1];
const STEP_MS = 110;

type RGB = [number, number, number];

/** A token as sRGB bytes, resolved where `el` sits; the fallback (the logo hex) if the token is missing, never black. */
function token(el: Element, name: string, fallback: string): RGB {
  const probe = el.appendChild(document.createElement("i"));
  probe.hidden = true;
  probe.style.color = `var(${name}, ${fallback})`;
  const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true })!;
  ctx.fillStyle = fallback;
  ctx.fillStyle = getComputedStyle(probe).color;
  probe.remove();
  ctx.fillRect(0, 0, 1, 1);
  const d = ctx.getImageData(0, 0, 1, 1).data;
  return [d[0], d[1], d[2]];
}

/** Luminance 0..1 of `img` cover-cropped to gw×gh, contrast-stretched (2nd–98th percentile) so flat screenshots still read. */
function sample(img: HTMLImageElement, gw: number, gh: number, align: "top" | "center", negative: boolean) {
  const c = document.createElement("canvas");
  c.width = gw;
  c.height = gh;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  const s = Math.min(img.naturalWidth / gw, img.naturalHeight / gh);
  const sw = gw * s, sh = gh * s;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, (img.naturalWidth - sw) / 2, align === "top" ? 0 : (img.naturalHeight - sh) / 2, sw, sh, 0, 0, gw, gh);
  const px = ctx.getImageData(0, 0, gw, gh).data;
  const L = new Float32Array(gw * gh);
  for (let i = 0; i < L.length; i++) L[i] = (0.2126 * px[i * 4] + 0.7152 * px[i * 4 + 1] + 0.0722 * px[i * 4 + 2]) / 255;
  const sorted = L.slice().sort();
  const lo = sorted[Math.floor(L.length * 0.02)], hi = sorted[Math.floor(L.length * 0.98)];
  const span = Math.max(hi - lo, 0.1);
  for (let i = 0; i < L.length; i++) {
    const v = Math.min(1, Math.max(0, (L[i] - lo) / span));
    L[i] = negative ? 1 - v : v;
  }
  return L;
}

/** Quantises L (in place) to `levels` steps; returns the level per cell, 0 = darkest. */
function dither(L: Float32Array, gw: number, gh: number, levels: number, matrix: Matrix) {
  const out = new Uint8Array(L.length);
  const n = levels - 1;
  if (matrix === "atkinson") {
    for (let y = 0; y < gh; y++)
      for (let x = 0; x < gw; x++) {
        const i = y * gw + x;
        const q = Math.min(n, Math.max(0, Math.round(L[i] * n)));
        out[i] = q;
        const e = (L[i] - q / n) / 8;
        for (const [dx, dy] of [[1, 0], [2, 0], [-1, 1], [0, 1], [1, 1], [0, 2]]) {
          const xx = x + dx, yy = y + dy;
          if (xx >= 0 && xx < gw && yy < gh) L[yy * gw + xx] += e;
        }
      }
    return out;
  }
  const [m, size] = matrix === 4 ? [BAYER4, 4] : [BAYER8, 8];
  for (let y = 0; y < gh; y++)
    for (let x = 0; x < gw; x++) {
      const i = y * gw + x;
      const t = (m[(y % size) * size + (x % size)] + 0.5) / (size * size);
      out[i] = Math.min(n, Math.floor(L[i] * n + t));
    }
  return out;
}

const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * An image as the lab prints it: ordered dither (Bayer 8×8 by default) in token colours. The box is reserved by aspect
 * ratio and shows a paper placeholder until the image is near the viewport and loaded; the alt text sits on the box.
 */
export function Dither({
  src,
  alt,
  width,
  height,
  variant = "teal",
  tone = "1bit",
  matrix = 8,
  cell = 2,
  negative = false,
  align = "center",
  develop = false,
  eager = false,
  className = "",
}: DitherProps) {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = box.current!, c = canvas.current!;
    let img: HTMLImageElement | null = null;
    let step = develop && !reduced() ? 0 : STEPS.length - 1;
    let timer = 0;
    const cleanups: (() => void)[] = [];

    const draw = () => {
      if (!img) return;
      const w = el.clientWidth, h = el.clientHeight;
      if (!w || !h) return;
      const size = cell * STEPS[step];
      const gw = Math.max(1, Math.round(w / size)), gh = Math.max(1, Math.round(h / size));
      const ink = variant === "mark" ? token(el, "--mark", "#d03c5c") : token(el, "--accent-brand", "#10777b");
      const paper = token(el, "--bg", "#f8f9fa");
      const palette: RGB[] = tone === "duotone" ? [token(el, "--fg", "#051c20"), ink, paper] : [ink, paper];
      const q = dither(sample(img, gw, gh, align, negative), gw, gh, palette.length, matrix);
      const small = document.createElement("canvas");
      small.width = gw;
      small.height = gh;
      const sctx = small.getContext("2d")!;
      const data = sctx.createImageData(gw, gh);
      for (let i = 0; i < q.length; i++) data.data.set([...palette[q[i]], 255], i * 4);
      sctx.putImageData(data, 0, 0);
      // Scale up with nearest-neighbour at device resolution, so cells stay crisp squares.
      const dpr = devicePixelRatio || 1;
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
      const ctx = c.getContext("2d")!;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(small, 0, 0, c.width, c.height);
      c.dataset.ready = "";
    };

    // Hard steps toward `to`, one every STEP_MS.
    const go = (to: number) => {
      clearInterval(timer);
      if (reduced()) to = STEPS.length - 1;
      timer = window.setInterval(() => {
        if (step === to) return clearInterval(timer);
        step += Math.sign(to - step);
        draw();
      }, STEP_MS);
    };

    const load = () => {
      const i = new Image();
      i.crossOrigin = "anonymous";
      i.decoding = "async";
      i.onload = () => {
        img = i;
        draw();
      };
      i.src = src;
    };

    if (eager) load();
    else {
      const io = new IntersectionObserver(
        (es) => {
          if (es.some((e) => e.isIntersecting)) {
            io.disconnect();
            load();
          }
        },
        { rootMargin: "300px" },
      );
      io.observe(el);
      cleanups.push(() => io.disconnect());
    }

    if (develop) {
      if (matchMedia("(hover: none)").matches) {
        // No hover to wait for: develop once, when most of it is on screen.
        const io = new IntersectionObserver(
          (es) => {
            if (es.some((e) => e.isIntersecting)) {
              io.disconnect();
              go(STEPS.length - 1);
            }
          },
          { threshold: 0.6 },
        );
        io.observe(el);
        cleanups.push(() => io.disconnect());
      } else {
        const trigger = el.closest("a, [data-develop]") ?? el;
        const on = () => go(STEPS.length - 1);
        const off = () => go(0);
        trigger.addEventListener("pointerenter", on);
        trigger.addEventListener("pointerleave", off);
        trigger.addEventListener("focusin", on);
        trigger.addEventListener("focusout", off);
        cleanups.push(() => {
          trigger.removeEventListener("pointerenter", on);
          trigger.removeEventListener("pointerleave", off);
          trigger.removeEventListener("focusin", on);
          trigger.removeEventListener("focusout", off);
        });
      }
    }

    const ro = new ResizeObserver(() => draw());
    ro.observe(el);
    cleanups.push(() => ro.disconnect(), watchTheme(draw), () => clearInterval(timer));
    return () => cleanups.forEach((f) => f());
  }, [src, variant, tone, matrix, cell, negative, align, develop, eager]);

  return (
    <div
      ref={box}
      role="img"
      aria-label={alt}
      style={{ aspectRatio: `${width} / ${height}` }}
      // Placeholder: paper with a faint 1-bit checker, replaced by the canvas once drawn.
      className={`relative overflow-hidden bg-(--bg) bg-[repeating-conic-gradient(var(--line)_0_25%,transparent_0_50%)] bg-size-[4px_4px] ${className}`}
    >
      <canvas ref={canvas} aria-hidden className="absolute inset-0 size-full opacity-0 [image-rendering:pixelated] data-ready:opacity-100" />
    </div>
  );
}
