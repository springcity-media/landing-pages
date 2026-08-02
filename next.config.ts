import type { NextConfig } from "next";
import { getEnvironmentConfig } from "./src/config/environment";

// Validate configuration during both `next dev` startup and production builds.
getEnvironmentConfig();

const staticExport = process.env.FIREBASE_STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  // Classic Hosting preview channels serve a static export. Firebase App
  // Hosting production builds require the standalone server bundle consumed by
  // its Next.js adapter.
  output: staticExport ? "export" : "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
