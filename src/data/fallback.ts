import { featuredModules } from "./projects";
import { Contributor } from "./contributors";

export const fallbackRepos = featuredModules.map((module, index) => ({
    id: index + 100,
    name: module.name,
    full_name: `Open-Dev-Society/${module.name}`,
    html_url: `https://github.com/Open-Dev-Society/${module.name}`,
    description: "System module operational. Public good software for the decentralized web.",
    stargazers_count: 120 + (index * 45),
    forks_count: 30 + (index * 12),
    open_issues_count: 5 + (index * 2),
    language: "TypeScript",
    contributors_url: "", // Not used in fallback mode directly
    owner: {
        login: "Open-Dev-Society",
        avatar_url: "https://avatars.githubusercontent.com/u/175626359?s=200&v=4"
    }
}));

export const fallbackContributors: Contributor[] = [
    {
        login: "ravixalgorithm",
        avatar_url: "https://github.com/ravixalgorithm.png",
        html_url: "https://github.com/ravixalgorithm",
        type: "User",
        role: "Founder"
    },
    {
        login: "System_Operator_01",
        avatar_url: "https://github.com/ghost.png",
        html_url: "https://github.com/ghost",
        type: "User",
        role: "Contributor"
    },
    {
        login: "System_Operator_02",
        avatar_url: "https://github.com/ghost.png",
        html_url: "https://github.com/ghost",
        type: "User",
        role: "Contributor"
    }
];

export const fallbackStats = {
    repos: featuredModules.length,
    stars: fallbackRepos.reduce((acc, repo) => acc + repo.stargazers_count, 0),
    list: fallbackRepos.map(repo => ({
        ...repo,
        customTags: featuredModules.find(m => m.name === repo.name)?.tags
    })),
    contributors: featuredModules.reduce((acc, module) => {
        acc[module.name] = fallbackContributors;
        return acc;
    }, {} as Record<string, any[]>)
};
