import { ImageResponse } from "next/og";

import { defaultLocale, hasLocale } from "@/i18n/config";
import fr from "@/i18n/dictionaries/fr";

/**
 * The card WhatsApp and social platforms show when someone shares a link.
 *
 * Without this, a shared product link renders as a bare text row with no photo,
 * which is most of what makes a customer tap it. Colours are the « Fouwwa »
 * tokens in globals.css.
 *
 * Only flexbox with explicit `display` is safe in Satori, and every size is
 * inline: it only knows `px`, not `rem`/`%`.
 *
 * One image per language (`/fr/opengraph-image`, `/ar/opengraph-image`). The
 * Arabic one carries only the Latin brand name: Satori, which draws these
 * images, does not shape Arabic letters, so Arabic text would come out as
 * disconnected glyphs. The redesign replaces this card with a real photo.
 */
export const alt = `${fr.siteName}, ${fr.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: raw } = await params;
  const lang = hasLocale(raw) ? raw : defaultLocale;
  const isFrench = lang === "fr";

  // The site's chain, as the one ornament (same loop geometry as chain.tsx).
  let chain = "M2 7"
  for (let i = 0; i < 64; i++) {
    const x = 10 + i * 16
    chain += ` C ${x} 1, ${x + 12} 1, ${x + 16} 7 C ${x + 12} 13, ${x} 13, ${x + 8} 7`
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 36,
          // « Fouwwa »: rose ground, nila text, madder accent, turmeric thread.
          backgroundColor: "#FBEDEA",
          color: "#1E2461",
          fontFamily: "serif",
          padding: 96,
        }}
      >
        <div style={{ display: "flex", fontSize: 108, fontWeight: 700, lineHeight: 1.05 }}>
          {fr.siteName}
        </div>
        <svg width="1008" height="28" viewBox="0 0 1034 14" preserveAspectRatio="none">
          <path d={chain} fill="none" stroke="#E9A93A" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
        <div style={{ display: "flex", fontSize: 44, color: "#9C1D3B", fontFamily: "sans-serif" }}>
          {isFrench ? fr.tagline : "Crochet"}
        </div>
      </div>
    ),
    size,
  );
}
