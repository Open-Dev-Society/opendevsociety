import type { Heading, Link, PageMeta } from "./types";

// Source: src/app/(site)/page.tsx + components/HeroSection.tsx
// Projects (featuredModules), mentions and partners live in src/data/*.

export const homeMeta: PageMeta = {
  title: "Open Dev Society — The Operating System for Open Source",
  description:
    "A decentralized society of developers, designers, and writers building free, open-source public goods. No paywalls. No gatekeeping. Just code.",
}; // no page-level metadata in old code; inherits root layout

export const homeHero = {
  monoLabel: "EST. 2024 // GLOBAL_COLLECTIVE",
  headlineMain: "The Operating System",
  headlineSub: "for Open Source.",
  body: "We are a decentralized society of developers, designers, and writers building public goods.",
  bodyStrong: "No paywalls. No gatekeeping. Just code.",
  primaryCta: { label: "[ START_CONTRIBUTING ]", href: "https://github.com/Open-Dev-Society", external: true } satisfies Link,
  secondaryCta: { label: "[ READ_MANIFESTO ]", href: "/manifesto" } satisfies Link,
  founded: "2024-07-01T00:00:00Z",
  status: {
    title: "SYSTEM_STATUS",
    live: "LIVE",
    rows: [
      { label: "KERNEL", value: "v0.1.0" }, // placeholder version
      { label: "ACTIVE_REPOS", value: "live: featured repo count" },
      { label: "OPERATORS", value: "1000+" }, // hard-coded
      { label: "GITHUB_STARS", value: "live: org stars + '+'" },
      { label: "UPTIME", value: "live: ticker since founded" },
    ],
    loadingValue: "...",
    uptimeLoading: "calculating...",
    heartbeatLabel: "// LAST_HEARTBEAT",
    heartbeatLoading: "syncing...",
  },
};

export interface Pillar {
  num: string;
  code: string;
  icon: string;
  titleStart: string;
  titleEnd: string;
  description: string;
  tags: string[];
  cta: Link;
}

export const homeCapabilities = {
  heading: {
    eyebrow: "// SYSTEM_CAPABILITIES [3_VECTORS]",
    title: "What we",
    accent: "do.",
    description: "Three vectors of operation. Find the one that matches your capacity and start shipping.",
  } satisfies Heading,
  exploreLabel: "[ EXPLORE_VECTOR ]",
  pillars: [
    {
      num: "01",
      code: "INITIATIVES",
      icon: "Package",
      titleStart: "We",
      titleEnd: "Build.",
      description:
        "From developer tools to open libraries. We create software that solves real problems and release it for free.",
      tags: ["OPEN_STOCK", "BOOK_TRACE"],
      cta: { label: "[ EXPLORE_VECTOR ]", href: "/projects" },
    },
    {
      num: "02",
      code: "KNOWLEDGE",
      icon: "BookOpen",
      titleStart: "We",
      titleEnd: "Teach.",
      description:
        "Knowledge should be free. We produce roadmaps, tutorials, and mentorship programs to help you grow.",
      tags: ["MENTORSHIP", "ROADMAPS"],
      cta: { label: "[ EXPLORE_VECTOR ]", href: "/contribute#education" },
    },
    {
      num: "03",
      code: "NETWORK",
      icon: "Globe",
      titleStart: "We",
      titleEnd: "Connect.",
      description:
        "A global network of like-minded creators. Find your team, launch your project, and make an impact.",
      tags: ["HACKATHONS", "EVENTS"],
      cta: { label: "[ EXPLORE_VECTOR ]", href: "/partners" },
    },
  ] satisfies Pillar[],
};

export const homePrinciples = {
  heading: {
    eyebrow: "// SYSTEM_MANIFESTO [4_CONSTANTS]",
    title: "Operating",
    accent: "Principles.",
    description: "The non-negotiables. Every decision we make is filtered through these four constants.",
  } satisfies Heading,
  items: [
    {
      num: "01",
      code: "DEFAULT_TO_OPEN",
      icon: "Unlock",
      title: "Default to",
      accent: "Open.",
      description:
        "All code is open-source. All knowledge is public. We believe transparency is the only way to build trust at scale.",
    },
    {
      num: "02",
      code: "PERMISSIONLESS_ACCESS",
      icon: "Users",
      title: "Permissionless",
      accent: "Access.",
      description:
        "No gatekeepers. No interviews. You don't need permission to fork, contribute, or start building. Just start.",
    },
    {
      num: "03",
      code: "RAPID_ITERATION",
      icon: "TrendingUp",
      title: "Rapid",
      accent: "Iteration.",
      description: "We ship fast. We break things. We solve real problems with code, not endless meetings.",
    },
    {
      num: "04",
      code: "DISTRIBUTED_STRENGTH",
      icon: "Heart",
      title: "Distributed",
      accent: "Strength.",
      description: "We are stronger together. We mentor the next generation and lift each other up.",
    },
  ],
  principleLabel: "// PRINCIPLE_",
};

