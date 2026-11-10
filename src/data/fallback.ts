import type { CommitsThisWeek, Issue, OrgContributor, OrgRepo, ProjectContributor, PullRequest, Release } from "../lib/github";

// Real snapshot from the GitHub API, taken 2026-11-10T17:10Z: what src/lib/github.ts returned live (orgs/Open-Dev-Society/repos,
// /repos/*/contributors, stats/contributors, releases, and the issue, PR and commit searches). Used when a live fetch fails.
// Refresh: GITHUB_TOKEN=$(gh auth token) node scripts/check-github.mjs --print, then regenerate this file from that JSON.
export const snapshotTakenAt = "2026-11-10T17:10Z";

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
    "license": "AGPL-3.0",
    "stars": 21408,
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
    "license": "GPL-2.0",
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
    "license": "AGPL-3.0",
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
    "license": "AGPL-3.0",
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
    "license": "AGPL-3.0",
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
    "license": null,
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
    "license": "AGPL-3.0",
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
    "license": "AGPL-3.0",
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
    "license": null,
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
    "license": null,
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
    "license": "AGPL-3.0",
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
    "license": "MIT",
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
    "license": null,
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
    "license": null,
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
    "license": null,
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
    "license": "MIT",
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
    "license": "MIT",
    "stars": 0,
    "forks": 0,
    "open_issues": 0,
    "good_first_issues": 0,
    "pushed_at": "2026-11-08T19:30:04Z",
    "created_at": "2026-11-08T18:55:03Z"
  }
];

