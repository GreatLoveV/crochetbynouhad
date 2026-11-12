---
version: anydesign-1
name: Amano
source: https://foreveramano.com/
captured_at: 2026-11-12
description: |
  Hand-knitted, picture-knit jumpers sold since 1988. A plain black-and-white Shopify
  frame (Inter, square buttons) gets out of the way of very colourful photography:
  motifs of hares, flowers and stars worn outdoors.
colors:
  ink: "#1B1B1B"
  paper: "#FFFFFF"
  accent: "#796F59"
  text-light: "#5F5F5F"
  sale: "#F9DEE5"
typography:
  display: { fontFamily: "Inter, sans-serif", fontSize: 40px, fontWeight: 500, lineHeight: 1.2 }
  body: { fontFamily: "Inter, sans-serif", fontSize: 16px, fontWeight: 400, lineHeight: normal }
  button: { fontFamily: "Inter, sans-serif", fontSize: 16px, fontWeight: 400, letterSpacing: 0.1em }
spacing:
  base: 4px
  scale: [5, 11, 12, 15, 16, 21.6]
rounded:
  none: 0px
components:
  button-primary: { backgroundColor: "{colors.ink}", textColor: "{colors.paper}", rounded: "{rounded.none}", padding: 12px 21.6px }
  nav-link: { textColor: "{colors.ink}", padding: 15px }
  newsletter-modal: { backgroundColor: "{colors.paper}", textColor: "{colors.ink}" }
---

# Design Analysis: Amano

## Source

Live URL, home page in English. CSS-variable digest (Shopify Broadcast-style theme) plus
Playwright computed styles and 3 desktop and 3 mobile frames. The page timed out on network
idle and was captured as rendered. Home page only.

## TL;DR

Proof that a neutral frame can let colourful handwork shine: the interface is black,
white and Inter, and the colour comes only from the knits, photographed in orchards. Each
jumper has a name ("The Long Ride, The Field Mouse & The Dance"). The cautions: white text
laid over busy photos, and a newsletter popup that covers the first screen.

## 1. Visual identity

### 1.1 Surface description

- **Personality:** storybook, warm, generous, a little nostalgic. ✅
- **Mood:** an autumn orchard. ✅
- **Stylistic references:** a children's book illustration knitted into wool. ⚠️
- **Information density:** low on top, medium in product rows. ✅
- **Implicit positioning:** characterful handmade knitwear at premium prices. ✅

### 1.2 Brand voice / Atmosphere

Amano believes each jumper is a character with a name and a story. So the shop names
collections like book chapters ("The Barn Dance", "Into the Night") and keeps the interface
almost invisible, letting the motifs supply the colour.

### 1.3 The "ONE brand thing"

- **The thing:** named picture-knit pieces (hares, flowers and stars knitted in), shown worn
  outdoors. ✅
- **Why it carries the brand:** each piece is recognisable at thumbnail size.
- **Restraint:** the UI is `{colors.ink}` (#1B1B1B) on white with square buttons.
- **Where it appears:** the hero and collection titles.

## 2. Design System (tokens)

### 2.1 Colors

| Token | Hex | Role | Where it appears | Confidence |
|---|---|---|---|---|
| `ink` | #1B1B1B | text, buttons | everywhere | ✅ |
| `paper` | #FFFFFF | page | everywhere | ✅ |
| `accent` | #796F59 | secondary buttons | some sections | ✅ |
| `text-light` | #5F5F5F | secondary text | captions | ✅ |
| `sale` | #F9DEE5 | sale badge | product cards | ✅ |

### 2.2 Typography

Inter throughout. ✅

| Token | Size | Weight | Line-height | Use |
|---|---|---|---|---|
| `display` | 40px | 500 | 1.2 | section titles, uppercase "MADE BY HAND. MADE TO LAST." |
| `body` | 16px | 400 | normal | text |
| `button` | 16px | 400 | +0.1em | "Shop Now" |

### 2.3 Spacing

A 4 px base, with uneven values (5, 11, 15, 21.6) that show theme defaults rather than a
system. ⚠️

### 2.4 Radii

Square everywhere. ✅

### 2.5 Elevation system

| Level | Name | Treatment | Use |
|---|---|---|---|
| 0 | flat | none | page |
| 1 | soft | 0 2px 6px rgba(0,0,0,.04) | small floating buttons |
| 2 | modal | grey overlay | newsletter popup |

### 2.6 Borders

1 px ink on the primary button. Focus: 25 of 25 tab stops are visible, but there is no
reduced-motion rule. ✅

### 2.7 Accessibility quick-check

12 of 171 text nodes fail contrast (white text over the photo, "The Barn Dance"). 12 images
have no `alt`. There is no `h1`. 12 to 14 mobile targets are under 24 px. There is a skip link.

## 3. Components Inventory

### 3.1 Generic components

#### button-primary
- Variants: ink fill; an accent variant exists in the vars.
- Sizes: one.
- Visible states: default.
- Padding/Radius: 12px 21.6px, square.
- Confidence: ✅

#### nav-link
- Variants: centred text links.
- Sizes: 16 px.
- Visible states: default.
- Padding/Radius: 15 px.
- Confidence: ✅

#### newsletter-modal
- Variants: photo on one side, form on the other.
- Sizes: about 650×490 px.
- Visible states: open on load.
- Padding/Radius: square.
- Confidence: ✅

### 3.2 Signature components

- **Split photo hero with a centred title:** two photos side by side with the collection name
  over the seam. ✅

## 4. Layout & Composition

### 4.1 Grid & containers

Full-bleed photography and a 32 px side margin for text. ✅

### 4.2 Composition patterns

A split hero, a big uppercase statement, then product rows. ✅

### 4.3 Responsive behavior

| Breakpoint | Behaviour | Confidence |
|---|---|---|
| 1440 | two-photo hero | ✅ |
| 375 | the hero stacks | ⚠️ |

### 4.4 Image behavior

- Editorial outdoor photography of pieces worn. ✅
- Product cutouts in grids (not seen in frames). ❓

## 5. Reconstruction Notes

Stack: Shopify (theme variables, the Omnisend popup). Font: Inter.

- Quick wins: a solid backing behind the hero text, alt text, an `h1`.
- Tricky bits: the popup and the chat widget compete with the first screen.
- Implicit states: not observed.

| Layer | Confidence | Why |
|---|---|---|
| Colors | ✅ | CSS vars |
| Type | ✅ | computed |
| Layout | ⚠️ | partial load |

## 6. Do's and Don'ts

### Do
- Name each piece and each group of pieces, like book chapters.
- Keep the frame neutral (`{colors.ink}` on `{colors.paper}`) when the photos are colourful.
- Show pieces worn, outdoors, in natural light.
- Use one statement line ("MADE BY HAND. MADE TO LAST.") as a section, not as decoration.

### Don't
- Don't set white text over a busy photo without a backing.
- Don't open a newsletter popup over the first screen.
- Don't ship without an `h1`.
- Don't let a chat bubble cover the product.

## 7. Open Questions

- Product page layout and gallery behaviour.

## 8. Companion files

- `design-tokens.json` (generated by `build_tokens_json.py`).
- Frames are kept outside the repository.
