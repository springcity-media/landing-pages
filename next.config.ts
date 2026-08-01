import type { NextConfig } from "next";
import { getEnvironmentConfig } from "./src/config/environment";

// Validate configuration during both `next dev` startup and production builds.
getEnvironmentConfig();

const nextConfig: NextConfig = {
  // Firebase App Hosting deploys the Next.js server bundle to Cloud Run.
  // Generate the standalone artifact consumed by its framework adapter.
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
