# PROJECT_STATUS.md — Crochet by Nouhad

Audit date: 2026-10-10. Language: French storefront, single-admin shop for a
crochet maker. Cash-on-delivery, guest orders, WhatsApp-first contact.

**How to read this report.** "Implemented in code" means the behaviour is
present in the files cited, verified by reading them. "Tested and confirmed"
means it was actually executed during this audit. The only things this audit
executed were `npm run build`, `npx tsc --noEmit`, `npm run lint`, and a few
read-only SQL queries against the database behind the local `DATABASE_URL`. No
runtime/manual browser testing was performed as part of *this* audit, so most
feature rows below are "implemented in code" only. (An earlier ad-hoc headless
Chrome pass in the same working session did exercise the admin pages, but that
is not repeated or re-verified here.)

Nothing in this file contains secret values. Environment variables are named
only.

---

## 1. Overview

A small e-commerce site for a Moroccan handmade-crochet business:

- Public, French-language, static-first storefront with a hero + catalog, a
  category filter, product detail pages with an image gallery, a
  browser-localStorage guest cart, and a cash-on-delivery checkout.
- A password-protected single-user admin (`/admin`) for managing pieces, their
  photos, categories and orders.
- Ordering can happen either through the cart/checkout flow or directly over
  WhatsApp (many buttons deep-link to `wa.me` with a prefilled message).

Stack (versions from `package.json`; the exact installed version is from
`package-lock.json` where it differs):

| Area | Package | package.json | Installed |
| --- | --- | --- | --- |
| Framework | `next` | `16.3.8` | 16.3.8 (App Router, Turbopack) |
| UI runtime | `react`, `react-dom` | `19.2.8` | 19.2.8 |
| Language | `typescript` (dev) | `^5` | 5.x |
| Styling | `tailwindcss` (dev) | `^4` | 4.3.3 |
| Styling | `@tailwindcss/postcss` (dev) | `^4` | 4.3.3 |
| Animation | `tw-animate-css` | `^1.4.0` | 1.4.0 |
| ORM | `drizzle-orm` | `^0.45.2` | 0.45.2 |
| Migrations | `drizzle-kit` (dev) | `^0.31.10` | 0.31.10 |
| DB driver | `@neondatabase/serverless` | `^1.1.0` | 1.1.0 (Neon Postgres, HTTP + WebSocket) |
| DB driver | `ws` | `^8.22.0` | 8.22.0 (WebSocket for transactions) |
| Auth | `next-auth` | `^5.0.0-beta.32` | 5.0.0-beta.32 |
| Auth | `@auth/core` | (transitive) | 0.41.3 |
| Passwords | `bcryptjs` | `^3.0.3` | 3.0.3 |
| Validation | `zod` | `^4.6.5` | 4.6.5 |
| UI primitives | `@base-ui/react` | `^1.8.0` | 1.8.0 |
| UI utilities | `class-variance-authority` | `^0.7.1` | 0.7.1 |
| Icons | `lucide-react` | `^1.49.0` | 1.49.0 |
| Theming | `next-themes` | `^0.4.6` | 0.4.6 (installed, **not wired up**) |
| Toasts | `sonner` | `^2.0.8` | 2.0.8 |
| Class merge | `cn` | `^0.4.0` | 0.4.0 |
| shadcn CLI | `shadcn` (dev) | `^4.21.1` | 4.21.1 (style `base-nova`, `components.json`) |
| Script runner | `tsx` (dev) | `^4.23.15` | 4.23.15 |
| Env loader | `dotenv` (dev) | `^18.0.1` | 18.0.1 |

Image library: none beyond `next/image` (built in). Email: none — the
new-order email is sent by `fetch`-ing the Resend HTTP API directly
(`src/lib/notify.ts`), no Resend SDK is installed. `dotenv` is only used by
`drizzle.config.ts`.

---

## 2. Folder structure

