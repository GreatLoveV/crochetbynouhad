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

/** Converts what a customer types in MAD (250 or "250,50") into centimes. */
export function madToCentimes(input: string | number): number | null {
  const normalized =
    typeof input === "number" ? String(input) : input.replace(",", ".").trim();
  const value = Number.parseFloat(normalized);
  if (!Number.isFinite(value) || value < 0) return null;
  return Math.round(value * 100);
}
