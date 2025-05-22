import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  images: {
    unoptimized: true,
  },
  distDir: "out",
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
