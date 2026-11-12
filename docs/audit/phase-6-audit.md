# Phase 6 (round 2): Audit and polish

The « Fouwwa » redesign, checked in French and Arabic. This uses the same tools and the same
scoring as the round-1 audit ([`phase-7-audit.md`](phase-7-audit.md)), so the numbers compare.

1. **Design audit** with the `design-auditor` skill, including i18n and RTL. The brief's target
   is 96 or more, above the Najdunes benchmark (95).
2. **Accessibility by hand:** keyboard, focus, alt text, contrast and reduced motion.
3. **Performance:** Lighthouse on mobile, target 90 or more in both languages, after image and
   font optimisation.
4. **Security** with the `vibesec` skill.

## Result

| Check | Result |
|---|---|
| **Design audit** | **85/100** (round 1: 86). The brief's target of 96 is **not reached**: 12 points are lost to two content items code can't supply (the real photos 🔴 and a native read of the Arabic 🟡). Without them, the code scores 97, against the Najdunes benchmark of 95. |
| **Accessibility** | Lighthouse (axe-core) 100 on every page, both languages. The keyboard, focus, alt text, contrast and reduced-motion checks pass. A real screen reader was not tested. |
| **Lighthouse mobile** | Median of 3 runs per page: **5 of 8 at 90 or more** (89 to 93). The other three are at 89: home in Arabic, and the product page in both languages. That is level with the round-1 code measured on the same day (89 to 92), and within the run-to-run spread. On those three pages, the largest element is a sample photo served by `placehold.co`. |
| **Security** | No exploitable issue found in the code. **`npm audit` reports a critical Next.js advisory and three high ones** (zod, sharp, source-map-js). Fixes exist in the same major versions, but **they are not applied**: they change your dependencies, so they need your go-ahead (section 4). |

**Changed in this phase:**
- **Fraunces is self-hosted** as one 35 KB file instead of 118 KB.
- **Ruqaa is bold only,** which saves 37 KB on Arabic pages.
- **The main photo** is the only image with high fetch priority.
- **Two round-1 tips are fixed:** thumbnails use `aria-pressed`, and the select menu is on the
  design system.
- **The language-switch short labels** moved into the i18n config.
- **Inline CSS was tried and rejected** (it doubled the blocking time, see section 3).

The rest of this file is the detail, including what was **not** checked.

---

## 1. Design audit

| | |
|---|---|
| Input | The shop's code (`src/app/[lang]`, `src/components`, `globals.css`) and the 42 Phase 5 screenshots |
| Type | Next.js 16, React 19, Tailwind 4, shadcn/ui on Base UI |
| Confidence | 🟢 High (code), plus screenshots at 375, 768 and 1440 px |
| Settings | Full audit, dev handoff, WCAG 2.2 AA, with i18n/RTL |
| Token coverage | **Colours:** palette tokens only on public pages. **Radii:** by role (14, 18, 24 and 28 px, plus pills). **Easing:** one (`--ease-thread`). |

Score formula, from the skill: 100 − 12 per 🚫 blocker − 8 per 🔴 critical − 4 per 🟡 warning
− 1 per 🟢 tip.

| | 🚫 | 🔴 | 🟡 | 🟢 | Score |
|---|---|---|---|---|---|
| Round 1, end | 0 | 1 | 1 | 2 | **86** |
| Round 2, start of this phase | 0 | 1 | 1 | 5 | 100 − 8 − 4 − 5 = **83** |
| Round 2, after this phase | 0 | 1 | 1 | 3 | 100 − 8 − 4 − 3 = **85** |

**The 96 target is not reached.** The 🔴 and the 🟡 are content that code can't supply:

- 🔴 The real photos.
- 🟡 A native speaker's read of the Arabic.

They cost 12 points by themselves. This matches round 1, and both have been open questions
since Phase 3. Without them the score can be at most 88, even if every code issue were fixed.

**With the two content items set aside, the code scores 97:** 100 − 3 tips.

Najdunes scored 95 on the same rubric with real photos and native copy. So the honest comparison
is:
- **Code:** 97 against 95.
- **The site as it stands today:** 85 against 95.

