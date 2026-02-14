export type MentionSource = "article" | "youtube" | "twitter" | "instagram" | "linkedin" | "other" | "facebook";

export interface Mention {
    title: string;
    description: string;
    source: MentionSource;
    author: string;
    url: string;
    date?: string;
    highlight?: string; // A short quote or excerpt
    thumbnail?: string; // Optional thumbnail image path
}

export const mentions: Mention[] = [
    // ─── Articles ───
    {
        title: "OpenStock isn’t a startup pitch. It’s a community project — a reminder that great tools shouldn’t hide behind logins or price tiers.",
        description: "If you want to tinker, contribute, or just use it as your daily dashboard — go for it. The repo is open, the code is clean, and the mission is simple.",
        source: "article",
        author: "Tattva Tarang at Medium",
        url: "https://medium.com/coding-nexus/openstock-the-free-open-source-stock-market-app-built-for-everyone-af6ae05b87de",
        date: "2025",
        highlight: "\"It’s designed for students, indie devs, and anyone who enjoys learning about markets without the distraction.\"",
    },
    {
        title: "Supercharge Your GitHub Profile with OpenReadme: Bento-Style Banners, Live Stats, and Open-Source Community",
        description: "Tired of flat, outdated profile banners on GitHub? Want a beautiful, auto-updating visual showcasing your real achievements, contributions, and personality—without endless configuration?",
        source: "article",
        author: "Ravi Pratap Singh at Dev.to",
        url: "https://dev.to/ravixalgorithm/supercharge-your-github-profile-with-openreadme-bento-style-banners-live-stats-and-open-source-1ha",
        date: "2025",
        highlight: "\"Navigating the world of developer portfolios and project READMEs, we noticed a recurring problem: most tools were either too static, too complex, or lacked feature-rich styling and customization.\"",
    },
    {
        title: "OpenStock is an open-source alternative to expensive market platforms.",
        description: "OpenStock is an open-source stock market tracking platform built with Next.js 15, TypeScript, and MongoDB. It provides real-time price tracking, personalized alerts, company insights, and TradingView chart integrations without paywalls.",
        source: "article",
        author: "Dickson A. at Daily.dev",
        url: "https://app.daily.dev/posts/openstock-is-an-open-source-alternative-to-expensive-market-platforms--0cijqlabk",
        date: "2025",
        highlight: "",
    },
    {
        title: "Got mentioned at [ MAGI//ARCHIVE ]",
        description: "",
        source: "article",
        author: "Tom Doerr at MAGI//ARCHIVE",
        url: "https://tom-doerr.github.io/repo_posts/2025/10/16/Open-Dev-Society-OpenStock.html",
        date: "2026",
        highlight: "",
    },
    {
        title: "The Ultimate Open-Source Stock Market App: Free Real-Time Trading Data, Smart Alerts &amp; Company Insights (2025 Security Guide)",
        description: "Discover OpenStock the revolutionary open-source stock market app with real-time prices, AI-powered alerts, and comprehensive company insights. Learn from recent fintech hacks, implement bulletproof security, and join 50,000+ traders building the future of finance.",
        source: "article",
        author: "Mohamed IDBRAHIM at brightcoding.dev",
        url: "https://www.blog.brightcoding.dev/2025/10/16/%F0%9F%9A%80-the-ultimate-open-source-stock-market-app-free-real-time-trading-data-smart-alerts-company-insights-2025-security-guide/",
        date: "2025",
        highlight: "\"Open-source stock market applications like OpenStock represent more than just free software - they embody the democratization of financial information and tools previously available only to institutional investors.\"",
    },
    

    // ─── YouTube ───


    // ─── Twitter / X ───


    // ─── LinkedIn ───


    // ─── Instagram ───
    {
        title: "Got mentioned by @githubprojects",
        description: "Track real-time stock prices and set personalized alerts for free with this open-source tool.",
        source: "instagram",
        author: "@githubprojects via Threads",
        url: "https://www.threads.com/@githubprojects/post/DSOKaCvkn3L/track-real-time-stock-prices-and-set-personalized-alerts-for-free-with-this",
        date: "2025",
    },
    {
        title: "Got mentioned by @maoyang",
        description: "OpenStock：打造屬於所有人的免費開源股票追蹤平台",
        source: "instagram",
        author: "@maoyang via Threads",
        url: "https://www.threads.com/@maoyang/post/DTS3I3fE34d?hl=en",
        date: "2026",
        highlight: "OpenStock's core philosophy is \"Build openly, for everyone, forever free\"",
    },
    {
        title: "Got mentioned by @dankopenguin",
        description: "OpenStock 本身不能提供交易功能，而專注於市場數據的展示、監控和分析。它為普通用戶、學生及專業人士，提供一款永久免費的金融市場數據平台。",
        source: "instagram",
        author: "@dankopenguin via Threads",
        url: "https://www.threads.com/@dankopeng/post/DPoYj8bkcas?hl=en",
        date: "2025",
        highlight: "",
    },
    {
        title: "Got mentioned by @hackertales",
        description: "",
        source: "instagram",
        author: "@hackertales via Threads",
        url: "https://www.threads.com/@hackertale/post/DPtOOfvj2H3?hl=en",
        date: "2025",
        highlight: "\"OpenStock lets you unlock professional grade investment platform features for free!\"",
    },
    {
        title: "Got mentioned by @aliansari00",
        description: "",
        source: "instagram",
        author: "@aliansari00 via Threads",
        url: "https://www.threads.com/@aliansari0/post/DSktV7Tl7pr?hl=en",
        date: "2025",
        highlight: "",
    },
    {
        title: "Got mentioned by @akiraxtwo",
        description: "",
        source: "instagram",
        author: "@akiraxtwo via Threads",
        url: "https://www.threads.com/@akiraxtwo/post/DP8hyHAEpsB?hl=en",
        date: "2025",
        highlight: "",
    },

    // ─── Facebook ───
    {
        title: "Got mentioned on facebook",
        description: "Open source stock market app with real-time prices, alerts, and company insights",
        source: "facebook",
        author: "Vince Loremia at Facebook",
        url: "https://www.facebook.com/vinxstudio/posts/open-source-stock-market-app-with-real-time-prices-alerts-and-company-insights-h/10234748714193544/",
        date: "2025",
        highlight: "",
    },
    {
        title: "OpenStock: The free alternative to $2,000/month Bloomberg Terminal",
        description: "Track real-time prices, set personalized alerts, and explore detailed company insights — built openly, for everyone, forever free.",
        source: "facebook",
        author: "The AI Empire at Facebook",
        url: "https://www.facebook.com/theaiempire/posts/openstock-the-free-alternative-to-2000month-bloomberg-terminaltrack-real-time-pr/122145153812733053/",
        date: "2025",
        highlight: "",
    },

    // ─── Other ───
    {
        title: "Open Dev Society Reddit mention",
        description: "open-source stock market app with real-time prices, alerts, and company insights",
        source: "other",
        author: "Current-Guide5944 at Reddit",
        url: "https://www.reddit.com/r/tech_x/comments/1o91tfw/opensource_stock_market_app_with_realtime_prices/",
        date: "2025",
        highlight: "",
    },
    {
        title: "Got mentioned by Hello GitHub",
        description: "This is a stock market platform built with Next.js, TailwindCSS and MongoDB, providing real-time quotes, charts (candlestick charts, heat maps), news and personalized monitoring. It focuses on data display and analysis and does not support trading.",
        source: "other",
        author: "Hello GitHub",
        url: "https://hellogithub.com/en/repository/Open-Dev-Society/OpenStock",
        date: "2025",
        highlight: "\"Free and Cool Stock Market App\"",
    },
    {
        title: "Got mentioned for community-scripts/ProxmoxVE",
        description: "",
        source: "other",
        author: "HandyS11 at community-scripts/ProxmoxVE repository",
        url: "https://github.com/community-scripts/ProxmoxVE/discussions/8891",
        date: "2025",
        highlight: "",
    },
    {
        title: "Got mentioned at Built At Lightspeed",
        description: "The core mission behind OpenStock is to create a community-driven platform where knowledge is free and accessible to all. ",
        source: "other",
        author: "Built At Lightspeed",
        url: "https://www.builtatlightspeed.com/theme/open-dev-society-openstock",
        date: "2025",
        highlight: "It's more than just an app; it's a movement towards transparency in the financial sector. Whether you’re a seasoned trader or a curious beginner, OpenStock invites you to explore the world of stock markets without the traditional barriers.",
    },
];
