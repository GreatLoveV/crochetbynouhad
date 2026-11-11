import { Markazi_Text, Readex_Pro } from "next/font/google";

/**
 * « Le fil » uses two families in both languages, each drawn for Latin and
 * Arabic together, so a French word inside Arabic (or the reverse) never
 * changes style:
 *
 * - Readex Pro: the interface (body, buttons, prices, forms). `--font-sans`.
 * - Markazi Text: the voice (brand, headings, product names). `--font-heading`.
 *
 * Both are variable fonts, self-hosted by next/font at build time. Each is
 * declared once per language so a page only lists the subsets it reads:
 * French gets `latin` + `latin-ext` (œ, accents, « », ’) and is preloaded;
 * Arabic gets `arabic` + `latin` (brand name, "MAD", digits) and is not, since
 * the shared layout module would otherwise preload Arabic files on French
 * pages. Per-language preloading is tuned in the audit phase.
 */

const readexFr = Readex_Pro({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const markaziFr = Markazi_Text({
  variable: "--font-heading",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const readexAr = Readex_Pro({
  variable: "--font-sans",
  subsets: ["arabic", "latin"],
  display: "swap",
  preload: false,
});

const markaziAr = Markazi_Text({
  variable: "--font-heading",
  subsets: ["arabic", "latin"],
  display: "swap",
  preload: false,
});

export const fontClasses = {
  fr: `${readexFr.variable} ${markaziFr.variable}`,
  ar: `${readexAr.variable} ${markaziAr.variable}`,
} as const;