| Separate scores | After |
|---|---|
| Accessibility (categories 2, 6, 7, 15, 16) | 100/100 (see "not checked" below) |
| Ethics (category 18) | 93/100: one 🟡, delivery fees (unchanged from round 1) |
| Usability (Nielsen H1, H2, H3, H6, H7, H10) | 100/100 |
| i18n and RTL (category 17) | 100/100 for the code. The Arabic copy itself is the 🟡 above. |

### Fixed in this phase

| Was | Severity | Fix |
|---|---|---|
| The language switch's short labels (FR, عربي) were hardcoded in the component | 🟢 | They are now `localeShortName` in `i18n/config.ts`, next to the full names. Each short label is part of its full name, so the link's accessible name contains the visible text (WCAG 2.5.3). |
| Gallery thumbnails used `aria-current` (open since round 1) | 🟢 | They now use `aria-pressed`, which describes a photo picker. |
| `ui/select.tsx` still had shadcn's `transition-all` and `rounded-2xl` (open since round 1) | 🟢 | It now animates only colour, border and shadow, with the shared easing, and its menu has 18 px corners. `ui/card.tsx` was already restyled in Phase 4. |
| Contrast label on the Trait swatch was 4.36:1 after the plum change | 🟢 | Trait is darkened to `#866C82` (white on it 4.6:1). Fixed when the colour changed, listed here for completeness. |

### Still open

