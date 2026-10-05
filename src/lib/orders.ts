import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";

/**
 * Read-only view of a placed order, for the confirmation page.
 *
 * Note what is NOT returned: name, phone and address. The confirmation URL only
 * carries a sequential id, so showing personal details there would let anyone
 * enumerate /order/confirmation?order=1, =2, … and read Nouhad's customers.
 * The customer already has the details; Nouhad has them in the admin.
 */
export type OrderSummary = {
  id: number;
  total: number;
  status: "new" | "confirmed" | "shipped" | "delivered" | "cancelled";
  lines: {
    nameFr: string;
    quantity: number;
    unitPrice: number;
  }[];
};

export async function getOrderSummary(id: number): Promise<OrderSummary | null> {
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, id),
    columns: { id: true, total: true, status: true },
    with: {
      items: {
        columns: { quantity: true, unitPrice: true },
        with: { product: { columns: { nameFr: true } } },
      },
    },
  });

  if (!order) return null;

  return {
    id: order.id,
    total: order.total,
    status: order.status,
    lines: order.items.map((item) => ({
      nameFr: item.product.nameFr,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })),
  };
}

/** French labels for the admin statuses, for display next to a reference. */
export const ORDER_STATUS_LABELS: Record<OrderSummary["status"], string> = {
  new: "Reçue",
  confirmed: "Confirmée",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};