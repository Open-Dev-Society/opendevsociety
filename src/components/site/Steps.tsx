import { cn } from "./cn";

export type Step = { title: React.ReactNode; body?: React.ReactNode; children?: React.ReactNode };

/** Numbered list with hairline separators: numeral (display-3, accent), title, body, then any extra content. */
export function Steps({ items, className }: { items: Step[]; className?: string }) {
  return (
    <ol className={cn("divide-y divide-(--line) border-y border-(--line)", className)}>
      {items.map((s, i) => (
        <li key={i} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 py-6 sm:grid-cols-[3.5rem_minmax(0,1fr)]">
          <span className="display-3 tabular-nums text-(--accent)">{i + 1}</span>
          <div className="min-w-0">
            <h3 className="t-title text-(--fg)">{s.title}</h3>
            {s.body && <div className="mt-1.5 text-(--fg-muted)">{s.body}</div>}
            {s.children && <div className="mt-4">{s.children}</div>}
          </div>
        </li>
      ))}
    </ol>
  );
}
