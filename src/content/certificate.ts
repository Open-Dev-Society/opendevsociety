import type { Link, PageMeta } from "./types";

// Source: src/app/(site)/certificate/{page,login/page,manage/page}.tsx
// Private admin tooling (login-gated). Included for completeness; not part of the public redesign.

export const certificateMeta: PageMeta = {
  title: "Open Dev Society — The Operating System for Open Source",
  description:
    "A decentralized society of developers, designers, and writers building free, open-source public goods. No paywalls. No gatekeeping. Just code.",
}; // no page metadata in old code; inherits root layout

export type CertRoleKey = "member" | "contributor" | "maintainer" | "mentor";

/** Also duplicated as ROLE_LABELS / ROLE_MONO in verify/[id] and certificate/manage (hard-coded 3x). */
export const certificateRoles: Record<CertRoleKey, { label: string; mono: string; description: string }> = {
  member: {
    label: "Active Member",
    mono: "MEMBERSHIP",
    description:
      "in recognition of their active participation in the Open Dev Society — a decentralized network of developers, designers, and writers building free, open-source public goods.",
  },
  contributor: {
    label: "Code Contributor",
    mono: "CONTRIBUTION",
    description:
      "for meaningful contributions to open-source modules under the Open Dev Society — shipping code, fixing bugs, and advancing software made freely available to the world.",
  },
  maintainer: {
    label: "Core Maintainer",
    mono: "MAINTAINERSHIP",
    description:
      "for stewardship of Open Dev Society — reviewing pull requests, guiding contributors, and keeping public-good software healthy and shipping.",
  },
  mentor: {
    label: "Mentor & Educator",
    mono: "MENTORSHIP",
    description:
      "for sharing knowledge with the Open Dev Society community — teaching, writing, and lifting the next generation of open-source operators.",
  },
};

export const certificateDefaults = {
  name: "Recipient Name",
  role: "contributor" as CertRoleKey,
  date: "YYYY.MM.DD",
  certId: "ODS-XXXX-XXXX",
  issuer: "Ravi Pratap Singh",
  issuerHandle: "@ravixalgorithm",
};

/** The printed certificate face (shared look with verify/[id]). */
export const certificateDocument = {
  orgName: "Open Dev Society",
  est: "EST. 2024 // GLOBAL_COLLECTIVE",
  logoAlt: "ODS",
  certIdLabel: "// CERT_ID",
  /** `{mono}` = role mono label */
  kicker: "// CERTIFICATE_OF_{mono}",
  intro: "This certifies that",
  issuedOnLabel: "// ISSUED_ON",
  signatureName: "Open Dev Society",
  signatureUrl: "opendevsociety.vercel.app", // hard-coded domain; the live site may differ
  authorizedByLabel: "// AUTHORIZED_BY",
};

export const certificateGenerator = {
  eyebrow: "// CERTIFICATE_GENERATOR",
  titleStart: "Issue a",
  titleAccent: "Certificate.",
  intro:
    "Click any field on the certificate below to edit it directly. The URL updates as you type — copy the share link to send a pre-filled certificate, or download the final version as a PDF.",
  roleLabel: "Role",
  actions: {
    publish: "PUBLISH_TO_REGISTRY",
    publishing: "PUBLISHING...",
    copyDraft: "COPY_DRAFT_LINK",
    linkCopied: "LINK_COPIED",
    download: "DOWNLOAD_PDF",
    reset: "RESET",
    manage: { label: "MANAGE_REGISTRY", href: "/certificate/manage" } satisfies Link,
    logout: "LOGOUT",
    logoutTitle: "Sign out of the certificate generator",
  },
  errors: {
    heading: "// PUBLISH_FAILED",
    hint: "CHECK_THAT_GITHUB_TOKEN_HAS_CONTENTS_WRITE_SCOPE_ON_THE_REPO",
    needName: "Set the recipient name before publishing.",
    failed: "Publish failed.",
  },
  success: {
    heading: "// PUBLISHED_TO_REGISTRY",
    /** "Certificate {id} is now live. Share the verify URL with the recipient." */
    before: "Certificate",
    after: "is now live. Share the verify URL with the recipient.",
    copyVerify: "COPY_VERIFY_URL",
    copied: "COPIED",
    openVerify: "OPEN_VERIFY_PAGE",
    viewRegistry: { label: "VIEW_REGISTRY", href: "/certificate/manage" } satisfies Link,
  },
  confirmPublish: [
    "Publish this certificate to the public registry?",
    "• Recipient: {name}",
    "• Role: {role}",
    "• Cert ID: {certId}",
    "This commits to data/certificates.json on GitHub and creates a public verify page.",
  ],
  copyPrompt: "Copy this link:",
  editHint: "// CLICK_ANY_TEXT_ON_THE_CERTIFICATE_TO_EDIT",
  printHint: "// PRINT_DIALOG → DESTINATION: SAVE_AS_PDF — ORIENTATION: LANDSCAPE",
};

export const certificateLogin = {
  eyebrow: "// RESTRICTED_ACCESS",
  titleStart: "Operator",
  titleAccent: "Auth.",
  intro: "The certificate generator is private. Enter the access key to continue.",
  fieldLabel: "ACCESS_KEY",
  placeholder: "••••••••",
  submit: "AUTHENTICATE",
  submitting: "AUTHENTICATING...",
  errorPrefix: "// ERROR:",
  authFailed: "Authentication failed.",
  footnote: "// SESSION_PERSISTS_30_DAYS",
};

export const certificateManage = {
  eyebrow: "// CERTIFICATE_REGISTRY",
  titleStart: "Manage",
  titleAccent: "Certificates.",
  intro:
    "Every certificate issued through the registry, with controls to revoke or restore. Status changes are committed to data/certificates.json in the repo.",
  issueNew: { label: "ISSUE_NEW", href: "/certificate" } satisfies Link,
  stats: { total: "// TOTAL_ISSUED", active: "// ACTIVE", revoked: "// REVOKED" },
  filterPlaceholder: "FILTER_BY_ID_NAME_ROLE_STATUS...",
  refresh: "REFRESH",
  error: "// REGISTRY_ERROR",
  loading: "LOADING_REGISTRY...",
  empty: "NO_CERTIFICATES_ISSUED_YET",
  noMatches: "NO_MATCHES_FOR_FILTER",
  columns: ["ID", "Name", "Role", "Issued", "Status", "Actions"],
  actions: { verify: "VERIFY", copyLink: "COPY_LINK", copied: "COPIED", revoke: "REVOKE", restore: "RESTORE", busy: "..." },
  prompts: {
    revoke: "Revoke certificate {id}?\n\nOptional reason (shown publicly on the verify page):",
    restore: "Restore certificate {id} to ACTIVE status?",
  },
  footnote: "// EACH_ACTION_COMMITS_TO_GITHUB — VERIFY_PAGE_UPDATES_WITHIN_SECONDS",
};
