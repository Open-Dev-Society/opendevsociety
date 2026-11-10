import { cn } from "./cn";
import { Card } from "./Card";

/** Strips wrapping quotes and turns inner straight quotes into curly singles, so the rendered “ ” never double up. */
export const cleanQuote = (s: string) =>
  s
    .replace(/&amp;/g, "&")
    .trim()
    .replace(/^["“]|["”]$/g, "")
    .replace(/"([^"]*)"/g, "‘$1’");

export function Quote({
  quote,
  cite,
  href,
  size = "md",
  className,
}: {
  quote: string;
  cite: React.ReactNode;
  href?: string;
  size?: "md" | "lg";
  className?: string;
}) {
  return (
    <Card href={href} external={!!href} className={cn("flex h-full flex-col justify-between gap-6", className)}>
      <blockquote
        className={cn(
          "font-display text-pretty text-(--fg)",
          size === "lg" ? "text-2xl leading-snug sm:text-[28px]" : "text-lg leading-snug",
        )}
      >
        “{cleanQuote(quote)}”
      </blockquote>
      <p className="text-sm text-(--fg-muted)">{cite}</p>
    </Card>
  );
}
