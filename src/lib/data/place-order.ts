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

export type CreatedOrder = {
  id: number;
  /** Unguessable id for the customer's confirmation link. */
  publicToken: string;
};

/**
 * Saves the order and returns its id and public token.
 *
 * The prices are read from the database inside the transaction, never taken
 * from the caller.
 *
 * Every bag is one of a kind. The bags are reserved with ONE conditional UPDATE
 * (`... WHERE is_sold_out = false`) before anything is written. Two checkouts
 * racing for the same bag both reach that UPDATE, but Postgres row locks make
 * the second one wait, re-check the condition once the first commits, find the
 * bag already sold, and update nothing — so it fails and rolls back. A plain
 * "read, then write" would let both succeed.
 *
 * @throws ProductUnavailableError if a product is gone (nothing is written).
 * @throws ProductReservedError if a unique piece was taken meanwhile.
 */
export async function createOrder(input: NewOrder): Promise<CreatedOrder> {
  const db = getTxDb();
  const ids = input.cart.map((line) => line.productId);

  return db.transaction(async (tx) => {
    const rows = await tx
      .select({
        id: products.id,
        price: products.price,
        nameFr: products.nameFr,
        reference: products.reference,
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
      // Early exit for the common case; the UPDATE below is what guarantees it.
      if (product.isSoldOut) {
        throw new ProductReservedError(
          `Product ${line.productId} was just reserved`,
        );
      }
      return {
        productId: line.productId,
        quantity: 1,
        unitPrice: product.price,
        // Snapshotted here so a later rename or deactivation does not rewrite
        // what the customer actually ordered.
        productName: product.nameFr,
        productReference: product.reference,
      };
    });

    // Reserve every bag atomically, before writing the order.
    const reserved = await tx
      .update(products)
      .set({ isSoldOut: true })
      .where(
        and(
          inArray(products.id, ids),
          eq(products.isSoldOut, false),
          eq(products.isActive, true),
        ),
      )
      .returning({ id: products.id });
    if (reserved.length !== ids.length) {
      throw new ProductReservedError("A bag was just reserved");
    }

    const total = lines.reduce((sum, line) => sum + line.unitPrice, 0);

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
      .returning({ id: orders.id, publicToken: orders.publicToken });

    await tx.insert(orderItems).values(
      lines.map((line) => ({ orderId: order.id, ...line })),
    );

    return order;
  });
}
