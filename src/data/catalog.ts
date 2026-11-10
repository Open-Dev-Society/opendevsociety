// How each repo is presented on the site (brief §9). Taglines are ours, ≤ 56 chars, faithful to each README.
// Repos missing here are hidden from public lists.

export type Audience = "everyone" | "builders";
export type CatalogEntry = {
  tagline: string;
  audience: Audience;
  /** path under /public, captured by scripts/capture-shots.mjs */
  shot?: string;
  featured?: boolean;
  badge?: string;
};

export const catalog: Record<string, CatalogEntry> = {
  OpenStock: { tagline: "Market prices, alerts and company data. Free.", audience: "everyone", shot: "/shots/openstock-desktop.jpg" },
  kitbash: { tagline: "Tells your agent what already exists on GitHub.", audience: "builders", featured: true },
  "kine-ui": { tagline: "Gesture and spatial interfaces, no black box.", audience: "builders", shot: "/shots/kine-ui.jpg", featured: true },
  openreadme: { tagline: "Auto-updating bento banners for your profile.", audience: "builders", shot: "/shots/openreadme.jpg", featured: true },
  booktrace: { tagline: "Find free, verified copies of books.", audience: "everyone" },
  opencosmos: { tagline: "Live space data: ISS tracking and charts.", audience: "everyone" },
  openhaven: { tagline: "Share and discover code snippets.", audience: "builders" },
  openmind: { tagline: "Research that reasons instead of listing links.", audience: "everyone" },
  OpenCine: { tagline: "Trending and popular films, in one place.", audience: "everyone" },
  den: { tagline: "Your Mac in one app.", audience: "builders", badge: "alpha" },
  ports: { tagline: "See which dev servers are running, and their cost.", audience: "builders" },
  ByteMyCV: { tagline: "Resume analysis with ATS scoring.", audience: "everyone" },
  zomb: { tagline: "A health check for AI-written codebases.", audience: "builders" },
  tearcopy: { tagline: "Copied text tears off like a strip of paper.", audience: "builders" },
  "settle-ui": { tagline: "Optimistic UI animations for React.", audience: "builders" },
};

// GitHub's language colours: the only chroma besides the logo teal and rose (brief §4).
export const languageColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Swift: "#f05138",
  Python: "#3572a5",
};
