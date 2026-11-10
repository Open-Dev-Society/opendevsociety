"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { sections } from "./sections";


export function Nav() {
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-(--line-2) bg-(--paper)/80 backdrop-blur-md backdrop-saturate-150">
      <nav className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2.5 rounded-md" onClick={() => setOpen(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" width={24} height={24} className="size-6 rounded-md" />
          <span className="display text-[15px] font-semibold">Open Dev Society</span>
        </a>

        <ul className="ml-auto hidden items-center md:flex">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={`relative block rounded-full px-3.5 py-1.5 text-sm transition-colors duration-150 ${
                  active === s.id ? "text-(--ink)" : "text-(--ink-2) hover:text-(--ink)"
                }`}
              >
                {active === s.id && (
                  <motion.span
                    layoutId="c-nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-(--card) shadow-(--sh)"
                    transition={{ type: "spring", duration: 0.35, bounce: 0 }}
                  />
                )}
                {s.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="https://github.com/Open-Dev-Society"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto hidden items-center gap-1 rounded-full bg-(--ink) px-3.5 py-1.5 text-sm font-medium text-(--paper) transition-[background-color,scale] duration-150 hover:bg-black active:scale-[0.96] sm:inline-flex md:ml-2"
        >
          GitHub <ArrowUpRight className="size-3.5" strokeWidth={2} />
        </a>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="c-mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="-mr-2 ml-auto grid size-11 place-items-center rounded-full text-(--ink) sm:ml-0 md:hidden"
        >
          {open ? <X className="size-5" strokeWidth={1.75} /> : <Menu className="size-5" strokeWidth={1.75} />}
        </button>
      </nav>

      {open && (
        <div id="c-mobile-nav" className="border-t border-(--line-2) px-4 pb-4 md:hidden">
          <ul className="divide-y divide-(--line-2)">
            {sections.map((s) => (
              <li key={s.id} className="flex items-center justify-between">
                <a href={`#${s.id}`} onClick={() => setOpen(false)} className="flex-1 py-3 text-[15px] font-medium">
                  {s.label}
                </a>
                <a href={s.route} className="py-3 pl-4 font-mono text-[11px] text-(--ink-3)">
                  {s.route} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
