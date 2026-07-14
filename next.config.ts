import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@dindin/design-system"],
  experimental: {
    externalDir: true,
  },
  basePath: "/transactions",
};

export default nextConfig;
