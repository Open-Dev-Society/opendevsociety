"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { mentions, MentionSource } from "@/data/mentions";
import {
    ArrowLeft,
    ArrowUpRight,
    Heart,
    Newspaper,
    Youtube,
    Twitter,
    Instagram,
    Linkedin,
    Facebook,
    MessageSquareQuote,
    Sparkles,
    Filter,
} from "lucide-react";

const sourceConfig: Record<MentionSource, { label: string; icon: typeof Newspaper; color: string; bgColor: string }> = {
    article: { label: "Article", icon: Newspaper, color: "text-blue-600", bgColor: "bg-blue-50 border-blue-200" },
    youtube: { label: "YouTube", icon: Youtube, color: "text-red-600", bgColor: "bg-red-50 border-red-200" },
    twitter: { label: "Twitter / X", icon: Twitter, color: "text-sky-500", bgColor: "bg-sky-50 border-sky-200" },
    instagram: { label: "Instagram", icon: Instagram, color: "text-pink-600", bgColor: "bg-pink-50 border-pink-200" },
    linkedin: { label: "LinkedIn", icon: Linkedin, color: "text-blue-700", bgColor: "bg-blue-50 border-blue-300" },
    other: { label: "Other", icon: MessageSquareQuote, color: "text-gray-600", bgColor: "bg-gray-50 border-gray-200" },
    facebook: { label: "Facebook", icon: Facebook, color: "text-blue-700", bgColor: "bg-blue-50 border-blue-300" },
};

const filterOptions: { value: MentionSource | "all"; label: string }[] = [
    { value: "all", label: "All" },
    { value: "article", label: "Articles" },
    { value: "youtube", label: "YouTube" },
    { value: "twitter", label: "Twitter / X" },
    { value: "instagram", label: "Instagram" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "facebook", label: "Facebook" },
    { value: "other", label: "Other" },
];

