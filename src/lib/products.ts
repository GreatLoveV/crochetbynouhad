import { db } from "@/db";
import { products } from "@/db/schema";
import { and, eq } from "drizzle-orm";

/** Just enough to render a product tile (home grid, cart list). */
export type ProductSummary = {
  id: number;
  slug: string;
  nameFr: string;
  price: number;
  imageUrl: string | null;
  categoryNameFr: string;
};

/** Everything the product page needs. */
export type ProductDetail = {
  id: number;
  slug: string;
  nameFr: string;
  descriptionFr: string;
  price: number;
  categoryNameFr: string;
  categorySlug: string;
  /** Already ordered by `position`, so [0] is the main photo. */
  images: { url: string; position: number }[];
};

export type CategorySummary = {
  id: number;
  slug: string;
  nameFr: string;
};

/** Used by the category filter bar. */
export async function getCategories(): Promise<CategorySummary[]> {
  return db.query.categories.findMany({
    orderBy: (category, { asc }) => [asc(category.nameFr)],
  });
}

/**
 * Active products for the storefront. Inactive ones never reach the catalog.
 * Pass a categoryId to filter, or omit it to get everything.
 */
export async function getActiveProducts(
  categoryId?: number,
): Promise<ProductSummary[]> {
  const rows = await db.query.products.findMany({
    where: (product, { eq }) =>
      categoryId === undefined
        ? eq(product.isActive, true)
        : // Both conditions must hold, so they are combined with `and`.
          and(eq(product.isActive, true), eq(product.categoryId, categoryId)),
    // Images come back ordered by `position`, so [0] is the cover photo.
    with: {
      images: { orderBy: (img, { asc }) => [asc(img.position)] },
      category: true,
    },
    orderBy: (p, { asc }) => [asc(p.id)],
  });

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    nameFr: row.nameFr,
    price: row.price,
    imageUrl: row.images[0]?.url ?? null,
    categoryNameFr: row.category.nameFr,
  }));
}

/**
 * Re-reads products by id so the cart always renders what the database
 * currently says — never prices cached in the browser.
 */
export async function getProductsByIds(
  ids: number[],
): Promise<ProductSummary[]> {
  if (ids.length === 0) return [];

  const rows = await db.query.products.findMany({
    where: (product, { inArray }) => inArray(product.id, ids),
    with: {
      images: { orderBy: (img, { asc }) => [asc(img.position)] },
      category: true,
    },
  });

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    nameFr: row.nameFr,
    price: row.price,
    imageUrl: row.images[0]?.url ?? null,
    categoryNameFr: row.category.nameFr,
  }));
}

/**
 * One product for the detail page.
 *
 * Returns null when the slug does not exist OR when the product is inactive,
 * so a deactivated product stops being reachable by URL as well as being
 * hidden from the grid. The caller turns null into a 404.
 */
export async function getProductBySlug(
  slug: string,
): Promise<ProductDetail | null> {
  const row = await db.query.products.findFirst({
    where: eq(products.slug, slug),
    with: {
      images: { orderBy: (img, { asc }) => [asc(img.position)] },
      category: true,
    },
  });

  if (!row || !row.isActive) return null;

  return {
    id: row.id,
    slug: row.slug,
    nameFr: row.nameFr,
    descriptionFr: row.descriptionFr,
    price: row.price,
    categoryNameFr: row.category.nameFr,
    categorySlug: row.category.slug,
    images: row.images.map((image) => ({
      url: image.url,
      position: image.position,
    })),
  };
}

/** Slugs for generateStaticParams: every product a visitor may open. */
export async function getActiveProductSlugs(): Promise<string[]> {
  const rows = await db.query.products.findMany({
    where: eq(products.isActive, true),
    columns: { slug: true },
  });
  return rows.map((row) => row.slug);
}

