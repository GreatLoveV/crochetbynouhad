# Phase 7: Audit and polish

Four checks on the redesigned shop, in French and Arabic:

1. A design audit with the `design-auditor` skill. Target: 86 or more, the
   PetiteKnit benchmark being 85.
2. Accessibility by hand: keyboard, focus, alt text, contrast and reduced
   motion.
3. Performance: Lighthouse on mobile (target 90 or more), with fonts subset
   and preloaded per language.
4. Security: forms, accounts and uploads, with the `vibesec` skill.

**Result.**

- **Design audit:** 52 → **86/100**. The 14 missing points are content only
  Nouhad can give: her photos, the legal text, and a native read of the
  Arabic.
- **Lighthouse mobile:** **90 or more on every page measured, in both
  languages** (see the table). Checkout's SEO score is low on purpose, because
  the page is `noindex`.
- **Security:** no exploitable issue found. Two hardening steps are
  recommended.

The rest of this file is the detail, including what was *not* checked.

---

## 1. Design audit

| | |
|---|---|
| Input | The shop's code: `src/app/[lang]`, `src/components`, `globals.css` |
| Type | Next.js 16 + React 19 + Tailwind 4, shadcn/ui on Base UI |
| Confidence | 🟢 High (code), plus screenshots at 375, 768 and 1440 px |
| Settings | Full audit · dev handoff · WCAG 2.2 AA, with i18n/RTL |
| Token coverage | colours 100 % on public pages (palette tokens only) · radius from one `--radius` scale · two shadows |

Score formula: 100 − 12 per 🚫 blocker − 8 per 🔴 critical − 4 per 🟡 warning
− 1 per 🟢 tip.

| | 🚫 | 🔴 | 🟡 | 🟢 | Score |
|---|---|---|---|---|---|
| Before this phase | 1 | 1 | 6 | 4 | 100 − 12 − 8 − 24 − 4 = **52** |
| After | 0 | 1 | 1 | 2 | 100 − 8 − 4 − 2 = **86** |

| Separate scores | After |
|---|---|
| Accessibility (categories 2, 6, 7, 15, 16) | 100/100 (see "not checked" below) |
| Ethics (category 18) | 93/100: one 🟡, delivery fees (see below) |
| Usability (Nielsen H1, H2, H3, H6, H7, H10) | 100/100 |

### Fixed in this phase

| Was | Severity | Fix |
|---|---|---|
| No skip link: a keyboard user went through the brand, 3 links, the language and the bag on every page (WCAG 2.4.1) | 🚫 | "Aller au contenu" / "الانتقال إلى المحتوى" is now the first Tab stop. It appears in the top inline-start corner, so on the right in Arabic, and Enter moves focus to `<main>`. |
| The checkout collected a phone number and address with no link to the terms or the privacy page | 🟡 | A line under the button: "En confirmant, vous acceptez les conditions générales. Vos coordonnées servent à confirmer et livrer la commande (confidentialité)." It is in Arabic too. |
| After a refused order, focus stayed on the button | 🟡 | Focus moves to the first field to fix. Each error is announced and linked to its field. |
| On a phone the home title was 60 px and ran to 4 lines | 🟡 | 48 px below `sm` (46 px in Arabic): 2 lines in both languages. Section titles drop one step as well. |
| A screen reader read each piece's name twice (photo alt + caption inside the same link) | 🟡 | The photo is `alt=""` where the link already names the piece. Lighthouse's `image-redundant-alt` now passes. |
| The footer jumped down when a streamed page arrived (Lighthouse CLS 0.29 on the home page) | 🟡 | The loading states take a full screen, so the footer is never in view while a page loads. |
| The active gallery thumbnail's outline replaced the focus ring with a 1 px line | 🟢 | Thumbnails keep the 2 px Thé focus ring. |
| Required checkout fields weren't exposed as required | 🟢 | `required` on name, phone, city and address. `noValidate` keeps the browser's own bubbles away, so the shop's messages show. |

### Still open

