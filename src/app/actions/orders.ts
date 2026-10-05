"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createOrder, ProductUnavailableError } from "@/db/place-order";
import { checkoutSchema } from "@/lib/checkout";
import { strings } from "@/lib/strings";

export type OrderFormState = {
  status: "idle" | "invalid" | "error";
  /** One message per field, keyed by input name, ready to render. */
  fieldErrors?: Record<string, string>;
  message?: string;
};

export const emptyOrderFormState: OrderFormState = { status: "idle" };

/**
 * Places an order from the checkout form.
 *
 * The browser sends product ids and quantities only: names, prices and the
 * total are all decided by the server (`createOrder`). See `@/db/place-order`.
 */
export async function placeOrder(
  _previous: OrderFormState,
  formData: FormData,
): Promise<OrderFormState> {
  const parsed = checkoutSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    city: formData.get("city"),
    address: formData.get("address"),
    notes: formData.get("notes") ?? "",
    cart: formData.get("cart"),
  });

  if (!parsed.success) {
    return {
      status: "invalid",
      fieldErrors: toFieldErrors(parsed.error),
      message: strings.checkout.fixErrors,
    };
  }

  const { name, phone, city, address, notes, cart } = parsed.data;

  let orderId: number;
  try {
    orderId = await createOrder({ name, phone, city, address, notes, cart });
  } catch (error) {
    if (error instanceof ProductUnavailableError) {
      return { status: "error", message: strings.checkout.unavailable };
    }
    console.error("[placeOrder] could not save the order", error);
    return { status: "error", message: strings.checkout.submitError };
  }

  // Outside the try/catch on purpose: redirect() works by throwing, and we do
  // not want to catch it and show an error instead of moving on.
  redirect(`${strings.order.confirmationPath}?order=${orderId}`);
}

/** Keeps the first message per field so the form shows one error at a time. */
function toFieldErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? "cart");
    fieldErrors[field] ??= issue.message;
  }
  return fieldErrors;
}