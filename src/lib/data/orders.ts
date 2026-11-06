import "server-only";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { formatPrice, formatOrderNumber, formatProductReference } from "@/lib/format/money";
import { strings } from "@/lib/constants/strings";

/**
 * Read-only view of a placed order, for the confirmation page.
 *
 * Name and city are only returned when the caller explicitly asks for them
 * (`includeCustomer`). The confirmation URL carries a sequential id, so without
 * that gate anyone could enumerate /order/confirmation?order=1, =2, … and read
 * Nouhad's customers. The page unlocks them with a cookie set when the order is
 * placed, so only the customer who just ordered sees their own details.
 */
export type OrderSummary = {
  id: number;
  reference: string;
  total: number;
  status: "new" | "confirmed" | "shipped" | "delivered" | "cancelled";
  lines: {
    /** Snapshot taken at checkout: a rename never rewrites a sent receipt. */
    nameFr: string;
    reference: string;
    /** Current product page, when the piece still exists. */
    slug: string | null;
    quantity: number;
    unitPrice: number;
  }[];
  /** Present only when `includeCustomer` was set. */
  customerName?: string;
  city?: string;
};

export async function getOrderSummary(
  id: number,
  options: { includeCustomer?: boolean } = {},
): Promise<OrderSummary | null> {
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, id),
    columns: {
      id: true,
      total: true,
      status: true,
      customerName: true,
      city: true,
    },
    with: {
      items: {
        columns: {
          productId: true,
          quantity: true,
          unitPrice: true,
          productName: true,
          productReference: true,
        },
        with: { product: { columns: { slug: true } } },
      },
    },
  });

  if (!order) return null;

  const summary: OrderSummary = {
    id: order.id,
    reference: formatOrderNumber(order.id),
    total: order.total,
    status: order.status,
    lines: order.items.map((item) => ({
      // `productName` is nullable so the backfill migration could run against a
      // full table; after it every line has one, but the type still says `null`.
      nameFr: item.productName ?? strings.order.itemFallback,
      reference: item.productReference ?? formatProductReference(item.productId),
      slug: item.product?.slug ?? null,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })),
  };

  if (options.includeCustomer) {
    summary.customerName = order.customerName;
    summary.city = order.city;
  }

  return summary;
}

/**
 * The message behind "Envoyer ma commande sur WhatsApp" on the confirmation
 * page. Built from the SAVED order, so it always matches what Nouhad will see.
 */
export function buildOrderWhatsappMessage(
  order: OrderSummary,
  siteUrl: string,
): string {
  const lines = order.lines.flatMap((line) => {
    const head = `- ${line.reference} ${line.nameFr} x${line.quantity}, ${formatPrice(
      line.unitPrice * line.quantity,
    )}`;
    return line.slug ? [head, `  ${siteUrl}/products/${line.slug}`] : [head];
  });

  const parts = [
    `Bonjour, voici ma commande ${order.reference} :`,
    ...lines,
    `Total : ${formatPrice(order.total)} (paiement à la livraison)`,
  ];

  if (order.customerName && order.city) {
    parts.push(`Nom : ${order.customerName}, Ville : ${order.city}`);
  }

  return parts.join("\n");
}

/** French labels for the admin statuses, for display next to a reference. */
export const ORDER_STATUS_LABELS: Record<OrderSummary["status"], string> = {
  new: "Reçue",
  confirmed: "Confirmée",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};
