import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Brief §8: /partners folded into Word of mouth.
  async redirects() {
    return [{ source: "/partners", destination: "/word-of-mouth#partners", permanent: true }];
  },
};

export default nextConfig;
