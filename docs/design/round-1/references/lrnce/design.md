---
version: anydesign-1
name: LRNCE
source: https://lrnce.com/
captured_at: 2026-11-11
description: |
  Marrakech studio for hand-painted ceramics and textiles. Warm sand paper ground, black
  type, one terracotta accent. The photography is grainy, close and saturated, and does
  almost all the work; the chrome is deliberately plain and slightly naive.
colors:
  surface: "#EEE3D4"
  text-primary: "#000000"
  text-body: "#333333"
  accent: "#945738"
  border: "#40291F"
typography:
  display-serif: { fontFamily: "Georgia, serif", fontSize: 42px, fontWeight: 400, lineHeight: 1.5 }
  heading: { fontFamily: "Georgia, serif", fontSize: 40px, fontWeight: 500, lineHeight: 1.2 }
  nav: { fontFamily: "Harmonia Sans, sans-serif", fontSize: 16px, fontWeight: 500, lineHeight: 1.5, textTransform: uppercase }
  body: { fontFamily: "Harmonia Sans, sans-serif", fontSize: 16px, fontWeight: 400, lineHeight: 1.5 }
spacing:
  base: 8px
  scale: [8, 16, 24, 36, 54, 81]
rounded:
  input: 3px
  button: 4px
  pill: 50px
components:
  button-pill: { backgroundColor: "{colors.surface}", textColor: "{colors.text-primary}", rounded: "{rounded.pill}", padding: 0 10px }
  button-accent: { backgroundColor: "{colors.accent}", textColor: "#FFFFFF", rounded: "{rounded.button}" }
  nav-bar: { backgroundColor: "{colors.surface}", textColor: "{colors.text-body}" }
---

# Design Analysis: LRNCE

> Analysis generated with the `anydesign` skill. Date: 2026-11-11. Emphasis: mood + design system (reference for a handmade Moroccan shop, not for reconstruction)

## Source

Live URL. CSS-variable digest plus Playwright computed styles and 3 desktop + 3 mobile
frames. The capture script dismissed the consent banner in a throwaway headless session.
Limitations: home page only, no product page, no hover states.

## TL;DR

The photographs are the design. Full-bleed, grainy, warm-flash still lifes of hand-painted
plates fill the first screen. Everything else is sand paper and black text set in a plain
sans, with one terracotta colour. The lesson for us is to let the work's own colour be the
palette and keep the UI almost silent.

## 1. Visual identity

### 1.1 Surface description

- Personality: warm, naive, tactile, confident, unpolished on purpose ✅
- Mood: a Marrakech studio table at dusk ✅
- Stylistic references: 1970s craft catalogues and analogue film photography ⚠️
- Information density: low on the home page, a dense multi-column footer ✅
- Implicit positioning: design-literate handmade, priced as craft not souvenir ⚠️

### 1.2 Brand voice / Atmosphere

LRNCE believes its customer already loves the objects and needs no persuasion, only to
see them closely. The interface stays flat and almost amateurish so the hand-painted
marks stay the most expressive thing on the page. ⚠️

### 1.3 The "ONE brand thing"

- The thing: a full-bleed, film-grain still life of the work, shot close with warm flash.
- Why: it shows the hand-painted mark at the scale where the craft is visible.
- Restraint: the UI is one sand colour, black text and a single terracotta.
- Where: the hero and editorial blocks; never shrunk into a uniform card grid on the home page.

## 2. Design System (tokens)

### 2.1 Colors

| Token | Hex | Role | Where it appears | Confidence |
|---|---|---|---|---|
| `surface` | #EEE3D4 | page ground | body, header, footer | ✅ |
| `text-primary` | #000000 | headings, nav | h1, nav links | ✅ |
| `text-body` | #333333 | body | header, footer text | ✅ |
| `accent` | #945738 | the one colour | sign-up button, wordmark band, "Gift edit" tag | ✅ |
| `border` | #40291F | input outline | newsletter inputs | ✅ |

### 2.2 Typography

Harmonia Sans for the UI (✅ computed) and Georgia for editorial lines (✅). The
serif/sans split is the main typographic gesture.

