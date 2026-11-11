import "server-only";

import { revalidatePath } from "next/cache";

import { locales } from "@/i18n/config";

/**
 * Refreshes shop pages after an admin change, in every language. Each page
 * exists once per language (`/fr/...`, `/ar/...`), so revalidating `/` alone
 * would leave both stale.
 */

/** The home page (catalogue) in every language. */
export function revalidateShopHome(): void {
  for (const lang of locales) revalidatePath(`/${lang}`);
}

/** One product page in every language. */
export function revalidateProductPage(slug: string): void {
  for (const lang of locales) revalidatePath(`/${lang}/products/${slug}`);
}

/** Every product page in every language. */
export function revalidateAllProductPages(): void {
  revalidatePath("/[lang]/products/[slug]", "page");
}
