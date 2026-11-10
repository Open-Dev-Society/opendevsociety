// Certificate roles and form defaults, shared by the certificate tool and /verify.

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
