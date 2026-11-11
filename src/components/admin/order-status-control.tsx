"use client";

import { useActionState } from "react";
import { Loader2Icon } from "lucide-react";

import { updateOrderStatus } from "@/app/admin/actions/orders";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/constants/order-statuses";
import { Button } from "@/components/ui/button";
import { orderStatusLabel } from "@/components/admin/order-status-badge";
import { emptyActionMessage } from "@/lib/validation/action-message";
import { strings } from "@/lib/constants/strings";

/**
 * Status dropdown plus a save button: nothing changes until Nouhad confirms, so
 * a mis-click cannot cancel a real order. A refusal (e.g. reviving an order
 * whose bag was sold again) is shown under the button.
 */
export function OrderStatusControl({
  orderId,
  status,
}: {
  orderId: number;
  status: OrderStatus;
}) {
  const [state, formAction, pending] = useActionState(
    updateOrderStatus,
    emptyActionMessage,
  );

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="id" value={orderId} />

      <div className="flex flex-wrap items-end gap-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="status" className="text-sm font-medium">
            {strings.admin.orderStatus}
          </label>
          <select
            id="status"
            name="status"
            defaultValue={status}
            className="h-11 rounded-xl border border-input bg-card px-3.5 text-sm transition-all duration-300 ease-soft outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
          >
            {ORDER_STATUSES.map((option) => (
              <option key={option} value={option}>
                {orderStatusLabel(option)}
              </option>
            ))}
          </select>
        </div>

        <Button type="submit" disabled={pending}>
          {pending ? <Loader2Icon className="animate-spin" /> : null}
          {strings.admin.save}
        </Button>
      </div>

      {state.error ? (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      ) : state.ok ? (
        <p role="status" className="text-sm text-muted-foreground">
          {state.ok}
        </p>
      ) : null}
    </form>
  );
}
