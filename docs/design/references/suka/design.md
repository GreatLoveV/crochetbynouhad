---
version: anydesign-1
name: SUKA
source: https://www.sukaconcept.com/
captured_at: 2026-11-12
description: |
  Colourful crochet accessories handmade on Lombok, sold from Amsterdam. Loud yellow and
  tomato orange chrome, a berry-coloured story band, pill buttons and 20 px photo corners.
  Joyful and unmistakable, at some cost to contrast.
colors:
  sun: "#FAEC56"
  tomato: "#EA5629"
  berry: "#6B2038"
  white: "#FFFFFF"
typography:
  display: { fontFamily: "Archivo, sans-serif", fontSize: 44px, fontWeight: 700, letterSpacing: 0.015em }
  heading: { fontFamily: "Archivo, sans-serif", fontSize: 26.4px, fontWeight: 700, lineHeight: 1.29 }
  body: { fontFamily: "Questrial, sans-serif", fontSize: 16.8px, fontWeight: 400, lineHeight: 1.76, letterSpacing: 0.0375em }
  label: { fontFamily: "Archivo, sans-serif", fontSize: 14.3px, fontWeight: 700, letterSpacing: 0.07em }
spacing:
  base: 4px
  scale: [8, 12, 16, 28, 32]
rounded:
  media: 20px
  input: 26px
  button: 40px
components:
  announcement-bar: { backgroundColor: "{colors.tomato}", textColor: "{colors.sun}", typography: "{typography.label}" }
  button-pill: { backgroundColor: "{colors.white}", textColor: "{colors.berry}", rounded: "{rounded.button}" }
  story-card: { backgroundColor: "{colors.white}", rounded: "{rounded.media}" }
  colour-band: { backgroundColor: "{colors.berry}", textColor: "{colors.white}", rounded: "{rounded.media}" }
---

# Design Analysis: SUKA

## Source

Live URL, home page in English. CSS-variable digest (Shopify Dawn theme settings) plus
Playwright computed styles and frames. The page hit a 30 s network timeout, so it was
captured as far as it had rendered. Home page only.

## TL;DR

Crochet sold with the energy of a festival poster: a sun-yellow header, a tomato
announcement bar, a berry story band and rounded photos of the work worn on the beach. The
lesson for us is **colour blocks as surfaces**: whole bands of saturated colour hold the
text, so the page has rhythm even where the photos are quiet. The warning is contrast:
yellow on tomato fails.

## 1. Visual identity

### 1.1 Surface description

- **Personality:** joyful, loud, warm, young. ✅
- **Mood:** a beach holiday. ✅ (beach photography, a palm tree, sun colours)
- **Stylistic references:** 1970s surf posters, Dawn-theme Shopify. ⚠️
- **Information density:** low. ✅
- **Implicit positioning:** fair-trade slow fashion for young buyers ("VERY. SLOW. FASHION."). ✅

### 1.2 Brand voice / Atmosphere

SUKA believes handmade does not have to look earnest. The colour and the bold type say
"fun first". The story of the women who crochet on Lombok is then told in photos of
hands and faces, so the colour never hides who made the work.

### 1.3 The "ONE brand thing"

