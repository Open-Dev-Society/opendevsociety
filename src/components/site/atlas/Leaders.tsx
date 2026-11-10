"use client";
// Hover or focus a specimen or its caption: both ink up and a leader line runs between them (wide layout only).
import { useEffect, useRef, useState } from "react";
import s from "./atlas.module.css";

type Seg = { x1: number; y1: number; x2: number; y2: number; key: string };

export function Leaders() {
  const ref = useRef<SVGSVGElement>(null);
  const [seg, setSeg] = useState<Seg | null>(null);

  useEffect(() => {
    const root = ref.current?.closest<HTMLElement>("[data-plate]");
    if (!root) return;
    const wide = matchMedia("(min-width: 960px)");
    let on: Element[] = [];

    const show = (fig: string | null) => {
      on.forEach((e) => e.removeAttribute("data-on"));
      on = fig ? [...root.querySelectorAll(`[data-fig="${fig}"]`)] : [];
      on.forEach((e) => e.setAttribute("data-on", ""));
      const cap = on.find((e) => e.tagName === "LI"), g = on.find((e) => e.tagName === "g");
      const svg = g?.closest("svg");
      if (!cap || !g || !svg || !wide.matches || cap.classList.contains(s.capTop)) return setSeg(null);
      // Specimen centre and radius from the server's numbers, scaled to the drawn size.
      const o = root.getBoundingClientRect(), b = svg.getBoundingClientRect(), k = b.width / svg.viewBox.baseVal.width;
      const cx = b.left - o.left + Number(g.getAttribute("data-x")) * k, cy = b.top - o.top + Number(g.getAttribute("data-y")) * k;
      const r = Number(g.getAttribute("data-r")) * k * 1.08;
      const c = cap.getBoundingClientRect(), left = cap.classList.contains(s.capL);
      const x1 = (left ? c.right + 10 : c.left - 10) - o.left, y1 = c.top - o.top + 11;
      const a = Math.atan2(y1 - cy, x1 - cx);
      setSeg({ x1, y1, x2: cx + r * Math.cos(a), y2: cy + r * Math.sin(a), key: fig! });
    };
    const over = (e: Event) => show((e.target as Element).closest("[data-fig]")?.getAttribute("data-fig") ?? null);
    const out = () => show(null);
    root.addEventListener("pointerover", over);
    root.addEventListener("focusin", over);
    root.addEventListener("pointerleave", out);
    root.addEventListener("focusout", out);
    return () => {
      root.removeEventListener("pointerover", over);
      root.removeEventListener("focusin", over);
      root.removeEventListener("pointerleave", out);
      root.removeEventListener("focusout", out);
    };
  }, []);

  return (
    <svg ref={ref} className={s.overlay} aria-hidden>
      {seg && (
        <g key={seg.key}>
          <path className={s.hoverLeader} d={`M${seg.x1} ${seg.y1}L${seg.x2} ${seg.y2}`} pathLength={1} />
          <circle className={s.dot} cx={seg.x2} cy={seg.y2} r={2} />
        </g>
      )}
    </svg>
  );
}
