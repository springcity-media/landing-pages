import type { NextConfig } from "next";
import { getEnvironmentConfig } from "./src/config/environment";

// Validate configuration during both `next dev` startup and production builds.
getEnvironmentConfig();

const nextConfig: NextConfig = {
  // Firebase Hosting preview channels serve the generated static application.
  output: "export",
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