- **The thing:** the sun-yellow header (#FAEC56) with the tomato wordmark (#EA5629). ✅
- **Why it carries the brand:** it is the colour of the island and of the yarn.
- **Restraint:** product photos sit on white cards with 20 px corners and no colour behind them.
- **Where it appears:** the header and the announcement bar; the berry band is the one
  other colour.

## 2. Design System (tokens)

### 2.1 Colors

| Token | Hex | Role | Where it appears | Confidence |
|---|---|---|---|---|
| `sun` | #FAEC56 | header background, text on tomato | header, announcement text, inputs | ✅ |
| `tomato` | #EA5629 | wordmark, headings, links | logo, "OUR.STORY", nav icons | ✅ |
| `berry` | #6B2038 | colour band, button text | "VERY. SLOW. FASHION." band | ✅ |
| `white` | #FFFFFF | page, cards, pill buttons | everywhere | ✅ |

### 2.2 Typography

Archivo 700 for headings, Questrial for text. ✅

| Token | Size | Weight | Line-height | Use |
|---|---|---|---|---|
| `display` | 44px | 700 | — | uppercase titles ("OUR.STORY") |
| `heading` | 26.4px | 700 | 1.29 | section titles |
| `body` | 16.8px | 400 | 1.76, +0.0375em | text |
| `label` | 14.3px | 700 | +0.07em | announcement bar |

### 2.3 Spacing

A 4 px base, with roughly 8, 12, 16, 28 and 32 px observed. ⚠️

### 2.4 Radii

Tiered: 20 px for media and cards, 26 px for inputs, 40 px for buttons. Everything is round. ✅

### 2.5 Elevation system

| Level | Name | Treatment | Use |
|---|---|---|---|
| 0 | flat | none | all |

Depth comes from colour bands, not shadows. ✅

### 2.6 Borders

None visible. Focus: 24 focus-visible rules, and all 25 tab stops show focus. ✅

### 2.7 Accessibility quick-check

12 of 49 text nodes fail contrast: sun yellow on tomato is 2.93:1. 5 images have no `alt`, one
control has no name, there are two `h1`s, and 7 mobile targets are under 24 px. There is a
skip link and reduced motion is respected.

## 3. Components Inventory

### 3.1 Generic components

#### announcement-bar
- Variants: 1.
- Sizes: one, 14.3 px bold.
- Visible states: default.
- Padding/Radius: 10.5px 0, square.
- Confidence: ✅

#### button-pill
- Variants: white on berry ("SHOP NOW →").
- Sizes: one.
- Visible states: default.
- Padding/Radius: 40 px radius.
- Confidence: ✅

#### story-card
- Variants: photo cards in a row of 3.
- Sizes: one.
- Visible states: default.
- Padding/Radius: 20 px.
- Confidence: ✅

#### colour-band
- Variants: berry.
- Sizes: half-width, paired with a photo.
- Visible states: static.
- Padding/Radius: 20 px corners.
- Confidence: ✅

### 3.2 Signature components

- **Colour band beside a photo:** a berry block holding the manifesto next to a photo of the
  same height, both with 20 px corners. ✅
- **Dotted titles:** "VERY. SLOW. FASHION." and "OUR.STORY" use full stops as rhythm. ✅

## 4. Layout & Composition

### 4.1 Grid & containers

Full-bleed header and hero; content about 1340 px wide; 10 px gutters between paired blocks. ✅

### 4.2 Composition patterns

A split hero (two photos), a colour band beside a photo, and a 3-up story row. ✅

### 4.3 Responsive behavior

| Breakpoint | Behaviour | Confidence |
|---|---|---|
| 1440 | two-up hero, 3-up story | ✅ |
| 375 | blocks stack one above another | ⚠️ |

### 4.4 Image behavior

- Lifestyle photography of the pieces worn, outdoors. ✅
- Process photos: hands crocheting with a hook. ✅
- Rounded 20 px corners on every photo. ✅

## 5. Reconstruction Notes

Stack: Shopify Dawn (`--font-body-scale`, `--buttons-radius` settings). Fonts: Archivo and
Questrial.

- Quick wins: add alt text, darken the announcement text, remove the second `h1`.
- Tricky bits: keeping the sun and tomato pair legible.
- Implicit states: product pages not observed.

| Layer | Confidence | Why |
|---|---|---|
| Colors | ✅ | computed styles |
| Type | ✅ | computed styles |
| Layout | ⚠️ | partial load |

## 6. Do's and Don'ts

### Do
- Use whole bands of colour as surfaces, as `{colors.berry}` (#6B2038) holds the manifesto.
- Show hands at work next to the finished piece.
- Round photos consistently (`{rounded.media}`, 20 px) so the shop feels soft.
- Make buttons pills (`{rounded.button}`, 40 px).
- Keep product cards white so the yarn colours stay true.

### Don't
- Don't put `{colors.sun}` text on `{colors.tomato}`: it is 2.93:1.
- Don't use two `h1`s on one page.
- Don't leave decorative photos without an empty `alt` or meaningful ones without text.
- Don't add letter-spacing to body text for "style"; at 16.8 px it slows reading.
- Don't rely on uppercase titles if the site also has to work in Arabic.

## 7. Open Questions

- Product, cart and checkout pages, and the mobile layout below the first screen.

## 8. Companion files

- `design-tokens.json` (generated by `build_tokens_json.py`).
- Frames are kept outside the repository.
