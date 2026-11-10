import type { PageMeta } from "./types";

// Source: src/app/(site)/verify/[id]/page.tsx. Role labels: see certificateRoles in ./certificate.

/** `{id}` = certificate id */
export const verifyMeta: PageMeta & { robots: { index: boolean; follow: boolean } } = {
  title: "Verify {id} — Open Dev Society",
  description: "Open Dev Society certificate registry: verify the authenticity and status of certificate {id}.",
  robots: { index: false, follow: false },
};

export const verify = {
  unreachable: {
    eyebrow: "// REGISTRY_UNREACHABLE",
    title: "Verification unavailable.",
    body: "The certificate registry could not be reached right now.",
    fallbackError: "Lookup failed.",
  },
  notFound: {
    eyebrow: "// CERT_NOT_FOUND",
    title: "No certificate matches that ID.",
    /** "The identifier {id} does not appear in the Open Dev Society registry." */
    before: "The identifier",
    after: "does not appear in the Open Dev Society registry.",
    hint: "If you believe this certificate should exist, contact the issuer. Newly-issued certificates may take a few seconds to appear here.",
    home: { label: "RETURN_HOME", href: "/" },
  },
  eyebrow: "// CERTIFICATE_REGISTRY",
  revoked: { titleStart: "This certificate has been", accent: "revoked.", banner: "STATUS_REVOKED", stamp: "REVOKED" },
  active: { titleStart: "This certificate is", accent: "authentic.", banner: "STATUS_ACTIVE" },
  /** "Issued by Open Dev Society. Registry record below reflects the current status of certificate {id}." */
  subtitleBefore: "Issued by Open Dev Society. Registry record below reflects the current status of certificate",
  revokedBody: {
    /** "This certificate was revoked[ on {date}] by Open Dev Society. It is no longer valid.[ Reason: {reason}]" */
    before: "This certificate was revoked",
    after: "by Open Dev Society. It is no longer valid.",
    reasonLabel: "Reason:",
  },
  activeBody: {
    /** "Recorded in the Open Dev Society registry on {date}. No revocation has been issued." */
    before: "Recorded in the Open Dev Society registry on",
    after: "No revocation has been issued.",
  },
  metaLabels: ["// CERT_ID", "// ISSUED", "// STATUS", "// LAST_UPDATED"],
  sourceOfTruth: "// SOURCE_OF_TRUTH:", // followed by {CERT_REPO_OWNER}/{CERT_REPO_NAME}/data/certificates.json
  sourceDefaults: { owner: "Open-Dev-Society", repo: "opendevsociety", file: "data/certificates.json" },
};
