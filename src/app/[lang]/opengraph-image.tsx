import { ImageResponse } from "next/og";

import { defaultLocale, hasLocale } from "@/i18n/config";
import fr from "@/i18n/dictionaries/fr";

/**
 * The card WhatsApp and social platforms show when someone shares a link.
 *
 * Without this, a shared product link renders as a bare text row with no photo,
 * which is most of what makes a customer tap it. Colours mirror the cream/rose
 * palette in globals.css.
 *
 * Only flexbox with explicit `display` is safe in Satori, and every size is
 * inline: it only knows `px`, not `rem`/`%`.
 *
 * One image per language (`/fr/opengraph-image`, `/ar/opengraph-image`). The
 * Arabic one carries only the Latin brand name: Satori, which draws these
 * images, does not shape Arabic letters, so Arabic text would come out as
 * disconnected glyphs. The redesign replaces this card with a real photo.
 */
export const alt = `${fr.siteName} — ${fr.tagline}`;
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

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          // Velvet: aubergine-black ground, ivory text, gold accent.
          backgroundColor: "#140b12",
          backgroundImage:
            "radial-gradient(80% 70% at 15% 0%, #3a1a33 0%, transparent 65%)",
          color: "#eee7db",
          fontFamily: "sans-serif",
          padding: 80,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 34,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#dfb35f",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 12,
              height: 12,
              transform: "rotate(45deg)",
              backgroundColor: "#dfb35f",
            }}
          />
          {isFrench ? fr.og.eyebrow : "Crochet"}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 92,
            fontWeight: 700,
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          {fr.siteName}
        </div>

        {isFrench ? (
          <div style={{ display: "flex", fontSize: 40, color: "#b1a2af" }}>{fr.tagline}</div>
        ) : null}
      </div>
    ),
    size,
  );
}