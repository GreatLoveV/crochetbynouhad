import { and, eq, inArray } from "drizzle-orm";

import { getTxDb } from "@/db/tx";
import { orderItems, orders, products } from "@/db/schema";
import { normalizePhone, type CheckoutLine } from "@/lib/checkout";

/**
 * Writing an order to the database.
 *
 * Kept out of the server action so it can be read (and tested) on its own: the
 * action deals with the request, this deals with PostgreSQL.
 */

/** A product in the cart was deleted or deactivated while the customer was filling the form. */
export class ProductUnavailableError extends Error {}

export type NewOrder = {
  name: string;
  phone: string;
  city: string;
  address: string;
  notes: string | undefined;
  cart: CheckoutLine[];
};

/**
 * Saves the order and returns its id.
 *
 * The prices are read from the database inside the transaction, never taken
 * from the caller: this is the whole point of the function.
 *
 * @throws ProductUnavailableError if a product is gone (nothing is written).
 */
export async function createOrder(input: NewOrder): Promise<number> {
  const db = getTxDb();
  const ids = input.cart.map((line) => line.productId);

  return db.transaction(async (tx) => {
    const rows = await tx
      .select({ id: products.id, price: products.price })
      .from(products)
      .where(and(inArray(products.id, ids), eq(products.isActive, true)));

    const priceById = new Map(rows.map((row) => [row.id, row.price]));

    const lines = input.cart.map((line) => {
      const unitPrice = priceById.get(line.productId);
      if (unitPrice === undefined) {
        // Throwing rolls the transaction back, so nothing is left half-written.
        throw new ProductUnavailableError(
          `Product ${line.productId} is not available`,
        );
      }
      return { productId: line.productId, quantity: line.quantity, unitPrice };
    });

    const total = lines.reduce(
      (sum, line) => sum + line.unitPrice * line.quantity,
      0,
    );

    const [order] = await tx
      .insert(orders)
      .values({
        customerName: input.name,
        phone: normalizePhone(input.phone),
        city: input.city,
        address: input.address,
        notes: input.notes || null,
        total,
      })
      .returning({ id: orders.id });

    await tx.insert(orderItems).values(
      lines.map((line) => ({ orderId: order.id, ...line })),
    );

    return order.id;
  });
}