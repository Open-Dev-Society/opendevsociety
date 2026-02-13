export interface Partner {
    name: string;
    url: string;
    logo?: string; // Path to logo image in /public
    invertLogo?: boolean; // Invert white logos to black
    description: string;
    type: "technology" | "community";
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
        name: "Siray.ai",
        url: "https://siray.ai",
        logo: "/partners/sirayLogo.svg",
        description: "Empowering developers with unified AI infrastructure- fast, reliable, and affordable. Run, scale, and build smarter with Siray.",
        type: "technology",
    },
    {
        name: "StellAILoom",
        url: "https://stellailoom.com",
        logo: "/partners/stellailoomLogo.svg",
        invertLogo: true,
        description: "A global hub for AI innovation, connecting creators and users. Publish, discover, and experience cutting-edge AI tools—empowering everyone to join the intelligent future.",
        type: "technology",
    },
];

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
