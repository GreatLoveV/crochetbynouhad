import { z } from "zod";
import { MAX_CART_ITEMS } from "@/lib/constants/cart";

/**
 * Everything the checkout form sends, validated on the server.
 *
 * The browser is free to send anything, so this is the only thing standing
 * between a request and the `orders` table.
 *
 * Messages are codes (`nameShort`, `phoneInvalid`…), not sentences: the
 * action turns them into the visitor's language with the `checkout.errors`
 * section of the dictionary.
 */

/**
 * One line of the cart: which bag. Never a price, never a quantity — every bag
 * is one of a kind. (An older browser cart may still send `quantity`; unknown
 * keys are dropped.)
 */
export const cartLineSchema = z.object({
  productId: z.number().int().positive(),
});

/**
 * Parses the `cart` hidden field. A bag listed twice is kept once.
 */
export const cartFieldSchema = z
  .string()
  .min(1, "cartEmpty")
  .transform((raw, ctx) => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      ctx.addIssue({ code: "custom", message: "cartUnreadable" });
      return z.NEVER;
    }

    const result = z.array(cartLineSchema).max(MAX_CART_ITEMS).safeParse(parsed);
    if (!result.success) {
      ctx.addIssue({ code: "custom", message: "cartInvalid" });
      return z.NEVER;
    }

    const ids = new Set(result.data.map((line) => line.productId));
    return Array.from(ids, (productId) => ({ productId }));
  })
  .refine((lines) => lines.length > 0, "cartEmpty");

export const checkoutSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "nameShort")
    .max(80, "nameLong"),
  // Moroccan mobiles are written many ways (0612345678, +212 6 12 34 56 78,
  // 00212612345678). We accept all of them and check the normalised 212… form.
  phone: z
    .string()
    .trim()
    .min(1, "phoneMissing")
    .refine((value) => isValidMoroccanPhone(value), "phoneInvalid"),
  city: z
    .string()
    .trim()
    .min(2, "cityShort")
    .max(60, "cityLong"),
  address: z
    .string()
    .trim()
    .min(5, "addressShort")
    .max(300, "addressLong"),
  notes: z
    .string()
    .trim()
    .max(500, "notesLong")
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

/**
 * One stored form for every writing of a Moroccan mobile:
 * `06 12 34 56 78`, `+212 6 12 34 56 78` and `00212612345678` all become
 * `212612345678`. Orders are counted per phone for spam protection, so the
 * same number must always look the same.
 */
export function normalizePhone(value: string): string {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  else if (digits.startsWith("0") && digits.length === 10) {
    digits = `212${digits.slice(1)}`;
  }
  return digits;
}

/**
 * True for a Moroccan mobile in any of the common writings:
 * `0612345678`, `+212612345678`, `00212612345678`. Normalised, they all become
 * `2126xxxxxxxx` / `2127xxxxxxxx`. Kept here (not in `whatsapp.ts`) so no client
 * bundle pulls in the WhatsApp env var just to validate a phone number.
 */
export function isValidMoroccanPhone(value: string): boolean {
  return /^212[67]\d{8}$/.test(normalizePhone(value));
}