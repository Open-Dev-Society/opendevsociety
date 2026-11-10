"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Activity,
  Star,
  Users,
  Cpu,
  Package,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const SOCIETY_FOUNDED = new Date("2024-07-01T00:00:00Z");
const SCRAMBLE_GLYPHS = "!<>-_\\/[]{}—=+*^?#";

function useTypewriter(text: string, speedMs = 28, delay = 250) {
  const [out, setOut] = useState("");
  useEffect(() => {
    let cancelled = false;
    let i = 0;
    const tick = () => {
      if (cancelled) return;
      i++;
      setOut(text.slice(0, i));
      if (i < text.length) setTimeout(tick, speedMs);
    };
    const id = setTimeout(tick, delay);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [text, speedMs, delay]);
  return out;
}

function useScramble(text: string, durationMs = 1100, delay = 250) {
  const [out, setOut] = useState(() =>
    Array.from(text, (c) => (c === " " ? " " : "_")).join("")
  );
  useEffect(() => {
    let cancelled = false;
    let frame = 0;
    const totalFrames = Math.max(8, Math.ceil(durationMs / 60));
    const start = setTimeout(() => {
      const id = setInterval(() => {
        if (cancelled) {
          clearInterval(id);
          return;
        }
        frame++;
        const progress = frame / totalFrames;
        const N = text.length;
        const result = Array.from(text, (c, idx) => {
          if (c === " ") return " ";
          const charProgress = progress - (idx / N) * 0.5;
          if (charProgress >= 1) return c;
          if (charProgress <= 0)
            return SCRAMBLE_GLYPHS[
              Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)
            ];
          return Math.random() < charProgress
            ? c
            : SCRAMBLE_GLYPHS[
                Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)
              ];
        }).join("");
        setOut(result);
        if (frame >= totalFrames) {
          setOut(text);
          clearInterval(id);
        }
      }, 60);
    }, delay);
    return () => {
      cancelled = true;
      clearTimeout(start);
    };
  }, [text, durationMs, delay]);
  return out;
}

function useUptimeTicker() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  if (!now) return null;
  const yearSeconds = 365.25 * 24 * 3600;
  const totalSeconds = Math.floor(
    (now.getTime() - SOCIETY_FOUNDED.getTime()) / 1000
  );
  const years = Math.floor(totalSeconds / yearSeconds);
  let rem = totalSeconds - years * yearSeconds;
  const days = Math.floor(rem / (24 * 3600));
  rem -= days * 24 * 3600;
  const hours = Math.floor(rem / 3600);
  rem -= hours * 3600;
  const mins = Math.floor(rem / 60);
  const secs = Math.floor(rem - mins * 60);
  return { years, days, hours, mins, secs };
}

