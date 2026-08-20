import type { NextConfig } from "next";

/**
 * SECURITY HEADERS
 * =============================================================================
 * This site belongs to a security researcher and will be scanned by peers, so
 * the headers are part of the portfolio rather than an afterthought.
 *
 * Everything below is ENFORCED. The Content-Security-Policy is the exception:
 * it ships in Report-Only mode from src/middleware.ts. See the note there for
 * why, and for the one-line change that enforces it.
 */
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    // Razorpay runs in its own iframe and needs payment; nothing else is used.
    value:
      "camera=(), microphone=(), geolocation=(), interest-cohort=(), usb=(), payment=(self)",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-DNS-Prefetch-Control", value: "off" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/.well-known/security.txt",
        headers: [{ key: "Content-Type", value: "text/plain; charset=utf-8" }],
      },
      {
        // Never let a search engine or a cache hold on to admin responses.
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "no-store, max-age=0" },
        ],
      },
    ];
  },
};

export default nextConfig;
