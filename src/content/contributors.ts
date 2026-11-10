import type { Link, PageMeta } from "./types";

// Source: src/app/(site)/contributors/page.tsx. People = manualContributors in src/data/contributors (+ live GitHub contributors).

export const contributorsMeta: PageMeta = {
  title: "Open Dev Society — The Operating System for Open Source",
  description:
    "A decentralized society of developers, designers, and writers building free, open-source public goods. No paywalls. No gatekeeping. Just code.",
}; // no page metadata in old code; inherits root layout

export const contributors = {
  back: { label: "Return_Index", href: "/" } satisfies Link,
  badge: "System_Personnel // V1.0",
  titleStart: "Active",
  titleAccent: "Operators.",
  status: "[DIRECTORY_STATUS: ONLINE]",
  intro: "The architects, maintainers, and contributors building the Open Dev Society.",
  loading: "INITIALIZING_DIRECTORY_SCAN...",
  defaultRole: "OPERATOR",
  idLabel: "ID:",
  quote: "\"Code is the currency. Trust is the network.\"",
  cta: { label: "[ JOIN_THE_NETWORK ]", href: "https://github.com/Open-Dev-Society", external: true } satisfies Link,
};
