import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Security: Disable powered-by header
  poweredByHeader: false,

  // Security: Configure image optimization
  images: {
    domains: [],
    remotePatterns: [],
    unoptimized: true,
  },

  // Security: Add headers for static assets
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  // Security: Configure CORS for API routes
  async rewrites() {
    return [];
  },
};
};

export default nextConfig;

// Force redeploy - Vercel build fix