> 🔴 **Placeholder content**
> - **Photos:** every piece still uses a `placehold.co` picture with English text ("Raffia
>   Beach Bag 1"), on Arabic pages too.
> - **Legal pages:** marked as temporary text.
> - **Layout:** the one-piece-per-row layout was designed for real photos. With grey
>   placeholders, the rows look empty on wide screens.
>
> Fix: Nouhad's photos in the admin, and legal text written for her business. This must not be
> filled with stock pictures.

> 🟡 **The Arabic hasn't been read by a native speaker**
> This includes the strings added in rounds 1 and 2. The new ones are listed in
> [`docs/design/phase-5-redesign.md`](../design/phase-5-redesign.md) and
> [`docs/design/design-system.md`](../design/design-system.md). Phase 7 gathers them into
> [`docs/i18n/translations-review.md`](../i18n/translations-review.md).

> 🟢 **The share image has no photo and uses a fallback font**
> - **Font:** Satori, which draws the image, can't read `woff2`, so the card uses its built-in
>   fonts, not Fraunces.
> - **Arabic version:** it shows only the Latin brand name, because Satori doesn't join Arabic
>   letters.
>
> Fix: a `.ttf` copy of Fraunces for Satori, and the piece's photo on product links once real
> photos exist.

> 🟢 **The 404 page's browser tab shows the generic site title**
> - **Why:** `not-found.tsx` can't export metadata; only `global-not-found` can.
> - **Tried:** a `<title>` in the page, and setting `document.title` after hydration. Next's own
>   head handling kept the layout's title both times, checked in Chromium. Both attempts were
>   reverted.
> - **Impact:** it only affects the tab text. The page is `noindex`, and its `h1` says "Cette
>   page n'existe pas". A product link that no longer exists already gets "Page introuvable"
>   from the product page's own metadata.

> 🟢 **Yarn-colour chips exist but show nothing**
> `YarnChips` is built and on the styleguide, but products don't store their yarn colours yet.
> Adding that field changes the data, so it needs your approval (an open question since
> Phase 4).

### What works well

- **Contrast is high everywhere.** Body text (Barqouq on Rose) is 13.2:1 and secondary text
  6.8:1. Errors are 6.9:1, always with an icon and a sentence.
- **Arabic is designed, not mirrored:**
  - its own display face (Aref Ruqaa) and its own type scale, with taller lines for Ruqaa;
  - logical properties throughout: no `left` or `right` class on any public page;
  - the menu slides in from the right;
  - the chain runs from the right;
  - numbers in Arabic sentences are isolated so they read in the right order.
- **States are complete.** Every async view has loading, empty and error states. Errors offer
  a retry plus WhatsApp. An unavailable piece in the cart says so and offers to go back to the
  shop.
- **One motion moment.** Everything else moves only in answer to the visitor, and reduced motion
  is respected (measured, see section 2).
- **The ethics are clean.** A sold piece stays visible as "Vendu" without faking scarcity. There
  is no countdown, no pre-checked box and no confirmshaming.

### Ethics: the one 🟡 (unchanged)

Delivery fees are agreed on WhatsApp after the order. The checkout says so next to the button,
and the total is labelled "Total à payer à la livraison". It is disclosed, but the customer
commits before knowing the final price. A small fee table by city, or one flat fee, would close
it. That's a business decision, so it isn't changed here.

---

## 2. Accessibility, by hand

All checks used Playwright and Chromium, on the production build or the dev server.

| Check | How | Result |
|---|---|---|
| Keyboard | Tab through the home page, both languages, 1440 and 375 px. Open the phone menu and Tab inside it | **Home:** 22 to 24 stops, each with a visible ring. **Phone menu:** focus moves into it, and every link shows a ring. **Two flags are false positives:** the skip link and the Laine button on the atelier band have a ring in their own colour, but it sits 3 px outside them, over the header and over the Naanaa band. |
| Focus | One global `:focus-visible` rule: a 2 px Barqouq outline, offset 3 px. Laine on dark bands (`on-dark`) | Visible on every control. Barqouq on Rose is 13.2:1, and Laine on Barqouq 14.8:1. |
| Alt text, headings, names | Script over 7 pages in both languages: `img` alt, the `h1` count and order, unnamed buttons and links, unlabelled SVGs, duplicate ids, landmarks, `lang` and `dir` | **Images:** no `<img>` without `alt`. Photos inside a named link are `alt=""`, and the gallery's main photo is the piece's name. **Headings:** exactly one `h1` per page, in order. **Names:** no unnamed control or unlabelled SVG. **IDs:** no duplicates. **Footer:** its two navs are labelled by their headings. **Language:** `lang` and `dir` are right on every page. |
| Contrast | Scan of computed colours (oklab converted through a canvas) on home, product, cart, checkout, terms, 404 and the styleguide, both languages, 375 and 1440 px | **Text:** nothing below AA. **Targets:** none under 24 px, except the skip link, which is 1 px until it is focused, as intended. |
| Reduced motion | Emulated `prefers-reduced-motion` | **Chain:** its animation is `none`. **Transitions:** 0.01 ms. **Pressed button:** keeps its size. Without the setting: the chain draws in 1.5 s, and a pressed button shrinks to 0.97. |
| axe-core | Through Lighthouse's accessibility category | 100 on all 8 runs (section 3). |

**Not checked:**
- **A real screen reader** (NVDA, VoiceOver or TalkBack), and especially Arabic speech.
- **Safari and Firefox.**
- **A full Tab walk of every page.** Only the home page and the phone menu were walked one
  stop at a time. The other pages had their focus style checked by the script, and the
  structure checks above.

---

## 3. Performance (Lighthouse, mobile)

Lighthouse 12.8.2, default mobile profile (simulated slow 4G, 4× CPU slowdown), on a
production build served locally (`next start`).

**Method.** Single runs on this machine vary by ±4 points: the same page scored 85 and 89 on
two consecutive runs. So each page was run **3 times**, and the table shows the **median**, as
Lighthouse recommends. For a fair "before", the **round-1 code (commit `4da4142`)** was built
from a temporary worktree and measured the same way, on the same day.

| Page | Lang | Round 1 (median) | Round 2, start of phase | **Round 2, final** (3 runs) | A11y | Best practices | SEO | FCP | LCP | CLS | TBT | Fonts (round 1 / now) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Home | FR | 89 | 89 | [90, 90, 91] **90** | 100 | 100 | 100 | 1.1 s | 3.6 s | 0 | 90 ms | 79 / 89 KB |
| Home | AR | 89 | 82 | [87, 89, 90] **89** | 100 | 100 | 100 | 1.1 s | 3.8 s | 0 | 83 ms | 120 / 135 KB |
| Product | FR | 90 | 87 | [89, 89, 89] **89** | 100 | 100 | 100 | 1.1 s | 3.6 s | 0 | 116 ms | 79 / 89 KB |
| Product | AR | 90 | 85 | [88, 89, 89] **89** | 100 | 100 | 100 | 1.5 s | 3.6 s | 0 | 119 ms | 120 / 135 KB |
| Checkout | FR | 89 | 88 | [92, 92, 93] **92** | 100 | 100 | 66 | 1.1 s | 3.2 s | 0 | 113 ms | 79 / 89 KB |
| Checkout | AR | 89 | 85 | [89, 90, 90] **90** | 100 | 100 | 66 | 1.5 s | 3.5 s | 0 | 114 ms | 120 / 135 KB |
| Terms | FR | 92 | 90 | [93, 93, 94] **93** | 100 | 100 | 100 | 1.1 s | 3.2 s | 0 | 52 ms | 79 / 89 KB |
| Terms | AR | 91 | 87 | [91, 91, 92] **91** | 100 | 100 | 100 | 1.5 s | 3.3 s | 0.026 | 97 ms | 120 / 135 KB |

"Round 2, start of phase" is the redesign as committed at the end of Phase 5. Checkout's SEO is
66 on purpose: the page is `noindex`.

**What changed the numbers:**

| Change | Effect |
|---|---|
| **Fraunces self-hosted, pinned to Soft 100 and Wonk 1** (weights 300 to 700, no optical-size axis) | **Fonts:** the French preload drops from 118 KB to 35 KB. Total fonts go from 171 to 89 KB on French pages and from 253 to 135 KB on Arabic pages. `next/font/google` can only fetch whole axes, hence a committed `.woff2` plus its OFL licence. |
| **Aref Ruqaa bold only** | **Arabic pages:** a 37 KB file fewer. Text that asked for the regular weight (the hero caption) now uses the bold file, which suits a piece name. |
| **Only the main photo gets `fetchPriority="high"`** | Before, the hero was preloaded *without* a priority hint, while the first piece row, below the hero, was marked high priority. Now the hero uses `loading="eager"` plus `fetchPriority="high"`, as the Next 16 docs recommend, and the rows load lazily. |
| **`experimental.inlineCss`, tried and removed** | **Effect:** it removed the render-blocking stylesheet, but parsing 17 KB of CSS inside the HTML **doubled Total Blocking Time** (about 100 → 200 ms on every page) and lowered scores by 2 to 7 points. **Measured:** with it off, terms went from 90 to 94 (FR) and from 87 to 91 (AR). It stays off. |

**Why three pages stay at 89.** Their largest element is a sample photo from `placehold.co`,
another host, which Next can't optimise. The page also has to open a connection to that host,
on simulated slow 4G. Nouhad's photos on Vercel Blob will be resized, converted to WebP or AVIF
and served from this site's origin, so this should change once they're in. **Not verified,**
since there are no real photos yet.

**What the redesign costs.**
- **Fonts:** about 10 KB more on French pages and 15 KB more on Arabic pages than round 1:
  three faces instead of two.
- **JavaScript:** the same as round 1 (about 203 KB transferred). The phone menu reuses the
  dialog code the cart drawer already loads.

**Machine.** Lighthouse's CPU benchmark here was 1,400 to 2,100. Round 1 recorded 909, so this
session's numbers are not directly comparable with round 1's table. That's why round 1 was
measured again here.

---

## 4. Security review (vibesec)

**Scope:**
- **Everything that changed since round 1.** On the server, the only change is a font style on
  the admin layout. Everything else is styling and layout.
- **The skill's checklist, re-run:** links that open new tabs, raw HTML, values exposed to the
  browser, secrets in git, response headers, and how the new WhatsApp links are built.

| Area | Finding |
|---|---|
| Since round 1 | No change to server actions, validation, access control, the database or the proxy. Round 1's findings still hold: admin guarded on every page and action, Zod on every form, server-recomputed prices, rate limits, a random confirmation token, bcrypt login, no file uploads. |
| New links | **New-tab links:** every `target="_blank"` has `rel="noopener"`; the admin's uses `noreferrer`, which implies it. **WhatsApp links:** the new piece rows build them with `encodeURIComponent` (in `whatsappUrlTo`), so a piece name can't break out of the URL. |
| Injection | No `dangerouslySetInnerHTML` anywhere. React escapes all output. |
| Secrets | No `.env` file is in git except `.env.example`. **Audit build:** this phase's production build was made with the example number `212612345678` passed on the command line. It wasn't written to any file, and the build was never deployed. |
| Headers | HSTS, `nosniff`, `X-Frame-Options: DENY`, Referrer-Policy and Permissions-Policy are on every response (checked on the production server). |
| Fonts | One new committed file, `src/app/fonts/fraunces-soft-wonk-latin.woff2`: the Google Fonts instance, with its SIL OFL licence next to it. It's a static font served as a file, not executed. |
| **Dependencies** | **`npm audit --omit=dev` reports 4 vulnerable packages. This is the main finding of this review (below).** |

### ⚠️ Vulnerable dependencies (not fixed: needs your go-ahead)

| Package | Installed | Advisory | Exposure in this shop | Fixed in |
|---|---|---|---|---|
| `next` | 16.3.8 | **Critical:** remote code execution in the image optimiser with SVG files ([GHSA-2464-fhr4-w9xw](https://github.com/advisories/GHSA-2464-fhr4-w9xw)) | **Not verified.** The optimiser only accepts images from `*.public.blob.vercel-storage.com`, and `dangerouslyAllowSVG` is off. I haven't confirmed whether that blocks the attack. | 16.4.6 |
| `next` | 16.3.8 | Denial of service through Server Actions ([GHSA-p3m5-59mp-jv5r](https://github.com/advisories/GHSA-p3m5-59mp-jv5r)) | **Exposed:** the order form is a public server action. | 16.4.6 |
| `next` | 16.3.8 | Remote code execution in `use cache` functions returning typed arrays ([GHSA-673q-mjm6-r5xr](https://github.com/advisories/GHSA-673q-mjm6-r5xr)) | **Not exposed:** the code has no `use cache`. | 16.4.6 |
| `zod` | 4.6.5 | Memory exhaustion validating oversized constrained collections ([GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5)) | **Likely exposed:** the order form's cart is validated with Zod. | 4.6.6 |
| `sharp` | < 0.35.5 | librsvg vulnerability ([GHSA-wq5f-xc86-pv6w](https://github.com/advisories/GHSA-wq5f-xc86-pv6w)) | Through Next's image optimiser, as above. | 0.35.5 |
| `source-map-js` | 1.2.1 | Event-loop denial of service ([GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q)) | **Build tooling only** (Tailwind and PostCSS). | 1.2.2 |

**Recommended:** upgrade `next` (and `eslint-config-next`) to 16.4.6, and run `npm audit fix`
for zod, sharp and source-map-js. All of these stay within their major versions. I haven't
done this: it changes your dependencies, and the brief asks me to check with you first. The
Next upgrade should be followed by a full build and a click-through, because `AGENTS.md` warns
that this Next version changes between releases.

### Still recommended from round 1 (no exploitable issue today)

1. **A Content-Security-Policy** with a nonce from `proxy.ts`, once the site is deployed and can
   be tested there.
2. **The rate limits trust `x-forwarded-for`.** That's correct on Vercel; behind another proxy,
   the per-IP limits could be bypassed. The per-phone limit still holds.
3. **Product photo links accept any https host** (admin only).

### A note on the 404 status

Unknown URLs, and the styleguide in production, answer with HTTP **200** and the 404 page,
not a 404 status. This is documented Next.js behaviour:
- Because of `[lang]/loading.tsx`, the response starts streaming before `notFound()` runs, so the
  status is already 200.
- Next then adds `<meta name="robots" content="noindex">`, so search engines don't index these
  pages.
- It was already the case in round 1.

Returning a real 404 would mean checking product slugs in `proxy.ts` before rendering. That's a
behaviour change, so it isn't done here. The styleguide's own doc said "returns a 404". It now
says what actually happens.

---

## An incident during this phase (fixed)

**What happened:**
- To measure round 1, its code was built in a temporary git worktree inside the project.
- That build linked the two packages Next loads at runtime, `@neondatabase/serverless` and
  `ws`, to the project's `node_modules`.
- Removing the worktree with `git worktree remove --force` deleted *through* those links on
  Windows, which emptied both packages.

**How it was fixed:**
- `npm install` restored them at the lockfile's versions (1.1.0 and 8.22.0).
  `package.json` and `package-lock.json` are unchanged.
- **Checked afterwards:**
  - `tsc` and ESLint pass.
  - A production build succeeds.
  - A page that queries the database at request time renders.

**If it happens again:** if `@neondatabase/serverless` or `ws` is ever reported missing, run
`npm install`.

## Files

- Lighthouse JSON reports are kept out of the repository (about 1 MB each). The table in
  section 3 is their summary.
