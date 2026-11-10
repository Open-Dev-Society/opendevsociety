"use client";

import { useEffect, useRef } from "react";

/** One recent push: a heartbeat on CH1. `w` is its height, newer pushes beat taller. */
export type Beat = { label: string; w: number };

const CPB = 18; // columns per heartbeat
const PEAK = 5; // the R wave's column within a beat
const SUB = 4; // subsamples per column, so a spike narrower than a cell still registers
const g = (x: number, m: number, s: number) => Math.exp(-(((x - m) / s) ** 2));
// One beat over phase 0..1: P bump, Q dip, R spike, S dip, T bump.
const R = (PEAK + 0.5) / CPB;
const ecg = (p: number) => 0.12 * g(p, 0.12, 0.045) - 0.16 * g(p, R - 0.05, 0.02) + g(p, R, 0.028) - 0.3 * g(p, R + 0.05, 0.02) + 0.2 * g(p, 0.6, 0.07);

/**
 * CH1: an ASCII heartbeat swept left to right like a monitor, one beat per recent push, labelled.
 * CH2: a fine line summing one sine per active builder, so the week's people read as interference.
 * Paused off-screen and in hidden tabs; a single still frame under reduced motion.
 */
export function Scope({ beats, bpm, voices, gain }: { beats: Beat[]; bpm: number; voices: number; gain: number }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current!;
    const ctx = el.getContext("2d");
    if (!ctx || !beats.length) return;
    const boot = { current: el.closest("[data-signal]")?.querySelector<HTMLElement>("[data-boot]") };
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tone = (v: string) => ((el.style.color = `var(${v})`), getComputedStyle(el).color);

    const sig = (n: number) => {
      const k = Math.floor(n / CPB);
      let v = 0;
      for (let j = 0; j < SUB; j++) {
        const s = ecg(((n % CPB) + j / SUB) / CPB);
        if (Math.abs(s) > Math.abs(v)) v = s;
      }
      return v * beats[k % beats.length].w * gain + 0.04 * Math.sin(n * 0.09);
    };

    let w = 0, h = 0, cw = 7, rh = 13, cols = 0, rows = 0, calm = false;
    let ink = "", muted = "", subtle = "";
    let ys = new Float32Array(0), born = new Int32Array(0);
    let n = 0; // absolute column the head has written
    let head = 0; // fractional head position, in columns
    let t = 0, last = 0, raf = 0, booted = still;
    let onScreen = true;

    const write = (to: number) => {
      while (n < to) {
        n++;
        ys[n % cols] = sig(n);
        born[n % cols] = n;
      }
    };

    const size = () => {
      const r = el.getBoundingClientRect();
      const dpr = Math.min(2, devicePixelRatio || 1);
      w = r.width;
      h = r.height;
      el.width = Math.round(w * dpr);
      el.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      calm = w < 640;
      ctx.font = `${calm ? 10 : 11}px ${getComputedStyle(el).fontFamily}`;
      ctx.textBaseline = "middle";
      cw = ctx.measureText("0").width || 7;
      rh = calm ? 12 : 13;
      cols = Math.max(CPB, Math.floor(w / cw));
      rows = Math.max(6, Math.floor(h / rh));
      ink = tone("--accent");
      muted = tone("--fg-muted");
      subtle = tone("--fg-subtle");
      // Refill one full sweep of history so a resize never blanks the trace.
      ys = new Float32Array(cols);
      born = new Int32Array(cols).fill(-1e9);
      const end = Math.max(n, cols);
      n = end - cols;
      head = end;
      write(end);
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const mid = rows * 0.7;
      const amp = rows * 0.56;
      const rowY = (r: number) => Math.min(rows - 1, Math.max(0, Math.floor(r))) * rh + rh / 2;

      if (!calm) {
        ctx.globalAlpha = 0.45;
        ctx.strokeStyle = subtle;
        ctx.lineWidth = 1;
        ctx.beginPath();
        const vs = Math.min(16, voices);
        const a = (rows * 0.16 * rh) / Math.sqrt(vs);
        for (let x = 0; x <= w; x += 3) {
          let y = 0;
          for (let k = 0; k < vs; k++) y += Math.sin((x / w) * Math.PI * 2 * (1.5 + k * 0.37) + k * 1.7 + t * (0.25 + (k % 5) * 0.11));
          if (x) ctx.lineTo(x, mid * rh + y * a);
          else ctx.moveTo(x, mid * rh + y * a);
        }
        ctx.stroke();
      }

      const gap = still ? 0 : 3;
      ctx.textAlign = "center";
      for (let i = 0; i < cols; i++) {
        const age = n - born[i];
        if (age >= cols - gap) continue;
        const p = (i - 1 + cols) % cols;
        const r = mid - ys[i] * amp;
        const pr = born[p] === born[i] - 1 ? mid - ys[p] * amp : r;
        const x = i * cw + cw / 2;
        ctx.globalAlpha = 1 - (age / cols) * 0.82;
        ctx.fillStyle = ink;
        const d = Math.floor(r) - Math.floor(pr);
        if (Math.abs(d) > 1) {
          const s = Math.sign(d);
          for (let y = Math.floor(pr) + s; y !== Math.floor(r) + s; y += s) ctx.fillText("|", x, rowY(y));
        } else if (d) {
          ctx.fillText(d < 0 ? "/" : "\\", x, rowY(r));
        } else {
          const f = r - Math.floor(r);
          ctx.fillText(f < 0.34 ? "¯" : f < 0.67 ? "-" : "_", x, rowY(r));
        }
        if (!calm && born[i] % CPB === PEAK) {
          const label = beats[Math.floor(born[i] / CPB) % beats.length].label;
          ctx.fillStyle = muted;
          ctx.textAlign = "left";
          if (x + cw + ctx.measureText(label).width < w) ctx.fillText(label, x + cw, rowY(r - 0.4));
          ctx.textAlign = "center";
        }
      }

      if (!still) {
        const i = n % cols;
        ctx.globalAlpha = 1;
        ctx.fillStyle = ink;
        ctx.fillText("●", i * cw + cw / 2, rowY(mid - ys[i] * amp));
      }
      ctx.globalAlpha = 1;
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;
      head += (dt * CPB * bpm) / 60 / (calm ? 1.25 : 1);
      write(Math.floor(head));
      draw();
      if (!booted && boot.current) {
        const p = Math.min(1, t / 1.4);
        const bars = Math.round(p * 8);
        boot.current.textContent = p < 1 ? `tuning ${"▮".repeat(bars)}${"▯".repeat(8 - bars)} ${String(Math.round(p * 100)).padStart(3)}%` : LOCKED;
        booted = p === 1;
      }
      raf = requestAnimationFrame(frame);
    };

    const run = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      if (still || !onScreen || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    if (still && boot.current) boot.current.textContent = LOCKED;
    size();
    const ro = new ResizeObserver(size);
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => ((onScreen = e.isIntersecting), run()));
    io.observe(el);
    document.addEventListener("visibilitychange", run);
    document.fonts?.ready.then(size);
    run();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", run);
    };
  }, [beats, bpm, voices, gain]);

  return <canvas ref={canvas} aria-hidden className="absolute inset-0 size-full font-mono" />;
}

const BOOT = "tuning ▯▯▯▯▯▯▯▯   0%";
const LOCKED = "ch1 locked · live".padEnd(BOOT.length);

/** The boot line; Scope fills it in as the trace locks on. */
export const Boot = () => (
  <span data-boot className="whitespace-pre">
    {BOOT}
  </span>
);

/** Viewer's local date and time, ticking. Server renders a same-width placeholder (no layout shift). */
export function Clock() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      ref.current!.textContent = `${d.toLocaleDateString("en-CA")} ${d.toLocaleTimeString("en-GB", { hour12: false })}`;
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span ref={ref} className="tabular-nums whitespace-pre">
      ---------- --:--:--
    </span>
  );
}
