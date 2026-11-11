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
 * Every order and every question goes through WhatsApp, so a missing or
 * placeholder number would silently break the whole shop. A production build
 * refuses to run instead. Server-only, like the SITE_URL guard in strings.ts:
 * throwing in the browser would take every page down.
 */
if (
  typeof window === "undefined" &&
  process.env.NODE_ENV === "production" &&
  (!/^212[5-7]\d{8}$/.test(WHATSAPP_NUMBER) ||
    // The README's placeholder looks valid but reaches nobody.
    WHATSAPP_NUMBER === "212600000000")
) {
  throw new Error(
    "NEXT_PUBLIC_WHATSAPP_NUMBER is missing or not a Moroccan number " +
      "(digits only, e.g. 212612345678). Set it before building.",
  );
}

/**
 * Builds a wa.me deep link to an arbitrary number with a prefilled message.
 * `number` is reduced to its digits, so either format works.
 * `message` is URL-encoded for you, so French accents are safe.
 */
export function whatsappUrlTo(number: string, message: string): string {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/** Same, but to the shop's own number. */
export function whatsappUrl(message: string): string {
  return whatsappUrlTo(WHATSAPP_NUMBER, message);
}

/**
 * Normalises a Moroccan phone number to the international form wa.me expects:
 * `0612345678`, `+212612345678` and `00212612345678` all become `212612345678`.
 * Anything already international (or unrecognised) is returned digit-only.
 */
export function normalizeMoroccanPhone(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  // International call prefix written as "00".
  if (digits.startsWith("00")) digits = digits.slice(2);
  // Already has the Moroccan country code.
  if (digits.startsWith("212")) return digits;
  // Local form starting with 0: swap the 0 for the country code.
  if (digits.startsWith("0")) return `212${digits.slice(1)}`;
  // No idea what this is; do not invent a country code.
  return digits;
}
