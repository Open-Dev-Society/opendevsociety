// Certificate roles and form defaults, shared by the certificate tool and /verify.

export type CertRoleKey = "member" | "contributor" | "maintainer" | "mentor";

/** Also duplicated as ROLE_LABELS / ROLE_MONO in verify/[id] and certificate/manage (hard-coded 3x). */
export const certificateRoles: Record<CertRoleKey, { label: string; mono: string; description: string }> = {
  member: {
    label: "Active Member",
    mono: "MEMBERSHIP",
    description:
      "in recognition of being a valued member of Open Dev Society: showing up, sharing ideas and helping build free, open-source tools that anyone can use.",
  },
  contributor: {
    label: "Code Contributor",
    mono: "CONTRIBUTION",
    description:
      "for real contributions to Open Dev Society projects: writing code, fixing bugs and shipping improvements that make free, open-source software better for everyone.",
  },
  maintainer: {
    label: "Core Maintainer",
    mono: "MAINTAINERSHIP",
    description:
      "for caring for Open Dev Society projects: reviewing every change with care, guiding new contributors and keeping the tools healthy, free and moving forward.",
  },
  mentor: {
    label: "Mentor & Educator",
    mono: "MENTORSHIP",
    description:
      "for lifting others in the Open Dev Society community: teaching, answering questions and helping newcomers make their first contribution to open source.",
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