// Bots and agent accounts (dependabot, vercel, cursoragent) excluded; manual maintainers are added by getOrgContributors.
export const snapshotContributors: OrgContributor[] = [
  {
    "login": "ravixalgorithm",
    "avatar_url": "https://avatars.githubusercontent.com/u/148683640?v=4",
    "html_url": "https://github.com/ravixalgorithm",
    "contributions": 3978,
    "repos": [
      "OpenStock",
      "kitbash",
      "kine-ui",
      "openreadme",
      "booktrace",
      "opencosmos",
      "openhaven",
      "openmind",
      "den",
      "ports",
      "zomb",
      ".github",
      "opendevsociety",
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
      "openreadme",
      ".github"
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
      "OpenCine",
      "ByteMyCV"
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
    "login": "samki6576",
    "avatar_url": "https://avatars.githubusercontent.com/u/189533889?v=4",
    "html_url": "https://github.com/samki6576",
    "contributions": 1,
    "repos": [
      "OpenStock"
    ],
    "joined": "2026-10-18T00:00:00.000Z"
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
  }
];

// Open "good first issue" / "help wanted" issues in the public projects.
export const snapshotIssues: Issue[] = [
  {
    "title": "Sharper idle detection",
    "number": 5,
    "repo": "ports",
    "labels": [
      "enhancement",
      "good first issue"
    ],
    "url": "https://github.com/Open-Dev-Society/ports/issues/5",
    "createdAt": "2026-11-02T12:17:02Z",
    "comments": 0
  }
];

// Merged PRs by people in the public projects, newest first.
export const snapshotPullRequests: PullRequest[] = [
  {
    "repo": "OpenStock",
    "title": "feat(i18n): add an Arabic / right-to-left interface",
    "number": 146,
    "url": "https://github.com/Open-Dev-Society/OpenStock/pull/146",
    "mergedAt": "2026-11-09T19:22:00Z",
    "who": "ahmaddirar-ios",
    "avatar": "https://avatars.githubusercontent.com/u/57848046?v=4"
  },
  {
    "repo": "OpenStock",
    "title": "feat(i18n): add translation support with Polish as the first language",
    "number": 157,
    "url": "https://github.com/Open-Dev-Society/OpenStock/pull/157",
    "mergedAt": "2026-11-09T19:03:23Z",
    "who": "pawisoon",
    "avatar": "https://avatars.githubusercontent.com/u/6951295?v=4"
  },
  {
    "repo": "OpenStock",
    "title": "Deploy on Cloudflare Workers via vinext",
    "number": 150,
    "url": "https://github.com/Open-Dev-Society/OpenStock/pull/150",
    "mergedAt": "2026-11-09T18:32:02Z",
    "who": "ravixalgorithm",
    "avatar": "https://avatars.githubusercontent.com/u/148683640?v=4"
  },
  {
    "repo": "OpenStock",
    "title": "chore(sponsors): move RapidProxy to previous sponsors, off the footer",
    "number": 155,
    "url": "https://github.com/Open-Dev-Society/OpenStock/pull/155",
    "mergedAt": "2026-11-09T18:19:22Z",
    "who": "ravixalgorithm",
    "avatar": "https://avatars.githubusercontent.com/u/148683640?v=4"
  },
  {
    "repo": "OpenStock",
    "title": "security: delete the debug script that hardcoded the Atlas credentials",
    "number": 156,
    "url": "https://github.com/Open-Dev-Society/OpenStock/pull/156",
    "mergedAt": "2026-11-09T18:18:57Z",
    "who": "ravixalgorithm",
    "avatar": "https://avatars.githubusercontent.com/u/148683640?v=4"
  },
  {
    "repo": "OpenStock",
    "title": "feat(watchlist): named watchlists — file a stock from a row or the search palette",
    "number": 148,
    "url": "https://github.com/Open-Dev-Society/OpenStock/pull/148",
    "mergedAt": "2026-11-09T18:14:16Z",
    "who": "ahmaddirar-ios",
    "avatar": "https://avatars.githubusercontent.com/u/57848046?v=4"
  },
  {
    "repo": "OpenStock",
    "title": "fix(vercel): serve public pages from cache instead of a function per hit",
    "number": 154,
    "url": "https://github.com/Open-Dev-Society/OpenStock/pull/154",
    "mergedAt": "2026-11-09T18:09:56Z",
    "who": "ravixalgorithm",
    "avatar": "https://avatars.githubusercontent.com/u/148683640?v=4"
  },
  {
    "repo": "OpenStock",
    "title": "fix: fail weekly digest when Kit saves a draft",
    "number": 151,
    "url": "https://github.com/Open-Dev-Society/OpenStock/pull/151",
    "mergedAt": "2026-11-09T18:04:18Z",
    "who": "dajiaohuang",
    "avatar": "https://avatars.githubusercontent.com/u/108231307?v=4"
  },
  {
    "repo": "OpenStock",
    "title": "fix(stocks): only ask Finnhub for company data on US listings",
    "number": 153,
    "url": "https://github.com/Open-Dev-Society/OpenStock/pull/153",
    "mergedAt": "2026-11-09T17:58:38Z",
    "who": "ravixalgorithm",
    "avatar": "https://avatars.githubusercontent.com/u/148683640?v=4"
  },
  {
    "repo": "OpenStock",
    "title": "docs(changelog): add the November update and refresh the contributors table",
    "number": 152,
    "url": "https://github.com/Open-Dev-Society/OpenStock/pull/152",
    "mergedAt": "2026-11-09T17:54:29Z",
    "who": "ravixalgorithm",
    "avatar": "https://avatars.githubusercontent.com/u/148683640?v=4"
  },
  {
    "repo": "OpenStock",
    "title": "feat(markets): add Poland (GPW Warsaw) and Polish indices as a dashboard market",
    "number": 147,
    "url": "https://github.com/Open-Dev-Society/OpenStock/pull/147",
    "mergedAt": "2026-11-09T17:44:28Z",
    "who": "pawisoon",
    "avatar": "https://avatars.githubusercontent.com/u/6951295?v=4"
  },
  {
    "repo": "settle-ui",
    "title": "Add the first Settle visual prototype",
    "number": 1,
    "url": "https://github.com/Open-Dev-Society/settle-ui/pull/1",
    "mergedAt": "2026-11-08T19:30:04Z",
    "who": "ravixalgorithm",
    "avatar": "https://avatars.githubusercontent.com/u/148683640?v=4"
  },
  {
    "repo": "ports",
    "title": "Automatic updates with Sparkle, and republish 0.1.0 with them",
    "number": 9,
    "url": "https://github.com/Open-Dev-Society/ports/pull/9",
    "mergedAt": "2026-11-08T13:33:38Z",
    "who": "ravixalgorithm",
    "avatar": "https://avatars.githubusercontent.com/u/148683640?v=4"
  },
  {
    "repo": "tearcopy",
    "title": "Add the initial Tearcopy prototype",
    "number": 1,
    "url": "https://github.com/Open-Dev-Society/tearcopy/pull/1",
    "mergedAt": "2026-11-08T10:03:25Z",
    "who": "ravixalgorithm",
    "avatar": "https://avatars.githubusercontent.com/u/148683640?v=4"
  },
  {
    "repo": "ports",
    "title": "Ports 0.1.1: port icon, new app icon, welcome and a plug-in install window",
    "number": 8,
    "url": "https://github.com/Open-Dev-Society/ports/pull/8",
    "mergedAt": "2026-11-03T12:47:59Z",
    "who": "ravixalgorithm",
    "avatar": "https://avatars.githubusercontent.com/u/148683640?v=4"
  },
  {
    "repo": "ports",
    "title": "Add the Ports menu bar app and terminal command",
    "number": 6,
    "url": "https://github.com/Open-Dev-Society/ports/pull/6",
    "mergedAt": "2026-11-02T12:50:48Z",
    "who": "ravixalgorithm",
    "avatar": "https://avatars.githubusercontent.com/u/148683640?v=4"
  },
  {
    "repo": "OpenStock",
    "title": "feat(markets): add Saudi Arabia (Tadawul) as a dashboard market",
    "number": 145,
    "url": "https://github.com/Open-Dev-Society/OpenStock/pull/145",
    "mergedAt": "2026-10-31T11:09:19Z",
    "who": "ravixalgorithm",
    "avatar": "https://avatars.githubusercontent.com/u/148683640?v=4"
  },
  {
    "repo": "OpenStock",
    "title": "docs: add latest release badge",
    "number": 141,
    "url": "https://github.com/Open-Dev-Society/OpenStock/pull/141",
    "mergedAt": "2026-10-25T15:12:42Z",
    "who": "ravixalgorithm",
    "avatar": "https://avatars.githubusercontent.com/u/148683640?v=4"
  },
  {
    "repo": "zomb",
    "title": "Traffic, automatic Copilot, a scan sandbox, and launch prep",
    "number": 2,
    "url": "https://github.com/Open-Dev-Society/zomb/pull/2",
    "mergedAt": "2026-10-20T22:26:12Z",
    "who": "diip3sh",
    "avatar": "https://avatars.githubusercontent.com/u/99866329?v=4"
  },
  {
    "repo": "OpenStock",
    "title": "feat(ai-provider): default MiniMax to M3.1 Flash",
    "number": 140,
    "url": "https://github.com/Open-Dev-Society/OpenStock/pull/140",
    "mergedAt": "2026-10-20T22:15:42Z",
    "who": "octo-patch",
    "avatar": "https://avatars.githubusercontent.com/u/266937838?v=4"
  },
  {
    "repo": "OpenStock",
    "title": "docs: add Code of Conduct (Contributor Covenant 2.1)",
    "number": 139,
    "url": "https://github.com/Open-Dev-Society/OpenStock/pull/139",
    "mergedAt": "2026-10-19T08:20:55Z",
    "who": "ravixalgorithm",
    "avatar": "https://avatars.githubusercontent.com/u/148683640?v=4"
  },
  {
    "repo": "OpenStock",
    "title": "feat: add dividend yield card using real Finnhub data",
    "number": 137,
    "url": "https://github.com/Open-Dev-Society/OpenStock/pull/137",
    "mergedAt": "2026-10-19T07:09:27Z",
    "who": "samki6576",
    "avatar": "https://avatars.githubusercontent.com/u/189533889?v=4"
  },
  {
    "repo": "OpenStock",
    "title": "chore(deps): upgrade nodemailer 7.0.6 → 10.1.2, drop @types/nodemailer",
    "number": 133,
    "url": "https://github.com/Open-Dev-Society/OpenStock/pull/133",
    "mergedAt": "2026-10-19T06:54:45Z",
    "who": "ravixalgorithm",
    "avatar": "https://avatars.githubusercontent.com/u/148683640?v=4"
  },
  {
    "repo": "OpenStock",
    "title": "chore(deps): upgrade better-auth 1.3.25 → 1.7.10",
    "number": 132,
    "url": "https://github.com/Open-Dev-Society/OpenStock/pull/132",
    "mergedAt": "2026-10-19T06:47:26Z",
    "who": "ravixalgorithm",
    "avatar": "https://avatars.githubusercontent.com/u/148683640?v=4"
  },
  {
    "repo": "OpenStock",
    "title": "Publish crawler files and licence-safe stock pages",
    "number": 136,
    "url": "https://github.com/Open-Dev-Society/OpenStock/pull/136",
    "mergedAt": "2026-10-19T06:47:18Z",
    "who": "ravixalgorithm",
    "avatar": "https://avatars.githubusercontent.com/u/148683640?v=4"
  },
  {
    "repo": "OpenStock",
    "title": "Add the FLOSS/fund funding manifest",
    "number": 138,
    "url": "https://github.com/Open-Dev-Society/OpenStock/pull/138",
    "mergedAt": "2026-10-19T06:42:04Z",
    "who": "ravixalgorithm",
    "avatar": "https://avatars.githubusercontent.com/u/148683640?v=4"
  },
  {
    "repo": "OpenStock",
    "title": "docs(readme): rewrite the README for how OpenStock works today",
    "number": 135,
    "url": "https://github.com/Open-Dev-Society/OpenStock/pull/135",
    "mergedAt": "2026-10-18T02:52:37Z",
    "who": "ravixalgorithm",
    "avatar": "https://avatars.githubusercontent.com/u/148683640?v=4"
  },
  {
    "repo": "OpenStock",
    "title": "fix(docker): let self-hosters turn on realtime mode again",
    "number": 134,
    "url": "https://github.com/Open-Dev-Society/OpenStock/pull/134",
    "mergedAt": "2026-10-18T02:50:22Z",
    "who": "ravixalgorithm",
    "avatar": "https://avatars.githubusercontent.com/u/148683640?v=4"
  },
  {
    "repo": "OpenStock",
    "title": "feat(changelog): credit every contributor, per release and all-time",
    "number": 131,
    "url": "https://github.com/Open-Dev-Society/OpenStock/pull/131",
    "mergedAt": "2026-10-18T01:55:53Z",
    "who": "ravixalgorithm",
    "avatar": "https://avatars.githubusercontent.com/u/148683640?v=4"
  },
  {
    "repo": "OpenStock",
    "title": "feat: changelog timeline, and a banner that always opens the latest update",
    "number": 130,
    "url": "https://github.com/Open-Dev-Society/OpenStock/pull/130",
    "mergedAt": "2026-10-18T01:05:08Z",
    "who": "ravixalgorithm",
    "avatar": "https://avatars.githubusercontent.com/u/148683640?v=4"
  },
  {
    "repo": "OpenStock",
    "title": "feat: announce the October update with a banner and a What's new page",
    "number": 129,
    "url": "https://github.com/Open-Dev-Society/OpenStock/pull/129",
    "mergedAt": "2026-10-18T00:51:00Z",
    "who": "ravixalgorithm",
    "avatar": "https://avatars.githubusercontent.com/u/148683640?v=4"
  },
  {
    "repo": "OpenStock",
    "title": "fix(auth): sign out other sessions on password reset, refuse to run without a secret",
    "number": 125,
    "url": "https://github.com/Open-Dev-Society/OpenStock/pull/125",
    "mergedAt": "2026-10-18T00:48:24Z",
    "who": "ravixalgorithm",
    "avatar": "https://avatars.githubusercontent.com/u/148683640?v=4"
  },
  {
    "repo": "OpenStock",
    "title": "feat(docker): publish a prebuilt image to GHCR, move to Node 22",
    "number": 128,
    "url": "https://github.com/Open-Dev-Society/OpenStock/pull/128",
    "mergedAt": "2026-10-18T00:46:35Z",
    "who": "ravixalgorithm",
    "avatar": "https://avatars.githubusercontent.com/u/148683640?v=4"
  },
  {
    "repo": "OpenStock",
    "title": "fix(watchlist): validate symbols and cap watchlists and alerts at 50",
    "number": 127,
    "url": "https://github.com/Open-Dev-Society/OpenStock/pull/127",
    "mergedAt": "2026-10-18T00:46:30Z",
    "who": "ravixalgorithm",
    "avatar": "https://avatars.githubusercontent.com/u/148683640?v=4"
  },
  {
    "repo": "OpenStock",
    "title": "fix(auth): rate-limit sign-in, sign-up, password reset and live quotes",
    "number": 126,
    "url": "https://github.com/Open-Dev-Society/OpenStock/pull/126",
    "mergedAt": "2026-10-18T00:38:20Z",
    "who": "ravixalgorithm",
    "avatar": "https://avatars.githubusercontent.com/u/148683640?v=4"
  },
  {
    "repo": "OpenStock",
    "title": "fix(docker): stop publishing MongoDB, take its password from .env",
    "number": 124,
    "url": "https://github.com/Open-Dev-Society/OpenStock/pull/124",
    "mergedAt": "2026-10-18T00:34:42Z",
    "who": "ravixalgorithm",
    "avatar": "https://avatars.githubusercontent.com/u/148683640?v=4"
  },
  {
    "repo": "OpenStock",
    "title": "fix(email): escape the welcome email and accept only real sign-up values",
    "number": 122,
    "url": "https://github.com/Open-Dev-Society/OpenStock/pull/122",
    "mergedAt": "2026-10-18T00:25:46Z",
    "who": "ravixalgorithm",
    "avatar": "https://avatars.githubusercontent.com/u/148683640?v=4"
  },
  {
    "repo": "OpenStock",
    "title": "fix(email): stop the re-engagement job from mailing every Kit subscriber",
    "number": 120,
    "url": "https://github.com/Open-Dev-Society/OpenStock/pull/120",
    "mergedAt": "2026-10-18T00:22:20Z",
    "who": "ravixalgorithm",
    "avatar": "https://avatars.githubusercontent.com/u/148683640?v=4"
  },
  {
    "repo": "OpenStock",
    "title": "fix(docker): build without a database or secrets, read keys at runtime",
    "number": 123,
    "url": "https://github.com/Open-Dev-Society/OpenStock/pull/123",
    "mergedAt": "2026-10-18T00:17:50Z",
    "who": "ravixalgorithm",
    "avatar": "https://avatars.githubusercontent.com/u/148683640?v=4"
  },
  {
    "repo": "OpenStock",
    "title": "chore(deps): upgrade next to 15.5.28 and drop unused remote images",
    "number": 121,
    "url": "https://github.com/Open-Dev-Society/OpenStock/pull/121",
    "mergedAt": "2026-10-18T00:16:01Z",
    "who": "ravixalgorithm",
    "avatar": "https://avatars.githubusercontent.com/u/148683640?v=4"
  },
  {
    "repo": "OpenStock",
    "title": "feat(stocks): remember the chart indicators you pick",
    "number": 119,
    "url": "https://github.com/Open-Dev-Society/OpenStock/pull/119",
    "mergedAt": "2026-10-18T00:08:01Z",
    "who": "ravixalgorithm",
    "avatar": "https://avatars.githubusercontent.com/u/148683640?v=4"
  },
  {
    "repo": "OpenStock",
    "title": "feat(stocks): show TradingView's drawing tools on the stock chart",
    "number": 118,
    "url": "https://github.com/Open-Dev-Society/OpenStock/pull/118",
    "mergedAt": "2026-10-17T23:59:54Z",
    "who": "ravixalgorithm",
    "avatar": "https://avatars.githubusercontent.com/u/148683640?v=4"
  },
  {
    "repo": "OpenStock",
    "title": "fix(stocks): spell - and & tickers the way TradingView does",
    "number": 117,
    "url": "https://github.com/Open-Dev-Society/OpenStock/pull/117",
    "mergedAt": "2026-10-17T23:59:48Z",
    "who": "ravixalgorithm",
    "avatar": "https://avatars.githubusercontent.com/u/148683640?v=4"
  },
  {
    "repo": "OpenStock",
    "title": "docs(readme): drop the referral code from the Railway deploy link",
    "number": 116,
    "url": "https://github.com/Open-Dev-Society/OpenStock/pull/116",
    "mergedAt": "2026-10-17T23:50:12Z",
    "who": "ravixalgorithm",
    "avatar": "https://avatars.githubusercontent.com/u/148683640?v=4"
  },
  {
    "repo": "OpenStock",
    "title": "feat: add Railway deployment template",
    "number": 94,
    "url": "https://github.com/Open-Dev-Society/OpenStock/pull/94",
    "mergedAt": "2026-10-17T23:43:57Z",
    "who": "cosmind-rusu",
    "avatar": "https://avatars.githubusercontent.com/u/75861657?v=4"
  },
  {
    "repo": "OpenStock",
    "title": "docs(readme): add ZopDay One-click Deployment button to One-Click Deploy",
    "number": 115,
    "url": "https://github.com/Open-Dev-Society/OpenStock/pull/115",
    "mergedAt": "2026-10-17T23:42:52Z",
    "who": "muskanbandta23",
    "avatar": "https://avatars.githubusercontent.com/u/122783241?v=4"
  }
];

// Latest releases (up to 3 per public project), newest first.
export const snapshotReleases: Release[] = [
  {
    "repo": "OpenStock",
    "tag": "v2026.11.09",
    "name": "November 2026 update",
    "publishedAt": "2026-11-09T17:59:05Z",
    "url": "https://github.com/Open-Dev-Society/OpenStock/releases/tag/v2026.11.09"
  },
  {
    "repo": "ports",
    "tag": "v0.1.0",
    "name": "Ports 0.1.0",
    "publishedAt": "2026-11-02T12:53:45Z",
    "url": "https://github.com/Open-Dev-Society/ports/releases/tag/v0.1.0"
  },
  {
    "repo": "OpenStock",
    "tag": "v2026.10.25",
    "name": "v2026.10.25",
    "publishedAt": "2026-10-25T15:14:12Z",
    "url": "https://github.com/Open-Dev-Society/OpenStock/releases/tag/v2026.10.25"
  },
  {
    "repo": "OpenStock",
    "tag": "v2026.10.18",
    "name": "October 2026 update",
    "publishedAt": "2026-10-18T02:33:35Z",
    "url": "https://github.com/Open-Dev-Society/OpenStock/releases/tag/v2026.10.18"
  }
];

export const snapshotCommits: CommitsThisWeek = {
  "count": 79,
  "since": "2026-11-03",
  "asOf": "2026-11-10T17:10:29.935Z"
};

// Per public project: its human contributors, most commits first.
export const snapshotProjectContributors: Record<string, ProjectContributor[]> = {
  "OpenStock": [
    {
      "login": "ravixalgorithm",
      "avatar_url": "https://avatars.githubusercontent.com/u/148683640?v=4",
      "html_url": "https://github.com/ravixalgorithm",
      "contributions": 203
    },
    {
      "login": "keshav-005",
      "avatar_url": "https://avatars.githubusercontent.com/u/180140750?v=4",
      "html_url": "https://github.com/keshav-005",
      "contributions": 9
    },
    {
      "login": "nb-src",
      "avatar_url": "https://avatars.githubusercontent.com/u/76625701?v=4",
      "html_url": "https://github.com/nb-src",
      "contributions": 3
    },
    {
      "login": "akoweicollinxx",
      "avatar_url": "https://avatars.githubusercontent.com/u/110723714?v=4",
      "html_url": "https://github.com/akoweicollinxx",
      "contributions": 2
    },
    {
      "login": "pawisoon",
      "avatar_url": "https://avatars.githubusercontent.com/u/6951295?v=4",
      "html_url": "https://github.com/pawisoon",
      "contributions": 2
    },
    {
      "login": "octo-patch",
      "avatar_url": "https://avatars.githubusercontent.com/u/266937838?v=4",
      "html_url": "https://github.com/octo-patch",
      "contributions": 2
    },
    {
      "login": "cosmind-rusu",
      "avatar_url": "https://avatars.githubusercontent.com/u/75861657?v=4",
      "html_url": "https://github.com/cosmind-rusu",
      "contributions": 2
    },
    {
      "login": "chinnsenn",
      "avatar_url": "https://avatars.githubusercontent.com/u/13096352?v=4",
      "html_url": "https://github.com/chinnsenn",
      "contributions": 2
    },
    {
      "login": "ahmaddirar-ios",
      "avatar_url": "https://avatars.githubusercontent.com/u/57848046?v=4",
      "html_url": "https://github.com/ahmaddirar-ios",
      "contributions": 2
    },
    {
      "login": "ettoreciolli",
      "avatar_url": "https://avatars.githubusercontent.com/u/272523740?v=4",
      "html_url": "https://github.com/ettoreciolli",
      "contributions": 2
    },
    {
      "login": "Bortlesboat",
      "avatar_url": "https://avatars.githubusercontent.com/u/169967362?v=4",
      "html_url": "https://github.com/Bortlesboat",
      "contributions": 2
    },
    {
      "login": "alexander-schneider",
      "avatar_url": "https://avatars.githubusercontent.com/u/33292100?v=4",
      "html_url": "https://github.com/alexander-schneider",
      "contributions": 2
    },
    {
      "login": "BambaSatoru",
      "avatar_url": "https://avatars.githubusercontent.com/u/173900836?v=4",
      "html_url": "https://github.com/BambaSatoru",
      "contributions": 1
    },
    {
      "login": "Chukwuebuka-2003",
      "avatar_url": "https://avatars.githubusercontent.com/u/56232734?v=4",
      "html_url": "https://github.com/Chukwuebuka-2003",
      "contributions": 1
    },
    {
      "login": "NicolasBohn",
      "avatar_url": "https://avatars.githubusercontent.com/u/266458335?v=4",
      "html_url": "https://github.com/NicolasBohn",
      "contributions": 1
    },
    {
      "login": "samki6576",
      "avatar_url": "https://avatars.githubusercontent.com/u/189533889?v=4",
      "html_url": "https://github.com/samki6576",
      "contributions": 1
    },
    {
      "login": "dajiaohuang",
      "avatar_url": "https://avatars.githubusercontent.com/u/108231307?v=4",
      "html_url": "https://github.com/dajiaohuang",
      "contributions": 1
    },
    {
      "login": "Yi-111-a",
      "avatar_url": "https://avatars.githubusercontent.com/u/153097222?v=4",
      "html_url": "https://github.com/Yi-111-a",
      "contributions": 1
    },
    {
      "login": "cosark",
      "avatar_url": "https://avatars.githubusercontent.com/u/121065588?v=4",
      "html_url": "https://github.com/cosark",
      "contributions": 1
    },
    {
      "login": "kuishou68",
      "avatar_url": "https://avatars.githubusercontent.com/u/54054995?v=4",
      "html_url": "https://github.com/kuishou68",
      "contributions": 1
    },
    {
      "login": "muskanbandta23",
      "avatar_url": "https://avatars.githubusercontent.com/u/122783241?v=4",
      "html_url": "https://github.com/muskanbandta23",
      "contributions": 1
    }
  ],
  "kitbash": [
    {
      "login": "ravixalgorithm",
      "avatar_url": "https://avatars.githubusercontent.com/u/148683640?v=4",
      "html_url": "https://github.com/ravixalgorithm",
      "contributions": 19
    }
  ],
  "kine-ui": [
    {
      "login": "ravixalgorithm",
      "avatar_url": "https://avatars.githubusercontent.com/u/148683640?v=4",
      "html_url": "https://github.com/ravixalgorithm",
      "contributions": 19
    }
  ],
  "openreadme": [
    {
      "login": "ravixalgorithm",
      "avatar_url": "https://avatars.githubusercontent.com/u/148683640?v=4",
      "html_url": "https://github.com/ravixalgorithm",
      "contributions": 3564
    },
    {
      "login": "landerdevelopers",
      "avatar_url": "https://avatars.githubusercontent.com/u/297453033?v=4",
      "html_url": "https://github.com/landerdevelopers",
      "contributions": 7
    }
  ],
  "booktrace": [
    {
      "login": "ravixalgorithm",
      "avatar_url": "https://avatars.githubusercontent.com/u/148683640?v=4",
      "html_url": "https://github.com/ravixalgorithm",
      "contributions": 15
    }
  ],
  "opencosmos": [
    {
      "login": "ravixalgorithm",
      "avatar_url": "https://avatars.githubusercontent.com/u/148683640?v=4",
      "html_url": "https://github.com/ravixalgorithm",
      "contributions": 13
    }
  ],
  "openhaven": [
    {
      "login": "ravixalgorithm",
      "avatar_url": "https://avatars.githubusercontent.com/u/148683640?v=4",
      "html_url": "https://github.com/ravixalgorithm",
      "contributions": 64
    }
  ],
  "openmind": [
    {
      "login": "ravixalgorithm",
      "avatar_url": "https://avatars.githubusercontent.com/u/148683640?v=4",
      "html_url": "https://github.com/ravixalgorithm",
      "contributions": 10
    }
  ],
  "OpenCine": [
    {
      "login": "PriyanshuCosmos",
      "avatar_url": "https://avatars.githubusercontent.com/u/222009720?v=4",
      "html_url": "https://github.com/PriyanshuCosmos",
      "contributions": 3
    }
  ],
  "den": [
    {
      "login": "ravixalgorithm",
      "avatar_url": "https://avatars.githubusercontent.com/u/148683640?v=4",
      "html_url": "https://github.com/ravixalgorithm",
      "contributions": 2
    }
  ],
  "ports": [
    {
      "login": "ravixalgorithm",
      "avatar_url": "https://avatars.githubusercontent.com/u/148683640?v=4",
      "html_url": "https://github.com/ravixalgorithm",
      "contributions": 4
    }
  ],
  "ByteMyCV": [
    {
      "login": "PriyanshuCosmos",
      "avatar_url": "https://avatars.githubusercontent.com/u/222009720?v=4",
      "html_url": "https://github.com/PriyanshuCosmos",
      "contributions": 1
    }
  ],
  "zomb": [
    {
      "login": "ravixalgorithm",
      "avatar_url": "https://avatars.githubusercontent.com/u/148683640?v=4",
      "html_url": "https://github.com/ravixalgorithm",
      "contributions": 34
    },
    {
      "login": "diip3sh",
      "avatar_url": "https://avatars.githubusercontent.com/u/99866329?v=4",
      "html_url": "https://github.com/diip3sh",
      "contributions": 7
    }
  ],
  "tearcopy": [
    {
      "login": "ravixalgorithm",
      "avatar_url": "https://avatars.githubusercontent.com/u/148683640?v=4",
      "html_url": "https://github.com/ravixalgorithm",
      "contributions": 2
    }
  ],
  "settle-ui": [
    {
      "login": "ravixalgorithm",
      "avatar_url": "https://avatars.githubusercontent.com/u/148683640?v=4",
      "html_url": "https://github.com/ravixalgorithm",
      "contributions": 2
    }
  ]
};

// Per public project: commits per week for the 52 weeks ending the week of `to`, oldest first.
export const snapshotWeeks: { to: string; repos: Record<string, number[]> } = {
  to: "2026-11-08T00:00:00.000Z",
  repos: {
    "OpenStock": [0,0,0,5,0,0,0,0,0,0,3,7,0,0,0,0,0,1,3,1,0,0,9,0,0,0,0,2,1,0,0,0,5,0,0,0,1,0,0,0,0,0,0,2,61,3,5,7,57,5,0,22],
    "kitbash": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,1,0,0,0,15,0,10,0,0,3,3,0,0,0],
    "kine-ui": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,18,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    "openreadme": [62,63,63,74,31,17,11,19,30,18,16,22,29,36,33,44,66,46,45,44,48,55,50,54,74,40,77,72,79,75,80,71,71,73,74,73,85,76,76,75,75,151,78,82,15,79,84,80,62,57,60,56],
    "booktrace": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    "opencosmos": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0],
    "openhaven": [0,0,0,0,0,0,42,12,9,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    "openmind": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,9,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    "OpenCine": [1,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    "den": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0],
    "ports": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,2],
    "ByteMyCV": [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    "zomb": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,62,6,12,0,0,0,0],
    "tearcopy": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    "settle-ui": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
  },
};
