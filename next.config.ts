import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // Static export for Electron
  distDir: ".next",
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true, // Makes URLs work better with file:// protocol
  // Skip TypeScript type-checking errors during production build (keeps dev safety)
  typescript: {
    ignoreBuildErrors: true,
  },
  // Also skip ESLint errors during `next build`
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
