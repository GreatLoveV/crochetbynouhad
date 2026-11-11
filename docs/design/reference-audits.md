# Reference audits (design-auditor)

Run on 2026-11-11 with the `design-auditor` skill's scoring rules:

```
Score = 100 − (🚫 blockers × 12) − (🔴 criticals × 8) − (🟡 warnings × 4) − (🟢 tips × 1)
```

All inputs are **live URLs**, so confidence is 🟡 Medium. The skill's medium-confidence
modifier halves warnings and tips (🟡 −2, 🟢 −0.5); blockers and criticals count in full.
Repeated issues with one root cause count once. Inferred settings: full page audit ·
production · WCAG AA.

## Method (same for every site)

- **Measured** with Playwright in a clean headless browser, on the home page, at
  1440×900 and 390×844. Consent banners were declined where possible.
  - Text contrast for up to 400 visible text nodes against the nearest opaque ancestor
    background. This misses text over photos, so I checked failures by eye in the frames.
  - Images without `alt`.
  - Interactive elements with no accessible name.
  - Mobile targets under 24×24 px.
  - Skip link, `main`, `h1` count, `lang` and `dir`, `hreflang`.
  - `prefers-reduced-motion` and `:focus-visible` rules in readable stylesheets.
  - Keyboard: 25 Tab presses, checking whether focus is visible and on screen.
- **Looked at:** first-screen and scrolled frames, desktop and mobile.
- **Deep audits** (with an anydesign analysis in `references/<site>/`): LRNCE, Heath,
  Laine, Tekla, Thmanyah. **Quick audits:** the other seven use the same measurements and
  rules, but I reviewed fewer frames.
- **Limitations:**
  - Home pages only. Hover, error and loading states can't be seen on a live home page.
  - Third-party stylesheets that block reading count as "no rule found".
  - Each site's score is for its home page on this date, not the whole site.

## Scores

| Site | Type | Overall | Accessibility* | Deep? |
|---|---|---|---|---|
| PetiteKnit | knit designer (DK) | **85** | 92 | quick + keyboard |
| Laine Publishing | knit magazine/shop (FI) | 74 | 78 | ✅ |
| Heath Ceramics | handmade pottery (US) | 73 | 78 | ✅ |
| Thmanyah | Arabic media (SA) | 66 | 66 | ✅ |
| La Bien Aimée | hand-dyed yarn (FR) | 64 | 66 | quick + keyboard |
| Pom Pom | knit magazine/shop (UK) | 64 | 68 | quick + keyboard |
| LRNCE | Moroccan ceramics/textiles | 63 | 66 | ✅ |
| Tekla | textiles (DK) | 62 | 64 | ✅ |
| Wool and the Gang | knit kits (UK) | 50 | 52 | quick |
| 29LT | Arabic/Latin type foundry | 50 | 54 | quick |
| Mathaf | Arabic art museum (QA) | 50 | 52 | quick |
| Jameel Arts Centre | bilingual arts centre (AE) | 50 | 52 | quick |

\* The accessibility score uses the same formula on Cat 2, 6, 7, 15 and 16 only.

**Benchmark: 85 (PetiteKnit).** One caveat: its home page has very little live text (21
nodes, with most words inside images), which leaves less room to fail text checks. Our
target is **86 or higher**, which also meets the 85 minimum.

## Deep audits

### PetiteKnit — 85/100
- 🔴 9 of 25 mobile targets are under 24 px (language flag, icon buttons).
- 🟡 Two `h1`s and an H2 before the H1 (heading order).
- 🟡 No `prefers-reduced-motion` rule.
- 🟡 Footer microtext is about 10 px.
- 🟢 Uppercase labels used as the only section device.
- ✅ Skip link, 0 contrast failures, every tab stop visibly focused, `hreflang` for 5
  languages, and the cookie dialog gives "Decline all" equal weight.

`100 − (1 × 8) − (3 × 4 × 0.5) − (1 × 1 × 0.5) = 85.5 → 85`

### Laine Publishing — 74/100
- 🚫 White text on light photos ("52 projects that use a maximum of 100 grams…"),
  1:1 against the measured ground. Fails WCAG 1.4.3.
- 🔴 50 of 255 mobile targets are under 24 px.
- 🟡 No `h1` on the home page.
- 🟡 A pinned "Get 10% off" widget overlaps content on every screen.
- 🟡 12 px uppercase bold labels are the main navigation.
- ✅ Skip link, 33 focus-visible rules, reduced motion respected, full `hreflang`.

`100 − (1 × 12) − (1 × 8) − (3 × 4 × 0.5) = 74`

