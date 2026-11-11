"use client";

import { createContext, useContext, useMemo } from "react";

import { dirOf, localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/fr";

/**
 * Hands the language and its dictionary to client components.
 *
 * Set once in `app/[lang]/layout.tsx`. Client components cannot use
 * `next/root-params`, so they read the language from here instead.
 */
type I18nValue = {
  lang: Locale;
  dir: "ltr" | "rtl";
  t: Dictionary;
  /** `href("/cart")` → `/ar/cart` on an Arabic page. */
  href: (path: string) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({
  lang,
  dictionary,
  children,
}: {
  lang: Locale;
  dictionary: Dictionary;
  children: React.ReactNode;
}) {
  const value = useMemo(
    () => ({
      lang,
      dir: dirOf(lang),
      t: dictionary,
      href: (path: string) => localePath(lang, path),
    }),
    [lang, dictionary],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside <I18nProvider>");
  return value;
}
