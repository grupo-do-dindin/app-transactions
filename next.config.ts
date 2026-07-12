import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@dindin/design-system"],
  experimental: {
    externalDir: true,
  },
};

export default nextConfig;
