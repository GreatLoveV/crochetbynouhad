# Phase 3: Design direction — « Le fil » / «الخيط»

Proposal for approval. Built with the `frontend-design` process: a plan first, then a
check against generic defaults, revised before any code. The preview is
[`direction-preview.html`](direction-preview.html) (screenshot:
[`direction-preview.png`](direction-preview.png)). The grey blocks in it are deliberately
empty: the real site will only ever show Nouhad's own photos.

## The brief, as I understand it

- **Subject:** one woman in Morocco crocheting bags, scarves and accessories by hand.
  Every piece is one of a kind.
- **Audience:** Moroccan customers on their phones, arriving from Instagram or WhatsApp,
  reading French or Arabic.
- **The site's one job:** make someone want *this exact piece*, then make ordering it on
  WhatsApp or by cash on delivery feel easy and safe.

> I inferred this from the code because the "About the site" line in your brief was left
> blank. Anything she loves or hates would change this direction, so please tell me.

## The idea

**The thread is the only decoration; everything else is her work.**

Crochet starts with a *chaîne*, a chain of linked loops. The site has one drawn chain
stitch, and it's the only ornament:

- under the active navigation item
- as the divider between the first screen and the pieces
- as the loading indicator: loops appear one at a time, because a chain is a sequence

In Arabic it runs right to left, as a hand would work it. Everything else is a quiet
near-white page that gives the photos all the colour.

## Palette

| Name | Hex | Role | Contrast on Coton |
|---|---|---|---|
| **Coton** | `#FBFAF8` | page ground: near-white, barely warm | — |
| **Lin** | `#EEEAE4` | quiet surfaces, empty photo ground, bands | — |
| **Encre de mûre** (blackberry ink) | `#241C2B` | all text and outlines | 15.8:1 AAA |
| **Fil gris** | `#5F5867` | secondary text | 6.5:1 AA (5.7:1 on Lin) |
| **Thé** (mint-tea green) | `#1D5C48` | the one accent: primary button, active stitch, step numbers | 7.5:1 AAA, both ways |
| **Trait** | `#8A8391` | borders and hairlines only, **never text** (3.5:1) | 3.5:1 (meets 3:1 for UI) |

An error red (for form errors only) will be set in Phase 5, also at AA.

**Where each choice comes from:**
- **A near-colourless interface:** the best references let the work supply the colour
  (Heath, Tekla, PetiteKnit, LRNCE). Crochet bags are often pink, beige or multicoloured,
  so the UI must not compete.
- **Light rather than dark:** no strong reference puts product on a dark UI ground; dark
  only appears inside photographs. The current aubergine site does the opposite.
- **Encre de mûre keeps a link to the current brand** (aubergine). It moves from the
  background into the ink, so returning customers still recognise it.
- **Thé (mint-tea green):** one accent at most (LRNCE, PetiteKnit).
  - Green is an everyday Moroccan reference (the teapot, the glass) without being a
    tourist cliché like zellige or Majorelle blue.
  - It sits well next to the pinks and naturals of yarn instead of fighting them.
  - It makes "Commander sur WhatsApp", the main action, feel like part of the brand.

## Typefaces

Two families, **each designed for Latin and Arabic together**. A French word in an Arabic
sentence, or the reverse, then never changes style. This is the main lesson from
Thmanyah, 29LT and Mathaf.

| Family | Scripts | Role | Weights |
|---|---|---|---|
| **Markazi Text** (Borna Izadpanah, Florian Runge) | Arabic Naskh + Latin, drawn as companions | voice: brand name, headings, product names, Nouhad's own words | 500–600 for headings, 400 for quotes |
| **Readex Pro** (Thomas Jockin, Nadine Chahine and team) | Arabic + Latin, built for readability | the interface: body, buttons, prices, forms, navigation | 300–500 (variable) |

- **Coverage:** both are in Next's built-in Google Fonts with `arabic`, `latin` and
  `latin-ext` subsets. That covers every French accent, `œ`, `« »`, `’`, all Arabic
  letters and diacritics, and Western digits. Readex Pro and Markazi are both variable
  fonts, so one file per script covers all weights.
