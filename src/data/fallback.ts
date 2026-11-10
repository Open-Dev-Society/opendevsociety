import { featuredModules } from "./projects";
import type { Contributor } from "./contributors";
import type { OrgContributor, OrgRepo, OrgTotals } from "../lib/github";

// Real snapshot from the GitHub API (gh api orgs/Open-Dev-Society/repos, /repos/*/contributors,
// search/issues label:"good first issue"), taken 2026-11-10T11:15Z. Used when live fetches in
// src/lib/github.ts fail. Refresh: GITHUB_TOKEN=$(gh auth token) node scripts/check-github.mjs --print
export const snapshotTakenAt = "2026-11-10T11:15Z";

export const snapshotRepos: OrgRepo[] = [
  {
    "name": "OpenStock",
    "description": "OpenStock is an open-source alternative to expensive market platforms. Track real-time prices, set personalized alerts, and explore detailed company insights — built openly, for everyone, forever free.",
    "html_url": "https://github.com/Open-Dev-Society/OpenStock",
    "homepage": "https://openstock-ods.vercel.app",
    "language": "TypeScript",
    "topics": [
      "coderabbit",
      "inngest",
      "nextjs",
      "shadcn-ui",
      "stock-market",
      "tailwindcss"
    ],
    "stars": 21406,
    "forks": 2669,
    "open_issues": 8,
    "good_first_issues": 0,
    "pushed_at": "2026-11-09T19:21:59Z"
  },
  {
    "name": "kitbash",
    "description": "Tells your AI agent which parts of your idea already exist on GitHub, which to adapt, and which to just write — every repo verified live. MCP server, Claude Code plugin, and agent skill.",
    "html_url": "https://github.com/Open-Dev-Society/kitbash",
    "homepage": null,
    "language": "TypeScript",
    "topics": [
      "agent",
      "agent-skill",
      "agent-skills",
      "ai-agents",
      "claude",
      "claude-code",
      "claude-code-plugin",
      "claude-code-skill",
      "claude-plugin",
      "claude-skills",
      "developer-tools",
      "mcp",
      "mcp-protocol",
      "mcp-server",
      "mcp-servers",
      "mcp-tools",
      "model-context-protocol",
      "open-dev-society",
      "open-source",
      "typescript"
    ],
    "stars": 56,
    "forks": 2,
    "open_issues": 3,
    "good_first_issues": 0,
    "pushed_at": "2026-11-08T20:12:46Z"
  },
  {
    "name": "kine-ui",
    "description": "Kine UI is an open-source alternative to heavy, black-box computer vision libraries. Build spatial interfaces, track real-time gestures, and explore native spatial computing — built openly, for everyone, forever free.",
    "html_url": "https://github.com/Open-Dev-Society/kine-ui",
    "homepage": "https://kine-ui.vercel.app",
    "language": "TypeScript",
    "topics": [
      "computer-vision",
      "framer-motion",
      "gesture-detection",
      "gesture-recognition",
      "mediapipe",
      "nextjs",
      "npm",
      "npm-package",
      "open-dev-society",
      "open-source",
      "shadcn-ui",
      "ui-library"
    ],
    "stars": 41,
    "forks": 4,
    "open_issues": 0,
    "good_first_issues": 0,
    "pushed_at": "2026-02-24T12:28:14Z"
  },
  {
    "name": "openreadme",
    "description": "OpenReadme is a modern, open-source GitHub profile README generator that creates beautiful, auto-updating profile banners with customizable bento-style grids. ",
    "html_url": "https://github.com/Open-Dev-Society/openreadme",
    "homepage": "https://openreadme.vercel.app",
    "language": "TypeScript",
    "topics": [
      "bento",
      "bento-grid",
      "nextjs",
      "open-source",
      "readme-generator",
      "readme-profile"
    ],
    "stars": 33,
    "forks": 7,
    "open_issues": 0,
    "good_first_issues": 0,
    "pushed_at": "2026-11-08T04:55:11Z"
  },
  {
    "name": "booktrace",
    "description": "Book Trace – A free, open-source book discovery platform that indexes books from multiple sources, helping users find free, verified, and purchasable books.",
    "html_url": "https://github.com/Open-Dev-Society/booktrace",
    "homepage": null,
    "language": "TypeScript",
    "topics": [
      "bookdiscovery",
      "bookindexer",
      "education",
      "freebooks",
      "nextjs",
      "open-source",
      "openlibrary",
      "tailwindcss",
      "webapp"
    ],
    "stars": 18,
    "forks": 6,
    "open_issues": 1,
    "good_first_issues": 0,
    "pushed_at": "2025-10-08T20:27:13Z"
  },
  {
    "name": "opencosmos",
    "description": "Real-time space data visualization dashboard with ISS tracking, live charts, and responsive design",
    "html_url": "https://github.com/Open-Dev-Society/opencosmos",
    "homepage": null,
    "language": "JavaScript",
    "topics": [],
    "stars": 12,
    "forks": 5,
    "open_issues": 0,
    "good_first_issues": 0,
    "pushed_at": "2026-10-11T22:28:31Z"
  },
  {
    "name": "openhaven",
    "description": "OPENHAVEN is a free, open-source platform for developers to share, discover, and collaborate on code snippets. Think of it as GitHub Gist meets a social network — built with modern technologies and designed for the way developers work today.",
    "html_url": "https://github.com/Open-Dev-Society/openhaven",
    "homepage": "https://openhaven.vercel.app",
    "language": "TypeScript",
    "topics": [],
    "stars": 4,
    "forks": 2,
    "open_issues": 0,
    "good_first_issues": 0,
    "pushed_at": "2026-01-13T21:38:27Z"
  },
  {
    "name": "openmind",
    "description": "An analytical tool engineered to go beyond traditional search. Rather than returning a list of links or providing generic AI-generated summaries, OpenMind performs structured, topic-specific case studies on demand.",
    "html_url": "https://github.com/Open-Dev-Society/openmind",
    "homepage": "https://openmind-ods.vercel.app",
    "language": "TypeScript",
    "topics": [],
    "stars": 4,
    "forks": 3,
    "open_issues": 0,
    "good_first_issues": 0,
    "pushed_at": "2026-03-09T10:08:38Z"
  },
  {
    "name": "OpenCine",
    "description": "A modern open-source app that displays trending and popular movies using the TMDB API. Built to grow into a community for movie lovers — explore films, share opinions, discuss favorites, and collaborate on new features. Anyone can contribute and help shape the future of this project.",
    "html_url": "https://github.com/Open-Dev-Society/OpenCine",
    "homepage": null,
    "language": "JavaScript",
    "topics": [],
    "stars": 2,
    "forks": 1,
    "open_issues": 0,
    "good_first_issues": 0,
    "pushed_at": "2025-12-12T18:29:34Z"
  },
  {
    "name": "den",
    "description": "Den: your Mac in one app. Alpha (0.1.0-alpha), not a public release.",
    "html_url": "https://github.com/Open-Dev-Society/den",
    "homepage": null,
    "language": "Swift",
    "topics": [],
    "stars": 2,
    "forks": 0,
    "open_issues": 0,
    "good_first_issues": 0,
    "pushed_at": "2026-10-17T08:12:11Z"
  },
  {
    "name": "ports",
    "description": "See which dev servers are running on your Mac and what they cost you. A tiny native menu bar app and terminal command.",
    "html_url": "https://github.com/Open-Dev-Society/ports",
    "homepage": null,
    "language": "Swift",
    "topics": [
      "ai-coding",
      "appkit",
      "developer-tools",
      "localhost",
      "macos",
      "memory-usage",
      "menu-bar-app",
      "swift"
    ],
    "stars": 2,
    "forks": 0,
    "open_issues": 5,
    "good_first_issues": 1,
    "pushed_at": "2026-11-08T13:36:10Z"
  },
  {
    "name": "ByteMyCV",
    "description": "ByteMyCV is an open-source, AI-powered resume analysis tool that provides structured insights, skill extraction, ATS scoring, and content evaluation. Built under Open Dev Society (ODS) to enable transparent, community-driven development.",
    "html_url": "https://github.com/Open-Dev-Society/ByteMyCV",
    "homepage": null,
    "language": null,
    "topics": [],
    "stars": 1,
    "forks": 1,
    "open_issues": 0,
    "good_first_issues": 0,
    "pushed_at": "2025-11-23T22:27:05Z"
  },
  {
    "name": "zomb",
    "description": "A health check for codebases written with AI: security holes, zombie code, sprawl and architecture. Stops agents adding more while they work.",
    "html_url": "https://github.com/Open-Dev-Society/zomb",
    "homepage": null,
    "language": "TypeScript",
    "topics": [],
    "stars": 1,
    "forks": 0,
    "open_issues": 0,
    "good_first_issues": 0,
    "pushed_at": "2026-10-20T22:26:11Z"
  },
  {
    "name": ".github",
    "description": null,
    "html_url": "https://github.com/Open-Dev-Society/.github",
    "homepage": null,
    "language": null,
    "topics": [
      "community",
      "community-project",
      "open-dev-society",
      "open-source"
    ],
    "stars": 0,
    "forks": 0,
    "open_issues": 0,
    "good_first_issues": 0,
    "pushed_at": "2026-09-20T10:27:38Z"
  },
  {
    "name": "opendevsociety",
    "description": null,
    "html_url": "https://github.com/Open-Dev-Society/opendevsociety",
    "homepage": "https://opendevsociety.vercel.app",
    "language": "TypeScript",
    "topics": [],
    "stars": 0,
    "forks": 0,
    "open_issues": 0,
    "good_first_issues": 0,
    "pushed_at": "2026-06-04T20:23:12Z"
  },
  {
    "name": "tearcopy",
    "description": "A small JavaScript library that animates copied text as a ragged paper strip while preserving clipboard behavior.",
    "html_url": "https://github.com/Open-Dev-Society/tearcopy",
    "homepage": null,
    "language": "TypeScript",
    "topics": [],
    "stars": 0,
    "forks": 0,
    "open_issues": 0,
    "good_first_issues": 0,
    "pushed_at": "2026-11-08T10:03:25Z"
  },
  {
    "name": "settle-ui",
    "description": "React optimistic UI animations: glass-like pending rows, confirmation sweeps, and failure dissolves with retryable data.",
    "html_url": "https://github.com/Open-Dev-Society/settle-ui",
    "homepage": null,
    "language": "TypeScript",
    "topics": [],
    "stars": 0,
    "forks": 0,
    "open_issues": 0,
    "good_first_issues": 0,
    "pushed_at": "2026-11-08T19:30:04Z"
  }
];

