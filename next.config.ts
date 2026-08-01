import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Firebase App Hosting deploys the Next.js server bundle to Cloud Run.
  // Generate the standalone artifact consumed by its framework adapter.
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
