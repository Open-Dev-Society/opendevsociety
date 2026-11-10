import { cn } from "./cn";

/** "Also covered by Daily.dev · Hello GitHub · …", then the link to everything. */
export function SourceLine({
  lead = "Also covered by",
  items,
  all,
  className,
}: {
  lead?: string;
  items: { name: string; href: string }[];
  all?: { label: string; href: string };
  className?: string;
}) {
  return (
    <p className={cn("t-meta leading-relaxed text-(--fg-subtle)", className)}>
      {lead}{" "}
      {items.map((s, i) => (
        <span key={s.name}>
          <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-(--fg-muted) transition-colors duration-(--d-2) hover:text-(--fg)">
            {s.name}
          </a>
          {i < items.length - 1 && " · "}
        </span>
      ))}
      {all && (
        <>
          {" "}
          <a href={all.href} className="ml-2 whitespace-nowrap text-(--fg) transition-colors duration-(--d-2) hover:text-(--accent)">
            {all.label} →
          </a>
        </>
      )}
    </p>
  );
}
