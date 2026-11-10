import { cn } from "./cn";

export type StatItem = { value: string; label: string };

/** A row of sourced numbers. Values are pre-formatted strings (e.g. "21.4k"). */
export function StatGroup({
  items,
  size = "md",
  className,
}: {
  items: StatItem[];
  size?: "md" | "lg";
  className?: string;
}) {
  return (
    <dl className={cn("flex flex-wrap gap-x-8 gap-y-4", className)}>
      {items.map((s) => (
        <div key={s.label} className="flex flex-col-reverse">
          <dt className="text-sm text-(--fg-muted)">{s.label}</dt>
          <dd
            className={cn(
              "font-display tabular-nums tracking-tight text-(--fg)",
              size === "lg" ? "text-4xl sm:text-5xl" : "text-2xl",
            )}
          >
            {s.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** "21.4k" for 21406; plain numbers below 1,000. */
export const compact = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(n));