```
crochetbynouhad/
├─ drizzle/                         # generated SQL migrations + journal + snapshots
│  ├─ 0000_spotty_stone_men.sql
│  ├─ 0001_add_product_reference_and_order_item_details.sql
│  ├─ 0002_futuristic_joshua_kane.sql
│  └─ meta/{_journal.json, 0000_snapshot.json, 0001_snapshot.json, 0002_snapshot.json}
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx                 # root: fonts, metadata, CartProvider, Toaster
│  │  ├─ globals.css                # Tailwind v4 + theme tokens (light + .dark)
│  │  ├─ not-found.tsx              # last-resort 404 (brings its own chrome)
│  │  ├─ sitemap.ts  robots.ts  opengraph-image.tsx  favicon.ico
│  │  ├─ (shop)/                    # public storefront route group
│  │  │  ├─ layout.tsx              # SiteHeader + SiteFooter
│  │  │  ├─ page.tsx                # home: hero + catalog + category filter
│  │  │  ├─ not-found.tsx
│  │  │  ├─ cart/page.tsx
│  │  │  ├─ checkout/page.tsx
│  │  │  ├─ conditions/page.tsx
│  │  │  ├─ confidentialite/page.tsx
│  │  │  ├─ products/[slug]/page.tsx
│  │  │  └─ order/confirmation/page.tsx
│  │  ├─ admin/
│  │  │  ├─ layout.tsx              # noindex metadata for all of /admin
│  │  │  ├─ login/page.tsx
│  │  │  ├─ (protected)/
│  │  │  │  ├─ layout.tsx           # requireAdmin() + header/sidebar chrome
│  │  │  │  ├─ page.tsx             # redirect → /admin/products
│  │  │  │  ├─ categories/page.tsx
│  │  │  │  ├─ orders/page.tsx  orders/[id]/page.tsx
│  │  │  │  └─ products/page.tsx  products/new/page.tsx  products/[id]/page.tsx
│  │  │  └─ actions/                # server actions
│  │  │     ├─ auth.ts  orders.ts  products.ts  categories.ts
│  │  ├─ actions/
│  │  │  ├─ orders.ts               # placeOrder (checkout)
│  │  │  └─ cart.ts                 # fetchCartProducts (display only)
│  │  └─ api/auth/[...nextauth]/route.ts
│  ├─ components/
│  │  ├─ admin/    admin-nav, login-form, order-status-badge,
│  │  │            order-status-control, product-form, product-image-manager
│  │  ├─ cart/     cart-provider, cart-storage, cart-sheet, cart-page-view,
│  │  │            cart-line-rows, clear-cart-on-mount, use-cart-products
│  │  ├─ checkout/ checkout-form
│  │  ├─ home/     hero, product-card
│  │  ├─ product/  buy-box, image-gallery
│  │  ├─ ui/       badge, button, card, input, label, select, separator,
│  │  │            sheet, sonner, table, textarea
│  │  ├─ icons.tsx  not-found-content.tsx  site-chrome.tsx
│  ├─ db/
│  │  ├─ index.ts                   # HTTP client (drizzle-orm/neon-http)
│  │  ├─ tx.ts                      # WebSocket Pool client (transactions)
│  │  ├─ schema.ts
│  │  ├─ place-order.ts             # createOrder (transaction)
│  │  ├─ seed.ts
│  │  └─ create-admin.ts
│  ├─ lib/
│  │  ├─ admin.ts                   # requireAdmin / getAdmin
│  │  ├─ admin-orders.ts  admin-products.ts
│  │  ├─ auth.ts                    # NextAuth config
│  │  ├─ cart.ts                    # shared cart constants/types
│  │  ├─ checkout.ts                # zod checkout schema + phone helpers
│  │  ├─ images.ts                  # optimizable-host allowlist
│  │  ├─ money.ts                   # formatPrice, refs, madToCentimes
│  │  ├─ notify.ts                  # Resend email (fire-and-forget)
│  │  ├─ order-form.ts  order-statuses.ts  orders.ts
│  │  ├─ product-form.ts  products.ts
│  │  ├─ strings.ts                 # all FR copy + INSTAGRAM_URL + SITE_URL
│  │  └─ utils.ts                   # re-exports `cn`
│  ├─ proxy.ts                      # Next 16 "proxy" (middleware) for /admin
│  └─ types/next-auth.d.ts
├─ next.config.ts  tsconfig.json  postcss.config.mjs  eslint.config.mjs
├─ drizzle.config.ts  components.json  next-env.d.ts
├─ AGENTS.md  README.md  package.json  package-lock.json
└─ .env.local (gitignored)
```

Note: `src/proxy.ts` is Next 16's replacement for `middleware.ts` (the build
reports it as "Proxy (Middleware)").

---

## 3. Environment variables

Names only — no values are reproduced here.

| Name | Required | Purpose | Where used |
| --- | --- | --- | --- |
| `DATABASE_URL` | Always (dev + prod) | Neon Postgres connection string (pooler) | `src/db/index.ts:5`, `src/db/tx.ts:21`, `drizzle.config.ts:11` |
| `AUTH_SECRET` | Always | Signs/encrypts the JWT session cookie | Read automatically by Auth.js from `src/lib/auth.ts` |
| `NEXT_PUBLIC_SITE_URL` | Always in production | Canonical origin (metadata, OG, sitemap, robots, WhatsApp product URLs) | `src/lib/strings.ts:251` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Always | Shop's WhatsApp number (digits only, country code, no `+`) | `src/lib/whatsapp.ts:7` |
| `AUTH_TRUST_HOST` | Only off Vercel/Cloudflare | Lets Auth.js trust the incoming host header | Auth.js (env) |
| `RESEND_API_KEY` | Optional | Enables the new-order email | `src/lib/notify.ts:20` |
| `ADMIN_NOTIFY_EMAIL` | Optional (required for email) | Destination of the new-order email | `src/lib/notify.ts:21` |
| `RESEND_FROM` | Optional | Verified sender; defaults to Resend's onboarding address | `src/lib/notify.ts:67` |
| `VERCEL_PROJECT_PRODUCTION_URL` / `VERCEL_URL` | No (auto) | Fallback origin on Vercel when `NEXT_PUBLIC_SITE_URL` is unset | `src/lib/strings.ts:254` |
| `NODE_ENV` | No (auto) | Cookie `secure` flag; production origin guard | `src/app/actions/orders.ts:76`, `src/lib/strings.ts:262` |

`BLOB_READ_WRITE_TOKEN` is mentioned in the README as unused (see §7).

**Currently set in `.env.local` (names only):** `DATABASE_URL`,
`NEXT_PUBLIC_WHATSAPP_NUMBER`, `AUTH_SECRET`, `AUTH_TRUST_HOST`,
`NEXT_PUBLIC_SITE_URL`. Not set: `RESEND_API_KEY`, `ADMIN_NOTIFY_EMAIL`,
`RESEND_FROM`.

**Production (Vercel):** required = `DATABASE_URL`, `AUTH_SECRET`,
`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`. `AUTH_TRUST_HOST` is
not needed on Vercel (it is set locally in this repo). `RESEND_*` only if
email notifications are wanted. Important guard: in a production server build
with neither `NEXT_PUBLIC_SITE_URL` nor a Vercel URL, `src/lib/strings.ts:262`
**throws at import time**, failing the build — deliberate, so `localhost` is
never published as the canonical origin.

---

## 4. Database

Driver: `@neondatabase/serverless`. Two clients:

- `src/db/index.ts` — HTTP client (`drizzle-orm/neon-http`) for all ordinary
  reads/writes. Fast, but **cannot hold a transaction open**.
- `src/db/tx.ts` — WebSocket `Pool` client (`drizzle-orm/neon-serverless`) with
  `neonConfig.webSocketConstructor = ws`. Used only where multiple statements
  must be atomic (placing an order). `ws` must stay in `dependencies` so Vercel
  bundles it (`next.config.ts` also lists both in `serverExternalPackages`).

### Full `src/db/schema.ts`

