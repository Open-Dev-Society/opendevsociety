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
  /** cinematic: centred at display size, attribution as a credit row under a hairline (docs/references.md) */
  variant?: "feature" | "compact" | "cinematic";
  className?: string;
}) {
  const rest = [source, year].filter(Boolean).join(" · ");
  if (variant === "cinematic")
    return (
      <figure className={cn("mx-auto flex max-w-4xl flex-col items-center text-center", className)}>
        <blockquote className="quote-feature text-[clamp(2rem,1.1rem+2.8vw,3.5rem)] leading-[1.12] text-balance text-(--fg)">
          <q>{cleanQuote(quote)}</q>
        </blockquote>
        <figcaption className="t-meta mt-10 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 border-t border-(--line) pt-5 text-(--fg-muted)">
          <span className="sign text-[17px] text-(--fg)">{name}</span>
          {source && (
            <>
              <span aria-hidden>·</span>
              <span>{source}</span>
            </>
          )}
          {year && (
            <>
              <span aria-hidden>·</span>
              <span className="tabular-nums">{year}</span>
            </>
          )}
          {href && (
            <a href={href} target="_blank" rel="noopener noreferrer" className="ml-2 text-(--fg) transition-colors duration-(--d-2) hover:text-(--accent)">
              Read it ↗
            </a>
          )}
        </figcaption>
      </figure>
    );
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
