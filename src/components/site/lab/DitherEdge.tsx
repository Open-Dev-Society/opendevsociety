import { useId } from "react";

// An 8-wide Bayer tile whose threshold rises row by row, repeated across: one colour dissolving into the next in 2px cells.
const BAYER = [0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21];

function ramp(rows: number, up: boolean) {
  return Array.from({ length: 8 * rows }, (_, i) => [i % 8, Math.floor(i / 8)])
    .filter(([x, y]) => BAYER[(y % 8) * 8 + x] < (64 * ((up ? rows - 1 - y : y) + 0.5)) / rows)
    .map(([x, y]) => `M${x} ${y}h1v1h-1z`)
    .join("");
}

/** A 1-bit edge between two grounds (CSS colours, e.g. "var(--bg)"): `from` dissolves into `to`, top to bottom ("down") or bottom to top ("up"). */
export function DitherEdge({
  from,
  to,
  direction = "down",
  height = 32,
  className = "",
}: {
  from: string;
  to: string;
  direction?: "down" | "up";
  /** CSS px; rounded down to whole 2px cells. */
  height?: number;
  className?: string;
}) {
  const id = useId();
  const rows = Math.max(1, Math.floor(height / 2));
  return (
    <svg aria-hidden className={`block w-full ${className}`} style={{ height: rows * 2 }} shapeRendering="crispEdges">
      <defs>
        <pattern id={id} width="8" height={rows} patternUnits="userSpaceOnUse" patternTransform="scale(2)">
          <path d={ramp(rows, direction === "up")} fill={to} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={from} />
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
