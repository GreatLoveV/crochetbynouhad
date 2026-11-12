# Phase 1: The current site

Audited 2026-11-11 from the working tree (including uncommitted changes) and a
local `next dev` run against the database in `.env.local`.

## What it is

**Crochet by Nouhad** is a small Moroccan shop for one maker, Nouhad, who sells
crochet pieces she makes by hand: bags (the main line), scarves and accessories.
Every piece is one of a kind, so there are no quantities. A piece is either
available or sold.

- **Who buys:** people in Morocco who find the shop through Instagram or WhatsApp
  links on their phones. They pay cash on delivery anywhere in Morocco, and
  checkout needs no account.
- **How orders happen:** there are two paths, and both are first-class.
  1. Cart → checkout form → the order is saved in Postgres → Nouhad confirms it
     on WhatsApp.
  2. A WhatsApp button prefills a message about a piece and sends it straight
     to her.
- **Stack:** Next.js 16.3 App Router (Turbopack, `proxy.ts` instead of
  middleware), React 19, Tailwind v4, shadcn (`base-nova`) on Base UI, Drizzle
  with Neon Postgres, Auth.js credentials for one admin, and Zod.

## Pages and flows

| Route | What it does |
|---|---|
| `/` | Hero (the first product's cover photo, headline, Shop and WhatsApp CTAs), then the catalogue grid with category pills (`?category=slug`). A "coming soon" category shows a designed empty state with Instagram and WhatsApp CTAs. |
| `/products/[slug]` | Gallery (large photo plus thumbnails), category, name, reference `CN-0002`, description, price, "Pièce unique" badge, Add to cart, Ask on WhatsApp. A sold piece keeps its page with "Vendu" and a disabled button. ISR every 60 s. |
| Cart drawer (`Sheet`) | Opens from the header bag icon. Holds lines, total and a link to the cart page. |
| `/cart` | Full cart page, with an empty state. |
| `/checkout` | Name, phone, city, address and notes, plus a honeypot field. A summary card sits on the side. A server action re-prices every line inside a transaction and reserves each bag atomically. Rate limits: 3 orders per phone and 5 per IP per hour. |
| `/order/confirmation?token=…` | Thanks message, order number, optional "send my order on WhatsApp" button, and the cart is cleared. |
| `/conditions`, `/confidentialite` | Legal pages. **The text is still placeholder** ("Texte de remplacement — à compléter"). |
| 404 | Shop-chrome 404 plus a root fallback. |
| `/admin/login` | Credentials login, rate-limited. |
| `/admin/products` (list, new, edit) | Name and description fields, category, price in MAD, slug, reference, visible toggle, mark sold or available, and photos as **pasted URLs** (no upload). |
| `/admin/orders` (list, detail) | Status workflow (new → confirmed → shipped → delivered, or cancelled) and a WhatsApp link to the customer. |
| `/admin/categories` | Toggle "À venir" (coming soon). |
| `sitemap.xml`, `robots.txt`, OG image | Present. Checkout and admin are `noindex`. |

## How languages work today

- **The storefront is French only.** There's no i18n library, no `[locale]`
  segment and no switcher. Every UI string lives in
  `src/lib/constants/strings.ts`, which was written so i18n would be "a
  mechanical change later". Some French text is also hardcoded in components:
  WhatsApp message templates, "Photo à venir", aria-labels, toasts and the
  legal pages.
- **English exists only in the database:** `categories.name_en`,
  `products.name_en` and `products.description_en`. The admin product form has
  English name and description fields, but the shop never shows these
  columns.
- `<html lang="fr">` is hardcoded. OG locale is `fr_MA`. Prices use
  `Intl.NumberFormat("fr-MA", MAD)`, so `280,00 MAD`.
- **So "English/French → French/Arabic" in practice means:** add Arabic as a
  second shop language, repurpose or replace the `*_en` columns with `*_ar`,
  and move the strings into per-locale dictionaries.

## The photos

**The local database has no real photos.** All six seeded pieces use
`placehold.co` placeholders. Only two products are active (one is sold), and two
of the three categories are "coming soon". The design will be judged on real
photography, so I'll need real photos of Nouhad's work (or the production
database) before Phase 6 screenshots mean anything.

## What's weak about the current design

The screenshots are in `docs/design/screenshots/before/` (375, 768 and 1440
wide, 13 views each).

1. **Every page looks like a template.** The layout is hero + pill filters +
   rounded card grid + three-column footer. The look ("Velvet": aubergine black,
   gold, Cormorant + Manrope) is the luxury dark-mode default. Nothing about it
   says crochet, yarn, Morocco or Nouhad.
2. **Dark ground versus handmade colour.** A near-black page makes bright yarn
   colours look harsh and makes the photo frames (big rounded rectangles with
   borders and shadows) compete with the work. Most admired craft sites use
   warm, light, paper-like grounds.
3. **Photos are small and boxed.** Product cards are about 250 px wide at
   1440 px, with `rounded-3xl` and heavy chrome. The hero photo is a framed card,
   not an image-led composition. Detail and texture, which are the selling
   point of crochet, are never shown large.
4. **There's no maker story.** Nouhad is named in one sentence. There's no
   about section, no hands or process shots, and no "how ordering works". For a
   one-person craft shop, these are the main trust builders.
5. **Copy is repeated.** "Paiement à la livraison · Livraison partout au Maroc"
   appears **four times** on the home page (hero, catalogue intro, footer,
   footer bar).
6. **Hierarchy is flat on mobile.** At 375 px, the hero puts two full-width
   buttons and a note above the photo, so the first screen shows no work at
   all. The catalogue starts about 1000 px down.
7. **Type details:**
   - The category eyebrows use letter-spaced uppercase. That pattern won't carry
     over to Arabic (Arabic has no case, and letter-spacing breaks the joins).
   - Cormorant at small sizes (card titles at 18 px) gets spindly on low-DPI
     Android screens.
8. **The checkout is functional but generic:**
   - The fields are very wide (about 730 px) on desktop.
   - The note "Frais de livraison confirmés par WhatsApp" sits beside a padlock
     icon, which implies payment security that isn't relevant here.
9. **Directional code is hardcoded to the left:**
   - Breadcrumb `ChevronRightIcon`.
   - `←` in "Retour à la boutique".
   - `left-3` badge positions, `ml-1.5`, and `-mx-5`-style physical utilities
     across components.

   All of these must become logical properties for RTL.
10. **The legal pages are placeholders.** This is a content problem, not a
    design one, but it's worth flagging before launch.

## Constraints the redesign must keep

- Cash-on-delivery checkout with server-side re-pricing, atomic one-of-a-kind
  reservation, rate limits and the honeypot.
- WhatsApp deep links with prefilled messages. These now need an Arabic version.
- ISR on product pages, `noindex` on checkout and admin, and sitemap built from
  the live catalogue.
- Admin `requireAdmin()` on every page and action.
- Image URL allowlist logic (`isOptimizableImageUrl`).
- Prices in integer centimes, formatted only through `formatPrice`.
