import Link from "next/link";
import { ArrowLeft, Terminal, Shield, Globe, BookOpen, Code2, Users, Heart, Mic, Newspaper, Calendar } from "lucide-react";

export default function ManifestoPage() {
    return (
        <div className="px-6 py-20">

            {/* Header */}
            <header className="mb-20">
                <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gray-500 hover:text-black transition-colors mb-8">
                    <ArrowLeft className="w-3 h-3" /> Return_Index
                </Link>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 bg-black rounded-full" />
                    <span className="font-mono text-sm tracking-widest uppercase">Start_Protocol // V1.0</span>
                </div>
                <h1 className="text-6xl md:text-8xl font-serif italic leading-[0.9] tracking-tighter mb-8">
                    The Open Dev <br />
                    <span className="not-italic font-bold">Society Manifesto.</span>
                </h1>
                <p className="font-mono text-xs text-gray-500 max-w-md">
                    [DOC_ID: ODS-2024-M] <br />
                    [CLASSIFICATION: PUBLIC] <br />
                    [AUTHOR: Ravi Pratap Singh]
                </p>
            </header>

            <div className="prose prose-lg max-w-none prose-headings:font-serif prose-p:text-gray-600 prose-p:leading-relaxed">

                {/* 01 Core Belief */}
                <section className="mb-24 border-l-2 border-[var(--color-brand-teal)] pl-8 py-2">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-black mb-4 block">// 01_CORE_BELIEF</span>
                    <p className="text-xl md:text-2xl font-serif italic text-black leading-tight mb-8">
                        "We live in a world where knowledge is hidden behind paywalls. Where tools are locked in subscriptions. Where newcomers are told they're not 'good enough'."
                    </p>
                    <p>
                        We believe there's a better way. Technology should belong to everyone. Knowledge should be open, free, and accessible. Communities should welcome newcomers with trust, not gatekeeping.
                    </p>
                </section>

                {/* 02 Mission */}
                <section className="mb-24">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 block border-b border-gray-200 pb-2">// 02_MISSION_STATEMENT</span>
                    <h2 className="text-4xl font-serif mb-6">Empowerment through Openness</h2>
                    <p>
                        We exist to build free, open-source projects, educational resources, and community experiences that make a real difference.
                    </p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 list-none pl-0 mt-8">
                        {[
                            "Tools without subscription barriers.",
                            "Knowledge platforms free forever.",
                            "Education without paywalls.",
                            "Guidance, not judgment.",
                            "Resources running on trust.",
                            "Events that connect and inspire."
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3 border border-dashed border-gray-300 p-4">
                                <span className="w-1.5 h-1.5 bg-[var(--color-brand-teal)] rounded-full mt-2" />
                                <span className="text-sm">{item}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* 03 Promise */}
                <section className="mb-24 bg-gray-50 p-10 border border-dashed border-gray-300">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-black mb-4 block">// 03_THE_PROMISE</span>
                    <div className="flex flex-col gap-4">
                        <p className="text-lg font-bold">We will never lock knowledge.</p>
                        <p className="text-lg font-bold">We will never charge for access.</p>
                        <p className="text-lg font-bold">We will never trade trust for money.</p>
                        <p className="text-sm text-gray-500 font-mono mt-4">Running on transparency, donations, and community strength.</p>
                    </div>
                </section>

                {/* 04 Differentiation */}
                <section className="mb-24">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 block border-b border-gray-200 pb-2">// 04_DIFFERENTIATION</span>
                    <h2 className="text-3xl font-serif mb-8">Platform, Not Gatekeeper.</h2>
                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-[var(--color-brand-teal)]" /> Ownership</h3>
                            <p className="text-sm">You retain full credit. Your work remains yours to showcase on your resume. You keep decision-making power.</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Globe className="w-5 h-5 text-[var(--color-brand-teal)]" /> The Ecosystem</h3>
                            <p className="text-sm">We provide contributors, visibility, and support. We amplify impact without taking credit.</p>
                        </div>
                    </div>
                    <div className="mt-8 p-4 font-mono text-sm text-center border-t border-b border-gray-200">
                        "Your project. Your vision. Our community. Our support."
                    </div>
                </section>

                {/* 05 Ecosystem */}
                <section className="mb-24">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 block border-b border-gray-200 pb-2">// 05_ECOSYSTEM_ARCHITECTURE</span>
                    <div className="grid grid-cols-1 gap-8">
                        {[
                            { icon: Code2, title: "OpenDev Tools", desc: "Simple utilities. (OpenStock, OpenReadme)" },
                            { icon: BookOpen, title: "OpenDev Library", desc: "Gateway to free books. (BookTrace)" },
                            { icon: Users, title: "OpenDev Learn", desc: "Roadmaps and mentorship." },
                            { icon: Terminal, title: "OpenDev Education", desc: "Free courses and workshops." },
                            { icon: Mic, title: "OpenDev Media", desc: "Podcasts and tutorials." },
                            { icon: Calendar, title: "OpenDev Events", desc: "Hackathons and conferences." },
                            { icon: Newspaper, title: "OpenDev News", desc: "Unbiased information." },
                            { icon: Heart, title: "OpenDev Community", desc: "Home for contributors." }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4 items-start group">
                                <div className="p-3 bg-gray-100 rounded-none group-hover:bg-[var(--color-brand-teal)] group-hover:text-white transition-colors">
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{item.title}</h3>
                                    <p className="text-sm text-gray-600">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 06 Connect */}
                <section className="mb-24">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 block border-b border-gray-200 pb-2">// 06_CONNECTIVITY</span>
                    <p className="text-lg font-serif italic mb-8">
                        "Knowledge isn't just code—it's conversation, collaboration, and connection."
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-6 border border-dashed border-gray-300">
                            <h4 className="font-bold font-mono text-xs uppercase mb-2">Build Together</h4>
                            <p className="text-sm">Hackathons and conferences where collaboration sparks innovation.</p>
                        </div>
                        <div className="p-6 border border-dashed border-gray-300">
                            <h4 className="font-bold font-mono text-xs uppercase mb-2">Learn Together</h4>
                            <p className="text-sm">Mentorship where everyone teaches and learns.</p>
                        </div>
                    </div>
                </section>

                {/* 07 The Call */}
                <section className="mb-24 py-12 border-y border-black text-center">
                    <h2 className="text-4xl font-serif mb-6">You Belong Here.</h2>
                    <p className="max-w-xl mx-auto text-gray-600 mb-8">
                        If you've ever felt you didn't belong. If you've ever struggled to find free resources. Join us. Build with us. Grow with us.
                    </p>
                    <div className="flex justify-center gap-4">
                        <a href="https://github.com/Open-Dev-Society" className="btn-tech">GITHUB</a>
                        <a href="https://www.linkedin.com/company/opendevsociety-in/" className="inline-flex items-center gap-2 px-6 py-2 border border-black text-xs font-mono uppercase hover:bg-[var(--color-brand-teal)] hover:border-[var(--color-brand-teal)] hover:text-white transition-colors">LINKEDIN</a>
                        <a href="https://x.com/opendevsociety" className="inline-flex items-center gap-2 px-6 py-2 border border-black text-xs font-mono uppercase hover:bg-[var(--color-brand-teal)] hover:border-[var(--color-brand-teal)] hover:text-white transition-colors">TWITTER / X</a>
                        <a href="https://discord.gg/9xywA3pj" className="inline-flex items-center gap-2 px-6 py-2 border border-black text-xs font-mono uppercase hover:bg-[var(--color-brand-teal)] hover:border-[var(--color-brand-teal)] hover:text-white transition-colors">DISCORD</a>
                        <a href="mailto:opendevsociety@gmail.com" className="inline-flex items-center gap-2 px-6 py-2 border border-black text-xs font-mono uppercase hover:bg-[var(--color-brand-teal)] hover:border-[var(--color-brand-teal)] hover:text-white transition-colors">EMAIL</a>
                    </div>
                </section>

                {/* 08 FAQ */}
                <section className="mb-24">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 block border-b border-gray-200 pb-2">// 08_FAQ_LOG</span>
                    <div className="space-y-8">
                        <div>
                            <h3 className="font-bold mb-2">Can I showcase projects as my own work?</h3>
                            <p className="text-sm text-gray-600">Absolutely. You retain full credit. ODS exists to support your growth, not claim your achievements.</p>
                        </div>
                        <div>
                            <h3 className="font-bold mb-2">Do I lose ownership rights?</h3>
                            <p className="text-sm text-gray-600">No. ODS is a platform, not a company claiming IP.</p>
                        </div>
                        <div>
                            <h3 className="font-bold mb-2">Can I leave or take my project back?</h3>
                            <p className="text-sm text-gray-600">Yes. If you ever want to move your project out, we support that using a no-lock-in policy.</p>
                        </div>
                    </div>
                </section>

            </div>

            {/* Footer */}
            <footer className="mt-20 pt-10 border-t border-dashed border-gray-300 text-center font-mono text-xs text-gray-500">
                <p className="mb-4">OPEN_DEV_SOCIETY // MANIFESTO_PROTOCOL_V1</p>
                <p>"Because when knowledge is free, innovation is limitless."</p>
            </footer>
        </div>

    );
}
