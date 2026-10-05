/**
 * WhatsApp links.
 *
 * The shop number lives in NEXT_PUBLIC_WHATSAPP_NUMBER (digits only, with the
 * country code, no "+" and no spaces — e.g. 212612345678).
 */
const RAW_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

/** Digits only, ready to paste into wa.me/<number>. */
export const WHATSAPP_NUMBER = RAW_NUMBER.replace(/\D/g, "");

/**
 * Builds a wa.me deep link with a prefilled message.
 * `message` is URL-encoded for you, so French accents are safe.
 */
export function whatsappUrl(message: string): string {
  const number = WHATSAPP_NUMBER || "0000000000";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
