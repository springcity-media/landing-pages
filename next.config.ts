import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Firebase Hosting serves the generated `out` directory without a Node.js
  // runtime. Keep pages compatible with static generation.
  output: "export",
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
