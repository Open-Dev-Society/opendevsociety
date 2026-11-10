import type { Link } from "./types";

export const siteName = "Open Dev Society";
export const logo = { src: "/logo.png", favicon: "/logo.png", navAlt: "Logo", footerAlt: "ODS Logo" };

export const contactEmail = "opendevsociety@gmail.com";
export const partnershipMailto = "mailto:opendevsociety@gmail.com?subject=Partnership Inquiry";

export const social = {
  github: { label: "GitHub", href: "https://github.com/Open-Dev-Society" },
  linkedin: { label: "LinkedIn", href: "https://www.linkedin.com/company/opendevsociety-in/" },
  twitter: { label: "Twitter / X", href: "https://x.com/opendevsociety" },
  discord: { label: "Discord", href: "https://discord.gg/9xywA3pj" },
  email: { label: "Email", href: "mailto:opendevsociety@gmail.com" },
} as const satisfies Record<string, Link>;
