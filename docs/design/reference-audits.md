# Reference audits (design-auditor), round 2

Run on 2026-11-12 with the `design-auditor` skill's scoring rules, using the same method as
[round 1](round-1/reference-audits.md) so the two sets can be compared:

```
Score = 100 − (🚫 blockers × 12) − (🔴 criticals × 8) − (🟡 warnings × 4) − (🟢 tips × 1)
```

All inputs are **live URLs**, so confidence is 🟡 Medium. The skill's medium-confidence
modifier halves warnings and tips (🟡 −2, 🟢 −0.5); blockers and criticals count in full. A
repeated issue with one root cause counts once. Inferred settings: full page audit,
production, WCAG AA.

## Method (same for every site)

- **Measured** with Playwright in a clean headless browser, on the home page, at 1440×900
  and 390×844:
  - Contrast for up to 400 visible text nodes against the nearest opaque background. Text
    over photos is checked by eye in the frames, because the script cannot see the photo.
  - Images without `alt`, and interactive elements with no accessible name.
  - Mobile targets under 24×24 px.
  - Skip link, `main`, `h1` count, `lang`, `dir`, `hreflang`.
  - `prefers-reduced-motion` and `:focus-visible` rules.
  - Keyboard: 25 Tab presses, counting stops with a visible focus indicator.
- **Looked at:** first-screen and scrolled frames, desktop and mobile.
- **Deep audits** (with an anydesign analysis in `references/<site>/`): BEŶT, Najdunes,
  SUKA, Amano, Mo Al-Asala. **Quick audits:** the other five use the same measurements and
  rules, with fewer frames reviewed.
- **Dropped:**
  - The Knotty Ones (found on Land-book): the shop returns HTTP 402 and is closed.
  - Irisée Handmade and D.PUIN: their servers refuse this browser's TLS handshake
    (`ERR_SSL_VERSION_OR_CIPHER_MISMATCH`), so they could not be measured.
- **Limitations:** home pages only, and each score is for its home page on this date.

## Scores

| Site | Type | Overall | Accessibility* | Deep? |
|---|---|---|---|---|
| Najdunes | Arabic-first studio (SA) | **95** | 98 | ✅ |
| BEŶT | Moroccan ceramics (Casablanca) | 73 | 78 | ✅ |
| LRNCE | Moroccan ceramics and textiles | 63 | 66 | quick (deep in round 1) |
| Lissy & Rudi | crochet artists (NZ) | 62 | 66 | quick |
| Amano | hand-knit picture jumpers (UK/Ecuador) | 61 | 66 | ✅ |
| SUKA | colourful crochet (NL/Lombok) | 53 | 54 | ✅ |
| Wasl Studio | Saudi crafts shop, Arabic only | 52 | 56 | quick |
| G-uld | plant-dyed yarn (DK), Awwwards SOTD | 38 | 42 | quick |
| Mo Al-Asala | Arabic-first heritage clothing | 37 | 42 | ✅ |
| Mækiki Studio | colourful crochet (DE) | 36 | 42 | quick |

\* The accessibility score uses the same formula on categories 2, 6, 7, 15 and 16 only.

**Benchmark: 95 (Najdunes).** One caveat, like PetiteKnit's in round 1: it is a small studio
site with 26 interactive elements and no shop, cart or forms, so it has less surface to
fail. The best **shop** in the set is BEŶT at 73. Our target is **96 or higher**, which beats
the benchmark and clears the 85 minimum.

## Deep audits

### Najdunes — 95/100
- 🟡 4 of 25 Tab stops show no visible focus.
- 🟡 Layout seam: the staggered project cards spill into a white band between two dark
  sections. ⚠️ It could be a scroll animation caught mid-way.
- 🟢 The dune hero invites "hover over the sand", which only works with a pointer.
- ✅ 0 contrast failures (dune on ink 13.7:1), Arabic skip link, `lang="ar" dir="rtl"`,
  hreflang ar/en/x-default, no target under 24 px, reduced motion respected, and type tokens
  defined per script.

`100 − 2 − 2 − 0.5 = 95.5 → 95`

### BEŶT — 73/100
- 🚫 No skip link. WCAG 2.4.1.
- 🔴 9 mobile targets under 24 px (the "FR / EN" links are about 12 px tall).
- 🟡 No `main` landmark.
- 🟡 Justified prose with `line-height: normal` on desktop opens rivers.
- 🟡 Didot is a system font that only Apple devices have, so Windows and Android users get
  Georgia, which is a much plainer page.