> 🔴 **Placeholder content**
> The sample pieces use `placehold.co` pictures with English text ("Raffia
> Beach Bag 1"), also on Arabic pages. The legal pages are marked as temporary
> text.
> Fix: Nouhad's photos in the admin, and legal text written for her business.
> Code can't fix this, and it must not be filled with stock pictures.

> 🟡 **Arabic not yet read by a native speaker**
> Every Arabic string is machine-assisted and listed in
> [`docs/i18n/translations-review.md`](../i18n/translations-review.md),
> including the plural "you" (تحقّقوا) and the new strings added in this phase.

> 🟢 **Two unused components are off-system**
> `ui/card.tsx` and `ui/select.tsx` still have shadcn's `rounded-2xl` and
> `transition-all`. No public page uses them. Restyle them or delete them
> before anyone does.

> 🟢 **Gallery thumbnails use `aria-current`**
> Works, but `aria-pressed` would describe a picker more exactly. Low impact.

### What works well

- **Contrast is high everywhere.** The lowest text pair is Fil on Lin at
  5.69:1; body text is 15.8:1; input borders are 3.51:1. Errors are 7.0:1,
  always with an icon and text, never colour alone.
- **Arabic is designed, not mirrored.** It has its own type scale (bigger
  reading sizes, 1.8 line height), logical properties throughout, and the
  chain draws from the right. Latin inside Arabic is isolated with `<bdi>`.
- **States are complete.** Every async view has loading, empty and error
  states, and errors offer a retry plus WhatsApp.
- **The ethics are clean.** A sold piece stays visible as "Vendu" and is not a
  fake scarcity signal. There is no countdown, no pre-checked box, no
  confirmshaming.

### Ethics: the one 🟡

Delivery fees are agreed on WhatsApp after the order. The checkout says so
next to the button ("Frais de livraison confirmés par WhatsApp"), and the
total is labelled "Total à payer à la livraison". It's disclosed, but the
customer commits before knowing the final price. A small fee table by city
(or one flat fee) on the checkout would close it. That's a business decision,
so it isn't changed here.

---

## 2. Accessibility, by hand

| Check | How | Result |
|---|---|---|
| Keyboard | Playwright, both languages: first Tab stop, Enter on it, Escape in the drawer, focus after a refused order | Skip link is the first stop and moves focus to `<main>`; Escape closes the drawer; focus lands on the first invalid field. Focus trapping in the drawer is Base UI's dialog behaviour, not tested separately. A full manual tab-through of every page was not done. |
| Focus | Global `:focus-visible` 2 px Thé ring, 3 px offset | Visible on every control. Thé on Coton is 7.5:1. |
| Alt text | Script over every page, 3 widths, both languages | No `<img>` without `alt`. Photos inside a named link are `alt=""`; the gallery's main photo is the piece's name. |
| Contrast | All palette pairs computed | All pass AA; most pass AAA (table below). |
| Reduced motion | Emulated `prefers-reduced-motion` (Phase 6) | Measured: the chain is drawn with no animation and the loader is static. The drawer slide and photo crossfade fall under the global reduced-motion rule in `globals.css` (not measured one by one). |
| Language | `<html lang dir>` from the URL; French product text on Arabic pages gets `lang="fr"`; the language link has `lang` + `hreflang` | Correct. |

| Pair | Ratio |
|---|---|
| Encre on Coton (text) | 15.78 |
| Fil on Coton (secondary text) | 6.54 |
| Fil on Lin (footer, summaries) | 5.69 |
| Coton on Thé (main button) | 7.52 |
| Grenade on Coton (errors) | 7.02 |
| Trait on Coton (input borders) | 3.51 |

**Not checked:** a real screen reader (NVDA, VoiceOver, TalkBack), and
especially Arabic speech. The structure is right (labels, `lang`, live
errors), but how a reader pronounces mixed Arabic and Latin is worth hearing
once on a phone.

---

## 3. Performance (Lighthouse, mobile)

Lighthouse 12.8.2 with its default mobile profile (simulated slow 4G, 4× CPU
slowdown), on a production build served locally. It was run from the npx
cache already on this machine, so nothing was added to the project.

Lighthouse warns that this machine's CPU is slower than it expects
(benchmark 909), so Total Blocking Time reads high. The numbers swing a few
points between runs. The table is one full run after all fixes.

| Page | Lang | Performance (before → after) | Accessibility | Best practices | SEO | LCP | CLS (before → after) | TBT |
|---|---|---|---|---|---|---|---|---|
| Home | FR | 72 → **91** | 100 | 100 | 100 | 3.4 s | 0.288 → 0 | 70 ms |
| Product | FR | 89 → **93** | 100 | 100 | 100 | 3.2 s | 0 → 0 | 70 ms |
| Checkout | FR | 85 → **92** | 100 | 100 | 66 | 3.2 s | 0.085 → 0 | 130 ms |
| Terms | FR | 89 → **91** | 100 | 100 | 100 | 3.2 s | 0 → 0 | 160 ms |
| Home | AR | 71 → **90** | 100 | 100 | 100 | 3.6 s | 0.284 → 0.001 | 120 ms |
| Product | AR | 85 → **91** | 100 | 100 | 100 | 3.3 s | 0 → 0.001 | 70 ms |
| Checkout | AR | 88 → **95** | 100 | 100 | 66 | 2.7 s | 0 → 0.001 | 100 ms |
| Terms | AR | 92 → **91** | 100 | 100 | 100 | 3.3 s | 0 → 0.004 | 120 ms |

"Before" is the first run of this phase, on the Phase 6 code. Checkout was
measured again after its own fix; the other rows are from the same full run.

What changed the numbers:

- **CLS 0.29 → 0 on the home page:** the full-height loading state described
  above.
- **Checkout and the bag page** read the bag in the browser, so they show a
  loader, then the form or an empty message. A tall loader alone made it
  worse: with an empty bag the footer jumped *up* (CLS 0.12). Instead, the
  area holding all three now reserves 80 % of the screen height, so the
  footer stays below the screen whichever one shows.
  The trade-off: an empty bag on a phone shows some blank space before the
  footer.
- **The home page's database reads now run in parallel.** The page streams in
  after them, and its first photo is the LCP element.
- **`priority` → `preload` / `fetchPriority`.** Next 16 deprecates
  `priority`. The single main photo (hero, product gallery) now gets a
  `<link rel=preload>`; tiles above the fold get `loading="eager"` and
  `fetchPriority="high"`.
- **Fonts.** Phase 5 declared each family twice (once per language). The
  built CSS showed both declarations carried every subset anyway, so the CSS
  was doubled and Arabic pages preloaded four French files they never used.
  Now each family is declared once:
  - The `latin` files are preloaded everywhere. Arabic pages need them too,
    for the brand, prices and "MAD" in the first screen.
  - The `arabic` files are not preloaded, because a preload is per layout and
    `[lang]` is shared, so French pages would download them for nothing.
    Arabic pages fetch them as soon as the CSS meets Arabic text, with `swap`
    in the meantime.
  - The browser picks each file by `unicode-range`. A French page never
    downloads Arabic glyphs, and the reverse.

**The honest limit:** LCP stays around 3 s, and most of it is the sample
photo. `placehold.co` is a third-party host, so Next.js serves it unoptimised.
Nouhad's real photos on Vercel Blob will be resized and served as AVIF/WebP
by Next.js from the same origin, which should lower LCP. That isn't measured,
since there are no real photos yet.

`checkout` has SEO 66 because it is `noindex` (and disallowed in
`robots.txt`) on purpose: an order form shouldn't be in search results.

---

## 4. Security review (vibesec)

Scope: the checkout form, the order confirmation, the cart action, admin
login and sessions, every admin server action, and product photos (the
"uploads").

| Area | Finding |
|---|---|
| Access control | Every admin page calls `requireAdmin()`, and every admin server action starts with `getAdmin()` (checked one by one: all 9; login and logout are the only unguarded ones, as they should be). The proxy redirect is not relied on. |
| Order form | Zod on the server; prices and total recomputed on the server; the cart is ids only; honeypot; 3 orders per phone and 5 per IP per hour; the conditional `UPDATE` stops double-selling. Errors never leak internals. |
| Confirmation | Random `public_token` in the link, never the sequential id. Name and city only shown to the browser holding the `httpOnly` order cookie. `strict-origin-when-cross-origin` keeps the token out of the referrer when the customer opens WhatsApp. |
| Login | bcrypt, the same message for an unknown email and a wrong password, 5 failures per email and 10 per IP per 15 minutes, checked inside Auth.js `authorize` so the raw endpoint is covered. The `from` redirect only accepts `/admin…` paths (no open redirect). |
| Uploads | There is no file upload: photos are https links, validated (`https:` only, at most 2000 characters, admin only). No SVG or file parsing on the server. |
| Injection | Drizzle queries are parameterised. React escapes all output. The order email is plain text. |
| Secrets | Only `NEXT_PUBLIC_WHATSAPP_NUMBER` and `NEXT_PUBLIC_SITE_URL` reach the browser, and both are public by design. `.env.local` is git-ignored; `.env.example` holds names only. |
| Headers | HSTS, `nosniff`, `X-Frame-Options: DENY`, Referrer-Policy, Permissions-Policy. |

**Recommended, not done (no exploitable issue today):**

1. **A Content-Security-Policy.** It was left out deliberately: Next's inline
   bootstrap scripts need a nonce, which makes every page dynamic. Worth doing
   with a nonce from `proxy.ts` once the site is deployed and can be tested
   there.
2. **Rate limits trust `x-forwarded-for`.** That's correct on Vercel, which
   overwrites it. Behind another proxy that only appends, a bot could rotate
   the header and bypass the per-IP limits. The per-phone limit still holds.
   The README says so.
3. Product photo links accept any https host. That's admin only, so the worst
   case is a tracking pixel added by the admin themself. If uploads to Vercel
   Blob are wired later, allow only that host.

---

## Files

- Lighthouse JSON reports: kept out of the repository (about 1 MB each); the
  table above is their summary.
- Fixes: commits `ae11cce` (skip link, checkout links, focus, Open Graph) and
  the "perf" and "docs" commits that follow it.
