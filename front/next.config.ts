import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['images.unsplash.com'],
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