- **Why Naskh for Arabic headings:** Naskh is the style Moroccan readers know from print
  and school. It reads warm and literary next to Markazi's Latin, matching the "serif
  for the maker's voice" pattern from Heath and LRNCE.
  - Kufi faces looked too corporate for handmade work.
  - Ruqʿa looked "handwritten", but it's mainly an eastern Arab hand, so it would feel
    borrowed in Morocco.
- **Why Readex Pro for the interface:** it's designed for legibility, including at small
  sizes. Its Arabic and Latin share stroke weight and colour, so a price like
  `250,00 MAD` inside Arabic text sits naturally.
- **Arabic-specific rules** (from the research):
  - Arabic is set about 12 % larger optically.
  - Body line-height 1.8 in Arabic versus 1.6 in French; headings 1.35 versus 1.05.
  - No letter-spacing and no uppercase in either language. That removes the current
    site's letter-spaced eyebrows, which can't exist in Arabic.
  - Prices, references (`CN-0002`) and phone numbers are isolated (`<bdi>`) so they stay
    left-to-right inside Arabic.

## Layout

The page is left-aligned in French and right-aligned in Arabic, never centred, except
the empty states. Rhythm is generous (64–96 px between sections) and the content width is
about 1200 px.

```
HOME — 1440                                         HOME — 375
┌──────────────────────────────────────────────┐   ┌──────────────────┐
│ Crochet by Nouhad   Boutique Atelier Contact  │   │ Nouhad      ع  🛍 │
│                                   [العربية] 🛍 │   ├──────────────────┤
├───────────────────────────┬──────────────────┤   │                  │
│                           │                  │   │   PHOTO 4:5      │
│     PHOTO (≈60%)          │  H1, 3 lines     │   │   full width     │
│     newest piece, worn     │  one sentence    │   │                  │
│     or in use, 4:5         │  [WhatsApp] [▸]  │   ├──────────────────┤
│                           │                  │   │ H1               │
├───────────────────────────┴──────────────────┤   │ [Commander ▸ WA] │
│ ~o~o~o~o~o~o~o~o~o~o~ (the chain) ~o~o~o~o~o~ │   │ ~o~o~o~o~o~o~o~o │
│ Les pièces          Tout · Sacs · Écharpes …  │   │ Les pièces       │
│ ┌────────────┐ ┌─────┐ ┌─────┐                │   │ ┌──────┐┌──────┐ │
│ │ BIG 2×2    │ │     │ │     │  4:5 crops,    │   │ │      ││      │ │
│ │ newest     │ ├─────┤ ├─────┤  square        │   │ └──────┘└──────┘ │
│ │            │ │     │ │     │  corners       │   │ name    name     │
│ └────────────┘ └─────┘ └─────┘                │   │ price   Vendue   │
│ name / price under each, no card chrome       │   ├──────────────────┤
├──────────────────────┬───────────────────────┤   │ PHOTO hands      │
│ PHOTO: her hands      │ Nouhad, in her own    │   │ Nouhad's words   │
│ at work               │ words (2–3 lines)     │   ├──────────────────┤
├──────────────────────┴───────────────────────┤   │ 1 Choisir        │
│ 1 Choisir   2 Confirmer sur WA   3 Payer       │   │ 2 Confirmer WA   │
├──────────────────────────────────────────────┤   │ 3 Payer livraison│
│ footer: contact, legal, one delivery line      │   └──────────────────┘
└──────────────────────────────────────────────┘
In Arabic the whole grid mirrors: the photo moves to the right edge, the
big tile to the right, and the chain draws from right to left.
```

