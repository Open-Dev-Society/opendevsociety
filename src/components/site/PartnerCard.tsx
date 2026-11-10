import { Card } from "./Card";

/** Logo (grayscale at 80% → colour on hover) and one line we wrote, never clamped. */
export function PartnerCard({
  name,
  logo,
  invertLogo,
  href,
  line,
}: {
  name: string;
  logo?: string;
  invertLogo?: boolean;
  href: string;
  line: string;
}) {
  return (
    <Card href={href} external className="group flex h-full items-center gap-4 max-md:p-4 md:flex-col md:items-start md:gap-5">
      <span className="flex h-8 w-28 shrink-0 items-center md:w-auto">
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element -- small partner SVGs
          <img
            src={logo}
            alt={name}
            className="h-7 w-auto max-w-full object-contain md:h-8 md:max-w-[160px] opacity-80 grayscale transition-[opacity,filter] duration-(--d-2) group-hover:opacity-100 group-hover:grayscale-0"
            style={invertLogo ? { filter: "invert(1)" } : undefined}
          />
        ) : (
          <span className="t-title text-(--fg)">{name}</span>
        )}
      </span>
      <span className="text-sm text-(--fg-muted)">{line}</span>
    </Card>
  );
}
