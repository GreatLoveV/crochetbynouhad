import { desc, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { orderItems, orders, products, orderStatusEnum } from "@/db/schema";

/**
 * Order queries for the admin.
 *
 * The shop never reads orders: checkout only inserts, and the confirmation page
 * gets its lines back from the transaction that created them. Everything here is
 * Nouhad's side.
 *
 * Note on item names: `order_items` stores the price but not the name, so a
 * product renamed later also shows its new name on old orders. The money is
 * frozen, the wording is not. Worth a `name_fr` column later if the history has
 * to read exactly as it was.
 */

export type OrderStatus = (typeof orderStatusEnum.enumValues)[number];

export const ORDER_STATUSES = orderStatusEnum.enumValues;

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
  slug: string | null;
  quantity: number;
  unitPrice: number;
};

export type AdminOrderDetail = AdminOrderRow & {
  address: string;
  notes: string | null;
  items: AdminOrderItem[];
};

/** Same shape as `src/lib/checkout.ts` builds for the customer's receipt. */
function reference(id: number): string {
  return `CB-${id}`;
}

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
    reference: reference(row.id),
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
        nameFr: products.nameFr,
        slug: products.slug,
        quantity: orderItems.quantity,
        unitPrice: orderItems.unitPrice,
      })
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, id))
      .orderBy(orderItems.id),
  ]);

  if (!order) return null;

  return {
    id: order.id,
    reference: reference(order.id),
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

/** Guards a status coming from a form before it reaches the enum column. */
export function isOrderStatus(value: string): value is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(value);
}