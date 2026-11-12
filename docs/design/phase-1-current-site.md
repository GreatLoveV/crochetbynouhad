# Phase 1 (round 2): the site as it is now

Audited on 2026-11-12 from commit `4da4142` (the « Le fil » redesign), running
locally against the database in `.env.local`. Round 1's documents are in
[`round-1/`](round-1/).

The "before" screenshots are in `screenshots/before/`. Each page is shot in French
and Arabic at 375, 768 and 1440 px wide. That includes the drawer, a product just
added to the bag, and checkout with errors.

## What the site does

**Crochet by Nouhad** is a one-person Moroccan shop. Nouhad crochets bags (the
main line), scarves and accessories by hand. Every piece is one of a kind, so a
piece is either available or sold, never "3 left".

- **Who buys:** people in Morocco, mostly on phones, who arrive from Instagram or
  WhatsApp.
- **How they pay:** cash on delivery anywhere in Morocco. There are no customer
  accounts.
- **Two ways to order:**
  1. Bag → checkout form → the order is saved, then Nouhad confirms it on
     WhatsApp.
  2. A WhatsApp button sends a prefilled message straight to her.
- **Languages:** French is the default, at `/fr`. Arabic is at `/ar` and reads
  right to left. Both use typed dictionaries, and pieces have `*_ar` fields with
  a French fallback.

## Every page and flow

| Page | What it does |
|---|---|
| `/[lang]` | First screen: the newest piece's photo, the title, WhatsApp and "see the collection". Then a chain divider and the collection with category filters, including a "coming soon" state. Then the "L'atelier" text block, the three ordering steps, and the footer. |
| `/[lang]/products/[slug]` | Gallery with thumbnails, name, reference, price, description, "Add to bag", "Ask on WhatsApp", and the delivery note. A sold piece keeps its page. |
| Bag drawer | Opens from the bag icon. Holds the lines, the total, "Checkout" and "See the bag". |
| `/[lang]/cart` | Full bag page, with an empty state. |
| `/[lang]/checkout` | Name, phone, city, address and notes, plus a summary. Errors appear next to each field and focus moves to the first one. The server re-prices every line and reserves each piece atomically, with rate limits and a honeypot field. |
| `/[lang]/order/confirmation` | Thanks message, order number, and an optional "send on WhatsApp" button. |
| `/[lang]/conditions`, `/confidentialite` | Legal pages. The text is still a placeholder. |
| 404, error, loading | Designed pages, in both languages. |
| `/[lang]/styleguide` | Dev-only list of components. |
| `/admin/…` | Products, orders and categories, in French only. Out of scope for the shop redesign. |

## What's weak about the current design

The user's verdict was: *"it looks a bit plain, the color used isn't that good, I
like the threads but that's it."* The screenshots back that up:

1. **No photos.** The local database has only `placehold.co` grey boxes ("Raffia
   Beach Bag 1"). The page was designed to let the photos carry it, and without
   them there is nothing to carry it. The grey boxes become the most visible
   thing on every page. **This matters more than any token.** A design for this
   shop has to look good before real photos arrive, and much better once they do.
2. **Colour.**
   - Off-white (`#FBFAF8`), ink (`#241C2B`), one deep green (`#1D5C48`) and grey.
     That is the restrained "quiet craft" default, and it says nothing about yarn,
     which is all colour.
   - The green appears only on the main button, the chain and the step numbers.
   - The footer is beige.
3. **Layout.**
   - Every section is the same thing: a heading, then content, then a hairline.
     The atelier, the steps and the footer all read at the same volume.
   - The page never changes surface, scale or rhythm, so nothing stands out
     except the button.
4. **Typography.**
   - Markazi (headings) and Readex Pro (text) are good, honest choices, but they
     are set politely everywhere: medium weight, sentence case, left aligned.
   - The type is never used as a shape, and nothing is very large or very small.
5. **Photo presentation.** Square corners and no frame: the photo just sits on
   the page. With grey placeholders that looks unfinished, and even with real
   photos nothing ties them to the craft.
6. **The thread (the part the user likes).** The chain appears only twice: under
   the hero and as the current nav item. It is thin (1.4 px), green and quiet.
   It should be the signature, and right now it is a footnote.
7. **Navigation.**
   - It is clear and works. On a phone the links move to a second row, which
     costs 45 px of height on every page.
   - The bag icon has no count until something is added. That's fine.
8. **Mobile.**
   - At 375 px the first screen is a grey photo box, then the title below the
     fold.
   - The two buttons are full width and identical in size, so the hierarchy
     between them is weak.
9. **Arabic.**
   - Correctly mirrored, larger type and taller lines, and the chain runs right
     to left.
   - But it is the French page flipped. Nothing in it uses what Arabic does well,
     for example a large Naskh title used as a shape.
   - The filter row overflows sideways with no hint (the last chip is cut off).
   - The empty-photo label is in Latin script ("Raffia Beach Bag 1") inside the
     Arabic page.
   - Bug: on the Arabic product page, the breadcrumb chevron (المتجر › حقائب)
     points right, against the reading direction. It should point left.
   - The product page ends with a large empty gap before the footer. The
     description is short, and nothing else (more pieces, the maker) fills
     the space.
10. **A tiny catalogue in a grid made for many pieces.** Locally there are two
    active pieces, one of them sold. At 1440 px they fill two of four columns,
    and the rest of the row is empty. A one-person shop will often have only a
    handful of pieces, so the layout must look full with 2 pieces and with 20.
11. **Repeated, uniform blocks.** The atelier, the steps and the footer stack as
    three similar blocks. Nothing tells Nouhad's story with any warmth: no hands,
    no yarn, no Morocco.

## What works and must stay

- The flows, validation, accessibility work (skip link, focus to the first
  error, labels), and Lighthouse 90+ on mobile.
- Logical properties throughout, so RTL is solid.
- The chain motif, which the user likes. It should grow, not go.
- The copy and its tone, in both languages.

## Open dependency

**Real photos of Nouhad's work.** The redesign will be judged on them. I'll ask
for either the production database URL (read-only) or a folder of photos before
the Phase 5 screenshots. Until then, the design must make an empty or grey photo
look intentional.
