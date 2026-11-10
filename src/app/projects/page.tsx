"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { featuredModules } from "@/data/projects";
import { ArrowLeft, Star, GitFork, CircleDot, Package, Globe, ExternalLink } from "lucide-react";

export default function ProjectsPage() {
    const [repos, setRepos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRepos() {
            try {
                const res = await fetch("/api/github/orgs/Open-Dev-Society/repos?per_page=100");
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();

                // 1. Process Curated List (with custom tags)
                const curatedList = featuredModules.map(config => {
                    const repo = data.find((r: any) => r.name.toLowerCase() === config.name.toLowerCase());
                    if (!repo) return null;
                    return {
                        ...repo,
                        customTags: config.tags
                    };
                }).filter(Boolean);

                // 2. Strict Whitelist: Only show what is in the config
                console.log("Filtered Repos:", curatedList);
                setRepos(curatedList);
            } catch (error) {
                console.error("Error fetching repos:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchRepos();
    }, []);

    return (
        <div className="px-6 py-20">

            {/* Header */}
            <header className="mb-20">
                <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gray-500 hover:text-black transition-colors mb-8">
                    <ArrowLeft className="w-3 h-3" /> Return_Index
                </Link>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 bg-black rounded-full" />
                    <span className="font-mono text-sm tracking-widest uppercase">System_Modules // Full_Index</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-serif italic leading-[0.9] tracking-tighter mb-8">
                    Curated Index.
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
                    The complete catalog of Open Dev Society initiatives. Open for contribution.
                </p>
            </header>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    <div className="col-span-full py-20 text-center font-mono text-gray-400">
                        INITIALIZING_DATALINK...
                    </div>
                ) : (
                    repos.map((repo) => (
                        <div key={repo.id} className="p-8 border border-dashed border-gray-300 hover:bg-gray-50 transition-colors group flex flex-col justify-between h-full">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Package className="w-5 h-5 text-[var(--color-brand-teal)]" />
                                        <h3 className="font-bold font-mono uppercase tracking-wider text-sm">{repo.name}</h3>
                                    </div>
                                    <span className="text-[10px] font-mono border border-black px-2 py-1 uppercase">
                                        {repo.customTags?.[0] || repo.language || 'Code'}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-6 leading-relaxed line-clamp-4">
                                    {repo.description || "No description provided."}
                                </p>

                                {/* Stats */}
                                <div className="flex flex-wrap gap-4 text-[10px] font-mono text-gray-500 mb-6 border-y border-dashed border-gray-200 py-3">
                                    <div className="flex items-center gap-1" title="Stars">
                                        <Star className="w-3 h-3 text-yellow-500" />
                                        <span>{repo.stargazers_count}</span>
                                    </div>
                                    <div className="flex items-center gap-1" title="Forks">
                                        <GitFork className="w-3 h-3" />
                                        <span>{repo.forks_count}</span>
                                    </div>
                                    <div className="flex items-center gap-1" title="Open Issues">
                                        <CircleDot className="w-3 h-3 text-blue-500" />
                                        <span>{repo.open_issues_count}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 text-[10px] font-mono text-gray-400 mb-6">
                                    {repo.customTags?.slice(1).map((tag: string) => (
                                        <span key={tag} className="uppercase">#{tag}</span>
                                    ))}
                                    {repo.topics?.slice(0, 2).map((topic: string) => (
                                        <span key={topic} className="uppercase">#{topic}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-auto">
                                <span className="text-[10px] font-mono uppercase bg-gray-100 px-2 py-1 rounded">
                                    {repo.language || 'Code'}
                                </span>
                                <a href={repo.html_url} target="_blank" className="flex items-center gap-1 text-xs font-mono underline decoration-dashed hover:decoration-solid group-hover:text-[var(--color-brand-rose)]">
                                    REPO_ACCESS <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <footer className="mt-20 pt-10 border-t border-dashed border-gray-300 text-center font-mono text-xs text-gray-500">
                <p>END_OF_LIST // {repos.length}_MODULES_FOUND</p>
            </footer>

        </div>

    );
}