```ts
import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const roleEnum = pgEnum("role", ["admin"]);

export const orderStatusEnum = pgEnum("order_status", [
  "new",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").notNull().default("admin"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  nameEn: text("name_en").notNull(),
  nameFr: text("name_fr").notNull(),
  // A category with no pieces yet: shown with a "Bientôt" badge instead of
  // being hidden, so visitors know it is coming.
  isComingSoon: boolean("is_coming_soon").notNull().default(false),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id),
  nameFr: text("name_fr").notNull(),
  nameEn: text("name_en").notNull(),
  descriptionFr: text("description_fr").notNull(),
  descriptionEn: text("description_en").notNull(),
  price: integer("price").notNull(),
  reference: text("reference").unique(),
  isActive: boolean("is_active").notNull().default(true),
  // Most pieces exist only once: no quantity selector, and the piece is taken
  // out of circulation as soon as an order is placed.
  isUnique: boolean("is_unique").notNull().default(true),
  isSoldOut: boolean("is_sold_out").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const productImages = pgTable("product_images", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  url: text("url").notNull(),
  position: integer("position").notNull().default(0),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  city: text("city").notNull(),
  address: text("address").notNull(),
  notes: text("notes"),
  status: orderStatusEnum("status").notNull().default("new"),
  total: integer("total").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  quantity: integer("quantity").notNull(),
  unitPrice: integer("unit_price").notNull(),
  productName: text("product_name"),
  productReference: text("product_reference"),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  images: many(productImages),
  orderItems: many(orderItems),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));
```

### Migrations present in `drizzle/`

Registered in `drizzle/meta/_journal.json` (0, 1, 2):

1. `0000_spotty_stone_men.sql` — creates enums `role`, `order_status` and
   tables `categories`, `products`, `product_images`, `orders`, `order_items`,
   `users` (+ FKs).
2. `0001_add_product_reference_and_order_item_details.sql` — adds
   `products.reference` (unique) and `order_items.product_name` /
   `product_reference`, then backfills `CN-####` references and historical
   order-item details.
3. `0002_futuristic_joshua_kane.sql` — adds `categories.is_coming_soon`,
   `products.is_unique`, `products.is_sold_out`; deactivates the scarves and
   accessories sample rows and marks both categories coming-soon.

How to apply: `npx drizzle-kit migrate` (uses `drizzle.config.ts`, which loads
`.env.local` via `dotenv`).

### Seed / admin scripts

- `src/db/seed.ts` — **exists.** `npm run seed`
  (`tsx --env-file=.env.local ./src/db/seed.ts`). Inserts 3 categories, 6
  demo products and 2 `placehold.co` images each. **Not idempotent** — it uses
  plain inserts, so re-running fails on the unique slug constraints (README
  says so).
- `src/db/create-admin.ts` — **exists.** `npm run create-admin -- <email>
  <password>` (`tsx --env-file=.env.local ./src/db/create-admin.ts`). Hashes
  with bcrypt (cost 12), creates the user, or resets the password if the email
  already exists. Requires a password of at least 8 characters.

### Observed data (read-only query, this audit)

- Products (6): `mini-sac-bandouliere` (id 2, **active**),
  `sac-plage-raphia` (id 5, **active**), `sac-fleur-rose` (id 1, inactive,
  **sold out**), `echarpe-hiver` (id 4, inactive), `pochette-perlee` (id 3,
  inactive), `beret-laine` (id 6, inactive). All six have `is_unique = true`.
- Categories: `sacs` (live), `echarpes` (coming soon), `accessoires`
  (coming soon).
- Orders: one row, id 10, status `new`.
- Users: two admins — `nouhad@crochetbynouhad.ma` and
  `ettaziwael11@gmail.com` (the latter is a test account, see §12).

---

## 5. Routes and pages

Protection column: "guard" = `requireAdmin()` in the `(protected)` layout; the
table row shows what actually enforces it.

### Storefront

| Route | Rendering | What it does | Protected |
| --- | --- | --- | --- |
| `/` (`(shop)/page.tsx`) | Dynamic (reads `searchParams`) | Hero + catalog grid; `?category=<slug>` filter (server-side); coming-soon category view | Public |
| `/products/[slug]` | SSG (`revalidate = 60`, `generateStaticParams`) | Product detail: gallery, price, reference, unique/sold badges, buy box, WhatsApp question | Public |
| `/cart` | Static shell + client body | Full cart page (reads localStorage) | Public, `noindex` |
| `/checkout` | Static shell + client form | Guest checkout form | Public, `noindex` |
| `/order/confirmation` | Dynamic | Order recap; personal data only if the `cbn-order` cookie matches; clears cart on mount | Public, `noindex`, cookie-gated |
| `/conditions` | Static | Terms (placeholder copy) | Public |
| `/confidentialite` | Static | Privacy (placeholder copy) | Public |
| `/sitemap.xml`, `/robots.txt`, `/opengraph-image`, `/favicon.ico` | Static/generated | SEO + social card + icon | Public |
| `/_not-found`, `(shop)/not-found` | Static | 404 pages | Public |

### Admin

| Route | What it does | Protected |
| --- | --- | --- |
| `/admin/login` (`admin/login/page.tsx`) | Login form; redirects away if already signed in | Public by necessity; `noindex` |
| `/admin` (`(protected)/page.tsx`) | Redirects to `/admin/products` | `requireAdmin()` in `(protected)/layout.tsx` **and** `src/proxy.ts` redirect |
| `/admin/products` | Product list (all products, active/inactive, sold badges, image counts) | Same guard (layout) |
| `/admin/products/new` | Create product form | Same guard |
| `/admin/products/[id]` | Edit product + image manager | Same guard |
| `/admin/categories` | Category list + coming-soon toggle | Same guard |
| `/admin/orders` | Order list + status counts | Same guard |
| `/admin/orders/[id]` | Order detail + status control + WhatsApp-customer button | Same guard |
| `/api/auth/[...nextauth]` | Auth.js handlers | n/a |

