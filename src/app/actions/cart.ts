"use server";

import { getProductsByIds, type ProductSummary } from "@/lib/data/products";

/**
 * Server Action used by the cart drawer.
 *
 * The browser only ever sends product ids; the names, images and prices come
 * back from PostgreSQL, so what the customer sees is always the real price.
 * The same re-check is repeated inside the checkout action before writing the
 * order — this one is only for display.
 */
export async function fetchCartProducts(ids: number[]): Promise<ProductSummary[]> {
  const wanted = Array.from(new Set(ids)).filter(
    (id) => Number.isInteger(id) && id > 0,
  );
  if (wanted.length === 0) return [];

  const products = await getProductsByIds(wanted);
  // Keep the order the customer added them in.
  const byId = new Map(products.map((product) => [product.id, product]));
  return wanted.flatMap((id) => {
    const product = byId.get(id);
    return product ? [product] : [];
  });
}
