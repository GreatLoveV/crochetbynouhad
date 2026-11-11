"use client";

import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { useI18n } from "@/i18n/client";
import {
  LOCALE_COOKIE,
  localeName,
  otherLocale,
  switchLocalePath,
  type Locale,
} from "@/i18n/config";
import { cn } from "cn";

/**
 * "العربية" on French pages, "Français" on Arabic ones: the same page in the
 * other language, with its query string (a category filter) kept.
 *
 * Written in its own language and marked with `lang`/`hreflang`, so screen
 * readers pronounce it correctly. No flags: a flag is a country, not a
 * language. Picking a language also remembers it, so `/` sends the visitor
 * back to it next time (see `src/proxy.ts`).
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  return (
    // `useSearchParams` would otherwise opt every static page out of
    // pre-rendering. The fallback is the same link without the query.
    <Suspense fallback={<SwitcherLink className={className} search="" />}>
      <SwitcherWithSearch className={className} />
    </Suspense>
  );
}

function SwitcherWithSearch({ className }: { className?: string }) {
  const search = useSearchParams().toString();
  return <SwitcherLink className={className} search={search ? `?${search}` : ""} />;
}

function SwitcherLink({ className, search }: { className?: string; search: string }) {
  const { lang } = useI18n();
  const pathname = usePathname();
  const target: Locale = otherLocale(lang);

  return (
    <a
      href={`${switchLocalePath(pathname, target)}${search}`}
      lang={target}
      hrefLang={target}
      onClick={() => {
        document.cookie = `${LOCALE_COOKIE}=${target}; path=/; max-age=31536000; samesite=lax`;
      }}
      className={cn(
        "inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm text-foreground/80 transition-colors duration-300 ease-soft hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none",
        className,
      )}
    >
      {localeName[target]}
    </a>
  );
}
