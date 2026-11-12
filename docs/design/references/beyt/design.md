---
version: anydesign-1
name: BEŶT
source: https://www.beyt.ma/
captured_at: 2026-11-12
description: |
  A Casablanca ceramics house dressed as a French interiors magazine: white paper,
  one deep navy ink, Didot headlines and Georgia text. Colour lives in the objects
  and in a named palette of seventeen glazes, never in the interface.
colors:
  ink: "#1C3754"
  paper: "#FFFFFF"
  rule: "rgba(28,55,84,.14)"
  safran: "#F4C61F"
  grenadine: "#751311"
typography:
  display: { fontFamily: "Didot, 'Bodoni 72', Georgia, serif", fontSize: 91px, fontWeight: 400, lineHeight: 1.0, letterSpacing: -0.015em }
  heading: { fontFamily: "Didot, 'Bodoni 72', Georgia, serif", fontSize: 49px, fontWeight: 400, lineHeight: 1.0, letterSpacing: -0.01em }
  body: { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 17.5px, fontWeight: 400, lineHeight: normal }
  label: { fontFamily: "Changa, sans-serif", fontSize: 11.55px, fontWeight: 400, letterSpacing: 0.1em }
spacing:
  base: 4px
  scale: [8, 13, 26, 52]
rounded:
  none: 0px
shadows:
  popover: "rgba(0,0,0,0.28) 0px 24px 60px 0px"
components:
  nav-link: { textColor: "{colors.ink}", typography: "{typography.label}", padding: 0 0 3px }
  button-primary: { backgroundColor: "{colors.ink}", textColor: "{colors.paper}", typography: "{typography.label}", padding: 13px 26px, rounded: "{rounded.none}" }
  glaze-swatch: { textColor: "{colors.ink}", typography: "{typography.body}" }
---

# Design Analysis: BEŶT

## Source

Live URL, home page in French. Captured with the CSS-variable digest plus Playwright computed
styles and 3 desktop (1440×900) and 3 mobile (375×812) frames. The page is 12,539 px tall, so
the frames sample it rather than cover it. Not seen: product pages and checkout.

## TL;DR

A Moroccan maker presented with the calm of a magazine: a numbered table of contents
("15 — PRESSE", "09 — LA MAISON"), Didot italics and one navy ink. The lesson for us is
**naming colour as part of the craft**. The seventeen glazes have Moroccan place and fruit
names (Grenadine, Safran, Chefchaouen, Mogador, Merzouga), and those names make the palette
feel like a story rather than a token list.

## 1. Visual identity

### 1.1 Surface description

- **Personality:** editorial, sunny, confident, Mediterranean. ✅ (Didot display, sea-and-sun
  hero, magazine section numbers)
- **Mood:** a summer lunch on a terrace. ✅ (the hero photo shows ceramics on a seaside table)
- **Stylistic references:** a French interiors magazine; *Maisons du Maroc* covers appear in
  the press section. ⚠️
- **Information density:** low on the first screen, medium further down (long prose blocks).
  ✅
- **Implicit positioning:** premium Moroccan craft for hotels and design lovers, not
  souvenirs. ✅ ("Projets sur mesure", hotel case studies)

### 1.2 Brand voice / Atmosphere

BEŶT believes Moroccan craft deserves the same editorial respect as a Parisian design
house. The interface therefore takes no colour of its own: one ink, white paper and serif
type, so that the glazes are the only colour on the page. Its sense of humour lives in
the names (Sfenj, Polpo, Dolce), not in the layout.

### 1.3 The "ONE brand thing"

- **The thing:** the named glaze palette, seventeen colours each with a Moroccan name, shown
  as clickable swatches (`glaze-swatch`). ✅
- **Why it carries the brand:** it turns a technical fact (glazes) into geography and
  appetite.
