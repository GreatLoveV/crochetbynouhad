"use client";

import { useActionState } from "react";
import { Loader2Icon } from "lucide-react";

import { setProductSaleStatus } from "@/app/admin/actions/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { emptyActionMessage } from "@/lib/validation/action-message";
import { strings } from "@/lib/constants/strings";

/**
 * Sold / available, with one explicit button.
 *
 * Deliberately not a checkbox in the product form: saving the form must never
 * change whether a bag is sold.
 */
export function ProductSaleStatus({
  productId,
  isSoldOut,
}: {
  productId: number;
  isSoldOut: boolean;
}) {
  const [state, formAction, pending] = useActionState(
    setProductSaleStatus,
    emptyActionMessage,
  );

  return (
    <form action={formAction} className="flex flex-col gap-3 rounded-2xl border border-border p-4">
      <input type="hidden" name="id" value={productId} />
      <input type="hidden" name="sold" value={isSoldOut ? "false" : "true"} />

      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold">{strings.admin.saleStatus}</h2>
        <Badge variant={isSoldOut ? "secondary" : "outline"}>
          {isSoldOut ? strings.admin.soldOut : strings.admin.saleStatusAvailable}
        </Badge>
      </div>

      <p className="text-xs text-muted-foreground">
        {isSoldOut ? strings.admin.saleStatusSold : strings.admin.markSoldHint}
      </p>

      <Button type="submit" variant="outline" size="sm" disabled={pending}>
        {pending ? <Loader2Icon className="animate-spin" /> : null}
        {isSoldOut ? strings.admin.markAvailable : strings.admin.markSold}
      </Button>

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
