"use server";

import { revalidatePath } from "next/cache";
import { and, eq, inArray } from "drizzle-orm";

import { db } from "@/db";
import { orderItems, orders, products } from "@/db/schema";
import { getAdmin } from "@/lib/auth/admin";
import { isOrderStatus } from "@/lib/constants/order-statuses";

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

  // Cancelling gives a one-of-a-kind piece back to the shop. Only unique
  // products are tracked this way; a non-unique one is never auto-reserved.
  if (status === "cancelled") {
    const lines = await db
      .select({ productId: orderItems.productId })
      .from(orderItems)
      .where(eq(orderItems.orderId, id));

    const productIds = lines.map((line) => line.productId);
    if (productIds.length > 0) {
      await db
        .update(products)
        .set({ isSoldOut: false })
        .where(
          and(
            inArray(products.id, productIds),
            eq(products.isUnique, true),
          ),
        );
    }
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/");
  // The piece pages are statically generated; a freed piece must reappear there.
  revalidatePath("/products/[slug]", "page");
}
