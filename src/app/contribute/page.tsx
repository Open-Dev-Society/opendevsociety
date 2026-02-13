import Link from "next/link";
import { ArrowLeft, Code2, PenTool, GraduationCap, Mic, Calendar, Globe, Bug, Terminal, CheckCircle2, Heart } from "lucide-react";
import { main } from "framer-motion/client";

export default function ContributePage() {
    return (
        <div className="px-6 py-20">

            {/* Header */}
            <header className="mb-20">
                <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gray-500 hover:text-black transition-colors mb-8">
                    <ArrowLeft className="w-3 h-3" /> Return_Index
                </Link>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 bg-black rounded-full" />
                    <span className="font-mono text-sm tracking-widest uppercase">Operations_Manual // V1.0</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-serif italic leading-[0.9] tracking-tighter mb-8">
                    Contribution <br />
                    <span className="not-italic font-bold">Guidelines.</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl leading-relaxed mb-8">
                    Welcome to Open Dev Society! We're building a vibrant community where everyone can contribute—not just developers. Whether you write code, create content, teach, or organize events, you belong here.
                </p>

                {/* TOC Widget */}
                <div className="p-6 bg-gray-50 border border-dashed border-gray-300 inline-block">
                    <h3 className="font-mono text-xs font-bold uppercase mb-4">Table_of_Contents</h3>
                    <ul className="space-y-2 text-sm font-mono text-gray-600">
                        <li><a href="#ways" className="hover:text-black hover:underline decoration-dashed">01. Ways_to_Contribute</a></li>
                        <li><a href="#getting-started" className="hover:text-black hover:underline decoration-dashed">02. Getting_Started</a></li>
                        <li><a href="#values" className="hover:text-black hover:underline decoration-dashed">03. Core_Values</a></li>
                        <li><a href="#recognition" className="hover:text-black hover:underline decoration-dashed">04. Recognition_Protocol</a></li>
                    </ul>
                </div>
            </header>

            <div className="prose prose-lg max-w-none prose-headings:font-serif prose-p:text-gray-600 prose-p:leading-relaxed">

                {/* 01 Ways to Contribute */}
                <section id="ways" className="mb-24">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-gray-400 mb-8 block border-b border-gray-200 pb-2">// 01_OPERATIONAL_ROLES</span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Code */}
                        <div id="code" className="p-8 border border-dashed border-gray-300 hover:bg-gray-50 transition-colors group">
                            <div className="flex items-center gap-3 mb-4">
                                <Code2 className="w-6 h-6" />
                                <h3 className="text-xl font-bold m-0 font-mono uppercase">Code Ops</h3>
                            </div>
                            <p className="text-sm mb-4">For: Developers, Engineers, Innovators.</p>
                            <ul className="list-disc pl-5 text-sm space-y-1 mb-6">
                                <li>Fix bugs or implement features.</li>
                                <li>Review Pull Requests.</li>
                                <li>Improve performance & security.</li>
                            </ul>
                            <a href="https://github.com/Open-Dev-Society" className="text-xs font-mono underline decoration-dashed group-hover:decoration-[var(--color-brand-rose)] group-hover:text-[var(--color-brand-rose)] group-hover:decoration-solid">ACCESS_REPOS -&gt;</a>
                        </div>

                        {/* Content */}
                        <div id="content" className="p-8 border border-dashed border-gray-300 hover:bg-gray-50 transition-colors group">
                            <div className="flex items-center gap-3 mb-4">
                                <PenTool className="w-6 h-6" />
                                <h3 className="text-xl font-bold m-0 font-mono uppercase">Content Ops</h3>
                            </div>
                            <p className="text-sm mb-4">For: Writers, Editors, Documentarians.</p>
                            <ul className="list-disc pl-5 text-sm space-y-1 mb-6">
                                <li>Write documentation & tutorials.</li>
                                <li>Create guides and blog posts.</li>
                                <li>Proofread existing content.</li>
                            </ul>
                            <a href="#" className="text-xs font-mono underline decoration-dashed group-hover:decoration-[var(--color-brand-rose)] group-hover:text-[var(--color-brand-rose)] group-hover:decoration-solid">VIEW_DOCS_REQ -&gt;</a>
                        </div>

                        {/* Education */}
                        <div id="education" className="p-8 border border-dashed border-gray-300 hover:bg-gray-50 transition-colors group">
                            <div className="flex items-center gap-3 mb-4">
                                <GraduationCap className="w-6 h-6" />
                                <h3 className="text-xl font-bold m-0 font-mono uppercase">Education Ops</h3>
                            </div>
                            <p className="text-sm mb-4">For: Educators, Mentors, Trainers.</p>
                            <ul className="list-disc pl-5 text-sm space-y-1 mb-6">
                                <li>Develop course materials.</li>
                                <li>Lead workshops & sessions.</li>
                                <li>Mentor newcomers.</li>
                            </ul>
                            <a href="#" className="text-xs font-mono underline decoration-dashed group-hover:decoration-[var(--color-brand-rose)] group-hover:text-[var(--color-brand-rose)] group-hover:decoration-solid">JOIN_EDU_GROUP -&gt;</a>
                        </div>

                        {/* Media */}
                        <div id="media" className="p-8 border border-dashed border-gray-300 hover:bg-gray-50 transition-colors group">
                            <div className="flex items-center gap-3 mb-4">
                                <Mic className="w-6 h-6" />
                                <h3 className="text-xl font-bold m-0 font-mono uppercase">Media Ops</h3>
                            </div>
                            <p className="text-sm mb-4">For: Podcasters, Designers, Creators.</p>
                            <ul className="list-disc pl-5 text-sm space-y-1 mb-6">
                                <li>Create podcasts & videos.</li>
                                <li>Design logos & graphics.</li>
                                <li>Create social media assets.</li>
                            </ul>
                            <a href="#" className="text-xs font-mono underline decoration-dashed group-hover:decoration-[var(--color-brand-rose)] group-hover:text-[var(--color-brand-rose)] group-hover:decoration-solid">MEDIA_KIT -&gt;</a>
                        </div>

                        {/* Events */}
                        <div id="events" className="p-8 border border-dashed border-gray-300 hover:bg-gray-50 transition-colors group">
                            <div className="flex items-center gap-3 mb-4">
                                <Calendar className="w-6 h-6" />
                                <h3 className="text-xl font-bold m-0 font-mono uppercase">Event Ops</h3>
                            </div>
                            <p className="text-sm mb-4">For: Organizers, Facilitators.</p>
                            <ul className="list-disc pl-5 text-sm space-y-1 mb-6">
                                <li>Organize hackathons & meetups.</li>
                                <li>Facilitate workshops.</li>
                                <li>Moderate community channels.</li>
                            </ul>
                            <a href="#" className="text-xs font-mono underline decoration-dashed group-hover:decoration-[var(--color-brand-rose)] group-hover:text-[var(--color-brand-rose)] group-hover:decoration-solid">EVENT_CALENDAR -&gt;</a>
                        </div>

                        {/* Translation */}
                        <div className="p-8 border border-dashed border-gray-300 hover:bg-gray-50 transition-colors group">
                            <div className="flex items-center gap-3 mb-4">
                                <Globe className="w-6 h-6" />
                                <h3 className="text-xl font-bold m-0 font-mono uppercase">Global Ops</h3>
                            </div>
                            <p className="text-sm mb-4">For: Translators, Polyglots.</p>
                            <ul className="list-disc pl-5 text-sm space-y-1 mb-6">
                                <li>Translate docs & sites.</li>
                                <li>Localize UI elements.</li>
                                <li>Adapt content for culture.</li>
                            </ul>
                            <a href="#" className="text-xs font-mono underline decoration-dashed group-hover:decoration-[var(--color-brand-rose)] group-hover:text-[var(--color-brand-rose)] group-hover:decoration-solid">TRANSLATE_NOW -&gt;</a>
                        </div>

                    </div>
                </section>

                {/* 02 Getting Started */}
                <section id="getting-started" className="mb-24">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 block border-b border-gray-200 pb-2">// 02_INITIALIZATION_SEQUENCE</span>

                    <div className="bg-black text-white p-8 rounded-sm font-mono text-sm shadow-2xl overflow-x-auto">
                        <div className="flex gap-2 mb-6 border-b border-white/20 pb-4">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                        </div>

                        <div className="space-y-6">
                            <div>
                                <span className="text-[var(--color-brand-teal)]">$</span> <span className="text-[var(--color-brand-rose)]">init_sequence</span> --step=1
                                <p className="mt-2 text-gray-400"># Explore Our Projects</p>
                                <p className="ml-4">&gt; Visit GitHub: OpenStock, OpenReadme, BookTrace...</p>
                            </div>

                            <div>
                                <span className="text-[var(--color-brand-teal)]">$</span> <span className="text-[var(--color-brand-rose)]">connect_network</span> --step=2
                                <p className="mt-2 text-gray-400"># Join Community</p>
                                <p className="ml-4">&gt; Discord: [LINK_PENDING]</p>
                                <p className="ml-4">&gt; Email: opendevsociety@gmail.com</p>
                            </div>

                            <div>
                                <span className="text-[var(--color-brand-teal)]">$</span> <span className="text-[var(--color-brand-rose)]">find_task</span> --step=3
                                <p className="mt-2 text-gray-400"># Look for labels:</p>
                                <ul className="ml-4 list-none">
                                    <li>- "good first issue" (Newcomers)</li>
                                    <li>- "help wanted" (Expertise)</li>
                                    <li>- "documentation" (Writers)</li>
                                </ul>
                            </div>

                            <div>
                                <span className="text-[var(--color-brand-teal)]">$</span> <span className="text-[var(--color-brand-rose)]">execute_commit</span> --step=4
                                <p className="mt-2 text-gray-400"># Submit Work</p>
                                <p className="ml-4">&gt; Code: Pull Request</p>
                                <p className="ml-4">&gt; Creative: Share via channels</p>
                            </div>

                            <div className="animate-pulse">
                                <span className="text-[var(--color-brand-teal)]">$</span> <span className="inline-block w-2 h-4 bg-[var(--color-brand-teal)] align-middle" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* 03 Values */}
                <section id="values" className="mb-24">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 block border-b border-gray-200 pb-2">// 03_CORE_VALUES</span>
                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            "Open & Transparent",
                            "Inclusive & Welcoming",
                            "Free & Accessible",
                            "Community-Driven",
                            "Quality & Impact",
                            "Respectful & Collaborative"
                        ].map((val, i) => (
                            <div key={i} className="flex items-center gap-3 p-4 border border-dashed border-gray-300">
                                <CheckCircle2 className="w-5 h-5 text-[var(--color-brand-teal)]" />
                                <span className="font-bold">{val}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-6 bg-gray-50 border-l-4 border-black">
                        <h4 className="font-bold mb-2 flex items-center gap-2"><Heart className="w-4 h-4" /> Code of Conduct</h4>
                        <p className="text-sm">
                            All contributors must follow our Code of Conduct. Be respectful, welcoming, and report violations to opendevsociety@gmail.com.
                        </p>
                    </div>
                </section>

                {/* 04 Recognition */}
                <section id="recognition" className="mb-24">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 block border-b border-gray-200 pb-2">// 04_RECOGNITION_PROTOCOL</span>
                    <p className="mb-6">We believe in celebrating contributions!</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="p-4 border border-dashed border-gray-300">
                            <span className="block text-2xl mb-2">📜</span>
                            <span className="text-xs font-bold uppercase">Public Credits</span>
                        </div>
                        <div className="p-4 border border-dashed border-gray-300">
                            <span className="block text-2xl mb-2">📣</span>
                            <span className="text-xs font-bold uppercase">Social Shoutouts</span>
                        </div>
                        <div className="p-4 border border-dashed border-gray-300">
                            <span className="block text-2xl mb-2">🏅</span>
                            <span className="text-xs font-bold uppercase">Badges</span>
                        </div>
                        <div className="p-4 border border-dashed border-gray-300">
                            <span className="block text-2xl mb-2">👕</span>
                            <span className="text-xs font-bold uppercase">Swag / Merch</span>
                        </div>
                    </div>
                </section>

                {/* 05 FAQ */}
                <section className="mb-24">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 block border-b border-gray-200 pb-2">// 05_SUPPORT_LOG</span>
                    <div className="space-y-6">
                        <div>
                            <h4 className="font-bold flex items-center gap-2"><Terminal className="w-4 h-4" /> General Questions?</h4>
                            <p className="text-sm pl-6">Open a GitHub Discussion or ask in Discord.</p>
                        </div>
                        <div>
                            <h4 className="font-bold flex items-center gap-2"><Bug className="w-4 h-4" /> Found a bug?</h4>
                            <p className="text-sm pl-6">Open an issue with the label 'bug' on the relevant repository.</p>
                        </div>
                    </div>
                </section>

            </div>

            {/* Footer */}
            <footer className="mt-20 pt-10 border-t border-dashed border-gray-300 text-center font-mono text-xs text-gray-500">
                <p className="mb-4">OPEN_DEV_SOCIETY // OPERATION_HANDBOOK_V1</p>
                <div className="flex justify-center gap-4 mb-4">
                    <Link href="/manifesto" className="underline decoration-dashed hover:decoration-solid">READ_MANIFESTO</Link>
                    <a href="https://github.com/Open-Dev-Society" className="underline decoration-dashed hover:decoration-solid">GITHUB</a>
                </div>
                <p>"Let's build the future together, openly."</p>
            </footer>
        </div>
    )
}
