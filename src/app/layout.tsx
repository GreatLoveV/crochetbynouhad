import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import { CartProvider } from "@/components/cart/cart-provider";
import { Toaster } from "@/components/ui/sonner";
import { SITE_URL, strings } from "@/lib/constants/strings";

import "./globals.css";

/**
 * Variable fonts, self-hosted by next/font at build time.
 * The CSS variable names must match the ones referenced in globals.css:
 * `--font-sans` (body) and `--font-heading` (all headings).
 */
/** Body: Manrope, a clean geometric sans that stays legible at small sizes. */
const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Headings: Cormorant Garamond, the "Velvet" display serif. Not a variable
 * font, so the weights are listed; italic is kept for the occasional accent.
 * `latin` covers every French accent.
 */
const cormorant = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

/** Colours the phone's browser bar to match the aubergine ground. */
export const viewport: Viewport = {
  themeColor: "#140b12",
  colorScheme: "dark",
};

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
      className={`${manrope.variable} ${cormorant.variable} dark h-full`}
    >
      <body className="flex min-h-full flex-col">
        {/* Cart lives in the browser: wrap the whole app once, here. */}
        <CartProvider>{children}</CartProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
