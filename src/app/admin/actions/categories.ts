"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { categories } from "@/db/schema";
import { getAdmin } from "@/lib/auth/admin";
import { setCategoryComingSoon } from "@/lib/data/admin-products";

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
  revalidatePath("/");
  revalidatePath("/admin/categories");
}
