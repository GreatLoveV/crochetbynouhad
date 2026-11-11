---
version: anydesign-1
name: Laine Publishing
source: https://lainepublishing.com/
captured_at: 2026-11-11
description: |
  Finnish knitting magazine and pattern shop. White ground, black type, one grotesque
  in big tight headlines, and a mono for small labels. Editorial photography of people
  wearing the knits carries everything; the UI is a monochrome frame around it.
colors:
  surface: "#FFFFFF"
  text-primary: "#000000"
  ink: "#111111"
  light: "#EBEBEB"
  error: "#C25151"
typography:
  display: { fontFamily: "Scto Grotesk A, sans-serif", fontSize: 56px, fontWeight: 500, lineHeight: 1.0, letterSpacing: -0.02em }
  label: { fontFamily: "Scto Grotesk A, sans-serif", fontSize: 12px, fontWeight: 700, letterSpacing: 0.14em, textTransform: uppercase }
  body: { fontFamily: "Scto Grotesk A, sans-serif", fontSize: 20px, fontWeight: 400, lineHeight: 1.5 }
  mono-label: { fontFamily: "Quadrant Text Mono, monospace", fontSize: 12px, fontWeight: 400, letterSpacing: 0.1em }
spacing:
  base: 4px
  scale: [8, 12, 16, 20, 28, 48]
rounded:
  none: 0px
components:
  button-inverse: { backgroundColor: "{colors.surface}", textColor: "{colors.ink}", rounded: "{rounded.none}", padding: 19px 29px }
  hero-slide: { backgroundColor: "{colors.ink}", textColor: "{colors.surface}", rounded: "{rounded.none}" }
  pattern-card: { backgroundColor: "{colors.surface}", textColor: "{colors.text-primary}", rounded: "{rounded.none}" }
---

# Design Analysis: Laine Publishing

> Analysis generated with the `anydesign` skill. Date: 2026-11-11. Emphasis: mood + design system

## Source

Live URL. CSS-variable digest plus Playwright computed styles and 3 + 3 frames. Limitations:
the home page only, and a sticky discount pill covered part of each frame.

## TL;DR

A magazine first and a shop second. Huge, tightly tracked grotesque headlines sit on
full-bleed portraits of people wearing the knits. The lesson for us is to show the work
**worn and in use**, and to make the type an active part of the layout.

## 1. Visual identity

### 1.1 Surface description

- Personality: editorial, Nordic, calm, contemporary ✅
- Mood: slow winter afternoon, natural light ✅
- Stylistic references: independent print magazine ✅
- Information density: low above the fold, dense in pattern carousels ✅
- Implicit positioning: knitting as design culture ✅

### 1.2 Brand voice / Atmosphere

Laine treats knitters as readers of a design magazine: the pattern is a garment in a
story, so the photography is portraiture rather than a product shot.

### 1.3 The "ONE brand thing"

- The thing: 56px+ headlines at -0.02em tracking laid directly over a portrait.
- Why: it makes every page feel like a cover.
- Restraint: monochrome UI, radius 0 and no accent colour.
- Where: hero slides and section heads; product cards stay small and plain.

## 2. Design System (tokens)

### 2.1 Colors

| Token | Hex | Role | Where it appears | Confidence |
|---|---|---|---|---|
| `surface` | #FFFFFF | ground | page | ✅ |
| `text-primary` | #000000 | text | everywhere | ✅ |
| `ink` | #111111 | dark bands, button text | bars, footer | ✅ |
| `light` | #EBEBEB | quiet surfaces | dividers | ✅ |
| `error` | #C25151 | errors | forms | ✅ |

### 2.2 Typography

One grotesque does almost everything (✅ Scto Grotesk A computed), with a mono for
small "RETAILERS"-style labels.

| Token | Size | Weight | Line-height | Use |
|---|---|---|---|---|
| `display` | 56.4px | 500 | 1.0 | section and hero titles |
| `label` | 12px | 700 | 1.25 | uppercase bars and buttons |
| `body` | 20.16px | 400 | 1.5 | body |
| `mono-label` | 12px | 400 | — | footer group labels |

### 2.3 Spacing

Multiples of 4 (spacing derives from 4.8px base units in the theme). ⚠️

### 2.4 Radii

0 throughout. ✅

### 2.5 Elevation system

| Level | Name | Treatment | Use |
|---|---|---|---|
| 0 | flat | none | all |

### 2.6 Borders

Hairlines are rare; colour bands separate sections instead. 33 `:focus-visible` rules,
and every tab stop showed an indicator. ✅

### 2.7 Accessibility quick-check

Tokens pass AAA (`design-a11y.md`). But the page scan found 26 (desktop) and 45 (mobile)
failing text nodes. Most are white text over light photos (e.g. "52 projects that use
a maximum of 100 grams…" over a cream scarf). No `h1`. A discount widget overlaps
content on every screen.

## 3. Components Inventory

### 3.1 Generic components

#### button-inverse
- A white box with uppercase bold text, placed over photos ✅
- Padding/Radius: 19px 29px / 0

#### hero-slide
- A full-bleed portrait or a split photo plus dark panel, with a big headline and one button ✅

#### pattern-card
- Portrait 4:5 photo, uppercase name, designer and price, with a "+" quick-add ✅

### 3.2 Signature components

- **Tab-like category headings**: "Sweaters  Cardigans  Hats" as large type, where the
  inactive tabs are grey and scroll sideways on mobile.

## 4. Layout & Composition

### 4.1 Grid & containers

Full-bleed heroes, contained carousels, and a footer in a lavender-grey band then a black band.

### 4.2 Composition patterns

Hero slideshow, then split photo plus solid panel, then horizontal pattern carousels, then a two-band footer.

### 4.3 Responsive behavior

On mobile the headline stays very large (3 lines) over the photo, and carousels scroll sideways. 56 small targets. ⚠️

### 4.4 Image behavior

- Editorial portraits: models wearing knits, natural interiors, 4:5 crops.

## 5. Reconstruction Notes

Principles only. Borrow: worn or in-use photography, and big type as layout. Avoid:
white text on light photos without a scrim.

| Layer | Confidence | Why |
|---|---|---|
| Colour | ✅ | CSS vars |
| Type | ✅ | computed |
| Layout | ⚠️ | home only |

## 6. Do's and Don'ts

### Do
- Show the piece worn or in use, not only flat.
- Let one big headline sit on the photo, with a scrim when the photo is light.
- Keep the UI monochrome so knit colours stand out.
- Use 4:5 portrait crops for garments and bags.
- Offer the same category as large tappable words.

### Don't
- Don't put white text on cream photos.
- Don't pin a discount widget over content.
- Don't lean on uppercase 12px labels for navigation.

## 7. Open Questions

- Product page and checkout were not captured.

## 8. Companion files

- `design-tokens.json` (generated)
- `design-a11y.md`