- **The first screen is the work.** On a phone the photo comes first (it doesn't today).
  Research: LRNCE, Laine, PetiteKnit and Tekla all open on a photo.
- **The pieces grid** puts the newest piece large and the rest in a calm grid. There are
  no cards, borders or shadows; the name and price sit under each photo (Heath, Tekla).
  Sold pieces stay, marked "Vendue", because they show what she can make and invite a
  custom order.
- **"L'atelier" band:** Nouhad's hands and a few honest lines in her voice. Every
  reference that tells a maker story does it with a face or place, not an essay (La Bien
  Aimée, LRNCE).
- **"Comment commander" uses numbered steps** because ordering really is a sequence. It
  replaces the line "Paiement à la livraison · Livraison partout au Maroc" that currently
  appears four times.
- **Product page:**
  - The gallery takes about 60 % of the width, with thumbnails as a column on the inline
    start.
  - A **close crop of the stitch** is encouraged as the second photo (Tekla, LRNCE
    texture shots).
  - The buy box sticks on desktop, in this order: name, reference, price, then
    WhatsApp (primary) and Add to cart (secondary).
- **Navigation has three items** (La boutique, L'atelier, Contact), plus the cart and a
  language link **written in the other language** ("العربية" / "Français"), never a
  flag. Research: the best sites use 3–4 items, and flags are countries, not languages.

## How photos are presented

- Full bleed or half bleed, with **square corners**, no borders, no shadows and no
  rounded frames. The object makes the shape (Heath, Laine, Tekla, PetiteKnit).
- Three kinds of photo, all hers:
  1. **Worn or in use:** scale and desire.
  2. **The object on a plain ground:** the grid.
  3. **A close-up of the stitch:** texture.

  The admin will suggest this order but won't enforce it.
- **Crops:** 4:5 for bags and scarves, with `object-position` adjustable later if needed.
- Light text never sits on a photo. Text goes beside or below photos, avoiding the most
  common accessibility failure in the research.
- An empty photo shows a Lin block with the piece's name. It's never a stock image or an
  icon.

## Motion

One orchestrated moment and otherwise stillness (frontend-design, plus the research:
the best sites barely move).

- **On first load:** the chain stitch draws itself once under the first screen (about 1.5
  seconds), left to right in French and right to left in Arabic. That's the only
  page-level motion.
- **Motion that responds to an action:**
  - Adding to the bag: the bag counter makes one small loop.
  - Changing photo in the gallery: a short crossfade.
  - Opening the bag drawer: it slides in from the inline end.
- **Loading:** loops appear one at a time along the chain. This is the one loader used
  everywhere.
- `prefers-reduced-motion`: everything is instant or static, and the chain is drawn
  already complete.
- Built in Phase 6 with genjutsu's cast pipeline, in CSS where possible.

## Check against generic defaults (and what I changed)

I compared the plan against the clusters that `frontend-design` lists as generated-looking
defaults:

1. **Cream ground + serif display + terracotta accent.** My first draft was exactly that:
   sand `#EEE3D4` borrowed from LRNCE and a pomegranate red. **Changed:**
   - The ground became a near-white `#FBFAF8`, lighter and cooler than cream.
   - The accent became mint-tea green.
   - The serif became a low-contrast Naskh-companion face rather than a high-contrast
     display serif.

   The red also clashed with the pink bags already in the catalogue.
2. **Near-black ground with one bright accent.** That's the current site. Dropped.
3. **Broadsheet hairlines and dense columns.** Not used. Hairlines appear only above the
   three steps.
4. **The SaaS card kit.** Removed entirely: no rounded cards, no shadows, square media.
5. **Template chrome:**
   - Removed the tracked-out uppercase eyebrows (and they can't exist in Arabic anyway).
   - Removed the "A · B · C" meta strings, including the current delivery line.
   - No "→" appended to buttons.
   - No monospace.

**The one place I'm spending boldness:** the chain stitch. It's specific to crochet, works
in both directions, and does a job (navigation state, divider, loader) instead of
decorating.

## Placeholder copy in the preview

These are placeholders I wrote for the preview, **not facts and not final**. They need
Nouhad's own words:

- "J'ai appris le crochet avec ma mère… entre deux et cinq jours" is **invented** to show
  the layout.
- The Arabic in the preview addresses the customer in the **feminine** (اطلبي، اختاري).
  That suits a mostly female clientele, but it's your call; the neutral alternative is
  اطلب/اطلبي or a noun phrase.
- Should the brand in Arabic be **كروشيه نهاد**, a different transliteration, or Latin
  "Crochet by Nouhad" in both languages?

## Decisions this direction asks of you

1. Approve the palette, the type pairing (Markazi Text + Readex Pro) and the chain-stitch
   idea, or tell me what to change.
2. The Arabic brand name and how to address customers (above).
3. Western digits in Arabic: I'll confirm this formally in Phase 4. The research supports
   Western digits for Morocco.
