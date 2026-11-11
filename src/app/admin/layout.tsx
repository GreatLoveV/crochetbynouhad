import type { Metadata, Viewport } from "next";

import { fontClasses } from "@/app/fonts";
import { SITE_URL, strings } from "@/lib/constants/strings";

import "../globals.css";

/**
 * Root layout of the admin, the login page included.
 *
 * A root layout of its own (the shop's lives in `app/[lang]`), so the admin
 * has no language prefix and stays in French: it is for Nouhad only. Products
 * are still edited in both languages, see `components/admin/product-form.tsx`.
 *
 * Belt and braces next to `/robots`: even if a crawler somehow reaches
 * `/admin`, the `noindex` travels in the page head rather than relying on the
 * crawl rules alone.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: strings.admin.title, template: `%s | ${strings.siteName}` },
  robots: { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = {
  themeColor: "#fbfaf8",
  colorScheme: "light",
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="fr" dir="ltr" className={`${fontClasses.fr} h-full`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
