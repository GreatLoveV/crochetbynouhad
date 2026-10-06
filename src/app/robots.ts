import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/strings";

/**
 * Keeps search engines out of everything that is not a public page.
 *
 * The admin area and the checkout flow must never be indexed: the admin holds
 * customer data, and the checkout/order pages are per-session and worthless to
 * a crawler. Products, on the other hand, are the whole point, so the sitemap
 * is advertised here.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", "/cart", "/checkout", "/order/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}