`src/proxy.ts` (`config.matcher: ["/admin/:path*", "/admin"]`) reads the
session cookie on every `/admin` request and redirects signed-out visitors —
a convenience only; the real checks are the layout `requireAdmin()` and the
per-action `getAdmin()` (see §9).

---

## 6. Features

Status legend: **Done** (fully implemented), **Partial** (works but
incomplete), **Missing**.

### Catalog, categories, "coming soon" — Done
- Catalog: `src/lib/products.ts` (`getActiveProducts`, `getCategories`),
  rendered by `src/app/(shop)/page.tsx`.
- Category filter is a server-side query (`?category=`), so no client JS.
- Coming-soon: `categories.isComingSoon`; the filter pill shows a "Bientôt"
  badge and the section shows a WhatsApp/Instagram call-to-action
  (`src/app/(shop)/page.tsx:57-130`). Admin toggle in
  `src/app/admin/actions/categories.ts`.

### Product page, gallery, reference codes, unique pieces — Done
- Product page: `src/app/(shop)/products/[slug]/page.tsx`, gallery:
  `src/components/product/image-gallery.tsx` (main image + thumbnail strip).
- Reference codes: `formatProductReference` → `CN-####`
  (`src/lib/money.ts:19`); auto-assigned on create when blank
  (`src/lib/admin-products.ts:336-351`); shown on the product page, cart,
  confirmation and admin.
- Unique pieces: `products.is_unique` (default true). Buy box fixes quantity
  to 1 (`src/components/product/buy-box.tsx:48-67`); cart clamps to 1
  (`lineQuantity`, `src/components/cart/cart-line-rows.tsx:26`); the server
  forces quantity 1 and reserves the piece inside the order transaction
  (`src/db/place-order.ts:67-113`); sold-out pieces keep their page but cannot
  be ordered and show a "Vendu" badge; cancelling an order releases them
  (`src/app/admin/actions/orders.ts:38-56`).

### Cart (storage) and checkout form — Done
- Cart storage: browser-only, `localStorage` key `cbn-cart-v1`
  (`src/lib/cart.ts:18`), holding **only** `{productId, quantity}`
  (`src/components/cart/cart-storage.ts`, external store over
  `useSyncExternalStore`), wrapped by `CartProvider`
  (`src/components/cart/cart-provider.tsx`). Prices/names are re-fetched from
  PostgreSQL via `fetchCartProducts` (`src/app/actions/cart.ts`).
- Checkout form: `src/components/checkout/checkout-form.tsx` — name, phone,
  city (with Moroccan-city `datalist`), address, notes; Moroccan phone
  validation; keeps typed values on error; sticky mobile submit button.

### Order placement — Done (with a caveats noted)
- Server action: `placeOrder` in `src/app/actions/orders.ts` (full code in the
  block below).
- DB driver: **WebSocket `Pool`** (`drizzle-orm/neon-serverless`) via
  `getTxDb()` in `src/db/tx.ts` — not the HTTP client.
- Real transaction: **yes** — `db.transaction(async (tx) => { … })` in
  `src/db/place-order.ts:43`.
- Prices recomputed on the server: **yes** — the browser sends only product
  ids + quantities; `createOrder` reads `products.price` inside the
  transaction and computes the total there (`src/db/place-order.ts:44-86`).
  The client is never trusted for a price.
- Double-submits: **Partial.** The submit button is disabled while the action
  is pending (`useActionState`, `checkout-form.tsx:219`), but there is **no
  server-side idempotency key or dedup**. A scripted double POST could create
  two orders. Unique pieces are still protected from double-selling by the
  reservation check.
- Unavailable product: `ProductUnavailableError` if a product is missing or
  `is_active = false` → message `strings.checkout.unavailable`.
- Reserved unique piece: `ProductReservedError` if a unique piece was already
  taken → message `strings.checkout.reserved`.
- Any other failure → `strings.checkout.submitError`. On success the action
  sets an httpOnly `cbn-order` cookie and redirects to the confirmation page.

**Full server action (`src/app/actions/orders.ts`):**

```ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  createOrder,
  ProductReservedError,
  ProductUnavailableError,
} from "@/db/place-order";
import { checkoutSchema } from "@/lib/checkout";
import { notifyNewOrder } from "@/lib/notify";
import { type OrderFormState } from "@/lib/order-form";
import { strings } from "@/lib/strings";

/**
 * Places an order from the checkout form.
 *
 * The browser sends product ids and quantities only: names, prices and the
 * total are all decided by the server (`createOrder`). See `@/db/place-order`.
 */
export async function placeOrder(
  _previous: OrderFormState,
  formData: FormData,
): Promise<OrderFormState> {
  // Read once so both the validation and the echoed values use the same data.
  const values = {
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    city: String(formData.get("city") ?? ""),
    address: String(formData.get("address") ?? ""),
    notes: String(formData.get("notes") ?? ""),
  };

  const parsed = checkoutSchema.safeParse({
    ...values,
    cart: formData.get("cart"),
  });

  if (!parsed.success) {
    return {
      status: "invalid",
      fieldErrors: toFieldErrors(parsed.error),
      message: strings.checkout.fixErrors,
      values,
    };
  }

  const { name, phone, city, address, notes, cart } = parsed.data;

  let orderId: number;
  try {
    orderId = await createOrder({ name, phone, city, address, notes, cart });
  } catch (error) {
    if (error instanceof ProductReservedError) {
      return { status: "error", message: strings.checkout.reserved, values };
    }
    if (error instanceof ProductUnavailableError) {
      return { status: "error", message: strings.checkout.unavailable, values };
    }
    console.error("[placeOrder] could not save the order", error);
    return { status: "error", message: strings.checkout.submitError, values };
  }

  // Best-effort: a broken notification must never block a saved order.
  await notifyNewOrder(orderId);

  // Lets the confirmation page show the customer their own name and city
  // without exposing them to anyone who guesses an order id.
  const cookieStore = await cookies();
  cookieStore.set("cbn-order", String(orderId), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });

  // Outside the try/catch on purpose: redirect() works by throwing, and we do
  // not want to catch it and show an error instead of moving on.
  redirect(`${strings.order.confirmationPath}?order=${orderId}`);
}

/** Keeps the first message per field so the form shows one error at a time. */
function toFieldErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? "cart");
    fieldErrors[field] ??= issue.message;
  }
  return fieldErrors;
}
```

