import type React from "react"
import { Aref_Ruqaa, Fraunces, Readex_Pro } from "next/font/google"

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

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
})

const ruqaa = Aref_Ruqaa({
  variable: "--font-ruqaa",
  weight: ["400", "700"],
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
