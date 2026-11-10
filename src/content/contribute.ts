import type { Link, PageMeta } from "./types";

// Source: src/app/(site)/contribute/page.tsx

export const contributeMeta: PageMeta = {
  title: "Open Dev Society — The Operating System for Open Source",
  description:
    "A decentralized society of developers, designers, and writers building free, open-source public goods. No paywalls. No gatekeeping. Just code.",
}; // no page metadata in old code; inherits root layout

export interface ContributeRole {
  /** DOM id; home page links to #code, #content, #education */
  id?: string;
  icon: string;
  title: string;
  audience: string;
  bullets: string[];
  cta: { label: string; href: string }; // href "#" = dead placeholder in old page
}

export const contribute = {
  back: { label: "Return_Index", href: "/" } satisfies Link,
  badge: "Operations_Manual // V1.0",
  titleLine1: "Contribution",
  titleLine2: "Guidelines.",
  intro:
    "Welcome to Open Dev Society! We're building a vibrant community where everyone can contribute—not just developers. Whether you write code, create content, teach, or organize events, you belong here.",

  toc: {
    title: "Table_of_Contents",
    items: [
      { label: "01. Ways_to_Contribute", href: "#ways" },
      { label: "02. Getting_Started", href: "#getting-started" },
      { label: "03. Core_Values", href: "#values" },
      { label: "04. Recognition_Protocol", href: "#recognition" },
    ] satisfies Link[],
  },

  roles: {
    id: "ways",
    label: "// 01_OPERATIONAL_ROLES",
    items: [
      {
        id: "code",
        icon: "Code2",
        title: "Code Ops",
        audience: "For: Developers, Engineers, Innovators.",
        bullets: ["Fix bugs or implement features.", "Review Pull Requests.", "Improve performance & security."],
        cta: { label: "ACCESS_REPOS ->", href: "https://github.com/Open-Dev-Society" },
      },
      {
        id: "content",
        icon: "PenTool",
        title: "Content Ops",
        audience: "For: Writers, Editors, Documentarians.",
        bullets: ["Write documentation & tutorials.", "Create guides and blog posts.", "Proofread existing content."],
        cta: { label: "VIEW_DOCS_REQ ->", href: "#" }, // dead link
      },
      {
        id: "education",
        icon: "GraduationCap",
        title: "Education Ops",
        audience: "For: Educators, Mentors, Trainers.",
        bullets: ["Develop course materials.", "Lead workshops & sessions.", "Mentor newcomers."],
        cta: { label: "JOIN_EDU_GROUP ->", href: "#" }, // dead link
      },
      {
        id: "media",
        icon: "Mic",
        title: "Media Ops",
        audience: "For: Podcasters, Designers, Creators.",
        bullets: ["Create podcasts & videos.", "Design logos & graphics.", "Create social media assets."],
        cta: { label: "MEDIA_KIT ->", href: "#" }, // dead link
      },
      {
        id: "events",
        icon: "Calendar",
        title: "Event Ops",
        audience: "For: Organizers, Facilitators.",
        bullets: ["Organize hackathons & meetups.", "Facilitate workshops.", "Moderate community channels."],
        cta: { label: "EVENT_CALENDAR ->", href: "#" }, // dead link
      },
      {
        icon: "Globe",
        title: "Global Ops",
        audience: "For: Translators, Polyglots.",
        bullets: ["Translate docs & sites.", "Localize UI elements.", "Adapt content for culture."],
        cta: { label: "TRANSLATE_NOW ->", href: "#" }, // dead link
      },
    ] satisfies ContributeRole[],
  },

  gettingStarted: {
    id: "getting-started",
    label: "// 02_INITIALIZATION_SEQUENCE",
    /** Rendered as a fake terminal. `lines` are the indented output rows. */
    steps: [
      {
        command: "init_sequence",
        flag: "--step=1",
        comment: "# Explore Our Projects",
        lines: ["> Visit GitHub: OpenStock, OpenReadme, BookTrace..."],
      },
      {
        command: "connect_network",
        flag: "--step=2",
        comment: "# Join Community",
        lines: ["> Discord: [LINK_PENDING]", "> Email: opendevsociety@gmail.com"], // Discord line is placeholder copy; real invite is in site.social.discord
      },
      {
        command: "find_task",
        flag: "--step=3",
        comment: "# Look for labels:",
        lines: ['- "good first issue" (Newcomers)', '- "help wanted" (Expertise)', '- "documentation" (Writers)'],
      },
      {
        command: "execute_commit",
        flag: "--step=4",
        comment: "# Submit Work",
        lines: ["> Code: Pull Request", "> Creative: Share via channels"],
      },
    ],
  },

  values: {
    id: "values",
    label: "// 03_CORE_VALUES",
    items: [
      "Open & Transparent",
      "Inclusive & Welcoming",
      "Free & Accessible",
      "Community-Driven",
      "Quality & Impact",
      "Respectful & Collaborative",
    ],
    conduct: {
      title: "Code of Conduct",
      body: "All contributors must follow our Code of Conduct. Be respectful, welcoming, and report violations to opendevsociety@gmail.com.",
    },
  },

  recognition: {
    id: "recognition",
    label: "// 04_RECOGNITION_PROTOCOL",
    intro: "We believe in celebrating contributions!",
    items: [
      { emoji: "📜", label: "Public Credits" },
      { emoji: "📣", label: "Social Shoutouts" },
      { emoji: "🏅", label: "Badges" },
      { emoji: "👕", label: "Swag / Merch" },
    ],
  },

  support: {
    label: "// 05_SUPPORT_LOG",
    items: [
      { icon: "Terminal", q: "General Questions?", a: "Open a GitHub Discussion or ask in Discord." },
      { icon: "Bug", q: "Found a bug?", a: "Open an issue with the label 'bug' on the relevant repository." },
    ],
  },

  footer: {
    line1: "OPEN_DEV_SOCIETY // OPERATION_HANDBOOK_V1",
    links: [
      { label: "READ_MANIFESTO", href: "/manifesto" },
      { label: "GITHUB", href: "https://github.com/Open-Dev-Society" },
    ] satisfies Link[],
    line2: "\"Let's build the future together, openly.\"",
  },
};
