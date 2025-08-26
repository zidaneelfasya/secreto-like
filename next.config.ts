import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Enable experimental features for better IP detection
  experimental: {
    serverComponentsExternalPackages: [],
  },
  // Headers configuration for better client IP detection
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'X-Forwarded-For',
            value: ':forwarded-for',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