**Atomic write (`src/db/place-order.ts`, the only transaction in the app):**

```ts
export async function createOrder(input: NewOrder): Promise<number> {
  const db = getTxDb();
  const ids = input.cart.map((line) => line.productId);

  return db.transaction(async (tx) => {
    const rows = await tx
      .select({
        id: products.id,
        price: products.price,
        nameFr: products.nameFr,
        reference: products.reference,
        isUnique: products.isUnique,
        isSoldOut: products.isSoldOut,
      })
      .from(products)
      .where(and(inArray(products.id, ids), eq(products.isActive, true)));

    const byId = new Map(rows.map((row) => [row.id, row]));

    const lines = input.cart.map((line) => {
      const product = byId.get(line.productId);
      if (product === undefined) {
        throw new ProductUnavailableError(`Product ${line.productId} is not available`);
      }
      if (product.isUnique && product.isSoldOut) {
        throw new ProductReservedError(`Product ${line.productId} was just reserved`);
      }
      return {
        productId: line.productId,
        quantity: product.isUnique ? 1 : line.quantity,
        unitPrice: product.price,
        productName: product.nameFr,
        productReference: product.reference,
      };
    });

    const total = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);

    const [order] = await tx
      .insert(orders)
      .values({
        customerName: input.name,
        phone: normalizePhone(input.phone),
        city: input.city,
        address: input.address,
        notes: input.notes || null,
        total,
      })
      .returning({ id: orders.id });

    await tx.insert(orderItems).values(lines.map((line) => ({ orderId: order.id, ...line })));

    const uniqueIds = lines
      .filter((line) => byId.get(line.productId)?.isUnique)
      .map((line) => line.productId);
    if (uniqueIds.length > 0) {
      await tx.update(products).set({ isSoldOut: true }).where(inArray(products.id, uniqueIds));
    }

    return order.id;
  });
}
```

### Order confirmation page and WhatsApp messages — Done
- Confirmation page: `src/app/(shop)/order/confirmation/page.tsx`. The order id
  travels in `?order=`, and the customer's name/city are only shown when the
  httpOnly `cbn-order` cookie equals that id (`src/lib/orders.ts:35-86`), so
  sequential ids cannot be enumerated for PII. `ClearCartOnMount` empties the
  localStorage cart.

**Message templates (verbatim):**

Storefront product question — `src/components/product/buy-box.tsx:71-75`:
```
Bonjour Crochet by Nouhad, j'ai une question à propos de « {name} » ({reference}) :
{productUrl}
```

Confirmation-page message — `src/lib/orders.ts:92-114` (`buildOrderWhatsappMessage`):
```
Bonjour, voici ma commande {reference} :
- {reference} {nameFr} x{quantity}, {price}
  {siteUrl}/products/{slug}
Total : {total} (paiement à la livraison)
Nom : {customerName}, Ville : {city}
```

Admin "contact the customer" message — `src/lib/admin-orders.ts:151-161`
(delivery fee left blank on purpose):
```
Bonjour {customerName}, c'est Nouhad de Crochet by Nouhad. Je confirme votre
commande {reference} : {items}. Total : {price}, paiement à la livraison. Les
frais de livraison pour {city} sont de … MAD. Merci !
```

Hero / footer / header contact CTAs use one-line `Bonjour Crochet by Nouhad, …`
messages (`src/components/site-chrome.tsx`, `src/components/home/hero.tsx`,
`src/app/(shop)/page.tsx`).

**Phone normalisation.** Two helpers:
- `normalizePhone` (`src/lib/checkout.ts:97`) — strips all non-digits; stored
  in `orders.phone` (e.g. `+212 6 12 34 56 78` → `212612345678`).
- `normalizeMoroccanPhone` (`src/lib/whatsapp.ts:32`) — `06…` / `+212…` /
  `00212…` all become `212…` for `wa.me`. `isValidMoroccanPhone`
  (`src/lib/checkout.ts:107`) accepts all three writings and checks
  `^212[67]\d{8}$`.

### Admin — Done (with one Partial)
- **Login** — Done. `src/components/admin/login-form.tsx` +
  `src/app/admin/actions/auth.ts`; Credentials + bcrypt compare
  (`src/lib/auth.ts:25-44`); identical error for unknown email and wrong
  password; redirect only to a path starting with `/admin`.
- **Orders list & status changes** — Done.
  `src/app/admin/(protected)/orders/page.tsx` (status pills + counts,
  `getAdminOrders`/`getOrderStatusCounts`), detail at
  `orders/[id]/page.tsx`, status control
  `src/components/admin/order-status-control.tsx` → `updateOrderStatus`
  (`src/app/admin/actions/orders.ts`), which validates with `isOrderStatus`,
  skips no-op changes, and releases unique pieces when set to `cancelled`.
- **WhatsApp button** — Done. Admin detail page builds a `wa.me/<digits>` link
  with the message above (`src/app/admin/(protected)/orders/[id]/page.tsx:28`).
- **Products CRUD** — Done (no hard delete by design). Create/Update via
  `saveProduct` (`src/app/admin/actions/products.ts`) → `createProduct` /
  `updateProduct` (`src/lib/admin-products.ts`); slug handling, auto reference;
  visibility toggle `toggleProductActive`; image add/remove/reorder
  (`addProductImage`, `moveProductImage`, `removeProductImage`). "Delete" is
  intentionally replaced by deactivation because orders reference products
  forever.
