"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { orders } from "@/db/schema";
import { getAdmin } from "@/lib/admin";
import { isOrderStatus } from "@/lib/admin-orders";

/**
 * Order follow-up from the admin.
 *
 * `getAdmin()` first, always: an action is a bare POST to its own URL, so the
 * proxy redirect above it is not a security control.
 */
export async function updateOrderStatus(formData: FormData): Promise<void> {
  if (!(await getAdmin())) return;

  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "");

  if (!Number.isInteger(id) || id < 1) return;
  // Never hand an arbitrary string to an enum column.
  if (!isOrderStatus(status)) return;

  const existing = await db.query.orders.findFirst({
    where: eq(orders.id, id),
    columns: { id: true, status: true },
  });
  if (!existing) return;
  if (existing.status === status) return;

  await db.update(orders).set({ status }).where(eq(orders.id, id));

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}