"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { ArrowRight, Close, Discord, GitHub, LinkedIn, Menu, Star, XMark } from "./Icon";
import { cn } from "./cn";
import { LabButton } from "./lab-hero/LabButton";

export type NavLink = { label: string; href: string };

const isActive = (path: string, href: string) => path === href || path.startsWith(`${href}/`);
const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--focus)";
// A title-block cell: full bar height, a hairline on its left.
const cell = "flex h-full shrink-0 items-center border-l border-(--line) px-3.5";

// Iconsax's arrow instead of a text "→" (the mono glyph sits thin and off the grid); it nudges forward on hover.
const arrow = <ArrowRight size={16} className="transition-transform duration-(--d-2) ease-(--ease-ui) group-hover:translate-x-0.5 motion-reduce:transition-none" />;
const marks: Record<string, (p: { size?: number }) => React.ReactNode> = { GitHub, Discord, LinkedIn, X: XMark };

// Home sections that stand for a page: the thumb follows them as you scroll (aria-current="location"; "page" stays for real pages).
const sectionPage: Record<string, string> = { Projects: "/projects", Contributors: "/contributors", "For founders": "/word-of-mouth" };

type Here = { letter: string; name: string };

// The section under the viewport centre, lettered like the rails (Rails.tsx): [data-grid] sections below the home hero, A, B, C…
function sectionHere(): Here | null {
  const hero = document.querySelector("[data-under-nav]");
  const start = hero ? hero.getBoundingClientRect().bottom : -Infinity;
  const refs = [...document.querySelectorAll<HTMLElement>("[data-grid]")].filter((el) => el.getBoundingClientRect().top >= start - 1);
  if (!refs.length) return null;
  let i = 0;
  refs.forEach((el, j) => el.getBoundingClientRect().top <= innerHeight / 2 && (i = j));
  return { letter: String.fromCharCode(65 + i), name: refs[i].dataset.grid ?? "" };
}

/**
 * The site nav as a drawing sheet's title block: hairline-divided cells for the name, the pages (one segmented track, an ink thumb on
 * the current page), a live "you are here" readout of the rails' section letter, the stars and the button. Fixed height (64px).
 * On Home it is fixed (takes no space) and, while the [data-under-nav] hero is in view, folded into the hero's centred brand tab; past
 * the hero, or as soon as keyboard focus enters it, the tab unfolds sideways into the full bar (and folds back on the way up). Elsewhere it is sticky and always shown; it frosts once the page
 * scrolls under it. Below 1024 the links move into a modal sheet (Escape closes it).
 */
