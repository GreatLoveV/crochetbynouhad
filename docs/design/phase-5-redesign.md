# Phase 5: Every page redesigned

This phase applies the [« Fouwwa » direction](direction.md) and the
[design system](design-system.md) to every page of the shop, in French and in Arabic.

Screenshots:
- **After:** [`screenshots/phase-5/`](screenshots/phase-5). 7 pages × 2 languages × 375, 768 and 1440 px, 42 images.
- **Before:** [`screenshots/before/`](screenshots/before).
- **Side by side** (before on the left, after on the right): [`screenshots/compare/`](screenshots/compare).

The photos are still the site's placeholder images. Every layout below was judged with them, so
it should be checked again once the real photos arrive.

## What changed, page by page

| Page | Change |
|---|---|
| Header | **Phones:** one row (menu, cart, language pill, brand) instead of two. The section links move into a menu that slides in from the start side (left in French, right in Arabic) in 180 ms. **All widths:** a solid Laine ground replaces the blurred glass, and the language switch shows a short label (FR or عربي) on phones. |
| Footer | A full Nila band with Laine text. Focus rings turn Laine on dark grounds (`on-dark` utility). |
| Home | **Hero:** a larger photo (up to 74 % of the screen height), the piece name under it in the display face, and the cash-on-delivery note in Naanaa. **Chains:** a Fouwwa chain draws once under the hero, and a Naanaa chain leads into the atelier. **Pieces:** six or fewer are shown one per row (photo on the start side, then category, name, price and two actions: "Voir la pièce" and WhatsApp). More than six fall back to the tile grid. **Atelier:** a full-width Naanaa band. **Filters:** the category filter wraps instead of scrolling sideways. |
| Product | **Gallery:** the main photo has 24 px corners, and the thumbnails are rounded with a Fouwwa outline on the active one. **Details:** the price is in Fouwwa and the description sits in a Laine card. A Kurkum chain sits before the back link. |
| Cart and checkout | The summary is a Laine card (28 px corners) that stays in view on wide screens. Thumbnails are rounded. |
| Confirmation | A Naanaa check, the order details in a Laine card, and a Naanaa chain before the actions. Not screenshotted, because reaching it needs a real order. |
| Legal pages | The text sits in a Laine card, and its sections are separated by thin rules. |
| 404, empty cart, error, loading | **Heading size:** the title is large when it is the page's main heading (404) and smaller inside a page (empty cart), so the page has one clear main heading. **Chains:** thicker. An empty state shows a short Kurkum chain; an error shows the same chain broken, in Fouwwa. **Loading:** still the chain loader. |
| Share image (`opengraph-image.tsx`) | Rose ground, the brand in Nila, a Kurkum chain, and the tagline in Fouwwa. The old dark card and its tracked capitals are gone. |

## Motion (genjutsu cast)

| Moment | What moves | Reduced motion |
|---|---|---|
| First load of the home page | The chain under the hero draws once (1.5 s) | Already drawn, no animation |
| Adding a piece | The cart count turns once (450 ms) | Appears at once |
| Opening the phone menu | It slides in from the start side (180 ms in, 150 ms out) | Appears at once |
| Pressing a button | It shrinks by 3 % (150 ms) | No change in size |
| Loading | The chain loader's loops light in turn | Still |

Nothing moves on scroll, and nothing else moves on load.

**Checked in Chromium.** Without reduced motion, the chain runs `chain-draw 1.5s` and a pressed
button is at `scale 0.97`. With reduced motion, the chain's animation is `none`, transitions take
0.01 ms, and a pressed button keeps its size.

## Checks (2026-11-12)

| Check | Result |
|---|---|
| Reflow | No sideways scrolling on any of the 42 screenshots. |
| Console | No console errors on any of the 42 screenshots. |
| Contrast and targets | **Pages:** home, product, conditions, 404 and cart, in both languages, at 375 and 1440 px. **Contrast:** no text below AA, including the Nila footer and the Naanaa band. **Targets:** none under 24 px. The skip link is 1 px until it is focused, which is intended. |
| Keyboard | **Home:** 22 to 24 Tab stops, each with a visible focus ring, in both languages and at both widths. **Two flags are false positives:** the skip link and the Laine button on the atelier band have a ring in their own colour, but the ring sits 3 px outside them, over the header and over the Naanaa band. **Phone menu:** focus moves into it, and every link shows a ring. |
| Code | TypeScript and ESLint pass. |

## Self-critique

**Fixed during this phase:**
- **Duplicate piece:** the hero piece was repeated in the rows below it.
- **Hero photo:** it was taller than the screen on laptops.
- **Thumbnail outlines:** they were clipped by the scrolling list.
- **Empty cart:** it had two headings of the same size.

**Not fixed yet:**
- **Rows with placeholder images.** A tall grey placeholder next to short text leaves a lot of
  empty space on wide screens. Real photos (and the one-line story per piece from the direction)
  should fill it. To check again with real photos.
- **The share image uses Satori's built-in fonts, not Fraunces.** Satori can't read the `woff2`
  files that `next/font` ships. Using Fraunces would mean committing a `.ttf` copy of the font.
  To decide in Phase 6.
- **The share image is still text-only.** The Arabic version carries only the Latin brand name,
  because Satori doesn't join Arabic letters. Using the piece's own photo for product links is
  still to do.
- **Rows don't alternate sides.** The direction said they would. This was a deliberate change:
  alternating sides repeated down a page reads as layout filler, and the reading order stays the
  same in both languages.
- **Yarn chips are still not shown on pieces.** There is no data for them yet (see the
  design-system doc).
- **An em dash in existing copy.** The legal-page notice uses one ("Texte provisoire — à
  compléter…", and the same in Arabic). It is existing text, so I left it for the native review.

## genjutsu audit

**Checked here, with evidence:**
- **Reduced motion:** the computed styles above, in Chromium.
- **One orchestrated moment:** only `.chain-draw` runs on load. Searching the source finds no
  other load or scroll animation.
- **Durations:** 150 to 450 ms for responses, 1.5 s for the one drawn chain.
- **Easing:** a single easing everywhere (`--ease-thread`).
- **Only cheap properties animate:** `transform`, `scale`, `stroke-dashoffset`, `opacity` and
  colours.
- **Phone menu:** it enters from the start side in both directions (screenshots `menu-*-375`,
  kept in the scratch folder).
- **Tells removed:** the glass header, tracked capitals on the share image, an em dash in its alt
  text (now a comma), and badges on photos other than "Vendu".

**Handed over, UNVERIFIED:**
- **Smoothness on a real mid-range Android phone.** Only desktop Chromium was used.
- **Real screen readers.** VoiceOver and TalkBack haven't been run on the menu, the badge or the
  error states.
- **Safari and Firefox,** for the menu slide and the `scale` press.
- **How the press feels on touch.**

**Modules:**
- **Loaded:** motion-principles, css-native, tells (with `references/web.md`),
  mobile-principles, design-audit.
- **Not loaded:** framer-motion and gsap (no animation library is installed, and adding one
  wasn't needed), desktop-principles, canvas-generative, threejs-r3f, ui-ux-pro-max.

## New UI text for native review

| Key | French | Arabic |
|---|---|---|
| `nav.menu` | Menu | القائمة |
| `home.viewPiece` | Voir la pièce | شاهدوا القطعة |
| Short label for the language switch on phones (in code, `language-switcher.tsx`) | FR | عربي |
| `og` card, Arabic version | — | shows the Latin "Crochet" only (Satori limitation) |
