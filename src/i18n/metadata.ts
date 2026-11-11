import type { Metadata } from "next";

import { defaultLocale, localePath, locales, ogLocale, type Locale } from "@/i18n/config";

/**
 * Canonical URL plus `hreflang` alternates for a page that exists in both
 * languages. `path` is the page without its language: `/`, `/products/sac`.
 * Relative URLs resolve against `metadataBase` in the root layout.
 *
 * `x-default` points at French, the language a visitor gets when their
 * browser asks for neither.
 */
export function alternatesFor(lang: Locale, path: string): Metadata["alternates"] {
  return {
    canonical: localePath(lang, path),
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, localePath(l, path)])),
      "x-default": localePath(defaultLocale, path),
    },
  };
}

/**
 * Open Graph for a page in both languages. A page that sets `openGraph`
 * replaces the layout's instead of merging with it, so the locale and site
 * name are carried here; without this the page shares the home page's URL.
 */
export function openGraphFor(
  lang: Locale,
  path: string,
  { siteName, title, description }: { siteName: string; title: string; description: string },
): Metadata["openGraph"] {
  return {
    type: "website",
    locale: ogLocale[lang],
    alternateLocale: locales.filter((l) => l !== lang).map((l) => ogLocale[l]),
    siteName,
    url: localePath(lang, path),
    title,
    description,
  };
}