export function Nav({
  brand,
  links,
  stars,
  contribute,
  socials,
}: {
  brand: { name: string; logo: string };
  links: NavLink[];
  stars: { label: string; href: string };
  contribute: { label: string; href: string };
  socials: { label: string; href: string }[];
}) {
  const path = usePathname();
  const home = path === "/";
  const [open, setOpen] = useState(false);
  // Home renders hidden from the server (the page loads at the top, over the hero); the observer corrects it from there.
  const [overHero, setOverHero] = useState(true);
  // Keyboard focus (focus-visible only, so a clicked #link doesn't pin it open over the hero) reveals it.
  const [focused, setFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [here, setHere] = useState<Here | null>(null);
  const current = links.find((l) => isActive(path, l.href));
  // Same middle-of-screen rule as the readout, so the thumb and the readout always agree.
  const marked = current ?? (home ? links.find((l) => l.href === sectionPage[here?.name ?? ""]) : undefined);
  const mark = (l: NavLink) => (l === current ? ("page" as const) : l === marked ? ("location" as const) : undefined);

  useEffect(() => {
    const hero = document.querySelector("[data-under-nav]");
    if (!hero) return;
    const io = new IntersectionObserver(([e]) => setOverHero(e.isIntersecting), { rootMargin: "-64px 0px 0px 0px" });
    io.observe(hero);
    return () => io.disconnect();
  }, [path]);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setScrolled(scrollY > 0);
      const h = sectionHere();
      setHere((p) => (p?.letter === h?.letter && p?.name === h?.name ? p : h));
    };
    const onScroll = () => {
      raf ||= requestAnimationFrame(update);
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, [path]);

  // Close the sheet on route change (adjusted during render, no effect) and on Escape.
  const [lastPath, setLastPath] = useState(path);
  if (lastPath !== path) {
    setLastPath(path);
    setOpen(false);
  }
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", onKey);
    // The sheet is modal: the page behind it doesn't scroll.
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open]);

  // Home only: over the hero the bar is folded into the centred tab (the hero's brand plate). Past it, or on keyboard focus, it unfolds.
  const tab = home && overHero && !focused && !open;
  const morph = "transition-[translate,clip-path,opacity] duration-(--d-5) ease-(--ease-in-out) motion-reduce:transition-none!";
  // The cells around the name: gone in the tab, back once the name has nearly landed (it travels over them on the way).
  const fold = cn("transition-opacity duration-(--d-3) ease-(--ease-out) motion-reduce:transition-none!", tab ? "opacity-0" : "delay-[440ms]");

  return (
    <MotionConfig reducedMotion="user">
      <header
        onFocus={(e) => e.target.matches(":focus-visible") && setFocused(true)}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setFocused(false)}
        // --lw: the name cell's fixed width, so the tab's geometry is pure CSS (right on the server's first paint, CLS 0).
        className={cn("@container top-0 z-50 [--lw:13rem]", home ? "fixed inset-x-0" : "sticky", tab && "pointer-events-none")}
      >
        <div
          className={cn(
            "relative shadow-[inset_0_-1px_0_var(--line)]",
            scrolled && !tab ? "bg-(--bg)/85 backdrop-blur-md backdrop-saturate-[1.4]" : "bg-(--bg)",
            home && morph,
            home && (tab ? "[clip-path:inset(0_calc(50%-var(--lw)/2))]" : "[clip-path:inset(0)]"),
          )}
        >
          {home && (
            <>
              {/* The tab's side hairlines; they travel out to the edges with the paper and fade there. */}
              <i aria-hidden className={cn(morph, "absolute inset-y-0 left-1/2 w-px bg-(--line)", tab ? "-translate-x-[calc(var(--lw)/2)]" : "-translate-x-[50cqw] opacity-0")} />
              <i aria-hidden className={cn(morph, "absolute inset-y-0 left-1/2 w-px bg-(--line)", tab ? "translate-x-[calc(var(--lw)/2-1px)]" : "translate-x-[calc(50cqw-1px)] opacity-0")} />
            </>
          )}
          <nav aria-label="Main" className="mx-auto flex h-16 w-full max-w-(--container) items-center px-(--gutter) font-mono text-[13px]">
            <Link
              href="/"
              aria-label={`${brand.name}, home`}
              className={cn(
                focus,
                "pointer-events-auto -ml-5 flex h-12 w-(--lw) shrink-0 items-center gap-3 px-5",
                home && morph,
                // From the gutter to the centre: half the visible container, less the gutter, plus the -ml-5, less half the cell.
                tab && "translate-x-[calc(min(100cqw,var(--container))/2-var(--gutter)+1.25rem-var(--lw)/2)]",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={brand.logo} alt="" width={28} height={28} className="size-7" />
              <span className="flex flex-col gap-1 leading-none whitespace-nowrap">
                <span className="font-sans text-[18px] font-[800] tracking-[-0.01em] text-(--fg) [font-stretch:75%]">{brand.name}</span>
                <span className="text-[10px] tracking-[0.04em] text-(--fg-subtle)">free, open source</span>
              </span>
            </Link>

            <div className={cn(cell, fold, "hidden lg:flex")}>
              <ul className="flex h-11 shadow-[inset_0_0_0_1px_var(--line)]">
                {links.map((l) => {
                  const active = l === marked;
                  return (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        aria-current={mark(l)}
                        className={cn(
                          focus,
                          "relative flex h-11 items-center px-2.5 whitespace-nowrap transition-colors duration-(--d-2)",
                          active ? "text-(--bg)" : "text-(--fg-muted) hover:text-(--fg)",
                        )}
                      >
                        {/* Slides between links (layoutId); fades in where there was none (@starting-style). */}
                        {active && (
                          <motion.span
                            layoutId="site-nav-thumb"
                            aria-hidden
                            className="absolute inset-1 bg-(--fg) transition-opacity duration-(--d-2) starting:opacity-0 motion-reduce:transition-none"
                            transition={{ type: "spring", duration: 0.35, bounce: 0 }}
                          />
                        )}
                        <span className="relative">{l.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* You are here: the rails' letter for the section at the viewport centre, or the page's name. */}
            <div aria-hidden className={cn(cell, fold, "hidden min-w-0 flex-1 flex-col items-start justify-center gap-1 md:flex lg:hidden xl:flex")}>
              <span className="flex items-center gap-1.5 text-[10px] tracking-[0.04em] whitespace-nowrap text-(--fg-subtle)">
                <i className="size-1.5 bg-(--mark)" />
                you are here
              </span>
              <span className="flex max-w-full min-w-0 items-center gap-1.5 text-[11px] leading-none text-(--fg)">
                {here?.letter && (
                  <span className="grid size-4 shrink-0 place-items-center text-[10px] shadow-[inset_0_0_0_1px_var(--fg-subtle)]">{here.letter}</span>
                )}
                <span className="truncate">{here?.name || current?.label || "Home"}</span>
              </span>
            </div>
            <span className="flex-1 md:hidden lg:block xl:hidden" />

            <a
              href={stars.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${stars.label} stars on GitHub`}
              className={cn(focus, cell, fold, "group hidden gap-2 text-(--fg) tabular-nums hover:bg-(--surface-2) xl:flex")}
            >
              <GitHub size={16} />
              {stars.label}
              <Star size={14} className="-ml-0.5 text-(--fg-subtle) transition-colors duration-(--d-2) group-hover:text-(--accent)" />
            </a>

            {/* Below 640 the wordmark needs the room; the sheet carries the button. */}
            <div className={cn(cell, fold, "pr-0 max-sm:hidden")}>
              <LabButton href={contribute.href} size="md" className="group" aria-current={isActive(path, contribute.href) ? "page" : undefined}>
                {contribute.label}
                {arrow}
              </LabButton>
            </div>

            <div className={cn(cell, fold, "-mr-2.5 pr-0 pl-1.5 lg:hidden")}>
              <button
                type="button"
                aria-expanded={open}
                aria-controls="site-sheet"
                aria-label={open ? "Close menu" : "Open menu"}
                onClick={() => setOpen((v) => !v)}
                className={cn(focus, "grid size-11 place-items-center text-(--fg)")}
              >
                {open ? <Close size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Outside <header>: its backdrop-filter would make it the containing block for this fixed sheet. */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="site-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] } }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.18, ease: [0.2, 0, 0, 1] } }}
            className="fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col overflow-y-auto bg-(--bg) px-(--gutter) pb-8 pt-4 lg:hidden"
          >
            <ul className="flex flex-col font-mono">
              {links.map((l, i) => (
                <li key={l.href} className="border-b border-(--line)">
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    aria-current={mark(l)}
                    className={cn(focus, "flex items-baseline gap-4 py-4 text-[22px] text-(--fg) aria-[current]:text-(--accent)")}
                  >
                    <span aria-hidden className="text-[12px] text-(--fg-subtle) tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {l.label}
                    {l === marked && (
                      <span aria-hidden className="ml-auto flex items-center gap-1.5 self-center text-[11px] text-(--fg-subtle)">
                        <i className="size-1.5 bg-(--mark)" />
                        you are here
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
            {/* Stars and socials as a ruled grid of cells, like the bar. */}
            <div className="mt-8 grid grid-cols-2 gap-px bg-(--line) font-mono text-[13px] text-(--fg-muted) shadow-[0_0_0_1px_var(--line)]">
              <a
                href={stars.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(focus, "col-span-2 flex min-h-12 items-center gap-2 bg-(--bg) px-4 tabular-nums text-(--fg)")}
              >
                <Star size={16} className="text-(--accent)" />
                {stars.label}
                <span className="text-(--fg-muted)">stars on GitHub</span>
              </a>
              {socials.map((s) => {
                const Mark = marks[s.label];
                return (
                  <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className={cn(focus, "flex min-h-12 items-center gap-2 bg-(--bg) px-4 hover:text-(--fg)")}>
                    {Mark && <Mark size={16} />}
                    {s.label}
                  </a>
                );
              })}
            </div>
            <LabButton href={contribute.href} onClick={() => setOpen(false)} className="group mt-auto w-full">
              {contribute.label}
              {arrow}
            </LabButton>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
