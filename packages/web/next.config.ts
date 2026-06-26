import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@cinp/api"],
  /* config options here */
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
