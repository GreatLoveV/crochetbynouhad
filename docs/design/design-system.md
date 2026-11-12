# Phase 4: Design system « Fouwwa »

The tokens and base components every page is built from in Phase 5. This puts the approved
[direction](direction.md) into code. Every component is shown in every state on a dev-only
page:

- French, left to right: `http://localhost:3000/fr/styleguide`
- Arabic, right to left: `http://localhost:3000/ar/styleguide`

The page returns a 404 in production builds, isn't linked anywhere and isn't in the
sitemap. Screenshots at 375, 768 and 1440 px are in
[`screenshots/phase-4/`](screenshots/phase-4).

The tokens apply site-wide straight away, so the current pages already wear the new colours,
fonts and corners. Their layouts are redesigned in Phase 5.

## Tokens (`src/app/globals.css`)

### Colour

| Token | Hex | Role | On Rose | On Laine |
|---|---|---|---|---|
| `rose` | `#FBEDEA` | page ground | — | — |
| `rose-fonce` | `#F4DCD8` | hover wash, disabled fields and buttons | — | — |
| `laine` | `#FFFDF9` | photos, cards, fields, header and footer | — | — |
| `nila` | `#1E2461` | all text, outline button, focus ring, "Vendu" badge | 12.4:1 | 14.0:1 |
| `fil` | `#4D4F7A` | secondary text, hints, placeholders | 6.8:1 | 7.6:1 |
| `trait` | `#6F6E96` | field outlines. **Never text** | 4.2:1 (UI ≥ 3:1) | 4.8:1 |
| `fouwwa` | `#9C1D3B` | main button, links, prices, errors | 6.9:1 | 7.8:1 |
| `fouwwa-fonce` | `#7E1530` | main button hover (Laine on it 10.2:1) | — | — |
| `fouwwa-pale` | `#F6DCE0` | error notice ground (Fouwwa on it 6.1:1) | — | — |
| `naanaa` | `#1C6347` | atelier band, success | 6.3:1 | 7.1:1 |
| `naanaa-pale` | `#E3EFE8` | success notice ground (Naanaa on it 6.1:1) | — | — |
| `kurkum` | `#E9A93A` | chain thread, "Pièce unique" badge (Nila on it 6.9:1). **Never text on Rose (1.8:1)** | — | — |
| `kurkum-pale` | `#FBEBC8` | text selection (Nila on it 12.0:1) | — | — |

- `erreur` and `erreur-pale` are aliases of Fouwwa. An error is always a sentence with an
  icon, never colour alone.
- The shadcn semantic tokens (`--primary`, `--card`, `--ring`…) map onto these, so the admin
  and the Base UI primitives follow without per-component colours.
- **Renamed from round 1** (one scripted pass over `src/`):
  - `coton` and `lin` became `laine`.
  - `encre` became `nila`.
  - `the` became `fouwwa`, except focus outlines, which became `nila`.
  - `grenade` became `erreur`.

### Type

