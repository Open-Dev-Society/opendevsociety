import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Contributor avatars, in their real colours. Served straight from GitHub's CDN, already sized 2× via ?s=
  // (Avatar.tsx), so no optimizer is needed on Cloudflare (its Images binding is a metered add-on).
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "github.com" },
    ],
  },
  // Brief §8: /partners folded into Word of mouth; /love (the wall of love) lives there too.
  async redirects() {
    return [
      { source: "/partners", destination: "/word-of-mouth#partners", permanent: true },
      { source: "/love", destination: "/word-of-mouth", permanent: true },
    ];
  },
};

export default nextConfig;
