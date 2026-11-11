import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Contributor avatars, in their real colours.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "github.com" },
    ],
  },
  // Brief §8: /partners folded into Word of mouth.
  async redirects() {
    return [{ source: "/partners", destination: "/word-of-mouth#partners", permanent: true }];
  },
};

export default nextConfig;
