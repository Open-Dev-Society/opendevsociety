import type { Link, PageMeta } from "./types";

// Source: src/app/layout.tsx, components/{Navbar,Footer,SidebarPanels}.tsx

export const siteMeta: PageMeta = {
  title: "Open Dev Society — The Operating System for Open Source",
  description:
    "A decentralized society of developers, designers, and writers building free, open-source public goods. No paywalls. No gatekeeping. Just code.",
};

export const siteName = "Open Dev Society";
export const siteNameUpper = "OPEN DEV SOCIETY";
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

export const githubOrg = "Open-Dev-Society";

/** Desktop navbar links (labels are uppercased + bracketed by the old UI: "[ Manifesto ]"). */
export const navLinks: Link[] = [
  { label: "Manifesto", href: "/manifesto" },
  { label: "Partners", href: "/partners" },
  { label: "Love", href: "/word-of-mouth" },
];
export const navGithub: Link = { label: "GitHub", href: social.github.href, external: true };

export const footer = {
  tagline: "A society of open initiatives — building the future of open source, one commit at a time.",
  navigate: {
    heading: "// Navigate",
    links: [
      { label: "Home", href: "/" },
      { label: "Manifesto", href: "/manifesto" },
      { label: "Projects", href: "/projects" },
      { label: "Contributors", href: "/contributors" },
      { label: "Contribute", href: "/contribute" },
      { label: "Partners & Events", href: "/partners" },
      { label: "Word of Mouth", href: "/word-of-mouth" },
    ] satisfies Link[],
  },
  community: {
    heading: "// Community",
    links: [
      { label: "GitHub ↗", href: social.github.href },
      { label: "LinkedIn ↗", href: social.linkedin.href },
      { label: "Twitter / X ↗", href: social.twitter.href },
      { label: "Discord ↗", href: social.discord.href },
    ] satisfies Link[],
  },
  partner: {
    heading: "// Partner",
    links: [
      { label: "For Brands", href: "/partners#partner-cta" },
      { label: "For Communities", href: "/partners#partner-cta" },
      { label: "Contact Us", href: partnershipMailto },
    ] satisfies Link[],
  },
  bigText: "OPEN DEV SOCIETY",
  /** old UI rendered `© {currentYear} ${copyrightSuffix}` */
  copyrightSuffix: "OPEN_DEV_SOCIETY — ALL_RIGHTS_OPEN",
  builtWith: "BUILT_WITH [ NEXT.JS + OPEN_SOURCE ]",
};

/** Floating desktop sidebars (xl+). Partners/events come from src/data/partners. */
export const sidebar = {
  navigateHeading: "Navigate",
  communityHeading: "Community",
  partnersHeading: "Partners",
  updatesHeading: "Updates",
  eventsHeading: "Events",
  quickLinks: [
    { label: "Manifesto", href: "/manifesto", icon: "FileText" },
    { label: "Projects", href: "/projects", icon: "Package" },
    { label: "Contributors", href: "/contributors", icon: "Users" },
    { label: "Contribute", href: "/contribute", icon: "Heart" },
    { label: "Partners", href: "/partners", icon: "Handshake" },
    { label: "Love", href: "/word-of-mouth", icon: "Heart" },
  ] as (Link & { icon: string })[],
  socialLinks: [
    { label: "GitHub", href: social.github.href, icon: "Github" },
    { label: "Discord", href: social.discord.href, icon: "MessageCircle" },
    { label: "LinkedIn", href: social.linkedin.href, icon: "ArrowUpRight" },
    { label: "Twitter / X", href: social.twitter.href, icon: "ArrowUpRight" },
  ] as (Link & { icon: string })[],
  /** hard-coded in SidebarPanels; duplicates entries that live in src/data/partners */
  announcements: [
    { text: "JWOC 2026 — Community Partner", type: "event" },
    { text: "Apretre 3.0 — Community Partner", type: "event" },
    { text: "New: StellAILoom Partnership", type: "partner" },
  ] as { text: string; type: "event" | "partner" }[],
  eventsLink: "/partners",
  eventsShown: 3,
};
