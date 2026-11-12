import type React from "react"
import { Aref_Ruqaa, Readex_Pro } from "next/font/google"
import localFont from "next/font/local"

/**
 * « Fouwwa » type (docs/design/direction.md):
 *
 * - Readex Pro: the interface in both languages (body, buttons, prices,
 *   forms). Drawn for Arabic and Latin together. `--font-readex`.
 * - Fraunces: French display (brand, headings, piece names), with its Soft
 *   and Wonk axes for round, yarn-like terminals. `--font-fraunces`.
 * - Aref Ruqaa: Arabic display, the everyday handwritten script. Short names
 *   and titles only, never subheads or text. `--font-ruqaa`.
 *
 * globals.css stacks Fraunces before Aref Ruqaa for every heading, so Arabic
 * letters fall through to Ruqaa and Latin words stay in Fraunces.
 *
 * next/font writes an @font-face per subset with its `unicode-range`, so a
 * page only downloads the files whose characters it uses. `subsets` decides
 * what is preloaded: Latin for Readex and Fraunces (French pages, and the
 * brand, prices and "MAD" on Arabic pages). Aref Ruqaa is not preloaded, so
 * French pages never fetch it; Arabic pages fetch it on first use, with
 * `swap` meanwhile.
 */

const readex = Readex_Pro({
  variable: "--font-readex",
  subsets: ["latin"],
  display: "swap",
})

/**
 * Fraunces is self-hosted as a single instance with Soft fixed at 100 and
 * Wonk at 1, the only values the design uses, and weights 300 to 700. That
 * file is 35 KB; next/font/google can only fetch whole axes, which made it
 * 118 KB, preloaded on every page (Lighthouse, Phase 6). The optical-size
 * axis is dropped too: headings use the display cut at every size.
 *
 * Source: Google Fonts, latin subset (fonts.googleapis.com/css2?family=
 * Fraunces:wght,SOFT,WONK@300..700,100,1). Licence: SIL OFL 1.1, in
 * fonts/OFL-Fraunces.txt next to the file.
 */
const fraunces = localFont({
  src: "./fonts/fraunces-soft-wonk-latin.woff2",
  variable: "--font-fraunces",
  weight: "300 700",
  display: "swap",
  adjustFontFallback: "Times New Roman",
})

// Bold only: the design sets Ruqaa at 700 (docs/design/design-system.md).
// The 400 file was a second 37 KB download on every Arabic page; text that
// asks for a lighter weight uses the bold file.
const ruqaa = Aref_Ruqaa({
  variable: "--font-ruqaa",
  weight: "700",
  subsets: ["arabic"],
  preload: false,
  display: "swap",
})

export const fontClasses = `${readex.variable} ${fraunces.variable} ${ruqaa.variable}`

/**
 * Fraunces' own face, without its metric-matched fallback. That fallback is a
 * local Times New Roman, which has Arabic letters: in a stack it would catch
 * Arabic before Aref Ruqaa could. Arabic headings therefore stack the bare
 * Fraunces face (Latin words), then Aref Ruqaa with its own fallback.
 */
export const fontStyle = {
  "--font-fraunces-face": fraunces.style.fontFamily.split(",")[0],
} as React.CSSProperties
