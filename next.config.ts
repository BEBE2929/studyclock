import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/studyclock",
  images: { unoptimized: true },
};

export default nextConfig;
