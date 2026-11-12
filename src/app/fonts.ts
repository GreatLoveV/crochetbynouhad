import { Markazi_Text, Readex_Pro } from "next/font/google";

/**
 * « Le fil » uses two families in both languages, each drawn for Latin and
 * Arabic together, so a French word inside Arabic (or the reverse) never
 * changes style:
 *
 * - Readex Pro: the interface (body, buttons, prices, forms). `--font-sans`.
 * - Markazi Text: the voice (brand, headings, product names). `--font-heading`.
 *
 * Both are variable fonts, self-hosted by next/font at build time.
 *
 * One declaration per family, for both languages. next/font always writes an
 * @font-face for every subset of the family (Arabic, Latin, Latin Extended…),
 * each with its `unicode-range`, so the browser only downloads the files whose
 * characters a page actually uses. `subsets` only decides what is *preloaded*:
 *
 * - `latin` is preloaded everywhere: French text, and on Arabic pages the
 *   brand, the prices and "MAD", which are all in the header and first screen.
 * - `arabic` is not preloaded: a preload is per layout, and the shared
 *   `[lang]` layout would then fetch it on every French page too. Arabic pages
 *   fetch it as soon as the CSS meets Arabic text, with `swap` meanwhile.
 *
 * (Declaring the fonts once per language, as Phase 5 did, gave the same CSS
 * twice and made Arabic pages preload French files they never used.)
 */

const readex = Readex_Pro({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const markazi = Markazi_Text({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

export const fontClasses = `${readex.variable} ${markazi.variable}`;
