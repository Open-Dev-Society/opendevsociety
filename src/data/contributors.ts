export interface Contributor {
    login: string;
    name?: string;
    avatar_url: string;
    html_url: string;
    role?: string; // e.g., "Core Operator", "Maintainer", "Algorithmist"
    twitter?: string;
    type: 'User' | 'Bot';
}

export const manualContributors: Contributor[] = [
    {
        login: "ravixalgorithm",
        name: "Ravi Pratap Singh",
        avatar_url: "https://github.com/ravixalgorithm.png",
        html_url: "https://github.com/ravixalgorithm",
        role: "System Architect // Founder",
        type: "User"
    },
    {
        login: "priyanshucosmos",
        name: "Priyanshu Bhardwaj",
        avatar_url: "https://github.com/priyanshucosmos.png",
        html_url: "https://github.com/priyanshucosmos",
        role: "Co-Founder",
        type: "User"
    },
    {
        login: "bipin325",
        name: "Bipin kumar Madhur",
        avatar_url: "https://github.com/bipin325.png",
        html_url: "https://github.com/bipin325",
        role: "Core Maintainer",
        type: "User"
    },
    {
        login: "error404p",
        name: "Mahin Chauhan",
        avatar_url: "https://github.com/error404p.png",
        html_url: "https://github.com/error404p",
        role: "Core Maintainer",
        type: "User"
    },
    // Add more manual entries here
];
