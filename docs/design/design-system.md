# Phase 5: Design system « Le fil »

The tokens and base components that every page is built from in Phase 6. Everything is
shown in every state on a dev-only page:

- French, left to right: `http://localhost:3000/fr/styleguide`
- Arabic, right to left: `http://localhost:3000/ar/styleguide`

The page returns a 404 in production builds, isn't linked anywhere and isn't in the
sitemap. Screenshots are in [`screenshots/phase-5/`](screenshots/phase-5).

## Tokens (`src/app/globals.css`)

### Colour

| Token | Hex | Role | On Coton | On Lin |
|---|---|---|---|---|
| `coton` | `#FBFAF8` | page ground | — | — |
| `lin` | `#EEEAE4` | quiet surfaces, empty photo, disabled fields | — | — |
| `encre` | `#241C2B` | all text | 15.8:1 | 13.7:1 |
| `fil` | `#5F5867` | secondary text, hints, placeholders | 6.5:1 | 5.7:1 |
| `the` | `#1D5C48` | the one accent: primary button, links, focus, loader | 7.5:1 | 6.6:1 |
| `the-fonce` | `#164A3A` | primary button hover | 9.7:1 | — |
| `the-pale` | `#E6EFEB` | success notice, "Pièce unique" badge | — | — |
| `trait` | `#8A8391` | field outlines, step rules. **Never text** | 3.5:1 (UI, ≥3:1) | 3.1:1 |
| `grenade` | `#A3262A` | **new:** form errors only | 7.0:1 | 6.1:1 |
| `grenade-pale` | `#F8ECEA` | error notice ground (grenade on it: 6.3:1) | — | — |

- **Body text meets WCAG AA in both scripts.** Every text colour is at least 5.7:1 on
  every ground it's used on, so it clears 4.5:1 at any size.
- Coton on Thé (button text) is 7.5:1.
- **The error red is "Grenade"** (pomegranate), as dark as Thé, so errors read as
  serious without shouting.
  - It was kept out of the accent role in Phase 3 because it clashed with the pink bags.
    That isn't a problem here, because it only appears next to form fields.
  - Errors never rely on colour: each starts with an icon, and the field gets a thicker
    border.
- The shadcn semantic names (`primary`, `muted`, `destructive`, …) map onto this palette.
  The admin and the base-ui primitives therefore follow it without per-component colours.
- **The site is now light.** The old dark "Velvet" theme and its `dark` class are gone,
  and `theme-color` is Coton.

### Type

| | French | Arabic |
|---|---|---|
| Interface (`--font-sans`) | Readex Pro, 350 | Readex Pro, 350 |
| Voice (`--font-heading`) | Markazi Text, 500–600 | Markazi Text, 500–600 |
| Subsets | `latin`, `latin-ext`, preloaded | `arabic`, `latin`, not preloaded yet (Phase 7) |

The French pair (Manrope + Cormorant) is replaced. Both languages now use the same two
families, as the direction said.

The scale uses Tailwind's own names (`text-xs` … `text-5xl`), so every component scales
with the language. Arabic redefines the steps on `html:lang(ar)`:

| Step | French | Arabic | Use |
|---|---|---|---|
| xs | 13 / 1.5 | 14 / 1.7 | legal line, specimen labels |
| sm | 14 / 1.55 | 15.5 / 1.75 | hints, errors, prices in tiles |
| base | 16 / 1.6 | 18 / 1.8 | body, buttons, fields |
| lg | 18 / 1.55 | 20 / 1.75 | lede |
| xl | 22 / 1.3 | 24 / 1.55 | product names |
| 2xl | 28 / 1.15 | 30 / 1.4 | state titles, feature tile |
| 3xl | 36 / 1.1 | 36 / 1.35 | section titles |
| 4xl | 48 / 1.05 | 46 / 1.3 | — |
| 5xl | 60 / 1.02 | 56 / 1.25 | first-screen title |

