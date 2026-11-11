export interface Contributor {
    login: string;
    name?: string;
    avatar_url: string;
    html_url: string;
    role?: string; // "Founder", "Lead Maintainer" or "Maintainer" (maintainers not in GitHub's stats are added by getOrgContributors)
    twitter?: string;
    type: 'User' | 'Bot';
}

export const manualContributors: Contributor[] = [
    {
        login: "ravixalgorithm",
        name: "Ravi Pratap Singh",
        avatar_url: "https://avatars.githubusercontent.com/ravixalgorithm",
        html_url: "https://github.com/ravixalgorithm",
        role: "System Architect // Founder",
        type: "User"
    },
    {
        login: "priyanshucosmos",
        name: "Priyanshu Bhardwaj",
        avatar_url: "https://avatars.githubusercontent.com/priyanshucosmos",
        html_url: "https://github.com/priyanshucosmos",
        role: "Lead Maintainer",
        type: "User"
    },
    {
        login: "bipin325",
        name: "Bipin kumar Madhur",
        avatar_url: "https://avatars.githubusercontent.com/bipin325",
        html_url: "https://github.com/bipin325",
        role: "Maintainer",
        type: "User"
    },
    {
        login: "error404p",
        name: "Mahin Chauhan",
        avatar_url: "https://avatars.githubusercontent.com/error404p",
        html_url: "https://github.com/error404p",
        role: "Maintainer",
        type: "User"
    },
    // Add more manual entries here
];

/** Who signs the manifesto and the contribute page: the founder, then the first maintainer. */
export const signers = ["ravixalgorithm", "priyanshucosmos"].map((l) => manualContributors.find((c) => c.login === l)!);

/** "Founder", "Lead maintainer" or "Maintainer": how a role is shown everywhere. */
export const roleLabel = (r = "") => (/Founder/i.test(r) ? "Founder" : /Lead Maintainer/i.test(r) ? "Lead maintainer" : "Maintainer");
