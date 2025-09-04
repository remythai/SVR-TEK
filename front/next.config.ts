import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.jeb-incubator.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
