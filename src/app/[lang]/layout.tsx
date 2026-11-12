import type { Metadata, Viewport } from "next";

import { fontClasses } from "@/app/fonts";
import { CartProvider } from "@/components/cart/cart-provider";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Toaster } from "@/components/ui/sonner";
import { dirOf, locales, ogLocale } from "@/i18n/config";
import { I18nProvider } from "@/i18n/client";
import { alternatesFor } from "@/i18n/metadata";
import { getDictionary, getLang } from "@/i18n/server";
import { SITE_URL } from "@/lib/constants/strings";

import "../globals.css";

/**
 * Root layout of the public shop, once per language: `/fr/...` and `/ar/...`.
 *
 * `<html lang dir>` comes from the URL, so an Arabic page is right-to-left
 * from the very first byte. The admin has its own root layout
 * (`app/admin/layout.tsx`), which is why there is no `app/layout.tsx`.
 */
export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/** Colours the phone's browser bar to match the Coton ground. */
export const viewport: Viewport = {
  themeColor: "#fbfaf8",
  colorScheme: "light",
};

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const t = await getDictionary();
  const title = `${t.siteName} — ${t.tagline}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s | ${t.siteName}` },
    description: t.meta.description,
    alternates: alternatesFor(lang, "/"),
    openGraph: {
      type: "website",
      locale: ogLocale[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => ogLocale[l]),
      siteName: t.siteName,
      url: `/${lang}`,
      title,
      description: t.meta.description,
    },
  };
}

export default async function LocaleLayout({ children }: LayoutProps<"/[lang]">) {
  const lang = await getLang();
  const dictionary = await getDictionary();
  const dir = dirOf(lang);

  return (
    <html lang={lang} dir={dir} className={`${fontClasses} h-full`}>
      <body className="flex min-h-full flex-col">
        <I18nProvider lang={lang} dictionary={dictionary}>
          {/* Cart lives in the browser: wrap the whole shop once, here. */}
          <CartProvider>
            {/* First stop for the keyboard: past the header, straight to the page. */}
            <a
              href="#contenu"
              className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:inset-s-3 focus-visible:z-50 focus-visible:bg-encre focus-visible:px-4 focus-visible:py-3 focus-visible:text-coton"
            >
              {dictionary.common.skipToContent}
            </a>
            <SiteHeader />
            {/* tabIndex lets the skip link move focus here; no ring on a whole page. */}
            <main id="contenu" tabIndex={-1} className="flex-1 focus:outline-none">
              {children}
            </main>
            <SiteFooter />
          </CartProvider>
          <Toaster position="top-center" dir={dir} />
        </I18nProvider>
      </body>
    </html>
  );
}