export default function WordOfMouthPage() {
    const [activeFilter, setActiveFilter] = useState<MentionSource | "all">("all");

    const filtered = activeFilter === "all"
        ? mentions
        : mentions.filter((m) => m.source === activeFilter);

    return (
        <div className="min-h-screen bg-white">
            <div className="px-6 py-20 max-w-5xl mx-auto">

                {/* Header */}
                <header className="mb-16">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gray-500 hover:text-black transition-colors mb-8"
                    >
                        <ArrowLeft className="w-3 h-3" /> Return_Index
                    </Link>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-3 h-3 bg-[var(--color-brand-rose)] rounded-full animate-pulse" />
                        <span className="font-mono text-sm tracking-widest uppercase text-gray-500">
                            Signal_Log // V1.0
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif italic mb-8 leading-[0.9] tracking-tighter">
                        Word of <span className="not-italic font-bold">Mouth.</span>
                    </h1>
                    <p className="font-mono text-xs text-gray-500 max-w-lg">
                        [SIGNAL_TYPE: COMMUNITY_LOVE] <br />
                        Mentions, features, and love from across the internet.
                        Every shoutout fuels our mission to keep open source free and accessible.
                    </p>
                </header>

                {/* Stats Bar */}
                <section className="mb-12 grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-200 border border-gray-200">
                    <div className="bg-white p-6 text-center">
                        <div className="text-3xl font-bold font-mono mb-1">{mentions.length}</div>
                        <div className="font-mono text-[10px] uppercase tracking-widest text-gray-500">Total Mentions</div>
                    </div>
                    <div className="bg-white p-6 text-center">
                        <div className="text-3xl font-bold font-mono text-red-600 mb-1">
                            {mentions.filter((m) => m.source === "youtube").length}
                        </div>
                        <div className="font-mono text-[10px] uppercase tracking-widest text-gray-500">Videos</div>
                    </div>
                    <div className="bg-white p-6 text-center">
                        <div className="text-3xl font-bold font-mono text-blue-600 mb-1">
                            {mentions.filter((m) => m.source === "article").length}
                        </div>
                        <div className="font-mono text-[10px] uppercase tracking-widest text-gray-500">Articles</div>
                    </div>
                    <div className="bg-white p-6 text-center">
                        <div className="text-3xl font-bold font-mono text-sky-500 mb-1">
                            {mentions.filter((m) => ["twitter", "instagram", "linkedin", "facebook", "other"].includes(m.source)).length}
                        </div>
                        <div className="font-mono text-[10px] uppercase tracking-widest text-gray-500">Social Posts</div>
                    </div>
                </section>

                {/* Filter Bar */}
                <section className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <span className="font-mono text-xs uppercase tracking-widest text-gray-500">
                            // FILTER_BY_SOURCE
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {filterOptions.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => setActiveFilter(opt.value)}
                                className={`font-mono text-[11px] uppercase tracking-widest px-4 py-2 border transition-colors cursor-pointer ${activeFilter === opt.value
                                        ? "bg-black text-white border-black"
                                        : "bg-white text-gray-600 border-gray-300 hover:border-black"
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Mentions Grid */}
                <section className="mb-20">
                    <div className="flex items-center gap-3 mb-8">
                        <Heart className="w-4 h-4 text-[var(--color-brand-rose)]" />
                        <h2 className="font-mono text-xs uppercase tracking-widest text-gray-500">
                            // SIGNAL_FEED [{filtered.length} ENTRIES]
                        </h2>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeFilter}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-100"
                        >
                            {filtered.map((mention, index) => {
                                const config = sourceConfig[mention.source];
                                const Icon = config.icon;

                                return (
                                    <motion.a
                                        key={`${mention.title}-${index}`}
                                        href={mention.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.05 }}
                                        className="bg-white p-8 hover:bg-gray-50 transition-all group block"
                                    >
                                        {/* Source Badge + Date */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 border text-[10px] font-mono uppercase tracking-widest ${config.bgColor}`}>
                                                <Icon className={`w-3 h-3 ${config.color}`} />
                                                <span className={config.color}>{config.label}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {mention.date && (
                                                    <span className="font-mono text-[10px] text-gray-400">
                                                        {mention.date}
                                                    </span>
                                                )}
                                                <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-black transition-colors" />
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-lg font-bold mb-2 group-hover:text-[var(--color-brand-teal)] transition-colors leading-tight">
                                            {mention.title}
                                        </h3>

                                        {/* Author */}
                                        <p className="text-xs text-gray-500 mb-3 font-mono">
                                            by <span className="text-gray-700 font-medium">{mention.author}</span>
                                        </p>

                                        {/* Description */}
                                        <p className="text-sm text-gray-500 mb-4 leading-relaxed line-clamp-3">
                                            {mention.description}
                                        </p>

                                        {/* Highlight Quote */}
                                        {mention.highlight && (
                                            <div className="border-l-2 border-[var(--color-brand-teal)] pl-4 py-1">
                                                <p className="text-xs italic text-gray-600 leading-relaxed">
                                                    {mention.highlight}
                                                </p>
                                            </div>
                                        )}
                                    </motion.a>
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>

                    {filtered.length === 0 && (
                        <div className="text-center py-16 text-gray-400 font-mono text-xs border border-dashed border-gray-300">
                            NO_SIGNALS_FOUND_FOR_FILTER
                        </div>
                    )}
                </section>

                {/* CTA — Share Your Mention */}
                <section className="border border-dashed border-gray-300 p-8 md:p-12 mb-20">
                    <div className="text-center max-w-2xl mx-auto">
                        <Sparkles className="w-8 h-8 mx-auto mb-6 text-[var(--color-brand-teal)]" />
                        <h2 className="text-3xl md:text-4xl font-serif italic mb-4">
                            Mentioned <span className="not-italic font-bold">Us?</span>
                        </h2>
                        <p className="text-gray-600 text-sm mb-8 max-w-md mx-auto">
                            If you've written about us, made a video, or posted about Open Dev Society — we'd love to feature you here.
                            Send us the link!
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-3">
                            <a
                                href="mailto:opendevsociety@gmail.com?subject=ODS Mention — Feature Request"
                                className="btn-tech text-center"
                            >
                                SEND_YOUR_MENTION →
                            </a>
                            <a
                                href="https://x.com/opendevsociety"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-[11px] uppercase tracking-widest border border-gray-300 px-5 py-2.5 hover:bg-black hover:text-white hover:border-black transition-colors text-center"
                            >
                                TAG_US_ON_X →
                            </a>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
