"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { partners, events } from "@/data/partners";
import {
    ArrowUpRight,
    FileText,
    Package,
    Users,
    Heart,
    Handshake,
    Github,
    MessageCircle,
    Megaphone,
    CalendarDays,
} from "lucide-react";

const quickLinks = [
    { label: "Manifesto", href: "/manifesto", icon: FileText },
    { label: "Projects", href: "/projects", icon: Package },
    { label: "Contributors", href: "/contributors", icon: Users },
    { label: "Contribute", href: "/contribute", icon: Heart },
    { label: "Partners", href: "/partners", icon: Handshake },
    { label: "Love", href: "/word-of-mouth", icon: Heart },
];

const socialLinks = [
    { label: "GitHub", href: "https://github.com/Open-Dev-Society", icon: Github },
    { label: "Discord", href: "https://discord.gg/9xywA3pj", icon: MessageCircle },
    {
        label: "LinkedIn",
        href: "https://www.linkedin.com/company/opendevsociety-in/",
        icon: ArrowUpRight,
    },
    { label: "Twitter / X", href: "https://x.com/opendevsociety", icon: ArrowUpRight },
];

const announcements = [
    { text: "JWOC 2026 — Community Partner", type: "event" as const },
    { text: "Apretre 3.0 — Community Partner", type: "event" as const },
    { text: "New: StellAILoom Partnership", type: "partner" as const },
];

export const SidebarPanels = () => {
    return (
        <>
            {/* ─── LEFT SIDEBAR ─── */}
            <motion.aside
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="fixed left-[max(0.75rem,calc((100vw-64rem)/2-12rem))] top-24 z-30 hidden xl:flex flex-col gap-6 w-40"
            >
                {/* Quick Links */}
                <div>
                    <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-3 flex items-center gap-1.5">
                        <span className="w-1 h-1 bg-[var(--color-brand-teal)] rounded-full" />
                        Navigate
                    </h4>
                    <ul className="space-y-1.5">
                        {quickLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className="flex items-center gap-1.5 text-xs font-mono text-gray-400 hover:text-[var(--color-brand-teal)] transition-colors group"
                                >
                                    <link.icon className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                                    <span className="uppercase tracking-wider">{link.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Divider */}
                <div className="w-full h-px border-t border-dashed border-gray-200" />

                {/* Social / External */}
                <div>
                    <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-3 flex items-center gap-1.5">
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        Community
                    </h4>
                    <ul className="space-y-1.5">
                        {socialLinks.map((link) => (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-xs font-mono text-gray-400 hover:text-black transition-colors group"
                                >
                                    <link.icon className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                                    <span className="uppercase tracking-wider">{link.label}</span>
                                    <ArrowUpRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-60 transition-opacity" />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </motion.aside>

            {/* ─── RIGHT SIDEBAR ─── */}
            <motion.aside
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="fixed right-[max(0.75rem,calc((100vw-64rem)/2-12rem))] top-24 z-30 hidden xl:flex flex-col gap-6 w-40"
            >
                {/* Partner Logos — Trust Strip */}
                <div>
                    <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-3 flex items-center gap-1.5">
                        <span className="w-1 h-1 bg-[var(--color-brand-teal)] rounded-full" />
                        Partners
                    </h4>
                    <div className="space-y-3">
                        {partners.map((partner) => (
                            <a
                                key={partner.name}
                                href={partner.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 p-2 border border-dashed border-gray-200 hover:border-[var(--color-brand-teal)] transition-colors group rounded-sm bg-white/60"
                            >
                                <img
                                    src={partner.logo}
                                    alt={partner.name}
                                    className="h-9 w-auto object-contain"
                                    style={partner.invertLogo ? { filter: "invert(1)" } : undefined}
                                />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px border-t border-dashed border-gray-200" />

                {/* Announcements / Updates */}
                <div>
                    <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-3 flex items-center gap-1.5">
                        <Megaphone className="w-3 h-3" />
                        Updates
                    </h4>
                    <ul className="space-y-2">
                        {announcements.map((item, i) => (
                            <li
                                key={i}
                                className="flex items-start gap-1.5 text-xs font-mono text-gray-500 leading-tight"
                            >
                                <span
                                    className={`mt-[3px] w-1 h-1 rounded-full shrink-0 ${item.type === "event"
                                        ? "bg-[var(--color-brand-teal)]"
                                        : "bg-[var(--color-brand-rose)]"
                                        }`}
                                />
                                <span className="uppercase tracking-wider">{item.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Divider */}
                <div className="w-full h-px border-t border-dashed border-gray-200" />

                {/* Upcoming Events */}
                <div>
                    <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-3 flex items-center gap-1.5">
                        <CalendarDays className="w-3 h-3" />
                        Events
                    </h4>
                    <ul className="space-y-2">
                        {events.slice(0, 3).map((event) => (
                            <li key={event.name} className="group">
                                <Link
                                    href="/partners"
                                    className="block text-xs font-mono text-gray-500 hover:text-[var(--color-brand-teal)] transition-colors leading-tight"
                                >
                                    <span className="uppercase tracking-wider block">{event.name}</span>
                                    <span className="text-[10px] text-gray-400 tracking-wider">
                                        {event.role} • {event.date}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </motion.aside>
        </>
    );
};
