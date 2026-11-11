---
version: anydesign-1
name: Thmanyah
source: https://thmanyah.com/
captured_at: 2026-11-11
description: |
  Saudi Arabic-language media company (articles, podcasts, newsletters). Arabic-first,
  RTL-native. Warm off-white ground, black type in IBM Plex Sans Arabic, bold illustrated
  newsletter covers with expressive Arabic lettering, and one orange accent.
colors:
  surface: "#F6F4EE"
  surface-raised: "#FFFFFF"
  text-primary: "#000000"
  text-heading: "#1F1E1C"
  accent: "#FA541C"
  nav-active: "#EFEDE8"
  border: "#D9D9D9"
typography:
  section: { fontFamily: "IBM Plex Sans Arabic, sans-serif", fontSize: 24px, fontWeight: 600, lineHeight: 1.24 }
  headline: { fontFamily: "IBM Plex Sans Arabic, sans-serif", fontSize: 20px, fontWeight: 600, lineHeight: 1.6 }
  body: { fontFamily: "IBM Plex Sans Arabic, sans-serif", fontSize: 16px, fontWeight: 400, lineHeight: 1.15 }
  button: { fontFamily: "IBM Plex Sans Arabic, sans-serif", fontSize: 14px, fontWeight: 600, lineHeight: 1.43 }
spacing:
  base: 4px
  scale: [8, 12, 16, 24, 32, 48]
rounded:
  control: 8px
  media: 16px
components:
  button-primary: { backgroundColor: "{colors.text-primary}", textColor: "#F5EFEC", rounded: "{rounded.control}", padding: 0 16px }
  button-secondary: { backgroundColor: "{colors.surface-raised}", textColor: "{colors.text-heading}", rounded: "{rounded.control}", padding: 0 16px }
  nav-pill: { backgroundColor: "{colors.nav-active}", textColor: "{colors.text-primary}", rounded: "{rounded.control}", padding: 8px 12px }
  article-row: { backgroundColor: "{colors.surface}", textColor: "{colors.text-heading}", rounded: "{rounded.control}" }
---

# Design Analysis: Thmanyah

> Analysis generated with the `anydesign` skill. Date: 2026-11-11. Emphasis: RTL and Arabic typography reference

## Source

Live URL. Computed styles plus 3 + 3 frames (desktop and mobile). The CSS-variable fetch
was rate-limited (HTTP 429), so colours come from computed styles. The rebrand is by Milk
Network with a logotype by Wael Morcos (Behance). Limitations: home page only.

## TL;DR

Arabic designed in Arabic, not translated into it. The layout grows from the right edge:
the logo sits top-right, the nav reads right to left, and images sit at the start of each
row (on the right). Arabic headlines get generous line-height (1.6) while UI labels stay
compact. Dates use Arabic month names with **Western digits** ("11 نوفمبر 2026").

## 1. Visual identity

### 1.1 Surface description

- Personality: literate, contemporary, warm, confident ✅
- Mood: a good weekend paper ✅
- Stylistic references: international editorial sites, adapted natively ⚠️
- Information density: high in article lists, airy at the top ✅
- Implicit positioning: premium Arabic journalism ✅

### 1.2 Brand voice / Atmosphere

Thmanyah treats Arabic as a contemporary design language. The custom lettering on
newsletter covers is the expressive layer, while the UI face stays neutral and readable.

### 1.3 The "ONE brand thing"

- The thing: illustrated newsletter covers with bold custom Arabic lettering.
- Why: they show Arabic letterforms as image, which Latin sites can't copy.
- Restraint: the UI stays black on off-white, with one orange used for author names and "more".
- Where: the newsletter strip and programme thumbnails.

## 2. Design System (tokens)

### 2.1 Colors

| Token | Hex | Role | Where it appears | Confidence |
|---|---|---|---|---|
| `surface` | #F6F4EE | ground | body, header | ✅ |
| `surface-raised` | #FFFFFF | secondary buttons | "Sign in" | ✅ |
| `text-primary` | #000000 | text, primary button | everywhere | ✅ |
| `text-heading` | #1F1E1C | headings (black at 88%) | h2, h3 | ✅ |
| `accent` | #FA541C | author names, "more" | links | ✅ |
| `nav-active` | #EFEDE8 | active nav pill | header | ✅ |
| `border` | #D9D9D9 | button outlines | buttons | ✅ |

