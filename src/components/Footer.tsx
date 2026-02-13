import Link from "next/link";

export const Footer = () => {
    return (
        <footer className="border-t border-dashed border-gray-300">
            {/* Main Footer Grid */}
            <div className="px-8 py-12 grid grid-cols-2 md:grid-cols-5 gap-15">
                {/* Brand */}
                <div className="col-span-2 md:col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                        <img src="/logo.png" alt="ODS Logo" className="w-9 h-9" />
                        <span className="font-mono text-md font-bold tracking-wider">OPEN DEV SOCIETY</span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4">
                        A society of open initiatives — building the future of open source, one commit at a time.
                    </p>
                    <a
                        href="mailto:opendevsociety@gmail.com"
                        className="font-mono text-xs text-gray-400 hover:text-black transition-colors"
                    >
                        opendevsociety@gmail.com
                    </a>
                </div>

                {/* Navigate */}
                <div>
                    <h4 className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-4">// Navigate</h4>
                    <ul className="space-y-1.5">
                        <li><Link href="/" className="text-sm text-gray-600 hover:text-[var(--color-brand-teal)] hover:underline transition-colors">Home</Link></li>
                        <li><Link href="/manifesto" className="text-sm text-gray-600 hover:text-[var(--color-brand-teal)] hover:underline transition-colors">Manifesto</Link></li>
                        <li><Link href="/projects" className="text-sm text-gray-600 hover:text-[var(--color-brand-teal)] hover:underline transition-colors">Projects</Link></li>
                        <li><Link href="/contributors" className="text-sm text-gray-600 hover:text-[var(--color-brand-teal)] hover:underline transition-colors">Contributors</Link></li>
                        <li><Link href="/contribute" className="text-sm text-gray-600 hover:text-[var(--color-brand-teal)] hover:underline transition-colors">Contribute</Link></li>
                        <li><Link href="/partners" className="text-sm text-gray-600 hover:text-[var(--color-brand-teal)] hover:underline transition-colors">Partners & Events</Link></li>
                    </ul>
                </div>

                {/* Community */}
                <div>
                    <h4 className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-4">// Community</h4>
                    <ul className="space-y-1.5">
                        <li><a href="https://github.com/Open-Dev-Society" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-[var(--color-brand-teal)] hover:underline transition-colors">GitHub ↗</a></li>
                        <li><a href="#" className="text-sm text-gray-600 hover:text-[var(--color-brand-teal)] hover:underline transition-colors">LinkedIn ↗</a></li>
                        <li><a href="#" className="text-sm text-gray-600 hover:text-[var(--color-brand-teal)] hover:underline transition-colors">Twitter / X ↗</a></li>
                        <li><a href="#" className="text-sm text-gray-600 hover:text-[var(--color-brand-teal)] hover:underline transition-colors">Discord ↗</a></li>
                    </ul>
                </div>

                {/* Partner */}
                <div>
                    <h4 className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-4">// Partner</h4>
                    <ul className="space-y-1.5">
                        <li><Link href="/partners#partner-cta" className="text-sm text-gray-600 hover:text-[var(--color-brand-teal)] hover:underline transition-colors">For Brands</Link></li>
                        <li><Link href="/partners#partner-cta" className="text-sm text-gray-600 hover:text-[var(--color-brand-teal)] hover:underline transition-colors">For Communities</Link></li>
                        <li><a href="mailto:opendevsociety@gmail.com?subject=Partnership Inquiry" className="text-sm text-gray-600 hover:text-[var(--color-brand-teal)] hover:underline transition-colors">Contact Us</a></li>
                    </ul>
                </div>
            </div>

            {/* Big 3D Text */}
            <div className="px-8 py-10 border-t border-dashed border-gray-200 overflow-hidden">
                <h2
                    className="text-4xl md:text-5xl lg:text-7xl uppercase text-center leading-none tracking-tighter select-none text-gray-600"
                    style={{
                        fontFamily: 'var(--font-rock3d)',
                    }}
                >
                    OPEN DEV SOCIETY
                </h2>
            </div>
            {/* Bottom Bar */}
            <div className="px-8 py-4 border-t border-dashed border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-2">
                <span className="font-mono text-xs text-gray-400">
                    © {new Date().getFullYear()} OPEN_DEV_SOCIETY — ALL_RIGHTS_OPEN
                </span>
                <span className="font-mono text-xs text-gray-400">
                    BUILT_WITH [ NEXT.JS + OPEN_SOURCE ]
                </span>
            </div>
        </footer>
    );
};
