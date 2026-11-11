import { intlLocale, type Locale } from "@/i18n/config";

/**
 * Prices are stored in the database as an integer number of CENTIMES of MAD
 * (25000 = 250.00 MAD). Always format through `formatPrice` so the /100
 * conversion lives in exactly one place.
 *
 * `lang` picks the writing: `1.250,00 MAD` in French, `1.250,00 د.م.‏` in
 * Arabic (with Western digits). The admin and notifications use French.
 */
export function formatPrice(centimes: number, lang: Locale = "fr"): string {
  return new Intl.NumberFormat(intlLocale[lang], {
    style: "currency",
    currency: "MAD",
    minimumFractionDigits: 2,
  }).format(centimes / 100);
}

export function formatOrderNumber(id: number): string {
  return `CMD-${String(id).padStart(4, "0")}`;
}

/** `CN-0014`: the id of a handmade piece, zero-padded to four digits. */
export function formatProductReference(id: number): string {
  return `CN-${String(id).padStart(4, "0")}`;
}

/**
 * Converts a price typed in MAD into centimes: `250`, `250,50`, `250.5` and
 * `1 250` (spaces as thousands separators) are accepted. Anything else —
 * `250abc`, `1.250,00`, `-5` — is refused with `null` rather than guessed,
 * because a wrong guess is a wrong price on a real bag.
 */
export function madToCentimes(input: string | number): number | null {
  const raw = typeof input === "number" ? String(input) : input;
  const compact = raw.replace(/[\s\u00a0\u202f]/g, "");
  const match = /^(\d+)(?:[.,](\d{1,2}))?$/.exec(compact);
  if (!match) return null;
  const whole = Number(match[1]);
  const fraction = Number((match[2] ?? "").padEnd(2, "0"));
  const centimes = whole * 100 + fraction;
  return Number.isSafeInteger(centimes) ? centimes : null;
}