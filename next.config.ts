import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Static export for Electron
  distDir: ".next",
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true, // Makes URLs work better with file:// protocol
};

export default nextConfig;
