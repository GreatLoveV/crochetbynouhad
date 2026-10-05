import { strings } from "@/lib/strings";
import type { OrderStatus } from "@/lib/admin-orders";

/**
 * Status shown as words, not colours: Nouhad reads the list first and the badge
 * second, and colour alone is not information.
 */
export function orderStatusLabel(status: OrderStatus): string {
  return strings.orderStatus[status];
}

/** Neutral tone per status, using the existing muted/surface palette. */
const TONE: Record<OrderStatus, string> = {
  new: "bg-primary/10 text-primary",
  confirmed: "bg-primary/15 text-primary",
  shipped: "bg-primary/20 text-primary",
  delivered: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/10 text-destructive",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${TONE[status]}`}
    >
      {orderStatusLabel(status)}
    </span>
  );
}