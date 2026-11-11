import {
  Cormorant_Garamond,
  Manrope,
  Markazi_Text,
  Readex_Pro,
} from "next/font/google";

/**
 * Variable fonts, self-hosted by next/font at build time.
 *
 * Each language sets the same two CSS variables, read by globals.css:
 * `--font-sans` (body and UI) and `--font-heading` (headings).
 *
 * French: Manrope + Cormorant Garamond. Arabic: Readex Pro + Markazi Text,
 * which carry real Arabic letterforms (Latin fonts would fall back to whatever
 * the phone has). The design-system phase replaces the French pair too.
 */

/** Body: Manrope, a clean geometric sans that stays legible at small sizes. */
const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

/** Headings: Cormorant Garamond. `latin` covers every French accent. */
const cormorant = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

/**
 * Arabic body: Readex Pro. `latin` is kept for the brand name, "MAD" and
 * digits, so they match the Arabic around them. `unicode-range` means a page
 * only downloads the subsets it uses. Not preloaded: French pages never need it.
 */
const readex = Readex_Pro({
  variable: "--font-sans",
  subsets: ["arabic", "latin"],
  display: "swap",
  preload: false,
});

/** Arabic headings: Markazi Text, a Naskh text face. */
const markazi = Markazi_Text({
  variable: "--font-heading",
  subsets: ["arabic", "latin"],
  display: "swap",
  preload: false,
});

export const fontClasses = {
  fr: `${manrope.variable} ${cormorant.variable}`,
  ar: `${readex.variable} ${markazi.variable}`,
} as const;
