---
version: anydesign-1
name: Mo Al-Asala
source: https://moalasala.com/
captured_at: 2026-11-12
description: |
  An Arabic-first heritage clothing shop (hoodies with Arabic sayings), designed in Arabic
  and then adapted to English. A dark charcoal ground, gold Amiri headlines and the tagline
  "الفخامة في كل خيط". It is a useful Arabic-first reference, with clear mistakes to avoid.
colors:
  dark: "#1A1A1A"
  background: "#2A2827"
  border: "#3A3835"
  gold: "#C7A77B"
  ivory: "#F8F6F3"
  muted-foreground: "#B8B8B8"
typography:
  display-ar: { fontFamily: "Amiri, serif", fontSize: 72px, fontWeight: 700, lineHeight: 1.25 }
  heading-ar: { fontFamily: "Amiri, serif", fontSize: 48px, fontWeight: 700, lineHeight: 1.0 }
  tagline-ar: { fontFamily: "Amiri, serif", fontSize: 30px, fontWeight: 300, lineHeight: 1.2 }
  body-ar: { fontFamily: "Amiri, serif", fontSize: 18px, fontWeight: 400, lineHeight: 1.625 }
  nav-ar: { fontFamily: "Amiri, serif", fontSize: 14px, fontWeight: 500, lineHeight: 1.43 }
spacing:
  base: 4px
  scale: [8, 16, 24, 32, 48]
rounded:
  md: 10.4px
components:
  button-primary: { backgroundColor: "{colors.gold}", textColor: "{colors.dark}", rounded: "{rounded.md}", padding: 8px 24px }
  button-outline: { textColor: "{colors.gold}", rounded: "{rounded.md}", padding: 8px 24px }
  stat-card: { backgroundColor: "{colors.background}", textColor: "{colors.gold}", rounded: "{rounded.md}" }
---

# Design Analysis: Mo Al-Asala

## Source

Live URL, Arabic home page (the default). CSS-variable digest (shadcn/Tailwind tokens) plus
Playwright computed styles and 3 desktop and 3 mobile frames. Home page only.

## TL;DR

The only shop in this set that is actually designed Arabic-first. The case study says the
cart and checkout are right to left too. Amiri, a classical Naskh, gives the headline real
calligraphic presence. But the execution fails basic checks: grey body text at 80 % opacity
on charcoal, 14 px Amiri navigation, a mobile page that scrolls sideways, and "∞ / 6 / 100%"
stat cards that say nothing.

## 1. Visual identity

### 1.1 Surface description

- **Personality:** proud, formal, heritage-luxury. ✅
- **Mood:** a dim boutique with gold lettering. ✅
- **Stylistic references:** the "black and gold luxury" template. ⚠️
- **Information density:** low. ✅
- **Implicit positioning:** premium Arabic heritage streetwear. ✅

### 1.2 Brand voice / Atmosphere

The shop believes heritage reads as luxury, and luxury as black and gold. Arabic leads
because a heritage claim made in translated Arabic would not be believed. The calligraphic
display face carries that claim; everything else follows the dark-luxury default.

### 1.3 The "ONE brand thing"

