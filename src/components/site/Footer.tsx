import type { Link } from "@/content";
import { Container } from "./Section";
import { cn } from "./cn";

// Static class names so Tailwind can see them.
const cols: Record<number, string> = { 1: "sm:grid-cols-1", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-4" };

export type FooterColumn = { heading: string; links: Link[] };

/**
 * Inverse footer. `children` is the closing CTA slot above the link columns (headline, buttons, command);
 * `note` is the small print at the bottom.
 */
export function Footer({
  columns,
  note,
  children,
}: {
  columns: FooterColumn[];
  note: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <footer className="tone-inverse">
      <Container className="py-16 md:py-20">
        {children}
        <div className={cn("grid grid-cols-2 gap-8 text-sm", cols[Math.min(columns.length, 4)], children && "mt-14")}>
          {columns.map((c) => (
            <div key={c.heading}>
              <p className="text-[13px] font-medium text-(--fg-muted)">{c.heading}</p>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.href + l.label}>
                    <a
                      href={l.href}
                      {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="text-(--fg) opacity-80 transition-opacity duration-150 hover:opacity-100"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 border-t border-(--line) pt-6 text-[13px] text-(--fg-muted)">{note}</div>
      </Container>
    </footer>
  );
}
