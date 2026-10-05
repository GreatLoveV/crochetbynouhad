import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Loaded with Node's `require` instead of being bundled: the Neon serverless
  // driver and its WebSocket dependency (`ws`) rely on Node built-ins that the
  // bundler would otherwise trip over.
  serverExternalPackages: ["@neondatabase/serverless", "ws"],
  images: {
    // Product photos are added in the admin as plain links, so they can come from
    // any host. Only these two get Next's image optimisation; anything else is
    // rendered `unoptimized` (see `isOptimizableImageUrl` in `src/lib/images.ts`),
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
};

export default nextConfig;
