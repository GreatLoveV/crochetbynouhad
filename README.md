# Crochet by Nouhad

A French-language crochet shop: a static-first storefront, a localStorage cart,
and a cash-on-delivery checkout. Orders are managed in `/admin`.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4 ·
Drizzle ORM · Neon Postgres · Auth.js (Credentials) · Zod

## Commands

```bash
npm run dev         # http://localhost:3000
npm run lint
npm run build
npm run start
npm run seed        # add the 6 demo products (one-time: it does NOT guard
                    # against unique slug clashes, so re-running fails)
npm run create-admin -- <email> <password>   # create or re-set an admin account
```

After deleting `.next`, run `npm run build` before `npx tsc --noEmit` — route
types are generated during the build and typecheck fails without them.

## Environment variables

`.env.local` is gitignored. What the app actually reads:

| Variable | Required | Used for |
| --- | --- | --- |
| `DATABASE_URL` | always | Neon connection string |
| `AUTH_SECRET` | always | JWT session signing; `npx auth secret` to generate |
| `NEXT_PUBLIC_SITE_URL` | always in production | canonical URLs, sitemap, robots, link previews |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | always | WhatsApp ordering |
| `AUTH_TRUST_HOST` | only off Vercel/Cloudflare | lets Auth.js trust the incoming host |

`NEXT_PUBLIC_SITE_URL` must be the public origin with no trailing slash
(`https://example.com`). The build fails if it is missing in production —
otherwise every page would silently advertise `http://localhost:3000` as its
canonical address.

Set a real WhatsApp number (digits only, country code, no `+`). A production
build **refuses to run** with a missing, non-Moroccan or placeholder
(`212600000000`) number, since every order and question goes through WhatsApp.

### Local production run

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3100 npm run build
NEXT_PUBLIC_SITE_URL=http://localhost:3100 npm run start -p 3100
```

## Data model

Prices are **integer MAD centimes** everywhere: `25000` is `250,00 MAD`.
Display them only through `formatPrice` — never divide by 100 by hand.

Products are never hard-deleted. Orders reference them forever, so removal from
the shop is a deactivation (`is_active = false`), which hides the product,
404s its page, and drops it from the sitemap.

`order_items` freezes the price at purchase time but not the product name, so
renaming a product updates how old orders read in the admin.

## Security notes

- Every admin Server Action re-checks `getAdmin()`, and every admin page calls
  `requireAdmin()` itself (a layout is not re-run on client navigation).
  `src/proxy.ts` is only a redirect fast path.
- Checkout re-prices every line inside a database transaction, so the client
  can never name its own price.
- Every bag is one of a kind. Checkout reserves bags with one conditional
  `UPDATE ... WHERE is_sold_out = false`, so two simultaneous orders for the
  same bag cannot both succeed. Cancelling an order frees its bags; reviving it
  re-reserves them or refuses if one was sold meanwhile. The product form never
  writes the sold flag — "Marquer comme vendue" / "Remettre en vente" do.
- Spam limits (table `attempts`): 3 orders per phone and 5 per IP per hour, a
  honeypot field on checkout, and 5 failed logins per email / 10 per IP per
  15 minutes (checked inside Auth.js `authorize`, so the raw endpoint is
  covered too).
- The confirmation link uses a random `orders.public_token`, never the
  sequential id.
- Checkout and admin pages ship `noindex`, and `/robots.txt` disallows them.
- Images are added as plain URLs in the admin. Anything outside the
  `next/image` allowlist renders `unoptimized`, so an unknown host shows the
  photo rather than a broken image.

## Deploying

1. Push to a git provider and import into Vercel (or use the `vercel` CLI).
2. Set the four required environment variables above.
3. Point `DATABASE_URL` at Neon and apply the schema:

   ```bash
   npx drizzle-kit migrate
   ```

   The current schema is `drizzle/0000_spotty_stone_men.sql`. On a brand-new
   database this has to run once; if the tables already exist, the journal
   keeps it from running twice.
4. Seed the demo catalogue if the shop should not start empty:
   `npm run seed`.
5. Create the real admin account, then delete the test row from Neon:

   ```bash
   npm run create-admin -- you@example.com 'a-strong-password'
   ```
6. Smoke-test: open a product, add to cart, place an order, find it in
   `/admin`, and check the WhatsApp recap picks up the right number.

If deploying somewhere other than Vercel or Cloudflare Pages, set
`AUTH_TRUST_HOST=true` explicitly or every login attempt will fail with an
`UntrustedHost` error.

## Not wired up yet

- Product photos are linked, not uploaded (`BLOB_READ_WRITE_TOKEN` is unused).
- Delivery fees are not implemented; checkout is flat free shipping.
- The Instagram link in the footer is a placeholder.
