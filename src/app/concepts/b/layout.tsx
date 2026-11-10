import type { Metadata } from "next";
import { Instrument_Serif, Inter_Tight } from "next/font/google";

const serif = Instrument_Serif({ weight: "400", style: ["normal", "italic"], subsets: ["latin"], variable: "--font-b-serif" });
const grotesk = Inter_Tight({ subsets: ["latin"], variable: "--font-b-sans" });

export const metadata: Metadata = {
  title: "Open Dev Society — Technology should belong to everyone",
  description: "A society of developers, designers and writers building free, open-source public goods. No paywalls. No gatekeeping.",
};

// Concept-local styles: palette, type families, and the one-time hero entrance.
const css = `
.concept-b { --paper: #f3efe6; --ink: #141311; --muted: #6b665d; --rule: #141311; --signal: #e3412b; }
.concept-b { font-family: var(--font-b-sans), system-ui, sans-serif; }
.concept-b .serif { font-family: var(--font-b-serif), Georgia, serif; font-weight: 400; }
.concept-b .mono { font-family: var(--font-mono), ui-monospace, monospace; }
.concept-b h1, .concept-b h2, .concept-b h3 { text-wrap: balance; }
.concept-b p { text-wrap: pretty; }
.concept-b section[id] { scroll-margin-top: 4.5rem; }
.concept-b ::selection { background: var(--signal); color: var(--paper); }
@keyframes b-rise { from { opacity: 0; transform: translateY(0.35em); filter: blur(6px); } to { opacity: 1; transform: none; filter: none; } }
.concept-b .rise { animation: b-rise 0.9s cubic-bezier(0.2, 0, 0, 1) both; }
@media (prefers-reduced-motion: reduce) { .concept-b .rise { animation: none; } }
`;

export default function ConceptBLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`concept-b ${serif.variable} ${grotesk.variable} relative min-h-screen overflow-x-clip bg-(--paper) text-(--ink)`}>
      <style>{css}</style>
      {children}
    </div>
  );
}
