import "server-only";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { fill, localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/fr";
import { formatPrice, formatOrderNumber, formatProductReference } from "@/lib/format/money";

/**
 * Read-only view of a placed order, for the confirmation page.
 *
 * Looked up by the order's random `publicToken`, never by its sequential id,
 * so nobody can walk through /order/confirmation?… and read every order.
 * Name and city are only returned when the caller explicitly asks for them
 * (`includeCustomer`), which the page does only for the browser holding the
 * cookie set when the order was placed.
 */
export type OrderSummary = {
  id: number;
  reference: string;
  total: number;
  status: "new" | "confirmed" | "shipped" | "delivered" | "cancelled";
  lines: {
    /**
     * Snapshot taken at checkout, in French: a rename never rewrites a sent
     * receipt. `null` only on very old rows; the page shows a fallback.
     */
    name: string | null;
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

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getOrderSummaryByToken(
  token: string,
  options: { includeCustomer?: boolean } = {},
): Promise<OrderSummary | null> {
  // Anything that is not a UUID would only make Postgres throw.
  if (!UUID.test(token)) return null;

  const order = await db.query.orders.findFirst({
    where: eq(orders.publicToken, token),
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
      name: item.productName,
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
 * page, in the language the customer ordered in. Built from the SAVED order,
 * so it always matches what Nouhad will see.
 */
export function buildOrderWhatsappMessage(
  order: OrderSummary,
  siteUrl: string,
  lang: Locale,
  t: Dictionary,
): string {
  const lines = order.lines.flatMap((line) => {
    const name = line.name ?? t.order.itemFallback;
    const price = formatPrice(line.unitPrice * line.quantity, lang);
    const head = `- ${line.reference} ${name} x${line.quantity}, ${price}`;
    return line.slug
      ? [head, `  ${siteUrl}${localePath(lang, `/products/${line.slug}`)}`]
      : [head];
  });

  const parts = [
    fill(t.whatsapp.orderIntro, { reference: order.reference }),
    ...lines,
    fill(t.whatsapp.orderTotal, { total: formatPrice(order.total, lang) }),
  ];

  if (order.customerName && order.city) {
    parts.push(fill(t.whatsapp.orderCustomer, { name: order.customerName, city: order.city }));
  }

  return parts.join("\n");
}