| Token | Size | Weight | Line-height | Use |
|---|---|---|---|---|
| `display-serif` | 42px (20px mobile) | 400 | 1.5 | editorial intro paragraph |
| `heading` | 40px | 500 | 1.2 | section titles |
| `nav` | 16px | 500 | 1.5 | uppercase nav |
| `body` | 16px | 400 | 1.5 | everything else |

### 2.3 Spacing

The WordPress preset scale is 0.44 / 0.67 / 1 / 1.5 / 2.25 / 3.38 / 5.06 rem, a 1.5× ratio. ✅

### 2.4 Radii

3px inputs, 4px solid buttons and 50px pills for outline buttons. Images are square-cornered. ✅

### 2.5 Elevation system

| Level | Name | Treatment | Use |
|---|---|---|---|
| 0 | flat | none | the whole page |

Flat by design: depth comes from the photographs.

### 2.6 Borders

1px black or #40291F on inputs and pill buttons. Focus uses the browser default plus 27 `:focus-visible` rules. ✅

### 2.7 Accessibility quick-check

From `design-a11y.md`: body on sand 9.97:1 AAA, headings 16.57:1, sign-up button 5.71:1 AA,
and the wordmark band 4.5:1 (AA, just). The automated scan found 0 text-contrast failures,
but 7 of 25 tab stops landed in hidden menus.

## 3. Components Inventory

### 3.1 Generic components

#### button-pill
- Variants: outline pill ("Subscribe", "Cart"), 1 observed ✅
- Sizes: one, 17px uppercase text
- States: hover not captured ❓
- Padding/Radius: 0 10px / 50px

#### button-accent
- Variants: solid terracotta ("Sign up") ✅
- Sizes: one
- States: not captured ❓
- Padding/Radius: 4px radius

#### nav-bar
- A single row of uppercase links, with the wordmark on the left and utilities on the right ✅
- Becomes a hamburger, centred wordmark and bag on mobile ✅

### 3.2 Signature components

- **Repeating wordmark band**: a terracotta strip with the logotype tiled edge to edge
  above the footer. It acts as brand punctuation.

## 4. Layout & Composition

### 4.1 Grid & containers

Full-bleed media, a two-column editorial collage and a five-column footer matrix. No visible max-width on media. ✅

### 4.2 Composition patterns

Full-bleed photo hero, then an asymmetric two-up collage, then a centred serif newsletter line, a wordmark band and a dense footer.

### 4.3 Responsive behavior

Two-up becomes one-up. On mobile the hero becomes a pink "Gift shop" panel with the
type set large. 7 small (<24px) targets on mobile. ⚠️

### 4.4 Image behavior

- Product and still-life photography: full-bleed, cover-cropped, grainy, warm.
- Collage cut-outs of objects on a saturated ground.

## 5. Reconstruction Notes

Not for reconstruction; this is a principles reference. Quick wins to borrow:
a single accent colour, a serif for editorial voice only, and photos without frames.
Tricky bits: film-grain photography is content, not CSS.

| Layer | Confidence | Why |
|---|---|---|
| Colour | ✅ | computed and CSS vars |
| Type | ✅ | computed |
| Components | ⚠️ | home page only |

## 6. Do's and Don'ts

### Do
- Let a photograph fill the first screen at full bleed.
- Keep `{colors.accent}` (#945738) as the single chromatic UI colour.
- Use the serif for one editorial sentence, not for every heading.
- Keep chrome flat: no shadows, no card borders.
- List the studio's address and opening hours in the footer; it builds trust.

### Don't
- Don't stack a newsletter popup, a chat bubble and a cookie bar on the first screen (LRNCE does).
- Don't hide focusable links in collapsed menus.
- Don't let uppercase nav become the only hierarchy device.

## 7. Open Questions

- Product page layout and gallery behaviour were not captured.
- Hover and focus styles were not captured.

## 8. Companion files

- `design-tokens.json` (generated by `build_tokens_json.py`)
- `design-a11y.md`
- Frames are kept out of the repo (third-party images).
