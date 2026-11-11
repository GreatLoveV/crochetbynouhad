import type { Metadata } from "next";

import { defaultLocale, localePath, locales, type Locale } from "@/i18n/config";

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
