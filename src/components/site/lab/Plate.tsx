/**
 * A specimen plate, as in the hero's corners: mono label on paper, 1px hairline, square. For IDs, status and measurements.
 * tone "mark" is rose (yours / you / vacant / new); "ink" inverts for the one plate that must be read first.
 */
export function Plate({
  children,
  tone = "plain",
  as: Tag = "span",
  className = "",
  ...rest
}: {
  children: React.ReactNode;
  tone?: "plain" | "accent" | "mark" | "ink";
  as?: "span" | "div" | "p";
  className?: string;
} & React.HTMLAttributes<HTMLElement>) {
  const tones = {
    plain: "bg-(--bg) text-(--fg-muted) shadow-[0_0_0_1px_var(--line)]",
    accent: "bg-(--bg) text-(--accent) shadow-[0_0_0_1px_currentColor]",
    mark: "bg-(--bg) text-(--mark-ink) shadow-[0_0_0_1px_var(--mark)]",
    ink: "bg-(--fg) text-(--bg)",
  };
  return (
    <Tag className={`t-mono inline-flex items-center gap-1.5 px-2 py-1 text-[11px] leading-[1.4] whitespace-nowrap tabular-nums ${tones[tone]} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
