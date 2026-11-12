---
version: anydesign-1
name: Najdunes
source: https://najdunes.com/
captured_at: 2026-11-12
description: |
  An Arabic-first studio site from Riyadh: a dark sand-and-ink ground, one Sadu red and
  IBM Plex Sans Arabic in large, light weights. The type tokens are defined twice, once
  per script, which is the clearest bilingual type system in this research.
colors:
  ink: "#1E1915"
  ink-raised: "#2B2521"
  dune: "#EFE3CF"
  dune-dim: "#B9B0A0"
  dune-mist: "#F8F3E9"
  sadu: "#A8262B"
  sadu-lit: "#ED756F"
  mud: "#8A4B2F"
  mud-lit: "#E0B29F"
typography:
  display-ar: { fontFamily: "IBM Plex Sans Arabic, IBM Plex Sans, sans-serif", fontSize: 75.5px, fontWeight: 300, lineHeight: 1.35, letterSpacing: 0 }
  heading-ar: { fontFamily: "IBM Plex Sans Arabic, sans-serif", fontSize: 35.2px, fontWeight: 500, lineHeight: 1.45 }
  lead-ar: { fontFamily: "IBM Plex Sans Arabic, sans-serif", fontSize: 22.56px, fontWeight: 400, lineHeight: 1.75 }
  body-ar: { fontFamily: "IBM Plex Sans Arabic, sans-serif", fontSize: 18px, fontWeight: 400, lineHeight: 1.85 }
  eyebrow-ar: { fontFamily: "IBM Plex Sans Arabic, sans-serif", fontSize: 14.4px, fontWeight: 500, lineHeight: 1.75 }
  display-latin: { fontFamily: "IBM Plex Sans, sans-serif", fontSize: 61px, fontWeight: 300, lineHeight: 1.1, letterSpacing: -0.037rem }
spacing:
  base: 8px
  scale: [8, 16, 22, 32, 48, 80]
rounded:
  sm: 4px
  card: 12px
  pill: 999px
components:
  button-primary: { backgroundColor: "{colors.sadu}", textColor: "{colors.dune}", rounded: "{rounded.pill}", padding: 11.2px 22.4px }
  button-secondary: { textColor: "{colors.dune}", rounded: "{rounded.pill}", padding: 11.2px 22.4px }
  skip-link: { backgroundColor: "{colors.dune}", textColor: "{colors.ink}", rounded: "{rounded.sm}", padding: 8px 16px }
  project-card: { backgroundColor: "{colors.ink-raised}", textColor: "{colors.dune}", rounded: "{rounded.card}" }
  tag-pill: { textColor: "{colors.dune-dim}", rounded: "{rounded.pill}" }
---

# Design Analysis: Najdunes

## Source

Live URL, Arabic home page (the default; English is at `/en/`). Captured with the CSS-variable
digest (140 vars) plus Playwright computed styles and 3 desktop and 3 mobile frames. Limitation:
the home page only, and the hero is a WebGL dune scene that a static frame cannot judge.

## TL;DR

Arabic set large and light, with nothing borrowed from a Latin layout. The headline is
IBM Plex Sans Arabic at weight 300, 75 px, line-height 1.35. The point to take away is in its
CSS: every type token has an Arabic value and a Latin value. Arabic body text is 1.125rem
against 1rem, h1 line-height 1.4 against 1.1, and tracking is 0 against −0.037rem. That is
exactly the "pair of scales" the RTL literature recommends.

## 1. Visual identity

### 1.1 Surface description

