import type { Link, PageMeta } from "./types";

// Source: src/app/(site)/partners/page.tsx. Partners + events come from src/data/partners.

export const partnersMeta: PageMeta = {
  title: "Open Dev Society — The Operating System for Open Source",
  description:
    "A decentralized society of developers, designers, and writers building free, open-source public goods. No paywalls. No gatekeeping. Just code.",
}; // no page metadata in old code; inherits root layout

export const partnersPage = {
  back: { label: "Return_Index", href: "/" } satisfies Link,
  badge: "System_Alliances // V1.0",
  titleStart: "Partners &",
  titleAccent: "Events.",
  status: "[ALLIANCE_STATUS: ACTIVE]",
  intro: "Strategic partnerships and community events powering the open-source ecosystem.",

  partnersHeading: "// ALLIED_SYSTEMS [ACTIVE_PARTNERSHIPS]",
  partnerTypeLabels: { technology: "TECH_PARTNER", community: "COMMUNITY_PARTNER" },

  eventsHeading: "// EVENT_LOG [COMMUNITY_SUPPORT]",
  eventCtaLabel: "VIEW_EVENT →",

  cta: {
    id: "partner-cta",
    titleStart: "Join the",
    titleAccent: "Alliance.",
    body: "We are always looking for like-minded organizations to collaborate with. Whether you are a brand or a community, let us build the future of open source together.",
    cards: [
      {
        icon: "Building2",
        title: "For Brands",
        body: "Partner with us to reach the developer community and support open-source innovation.",
        cta: { label: "INIT_PARTNERSHIP →", href: "mailto:opendevsociety@gmail.com?subject=Brand Partnership Inquiry" },
      },
      {
        icon: "Users",
        title: "For Communities",
        body: "Make us your community partner for your next open-source event, hackathon, or program.",
        cta: {
          label: "INIT_COMMUNITY_LINK →",
          href: "mailto:opendevsociety@gmail.com?subject=Community Partnership Inquiry",
        },
      },
    ],
    email: "opendevsociety@gmail.com",
    copyLabel: "opendevsociety@gmail.com — CLICK_TO_COPY",
    copiedLabel: "COPIED_TO_CLIPBOARD ✓",
  },
};
