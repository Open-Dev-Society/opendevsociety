// Sponsors and partners. Source of truth for sponsors: OpenStock's lib/sponsors.ts
// (github.com/Open-Dev-Society/OpenStock). Edit both when someone starts or stops sponsoring.

export interface Partner {
    name: string;
    url: string;
    logo: string; // Path in /public, drawn as a mask in the site's ink
    iconOnly?: boolean; // The logo is a mark without the name, so the name is shown beside it
    kind: "sponsor" | "technology partner";
    tier?: "Partner" | "Company";
    status: "active" | "past";
    period?: string; // e.g. "2026"
    line: string; // One plain sentence
}

export interface Event {
    name: string;
    organizer: string;
    url?: string;
    date?: string;
    role: string; // e.g., "Community Partner", "Sponsor"
    description: string;
}

export const partners: Partner[] = [
    {
        name: "Orbit",
        url: "https://github.com/diip3sh/orbit",
        logo: "/partners/orbit.png",
        iconOnly: true,
        kind: "sponsor",
        tier: "Partner",
        status: "active",
        line: "Free, open-source screen recorder and video editor for macOS.",
    },
    {
        name: "StellAILoom",
        url: "https://stellailoom.com",
        logo: "/partners/stellailoomLogo.svg",
        kind: "technology partner",
        status: "active",
        line: "A hub where creators publish AI tools and everyone else finds and tries them.",
    },
    {
        name: "Atlas Cloud",
        url: "https://www.atlascloud.ai",
        logo: "/partners/atlascloud.svg",
        kind: "sponsor",
        tier: "Partner",
        status: "past",
        line: "One API for hundreds of AI models, plus the infrastructure to run them.",
    },
    {
        name: "Siray.ai",
        url: "https://www.siray.ai",
        logo: "/partners/sirayLogo.svg",
        kind: "sponsor",
        tier: "Partner",
        status: "past",
        period: "2026",
        line: "Unified AI infrastructure: run and scale models behind one fast, affordable API.",
    },
    {
        name: "RapidProxy",
        url: "https://www.rapidproxy.io",
        logo: "/partners/rapidproxy.png",
        kind: "sponsor",
        tier: "Company",
        status: "past",
        period: "2026",
        line: "Residential proxies for large-scale web scraping and data collection.",
    },
];

export const activePartners = partners.filter((p) => p.status === "active");
export const pastPartners = partners.filter((p) => p.status === "past");

// People who sponsored publicly on GitHub (private sponsors stay anonymous).
export const supporters: { name: string; login: string }[] = [
    { name: "Jonas Gunklach", login: "jonasgunklach" },
    { name: "Dan Sellars", login: "xlab-nyc" },
    { name: "Mangolito", login: "Mangolito" },
];

// GitHub Sponsors is on the founder's account; tiers are $5, $25, $100 and $500 a month.
export const sponsorUrl = "https://github.com/sponsors/ravixalgorithm";

export const events: Event[] = [
    {
        name: "Apretre 3.0",
        organizer: "Resourcio Community",
        url: "#",
        date: "2026",
        role: "Community Partner",
        description: "An open-source event fostering collaboration and innovation in the developer community.",
    },
    {
        name: "JWOC – JGEC Winter of Code",
        organizer: "JGEC",
        url: "#",
        date: "2026",
        role: "Community Partner",
        description: "A winter coding program by JGEC to encourage open-source contributions among students.",
    },
];
