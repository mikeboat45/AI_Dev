import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the Turbopack root to this app to avoid picking the workspace root
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