- **Categories CRUD** — **Partial.** Only list + coming-soon toggle exist
  (`src/app/admin/(protected)/categories/page.tsx`,
  `src/app/admin/actions/categories.ts`, `setCategoryComingSoon`). There is no
  admin UI to create, rename or delete categories; they come from `seed.ts`.

### Order email notification — Partial (implemented, not configured/tested)
`src/lib/notify.ts` posts to `https://api.resend.com/emails` with a 5s abort
timeout. It is **fire-and-forget**: no key/recipient → it returns silently; any
failure is logged and swallowed so a saved order is never turned into an error.
Because `RESEND_API_KEY` / `ADMIN_NOTIFY_EMAIL` are **not set**, no email is
currently sent (this path is therefore unverified).

### Design: Velvet theme tokens, fonts, dark-only — Done (light) / Missing (dark)
- Tokens: `src/app/globals.css` — warm cream/brown/terracotta palette in
  `:root`, large radii, custom `--shadow-soft`, `--shadow-lift`,
  `--ease-soft`, and a `.texture-paper` speckle background.
- Fonts: `DM_Sans` (`--font-sans`) + `Fraunces` (`--font-heading`, with
  SOFT/WONK/opsz axes) via `next/font/google` in `src/app/layout.tsx`.
- The site is effectively **light-only**: a `.dark` token block exists in
  `globals.css:103` but nothing ever adds the `.dark` class; `next-themes` is
  installed but no `ThemeProvider` wraps the app, and `<Toaster>` is hardcoded
  `theme="light"` (`src/app/layout.tsx:57`). No pages use "old" styles — every
  page uses the same token classes; the palette is consistent throughout.

### FR/EN toggle and dark/light toggle — Missing
- **FR/EN toggle: Missing.** The site is French-only (`lang="fr"` hardcoded,
  `src/lib/strings.ts` header says "no i18n, no `[locale]` routes"). The
  database carries `*_en` columns and the admin form has English name and
  description fields, but when left blank the server copies the French into
  them (`toProductInput`, `src/lib/admin-products.ts:282-301`) and the English
  values are never surfaced on the storefront.
- **Dark/light toggle: Missing.** Tokens exist; no switcher, no provider
  (see above).

### Terms and Privacy pages, SEO metadata, OG image, favicon
- Terms (`/conditions`) and Privacy (`/confidentialite`): **Partial** — pages
  exist with metadata, but the copy is explicitly a placeholder ("Texte de
  remplacement — à compléter avant la mise en ligne." and "Texte à compléter."
  for the cancellation/retention sections).
- SEO metadata: **Done** — root `metadata` with title template, description,
  canonical, OpenGraph (`src/app/layout.tsx`); per-product `generateMetadata`
  with canonical + OG image (`src/app/(shop)/products/[slug]/page.tsx:26-55`);
  `sitemap.ts` (home + legal + active products); `robots.ts` (disallows
  `/admin`, `/api/`, `/cart`, `/checkout`, `/order/`); `noindex` on admin,
  cart, checkout and order pages.
- Open Graph image: **Done** — generated brand card at
  `src/app/opengraph-image.tsx` (1200×630, cream/brown/terracotta).
- Favicon: **present but unverified** — `src/app/favicon.ico` exists. Its
  content was not inspected; it is plausibly still the default Next.js icon.

---

## 7. Images

- **Service/storage:** none. There is **no upload** and no blob storage. Photos
  are stored as **plain URL strings** in `product_images.url`
  (`src/db/schema.ts:60-67`). The README confirms `BLOB_READ_WRITE_TOKEN` is
  unused.
- **How the admin manages them:** `src/components/admin/product-image-manager.tsx`
  — add by pasting a URL, remove, and move up/down. Calls the server actions
  `addProductImage`/`removeProductImage`/`moveProductImage`
  (`src/app/admin/actions/products.ts`) which call the helpers in
  `src/lib/admin-products.ts:404-463`. New photos append to the end; each row
  carries a `position`; reordering swaps the `position` of two rows (they
  briefly share a value — harmless, nothing unique on it). **The first photo
  in position order is the cover** (used by cards, hero, cart, admin list).
- **URL validation:** `isAllowedImageUrl` (`src/lib/admin-products.ts:394`)
  accepts only `http`/`https` (rejects `javascript:` and other schemes), max
  2000 chars.
- **`next/image` remotePatterns** (`next.config.ts:15-24`): only
  `placehold.co` and `*.public.blob.vercel-storage.com`, both `https`. The same
  list is mirrored in `src/lib/images.ts` (`OPTIMIZABLE_IMAGE_HOSTS`). Any
  other host is rendered with `unoptimized` (via `isOptimizableImageUrl`), so
  an unseen host shows the original file instead of a broken image.
- **Placeholders today:** the seed inserts `placehold.co/600x600` images for
  every product (`src/db/seed.ts:84-98`). All six products currently carry
  placeholder images, including the two active ones. **No real product photos
  exist in the database yet.**

---

## 8. Delivery

**Missing as a model.** There is no delivery-fee field, no shipping table, no
city/zone rules, and no fee added to `orders.total` (the total is only the sum
of line items, `src/db/place-order.ts:83`). Checkout is effectively flat free
shipping.

What exists is copy that defers the fee to WhatsApp:
- Checkout: `strings.checkout.paymentNote` = "Frais de livraison confirmés par
  WhatsApp." (`src/lib/strings.ts:75`).
- Hero/footer: "Paiement à la livraison · Livraison partout au Maroc".
- Admin WhatsApp message: "Les frais de livraison pour {city} sont de … MAD."
  (`src/lib/admin-orders.ts:160`).
- Terms page: "Les délais et frais de livraison sont communiqués lors de la
  confirmation de la commande."

So delivery is handled conversationally; nothing in the schema or checkout
supports a fee.

---

## 9. Security review

- **Admin pages:** every admin page is behind `requireAdmin()`
  (`src/lib/admin.ts:23`) via `src/app/admin/(protected)/layout.tsx:18`, plus a
  `src/proxy.ts` redirect. The login page lives outside the protected group.
