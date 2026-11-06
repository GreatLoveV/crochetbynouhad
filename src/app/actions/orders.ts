"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  createOrder,
  ProductReservedError,
  ProductUnavailableError,
} from "@/lib/data/place-order";
import { checkoutSchema } from "@/lib/validation/checkout";
import { notifyNewOrder } from "@/lib/integrations/notify";
import { type OrderFormState } from "@/lib/validation/order-form";
import { strings } from "@/lib/constants/strings";

/**
 * Places an order from the checkout form.
 *
 * The browser sends product ids and quantities only: names, prices and the
 * total are all decided by the server (`createOrder`). See `@/lib/data/place-order`.
 */
export async function placeOrder(
  _previous: OrderFormState,
  formData: FormData,
): Promise<OrderFormState> {
  // Read once so both the validation and the echoed values use the same data.
  const values = {
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    city: String(formData.get("city") ?? ""),
    address: String(formData.get("address") ?? ""),
    notes: String(formData.get("notes") ?? ""),
  };

  const parsed = checkoutSchema.safeParse({
    ...values,
    cart: formData.get("cart"),
  });

  if (!parsed.success) {
    return {
      status: "invalid",
      fieldErrors: toFieldErrors(parsed.error),
      message: strings.checkout.fixErrors,
      values,
    };
  }

  const { name, phone, city, address, notes, cart } = parsed.data;

  let orderId: number;
  try {
    orderId = await createOrder({ name, phone, city, address, notes, cart });
  } catch (error) {
    if (error instanceof ProductReservedError) {
      return { status: "error", message: strings.checkout.reserved, values };
    }
    if (error instanceof ProductUnavailableError) {
      return { status: "error", message: strings.checkout.unavailable, values };
    }
    console.error("[placeOrder] could not save the order", error);
    return { status: "error", message: strings.checkout.submitError, values };
  }

  // Best-effort: a broken notification must never block a saved order.
  await notifyNewOrder(orderId);

  // Lets the confirmation page show the customer their own name and city
  // without exposing them to anyone who guesses an order id.
  const cookieStore = await cookies();
  cookieStore.set("cbn-order", String(orderId), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });

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