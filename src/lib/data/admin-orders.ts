import "server-only";

import { desc, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { orderItems, orders, products } from "@/db/schema";
import { formatOrderNumber, formatPrice } from "@/lib/format/money";
import {
  type OrderStatus,
  ORDER_STATUSES,
} from "@/lib/constants/order-statuses";

/**
 * Order queries for the admin.
 *
 * The shop never reads orders: checkout only inserts, and the confirmation page
 * gets its lines back from the transaction that created them. Everything here is
 * Nouhad's side.
 *
 * Item name and reference are read from `order_items` (snapshotted at order
 * time), not from `products`, so renaming or deactivating a piece never rewrites
 * a past order. `products` is still joined for the link back to the current page.
 */

export type AdminOrderRow = {
  id: number;
  reference: string;
  customerName: string;
  phone: string;
  city: string;
  total: number;
  status: OrderStatus;
  createdAt: Date;
  /** Total number of pieces, not lines. */
  pieceCount: number;
};

export type AdminOrderItem = {
  id: number;
  productId: number;
  nameFr: string;
  reference: string | null;
  slug: string | null;
  quantity: number;
  unitPrice: number;
};

export type AdminOrderDetail = AdminOrderRow & {
  address: string;
  notes: string | null;
  items: AdminOrderItem[];
};

export async function getAdminOrders(): Promise<AdminOrderRow[]> {
  const [rows, totals] = await Promise.all([
    db
      .select({
        id: orders.id,
        customerName: orders.customerName,
        phone: orders.phone,
        city: orders.city,
        total: orders.total,
        status: orders.status,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .orderBy(desc(orders.createdAt), desc(orders.id)),
    // A grouped query, not a correlated subquery: Drizzle writes the outer column
    // of a `sql` template unqualified, and inside the subquery Postgres binds a
    // bare `"id"` to `order_items`, so the piece count always comes back 0.
    db
      .select({
        orderId: orderItems.orderId,
        pieces: sql<number>`sum(${orderItems.quantity})::int`,
      })
      .from(orderItems)
      .groupBy(orderItems.orderId),
  ]);

  const piecesByOrder = new Map<number, number>(
    totals.map((row) => [row.orderId, row.pieces]),
  );

  return rows.map((row) => ({
    ...row,
    reference: formatOrderNumber(row.id),
    pieceCount: piecesByOrder.get(row.id) ?? 0,
  }));
}

/** `null` when the order does not exist. */
export async function getAdminOrder(id: number): Promise<AdminOrderDetail | null> {
  const [order, items] = await Promise.all([
    db.query.orders.findFirst({ where: eq(orders.id, id) }),
    db
      .select({
        id: orderItems.id,
        productId: orderItems.productId,
        // Snapshotted on the line; the join only supplies the current slug so
        // the admin can still open the piece if it is still active. The
        // `coalesce` only matters for a row written before the backfill.
        nameFr: sql<string>`coalesce(${orderItems.productName}, ${products.nameFr})`,
        reference: sql<string | null>`coalesce(${orderItems.productReference}, ${products.reference})`,
        slug: products.slug,
        quantity: orderItems.quantity,
        unitPrice: orderItems.unitPrice,
      })
      .from(orderItems)
      .leftJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, id))
      .orderBy(orderItems.id),
  ]);

  if (!order) return null;

  return {
    id: order.id,
    reference: formatOrderNumber(order.id),
    customerName: order.customerName,
    phone: order.phone,
    city: order.city,
    address: order.address,
    notes: order.notes,
    total: order.total,
    status: order.status,
    createdAt: order.createdAt,
    pieceCount: items.reduce((sum, item) => sum + item.quantity, 0),
    items,
  };
}

/** Counts for the status tabs, so Nouhad sees where the orders stand. */
export async function getOrderStatusCounts(): Promise<Record<OrderStatus, number>> {
  const rows = await db
    .select({ status: orders.status, count: sql<number>`count(*)::int` })
    .from(orders)
    .groupBy(orders.status);

  const counts = Object.fromEntries(
    ORDER_STATUSES.map((status) => [status, 0]),
  ) as Record<OrderStatus, number>;
  for (const row of rows) counts[row.status] = row.count;
  return counts;
}

/**
 * Prefilled message for "Contacter le client sur WhatsApp" in the admin.
 *
 * The delivery fee is left as "…" on purpose: wa.me opens the composer with
 * the text ready to edit, so Nouhad has to fill the amount for the city before
 * sending — the message never claims a price it does not know.
 */
export function buildAdminOrderWhatsappMessage(order: AdminOrderDetail): string {
  const items = order.items
    .map(
      (item) =>
        `${item.nameFr}${item.reference ? ` (${item.reference})` : ""} x${item.quantity}`,
    )
    .join(", ");

  return [
    `Bonjour ${order.customerName}, c'est Nouhad de Crochet by Nouhad. Je confirme votre commande ${order.reference} : ${items}. Total : ${formatPrice(order.total)}, paiement à la livraison. Les frais de livraison pour ${order.city} sont de … MAD. Merci !`,
  ].join("");
}