- **Admin server actions:** every one re-checks the session on its own with
  `getAdmin()` and returns early when absent —
  `admin/actions/orders.ts:18`, `admin/actions/products.ts` (each of the five
  actions), `admin/actions/categories.ts:18`. This is correct: a server action
  is a POST to its own URL and does not pass through the proxy matcher.
- **Route protection:** `src/proxy.ts` matches `/admin` and `/admin/:path*`.
  Admin metadata also sets `robots: noindex` (`src/app/admin/layout.tsx`), and
  `/robots.txt` disallows the admin and checkout areas.
- **Input validation (zod):**
  - Checkout: `checkoutSchema` (`src/lib/checkout.ts:51`) validates name,
    phone, city, address, notes, and the `cart` field (parsed from JSON, max
    50 lines, per-line qty 1–20, duplicates merged).
  - Product admin form: `productFormSchema` (`src/lib/product-form.ts:12`).
  - Non-zod admin actions validate manually and safely: integer id checks,
    `direction !== "up" && direction !== "down"`, and `isOrderStatus()` before
    the enum column (`admin/actions/orders.ts:20-25`). Image URLs go through
    `isAllowedImageUrl`.
- **Is anything trusted from the client?** No prices. The browser sends only
  product ids + quantities; prices and the total are read inside the DB
  transaction (`src/db/place-order.ts`). "Add to cart" is display-only. The
  admin can, by design, set prices/stock — that is the admin's job.
- **Rate limiting / spam protection on checkout: Missing.** `placeOrder` is an
  unauthenticated guest action with **no rate limit, no CAPTCHA, and no
  honeypot**. A bot could create many junk orders (and, for unique pieces,
  reserve them). This is the most notable security/abuse gap.
- **Passwords:** hashed with bcrypt, cost 12, in `create-admin.ts`; verified
  with `bcrypt.compare` at login (`src/lib/auth.ts:40`). Plain passwords are
  never stored. Session = signed JWT cookie (`AUTH_SECRET`), no session table.
- **CSRF:** Next.js server actions have built-in Origin/Host verification;
  there is no custom CSRF token. Auth.js handles its own routes.
- **Headers** (`next.config.ts:34-56`): `X-Content-Type-Options`,
  `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`,
  `Strict-Transport-Security`. No Content-Security-Policy (deliberate, noted in
  the config comment).
- **Secrets:** `.env.local` is gitignored; no secret values are hardcoded in
  `src/` (only env reads). No secret values appear in this report.
- **Note on the email path:** `notifyNewOrder` is not session-gated but is
  server-internal (not an action); it only runs after a successful order.

---

## 10. Deployment status