- **Personality:** calm, warm, precise, local. ✅
- **Mood:** the desert at dusk. ✅ (an ink-brown ground, sand text, a dune heightmap)
- **Stylistic references:** a type foundry specimen page crossed with a portfolio. ⚠️
- **Information density:** low; one idea per screen. ✅
- **Implicit positioning:** a founder-led, honest small studio ("concept work is labelled as
  concept work"). ✅

### 1.2 Brand voice / Atmosphere

Najdunes believes an Arabic reader should never feel they are reading a translation. Arabic
gets its own sizes, line heights and words, and English is written separately. The palette
comes from one landscape (dune, mud, Sadu weaving red), so every surface feels like the same
place at a different hour.

### 1.3 The "ONE brand thing"

- **The thing:** the light-weight Arabic display line (IBM Plex Sans Arabic 300 at 75 px) on
  `{colors.ink}` (#1E1915). ✅
- **Why it carries the brand:** big, quiet Arabic shows the studio's claim before any
  sentence does.
- **Restraint:** the only colour is `{colors.sadu}` (#A8262B), on the primary button and one
  pill.
- **Where it appears:** the hero and section titles; never on body copy.

## 2. Design System (tokens)

### 2.1 Colors

| Token | Hex | Role | Where it appears | Confidence |
|---|---|---|---|---|
| `ink` | #1E1915 | page background (dark) | everywhere | ✅ |
| `ink-raised` | #2B2521 | cards | project cards, offer card | ✅ |
| `dune` | #EFE3CF | text on dark | body, headings | ✅ |
| `dune-dim` | #B9B0A0 | secondary text, outlines | eyebrows, tag outlines | ✅ |
| `dune-mist` | #F8F3E9 | light surface (light theme) | alt theme | ✅ |
| `sadu` | #A8262B | primary action | "ابدأ مشروعك" button | ✅ |
| `sadu-lit` | #ED756F | accent text on dark | links, active nav underline | ✅ |
| `mud` | #8A4B2F | muted text (light theme) | alt theme | ✅ |
| `mud-lit` | #E0B29F | muted text (dark theme) | alt theme | ✅ |

The CSS defines the full palette as a "dawn, noon, dusk, night" set that follows the sun. ⚠️

### 2.2 Typography

IBM Plex Sans Arabic paired with IBM Plex Sans (same designer family). ✅

| Token | Size | Weight | Line-height | Use |
|---|---|---|---|---|
| `display-ar` | 75.5px (42.6 mobile) | 300 | 1.35 | hero |
| `heading-ar` | 35.2px | 500 | 1.45 | section titles |
| `lead-ar` | 22.56px | 400 | 1.75 | intro paragraph |
| `body-ar` | 18px | 400 | 1.85 | body |
| `eyebrow-ar` | 14.4px | 500 | 1.75 | small labels, no tracking |
| `display-latin` | 61px | 300 | 1.1, −0.037rem | the English version |

### 2.3 Spacing

An 8 px base. Observed: 8, 16, 22.4 (button padding), 32, 48, 80. ✅

### 2.4 Radii

Three tiers: 4 px for the skip link, about 12 px for cards, and 999 px for buttons and tags.
✅

### 2.5 Elevation system

| Level | Name | Treatment | Use |
|---|---|---|---|
| 0 | ground | `{colors.ink}` | page |
| 1 | raised | `{colors.ink-raised}` tone, no shadow | cards |

Depth comes from surface tone, not from shadows. Decorative depth: the WebGL dune field under
the hero. ✅

### 2.6 Borders

1 px `dune-dim` outlines on secondary buttons and tags, and 1 px `mud` lines under the header.
Focus is `2px solid var(--color-accent-text)` (`--focus-ring`). ✅

### 2.7 Accessibility quick-check

0 of 59 text nodes fail contrast: dune on ink is about 13:1 and dune-dim on ink about 8:1.
There is a skip link in Arabic ("انتقل إلى المحتوى") and full hreflang. No target is under
24 px. 21 of 25 tab stops show focus; 4 do not.

## 3. Components Inventory

### 3.1 Generic components

#### button-primary
- Variants: 1 (Sadu fill).
- Sizes: one, 18 px weight 500.
- Visible states: default.
- Padding/Radius: 11.2px 22.4px, pill.
- Confidence: ✅

#### button-secondary
- Variants: outline.
- Sizes: one.
- Visible states: default.
- Padding/Radius: same as primary, 1 px dune border.
- Confidence: ✅

#### skip-link
- Variants: one, Arabic text.
- Sizes: 18 px.
- Visible states: focus.
- Padding/Radius: 8px 16px, 4 px.
- Confidence: ✅

#### project-card
- Variants: one; heights vary deliberately (a staggered row).
- Sizes: 4 per row on desktop.
- Visible states: default.
- Padding/Radius: about 12 px radius, image on top.
- Confidence: ⚠️

#### tag-pill
- Variants: neutral outline and Sadu outline ("العرض الأشمل").
- Sizes: one.
- Visible states: default.
- Padding/Radius: pill.
- Confidence: ✅

### 3.2 Signature components

- **Dune hero:** a WebGL heightmap of the Najd dunes behind the headline, with a hint
  ("مرّر فوق الرمل، فتتبعك الريح") inviting the visitor to move the pointer over the sand. ✅
- **Staggered project row:** four cards set at different heights, like dunes. ✅

## 4. Layout & Composition

### 4.1 Grid & containers

1280 px content inside 1440. Everything grows from the right edge (the inline start). Section
titles sit on the inline start and the content beside them. ✅

### 4.2 Composition patterns

A full-bleed dark hero with the headline on the inline start, a staggered card row, then a
split section (title and lead on the start, an offer card on the end). ✅

### 4.3 Responsive behavior

| Breakpoint | Behaviour | Confidence |
|---|---|---|
| 1440 | 4 cards in a row, inline nav | ✅ |
| 375 | burger menu, h1 42.6 px over 3 lines, buttons side by side | ✅ |

Touch targets: none under 24 px.

### 4.4 Image behavior

- Project mock-ups inside cards (all labelled as concept work). ✅
- A procedural dune scene, not a photograph. ✅

## 5. Reconstruction Notes

Stack: Astro (`/_astro/` assets). Fonts: IBM Plex Sans Arabic and IBM Plex Sans.

- Quick wins: visible focus on the 4 tab stops that lack it; fix the white band where the
  card row overlaps the next section.
- Tricky bits: the WebGL dunes and their reduced-motion fallback; the per-script token pairs.
- Implicit states: loading and error were not observed.

| Layer | Confidence | Why |
|---|---|---|
| Colors | ✅ | CSS vars |
| Type | ✅ | per-script vars plus computed styles |
| Layout | ⚠️ | home page only |

## 6. Do's and Don'ts

### Do
- Define every type token twice, Arabic and Latin, as `--type-h1-line-height` does (1.4 against 1.1).
- Set Arabic display text light and large: `{typography.display-ar}` (300 at 75 px, 1.35).
- Keep Arabic tracking at 0 even where the Latin token is negative.
- Take the whole palette from one place (dune, mud, Sadu), and name each colour after it.
- Use surface tone (`{colors.ink-raised}`) rather than shadows for cards.

### Don't
- Don't letter-space Arabic eyebrows; this site keeps them at weight 500 without tracking.
- Don't use more than one saturated colour: `{colors.sadu}` is the only one.
- Don't mirror icons that are not directional (the logo stays as drawn).
- Don't drop body text below 18 px in Arabic.
- Don't leave layout seams: the card row spills into a white band between sections.

## 7. Open Questions

- What the light ("noon") theme looks like and when it switches.
- How the dunes behave with reduced motion.

## 8. Companion files

- `design-tokens.json` (generated by `build_tokens_json.py`).
- Frames are kept outside the repository.
