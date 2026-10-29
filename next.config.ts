import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker builds set BUILD_STANDALONE=1 to get a self-contained server (.next/standalone);
  // plain `npm run build` + `next start` (PM2) is unchanged.
  output: process.env.BUILD_STANDALONE === "1" ? "standalone" : undefined,

  // The code reads data/ and uploads at runtime, which makes Next's file tracer copy them
  // into the build. Never ship the database, secrets or uploaded files inside the build/image.
  outputFileTracingExcludes: {
    "*": ["data/**", "data.*/**", "public/uploads/**"],
  },
};

export default nextConfig;