- **Deployed?** Not from this working copy: there is **no `.vercel` directory**
  and no deployment config in the repo. Git remote is
  `git@github.com:GreatLoveV/crochetbynouhad.git`. Three commits exist
  (`fe53dfb` initial, `97932f5` shop/cart/checkout/admin, `f05a965` "Prepare for
  deployment"). There are **uncommitted changes** (see below), so the tip of
  `main` is not the current working tree.
- **`npm run build` — PASSES.** Fresh run this audit:
  ```
  ▲ Next.js 16.3.8 (Turbopack)
  - Environments: .env.local
  ✓ Compiled successfully in 78s
    Finished TypeScript in 48s ...
  ✓ Generating static pages using 11 workers (20/20)
  ```
  Routes emitted: dynamic `/`, `/admin` (+ all admin subroutes), `/api/auth/[...nextauth]`,
  `/order/confirmation`; static `/cart`, `/checkout`, `/conditions`,
  `/confidentialite`, `/opengraph-image`, `/robots.txt`, `/sitemap.xml`,
  `/_not-found`; and 2 pre-rendered product pages
  (`/products/mini-sac-bandouliere`, `/products/sac-plage-raphia` — the two
  active products). Proxy (Middleware) present.
- **`npx tsc --noEmit` — PASSES** (exit 0).
- **`npm run lint` (ESLint, `eslint-config-next` core-web-vitals + TS) — PASSES**
  (exit 0, no output).
- **Production DB migrated?** Not determinable from the repo. The database
  behind the local `DATABASE_URL` **does** have all three migrations applied
  (columns/tables/data all present). If production uses a separate database,
  run `npx drizzle-kit migrate` there (README step).
- **Admin user created?** Yes — two rows in `users`:
  `nouhad@crochetbynouhad.ma` and `ettaziwael11@gmail.com` (the latter is a
  test account). `create-admin` doubles as password-reset.
- **Env vars set (names only):** locally — `DATABASE_URL`,
  `NEXT_PUBLIC_WHATSAPP_NUMBER`, `AUTH_SECRET`, `AUTH_TRUST_HOST`,
  `NEXT_PUBLIC_SITE_URL`. Remaining for production: ensure the four required
  prod vars are set in Vercel and drop `AUTH_TRUST_HOST`. Not set anywhere:
  `RESEND_API_KEY`, `ADMIN_NOTIFY_EMAIL`, `RESEND_FROM`.
- **Uncommitted work** (`git status`): many modified files plus new untracked
  files: `drizzle/0001_*.sql`, `drizzle/0002_*.sql`,
  `drizzle/meta/0001_snapshot.json`, `drizzle/meta/0002_snapshot.json`,
  `src/app/admin/(protected)/categories/`, `src/app/admin/actions/categories.ts`,
  `src/lib/notify.ts`, `src/lib/order-form.ts`, `src/lib/order-statuses.ts`.

---

## 11. Original requirements checklist

| Requirement | Status | Notes |
| --- | --- | --- |
| Product catalog with categories | **Done** | `/` + `?category=` filter; `src/lib/products.ts` |
| Detail pages with multiple photos | **Done** | Gallery with thumbnails; `image-gallery.tsx` |
| Guest cart | **Done** | localStorage, no account; `cart-storage.ts` |
| Checkout (name, phone, city, address, notes) | **Done** | `checkout-form.tsx`; Moroccan phone validation |
| Cash on delivery only | **Done** | No payment integration anywhere; copy says "paiement à la livraison" |
| Admin with order status tracking | **Done** | Status control + counts; `updateOrderStatus` |
| WhatsApp buttons | **Done** | Header, hero, footer, product page, confirmation, admin order detail |
| FR/EN toggle | **Missing** | French-only; `*_en` columns unused on the storefront |
| Dark/light mode | **Missing** | Tokens exist; no provider/switcher; light-only in practice |
| Mobile-first layout | **Done** (by code) | Responsive classes mobile→desktop throughout; sticky mobile CTAs. Not visually re-verified this audit |
| Terms and Privacy | **Partial** | Pages exist; copy is placeholder ("à compléter") |

---

## 12. Known issues, shortcuts and TODOs

Placeholder / hardcoded values
- WhatsApp number is a placeholder `212600000000`
  (`NEXT_PUBLIC_WHATSAPP_NUMBER`); README explicitly calls it invalid.
- Instagram is a placeholder: `INSTAGRAM_URL = "https://instagram.com/crochetbynouhad"`
  (`src/lib/strings.ts:231`) — comment says "replace with the real account".
- All product photos are `placehold.co` placeholders (`src/db/seed.ts`).
- Terms and Privacy contain "Texte de remplacement — à compléter" and "Texte à
  compléter." (`conditions/page.tsx`, `confidentialite/page.tsx`).
- `src/app/favicon.ico` not inspected — possibly the default Next icon.
- `whatsappUrl` falls back to `0000000000` when no number is configured
  (`src/lib/whatsapp.ts:24`).

Untested / fragile
- **No automated tests at all** (no `*.test.*` / `*.spec.*` anywhere; no test
  script in `package.json`).
- The email path (`notify.ts`) is unverified — no `RESEND_*` set.
- Order placement has **no rate limiting / bot protection / idempotency**
  (§9). Unique-piece reservation limits damage for unique items only.
- `npm run seed` is **not idempotent**; re-running fails on unique slugs
  (README documents this).

Stale docs / config
- README is out of date in two places: it says "The current schema is
  `drizzle/0000_spotty_stone_men.sql`" (there are now three), and it says
  "`order_items` freezes the price at purchase time but not the product name" —
  the name and reference **are** now snapshotted (`place-order.ts:78-79`).
- `AGENTS.md` contains an auto-generated Next.js rules block; harmless but
  regenerated by `next dev`.
- `AUTH_TRUST_HOST=true` is set in local `.env.local`; not needed on Vercel.

Data hygiene
- Two admin users exist; `ettaziwael11@gmail.com` is a **test account** and
  should be removed before launch (`create-admin` has no delete counterpart).
- One test order (`CMD-0010`, id 10, status `new`) is in the database.
- Only 2 of 6 products are active; the other 4 are intentionally deactivated
  (migration 0002 + manual state). `sac-fleur-rose` is inactive **and** marked
  sold out.

Design / consistency
- Base UI emits a console warning for buttons rendered as links
  (`<Button render={<Link/>}>`) about `nativeButton`; cosmetic, not a bug.
- Dark-mode tokens are dead code until a provider is added.
- English DB columns are written but never read by the UI.

---

## 13. Open questions

1. **Delivery fees** — do you want a flat fee, per-city/zone pricing, free over
   a threshold, or keep it entirely manual over WhatsApp? This drives a schema
   + checkout change.
2. **Real contact details** — the production WhatsApp number (digits, with
   country code) and the real Instagram handle.
3. **Email notifications** — do you want the new-order email on? If so, the
   Resend account, the `ADMIN_NOTIFY_EMAIL` destination and a verified
   `RESEND_FROM` sender.
4. **Legal copy** — who supplies the final Terms (returns/cancellation) and
   Privacy (retention) text?
5. **Product images** — stay with "paste a URL" (current), or move to real
   uploads (Vercel Blob, already allowed in `remotePatterns`)? The current
   approach needs whoever adds photos to host them somewhere first.
6. **Categories** — needed at launch: create/rename/delete in the admin, or is
   the seeded fixed set (sacs/écharpes/accessoires) with a coming-soon toggle
   enough?
7. **FR/EN toggle and dark mode** — in scope for launch, or explicitly out?
8. **Canonical domain** — the final production origin for
   `NEXT_PUBLIC_SITE_URL`.
9. **Data cleanup** — confirm removing the test admin account and the test
   order before launch.
10. **Online payment** — confirm it is permanently cash-on-delivery only, or
   could be added later.

---

## Prioritized list: what is left before launch

1. **Set real production values:** a valid WhatsApp number, the real Instagram
   handle, and `NEXT_PUBLIC_SITE_URL` (final origin) in Vercel. (Without a real
   number, every ordering button is broken.)
2. **Replace placeholder product photos** with real ones (and add real product
   copy); the catalog is currently all `placehold.co` images.
3. **Finish the legal pages** (Terms + Privacy) — remove the "à compléter"
   placeholders; they are linked from every page footer.
4. **Decide delivery fees** or explicitly keep them manual, and make the
   checkout/site copy match that decision (the current "frais confirmés sur
   WhatsApp" is the manual path).
5. **Migrate the production database** (`npx drizzle-kit migrate`) and
   **create the real admin** (`npm run create-admin -- …`); then **delete the
   test admin** (`ettaziwael11@gmail.com`) and the test order.
6. **Add basic checkout abuse protection** (at least a simple rate limit or
   honeypot) before exposing guest checkout publicly.
7. **Commit and deploy** the current uncommitted work (migrations, categories
   admin, notify, order-form/order-statuses splits), and do a manual smoke
   test: browse → add to cart → checkout → find the order in `/admin` →
   change status → confirm WhatsApp reply.
8. Optional / if in scope: enable the new-order **email notifications**;
   confirm whether **FR/EN** and **dark mode** are needed at launch; verify the
   **favicon**; refresh the **README** (schema/migration and order-snapshot
   notes).
