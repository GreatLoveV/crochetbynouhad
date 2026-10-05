import { z } from "zod";
import { MAX_QUTY_PER_LINE } from "@/lib/cart";

/**
 * Everything the checkout form sends, validated on the server.
 *
 * The browser is free to send anything, so this is the only thing standing
 * between a request and the `orders` table.
 */

/** The same per-line cap the browser cart enforces. */
const MAX_QUANTITY = MAX_QUTY_PER_LINE;

/** One line of the cart: a product id and how many. Never a price. */
export const cartLineSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1).max(MAX_QUANTITY),
});

/**
 * Parses the `cart` hidden field. Two copies of the same product are merged so
 * one product can never end up on two separate lines of the order.
 */
export const cartFieldSchema = z
  .string()
  .min(1, "Votre panier est vide.")
  .transform((raw, ctx) => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      ctx.addIssue({ code: "custom", message: "Panier illisible." });
      return z.NEVER;
    }

    const result = z.array(cartLineSchema).max(50).safeParse(parsed);
    if (!result.success) {
      ctx.addIssue({ code: "custom", message: "Panier invalide." });
      return z.NEVER;
    }

    const merged = new Map<number, number>();
    for (const line of result.data) {
      const wanted = (merged.get(line.productId) ?? 0) + line.quantity;
      merged.set(line.productId, Math.min(wanted, MAX_QUANTITY));
    }
    return Array.from(merged, ([productId, quantity]) => ({ productId, quantity }));
  })
  .refine((lines) => lines.length > 0, "Votre panier est vide.");

export const checkoutSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Indiquez votre nom.")
    .max(80, "Nom trop long (80 caractères maximum)."),
  // Moroccan numbers are written many ways (+212 6 12 34 56 78, 0612345678…),
  // so we accept the punctuation and normalise it ourselves.
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s().-]{9,20}$/, "Numéro de téléphone invalide.")
    .refine(
      (value) => value.replace(/\D/g, "").length >= 9,
      "Numéro de téléphone trop court.",
    ),
  city: z
    .string()
    .trim()
    .min(2, "Indiquez votre ville.")
    .max(60, "Nom de ville trop long."),
  address: z
    .string()
    .trim()
    .min(5, "Indiquez votre adresse de livraison.")
    .max(300, "Adresse trop longue (300 caractères maximum)."),
  notes: z
    .string()
    .trim()
    .max(500, "Message trop long (500 caractères maximum).")
    .optional(),
  cart: cartFieldSchema,
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type CheckoutLine = z.infer<typeof cartLineSchema>;

/** Human-friendly order reference, e.g. `CB-1042`. */
export function orderReference(id: number): string {
  return `CB-${id}`;
}

/** Keeps only the digits, e.g. `+212 6 12 34 56 78` becomes `212612345678`. */
export function normalizePhone(value: string): string {
  return value.replace(/\D/g, "");
}