"use server";

import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { after } from "next/server";
import { redirect } from "next/navigation";
import { and, eq, gt, sql } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { orders } from "@/db/schema";

import {
  createOrder,
  ProductReservedError,
  ProductUnavailableError,
} from "@/lib/data/place-order";
import { checkoutSchema, normalizePhone } from "@/lib/validation/checkout";
import {
  clientIpFrom,
  isRateLimited,
  recordAttempt,
} from "@/lib/security/rate-limit";
import { notifyNewOrder } from "@/lib/integrations/notify";
import { type OrderFormState } from "@/lib/validation/order-form";
import { strings } from "@/lib/constants/strings";

/**
 * Spam limits. Every order instantly takes its bags off the shop, so without
 * these a script could "sell out" the whole collection with fake orders.
 * Generous for a real customer, who places one order and talks on WhatsApp.
 */
const MAX_ORDERS_PER_PHONE_PER_HOUR = 3;
const MAX_ORDERS_PER_IP_PER_HOUR = 5;
const HOUR = 60 * 60;

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

  // Honeypot: a field hidden from people. Only a bot fills it in. Answer with
  // the generic error so the bot learns nothing.
  if (String(formData.get("website") ?? "") !== "") {
    return { status: "error", message: strings.checkout.submitError, values };
  }

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

  const ip = clientIpFrom(await headers());
  const ipKey = `order:ip:${ip}`;
  if (
    (await countRecentOrdersForPhone(phone)) >= MAX_ORDERS_PER_PHONE_PER_HOUR ||
    (await isRateLimited(ipKey, MAX_ORDERS_PER_IP_PER_HOUR, HOUR))
  ) {
    return { status: "error", message: strings.checkout.tooMany, values };
  }

  let order: { id: number; publicToken: string };
  try {
    order = await createOrder({ name, phone, city, address, notes, cart });
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

  await recordAttempt(ipKey);

  // The bags just ordered are now sold: refresh the pages that show them.
  revalidatePath("/");
  revalidatePath("/products/[slug]", "page");

  // Sent after the response, so the customer is not kept waiting on the
  // email. Best-effort: a broken notification never affects a saved order.
  const orderId = order.id;
  after(() => notifyNewOrder(orderId));

  // Lets the confirmation page show the customer their own name and city,
  // and empty their cart, only in the browser that placed the order.
  const cookieStore = await cookies();
  cookieStore.set("cbn-order", order.publicToken, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });

  // Outside the try/catch on purpose: redirect() works by throwing, and we do
  // not want to catch it and show an error instead of moving on.
  // The link carries the random token, never the sequential id.
  redirect(`${strings.order.confirmationPath}?t=${order.publicToken}`);
}

/** Orders placed from this phone (in its stored, normalised form) in the last hour. */
async function countRecentOrdersForPhone(phone: string): Promise<number> {
  const [row] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(orders)
    .where(
      and(
        eq(orders.phone, normalizePhone(phone)),
        gt(orders.createdAt, sql`now() - make_interval(secs => ${HOUR})`),
      ),
    );
  return row?.total ?? 0;
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