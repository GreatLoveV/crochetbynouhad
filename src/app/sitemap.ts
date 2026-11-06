import type { MetadataRoute } from "next";

import { getActiveProductSlugs } from "@/lib/data/products";
import { SITE_URL } from "@/lib/constants/strings";

/**
 * Every page Google should know about.
 *
 * Built from the live catalogue, so a piece added in the admin shows up without
 * touching this file. Deactivated pieces disappear on their own because
 * `getActiveProductSlugs` only returns what is visible in the shop.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getActiveProductSlugs();
  const now = new Date();

  const pages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${SITE_URL}/conditions`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${SITE_URL}/confidentialite`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    ...slugs.map((slug) => ({
      url: `${SITE_URL}/products/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];

  return pages;
}