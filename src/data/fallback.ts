import type { OrgContributor, OrgRepo } from "../lib/github";

// Real snapshot from the GitHub API (gh api orgs/Open-Dev-Society/repos, /repos/*/contributors,
// search/issues label:"good first issue", stats/contributors for "joined"), taken 2026-11-10T11:15Z. Used when live fetches in
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
    "pushed_at": "2026-11-09T19:21:59Z",
    "created_at": "2025-09-28T18:16:32Z"
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
    "pushed_at": "2026-11-08T20:12:46Z",
    "created_at": "2026-07-18T08:22:41Z"
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
    "pushed_at": "2026-02-24T12:28:14Z",
    "created_at": "2026-02-21T21:54:06Z"
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
    "pushed_at": "2026-11-08T04:55:11Z",
    "created_at": "2025-10-16T11:38:41Z"
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
    "pushed_at": "2025-10-08T20:27:13Z",
    "created_at": "2025-10-07T08:44:35Z"
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
    "pushed_at": "2026-10-11T22:28:31Z",
    "created_at": "2025-07-02T19:51:36Z"
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
    "pushed_at": "2026-01-13T21:38:27Z",
    "created_at": "2026-01-01T12:54:37Z"
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
    "pushed_at": "2026-03-09T10:08:38Z",
    "created_at": "2026-03-09T08:19:29Z"
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
    "pushed_at": "2025-12-12T18:29:34Z",
    "created_at": "2025-12-12T18:16:22Z"
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
    "pushed_at": "2026-10-17T08:12:11Z",
    "created_at": "2026-10-17T06:48:23Z"
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
    "pushed_at": "2026-11-08T13:36:10Z",
    "created_at": "2026-11-02T12:07:21Z"
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
    "pushed_at": "2025-11-23T22:27:05Z",
    "created_at": "2025-11-23T22:27:05Z"
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
    "pushed_at": "2026-10-20T22:26:11Z",
    "created_at": "2026-10-01T16:09:28Z"
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
    "pushed_at": "2026-09-20T10:27:38Z",
    "created_at": "2025-09-04T11:10:31Z"
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
    "pushed_at": "2026-06-04T20:23:12Z",
    "created_at": "2025-10-04T18:21:26Z"
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
    "pushed_at": "2026-11-08T10:03:25Z",
    "created_at": "2026-11-08T09:10:55Z"
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
    "pushed_at": "2026-11-08T19:30:04Z",
    "created_at": "2026-11-08T18:55:03Z"
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
    ],
    "joined": "2025-06-29T00:00:00.000Z"
  },
  {
    "login": "keshav-005",
    "avatar_url": "https://avatars.githubusercontent.com/u/180140750?v=4",
    "html_url": "https://github.com/keshav-005",
    "contributions": 9,
    "repos": [
      "OpenStock"
    ],
    "joined": "2026-04-19T00:00:00.000Z"
  },
  {
    "login": "landerdevelopers",
    "avatar_url": "https://avatars.githubusercontent.com/u/297453033?v=4",
    "html_url": "https://github.com/landerdevelopers",
    "contributions": 8,
    "repos": [
      ".github",
      "openreadme"
    ],
    "joined": "2026-09-20T00:00:00.000Z"
  },
  {
    "login": "diip3sh",
    "avatar_url": "https://avatars.githubusercontent.com/u/99866329?v=4",
    "html_url": "https://github.com/diip3sh",
    "contributions": 7,
    "repos": [
      "zomb"
    ],
    "joined": "2026-10-04T00:00:00.000Z"
  },
  {
    "login": "PriyanshuCosmos",
    "avatar_url": "https://avatars.githubusercontent.com/u/222009720?v=4",
    "html_url": "https://github.com/PriyanshuCosmos",
    "contributions": 4,
    "repos": [
      "ByteMyCV",
      "OpenCine"
    ],
    "joined": "2025-11-16T00:00:00.000Z"
  },
  {
    "login": "nb-src",
    "avatar_url": "https://avatars.githubusercontent.com/u/76625701?v=4",
    "html_url": "https://github.com/nb-src",
    "contributions": 3,
    "repos": [
      "OpenStock"
    ],
    "joined": "2025-10-12T00:00:00.000Z"
  },
  {
    "login": "Bortlesboat",
    "avatar_url": "https://avatars.githubusercontent.com/u/169967362?v=4",
    "html_url": "https://github.com/Bortlesboat",
    "contributions": 2,
    "repos": [
      "OpenStock"
    ],
    "joined": "2026-03-22T00:00:00.000Z"
  },
  {
    "login": "ahmaddirar-ios",
    "avatar_url": "https://avatars.githubusercontent.com/u/57848046?v=4",
    "html_url": "https://github.com/ahmaddirar-ios",
    "contributions": 2,
    "repos": [
      "OpenStock"
    ],
    "joined": "2026-10-25T00:00:00.000Z"
  },
  {
    "login": "akoweicollinxx",
    "avatar_url": "https://avatars.githubusercontent.com/u/110723714?v=4",
    "html_url": "https://github.com/akoweicollinxx",
    "contributions": 2,
    "repos": [
      "OpenStock"
    ],
    "joined": "2026-05-31T00:00:00.000Z"
  },
  {
    "login": "alexander-schneider",
    "avatar_url": "https://avatars.githubusercontent.com/u/33292100?v=4",
    "html_url": "https://github.com/alexander-schneider",
    "contributions": 2,
    "repos": [
      "OpenStock"
    ],
    "joined": "2026-03-22T00:00:00.000Z"
  },
  {
    "login": "chinnsenn",
    "avatar_url": "https://avatars.githubusercontent.com/u/13096352?v=4",
    "html_url": "https://github.com/chinnsenn",
    "contributions": 2,
    "repos": [
      "OpenStock"
    ],
    "joined": "2025-10-05T00:00:00.000Z"
  },
  {
    "login": "cosmind-rusu",
    "avatar_url": "https://avatars.githubusercontent.com/u/75861657?v=4",
    "html_url": "https://github.com/cosmind-rusu",
    "contributions": 2,
    "repos": [
      "OpenStock"
    ],
    "joined": "2026-09-20T00:00:00.000Z"
  },
  {
    "login": "ettoreciolli",
    "avatar_url": "https://avatars.githubusercontent.com/u/272523740?v=4",
    "html_url": "https://github.com/ettoreciolli",
    "contributions": 2,
    "repos": [
      "OpenStock"
    ],
    "joined": "2026-01-25T00:00:00.000Z"
  },
  {
    "login": "octo-patch",
    "avatar_url": "https://avatars.githubusercontent.com/u/266937838?v=4",
    "html_url": "https://github.com/octo-patch",
    "contributions": 2,
    "repos": [
      "OpenStock"
    ],
    "joined": "2026-07-26T00:00:00.000Z"
  },
  {
    "login": "pawisoon",
    "avatar_url": "https://avatars.githubusercontent.com/u/6951295?v=4",
    "html_url": "https://github.com/pawisoon",
    "contributions": 2,
    "repos": [
      "OpenStock"
    ],
    "joined": "2026-11-08T00:00:00.000Z"
  },
  {
    "login": "BambaSatoru",
    "avatar_url": "https://avatars.githubusercontent.com/u/173900836?v=4",
    "html_url": "https://github.com/BambaSatoru",
    "contributions": 1,
    "repos": [
      "OpenStock"
    ],
    "joined": "2026-09-20T00:00:00.000Z"
  },
  {
    "login": "Chukwuebuka-2003",
    "avatar_url": "https://avatars.githubusercontent.com/u/56232734?v=4",
    "html_url": "https://github.com/Chukwuebuka-2003",
    "contributions": 1,
    "repos": [
      "OpenStock"
    ],
    "joined": "2026-05-24T00:00:00.000Z"
  },
  {
    "login": "NicolasBohn",
    "avatar_url": "https://avatars.githubusercontent.com/u/266458335?v=4",
    "html_url": "https://github.com/NicolasBohn",
    "contributions": 1,
    "repos": [
      "OpenStock"
    ],
    "joined": "2026-03-15T00:00:00.000Z"
  },
  {
    "login": "Yi-111-a",
    "avatar_url": "https://avatars.githubusercontent.com/u/153097222?v=4",
    "html_url": "https://github.com/Yi-111-a",
    "contributions": 1,
    "repos": [
      "OpenStock"
    ],
    "joined": "2026-09-27T00:00:00.000Z"
  },
  {
    "login": "cosark",
    "avatar_url": "https://avatars.githubusercontent.com/u/121065588?v=4",
    "html_url": "https://github.com/cosark",
    "contributions": 1,
    "repos": [
      "OpenStock"
    ],
    "joined": "2026-09-27T00:00:00.000Z"
  },
  {
    "login": "dajiaohuang",
    "avatar_url": "https://avatars.githubusercontent.com/u/108231307?v=4",
    "html_url": "https://github.com/dajiaohuang",
    "contributions": 1,
    "repos": [
      "OpenStock"
    ],
    "joined": "2026-11-08T00:00:00.000Z"
  },
  {
    "login": "kuishou68",
    "avatar_url": "https://avatars.githubusercontent.com/u/54054995?v=4",
    "html_url": "https://github.com/kuishou68",
    "contributions": 1,
    "repos": [
      "OpenStock"
    ],
    "joined": "2026-09-20T00:00:00.000Z"
  },
  {
    "login": "muskanbandta23",
    "avatar_url": "https://avatars.githubusercontent.com/u/122783241?v=4",
    "html_url": "https://github.com/muskanbandta23",
    "contributions": 1,
    "repos": [
      "OpenStock"
    ],
    "joined": "2026-10-11T00:00:00.000Z"
  },
  {
    "login": "samki6576",
    "avatar_url": "https://avatars.githubusercontent.com/u/189533889?v=4",
    "html_url": "https://github.com/samki6576",
    "contributions": 1,
    "repos": [
      "OpenStock"
    ],
    "joined": "2026-10-18T00:00:00.000Z"
  }
];