function useHeartbeat() {
  const [iso, setIso] = useState<string | null>(null);
  useEffect(() => {
    const tick = () =>
      setIso(new Date().toISOString().slice(0, 19).replace("T", " "));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return iso;
}

interface HeroSectionProps {
  repos: number;
  stars: number;
}

export function HeroSection({ repos, stars }: HeroSectionProps) {
  const monoLabel = useTypewriter("EST. 2024 // GLOBAL_COLLECTIVE");
  const headlineMain = useScramble("The Operating System", 1100, 250);
  const headlineSub = useScramble("for Open Source.", 900, 850);
  const uptime = useUptimeTicker();
  const heartbeat = useHeartbeat();

  return (
    <section className="relative px-8 pt-32 pb-20 border-b border-dashed border-gray-300 overflow-hidden">
      {/* Soft blur accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gray-50 rounded-full blur-3xl -z-10 opacity-50 pointer-events-none" />
      <div className="absolute -top-12 -left-12 w-[300px] h-[300px] bg-teal-50 rounded-full blur-3xl -z-10 opacity-40 pointer-events-none" />

      {/* Oversized typographic accent — pale serif braces as background drama */}
      <div
        aria-hidden
        className="absolute -left-20 top-1/2 -translate-y-1/2 text-[22rem] md:text-[30rem] font-serif italic text-gray-100/90 leading-none select-none pointer-events-none -z-10"
      >
        {"{"}
      </div>
      <div
        aria-hidden
        className="absolute -right-24 bottom-0 translate-y-1/4 text-[16rem] md:text-[22rem] font-serif italic text-gray-100/70 leading-none select-none pointer-events-none -z-10"
      >
        {"}"}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10 lg:gap-10 items-start">
        {/* Left column */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-6 min-h-[18px]">
            <span className="w-2 h-2 bg-[var(--color-brand-teal)] rounded-full animate-pulse-slow"></span>
            <span className="text-mono whitespace-nowrap overflow-hidden">
              {monoLabel}
              <span className="inline-block w-[2px] h-[10px] bg-[var(--color-brand-teal)] ml-1 align-middle animate-pulse" />
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif italic mb-8 leading-[0.9] tracking-tighter">
            <span className="block">{headlineMain}</span>
            <span className="not-italic font-bold block">{headlineSub}</span>
          </h1>

          <p className="text-lg md:text-xl font-sans text-gray-600 max-w-lg mb-10 leading-relaxed">
            We are a decentralized society of developers, designers, and writers
            building public goods.{" "}
            <strong className="text-black">
              No paywalls. No gatekeeping. Just code.
            </strong>
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href="https://github.com/Open-Dev-Society"
              target="_blank"
              className="btn-tech group text-center"
            >
              <span className="flex items-center justify-center gap-2">
                [ START_CONTRIBUTING ]{" "}
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              href="/manifesto"
              className="flex items-center justify-center gap-2 px-6 py-2 font-mono text-xs uppercase tracking-widest hover:bg-gray-100 transition-colors"
            >
              [ READ_MANIFESTO ]
            </Link>
          </div>
        </motion.div>

        {/* Right column — live system status */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
        >
          <div className="border border-dashed border-gray-300 bg-white/85 backdrop-blur-sm shadow-[0_1px_0_rgba(0,0,0,0.02)]">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-dashed border-gray-300 bg-gray-50">
              <div className="flex items-center gap-2">
                <Activity className="w-3 h-3 text-[var(--color-brand-teal)]" />
                <span className="font-mono text-[10px] uppercase tracking-widest font-bold">
                  SYSTEM_STATUS
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[var(--color-brand-teal)] rounded-full animate-pulse" />
                <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--color-brand-teal)]">
                  LIVE
                </span>
              </div>
            </div>

            <StatusRow icon={Cpu} label="KERNEL" value="v0.1.0" mono />
            <StatusRow
              icon={Package}
              label="ACTIVE_REPOS"
              value={repos > 0 ? String(repos) : "..."}
            />
            <StatusRow icon={Users} label="OPERATORS" value="1000+" />
            <StatusRow
              icon={Star}
              label="GITHUB_STARS"
              value={stars > 0 ? `${stars}+` : "..."}
              accent
            />
            <StatusRow
              icon={Clock}
              label="UPTIME"
              value={
                uptime
                  ? `${uptime.years}y ${String(uptime.days).padStart(3, "0")}d ${String(uptime.hours).padStart(2, "0")}:${String(uptime.mins).padStart(2, "0")}:${String(uptime.secs).padStart(2, "0")}`
                  : "calculating..."
              }
              mono
              last
            />
          </div>

          <div className="mt-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-gray-500 flex-wrap">
            <span>// LAST_HEARTBEAT</span>
            <span className="text-[var(--color-brand-teal)] font-bold">
              {heartbeat ? `${heartbeat}Z` : "syncing..."}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface StatusRowProps {
  icon: typeof Activity;
  label: string;
  value: string;
  mono?: boolean;
  accent?: boolean;
  last?: boolean;
}

function StatusRow({
  icon: Icon,
  label,
  value,
  mono,
  accent,
  last,
}: StatusRowProps) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-3 ${
        last ? "" : "border-b border-dashed border-gray-200"
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <Icon className="w-3 h-3 text-gray-400 flex-shrink-0" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500 truncate">
          {label}
        </span>
      </div>
      <span
        className={`${mono ? "font-mono" : "font-bold"} text-sm ${
          accent ? "text-[var(--color-brand-teal)]" : "text-black"
        } ml-3 whitespace-nowrap`}
      >
        {value}
      </span>
    </div>
  );
}