### Heath Ceramics — 73/100
- 🚫 39 text nodes fail contrast (worst 2.86:1, light text in the mega menu and on
  photos). WCAG 1.4.3.
- 🔴 45 of 128 mobile targets are under 24 px.
- 🟡 No `h1`.
- 🟡 Body text set at 13 px.
- 🟡 A third-party accessibility overlay widget, which is no substitute for accessible markup.
- 🟢 Product photos use `alt=""` next to a visible name (acceptable, but loses the image
  description).
- ✅ Skip link, every tab stop focused, reduced motion respected, all tokens AAA.

`100 − 12 − 8 − (3 × 2) − 0.5 = 73.5 → 73`

### Thmanyah — 66/100 (RTL reference)
- 🚫 Orange author links #FA541C on #F6F4EE are 3.01:1 at 16 px. WCAG 1.4.3.
- 🚫 No skip link. WCAG 2.4.1.
- 🔴 39 of 98 mobile targets are under 24 px.
- 🟡 No `main` landmark and no `h1`.
- ✅ **i18n/RTL is excellent:**
  - `lang="ar" dir="rtl"`.
  - The whole layout grows from the right.
  - Arabic is never letter-spaced.
  - Headlines use line-height 1.5–1.6.
  - Latin words inside Arabic text come from the same family (IBM Plex Sans Arabic).
  - Dates use Arabic months with Western digits.
  - Reduced motion is respected.

`100 − 12 − 12 − 8 − 2 = 66`

### LRNCE — 63/100
- 🚫 6 interactive elements have no accessible name (icon links). WCAG 4.1.2.
- 🚫 7 of 25 Tab stops land inside hidden menus, so focus disappears. WCAG 2.4.7.
- 🔴 Mobile targets under 24 px (5 of 16 on the first screen).
- 🟡 Two `h1`s.
- 🟡 A newsletter popup, chat bubble, promo bar and cookie bar all appear on the first screen.
- 🟢 No `footer` landmark.
- ✅ 0 contrast failures, all tokens AA or better, skip link, reduced motion respected.

`100 − 12 − 12 − 8 − (2 × 2) − 0.5 = 63.5 → 63`

### Tekla — 62/100
- 🚫 The copyright line is 2.68:1. WCAG 1.4.3.
- 🚫 No skip link. WCAG 2.4.1.
- 🔴 85 of 100 mobile targets are under 24 px.
- 🟡 No `main` landmark and no `h1`.
- 🟡 Body text in weight 300 at 14 px.
- 🟡 2 of 25 tab stops have no visible focus.
- ✅ An honest consent dialog ("Only necessary" has equal weight), and reduced motion is respected.

`100 − 12 − 12 − 8 − (3 × 2) = 62`

## Quick audits

| Site | Issues | Arithmetic |
|---|---|---|
| La Bien Aimée | 🚫 contrast (16 nodes, text over photos) · 🚫 6 unnamed controls · 🔴 small targets · 🟡 two `h1` · 🟡 crowded first screen (two promo bars, 11 nav items) | 100−12−12−8−2−2 = **64** |
| Pom Pom | 🚫 3 images with no `alt` · 🚫 23 of 25 Tab stops land in hidden menus · 🔴 small targets · 🟡 signup modal on load · 🟡 no reduced-motion rule | 100−12−12−8−2−2 = **64** |
| Wool and the Gang | 🚫 contrast (white hero text on photo) · 🚫 no skip link · 🚫 unnamed controls · 🔴 small targets · 🟡 no `main`/`h1` · 🟡 no reduced motion · 🟡 no focus-visible rules | 100−36−8−6 = **50** |
| 29LT | 🚫 no `lang` attribute (WCAG 3.1.1, for a bilingual foundry) · 🚫 no skip link · 🚫 unnamed controls · 🔴 small targets · 🟡 no `h1` · 🟡 body line-height 1.0 · 🟡 no reduced motion | 100−36−8−6 = **50** |
| Mathaf | 🚫 contrast (white display text on painting) · 🚫 no skip link · 🚫 unnamed control · 🔴 small targets · 🟡 no `h1` · 🟡 no reduced motion · 🟡 no focus-visible rules | 100−36−8−6 = **50** |
| Jameel Arts Centre | 🚫 contrast · 🚫 no skip link · 🚫 11 unnamed controls · 🔴 small targets · 🟡 no `main` · 🟡 no reduced motion · 🟡 no focus-visible rules | 100−36−8−6 = **50** |

## What this means for us

Even well-regarded craft sites lose points on the same few things:

- Small tap targets
- Missing skip link and `h1`
- Light text on photos
- Popups stacked over the work
- Focus going into hidden menus

All of these can be fixed in code. Getting them right is how we beat 85.
