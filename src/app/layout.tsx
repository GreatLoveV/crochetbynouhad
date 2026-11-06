import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";

import { CartProvider } from "@/components/cart/cart-provider";
import { Toaster } from "@/components/ui/sonner";
import { SITE_URL, strings } from "@/lib/constants/strings";

import "./globals.css";

/**
 * Variable fonts, self-hosted by next/font at build time.
 * The CSS variable names must match the ones referenced in globals.css:
 * `--font-sans` (body) and `--font-heading` (all headings).
 */
const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  // Fraunces is a variable font with optical sizing + "wonk" axes; soft low
  // contrast and a little wonk give the warm, hand-made look we want.
  axes: ["SOFT", "WONK", "opsz"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${strings.siteName} — ${strings.tagline}`,
    template: `%s | ${strings.siteName}`,
  },
  description: strings.hero.body,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_MA",
    siteName: strings.siteName,
    url: "/",
    title: `${strings.siteName} — ${strings.tagline}`,
    description: strings.hero.body,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${dmSans.variable} ${fraunces.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        {/* Cart lives in the browser: wrap the whole app once, here. */}
        <CartProvider>{children}</CartProvider>
        <Toaster position="top-center" theme="light" />
      </body>
    </html>
  );
}
