import "server-only";

import { and, eq, inArray } from "drizzle-orm";

import { getTxDb } from "@/db/tx";
import { orderItems, orders, products } from "@/db/schema";
import { normalizePhone, type CheckoutLine } from "@/lib/validation/checkout";

/**
 * Writing an order to the database.
 *
 * Kept out of the server action so it can be read (and tested) on its own: the
 * action deals with the request, this deals with PostgreSQL.
 */

/** A product in the cart was deleted or deactivated while the customer was filling the form. */
export class ProductUnavailableError extends Error {}

/** A one-of-a-kind piece was reserved by another order between cart and checkout. */
export class ProductReservedError extends Error {}

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
 * from the caller: this is the whole point of the function. Unique pieces are
 * reserved here too, so two people can never buy the same bag.
 *
 * @throws ProductUnavailableError if a product is gone (nothing is written).
 * @throws ProductReservedError if a unique piece was taken meanwhile.
 */
export async function createOrder(input: NewOrder): Promise<number> {
  const db = getTxDb();
  const ids = input.cart.map((line) => line.productId);

  return db.transaction(async (tx) => {
    const rows = await tx
      .select({
        id: products.id,
        price: products.price,
        nameFr: products.nameFr,
        reference: products.reference,
        isUnique: products.isUnique,
        isSoldOut: products.isSoldOut,
      })
      .from(products)
      .where(and(inArray(products.id, ids), eq(products.isActive, true)));

    const byId = new Map(rows.map((row) => [row.id, row]));

    const lines = input.cart.map((line) => {
      const product = byId.get(line.productId);
      if (product === undefined) {
        // Throwing rolls the transaction back, so nothing is left half-written.
        throw new ProductUnavailableError(
          `Product ${line.productId} is not available`,
        );
      }
      // A unique piece is reserved the moment it is ordered.
      if (product.isUnique && product.isSoldOut) {
        throw new ProductReservedError(
          `Product ${line.productId} was just reserved`,
        );
      }
      return {
        productId: line.productId,
        quantity: product.isUnique ? 1 : line.quantity,
        unitPrice: product.price,
        // Snapshotted here so a later rename or deactivation does not rewrite
        // what the customer actually ordered.
        productName: product.nameFr,
        productReference: product.reference,
      };
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

    // Reserve every unique piece on this order in one statement.
    const uniqueIds = lines
      .filter((line) => byId.get(line.productId)?.isUnique)
      .map((line) => line.productId);
    if (uniqueIds.length > 0) {
      await tx
        .update(products)
        .set({ isSoldOut: true })
        .where(inArray(products.id, uniqueIds));
    }

    return order.id;
  });
}
