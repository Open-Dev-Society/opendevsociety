"use client";

import { useEffect, useRef } from "react";
import { organism, plant, slots, step } from "./life";

const pad = (n: number, d = 4) => String(n).padStart(d, "0");
const TRAIL = 8; // generations a dead cell stays as a faint mark

/**
 * Society 1.0: the Game of Life seeded with one organism per builder. They arrive one by one (the boot line),
 * then live or die by their neighbours. Every so often a builder's organism is planted again, so it never goes still.
 * The readouts are written straight to the DOM, so the 10 Hz loop never re-renders React.
 */
export function Society({ logins }: { logins: string[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const boot = useRef<HTMLSpanElement>(null);
  const gen = useRef<HTMLSpanElement>(null);
  const pop = useRef<HTMLSpanElement>(null);
  const seed = useRef<HTMLSpanElement>(null);
  const total = logins.length;

  useEffect(() => {
    const box = wrap.current!;
    const el = canvas.current!;
    const ctx = el.getContext("2d");
    if (!ctx || !total) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0, h = 0, s = 0, rate = 0;
    let a = new Uint8Array(0), b = a, age = a, trail = a;
    let g = 0, p = 0, placed = 0, next = 0;
    let fg = "", accent = "";
    let raf = 0, last = 0, acc = 0, seen = true;

    const write = () => {
      boot.current!.textContent = placed < total ? `seeding ${pad(placed, 2)}/${total}` : `${total}/${total} alive`;
      gen.current!.textContent = pad(g);
      pop.current!.textContent = pad(p);
    };
    const born = (i: number) => {
      age[i] = 0;
      trail[i] = 0;
    };
    const seedOne = (i: number, at: [number, number]) => {
      const login = logins[i % total];
      plant(a, w, h, at[0], at[1], organism(login).cells, born);
      seed.current!.textContent = `@${login}`;
    };

    const setup = () => {
      const cssW = box.clientWidth;
      const cssH = box.clientHeight;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      el.width = Math.round(cssW * dpr);
      el.height = Math.round(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Phones get bigger cells at half the pace: the calm version.
      const small = cssW < 560;
      s = small ? 10 : 8;
      rate = small ? 5 : 10;
      w = Math.floor(cssW / s);
      h = Math.floor(cssH / s);
      a = new Uint8Array(w * h);
      b = new Uint8Array(w * h);
      age = new Uint8Array(w * h);
      trail = new Uint8Array(w * h);
      g = p = placed = 0;
      next = total;
      const cs = getComputedStyle(el);
      fg = cs.getPropertyValue("--fg").trim() || cs.color;
      accent = cs.getPropertyValue("--accent").trim() || fg;
    };

    const draw = () => {
      ctx.clearRect(0, 0, w * s, h * s);
      ctx.fillStyle = fg;
      // the lattice: a dot every 4 cells, the paper the society lives on
      ctx.globalAlpha = 0.14;
      for (let y = 0; y <= h; y += 4) for (let x = 0; x <= w; x += 4) ctx.fillRect(x * s - 0.5, y * s - 0.5, 1, 1);
      const c = s - 2;
      for (let i = 0; i < w * h; i++) {
        if (a[i] || !trail[i]) continue;
        ctx.globalAlpha = (trail[i] / TRAIL) * 0.16;
        ctx.fillRect((i % w) * s + 1, Math.floor(i / w) * s + 1, c, c);
      }
      ctx.globalAlpha = 0.82;
      for (let i = 0; i < w * h; i++) if (a[i] && age[i] > 0) ctx.fillRect((i % w) * s + 1, Math.floor(i / w) * s + 1, c, c);
      // the newborn, in ink
      ctx.fillStyle = accent;
      ctx.globalAlpha = 1;
      for (let i = 0; i < w * h; i++) if (a[i] && !age[i]) ctx.fillRect((i % w) * s + 1, Math.floor(i / w) * s + 1, c, c);
    };

    const tick = () => {
      p = step(a, b, w, h);
      for (let i = 0; i < w * h; i++) {
        if (b[i]) {
          age[i] = a[i] ? Math.min(age[i] + 1, 255) : 0;
          trail[i] = TRAIL;
        } else if (trail[i]) trail[i]--;
      }
      [a, b] = [b, a];
      g++;
      // A society needs newcomers: a builder's organism is planted again every 48 generations, sooner when it thins out.
      if (g % 48 === 0 || (p < (w * h) / 40 && g % 12 === 0)) {
        seedOne(next++, [Math.floor(Math.random() * w), Math.floor(Math.random() * h)]);
      }
    };

    let at: [number, number][] = [];
    const reset = () => {
      setup();
      at = slots(total, w, h);
      if (still) {
        // Reduced motion: everyone arrives at once, 90 generations pass unseen, and one frame is drawn.
        for (let i = 0; i < total; i++) seedOne(i, at[i]);
        placed = total;
        for (let i = 0; i < 90; i++) tick();
        p = a.reduce((n, v) => n + v, 0);
        draw();
      }
      write();
    };

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      if (!last) last = t;
      acc += Math.min(t - last, 250);
      last = t;
      if (placed < total) {
        // boot: one builder every 50ms
        if (acc < 50) return;
        acc = 0;
        seedOne(placed, at[placed]);
        placed++;
        p = a.reduce((n, v) => n + v, 0);
      } else {
        if (acc < 1000 / rate) return;
        acc = 0;
        tick();
      }
      draw();
      write();
    };

    const play = () => {
      if (still || raf || !seen || document.hidden) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const pause = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    reset();
    play();

    const io = new IntersectionObserver(([e]) => {
      seen = e.isIntersecting;
      if (seen) play();
      else pause();
    });
    io.observe(box);
    const vis = () => (document.hidden ? pause() : play());
    document.addEventListener("visibilitychange", vis);
    // Only a width change rebuilds the world (phone toolbars change height, not width).
    let lastW = box.clientWidth;
    const ro = new ResizeObserver(() => {
      if (box.clientWidth === lastW) return;
      lastW = box.clientWidth;
      pause();
      reset();
      play();
    });
    ro.observe(box);

    // Your cursor is a cell: hovering plants newborns where you are.
    const move = (e: PointerEvent) => {
      if (still || placed < total || e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      const x = Math.floor((e.clientX - r.left) / s);
      const y = Math.floor((e.clientY - r.top) / s);
      if (x < 0 || y < 0 || x >= w || y >= h) return;
      plant(a, w, h, x, y, [[0, 0], [1, 0], [0, 1]], born);
    };
    el.addEventListener("pointermove", move);

    return () => {
      pause();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", vis);
      el.removeEventListener("pointermove", move);
    };
  }, [logins, total]);

  return (
    <>
      <div className="t-mono flex items-center gap-2 border-b border-(--line) px-4 py-2.5 text-[12px] text-(--fg-subtle)">
        <span aria-hidden className="text-(--accent)">∴</span>
        <span className="text-(--fg)">Society 1.0</span>
        <span className="hidden sm:inline">· one cell per builder</span>
        <span ref={boot} aria-hidden className="ml-auto min-w-[13ch] text-right tabular-nums">
          seeding 00/{total}
        </span>
      </div>
      <div ref={wrap} className="relative aspect-[4/3] w-full sm:aspect-[2/1]">
        <canvas ref={canvas} aria-hidden className="absolute inset-0 size-full text-(--fg)" />
      </div>
      <div aria-hidden className="t-mono flex items-center gap-x-4 border-t border-(--line) px-4 py-2 text-[12px] text-(--fg-subtle)">
        <span>
          gen <span ref={gen} className="text-(--fg-muted)">0000</span>
        </span>
        <span>
          pop <span ref={pop} className="text-(--fg-muted)">0000</span>
        </span>
        <span className="hidden sm:inline">B3/S23</span>
        <span className="min-w-0 flex-1 truncate">
          seed <span ref={seed} className="text-(--accent)">@{logins[0]}</span>
        </span>
      </div>
    </>
  );
}
