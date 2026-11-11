"use server";

import { revalidatePath } from "next/cache";

import {
  revalidateAllProductPages,
  revalidateShopHome,
} from "@/lib/cache/revalidate-shop";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { categories } from "@/db/schema";
import { getAdmin } from "@/lib/auth/admin";
import { setCategoryComingSoon, setCategoryNameAr } from "@/lib/data/admin-products";

/**
 * Category follow-up from the admin.
 *
 * `getAdmin()` first, always: an action is a bare POST to its own URL, so the
 * proxy redirect above it is not a security control.
 */
export async function toggleCategoryComingSoon(formData: FormData): Promise<void> {
  if (!(await getAdmin())) return;

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id < 1) return;

  const current = await db.query.categories.findFirst({
    where: eq(categories.id, id),
    columns: { isComingSoon: true },
  });
  if (!current) return;

  await setCategoryComingSoon(id, !current.isComingSoon);

  // The badge and the empty state both live on the home page.
  revalidateShopHome();
  revalidatePath("/admin/categories");
}

/**
 * Saves a category's Arabic name, shown on the Arabic shop. Empty clears it,
 * and the Arabic shop falls back to the French name.
 */
export async function saveCategoryNameAr(formData: FormData): Promise<void> {
  if (!(await getAdmin())) return;

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id < 1) return;

  const raw = String(formData.get("nameAr") ?? "").trim();
  // Same limit as the French names; anything longer is a mistake, not a name.
  if (raw.length > 60) return;

  await setCategoryNameAr(id, raw === "" ? null : raw);

  revalidateShopHome();
  revalidateAllProductPages();
  revalidatePath("/admin/categories");
}
