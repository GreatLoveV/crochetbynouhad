import "server-only";

import { getAdminOrder } from "@/lib/data/admin-orders";
import { formatPrice } from "@/lib/format/money";
import { SITE_URL } from "@/lib/constants/strings";

/**
 * New-order email for Nouhad, through Resend's HTTP API.
 *
 * Deliberately fire-and-forget: the order is already saved by the time this
 * runs, so a missing key, a network error or a bad address must never turn a
 * successful order into an error page. Every failure is swallowed after being
 * logged, and the whole thing is skipped when the env vars are absent.
 *
 * Env:
 *   RESEND_API_KEY      - Resend API key.
 *   ADMIN_NOTIFY_EMAIL  - where the notification goes.
 *   RESEND_FROM         - optional verified sender (defaults to Resend's test
 *                         address, which only delivers to the account owner).
 */
export async function notifyNewOrder(orderId: number): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ADMIN_NOTIFY_EMAIL;
  if (!apiKey || !to) return;

  try {
    const order = await getAdminOrder(orderId);
    if (!order) return;

    const items = order.items
      .map(
        (item) =>
          `- ${item.reference ?? ""} ${item.nameFr} x${item.quantity} — ${formatPrice(
            item.unitPrice * item.quantity,
          )}`,
      )
      .join("\n");

    const text = [
      `Nouvelle commande ${order.reference}`,
      "",
      items,
      "",
      `Total : ${formatPrice(order.total)} (paiement à la livraison)`,
      "",
      `Nom : ${order.customerName}`,
      `Téléphone : ${order.phone}`,
      `Ville : ${order.city}`,
      `Adresse : ${order.address}`,
      order.notes ? `Message : ${order.notes}` : null,
      "",
      `${SITE_URL}/admin/orders/${order.id}`,
    ]
      .filter((line) => line !== null)
      .join("\n");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from:
            process.env.RESEND_FROM ?? "Crochet by Nouhad <onboarding@resend.dev>",
          to,
          subject: `Nouvelle commande ${order.reference}`,
          text,
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    console.error("[notifyNewOrder] could not send the notification", error);
  }
}
