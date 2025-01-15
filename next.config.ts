import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  ignoreDuringBuilds: true,
  ignoreBuildErrors: true,
  typescript: {
    ignoreBuildErrors: true,
  },

};

export default nextConfig;
