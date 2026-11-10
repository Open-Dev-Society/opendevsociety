import type { Link, PageMeta } from "./types";

// Source: src/app/(site)/word-of-mouth/page.tsx. Mentions list = src/data/mentions.

export const wordOfMouthMeta: PageMeta = {
  title: "Open Dev Society — The Operating System for Open Source",
  description:
    "A decentralized society of developers, designers, and writers building free, open-source public goods. No paywalls. No gatekeeping. Just code.",
}; // no page metadata in old code; inherits root layout

type Source = "article" | "youtube" | "twitter" | "instagram" | "linkedin" | "other" | "facebook";

export const wordOfMouth = {
  back: { label: "Return_Index", href: "/" } satisfies Link,
  badge: "Signal_Log // V1.0",
  titleStart: "Word of",
  titleAccent: "Mouth.",
  signalType: "[SIGNAL_TYPE: COMMUNITY_LOVE]",
  intro:
    "Mentions, features, and love from across the internet. Every shoutout fuels our mission to keep open source free and accessible.",

  stats: {
    total: "Total Mentions",
    videos: "Videos",
    articles: "Articles",
    social: "Social Posts",
    /** sources counted as "Social Posts" */
    socialSources: ["twitter", "instagram", "linkedin", "facebook", "other"] as Source[],
  },

  filterHeading: "// FILTER_BY_SOURCE",
  filters: [
    { value: "all", label: "All" },
    { value: "article", label: "Articles" },
    { value: "youtube", label: "YouTube" },
    { value: "twitter", label: "Twitter / X" },
    { value: "instagram", label: "Instagram" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "facebook", label: "Facebook" },
    { value: "other", label: "Other" },
  ] as { value: Source | "all"; label: string }[],

  /** display label + lucide icon per source */
  sources: {
    article: { label: "Article", icon: "Newspaper" },
    youtube: { label: "YouTube", icon: "Youtube" },
    twitter: { label: "Twitter / X", icon: "Twitter" },
    instagram: { label: "Instagram", icon: "Instagram" },
    linkedin: { label: "LinkedIn", icon: "Linkedin" },
    other: { label: "Other", icon: "MessageSquareQuote" },
    facebook: { label: "Facebook", icon: "Facebook" },
  } as Record<Source, { label: string; icon: string }>,

  /** `{count}` = filtered entries */
  feedHeading: "// SIGNAL_FEED [{count} ENTRIES]",
  empty: "NO_SIGNALS_FOUND_FOR_FILTER",

  cta: {
    titleStart: "Mentioned",
    titleAccent: "Us?",
    body: "If you've written about us, made a video, or posted about Open Dev Society — we'd love to feature you here. Send us the link!",
    primary: { label: "SEND_YOUR_MENTION →", href: "mailto:opendevsociety@gmail.com?subject=ODS Mention — Feature Request" } satisfies Link,
    secondary: { label: "TAG_US_ON_X →", href: "https://x.com/opendevsociety", external: true } satisfies Link,
  },
};
