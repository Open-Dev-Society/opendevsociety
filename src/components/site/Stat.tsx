import { cn } from "./cn";
export { compact } from "@/lib/format";

export type StatItem = { value: string; label: string };

/** Inline numbers only (brief §9): "21.4k stars · 2.7k forks". There is no standalone stats strip. */
export function StatGroup({ items, className }: { items: StatItem[]; className?: string }) {
  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-x-1.5 gap-y-1", className)}>
      {items.map((s, i) => (
        <span key={s.label} className="whitespace-nowrap">
          {i > 0 && (
            <span aria-hidden className="mr-1.5">
              ·
            </span>
          )}
          <span className="font-semibold tabular-nums text-(--fg)">{s.value}</span> <span className="text-(--fg-muted)">{s.label}</span>
        </span>
      ))}
    </span>
  );
}
