"use client";

import { useState } from "react";
import { partners, events } from "@/data/partners";
import { ArrowLeft, ArrowUpRight, Handshake, Calendar, Mail, Building2, Users, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function PartnersPage() {
    const [copied, setCopied] = useState(false);

    const copyEmail = () => {
        navigator.clipboard.writeText("opendevsociety@gmail.com");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="px-6 py-20 max-w-5xl mx-auto">

                {/* Header */}
                <header className="mb-20">
                    <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gray-500 hover:text-black transition-colors mb-8">
                        <ArrowLeft className="w-3 h-3" /> Return_Index
                    </Link>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-3 h-3 bg-[var(--color-brand-teal)] rounded-full animate-pulse" />
                        <span className="font-mono text-sm tracking-widest uppercase text-gray-500">System_Alliances // V1.0</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif italic mb-8 leading-[0.9] tracking-tighter">
                        Partners & <span className="not-italic font-bold">Events.</span>
                    </h1>
                    <p className="font-mono text-xs text-gray-500 max-w-md">
                        [ALLIANCE_STATUS: ACTIVE] <br />
                        Strategic partnerships and community events powering the open-source ecosystem.
                    </p>
                </header>

                {/* Partners Section */}
                <section className="mb-20">
                    <div className="flex items-center gap-3 mb-8">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <h2 className="font-mono text-xs uppercase tracking-widest text-gray-500">
                            // ALLIED_SYSTEMS [ACTIVE_PARTNERSHIPS]
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200">
                        {partners.map((partner, index) => (
                            <motion.a
                                key={partner.name}
                                href={partner.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="bg-white p-8 hover:bg-gray-50 transition-all group block"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className="h-14 flex items-center">
                                        {partner.logo ? (
                                            <img src={partner.logo} alt={partner.name} className="h-10 w-auto object-contain" style={partner.invertLogo ? { filter: 'invert(1)' } : undefined} />
                                        ) : (
                                            <Handshake className="w-8 h-8 text-gray-400" />
                                        )}
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-black transition-colors" />
                                </div>
                                <h3 className="text-xl font-bold mb-2 group-hover:text-[var(--color-brand-teal)] transition-colors">{partner.name}</h3>
                                <p className="text-sm text-gray-500 mb-4">{partner.description}</p>
                                <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 bg-gray-100 text-gray-500">
                                    {partner.type === "technology" ? "TECH_PARTNER" : "COMMUNITY_PARTNER"}
                                </span>
                            </motion.a>
                        ))}
                    </div>
                </section>

                {/* Events Section */}
                <section className="mb-20">
                    <div className="flex items-center gap-3 mb-8">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <h2 className="font-mono text-xs uppercase tracking-widest text-gray-500">
                            // EVENT_LOG [COMMUNITY_SUPPORT]
                        </h2>
                    </div>

                    <div className="space-y-px bg-gray-200">
                        {events.map((event, index) => (
                            <motion.div
                                key={event.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="bg-white p-8 flex flex-col md:flex-row md:items-center justify-between gap-4"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 bg-[var(--color-brand-teal)] text-white">
                                            {event.role}
                                        </span>
                                        {event.date && (
                                            <span className="font-mono text-[10px] text-gray-400">{event.date}</span>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-bold mb-1">{event.name}</h3>
                                    <p className="text-xs text-gray-500 mb-1">by <span className="text-gray-700 font-medium">{event.organizer}</span></p>
                                    <p className="text-sm text-gray-500">{event.description}</p>
                                </div>
                                {event.url && event.url !== "#" && (
                                    <a
                                        href={event.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-mono text-xs uppercase tracking-widest border border-gray-300 px-4 py-2 hover:bg-black hover:text-white transition-colors whitespace-nowrap"
                                    >
                                        VIEW_EVENT →
                                    </a>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* CTA Section — Partner With Us */}
                <section id="partner-cta" className="border border-dashed border-gray-300 p-8 md:p-12 mb-20">
                    <div className="text-center max-w-2xl mx-auto">
                        <Sparkles className="w-8 h-8 mx-auto mb-6 text-[var(--color-brand-teal)]" />
                        <h2 className="text-3xl md:text-4xl font-serif italic mb-4">
                            Join the <span className="not-italic font-bold">Alliance.</span>
                        </h2>
                        <p className="text-gray-600 text-sm mb-8 max-w-md mx-auto">
                            We are always looking for like-minded organizations to collaborate with.
                            Whether you are a brand or a community, let us build the future of open source together.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            {/* Brand CTA */}
                            <div className="border border-gray-200 p-6 text-left hover:border-black transition-colors group">
                                <Building2 className="w-5 h-5 mb-3 text-gray-400 group-hover:text-black transition-colors" />
                                <h3 className="font-mono text-xs uppercase tracking-widest mb-2 font-bold">For Brands</h3>
                                <p className="text-xs text-gray-500 mb-4">Partner with us to reach the developer community and support open-source innovation.</p>
                                <a
                                    href="mailto:opendevsociety@gmail.com?subject=Brand Partnership Inquiry"
                                    className="font-mono text-[10px] uppercase tracking-widest border-b border-black pb-0.5 hover:text-[var(--color-brand-teal)] hover:border-[var(--color-brand-teal)] transition-colors"
                                >
                                    INIT_PARTNERSHIP →
                                </a>
                            </div>

                            {/* Community CTA */}
                            <div className="border border-gray-200 p-6 text-left hover:border-black transition-colors group">
                                <Users className="w-5 h-5 mb-3 text-gray-400 group-hover:text-black transition-colors" />
                                <h3 className="font-mono text-xs uppercase tracking-widest mb-2 font-bold">For Communities</h3>
                                <p className="text-xs text-gray-500 mb-4">Make us your community partner for your next open-source event, hackathon, or program.</p>
                                <a
                                    href="mailto:opendevsociety@gmail.com?subject=Community Partnership Inquiry"
                                    className="font-mono text-[10px] uppercase tracking-widest border-b border-black pb-0.5 hover:text-[var(--color-brand-teal)] hover:border-[var(--color-brand-teal)] transition-colors"
                                >
                                    INIT_COMMUNITY_LINK →
                                </a>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-center justify-center gap-3">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <button
                                onClick={copyEmail}
                                className="font-mono text-xs text-gray-500 hover:text-black transition-colors cursor-pointer"
                            >
                                {copied ? "COPIED_TO_CLIPBOARD ✓" : "opendevsociety@gmail.com — CLICK_TO_COPY"}
                            </button>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
