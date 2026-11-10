import { cn } from "./cn";

export type LedgerColumn = {
  key: string;
  label: string;
  /** grid track at ≥ 768, e.g. "8rem" or "minmax(0,1fr)" */
  width?: string;
  mono?: boolean;
  align?: "start" | "end";
};
export type LedgerRow = { key: string; cells: Record<string, React.ReactNode> };

/**
 * Hairline table for mentions, contributors, certificates and events. Header row in meta, 52px rows.
 * Below 768 each row stacks: the first column leads, the rest follow as one wrapping meta line, so it never outgrows the screen.
 */
export function Ledger({ columns, rows, caption, className }: { columns: LedgerColumn[]; rows: LedgerRow[]; caption?: string; className?: string }) {
  const template = columns.map((c) => c.width ?? "minmax(0,1fr)").join(" ");
  const cell = (c: LedgerColumn) => cn("min-w-0", c.mono && "t-mono", c.align === "end" && "md:text-right");
  return (
    <div role="table" aria-label={caption} className={cn("border-t border-(--line)", className)}>
      <div role="row" className="t-meta hidden gap-x-4 border-b border-(--line) px-2 py-3 text-(--fg-subtle) md:grid" style={{ gridTemplateColumns: template }}>
        {columns.map((c) => (
          <span key={c.key} role="columnheader" className={cell(c)}>
            {c.label}
          </span>
        ))}
      </div>
      {rows.map((r) => (
        <div
          key={r.key}
          role="row"
          className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-(--line) px-2 py-3 md:grid md:min-h-13 md:items-center md:gap-x-4 md:py-2"
          style={{ gridTemplateColumns: template }}
        >
          {columns.map((c, i) => (
            <span
              key={c.key}
              role="cell"
              className={cn(cell(c), i === 0 ? "basis-full text-(--fg) md:basis-auto" : "text-sm text-(--fg-muted)", "md:truncate")}
            >
              {r.cells[c.key]}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
