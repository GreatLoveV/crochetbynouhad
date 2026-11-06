import { ImageResponse } from "next/og";

import { strings } from "@/lib/constants/strings";

/**
 * The card WhatsApp and social platforms show when someone shares a link.
 *
 * Without this, a shared product link renders as a bare text row with no photo,
 * which is most of what makes a customer tap it. Colours mirror the cream/rose
 * palette in globals.css.
 *
 * Only flexbox with explicit `display` is safe in Satori, and every size is
 * inline: it only knows `px`, not `rem`/`%`.
 */
export const alt = `${strings.siteName} — ${strings.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          backgroundColor: "#fbf4ea",
          color: "#4a3a30",
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
            color: "#8a7261",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 14,
              height: 14,
              borderRadius: 9999,
              backgroundColor: "#b45309",
            }}
          />
          Fait main
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
          {strings.siteName}
        </div>

        <div style={{ display: "flex", fontSize: 40, color: "#8a7261" }}>
          {strings.tagline}
        </div>
      </div>
    ),
    size,
  );
}