| | French | Arabic |
|---|---|---|
| Display (`font-heading`, h1–h4) | Fraunces 600, `SOFT 100`, `WONK 1`, tracking −0.01em | Aref Ruqaa 700, no tracking |
| Text and UI (`font-sans`) | Readex Pro 350/500, 16 px, line-height 1.6 | Readex Pro 350/500, 18 px, line-height 1.8 |
| Display line-heights | 1.02–1.3 | 1.6–1.7 (Ruqaa's tall lam and alif reach into the line above at 1.5) |

- **Self-hosted** through `next/font` (`src/app/fonts.ts`). No new dependency.
  - Readex Pro and Fraunces preload their Latin subset.
  - Aref Ruqaa is not preloaded, so French pages never download it.
- **Arabic heading stack.** Fraunces' metric fallback is a local Times New Roman, which has
  Arabic letters. In a plain stack it caught Arabic headings before Ruqaa could. So on
  Arabic pages the heading stack is: the bare Fraunces face (exposed as
  `--font-fraunces-face`), then Aref Ruqaa with its own fallback. French pages keep
  Fraunces' fallback, so French headings don't shift when the font loads.
- **Per-script scale.** `html:lang(ar)` redefines the whole scale: about 12 % larger for
  reading sizes and taller lines. Letter-spacing and uppercase are switched off for any
  Arabic text.
- **Ruqaa is for names and titles only.** Subheads use Readex Pro 500.

### Shape, spacing and motion

- **Radii by role:**
  - Inputs and selects: 14 px (`rounded-md`).
  - Notices: 18 px (`rounded-lg`).
  - Photos: 24 px (`rounded-photo`).
  - Cards and frames: 28 px (`rounded-card`).
  - Buttons, badges and the language switch: a full pill.
- **Spacing and widths:** unchanged from round 1 (`--spacing-section`, `--container-page`,
  `--container-prose`).
- **Motion:**
  - One easing, `--ease-thread`.
  - The chain draws once (`.chain-draw`), the loader's loops light in turn, and the cart
    badge loops once.
  - With `prefers-reduced-motion: reduce`, all of these are still and transitions are
    instant.

## Components (`src/components/ui/`)

| Component | What changed | States on the styleguide |
|---|---|---|
| `Button` | Pills. Fouwwa main action, Nila outline, Laine secondary, ghost, error outline, link | rest, hover, keyboard focus, disabled, busy (chain loader); sizes sm, default, lg |
| `Input`, `Textarea`, `Select` | Laine fields with a Trait outline, 14 px corners | rest, filled, focus, error (with message and icon), disabled |
| `Badge` | Pills. "Pièce unique" in Kurkum, "Vendu" in Nila | all variants |
| `Notice` | Rounded, with a 4 px bar on the start side; success uses Naanaa | info, success, error with action |
| `Photo` | 24 px corners on Laine. Without a photo: faint chain-stitch rows and the piece's name in Ruqaa or Fraunces. Loading: same, pulsing (still with reduced motion) | with photo, without photo, loading |
| `Chain` | Thicker (about 3 px), with `tone`: fouwwa, kurkum, naanaa, nila | each tone, drawn once |
| `ChainLoader` | Thicker loops | loading |
| `YarnChips` (**new**) | The yarn colours of a piece: round chips, each with its dye name, as a labelled list | three colours |
| `Card`, `Sheet`, `Steps`, `State` | Recoloured. Cards use 28 px corners | empty, loading, error |

## Checks (2026-11-12)

Run on the styleguide in both languages and on the home, cart and checkout pages, at 375 and
1440 px:

- **Contrast:** no text below AA. The one failure found (the "3,9:1" label on the old Trait
  swatch, 4.43:1) was fixed by darkening Trait to `#6F6E96`.
- **Targets:** none under 24 px. Footer links (22 px) and the brand link on phones (20 px)
  were enlarged. The skip link is 1 px until it is focused, which is intended.
- **Keyboard:** 25 of 25 Tab stops show a visible focus ring in both languages. The first stop
  is the skip link.
- **Reflow:** no sideways scrolling at 375, 768 or 1440 px. Fraunces is wider than Markazi,
  so on phones the brand is now 20 px so the header fits in Arabic, where "Français" is the
  longer switch label.
- **Bidi:** the example phone number in the Arabic phone error was displayed backwards
  ("78 56 34 12 06"). It is now isolated with U+2066/U+2069.
- TypeScript and ESLint pass.

## Left for Phase 5

- **Page layouts:**
  - The one-piece-per-row home page and the atelier band.
  - The single-row phone navigation.
  - Section chains in their tones.
- **`YarnChips` has no data yet.** Products don't store their yarn colours. Showing them needs
  either a new field (a data change, which needs your approval) or a fixed list per product.
- **The Open Graph image** (`opengraph-image.tsx`) still uses round-1 colours.
- **The "with photo" specimens** use the site's current placeholder images until real photos
  arrive.

## New UI text for native review

| Key | French | Arabic |
|---|---|---|
| `product.yarnColours` | Couleurs de laine | ألوان الصوف |
| `colours.*` | Rose, Laine, Nila, Fouwwa, Naanaa, Kurkum | ورد، صوف، نيلة، فوّة، نعناع، كركم |
| `checkout.errors.phoneInvalid` (direction mark only) | — | unchanged wording |

The French colour names are Darija dye names written in Latin letters, as approved in the
direction. A French reader may prefer Garance, Indigo, Menthe and Curcuma: a question for
the native review.
