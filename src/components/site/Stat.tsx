import { cn } from "./cn";
export { compact } from "@/lib/format";

export type StatItem = { value: string; label: string };

/**
 * The proof row under the home hero (after Stripe's stat row): live figures at display size between hairlines.
 * Only real, sourced numbers; `live` adds the green dot (a commit within 24h).
 */
export function StatRow({ items, className }: { items: (StatItem & { live?: boolean })[]; className?: string }) {
  return (
    <dl className={cn("grid grid-cols-2 gap-x-(--grid-gap) gap-y-8 sm:grid-cols-3 lg:grid-cols-5", className)}>
      {items.map((s) => (
        <div key={s.label} className="flex flex-col-reverse border-t border-(--line) pt-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6 lg:first:border-l-0 lg:first:pl-0">
          <dt className="t-meta mt-2 flex items-center gap-1.5 text-(--fg-muted)">
            {s.live && <span className="size-1.5 rounded-full bg-(--live)" aria-hidden />}
            {s.label}
          </dt>
          <dd className="display-3 tabular-nums text-(--fg)">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Inline numbers: "21.4k stars · 2.7k forks". */
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