- Reading sizes grow about 12 % in Arabic.
- Display sizes don't: Markazi's Naskh is already large at heading sizes, and long Arabic
  headlines would wrap twice.
- Letter-spacing and uppercase are switched off for any Arabic text.
- **Latin inside Arabic** (the brand, `CN-0002`, prices, phone numbers) is always wrapped
  in `<bdi>`, and Arabic sentences use the Arabic comma `،`. Without it, the bidi
  algorithm moves the punctuation next to the Latin run (seen on the style guide, fixed).
- Fields stay at 16 px or more, so iOS doesn't zoom on focus.

### Space, shape, motion

- **Layout widths:**
  - `max-w-page` is 75 rem (the content width).
  - `max-w-prose` is 38 rem (reading width).
  - `--spacing-section` is 64–96 px between sections.
- **Corners:** controls get 2 px (`--radius: 0.125rem`); photos and surfaces get none.
- **Shadows:** only floating layers (drawer, menus, toasts) have one.
- **Easing:** one curve, `--ease-thread` (quick start, long soft finish).
- **Reduced motion:** a global `prefers-reduced-motion` rule makes all animation instant,
  and the chain is drawn already complete. Verified in the browser: the chain's dash
  offset is `0px` and the loader animation is `none`.
- **Focus:** one style everywhere, a 2 px Thé outline offset by 3 px. Verified with real
  keyboard focus in both languages.

## Components

| Component | File | States on the style guide |
|---|---|---|
| **Chain** (divider, one-time draw) | `components/ui/chain.tsx` | still, drawing; mirrored in Arabic |
| **ChainLoader** (the only loader) | `components/ui/chain.tsx` | animating, reduced motion; `role="status"` with a translated label |
| **Nav stitch** (`stitch-underline`) | `globals.css` | current page; starts on the right in Arabic |
| **Button** | `components/ui/button.tsx` | 6 variants × rest, hover, focus, disabled; **new** `loading` (chain loader, `aria-busy`, stays focusable); sizes |
| **Field** (label, hint, error) | `components/ui/field.tsx` | empty, filled, focus, invalid + message, disabled; phone stays LTR in Arabic |
| **Input / Textarea / Select** | `components/ui/*.tsx` | restyled; 48 px tall; Trait outline; Grenade when invalid |
| **Badge** | `components/ui/badge.tsx` | unique, sold (new `sold` variant), coming soon, status, cancelled |
| **Notice** | `components/ui/notice.tsx` | info, success, error with action; bar on the inline-start edge |
| **Photo** | `components/ui/photo.tsx` | with photo, without (Lin block + piece name), loading |
| **ProductTile** + skeleton | `components/product/product-tile.tsx` | feature tile, normal, sold, no photo, loading |
| **Price** | `components/ui/price.tsx` | always `formatPrice` inside `<bdi>` |
| **EmptyState / LoadingState / ErrorState** | `components/ui/state.tsx` | empty cart, loading, failed load with retry + WhatsApp |
| **Steps** | `components/ui/steps.tsx` | ordering steps (placeholder copy) |
| **Toaster** | `components/ui/sonner.tsx` | success, info, error; light; loading uses the chain |
| **Language link** | `components/language-switcher.tsx` | restyled to the bordered link from the direction |

New dictionary strings in both languages: `common.retry`, `common.loadErrorTitle` and
`common.loadErrorBody`.

## What changes on the live pages now

The tokens are global, so every page already uses the light palette and the new fonts.
Layouts are still the old ones until Phase 6. The old cards (`rounded-3xl`, `shadow-soft`)
now render nearly square and almost flat, because those tokens were redefined rather than
deleted. Phase 6 replaces them with the components above.

## Not done here (on purpose)

- **Route-level `loading.tsx` / `error.tsx`:** the components exist; wiring them into
  routes is page work (Phase 6).
- **The sheet (cart drawer):** it only picked up the new tokens. Its layout is redone with
  the cart in Phase 6.
- **The "with photo" specimens** use the sample catalogue's `placehold.co` pictures,
  because the real photos aren't in the project yet.
