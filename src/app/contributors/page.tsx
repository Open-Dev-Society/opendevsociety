"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { manualContributors, Contributor } from "@/data/contributors";
import { featuredModules } from "@/data/projects";

import { getFromCache, saveToCache, CACHE_KEYS } from "@/utils/githubCache";
import { Terminal, Github, Twitter, Shield, Code2, Cpu, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ContributorsPage() {
    const [contributors, setContributors] = useState<Contributor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAllContributors() {
            // 1. Try Cache First
            const cached = getFromCache<Contributor[]>(CACHE_KEYS.CONTRIBUTORS);
            if (cached) {
                setContributors(cached);
                setLoading(false);
                console.log("Loaded contributors from local cache");
                return;
            }

            const allContributorsMap = new Map<string, Contributor>();

            // 2. Add Manual Contributors first (they take precedence for roles)
            manualContributors.forEach(c => {
                allContributorsMap.set(c.login.toLowerCase(), c);
            });

            // 3. Fetch from GitHub for each featured module
            let fetchedCount = 0;
            await Promise.all(featuredModules.map(async (repoConfig) => {
                try {
                    const res = await fetch(`/api/github/repos/Open-Dev-Society/${repoConfig.name}/contributors?per_page=10`);
                    if (res.ok) {
                        const data = await res.json();
                        data.forEach((c: any) => {
                            if (c.type === 'User') {
                                fetchedCount++;
                                const existing = allContributorsMap.get(c.login.toLowerCase());
                                if (!existing) {
                                    allContributorsMap.set(c.login.toLowerCase(), {
                                        login: c.login,
                                        avatar_url: c.avatar_url,
                                        html_url: c.html_url,
                                        type: 'User',
                                        role: 'Contributor' // Default role
                                    });
                                }
                            }
                        });
                    }
                } catch (e) {
                    console.warn(`Failed to fetch for ${repoConfig.name}`, e);
                }
            }));



            const finalList = Array.from(allContributorsMap.values());
            setContributors(finalList);
            setLoading(false);

            // 5. Save to Cache
            saveToCache(CACHE_KEYS.CONTRIBUTORS, finalList);
        }

        fetchAllContributors();
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* We reuse the Navbar from layout, but layout wraps children. 
            Wait, layout.tsx ALREADY adds Navbar. We don't need to add it here. 
            Checking layout.tsx... Yes, it wraps {children}.
        */}

            <div className="px-6 py-20 max-w-5xl mx-auto">

                {/* Header */}
                <header className="mb-20">
                    <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gray-500 hover:text-black transition-colors mb-8">
                        <ArrowLeft className="w-3 h-3" /> Return_Index
                    </Link>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-3 h-3 bg-[var(--color-brand-teal)] rounded-full animate-pulse" />
                        <span className="font-mono text-sm tracking-widest uppercase text-gray-500">System_Personnel // V1.0</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif italic mb-8 leading-[0.9] tracking-tighter">
                        Active <span className="not-italic font-bold">Operators.</span>
                    </h1>
                    <p className="font-mono text-xs text-gray-500 max-w-md">
                        [DIRECTORY_STATUS: ONLINE] <br />
                        The architects, maintainers, and contributors building the Open Dev Society.
                    </p>
                </header>

                {/* Directory Grid */}
                {loading ? (
                    <div className="font-mono text-xs text-gray-400 animate-pulse">
                        INITIALIZING_DIRECTORY_SCAN...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {contributors.map((person, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                key={person.login}
                                className="group border border-dashed border-gray-300 p-6 hover:bg-gray-50 transition-all hover:border-gray-400"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <img
                                        src={person.avatar_url}
                                        alt={person.login}
                                        className="w-16 h-16 rounded-full border-2 border-white shadow-sm grayscale group-hover:grayscale-0 transition-all"
                                    />
                                    <div className="flex gap-2">
                                        {person.html_url && (
                                            <Link href={person.html_url} target="_blank" className="text-gray-400 hover:text-black">
                                                <Github className="w-4 h-4" />
                                            </Link>
                                        )}
                                        {person.twitter && (
                                            <Link href={person.twitter} target="_blank" className="text-gray-400 hover:text-black">
                                                <Twitter className="w-4 h-4" />
                                            </Link>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-bold font-mono text-lg mb-1">
                                        {person.name || person.login}
                                    </h3>
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className={`text-[10px] font-mono px-2 py-0.5 border ${person.role?.includes("Founder") || person.role?.includes("Architect")
                                            ? "bg-black text-white border-black"
                                            : "bg-gray-100 text-gray-500 border-gray-200"
                                            } uppercase tracking-wider`}>
                                            {person.role || "OPERATOR"}
                                        </span>
                                    </div>

                                    <div className="text-[10px] font-mono text-gray-400 truncate">
                                        ID: {person.login}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                <div className="mt-20 pt-10 border-t border-dashed border-gray-300 text-center">
                    <p className="font-serif italic text-2xl mb-6">"Code is the currency. Trust is the network."</p>
                    <Link href="https://github.com/Open-Dev-Society" target="_blank" className="btn-tech inline-block">
                        [ JOIN_THE_NETWORK ]
                    </Link>
                </div>

            </div>
        </div>
    );
}
