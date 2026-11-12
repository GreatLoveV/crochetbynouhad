---
version: anydesign-1
name: Tekla
source: https://teklafabrics.com/
captured_at: 2026-11-11
description: |
  Copenhagen textile brand (bedding, towels, robes). Pale grey ground, near-black light-weight
  sans, almost no chrome. Moody full-bleed interiors alternate with flat product cut-outs on
  grey; the site is a quiet frame for texture.
colors:
  surface: "#F6F6F6"
  surface-band: "#E3E3E3"
  text-primary: "#181818"
  text-muted: "#707070"
  button: "#5C5C5C"
typography:
  body: { fontFamily: "Unica77, sans-serif", fontSize: 14px, fontWeight: 300, lineHeight: 1.5 }
  lead: { fontFamily: "Unica77, sans-serif", fontSize: 18px, fontWeight: 300, lineHeight: 1.5 }
spacing:
  base: 4px
  scale: [8, 16, 24, 40]
rounded:
  none: 0px
components:
  button-solid: { backgroundColor: "{colors.button}", textColor: "#FFFFFF", rounded: "{rounded.none}", padding: 0 16px }
  product-tile: { backgroundColor: "{colors.surface-band}", textColor: "{colors.text-primary}", rounded: "{rounded.none}" }
  consent-dialog: { backgroundColor: "#FFFFFF", textColor: "{colors.text-primary}", rounded: "{rounded.none}" }
---

# Design Analysis: Tekla

> Analysis generated with the `anydesign` skill. Date: 2026-11-11. Emphasis: mood + design system

## Source

Live URL. Computed styles plus 3 + 3 frames. The CSS vars are mostly Tailwind
internals. The consent dialog stayed on screen in the frames. Limitations: home page only.

## TL;DR

Texture as the hero. Fabrics are shot so close and so dark that you can feel the weave.
The UI is one light-weight sans at 14px and four greys. The lesson for us is close-up
texture shots, and a captioned grid where the caption is just the plain name.

## 1. Visual identity

### 1.1 Surface description

- Personality: quiet, Scandinavian, tactile, restrained ✅
- Mood: a cosy room at night ✅
- Stylistic references: Scandinavian interiors editorial ✅
- Information density: very low ✅
- Implicit positioning: premium everyday textiles ✅

### 1.2 Brand voice / Atmosphere

Tekla assumes you'll buy if you can feel the fabric through the screen, so it removes
every word that isn't a product name.

### 1.3 The "ONE brand thing"

- The thing: two-up full-bleed texture photos, each with a plain caption below ("Organic cotton bedding").
- Why: the material is the product.
- Restraint: greys only, no accent, weight 300.
- Where: the home page bands; product cut-outs on #E3E3E3 for the listings.

## 2. Design System (tokens)

### 2.1 Colors

| Token | Hex | Role | Where it appears | Confidence |
|---|---|---|---|---|
| `surface` | #F6F6F6 | ground | body | ✅ |
| `surface-band` | #E3E3E3 | product ground | tiles, footer | ⚠️ |
| `text-primary` | #181818 | text | everywhere | ✅ |
| `text-muted` | #707070 | secondary | dialog copy | ✅ |
| `button` | #5C5C5C | solid button | consent buttons | ✅ |

### 2.2 Typography

Unica77 at weight 300 only (✅).

| Token | Size | Weight | Line-height | Use |
|---|---|---|---|---|
| `body` | 14px | 300 | 1.5 | everything |
| `lead` | 18px | 300 | 1.5 | dialog title, section leads |

### 2.3 Spacing

A 4px base, generous outer gutters of 16px. ⚠️

### 2.4 Radii

0. ✅

### 2.5 Elevation system

| Level | Name | Treatment | Use |
|---|---|---|---|
| 0 | flat | none | all |

### 2.6 Borders

1px #707070 on outline buttons. 21 `:focus-visible` rules, and 23 of 25 tab stops showed an indicator. ⚠️

### 2.7 Accessibility quick-check

Token pairs pass (`design-a11y.md`: body 16.43:1, muted 4.58:1 AA just, button 6.69:1).
2 failing nodes (copyright at 2.68:1). Weaknesses: no `main` landmark, no skip link, no
`h1`, and 85 of 103 mobile targets are under 24px. One good sign: the consent dialog gives
"Only necessary" the same weight as "Accept all".

## 3. Components Inventory

### 3.1 Generic components

#### button-solid
- Grey fill with white 14px text, radius 0 ✅

#### product-tile
- A product cut-out on a grey band with a name caption at the bottom left, 4-up ✅

#### consent-dialog
- Equal-weight "Only necessary" and "Accept all", plus "Manage settings" ✅

### 3.2 Signature components

- **Captioned two-up texture band**: two full-bleed close-ups side by side, each with a
  one-line caption underneath.

## 4. Layout & Composition

### 4.1 Grid & containers

Edge-to-edge 2-up and 4-up grids with 1px gaps and no max-width. ✅

### 4.2 Composition patterns

2-up hero, then a 4-up product strip, then a 2-up texture band, then a five-column footer.

### 4.3 Responsive behavior

2-up becomes 1-up, and the nav becomes icons plus a hamburger. Many tiny targets. ⚠️

### 4.4 Image behavior

- Interior close-ups: dark, warm, shallow depth of field.
- Product cut-outs: centred on grey.

## 5. Reconstruction Notes

Principles only. Borrow: texture close-ups, plain captions and an honest consent dialog.
Avoid: weight 300 at 14px, and tiny targets.

| Layer | Confidence | Why |
|---|---|---|
| Colour | ✅ | computed |
| Type | ✅ | computed |
| Layout | ⚠️ | home only |

## 6. Do's and Don'ts

### Do
- Shoot one close-up of the stitch or weave for every piece.
- Caption images with the plain product name only.
- Use a 1px gutter grid so photos read as one surface.
- Keep one type family at two sizes.
- Give the refuse option equal weight in any consent UI.

### Don't
- Don't use weight 300 at 14px for body text.
- Don't ship 20px tap targets on mobile.
- Don't omit `main` and `h1`.

## 7. Open Questions

- The colours under the consent dialog may differ slightly.

## 8. Companion files

- `design-tokens.json` (generated)
- `design-a11y.md`
