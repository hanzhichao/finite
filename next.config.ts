import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
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
