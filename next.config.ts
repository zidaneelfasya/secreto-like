import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // External packages for server components
  serverExternalPackages: [],
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
