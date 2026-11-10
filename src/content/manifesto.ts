import type { Link, PageMeta } from "./types";

// Source: src/app/(site)/manifesto/page.tsx

export const manifestoMeta: PageMeta = {
  title: "Open Dev Society — The Operating System for Open Source",
  description:
    "A decentralized society of developers, designers, and writers building free, open-source public goods. No paywalls. No gatekeeping. Just code.",
}; // no page metadata in old code; inherits root layout

export const manifesto = {
  backLabel: "Return_Index",
  backHref: "/",
  badge: "Start_Protocol // V1.0",
  titleLine1: "The Open Dev",
  titleLine2: "Society Manifesto.",
  docMeta: ["[DOC_ID: ODS-2024-M]", "[CLASSIFICATION: PUBLIC]", "[AUTHOR: Ravi Pratap Singh]"],

  coreBelief: {
    label: "// 01_CORE_BELIEF",
    quote:
      "\"We live in a world where knowledge is hidden behind paywalls. Where tools are locked in subscriptions. Where newcomers are told they're not 'good enough'.\"",
    body: "We believe there's a better way. Technology should belong to everyone. Knowledge should be open, free, and accessible. Communities should welcome newcomers with trust, not gatekeeping.",
  },

  mission: {
    label: "// 02_MISSION_STATEMENT",
    title: "Empowerment through Openness",
    body: "We exist to build free, open-source projects, educational resources, and community experiences that make a real difference.",
    items: [
      "Tools without subscription barriers.",
      "Knowledge platforms free forever.",
      "Education without paywalls.",
      "Guidance, not judgment.",
      "Resources running on trust.",
      "Events that connect and inspire.",
    ],
  },

  promise: {
    label: "// 03_THE_PROMISE",
    lines: [
      "We will never lock knowledge.",
      "We will never charge for access.",
      "We will never trade trust for money.",
    ],
    footnote: "Running on transparency, donations, and community strength.",
  },

  differentiation: {
    label: "// 04_DIFFERENTIATION",
    title: "Platform, Not Gatekeeper.",
    points: [
      {
        icon: "Shield",
        title: "Ownership",
        body: "You retain full credit. Your work remains yours to showcase on your resume. You keep decision-making power.",
      },
      {
        icon: "Globe",
        title: "The Ecosystem",
        body: "We provide contributors, visibility, and support. We amplify impact without taking credit.",
      },
    ],
    tagline: "\"Your project. Your vision. Our community. Our support.\"",
  },

  ecosystem: {
    label: "// 05_ECOSYSTEM_ARCHITECTURE",
    items: [
      { icon: "Code2", title: "OpenDev Tools", desc: "Simple utilities. (OpenStock, OpenReadme)" },
      { icon: "BookOpen", title: "OpenDev Library", desc: "Gateway to free books. (BookTrace)" },
      { icon: "Users", title: "OpenDev Learn", desc: "Roadmaps and mentorship." },
      { icon: "Terminal", title: "OpenDev Education", desc: "Free courses and workshops." },
      { icon: "Mic", title: "OpenDev Media", desc: "Podcasts and tutorials." },
      { icon: "Calendar", title: "OpenDev Events", desc: "Hackathons and conferences." },
      { icon: "Newspaper", title: "OpenDev News", desc: "Unbiased information." },
      { icon: "Heart", title: "OpenDev Community", desc: "Home for contributors." },
    ],
  },

  connectivity: {
    label: "// 06_CONNECTIVITY",
    quote: "\"Knowledge isn't just code—it's conversation, collaboration, and connection.\"",
    cards: [
      { title: "Build Together", body: "Hackathons and conferences where collaboration sparks innovation." },
      { title: "Learn Together", body: "Mentorship where everyone teaches and learns." },
    ],
  },

  call: {
    title: "You Belong Here.",
    body: "If you've ever felt you didn't belong. If you've ever struggled to find free resources. Join us. Build with us. Grow with us.",
    links: [
      { label: "GITHUB", href: "https://github.com/Open-Dev-Society" },
      { label: "LINKEDIN", href: "https://www.linkedin.com/company/opendevsociety-in/" },
      { label: "TWITTER / X", href: "https://x.com/opendevsociety" },
      { label: "DISCORD", href: "https://discord.gg/9xywA3pj" },
      { label: "EMAIL", href: "mailto:opendevsociety@gmail.com" },
    ] satisfies Link[],
  },

  faq: {
    label: "// 08_FAQ_LOG",
    items: [
      {
        q: "Can I showcase projects as my own work?",
        a: "Absolutely. You retain full credit. ODS exists to support your growth, not claim your achievements.",
      },
      { q: "Do I lose ownership rights?", a: "No. ODS is a platform, not a company claiming IP." },
      {
        q: "Can I leave or take my project back?",
        a: "Yes. If you ever want to move your project out, we support that using a no-lock-in policy.",
      },
    ],
  },

  footer: {
    line1: "OPEN_DEV_SOCIETY // MANIFESTO_PROTOCOL_V1",
    line2: "\"Because when knowledge is free, innovation is limitless.\"",
  },
};
