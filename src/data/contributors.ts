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
    // Add more manual entries here
];
