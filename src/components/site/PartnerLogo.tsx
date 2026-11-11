import type { Partner } from "@/data/partners";

/**
 * A partner's logo drawn as a mask in the current ink (set the colour with a `bg-*` class), so every logo matches the paper
 * whatever colour it ships in. An icon-only mark gets the name beside it. `className` sizes the mask (height and width).
 */
export function PartnerLogo({ p, className = "", position = "left" }: { p: Partner; className?: string; position?: "left" | "center" }) {
  const mask = (
    <span
      aria-hidden
      className={`block shrink-0 ${p.iconOnly ? "aspect-[245/160] h-full" : "h-full w-full"}`}
      style={{
        maskImage: `url(${p.logo})`,
        WebkitMaskImage: `url(${p.logo})`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: p.iconOnly ? "center" : position,
        WebkitMaskPosition: p.iconOnly ? "center" : position,
        backgroundColor: "currentColor",
      }}
    />
  );
  return (
    <span className={`flex items-center gap-2 ${position === "center" ? "justify-center" : ""} ${className}`}>
      {mask}
      {p.iconOnly && <span className="text-[1.15em] leading-none font-[750] tracking-[-0.01em] whitespace-nowrap [font-stretch:85%]">{p.name}</span>}
    </span>
  );
}
