import Link from "next/link";

import { getAdminOrders, getOrderStatusCounts } from "@/lib/data/admin-orders";
import { formatPrice } from "@/lib/format/money";
import { ORDER_STATUSES } from "@/lib/constants/order-statuses";
import { orderStatusLabel } from "@/components/admin/order-status-badge";
import { requireAdmin } from "@/lib/auth/admin";
import { strings } from "@/lib/constants/strings";

/** ISO date, rendered by the server to keep the list free of client JS. */
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Casablanca",
  }).format(date);
}

export default async function AdminOrdersPage() {
  await requireAdmin();

  const [orders, counts] = await Promise.all([
    getAdminOrders(),
    getOrderStatusCounts(),
  ]);

  const toHandle = counts.new + counts.confirmed;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">{strings.admin.orders}</h1>
        <p className="text-sm text-muted-foreground">
          {toHandle > 0
            ? `${toHandle} commande${toHandle > 1 ? "s" : ""} à traiter`
            : "Rien à traiter."}
        </p>
      </div>

      <ul className="flex flex-wrap gap-2">
        {ORDER_STATUSES.map((status) => (
          <li
            key={status}
            className="flex items-center gap-2 rounded-full border border-border px-3 py-1 text-sm"
          >
            {orderStatusLabel(status)}
            <span className="tabular-nums text-muted-foreground">
              {counts[status]}
            </span>
          </li>
        ))}
      </ul>

      {orders.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          {strings.admin.noOrders}
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/admin/orders/${order.id}`}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-border px-4 py-3 transition-colors hover:bg-muted/50"
              >
                <span className="font-medium tabular-nums">
                  {order.reference}
                </span>
                <span className="text-sm">{order.customerName}</span>
                <span className="text-sm text-muted-foreground">
                  {order.city} · {order.pieceCount} pièce
                  {order.pieceCount > 1 ? "s" : ""}
                </span>
                <span className="text-sm text-muted-foreground">
                  {formatDate(order.createdAt)}
                </span>
                <span className="ms-auto font-semibold tabular-nums">
                  {formatPrice(order.total)}
                </span>
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs">
                  {orderStatusLabel(order.status)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}