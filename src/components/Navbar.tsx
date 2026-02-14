"use client";

import Link from "next/link";
import { Github, Menu, X, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-dashed border-gray-300">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center">
            <img src="/logo.png" alt="Logo" />
          </div>
          <Link href="/" className="text-md font-bold tracking-widest uppercase font-mono">
            Open Dev Society
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8 font-mono text-sm">
          <Link href="/manifesto" className="text-gray-500 hover:text-[var(--color-brand-teal)] uppercase tracking-wider transition-colors">[ Manifesto ]</Link>
          <Link href="/partners" className="text-gray-500 hover:text-[var(--color-brand-teal)] uppercase tracking-wider transition-colors">[ Partners ]</Link>
          <Link href="/word-of-mouth" className="text-gray-500 hover:text-[var(--color-brand-teal)] uppercase tracking-wider transition-colors">[ Love ]</Link>

          <a href="https://github.com/Open-Dev-Society" target="_blank" className="flex items-center gap-1 text-black hover:text-[var(--color-brand-teal)] uppercase tracking-wider transition-colors">
            <span>GitHub</span> <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-black">
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 w-full bg-white border-b border-dashed border-gray-300 p-8 flex flex-col gap-6 z-40"
          >
            <Link href="/manifesto" onClick={() => setIsOpen(false)} className="text-xl font-serif italic">Manifesto</Link>
            <Link href="/partners" onClick={() => setIsOpen(false)} className="text-xl font-serif italic">Partners</Link>
            <Link href="/word-of-mouth" onClick={() => setIsOpen(false)} className="text-xl font-serif italic">Love</Link>
            <div className="h-px w-full bg-gray-100" />
            <a href="https://github.com/Open-Dev-Society" className="text-mono text-sm uppercase flex items-center gap-2">
              <Github className="w-4 h-4" /> GitHub
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
