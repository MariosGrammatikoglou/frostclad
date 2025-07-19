import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizeCss: false, // ✅ Disable Lightning CSS to avoid native module issues
  },
};

export default nextConfig;