- 🟢 Navigation is 11.5 px tracked uppercase.
- ✅ 0 of 223 text nodes fail (navy on white 12.2:1), all 25 Tab stops focused, reduced
  motion respected, hreflang fr/en.

`100 − 12 − 8 − (3 × 2) − 0.5 = 73.5 → 73`

### Amano — 61/100
- 🚫 White text over the hero photo ("The Barn Dance", "Meet The Long Ride…") without a
  backing. WCAG 1.4.3.
- 🚫 12 images without `alt`. WCAG 1.1.1.
- 🔴 12 to 14 mobile targets under 24 px.
- 🟡 No `h1`.
- 🟡 No `prefers-reduced-motion` rule.
- 🟡 A newsletter popup covers the first screen on load.
- 🟢 A chat bubble sits over the content.
- ✅ Skip link, all 25 Tab stops focused, hreflang en/de.

`100 − 24 − 8 − (3 × 2) − 0.5 = 61.5 → 61`

### SUKA — 53/100
- 🚫 Sun yellow on tomato is 2.93:1 (the announcement bar). WCAG 1.4.3.
- 🚫 5 images without `alt`. WCAG 1.1.1.
- 🚫 1 control without an accessible name. WCAG 4.1.2.
- 🔴 7 mobile targets under 24 px.
- 🟡 Two `h1`s, and headings out of order.
- 🟢 Letter-spaced body text (+0.0375em).
- ✅ Skip link, all 25 Tab stops focused, reduced motion respected.

`100 − 36 − 8 − 2 − 0.5 = 53.5 → 53`

### Mo Al-Asala — 37/100 (RTL reference)
- 🚫 29 of 84 text nodes fail contrast (ivory at 80 % opacity, worst 1.21:1). WCAG 1.4.3.
- 🚫 The mobile page overflows sideways: the logo and cards are clipped. WCAG 1.4.10.
- 🚫 No skip link. WCAG 2.4.1.
- 🚫 2 controls without names. WCAG 4.1.2.
- 🔴 9 mobile targets under 24 px.
- 🟡 No `main` landmark.
- 🟡 No hreflang despite an English version.
- 🟡 Amiri navigation at 14 px and Naskh headings at line-height 1.0.
- 🟢 Stat cards with no information ("∞", "100%").
- ✅ **i18n/RTL:**
  - `lang="ar" dir="rtl"`, and Arabic is the default.
  - A real Naskh display face.
  - All 25 Tab stops show focus.
  - Reduced motion respected.

`100 − 48 − 8 − (3 × 2) − 0.5 = 37.5 → 37`

## Quick audits

| Site | Issues | Arithmetic |
|---|---|---|
| LRNCE | 🚫 7 unnamed icon links · 🚫 6 of 25 Tab stops land in hidden menus · 🔴 21 small targets · 🟡 two `h1` · 🟡 popups, chat and promo bar on the first screen · 🟢 no `footer` | 100−24−8−4−0.5 = **63** |
| Lissy & Rudi | 🚫 contrast (13 nodes, text over the pink knitted wall) · 🚫 26 unnamed controls · 🔴 small targets · 🟡 no `h1` · 🟡 nine font families · 🟡 2 of 25 Tab stops not visible | 100−24−8−6 = **62** |
| Wasl Studio | 🚫 contrast (white text on the lavender top bar) · 🚫 no skip link · 🚫 20 of 25 Tab stops show no focus · 🔴 small targets · 🟡 15 px body · 🟡 11-item navigation in two rows | 100−36−8−4 = **52** |
| G-uld | 🚫 no `lang` attribute · 🚫 contrast (white tracked labels on the photo) · 🚫 4 images without `alt` · 🚫 no skip link · 🔴 small targets · 🟡 no `h1` · 🟡 GSAP motion with no reduced-motion rule · 🟡 5 of 25 Tab stops not visible | 100−48−8−6 = **38** |
| Mækiki Studio | 🚫 contrast (cookie button 1.47:1) · 🚫 no skip link · 🚫 unnamed control · 🚫 0 of 25 Tab stops show focus · 🔴 16 small targets · 🟡 no `main` · 🟡 body line-height 1.15 · 🟡 a stock pattern with visible watermarks behind the logo · 🟡 five font families | 100−48−8−8 = **36** |

## What this means for us

Even well-regarded craft sites lose most of their points to the same few things. Each of
these is cheap for us to get right:

1. Text over photos without a backing.
2. Missing skip links and missing `alt`.
3. Icon-only controls with no name.
4. Small touch targets on phones.
5. Popups that cover the first screen.

The site with the best score is the one that treated Arabic and Latin as two type systems
from the start.