- **Restraint:** the UI uses only `{colors.ink}` (#1C3754). Saffron (#F4C61F) appears as a
  single dot next to "Maison & Objet".
- **Where it appears:** inside the collection sections, never in navigation or buttons.

## 2. Design System (tokens)

### 2.1 Colors

| Token | Hex | Role | Where it appears | Confidence |
|---|---|---|---|---|
| `ink` | #1C3754 | text, primary button, rules | everywhere | ✅ |
| `paper` | #FFFFFF | page | everywhere | ✅ |
| `rule` | rgba(28,55,84,.14) | hairlines | section dividers | ✅ |
| `safran` | #F4C61F | one accent dot | header "Maison & Objet" | ✅ |
| `grenadine` | #751311 | small labels, active underline | "LA RUBRIQUE SUIVANTE", nav underline | ✅ |

### 2.2 Typography

Didot (with Bodoni 72 as fallback) for display, Georgia for text and Changa for small caps
labels. ✅ from computed styles. Didot is a system font on Apple devices; elsewhere it falls
back to Georgia, so Windows users see a much plainer page. ⚠️

| Token | Size | Weight | Line-height | Use |
|---|---|---|---|---|
| `display` | 91px (49 mobile) | 400 | 1.0 | hero line, italic |
| `heading` | 49px (31.5 mobile) | 400 | 1.0 | section titles |
| `body` | 17.5px | 400 | normal | prose, justified on desktop |
| `label` | 11.55px | 400 | normal, +0.1em, uppercase | nav, eyebrows |

### 2.3 Spacing

Multiples of 13 (13, 26, 52) in buttons and cards suggest a 13 px rhythm from a 17.5 px body
size. ⚠️

### 2.4 Radii

None: every edge is square. ✅

### 2.5 Elevation system

| Level | Name | Treatment | Use |
|---|---|---|---|
| 0 | flat | none | everything |
| 1 | popover | `{shadows.popover}` | the catalogue dialog only |

Decorative depth: large pale ceramic silhouettes sit behind text sections as a watermark. ✅

### 2.6 Borders

A 1 px `rule` hairline, and a 3 px grenadine underline for the active nav item. Focus uses
the browser default (no `:focus-visible` rules), but every tab stop is visible. ✅

### 2.7 Accessibility quick-check

0 of 223 text nodes fail contrast. Navy on white is 12.2:1. There is no skip link and no
`main` landmark. 9 mobile targets are under 24 px. Reduced motion is respected.

## 3. Components Inventory

### 3.1 Generic components

#### nav-link
- Variants: default and active (grenadine underline).
- Sizes: one, 11.55 px uppercase with +0.1em tracking.
- Visible states: active ✅, hover not seen.
- Padding/Radius: 0 0 3px, square.
- Confidence: ✅

#### button-primary
- Variants: 1 observed ("DEMANDER LE CATALOGUE →").
- Sizes: one.
- Visible states: default only.
- Padding/Radius: 13px 26px, square, navy fill.
- Confidence: ✅

#### glaze-swatch
- Variants: one per glaze (17), as text buttons ("GRENADINE").
- Sizes: one.
- Visible states: default seen.
- Padding/Radius: text only.
- Confidence: ⚠️ (the swatch visuals were not in the sampled frames)

### 3.2 Signature components

- **Magazine table of contents:** numbered sections ("09 — LA MAISON", "15 — PRESSE") with a
  "p.10" folio, so the home page reads like an issue of a magazine. ✅
- **Scalloped band:** a navy band with a scalloped edge under section titles (like a plate
  rim). ✅

## 4. Layout & Composition

### 4.1 Grid & containers

About 1110 px of content inside 1440 px. Text sections are two columns: an image on one
side, prose on the other. Hierarchy comes from size and italics, not weight. ✅

### 4.2 Composition patterns

A full-bleed photo hero, a centred logo header, then alternating image and text "articles",
and a press list next to a magazine cover. ✅

### 4.3 Responsive behavior

| Breakpoint | Behaviour | Confidence |
|---|---|---|
| 1440 | centred logo with split nav | ✅ |
| 375 | burger menu, the hero stays full screen, h1 at 49 px | ✅ |

Targets: 9 under 24 px on mobile (language links "FR / EN" are about 12 px tall).

### 4.4 Image behavior

- Lifestyle photography in sun, by the sea, edge to edge. ✅
- Press covers shown as objects with a caption. ✅
- Ceramic silhouettes as pale background watermarks. ✅

## 5. Reconstruction Notes

Stack: a custom static site (no framework signal). Fonts: system Didot and Georgia plus
Changa from Google Fonts.

- Quick wins: a skip link, a `main` landmark, and bigger language targets.
- Tricky bits: Didot is not available on Windows or Android, so the look depends on the
  device; justified prose.
- Implicit states: hover, focus, loading, empty and error were not observed.

| Layer | Confidence | Why |
|---|---|---|
| Colors | ✅ | CSS vars |
| Type | ✅ | computed styles |
| Components | ⚠️ | few seen |

## 6. Do's and Don'ts

### Do
- Give every colour in the palette a local name, as the glazes are named (Grenadine, Mogador).
- Keep the interface to one ink, `{colors.ink}` (#1C3754), so the objects carry the colour.
- Number sections only because the home page is laid out like a magazine issue.
- Use one tiny accent, `{colors.safran}` (#F4C61F), as a dot rather than a fill.
- Show press and stockists as objects with captions.

### Don't
- Don't rely on a system font (Didot) that half the audience does not have.
- Don't justify prose on screen: it opens rivers in Georgia at 17 px.
- Don't set navigation at 11.5 px uppercase: the targets are too small on phones.
- Don't add colour to buttons; the primary button stays ink.
- Don't round anything: the system is square.

## 7. Open Questions

- What the glaze swatches look like and how they behave (not in the sampled frames).
- Product, cart and checkout pages were not captured.

## 8. Companion files

- `design-tokens.json` (generated by `build_tokens_json.py`).
- Frames are kept outside the repository (third-party images are not committed).