### 2.2 Typography

IBM Plex Sans Arabic (✅ computed) in 400, 600 and 700. Latin words inside Arabic headlines
("PRIMETIME", "The Social Reckoning") fall back to Plex's Latin, so the two scripts share
one design.

| Token | Size | Weight | Line-height | Use |
|---|---|---|---|---|
| `section` | 24px | 600 | 1.24 | section titles with an icon |
| `headline` | 20px desktop / 16px mobile | 600 | 1.6 / 1.5 | article titles |
| `body` | 16px | 400 | 1.15 | UI baseline (dek text renders taller) |
| `button` | 14px | 600 | 1.43 | buttons |

No letter-spacing anywhere, which is right for Arabic, where tracking breaks the joins.

### 2.3 Spacing

A 4px base. Rows are separated by about 32px with hairlines between sections. ⚠️

### 2.4 Radii

8px on controls and pills, about 16px on the hero banner and thumbnails. ✅

### 2.5 Elevation system

| Level | Name | Treatment | Use |
|---|---|---|---|
| 0 | flat | none | page |
| 1 | lift | 0 2px 0 rgba(95,75,25,.1) | buttons |

### 2.6 Borders

1px #D9D9D9 on secondary buttons. 6 `:focus-visible` rules, and 24 of 25 tab stops showed an indicator. ✅

### 2.7 Accessibility quick-check

From `design-a11y.md`: body 19.09:1 and headings 15.14:1, but the orange author links are
**3.01:1, a fail for 16px text**. The page scan found 41 failing nodes, mostly the orange.
No `main` landmark, no `h1` and no skip link.

## 3. Components Inventory

### 3.1 Generic components

#### button-primary
- Black, 8px radius, a small sun icon, 14px semibold ✅

#### button-secondary
- White with a #D9D9D9 border and 8px radius ✅

#### nav-pill
- The active section shows as a pale pill ✅

#### article-row
- Thumbnail at the start (right) and text after it: headline, dek, then the meta line with author avatar, author (orange), source and date ✅

### 3.2 Signature components

- **Newsletter cover strip**: square tiles, each a different colour, carrying custom Arabic lettering.

## 4. Layout & Composition

### 4.1 Grid & containers

A centred container of about 1080px with a two-column article grid. ✅

### 4.2 Composition patterns

Banner, then two-column article rows, a podcast strip, a newsletter cover strip, a video strip and a long article list.

### 4.3 Responsive behavior

The nav moves under the logo as pills, and two columns become one. 39 small targets on mobile. ⚠️

### 4.4 Image behavior

- Editorial illustrations and portraits, square or 4:3, with 8–16px radius.

## 5. Reconstruction Notes

RTL reference. Borrow: start-anchored layout, generous Arabic headline line-height, no
tracking on Arabic, Western digits with Arabic month names, and one family covering both
scripts. Avoid: a low-contrast accent for text links.

| Layer | Confidence | Why |
|---|---|---|
| Colour | ✅ | computed |
| Type | ✅ | computed |
| RTL behaviour | ✅ | seen in all frames |

## 6. Do's and Don'ts

### Do
- Anchor the logo, nav and thumbnails to the inline start (the right edge in Arabic).
- Give Arabic headlines line-height of at least 1.5.
- Never letter-space Arabic.
- Use one type family with matching Arabic and Latin designs for mixed strings.
- Show dates as Arabic month plus Western digits when the audience uses Western digits.

### Don't
- Don't use #FA541C-style orange for small text on off-white (3.01:1).
- Don't skip `main`, `h1` and the skip link.
- Don't size icon buttons under 24px.

## 7. Open Questions

- Article-page reading typography (long-form line-height and measure) was not captured.

## 8. Companion files

- `design-tokens.json` (generated)
- `design-a11y.md`