// Bots and agent accounts (dependabot, vercel, cursoragent) excluded.
export const snapshotContributors: OrgContributor[] = [
  {
    "login": "ravixalgorithm",
    "avatar_url": "https://avatars.githubusercontent.com/u/148683640?v=4",
    "html_url": "https://github.com/ravixalgorithm",
    "contributions": 3978,
    "repos": [
      "opencosmos",
      ".github",
      "OpenStock",
      "opendevsociety",
      "booktrace",
      "openreadme",
      "openhaven",
      "kine-ui",
      "openmind",
      "kitbash",
      "zomb",
      "den",
      "ports",
      "tearcopy",
      "settle-ui"
    ]
  },
  {
    "login": "keshav-005",
    "avatar_url": "https://avatars.githubusercontent.com/u/180140750?v=4",
    "html_url": "https://github.com/keshav-005",
    "contributions": 9,
    "repos": [
      "OpenStock"
    ]
  },
  {
    "login": "landerdevelopers",
    "avatar_url": "https://avatars.githubusercontent.com/u/297453033?v=4",
    "html_url": "https://github.com/landerdevelopers",
    "contributions": 8,
    "repos": [
      ".github",
      "openreadme"
    ]
  },
  {
    "login": "diip3sh",
    "avatar_url": "https://avatars.githubusercontent.com/u/99866329?v=4",
    "html_url": "https://github.com/diip3sh",
    "contributions": 7,
    "repos": [
      "zomb"
    ]
  },
  {
    "login": "PriyanshuCosmos",
    "avatar_url": "https://avatars.githubusercontent.com/u/222009720?v=4",
    "html_url": "https://github.com/PriyanshuCosmos",
    "contributions": 4,
    "repos": [
      "ByteMyCV",
      "OpenCine"
    ]
  },
  {
    "login": "nb-src",
    "avatar_url": "https://avatars.githubusercontent.com/u/76625701?v=4",
    "html_url": "https://github.com/nb-src",
    "contributions": 3,
    "repos": [
      "OpenStock"
    ]
  },
  {
    "login": "Bortlesboat",
    "avatar_url": "https://avatars.githubusercontent.com/u/169967362?v=4",
    "html_url": "https://github.com/Bortlesboat",
    "contributions": 2,
    "repos": [
      "OpenStock"
    ]
  },
  {
    "login": "ahmaddirar-ios",
    "avatar_url": "https://avatars.githubusercontent.com/u/57848046?v=4",
    "html_url": "https://github.com/ahmaddirar-ios",
    "contributions": 2,
    "repos": [
      "OpenStock"
    ]
  },
  {
    "login": "akoweicollinxx",
    "avatar_url": "https://avatars.githubusercontent.com/u/110723714?v=4",
    "html_url": "https://github.com/akoweicollinxx",
    "contributions": 2,
    "repos": [
      "OpenStock"
    ]
  },
  {
    "login": "alexander-schneider",
    "avatar_url": "https://avatars.githubusercontent.com/u/33292100?v=4",
    "html_url": "https://github.com/alexander-schneider",
    "contributions": 2,
    "repos": [
      "OpenStock"
    ]
  },
  {
    "login": "chinnsenn",
    "avatar_url": "https://avatars.githubusercontent.com/u/13096352?v=4",
    "html_url": "https://github.com/chinnsenn",
    "contributions": 2,
    "repos": [
      "OpenStock"
    ]
  },
  {
    "login": "cosmind-rusu",
    "avatar_url": "https://avatars.githubusercontent.com/u/75861657?v=4",
    "html_url": "https://github.com/cosmind-rusu",
    "contributions": 2,
    "repos": [
      "OpenStock"
    ]
  },
  {
    "login": "ettoreciolli",
    "avatar_url": "https://avatars.githubusercontent.com/u/272523740?v=4",
    "html_url": "https://github.com/ettoreciolli",
    "contributions": 2,
    "repos": [
      "OpenStock"
    ]
  },
  {
    "login": "octo-patch",
    "avatar_url": "https://avatars.githubusercontent.com/u/266937838?v=4",
    "html_url": "https://github.com/octo-patch",
    "contributions": 2,
    "repos": [
      "OpenStock"
    ]
  },
  {
    "login": "pawisoon",
    "avatar_url": "https://avatars.githubusercontent.com/u/6951295?v=4",
    "html_url": "https://github.com/pawisoon",
    "contributions": 2,
    "repos": [
      "OpenStock"
    ]
  },
  {
    "login": "BambaSatoru",
    "avatar_url": "https://avatars.githubusercontent.com/u/173900836?v=4",
    "html_url": "https://github.com/BambaSatoru",
    "contributions": 1,
    "repos": [
      "OpenStock"
    ]
  },
  {
    "login": "Chukwuebuka-2003",
    "avatar_url": "https://avatars.githubusercontent.com/u/56232734?v=4",
    "html_url": "https://github.com/Chukwuebuka-2003",
    "contributions": 1,
    "repos": [
      "OpenStock"
    ]
  },
  {
    "login": "NicolasBohn",
    "avatar_url": "https://avatars.githubusercontent.com/u/266458335?v=4",
    "html_url": "https://github.com/NicolasBohn",
    "contributions": 1,
    "repos": [
      "OpenStock"
    ]
  },
  {
    "login": "Yi-111-a",
    "avatar_url": "https://avatars.githubusercontent.com/u/153097222?v=4",
    "html_url": "https://github.com/Yi-111-a",
    "contributions": 1,
    "repos": [
      "OpenStock"
    ]
  },
  {
    "login": "cosark",
    "avatar_url": "https://avatars.githubusercontent.com/u/121065588?v=4",
    "html_url": "https://github.com/cosark",
    "contributions": 1,
    "repos": [
      "OpenStock"
    ]
  },
  {
    "login": "dajiaohuang",
    "avatar_url": "https://avatars.githubusercontent.com/u/108231307?v=4",
    "html_url": "https://github.com/dajiaohuang",
    "contributions": 1,
    "repos": [
      "OpenStock"
    ]
  },
  {
    "login": "kuishou68",
    "avatar_url": "https://avatars.githubusercontent.com/u/54054995?v=4",
    "html_url": "https://github.com/kuishou68",
    "contributions": 1,
    "repos": [
      "OpenStock"
    ]
  },
  {
    "login": "muskanbandta23",
    "avatar_url": "https://avatars.githubusercontent.com/u/122783241?v=4",
    "html_url": "https://github.com/muskanbandta23",
    "contributions": 1,
    "repos": [
      "OpenStock"
    ]
  },
  {
    "login": "samki6576",
    "avatar_url": "https://avatars.githubusercontent.com/u/189533889?v=4",
    "html_url": "https://github.com/samki6576",
    "contributions": 1,
    "repos": [
      "OpenStock"
    ]
  }
];

