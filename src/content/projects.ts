import type { Link, PageMeta } from "./types";

// Source: src/app/(site)/projects/page.tsx. Repo list = featuredModules in src/data/projects (+ live GitHub API).

export const projectsMeta: PageMeta = {
  title: "Open Dev Society — The Operating System for Open Source",
  description:
    "A decentralized society of developers, designers, and writers building free, open-source public goods. No paywalls. No gatekeeping. Just code.",
}; // no page metadata in old code; inherits root layout

export const projects = {
  back: { label: "Return_Index", href: "/" } satisfies Link,
  badge: "System_Modules // Full_Index",
  title: "Curated Index.",
  intro: "The complete catalog of Open Dev Society initiatives. Open for contribution.",
  loading: "INITIALIZING_DATALINK...",
  noDescription: "No description provided.",
  fallbackTag: "Code",
  repoLinkLabel: "REPO_ACCESS",
  statTitles: { stars: "Stars", forks: "Forks", issues: "Open Issues" },
  /** `{count}` = number of repos found */
  footer: "END_OF_LIST // {count}_MODULES_FOUND",
};
