import type { Metadata } from "next";
import Link from "next/link";

import { fontClasses } from "@/app/fonts";
import { strings } from "@/lib/constants/strings";

import "./globals.css";

/**
 * Last-resort 404 for URLs that reach no root layout at all (the shop's lives
 * in `app/[lang]`, the admin's in `app/admin`). Almost nothing lands here: the
 * proxy sends every path without a language to `/fr/...`, and unknown shop
 * paths get the shop's own 404. So it stays minimal, in both languages.
 */
export const metadata: Metadata = {
  title: `404 | ${strings.siteName}`,
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="fr" dir="ltr" className={`${fontClasses} h-full`}>
      <body className="flex min-h-full flex-col items-center justify-center gap-6 px-5 text-center">
        <p className="font-heading text-7xl text-the">404</p>
        <h1 className="text-2xl">Cette page n&apos;existe pas</h1>
        <p lang="ar" dir="rtl" className="text-xl">
          هذه الصفحة غير موجودة
        </p>
        <p className="flex gap-6">
          <Link href="/fr" className="underline underline-offset-4">
            Accueil
          </Link>
          <Link href="/ar" lang="ar" className="underline underline-offset-4">
            الصفحة الرئيسية
          </Link>
        </p>
      </body>
    </html>
  );
}
