---
version: anydesign-1
name: Heath Ceramics
source: https://www.heathceramics.com/
captured_at: 2026-11-11
description: |
  Seventy-year-old Californian pottery. A warm clay-white ground, near-black brown text,
  a dark header and a schoolbook serif for editorial lines over a small, wide sans. Calm,
  catalogue-like, and confident enough to show a glass on an empty field.
colors:
  surface: "#F7F0EA"
  surface-dark: "#26211B"
  text-primary: "#26211B"
  text-dim: "#52483D"
  on-dark: "#D1CCC6"
  border: "#E3DFD9"
typography:
  editorial: { fontFamily: "Century Schoolbook, serif", fontSize: 28px, fontWeight: 400, lineHeight: 1.3 }
  nav: { fontFamily: "Benton Sans Bold, sans-serif", fontSize: 12px, fontWeight: 400, letterSpacing: 0.45px, textTransform: uppercase }
  body: { fontFamily: "Benton Sans Medium, sans-serif", fontSize: 14px, fontWeight: 400, lineHeight: 1.4 }
  caption: { fontFamily: "Benton Sans Bold, sans-serif", fontSize: 11px, fontWeight: 400, lineHeight: 1.3 }
spacing:
  base: 8px
  scale: [16, 24, 32, 48, 60, 77, 100]
rounded:
  none: 0px
components:
  button-fill: { backgroundColor: "{colors.text-dim}", textColor: "{colors.surface}", rounded: "{rounded.none}" }
  hero-card: { backgroundColor: "#FFFFFF", textColor: "{colors.text-primary}", rounded: "{rounded.none}" }
  product-tile: { backgroundColor: "{colors.surface}", textColor: "{colors.text-primary}", rounded: "{rounded.none}" }
---

# Design Analysis: Heath Ceramics

> Analysis generated with the `anydesign` skill. Date: 2026-11-11. Emphasis: mood + design system

## Source

Live URL. CSS-variable digest (~450 vars) plus Playwright computed styles and 3 + 3 frames.
The ecommerce site is by BASIC agency (their case study). Limitations: home page only.

## TL;DR

A retail catalogue that behaves like a well-kept shop floor. Products sit on the same
clay-white as the page, so pieces read as objects on a table rather than "cards". An
old-fashioned schoolbook serif carries the editorial voice. The lesson for us is to merge
the photo background into the page ground so the work floats.

## 1. Visual identity

### 1.1 Surface description

- Personality: calm, crafted, heritage, unhurried ✅
- Mood: a sunlit showroom with labelled shelves ✅
- Stylistic references: mid-century catalogue, museum labels ⚠️
- Information density: medium, with a very dense mega-menu and footer ✅
- Implicit positioning: premium heirloom tableware ✅

### 1.2 Brand voice / Atmosphere

Heath assumes its buyers care how a thing is made and will read a sentence about it.
Hence a literary serif and long product names ("Foot Glass in Cypress Tortoise Shell")
next to plain prices, with nothing shouting.

### 1.3 The "ONE brand thing"

