import { cn } from "./cn";

/** Trims straight and curly quotes from both ends and turns inner straight quotes into curly singles. The marks come from <q>. */
export const cleanQuote = (s: string) =>
  s
    .replace(/&amp;/g, "&")
    .trim()
    .replace(/^["“”]+|["“”]+$/g, "")
    .replace(/"([^"]*)"/g, "‘$1’");

/**
 * A printed review. `feature` sets the quote in Newsreader at display size with hanging punctuation;
 * `compact` at 22px. Attribution: the name signed, then source and year, linked when there's an href.
 */
export function Quote({
  quote,
  name,
  source,
  year,
  href,
  variant = "compact",
  className,
}: {
  quote: string;
  name: string;
  source?: string;
  year?: string;
  href?: string;
  variant?: "feature" | "compact";
  className?: string;
}) {
  const rest = [source, year].filter(Boolean).join(" · ");
  return (
    <figure className={cn("flex flex-col", className)}>
      <blockquote
        className={cn(
          "text-(--fg)",
          variant === "feature" ? "quote-feature -indent-[0.4em]" : "font-(family-name:--font-sign) text-[22px] leading-[1.35] italic",
        )}
      >
        <q>{cleanQuote(quote)}</q>
      </blockquote>
      <figcaption className="t-meta mt-5 text-(--fg-muted)">
        <span className="sign text-(--fg)">{name}</span>
        {rest && (
          <>
            {" · "}
            {href ? (
              <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-(--fg)">
                {rest} ↗
              </a>
            ) : (
              rest
            )}
          </>
        )}
      </figcaption>
    </figure>
  );
}
