"use server";

import { revalidatePath } from "next/cache";
import { and, eq, inArray } from "drizzle-orm";

import { getTxDb } from "@/db/tx";
import { orderItems, orders, products } from "@/db/schema";
import { getAdmin } from "@/lib/auth/admin";
import { isOrderStatus } from "@/lib/constants/order-statuses";
import { strings } from "@/lib/constants/strings";
import type { ActionMessage } from "@/lib/validation/action-message";

/** A bag on a cancelled order was sold to someone else before it was revived. */
class ResoldError extends Error {}

/**
 * Order follow-up from the admin.
 *
 * `getAdmin()` first, always: an action is a bare POST to its own URL, so the
 * proxy redirect above it is not a security control.
 *
 * The status and the bags' sold flags change together in ONE transaction:
 * - cancelling gives the order's bags back to the shop;
 * - moving an order OUT of "cancelled" takes them back, with the same
 *   conditional UPDATE as checkout. If a bag was bought by someone else in the
 *   meantime, nothing changes and Nouhad is told why.
 */
export async function updateOrderStatus(
  _previous: ActionMessage,
  formData: FormData,
): Promise<ActionMessage> {
  if (!(await getAdmin())) return { error: strings.admin.errorGeneric };

  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "");

  if (!Number.isInteger(id) || id < 1) return { error: strings.admin.errorGeneric };
  // Never hand an arbitrary string to an enum column.
  if (!isOrderStatus(status)) return { error: strings.admin.errorGeneric };

  try {
    const changed = await getTxDb().transaction(async (tx) => {
      // Lock the order row so two clicks cannot interleave.
      const [existing] = await tx
        .select({ status: orders.status })
        .from(orders)
        .where(eq(orders.id, id))
        .for("update");
      if (!existing) return false;
      if (existing.status === status) return false;

      const wasCancelled = existing.status === "cancelled";
      const willBeCancelled = status === "cancelled";

      if (wasCancelled !== willBeCancelled) {
        const lines = await tx
          .select({ productId: orderItems.productId })
          .from(orderItems)
          .where(eq(orderItems.orderId, id));
        const productIds = lines.map((line) => line.productId);

        if (productIds.length > 0) {
          if (willBeCancelled) {
            await tx
              .update(products)
              .set({ isSoldOut: false })
              .where(inArray(products.id, productIds));
          } else {
            const reserved = await tx
              .update(products)
              .set({ isSoldOut: true })
              .where(
                and(inArray(products.id, productIds), eq(products.isSoldOut, false)),
              )
              .returning({ id: products.id });
            if (reserved.length !== productIds.length) throw new ResoldError();
          }
        }
      }

      await tx.update(orders).set({ status }).where(eq(orders.id, id));
      return true;
    });

    if (!changed) return {};
  } catch (error) {
    if (error instanceof ResoldError) return { error: strings.admin.errorResold };
    console.error("[updateOrderStatus]", error);
    return { error: strings.admin.errorGeneric };
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin/products");
  revalidatePath("/");
  // The piece pages are statically generated; a freed piece must reappear there.
  revalidatePath("/products/[slug]", "page");
  return { ok: strings.admin.statusUpdated };
}
