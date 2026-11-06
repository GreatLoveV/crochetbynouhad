import { z } from "zod";
import { MAX_QUTY_PER_LINE } from "@/lib/constants/cart";

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
  // Moroccan mobiles are written many ways (0612345678, +212 6 12 34 56 78,
  // 00212612345678). We accept all of them and check the normalised 212… form.
  phone: z
    .string()
    .trim()
    .min(1, "Indiquez votre numéro de téléphone.")
    .refine(
      (value) => isValidMoroccanPhone(value),
      "Numéro de téléphone invalide (ex. 06 12 34 56 78).",
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

/**
 * Human-friendly order number, e.g. `CMD-0012`.
 *
 * Kept as a re-export so existing imports keep working while there is a single
 * formatter (`formatOrderNumber` in `@/lib/format/money`).
 */
export { formatOrderNumber as orderReference } from "@/lib/format/money";

/** Keeps only the digits, e.g. `+212 6 12 34 56 78` becomes `212612345678`. */
export function normalizePhone(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * True for a Moroccan mobile in any of the common writings:
 * `0612345678`, `+212612345678`, `00212612345678`. Normalised, they all become
 * `2126xxxxxxxx` / `2127xxxxxxxx`. Kept here (not in `whatsapp.ts`) so no client
 * bundle pulls in the WhatsApp env var just to validate a phone number.
 */
export function isValidMoroccanPhone(value: string): boolean {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  else if (digits.startsWith("0") && digits.length === 10) {
    digits = `212${digits.slice(1)}`;
  }
  return /^212[67]\d{8}$/.test(digits);
}