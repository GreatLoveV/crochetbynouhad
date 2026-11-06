/**
 * Prices are stored in the database as an integer number of CENTIMES of MAD
 * (25000 = 250.00 MAD). Always format through `formatPrice` so the /100
 * conversion lives in exactly one place.
 */
export function formatPrice(centimes: number): string {
  return new Intl.NumberFormat("fr-MA", {
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
 * Converts what a customer types in MAD (250 or "250,50") into centimes.
 */
export function madToCentimes(input: string | number): number | null {
  const normalized =
    typeof input === "number" ? String(input) : input.replace(",", ".").trim();
  const value = Number.parseFloat(normalized);
  if (!Number.isFinite(value) || value < 0) return null;
  return Math.round(value * 100);
}