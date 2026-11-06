import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Loaded with Node's `require` instead of being bundled: the Neon serverless
  // driver and its WebSocket dependency (`ws`) rely on Node built-ins that the
  // bundler would otherwise trip over.
  serverExternalPackages: ["@neondatabase/serverless", "ws"],
  images: {
    // Product photos are added in the admin as plain links, so they can come from
    // any host. Only these two get Next's image optimisation; anything else is
    // rendered `unoptimized` (see `isOptimizableImageUrl` in `src/lib/constants/images.ts`),
    // which is why an unknown host shows the photo instead of a broken image.
    //
    // Keep this list and `OPTIMIZABLE_IMAGE_HOSTS` in step.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  /**
   * The shop handles names, phone numbers and addresses, so the browser is told
   * not to leak or speculate about any of it.
   *
   * `frame-ancestors 'none'` also stops the admin being wrapped in a clickjacking
   * frame; CSP is deliberately left out because a full policy tends to break
   * Next's inline bootstrap scripts and needs tuning per deployment.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
