import type { MetadataRoute } from "next";

import { getActiveProductSlugs } from "@/lib/data/products";
import { localePath, locales } from "@/i18n/config";
import { SITE_URL } from "@/lib/constants/strings";

/**
 * Every page Google should know about, in French and in Arabic.
 *
 * Built from the live catalogue, so a piece added in the admin shows up without
 * touching this file. Deactivated pieces disappear on their own because
 * `getActiveProductSlugs` only returns what is visible in the shop.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getActiveProductSlugs();
  const now = new Date();

  // Every page exists in both languages; each entry lists its twin so search
  // engines can show the right one (`<xhtml:link rel="alternate" hreflang>`).
  const entry = (
    path: string,
    changeFrequency: "weekly" | "yearly",
    priority: number,
  ): MetadataRoute.Sitemap =>
    locales.map((lang) => ({
      url: `${SITE_URL}${localePath(lang, path)}`,
      lastModified: now,
      changeFrequency,
      priority,
      alternates: {
        languages: Object.fromEntries(
          locales.map((other) => [other, `${SITE_URL}${localePath(other, path)}`]),
        ),
      },
    }));

  return [
    ...entry("/", "weekly", 1),
    ...entry("/conditions", "yearly", 0.2),
    ...entry("/confidentialite", "yearly", 0.2),
    ...slugs.flatMap((slug) => entry(`/products/${slug}`, "weekly", 0.8)),
  ];
}
