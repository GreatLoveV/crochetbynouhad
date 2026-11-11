import "server-only";

import { and, asc, desc, eq, max, ne, notExists, sql } from "drizzle-orm";

import { db } from "@/db";
import { categories, orderItems, orders, productImages, products } from "@/db/schema";
import { formatProductReference } from "@/lib/format/money";
import { slugify, type ProductFormValues } from "@/lib/validation/product-form";

/**
 * Product queries and writes for the admin.
 *
 * Separate from `src/lib/products.ts`, which serves the shop and only ever
 * shows active pieces. Here we need everything, including deactivated ones.
 *
 * The writes live here rather than in the server actions so they can be called
 * without a request: `revalidatePath` and the session check stay in the action,
 * the SQL does not depend on either.
 */

export type AdminProductRow = {
  id: number;
  slug: string;
  nameFr: string;
  price: number;
  isActive: boolean;
  reference: string | null;
  isSoldOut: boolean;
  categoryNameFr: string;
  imageUrl: string | null;
  imageCount: number;
  orderCount: number;
};

export async function getAdminProducts(): Promise<AdminProductRow[]> {
  const rows = await db
    .select({
      id: products.id,
      slug: products.slug,
      nameFr: products.nameFr,
      price: products.price,
      isActive: products.isActive,
      reference: products.reference,
      isSoldOut: products.isSoldOut,
      categoryNameFr: categories.nameFr,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(desc(products.isActive), asc(products.nameFr));

  // Three small queries instead of one full of correlated subqueries. Drizzle
  // emits a `sql` template's outer column unqualified, and inside the subquery
  // Postgres binds a bare `"id"` to the inner table, so the counts come back 0.
  const [images, imageTotals, orderTotals] = await Promise.all([
    db
      .select({
        productId: productImages.productId,
        url: productImages.url,
      })
      .from(productImages)
      .orderBy(asc(productImages.position), asc(productImages.id)),
    db
      .select({
        productId: productImages.productId,
        total: sql<number>`count(*)::int`,
      })
      .from(productImages)
      .groupBy(productImages.productId),
    db
      .select({
        productId: orderItems.productId,
        total: sql<number>`count(*)::int`,
      })
      .from(orderItems)
      .groupBy(orderItems.productId),
  ]);

  // The first photo in gallery order is the cover.
  const coverByProduct = new Map<number, string>();
  for (const image of images) {
    if (!coverByProduct.has(image.productId)) {
      coverByProduct.set(image.productId, image.url);
    }
  }

  const imageCountByProduct = new Map<number, number>(
    imageTotals.map((row) => [row.productId, row.total]),
  );
  const orderCountByProduct = new Map<number, number>(
    orderTotals.map((row) => [row.productId, row.total]),
  );

  return rows.map((row) => ({
    ...row,
    imageUrl: coverByProduct.get(row.id) ?? null,
    imageCount: imageCountByProduct.get(row.id) ?? 0,
    // How many times this piece appears in past orders: a hint that it should
    // be deactivated rather than deleted.
    orderCount: orderCountByProduct.get(row.id) ?? 0,
  }));
}

export type AdminProductDetail = {
  id: number;
  slug: string;
  nameFr: string;
  nameAr: string | null;
  descriptionFr: string;
  descriptionAr: string | null;
  categoryId: number;
  price: number;
  reference: string | null;
  isActive: boolean;
  isSoldOut: boolean;
  images: { id: number; url: string; position: number }[];
};

/** `null` when the id does not exist. */
export async function getAdminProduct(
  id: number,
): Promise<AdminProductDetail | null> {
  const row = await db.query.products.findFirst({
    where: eq(products.id, id),
    columns: {
      id: true,
      slug: true,
      nameFr: true,
      nameAr: true,
      descriptionFr: true,
      descriptionAr: true,
      categoryId: true,
      price: true,
      reference: true,
      isActive: true,
      isSoldOut: true,
    },
    with: {
      images: {
        columns: { id: true, url: true, position: true },
        orderBy: (images, { asc: byAsc }) => [
          byAsc(images.position),
          byAsc(images.id),
        ],
      },
    },
  });

  if (!row) return null;

  return {
    id: row.id,
    slug: row.slug,
    nameFr: row.nameFr,
    nameAr: row.nameAr,
    descriptionFr: row.descriptionFr,
    descriptionAr: row.descriptionAr,
    categoryId: row.categoryId,
    price: row.price,
    reference: row.reference,
    isActive: row.isActive,
    isSoldOut: row.isSoldOut,
    images: row.images,
  };
}

/** Categories for the form dropdown. */
export async function getAdminCategories() {
  return db
    .select({ id: categories.id, nameFr: categories.nameFr })
    .from(categories)
    .orderBy(asc(categories.nameFr));
}

/** Categories with their "coming soon" flag and how many pieces they hold. */
export type AdminCategoryRow = {
  id: number;
  slug: string;
  nameFr: string;
  nameAr: string | null;
  isComingSoon: boolean;
  productCount: number;
};

export async function getAdminCategoryList(): Promise<AdminCategoryRow[]> {
  const [rows, counts] = await Promise.all([
    db
      .select({
        id: categories.id,
        slug: categories.slug,
        nameFr: categories.nameFr,
        nameAr: categories.nameAr,
        isComingSoon: categories.isComingSoon,
      })
      .from(categories)
      .orderBy(asc(categories.nameFr)),
    db
      .select({
        categoryId: products.categoryId,
        total: sql<number>`count(*)::int`,
      })
      .from(products)
      .groupBy(products.categoryId),
  ]);

  const countByCategory = new Map(counts.map((row) => [row.categoryId, row.total]));

  return rows.map((row) => ({
    ...row,
    productCount: countByCategory.get(row.id) ?? 0,
  }));
}

/** Flips a category between live and coming soon. */
/** Sets (or, with `null`, clears) a category's Arabic name. */
export async function setCategoryNameAr(id: number, nameAr: string | null): Promise<void> {
  await db.update(categories).set({ nameAr }).where(eq(categories.id, id));
}

export async function setCategoryComingSoon(
  id: number,
  isComingSoon: boolean,
): Promise<{ slug: string; isComingSoon: boolean } | null> {
  const before = await db.query.categories.findFirst({
    where: eq(categories.id, id),
    columns: { slug: true },
  });
  if (!before) return null;

  await db
    .update(categories)
    .set({ isComingSoon })
    .where(eq(categories.id, id));

  return { slug: before.slug, isComingSoon };
}

/** Used to make sure a slug is free, and to find the next free one. */
export async function slugExists(slug: string, exceptId?: number): Promise<boolean> {
  const row = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);

  if (row.length === 0) return false;
  return exceptId === undefined ? true : row[0].id !== exceptId;
}

/**
 * `base` if free, otherwise `base-2`, `base-3`…
 * Keeps admin life simple: the slug is generated, only rarely typed by hand.
 */
export async function findFreeSlug(base: string): Promise<string> {
  const root = base || "piece";
  if (!(await slugExists(root))) return root;

  for (let suffix = 2; suffix < 200; suffix += 1) {
    const candidate = `${root}-${suffix}`;
    if (!(await slugExists(candidate))) return candidate;
  }
  // Practically unreachable.
  return `${root}-${Date.now()}`;
}

/** Exactly what a `products` row needs, with prices already in centimes. */
export type ProductInput = {
  slug: string;
  nameFr: string;
  /** `null` when left empty: Arabic pages then show the French. */
  nameAr: string | null;
  descriptionFr: string;
  descriptionAr: string | null;
  categoryId: number;
  price: number;
  isActive: boolean;
  reference: string;
};

/**
 * Pure: no DB, no Next. Turns validated form values into row values.
 *
 * An empty Arabic field is stored as `null`, never `""`, so "not translated
 * yet" has one meaning everywhere.
 */
export function toProductInput(
  data: ProductFormValues,
  price: number,
  slug: string,
  reference: string,
): ProductInput {
  return {
    slug,
    nameFr: data.nameFr,
    nameAr: data.nameAr || null,
    descriptionFr: data.descriptionFr,
    descriptionAr: data.descriptionAr || null,
    categoryId: data.categoryId,
    price,
    isActive: data.isActive,
    reference,
  };
}

/**
 * Picks the slug to store.
 *
 * A slug typed by hand must be free, otherwise the admin is told and can fix it.
 * A slug left empty is only a suggestion, so the next free one is taken quietly.
 */
export async function resolveProductSlug({
  slug,
  nameFr,
  productId,
}: {
  slug: string;
  nameFr: string;
  productId?: number;
}): Promise<{ ok: true; slug: string } | { ok: false; reason: "taken" }> {
  const wanted = slug ? slugify(slug) : slugify(nameFr);

  if (slug) {
    return (await slugExists(wanted, productId))
      ? { ok: false, reason: "taken" }
      : { ok: true, slug: wanted };
  }

  return { ok: true, slug: await findFreeSlug(wanted) };
}

/**
 * Inserts a product and returns its id.
 *
 * A blank reference is written as null first (Postgres allows many nulls in a
 * unique column), then backfilled with `CN-` + the id now that it exists, so
 * two products can never end up with the same number.
 */
export async function createProduct(input: ProductInput): Promise<number> {
  const created = await db
    .insert(products)
    .values({
      ...input,
      // Legacy English columns are NOT NULL but no longer edited or shown:
      // a new piece copies its French text there. Existing pieces keep theirs.
      nameEn: input.nameFr,
      descriptionEn: input.descriptionFr,
      reference: input.reference || null,
    })
    .returning({ id: products.id });
  const id = created[0].id;

  if (!input.reference) {
    await db
      .update(products)
      .set({ reference: formatProductReference(id) })
      .where(eq(products.id, id));
  }

  return id;
}

/** Returns the slug the product had before, so its old page can be revalidated. */
export async function updateProduct(
  id: number,
  input: ProductInput,
): Promise<string | null> {
  const before = await db.query.products.findFirst({
    where: eq(products.id, id),
    columns: { slug: true, reference: true },
  });

  await db
    .update(products)
    .set({
      ...input,
      // A blank reference keeps the one already assigned.
      reference: input.reference || before?.reference || formatProductReference(id),
    })
    .where(eq(products.id, id));

  return before?.slug ?? null;
}

/** Flips the visible flag and reports what it became. */
export async function setProductActive(
  id: number,
  isActive: boolean,
): Promise<{ slug: string; isActive: boolean } | null> {
  const before = await db.query.products.findFirst({
    where: eq(products.id, id),
    columns: { slug: true, isActive: true },
  });
  if (!before) return null;

  await db.update(products).set({ isActive }).where(eq(products.id, id));

  return { slug: before.slug, isActive };
}

/**
 * Marks a piece sold by hand — sold over WhatsApp or in person, outside the
 * checkout. Returns its slug so the public page can be refreshed.
 */
export async function markProductSold(id: number): Promise<string | null> {
  const [row] = await db
    .update(products)
    .set({ isSoldOut: true })
    .where(eq(products.id, id))
    .returning({ slug: products.slug });
  return row?.slug ?? null;
}

/**
 * Puts a piece back on sale — unless an order that is not cancelled still
 * holds it. Check and write are ONE statement, so nothing can slip in between.
 */
export async function markProductAvailable(
  id: number,
): Promise<{ ok: true; slug: string } | { ok: false; reason: "held" | "missing" }> {
  const heldByLiveOrder = db
    .select({ one: sql`1` })
    .from(orderItems)
    .innerJoin(orders, eq(orders.id, orderItems.orderId))
    .where(and(eq(orderItems.productId, id), ne(orders.status, "cancelled")));

  const [row] = await db
    .update(products)
    .set({ isSoldOut: false })
    .where(and(eq(products.id, id), notExists(heldByLiveOrder)))
    .returning({ slug: products.slug });
  if (row) return { ok: true, slug: row.slug };

  const exists = await db.query.products.findFirst({
    where: eq(products.id, id),
    columns: { id: true },
  });
  return { ok: false, reason: exists ? "held" : "missing" };
}

/**
 * Only https links: a `javascript:` URL can never end up in an `src`, and an
 * `http:` photo would make the browser flag the page as not secure.
 */
export function isAllowedImageUrl(url: string): boolean {
  if (url.length > 2000) return false;
  try {
    const { protocol } = new URL(url);
    return protocol === "https:";
  } catch {
    return false;
  }
}

/** Appends a photo to the gallery. New photos go to the end. */
export async function addProductImage(
  productId: number,
  url: string,
): Promise<void> {
  const last = await db
    .select({ top: max(productImages.position) })
    .from(productImages)
    .where(eq(productImages.productId, productId));

  await db.insert(productImages).values({
    productId,
    url,
    position: (last[0]?.top ?? -1) + 1,
  });
}

export async function removeProductImage(imageId: number): Promise<void> {
  await db.delete(productImages).where(eq(productImages.id, imageId));
}

/**
 * Moves a photo one place earlier or later in the gallery.
 *
 * Swapping in two statements leaves the two rows sharing a position for a
 * moment; there is no unique constraint on it, so that is harmless.
 */
export async function moveProductImage(
  imageId: number,
  direction: "up" | "down",
): Promise<boolean> {
  const image = await db.query.productImages.findFirst({
    where: eq(productImages.id, imageId),
  });
  if (!image) return false;

  const siblings = await db
    .select({ id: productImages.id, position: productImages.position })
    .from(productImages)
    .where(eq(productImages.productId, image.productId))
    .orderBy(productImages.position, productImages.id);

  const index = siblings.findIndex((row) => row.id === imageId);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= siblings.length) return false;

  const other = siblings[target];
  // Each row takes the *other's* position. The two rows share a position in
  // between, which is fine: nothing is unique on it.
  await db
    .update(productImages)
    .set({ position: image.position })
    .where(eq(productImages.id, other.id));
  await db
    .update(productImages)
    .set({ position: other.position })
    .where(eq(productImages.id, imageId));

  return true;
}