- The thing: products shot on `{colors.surface}` (#F7F0EA), the same colour as the page.
- Why: the object is the only thing with edges.
- Restraint: no card borders, radius 0 and no shadows.
- Where: product listings and category tiles; lifestyle photos are kept for the hero.

## 2. Design System (tokens)

### 2.1 Colors

| Token | Hex | Role | Where it appears | Confidence |
|---|---|---|---|---|
| `surface` | #F7F0EA | page and product-photo ground | body, tiles | ✅ |
| `surface-dark` | #26211B | header and footer band | nav, footer | ✅ |
| `text-primary` | #26211B | body text | everywhere | ✅ |
| `text-dim` | #52483D | secondary text, fill button | cards, buttons | ✅ |
| `on-dark` | #D1CCC6 | nav text on dark | header | ✅ |
| `border` | #E3DFD9 | hairlines | header bottom, list dividers | ✅ |

### 2.2 Typography

Benton Sans in four weights (✅ computed), a Century Schoolbook–style serif for editorial
(✅ named `Schoolbook-Regular`), and a wide grotesque for the logo.

| Token | Size | Weight | Line-height | Use |
|---|---|---|---|---|
| `editorial` | ~28px | 400 | 1.3 | hero cards, intro sentences |
| `nav` | 12px | 400 (Bold cut) | normal | uppercase nav |
| `body` | 13–14px | 400 | 1.4 | product names, copy |
| `caption` | 11px | 400 | 1.3 | carousel captions |

The body text is small (13px base). It's elegant, but too small for comfortable reading on
phones.

### 2.3 Spacing

Named vertical gaps of 16 / 30 / 40 / 48 / 60 / 77 / 100px and fluid wraps via `clamp()`. ✅

### 2.4 Radii

0 everywhere except round icon buttons. ✅

### 2.5 Elevation system

| Level | Name | Treatment | Use |
|---|---|---|---|
| 0 | flat | none | page, tiles |
| 1 | panel | white box over photo | hero text card |

### 2.6 Borders

1px #E3DFD9 hairlines. Focus: 9 `:focus-visible` rules, and every tab stop showed an indicator. ✅

### 2.7 Accessibility quick-check

Token pairs all pass AAA (`design-a11y.md`: body 14.14:1, dim 7.91:1, nav on dark 10:1).
The page scan still found 39 failing text nodes (worst 2.86:1, mostly light text on photos
or menus). No `h1` on the home page. There's an accessibility overlay widget, which is
widely criticised as no substitute for accessible markup.

## 3. Components Inventory

### 3.1 Generic components

#### button-fill
- Variants: dark fill with an arrow box, plus a hollow outline ✅
- Sizes: one
- States: hover inverts the colours (from tokens) ✅
- Padding/Radius: 0 radius

#### hero-card
- A white text panel over a full-bleed slideshow, holding a serif title, a line of copy and a button ✅

#### product-tile
- The photo on the surface colour, then the name (bold), price, and collection in dim text ✅

### 3.2 Signature components

- **Category list as type**: a column of large serif category names ("Glassware,
  Flatware, Linens…") next to a sentence of copy, used as the navigation itself.

## 4. Layout & Composition

### 4.1 Grid & containers

Wraps of 8% to 11.25% of the viewport and a 4-column card grid. Generous vertical gaps. ✅

### 4.2 Composition patterns

Full-bleed slideshow hero with an inset card, a story carousel strip, a typographic
category list with products, and a dark footer matrix.

### 4.3 Responsive behavior

4-up becomes 2-up on mobile and the nav becomes a hamburger. 45 small targets on mobile. ⚠️

### 4.4 Image behavior

- Lifestyle photography: full-bleed, natural light, tables set with food.
- Product photography: cut-out on the page colour, centred, with lots of air.

## 5. Reconstruction Notes

Principles reference only. Borrow: product photos on the page colour, radius 0 for media,
and a serif voice for editorial lines. Avoid: a 13px body and overlay widgets.

| Layer | Confidence | Why |
|---|---|---|
| Colour | ✅ | named CSS vars |
| Type | ✅ | computed |
| Layout | ⚠️ | home page only |

## 6. Do's and Don'ts

### Do
- Shoot or crop product photos on a ground close to `{colors.surface}` (#F7F0EA).
- Keep media square-cornered so the object, not the frame, has the shape.
- Use a serif sentence to introduce a category instead of an uppercase label.
- Put long, descriptive product names next to plain prices.
- Use the dark band only for header and footer.

### Don't
- Don't set body text at 13px.
- Don't rely on an accessibility overlay.
- Don't skip the `h1`.

## 7. Open Questions

- The product detail page was not captured.

## 8. Companion files

- `design-tokens.json` (generated)
- `design-a11y.md`
