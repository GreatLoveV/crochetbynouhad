import "server-only";

import { db } from "@/db";
import { products } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";

import type { Locale } from "@/i18n/config";

/**
 * Every reader takes the page's language and returns text in it. Arabic text
 * is optional in the admin, so an Arabic page falls back to the French when a
 * piece has none yet. `nameLang` / `descriptionLang` say which language the
 * text really is in, so the page can mark it with `lang="fr"` for screen
 * readers and fonts.
 */
function pick(lang: Locale, ar: string | null, fr: string): { text: string; lang: Locale } {
  if (lang === "ar" && ar && ar.trim() !== "") return { text: ar, lang: "ar" };
  return { text: fr, lang: "fr" };
}

/** Just enough to render a product tile (home grid, cart list). */
export type ProductSummary = {
  id: number;
  slug: string;
  name: string;
  nameLang: Locale;
  price: number;
  imageUrl: string | null;
  categoryName: string;
  reference: string | null;
  isSoldOut: boolean;
};

/** Everything the product page needs. */
export type ProductDetail = {
  id: number;
  slug: string;
  name: string;
  nameLang: Locale;
  description: string;
  descriptionLang: Locale;
  price: number;
  categoryName: string;
  categorySlug: string;
  /** Already ordered by `position`, so [0] is the main photo. */
  images: { url: string; position: number }[];
  reference: string | null;
  isSoldOut: boolean;
};

export type CategorySummary = {
  id: number;
  slug: string;
  name: string;
  isComingSoon: boolean;
};

/** Used by the category filter bar. Same order in both languages. */
export async function getCategories(lang: Locale): Promise<CategorySummary[]> {
  const rows = await db.query.categories.findMany({
    columns: { id: true, slug: true, nameFr: true, nameAr: true, isComingSoon: true },
    orderBy: (category, { asc }) => [asc(category.nameFr)],
  });
  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: pick(lang, row.nameAr, row.nameFr).text,
    isComingSoon: row.isComingSoon,
  }));
}

type SummaryRow = {
  id: number;
  slug: string;
  nameFr: string;
  nameAr: string | null;
  price: number;
  reference: string | null;
  isSoldOut: boolean;
  images: { url: string }[];
  category: { nameFr: string; nameAr: string | null };
};

function toSummary(lang: Locale, row: SummaryRow): ProductSummary {
  const name = pick(lang, row.nameAr, row.nameFr);
  return {
    id: row.id,
    slug: row.slug,
    name: name.text,
    nameLang: name.lang,
    price: row.price,
    imageUrl: row.images[0]?.url ?? null,
    categoryName: pick(lang, row.category.nameAr, row.category.nameFr).text,
    reference: row.reference,
    isSoldOut: row.isSoldOut,
  };
}

/**
 * Active products for the storefront. Inactive ones never reach the catalog.
 * Pass a categoryId to filter, or omit it to get everything.
 */
export async function getActiveProducts(
  lang: Locale,
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
    // Newest bags first: what Nouhad just finished is what visitors see first.
    orderBy: (p, { desc }) => [desc(p.createdAt), desc(p.id)],
  });

  return rows.map((row) => toSummary(lang, row));
}

/**
 * Re-reads products by id so the cart always renders what the database
 * currently says — never prices cached in the browser. Hidden products are
 * left out, so they drop out of the cart instead of failing at checkout.
 */
export async function getProductsByIds(
  lang: Locale,
  ids: number[],
): Promise<ProductSummary[]> {
  if (ids.length === 0) return [];

  const rows = await db.query.products.findMany({
    where: and(inArray(products.id, ids), eq(products.isActive, true)),
    with: {
      images: { orderBy: (img, { asc }) => [asc(img.position)] },
      category: true,
    },
  });

  return rows.map((row) => toSummary(lang, row));
}

/**
 * One product for the detail page.
 *
 * Returns null when the slug does not exist OR when the product is inactive,
 * so a deactivated product stops being reachable by URL as well as being
 * hidden from the grid. The caller turns null into a 404.
 */
export async function getProductBySlug(
  lang: Locale,
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

  const name = pick(lang, row.nameAr, row.nameFr);
  const description = pick(lang, row.descriptionAr, row.descriptionFr);
  return {
    id: row.id,
    slug: row.slug,
    name: name.text,
    nameLang: name.lang,
    description: description.text,
    descriptionLang: description.lang,
    price: row.price,
    categoryName: pick(lang, row.category.nameAr, row.category.nameFr).text,
    categorySlug: row.category.slug,
    images: row.images.map((image) => ({
      url: image.url,
      position: image.position,
    })),
    reference: row.reference,
    isSoldOut: row.isSoldOut,
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