- **The thing:** "مو الأصالة" set in Amiri Bold at 72 px in `{colors.gold}` (#C7A77B). ✅
- **Why it carries the brand:** Naskh calligraphy is the heritage.
- **Restraint:** gold is used only for the display text and buttons.
- **Where it appears:** the hero, section titles and the logo roundel.

## 2. Design System (tokens)

### 2.1 Colors

| Token | Hex | Role | Where it appears | Confidence |
|---|---|---|---|---|
| `dark` | #1A1A1A | header, button text | header | ✅ |
| `background` | #2A2827 | page | everywhere | ✅ |
| `border` | #3A3835 | lines, card borders | cards, dividers | ✅ |
| `gold` | #C7A77B | display text, primary button | hero, buttons | ✅ |
| `ivory` | #F8F6F3 | text | nav, body | ✅ |
| `muted-foreground` | #B8B8B8 | secondary text | captions | ✅ |

### 2.2 Typography

Amiri for Arabic (display and text), Lora for the Latin and as the body fallback. ✅

| Token | Size | Weight | Line-height | Use |
|---|---|---|---|---|
| `display-ar` | 72px | 700 | 1.25 | hero name |
| `heading-ar` | 48px | 700 | 1.0 | section titles (too tight for Naskh) |
| `tagline-ar` | 30px | 300 | 1.2 | "الفخامة في كل خيط" |
| `body-ar` | 18px | 400 | 1.625 | intro, ivory at 80 % opacity |
| `nav-ar` | 14px | 500 | 1.43 | navigation (too small for Amiri) |

### 2.3 Spacing

The Tailwind 4 px scale: 8, 16, 24, 32 and 48 px. ✅

### 2.4 Radii

A single 10.4 px radius on buttons and cards. ✅

### 2.5 Elevation system

| Level | Name | Treatment | Use |
|---|---|---|---|
| 0 | ground | `{colors.background}` | page |
| 1 | card | 1 px `{colors.border}` | stat and product cards |

Decorative depth: a soft radial glow behind the hero. ✅

### 2.6 Borders

1 px `border`. Focus: the ring is gold (`--ring`). ✅

### 2.7 Accessibility quick-check

29 of 84 text nodes fail contrast (worst 1.21:1, on the intro paragraph). The mobile page
overflows sideways, so the logo and cards are cut off. There is no skip link, no `main`, two
unnamed controls and no hreflang despite an English version.

## 3. Components Inventory

### 3.1 Generic components

#### button-primary
- Variants: gold fill ("استكشف المجموعات").
- Sizes: one.
- Visible states: default.
- Padding/Radius: 8px 24px, 10.4 px.
- Confidence: ✅

#### button-outline
- Variants: gold outline ("تعرف أكثر").
- Sizes: one.
- Visible states: default.
- Padding/Radius: same.
- Confidence: ✅

#### stat-card
- Variants: number plus label ("∞ معاني عميقة", "6 مجموعات حصرية", "100% جودة فاخرة").
- Sizes: 3-up.
- Visible states: static.
- Padding/Radius: 10.4 px, 1 px border.
- Confidence: ✅

### 3.2 Signature components

- **Logo roundel:** "مُو" in calligraphy inside a dark circle, repeated in the header and the
  hero. ✅

## 4. Layout & Composition

### 4.1 Grid & containers

Centred and symmetrical, about 900 px of content. Because the layout is centred, it hides
the reading direction rather than using it. ✅

### 4.2 Composition patterns

A centred hero, a stat-card row, then collection cards. ✅

### 4.3 Responsive behavior

| Breakpoint | Behaviour | Confidence |
|---|---|---|
| 1440 | centred | ✅ |
| 375 | the page overflows horizontally; the logo is clipped at the right edge | ✅ |

### 4.4 Image behavior

- Product photos inside dark cards; several rendered black at capture (lazy loading). ⚠️

## 5. Reconstruction Notes

Stack: Next.js or Vite with shadcn/Tailwind (`--sidebar-*`, `oklch` scales). Fonts: Amiri
and Lora.

- Quick wins: full-opacity body text, a 16 px minimum for Amiri UI text, fix the overflow.
- Tricky bits: Amiri's tall marks need a line-height of 1.5 or more at headings.
- Implicit states: not observed.

| Layer | Confidence | Why |
|---|---|---|
| Colors | ✅ | CSS vars |
| Type | ✅ | computed |
| Layout | ✅ | frames |

## 6. Do's and Don'ts

### Do
- Design the Arabic version first and adapt the Latin version to it.
- Use a Naskh display face (`{typography.display-ar}`) for heritage presence.
- Keep the right-to-left direction through cart and checkout.
- Write a short tagline about thread ("الفخامة في كل خيط") as the heading's partner.

### Don't
- Don't lower body text opacity on a dark ground: it is 1.21:1 here.
- Don't set Amiri UI text at 14 px (`{typography.nav-ar}`); Naskh needs more size.
- Don't use a line-height of 1.0 for Naskh headings (`{typography.heading-ar}`).
- Don't fill space with meaningless stats ("∞", "100%").
- Don't centre everything: it hides the right-to-left flow.

## 7. Open Questions

- How the English version is laid out.
- Product page and checkout (the case study claims full RTL).

## 8. Companion files

- `design-tokens.json` (generated by `build_tokens_json.py`).
- Frames are kept outside the repository.
