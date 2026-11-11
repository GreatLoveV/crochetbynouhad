# Phase 6: Every page redesigned

Every public page now uses the « Le fil » system, in French and Arabic.

| | Screenshots | Notes |
|---|---|---|
| **Before** (the dark "Velvet" site) | [`screenshots/phase-4/`](screenshots/phase-4) | 375 and 1440 |
| **After** | [`screenshots/phase-6/`](screenshots/phase-6) | 375, 768 and 1440 |

The "after" set is named `<page>-<lang>-<width>.png`.

The grey photo blocks are the sample catalogue's `placehold.co` pictures. They carry
English text such as "Raffia Beach Bag 1". Nouhad's real photos will replace them; the
layout never substitutes a stock image.

## What changed, page by page

### Header
- Brand on the inline start, in Markazi, always in Latin.
- Three links on the inline end: La boutique, L'atelier and Contact (WhatsApp).
- The current page gets the chain stitch under the word and `aria-current`.
- Then the other language, written in that language, and the bag.
- On a phone the three links move to a second row.
- The bag counter makes one small loop when a piece is added; it doesn't animate on load
  or on removal.

### Home
- **The first screen is the work.**
  - It shows the newest piece still for sale, with its name under the photo; on a phone
    the photo comes first.
  - The title, one sentence, and two actions: WhatsApp (main) and "Voir la collection".
  - On a laptop the photo is capped at 74 % of the viewport height, so the title stays
    above the fold. That was a finding of the first shoot.
- **The chain draws itself once** under the first screen, in reading direction. It's the
  only page-level motion.
- **Pieces:**
  - Categories are plain words, the current one stitched; "(Bientôt)" marks empty
    categories.
  - Each tile is a photo, then the name and price beneath it, with no card or shadow. A
    sold piece keeps its tile, marked "Vendu".
  - The newest piece gets a 2×2 tile once there are at least five pieces. With the two
    sample pieces, the grid stays even.
- **L'atelier:**
  - A few honest lines built from facts already on the site (handmade by Nouhad, at home,
    in Morocco, one of a kind) and a "Write to Nouhad" link.
  - No photo yet. The band takes one from `src/lib/content/site.ts` (`ATELIER_PHOTO`)
    and becomes two columns. Until then it is text only, never a stock picture.
- **Comment commander:** three numbered steps, because ordering really is a sequence. They
  replace the "Paiement à la livraison · Livraison partout au Maroc" line the old site
  repeated four times. The steps describe the real flow:
  1. The form.
  2. Nouhad confirms on WhatsApp.
  3. Cash on delivery.

### Product
- **Gallery:** about 60 % of the width. Thumbnails stand in a column on the inline start
  (left in French, right in Arabic) and in a row on a phone. Changing photo is a 200 ms
  crossfade.
- **Buy box:** sticky on a laptop. Order: name, price and "Pièce unique", reference, then
  **WhatsApp (main action)** and "Ajouter au panier", as in the direction.
- **Description:** last, at reading width.
- **Sold pieces:** keep their page. The bag button reads "Vendu" and is disabled; WhatsApp
  becomes "Une question ? WhatsApp".

### Bag drawer and cart page
- **Drawer:** slides in fully from the inline end (250 ms in, 200 ms out). Square
  thumbnails, price, "Pièce unique" plus the reference.
- **Empty and loading states:** use the shared `EmptyState` and `LoadingState`
  components.
- **Cart page:** the same lines, with a Lin summary block that sticks on a laptop.

### Checkout
- **Fields:** use the shared `Field` component, so the label, hint and error are linked
  for screen readers. Errors start with an icon and the field gets a thicker Grenade
  border.
- **Server error:** shown as an error `Notice` above the form.
- **Phone:** the confirm button is in a sticky bar, which now also shows **the amount due
  on delivery**. Before, the total was only below the form, where it was easy to miss.
- **Button:** shows the chain loader while sending.
- **Unchanged:** the hidden cart and language fields, the honeypot, the kept values and
  the server-side recomputation.

### Order confirmation
- Left-aligned, with a check in Thé. The reference and the total sit side by side, with
  the status underneath.
- WhatsApp is the main action, with the "optional" note.
- Same privacy rule as before: the name and city only appear in the browser that placed
  the order.

### Legal pages, 404, loading and error
- **Legal:** reading width; the "temporary text" warning is an info `Notice`; sections
  still to write are shown in italic Fil gris.
- **404:** the shared `EmptyState`.
- **New** `app/[lang]/loading.tsx`: the chain loader.
- **New** `app/[lang]/error.tsx`:
  - Shows "La page ne s'est pas chargée", with Réessayer (Next 16's `retry`) and
    WhatsApp as a way out.
  - The header and footer stay.

## Self-critique: does Arabic feel designed, or only flipped?

**Checked and kept:**
- **Type:** Arabic has its own scale, not the French one mirrored.
  - Reading sizes are about 12 % larger, with 1.8 line-height.
  - Display sizes are slightly smaller, so the hero title sits on two balanced lines at
    375 and at 1440.
- **Reading direction:**
  - The chain is worked right to left, so it starts at the right edge and the nav stitch
    starts on the right.
  - The loader's loops light up right to left.
  - The drawer comes from the left, where the bag sits.
- **Mixed scripts:**
  - Every piece of Latin inside Arabic (brand, `CN-0005`, prices, phone examples) is
    isolated, and sentences use the Arabic comma.
  - The style guide caught a case where a bare Latin brand pulled the comma out of place.
- **Icons:** only directional icons flip (breadcrumb chevrons, back arrow). The WhatsApp,
  bag and Instagram icons don't.

**Fixed after the first shoot:**
1. The hero photo pushed the title below the fold on a laptop, in both languages. Now
   capped.
2. Without a photo, "L'atelier" was one narrow column with an empty half beside it. Now
   the title is on the inline start and the text beside it, so in Arabic the title sits on
   the right and the text flows towards the left.
3. On a phone, the checkout total was below the form. Now it's in the sticky bar.
4. The breadcrumb links were under 24 px tall (WCAG 2.2 target size). Now 32 px.
5. The drawer's checkout button was the large size, out of proportion. Now default.

**Automated checks on every page, both languages, 375/768/1440**
(`screenshots/phase-6/checks.json`):
- no horizontal overflow
- no image without `alt`
- no unnamed link or button
- the drawer opens on the inline end

**Still weak, and why:**
- Only two active pieces exist in the database, so the grid never shows the large tile or
  a full row. The layout is ready for more.
- The grey placeholders carry English text on Arabic pages. That comes from the sample
  data, and the real photos fix it.
- The Arabic copy still needs native review (`docs/i18n/translations-review.md`). The new
  strings (atelier, steps, load error) are added to that list.

**Not screenshotted:** the order confirmation page. It needs a real order, and placing
one would mark a piece as sold. It type-checks and builds, and uses only the shared
components.