export const homeModules = {
  eyebrow: "// KERNEL_MODULES [ACTIVE_DEPLOYMENTS]",
  viewAll: { label: "VIEW_ALL_MODULES_({count})", href: "/projects" } satisfies Link,
  loading: "LOADING_SYSTEM_DATA...",
  noDescription: "No description provided.",
  operatorsLabel: "Active Operators:",
  viewRepoLabel: "VIEW_REPO",
  shown: 4,
};

export const homeRoles = {
  heading: {
    eyebrow: "// OPERATOR_ONBOARDING [SELECT_CLASS]",
    title: "Initialize Your Role.",
    description: "The society needs all types of operators. Identify your capacity and join the network.",
  } satisfies Heading,
  roles: [
    { title: "Developer", blurb: "Code, review, optimize.", icon: "Code2", label: "INIT_DEV_PROTOCOL", href: "/contribute#code" },
    { title: "Writer", blurb: "Guide, document, inspire.", icon: "PenTool", label: "INIT_DOCS_PROTOCOL", href: "/contribute#content" },
    { title: "Educator", blurb: "Teach, mentor, grow.", icon: "GraduationCap", label: "INIT_EDU_PROTOCOL", href: "/contribute#education" },
  ],
  ctas: [
    { label: "VIEW_FULL_OPERATIONS_MANUAL", href: "/contribute" },
    { label: "[ VIEW_ACTIVE_OPERATORS ]", href: "/contributors" },
  ] satisfies Link[],
};

export const homePartners = {
  heading: {
    eyebrow: "// SYSTEM_ALLIANCES [ACTIVE_NETWORKS]",
    title: "Trusted",
    accent: "Partners.",
    description: "Organizations and events powering our mission to make open source accessible to everyone.",
  } satisfies Heading,
  /** Hard-coded on the home page (not read from src/data/partners). */
  logos: [
    { name: "siray.ai", href: "https://siray.ai", src: "/partners/sirayLogo.svg", invert: false },
    { name: "StellAILoom", href: "https://stellailoom.com", src: "/partners/stellailoomLogo.svg", invert: true },
    { name: "Atlas Cloud", href: "https://atlascloud.ai", src: "/partners/atlascloud.svg", invert: false },
  ],
  /** Hard-coded; also present in src/data/partners events. */
  events: [
    { badge: "Community Partner", name: "Apretre 3.0", by: "by Resourcio Community" },
    { badge: "Community Partner", name: "JWOC – JGEC Winter of Code", by: "by JGEC" },
  ],
  ctas: [
    { label: "VIEW_ALL_ALLIANCES", href: "/partners" },
    { label: "FOR_BRANDS →", href: "/partners#partner-cta" },
    { label: "FOR_COMMUNITIES →", href: "/partners#partner-cta" },
  ] satisfies Link[],
};

export const homeMetrics = {
  title: "System Metrics",
  founded: "Founded in July 2024 by",
  founder: "Ravi Pratap Singh",
  founderHandle: "@ravixalgorithm",
  members: { label: "MEMBERS", value: "1000+" }, // hard-coded
  repos: "REPOS",
  stars: "GITHUB STARS",
};

export const homeWordOfMouth = {
  heading: {
    eyebrow: "// SIGNAL_INTERCEPT [COMMUNITY_LOVE]",
    title: "Word of",
    accent: "Mouth.",
    description: "What the community is saying about Open Dev Society across the internet.",
  } satisfies Heading,
  /** shows first 3 of src/data/mentions where `highlight` is set */
  shown: 3,
  cta: { label: "VIEW_ALL_SIGNALS", href: "/word-of-mouth" } satisfies Link,
};