export const snapshotTotals: OrgTotals = {
    stars: snapshotRepos.reduce((n, r) => n + r.stars, 0),
    forks: snapshotRepos.reduce((n, r) => n + r.forks, 0),
    repos: snapshotRepos.length,
};

// Legacy shapes below: featured repos in the old GitHub-API shape, for existing pages.
export const fallbackRepos = featuredModules.flatMap((module, index) => {
    const repo = snapshotRepos.find((r) => r.name === module.name);
    if (!repo) return [];
    return [{
        id: index + 100,
        name: repo.name,
        full_name: `Open-Dev-Society/${repo.name}`,
        html_url: repo.html_url,
        description: repo.description,
        stargazers_count: repo.stars,
        forks_count: repo.forks,
        open_issues_count: repo.open_issues,
        language: repo.language,
        contributors_url: "", // Not used in fallback mode directly
        owner: {
            login: "Open-Dev-Society",
            avatar_url: "https://avatars.githubusercontent.com/u/177231203?v=4"
        }
    }];
});

export const fallbackContributors: Contributor[] = snapshotContributors.map((c) => ({
    login: c.login,
    avatar_url: c.avatar_url,
    html_url: c.html_url,
    type: "User",
    role: c.login === "ravixalgorithm" ? "Founder" : "Contributor"
}));

export const fallbackStats = {
    repos: snapshotTotals.repos, // whole org; `list` below is the featured subset
    stars: snapshotTotals.stars,
    list: fallbackRepos.map(repo => ({
        ...repo,
        customTags: featuredModules.find(m => m.name === repo.name)?.tags
    })),
    contributors: featuredModules.reduce((acc, module) => {
        acc[module.name] = fallbackContributors.filter((c) =>
            snapshotContributors.find((s) => s.login === c.login)?.repos.includes(module.name));
        return acc;
    }, {} as Record<string, any[]>)
};
