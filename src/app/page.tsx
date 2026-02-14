"use client";

import { motion } from "framer-motion";
import { ArrowRight, Globe, Zap, Users, Terminal, Unlock, Heart, TrendingUp, Shield, BookOpen, Package, BarChart3, Code2, PenTool, GraduationCap, Star, GitFork, CircleDot, MessageSquareQuote, Youtube, Newspaper, Twitter, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { useState, useEffect } from "react";
import { featuredModules } from "@/data/projects";

import { getFromCache, saveToCache, CACHE_KEYS } from "@/utils/githubCache";
import { mentions } from "@/data/mentions";

const sourceIcons: Record<string, typeof Newspaper> = {
  article: Newspaper,
  youtube: Youtube,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  other: MessageSquareQuote,
};

export default function Home() {
  const [stats, setStats] = useState<{ repos: number; stars: number; list: any[]; contributors: Record<string, any[]> }>({
    repos: 0,
    stars: 0,
    list: [],
    contributors: {}
  });

  useEffect(() => {
    async function fetchGitHubStats() {
      // 1. Try Cache First
      const cached = getFromCache<{ repos: number; stars: number; list: any[]; contributors: Record<string, any[]> }>(CACHE_KEYS.STATS);
      if (cached) {
        setStats(cached);
        console.log("Loaded stats from local cache");
        return;
      }

      try {
        const res = await fetch("/api/github/orgs/Open-Dev-Society/repos?per_page=100");
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const data = await res.json();

        const totalStars = data.reduce((acc: number, repo: any) => acc + repo.stargazers_count, 0);

        // Filter and Sort based on configuration
        const curatedList = featuredModules.map(config => {
          const repo = data.find((r: any) => r.name.toLowerCase() === config.name.toLowerCase());
          if (!repo) return null;
          return {
            ...repo,
            customTags: config.tags
          };
        }).filter(Boolean);

        // Fetch Contributors for curated list
        const contributorsMap: Record<string, any[]> = {};

        await Promise.all(curatedList.map(async (repo: any) => {
          try {
            // Use local proxy for contributors
            const proxyUrl = repo.contributors_url.replace('https://api.github.com', '/api/github');
            const contribRes = await fetch(proxyUrl);

            if (contribRes.ok) {
              const contribData = await contribRes.json();
              // Take top 5, exclude bots if possible (simplistic check)
              contributorsMap[repo.name] = contribData
                .filter((c: any) => c.type === 'User')
                .slice(0, 5);
            }
          } catch (e) {
            console.error(`Failed to fetch contributors for ${repo.name}`, e);
          }
        }));

        const newStats = {
          repos: curatedList.length,
          stars: totalStars,
          list: curatedList,
          contributors: contributorsMap
        };

        setStats(newStats);
        // 2. Save to Cache
        saveToCache(CACHE_KEYS.STATS, newStats);

      } catch (error) {
        console.error("Error fetching GitHub stats:", error);
      }
    }

    fetchGitHubStats();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative px-8 pt-32 pb-20 border-b border-dashed border-gray-300 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gray-50 rounded-full blur-3xl -z-10 opacity-50" />

        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="w-2 h-2 bg-[var(--color-brand-teal)] rounded-full animate-pulse-slow"></span>
              <span className="text-mono">EST. 2024 // GLOBAL_COLLECTIVE</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif italic mb-8 leading-[0.9] tracking-tighter">
              The Operating System <br />
              <span className="not-italic font-bold">for Open Source.</span>
            </h1>

            <p className="text-lg md:text-xl font-sans text-gray-600 max-w-lg mb-10 leading-relaxed">
              We are a decentralized society of developers, designers, and writers building public goods. <strong className="text-black">No paywalls. No gatekeeping. Just code.</strong>
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link href="https://github.com/Open-Dev-Society" target="_blank" className="btn-tech group text-center">
                <span className="flex items-center justify-center gap-2">
                  [ START_CONTRIBUTING ] <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link href="/manifesto" className="flex items-center justify-center gap-2 px-6 py-2 font-mono text-xs uppercase tracking-widest hover:bg-gray-100 transition-colors">
                [ READ_MANIFESTO ]
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CONCEPT EXPLANATION: The Ecosystem */}
      <section className="border-b border-dashed border-gray-300 bg-gray-50/50">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-dashed divide-gray-300">
          {/* Column 1: BUILD */}
          <div className="p-10 hover:bg-white transition-colors group">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-5 h-5 text-[var(--color-brand-teal)]" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-gray-500">01_INITIATIVES</h3>
            </div>
            <h4 className="text-2xl font-serif mb-3 font-bold">We Build.</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              From developer tools to open libraries. We create software that solves real problems and release it for free.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="text-[10px] font-mono border border-gray-300 px-2 py-1 bg-white">OPEN_STOCK</span>
              <span className="text-[10px] font-mono border border-gray-300 px-2 py-1 bg-white">BOOK_TRACE</span>
            </div>
          </div>

          {/* Column 2: LEARN */}
          <div className="p-10 hover:bg-white transition-colors group">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-5 h-5 text-[var(--color-brand-teal)]" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-gray-500">02_KNOWLEDGE</h3>
            </div>
            <h4 className="text-2xl font-serif mb-3 font-bold">We Teach.</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Knowledge should be free. We produce roadmaps, tutorials, and mentorship programs to help you grow.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="text-[10px] font-mono border border-gray-300 px-2 py-1 bg-white">MENTORSHIP</span>
              <span className="text-[10px] font-mono border border-gray-300 px-2 py-1 bg-white">ROADMAPS</span>
            </div>
          </div>

          {/* Column 3: CONNECT */}
          <div className="p-10 hover:bg-white transition-colors group">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-5 h-5 text-[var(--color-brand-teal)]" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-gray-500">03_NETWORK</h3>
            </div>
            <h4 className="text-2xl font-serif mb-3 font-bold">We Connect.</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              A global network of like-minded creators. Find your team, launch your project, and make an impact.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="text-[10px] font-mono border border-gray-300 px-2 py-1 bg-white">HACKATHONS</span>
              <span className="text-[10px] font-mono border border-gray-300 px-2 py-1 bg-white">EVENTS</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values (Principles) */}
      <section id="manifesto" className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-dashed divide-gray-300 border-b border-dashed border-gray-300">
        <div className="p-10 hover:bg-gray-50 transition-colors group border-b md:border-b-0 border-dashed border-gray-300">
          <Unlock className="w-6 h-6 mb-6 text-[var(--color-brand-teal)] group-hover:rotate-12 transition-transform duration-500" />
          <h3 className="heading-serif text-2xl mb-4">DEFAULT_TO_OPEN</h3>
          <p className="font-sans text-sm text-gray-600 leading-relaxed max-w-sm">
            All code is open-source. All knowledge is public. We believe transparency is the only way to build trust at scale.
          </p>
        </div>
        <div className="p-10 hover:bg-gray-50 transition-colors group border-b md:border-b-0 border-dashed border-gray-300">
          <Users className="w-6 h-6 mb-6 text-[var(--color-brand-teal)] group-hover:rotate-12 transition-transform duration-500" />
          <h3 className="heading-serif text-2xl mb-4">PERMISSIONLESS_ACCESS</h3>
          <p className="font-sans text-sm text-gray-600 leading-relaxed max-w-sm">
            No gatekeepers. No interviews. You don't need permission to fork, contribute, or start building. Just start.
          </p>
        </div>
        <div className="p-10 hover:bg-gray-50 transition-colors group">
          <TrendingUp className="w-6 h-6 mb-6 text-[var(--color-brand-teal)] group-hover:rotate-12 transition-transform duration-500" />
          <h3 className="heading-serif text-2xl mb-4">RAPID_ITERATION</h3>
          <p className="font-sans text-sm text-gray-600 leading-relaxed max-w-sm">
            We ship fast. We break things. We solve real problems with code, not endless meetings.
          </p>
        </div>
        <div className="p-10 hover:bg-gray-50 transition-colors group">
          <Heart className="w-6 h-6 mb-6 text-[var(--color-brand-teal)] group-hover:rotate-12 transition-transform duration-500" />
          <h3 className="heading-serif text-2xl mb-4">DISTRIBUTED_STRENGTH</h3>
          <p className="font-sans text-sm text-gray-600 leading-relaxed max-w-sm">
            We are stronger together. We mentor the next generation and lift each other up.
          </p>
        </div>
      </section>

      {/* Active Modules (Projects) */}
      <section id="modules" className="border-b border-dashed border-gray-300">
        <div className="p-8 border-b border-dashed border-gray-300 bg-gray-50 flex justify-between items-center">
          <h2 className="text-mono text-xs uppercase tracking-widest text-gray-500">
            // KERNEL_MODULES [ACTIVE_DEPLOYMENTS]
          </h2>
          <Link href="/projects" className="text-xs font-mono underline decoration-dashed hover:decoration-solid">
            VIEW_ALL_MODULES_({stats.repos})
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-dashed divide-gray-300">
          {stats.list.length > 0 ? (
            stats.list.slice(0, 4).map((repo: any) => (
              <div key={repo.id} className="p-8 hover:bg-gray-50 transition-colors border-b border-dashed border-gray-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-[var(--color-brand-teal)]" />
                    <h3 className="font-bold font-mono uppercase tracking-wider">{repo.name}</h3>
                  </div>
                  <span className="text-[10px] font-mono border border-black px-2 py-1 uppercase">
                    {repo.customTags?.[0] || repo.language || 'Code'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-6 leading-relaxed h-16 line-clamp-3">
                  {repo.description || "No description provided."}
                </p>

                {/* Repo Stats */}
                <div className="flex items-center gap-4 text-[10px] font-mono text-gray-500 mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    <span>{repo.stargazers_count}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork className="w-3 h-3" />
                    <span>{repo.forks_count}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CircleDot className="w-3 h-3" />
                    <span>{repo.open_issues_count}</span>
                  </div>
                </div>

                {/* Contributors */}
                {stats.contributors[repo.name] && stats.contributors[repo.name].length > 0 && (
                  <div className="mb-6">
                    <div className="text-[10px] font-mono text-gray-400 mb-2 uppercase tracking-wider">Active Operators:</div>
                    <div className="flex -space-x-2">
                      {stats.contributors[repo.name].map((contributor: any) => (
                        <img
                          key={contributor.id}
                          src={contributor.avatar_url}
                          alt={contributor.login}
                          title={contributor.login}
                          className="w-6 h-6 rounded-full border border-white bg-gray-100"
                        />
                      ))}
                      {stats.contributors[repo.name].length >= 5 && (
                        <div className="w-6 h-6 rounded-full border border-white bg-gray-100 flex items-center justify-center text-[8px] font-mono text-gray-500">
                          +
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex gap-2 text-[10px] font-mono text-gray-400">
                    {repo.customTags?.slice(1).map((tag: string) => (
                      <span key={tag} className="uppercase">#{tag}</span>
                    ))}
                    {repo.topics?.slice(0, 2).map((topic: string) => (
                      <span key={topic} className="uppercase">#{topic}</span>
                    ))}
                  </div>
                  <a href={repo.html_url} target="_blank" className="text-xs font-mono underline decoration-dashed hover:decoration-[var(--color-brand-rose)] hover:text-[var(--color-brand-rose)] hover:decoration-solid">VIEW_REPO</a>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 col-span-2 text-center text-gray-400 font-mono text-xs">
              LOADING_SYSTEM_DATA...
            </div>
          )}
        </div>
      </section>

      {/* Join the Collective (Target Acquisition) */}
      <section className="py-20 border-b border-dashed border-gray-300">
        <div className="p-8 mb-12 text-center">
          <h2 className="text-mono text-xs uppercase tracking-widest text-gray-500 mb-4">
                // OPERATOR_ONBOARDING [SELECT_CLASS]
          </h2>
          <h3 className="text-4xl font-serif italic mb-6">Initialize Your Role.</h3>
          <p className="text-gray-600 max-w-lg mx-auto">
            The society needs all types of operators. Identify your capacity and join the network.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-300 border-y border-dashed border-gray-300">
          <Link href="/contribute#code" className="bg-white p-12 hover:bg-gray-50 transition-colors group text-center block">
            <div className="mb-4 inline-flex p-3 bg-gray-100 rounded-full group-hover:bg-black group-hover:text-white transition-colors">
              <Code2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold font-mono uppercase text-sm mb-2">Developer</h4>
            <p className="text-xs text-gray-500 mb-4">Code, review, optimize.</p>
            <span className="text-[10px] font-mono border-b border-black pb-0.5">INIT_DEV_PROTOCOL</span>
          </Link>

          <Link href="/contribute#content" className="bg-white p-12 hover:bg-gray-50 transition-colors group text-center block">
            <div className="mb-4 inline-flex p-3 bg-gray-100 rounded-full group-hover:bg-black group-hover:text-white transition-colors">
              <PenTool className="w-6 h-6" />
            </div>
            <h4 className="font-bold font-mono uppercase text-sm mb-2">Writer</h4>
            <p className="text-xs text-gray-500 mb-4">Guide, document, inspire.</p>
            <span className="text-[10px] font-mono border-b border-black pb-0.5">INIT_DOCS_PROTOCOL</span>
          </Link>

          <Link href="/contribute#education" className="bg-white p-12 hover:bg-gray-50 transition-colors group text-center block">
            <div className="mb-4 inline-flex p-3 bg-gray-100 rounded-full group-hover:bg-black group-hover:text-white transition-colors">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h4 className="font-bold font-mono uppercase text-sm mb-2">Educator</h4>
            <p className="text-xs text-gray-500 mb-4">Teach, mentor, grow.</p>
            <span className="text-[10px] font-mono border-b border-black pb-0.5">INIT_EDU_PROTOCOL</span>
          </Link>
        </div>
        <div className="text-center mt-12 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 px-4">
          <Link href="/contribute" className="btn-tech w-full sm:w-auto text-center">
            VIEW_FULL_OPERATIONS_MANUAL
          </Link>
          <Link href="/contributors" className="px-6 py-2 font-mono text-xs uppercase tracking-widest border border-gray-300 hover:bg-black hover:text-white transition-colors w-full sm:w-auto text-center">
            [ VIEW_ACTIVE_OPERATORS ]
          </Link>
        </div>
      </section>

      {/* Partners & Events */}
      <section className="py-20 px-8 border-b border-dashed border-gray-300">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-mono text-xs uppercase tracking-widest text-gray-500 mb-4">
              // SYSTEM_ALLIANCES [ACTIVE_NETWORKS]
            </h2>
            <h3 className="text-4xl font-serif italic mb-4">Trusted <span className="not-italic font-bold">Partners.</span></h3>
            <p className="text-gray-600 text-sm max-w-md mx-auto">
              Organizations and events powering our mission to make open source accessible to everyone.
            </p>
          </div>

          {/* Partner Logos */}
          <div className="flex flex-wrap justify-center items-center gap-16 mb-12">
            <a href="https://siray.ai" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
              <img src="/partners/sirayLogo.svg" alt="siray.ai" className="h-12 w-auto object-contain" />
            </a>
            <a href="https://stellailoom.com" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
              <img src="/partners/stellailoomLogo.svg" alt="StellAILoom" className="h-12 w-auto object-contain" style={{ filter: 'invert(1)' }} />
            </a>
          </div>

          {/* Events Preview */}
          <div className="border border-dashed border-gray-300 divide-y divide-dashed divide-gray-300">
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 bg-[var(--color-brand-teal)] text-white mr-2">Community Partner</span>
                <span className="font-bold text-sm">Apretre 3.0</span>
                <span className="text-xs text-gray-400 ml-2">by Resourcio Community</span>
              </div>
            </div>
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 bg-[var(--color-brand-teal)] text-white mr-2">Community Partner</span>
                <span className="font-bold text-sm">JWOC – JGEC Winter of Code</span>
                <span className="text-xs text-gray-400 ml-2">by JGEC</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 sm:gap-4 mt-10">
            <Link href="/partners" className="btn-tech w-full sm:w-auto text-center">
              VIEW_ALL_ALLIANCES
            </Link>
            <Link href="/partners#partner-cta" className="font-mono text-[11px] uppercase tracking-widest border border-gray-300 px-5 py-2.5 hover:bg-black hover:text-white hover:border-black transition-colors w-full sm:w-auto text-center">
              FOR_BRANDS →
            </Link>
            <Link href="/partners#partner-cta" className="font-mono text-[11px] uppercase tracking-widest border border-gray-300 px-5 py-2.5 hover:bg-black hover:text-white hover:border-black transition-colors w-full sm:w-auto text-center">
              FOR_COMMUNITIES →
            </Link>
          </div>
        </div>
      </section>

      {/* The Collective Stats */}
      <section className="p-8 py-20 border-b border-dashed border-gray-300 bg-gray-50">
        <div className="max-w-md mx-auto text-center">
          <Users className="w-8 h-8 mx-auto mb-4" />
          <h2 className="heading-serif text-3xl mb-4">System Metrics</h2>
          <p className="font-sans text-sm text-gray-600 mb-8">
            Founded in July 2024 by <span className="font-bold">Ravi Pratap Singh</span> (@ravixalgorithm).
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-mono text-xs border border-dashed border-gray-300 bg-white p-4 inline-flex">
            <span>MEMBERS: <span className="text-black font-bold">1000+</span></span>
            <span className="text-gray-300">|</span>
            <span>REPOS: <span className="text-black font-bold">{stats.repos > 0 ? stats.repos : '...'}</span></span>
            <span className="text-gray-300">|</span>
            <span>GITHUB STARS: <span className="text-green-600 font-bold">{stats.stars > 0 ? `${stats.stars}+` : '...'}</span></span>
          </div>
        </div>
      </section>

      {/* Word of Mouth — Quick Preview */}
      <section className="py-16 px-8 border-b border-dashed border-gray-300">
        <div className="text-center mb-10">
          <h2 className="text-mono text-xs uppercase tracking-widest text-gray-500 mb-4">
            // SIGNAL_INTERCEPT [COMMUNITY_LOVE]
          </h2>
          <h3 className="text-4xl font-serif italic mb-4">Word of <span className="not-italic font-bold">Mouth.</span></h3>
          <p className="text-gray-600 text-sm max-w-md mx-auto">
            What the community is saying about Open Dev Society across the internet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200 border border-gray-200 mb-10">
          {mentions.filter(m => m.highlight).slice(0, 3).map((mention, index) => {
            const Icon = sourceIcons[mention.source] || MessageSquareQuote;
            return (
              <a
                key={index}
                href={mention.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-8 hover:bg-gray-50 transition-colors group block"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Icon className="w-4 h-4 text-gray-400" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
                    {mention.source}
                  </span>
                </div>
                <blockquote className="text-sm italic text-gray-700 leading-relaxed mb-4">
                  {mention.highlight}
                </blockquote>
                <div className="text-xs text-gray-500 font-mono">
                  — {mention.author}
                </div>
              </a>
            );
          })}
        </div>

        <div className="text-center">
          <Link href="/word-of-mouth" className="btn-tech">
            VIEW_ALL_SIGNALS
          </Link>
        </div>
      </section>
    </>
  );
}
