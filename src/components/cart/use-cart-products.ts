"use client";

import { useEffect, useState } from "react";

import { fetchCartProducts } from "@/app/actions/cart";
import type { ProductSummary } from "@/lib/products";

/**
 * Asks the server for the current data behind a set of cart ids.
 *
 * Returns `null` while the answer is in flight, so a caller can show a
 * placeholder instead of flashing an empty cart. Prices and names always come
 * from PostgreSQL — the browser only ever holds ids.
 *
 * `idsKey` is the comma-joined id list: a plain array would be a new reference
 * on every render and would restart the request forever.
 */
export function useCartProducts(idsKey: string): ProductSummary[] | null {
  const [loaded, setLoaded] = useState<{
    key: string;
    rows: ProductSummary[];
  } | null>(null);

  useEffect(() => {
    const ids = idsKey ? idsKey.split(",").map(Number) : [];
    let cancelled = false;

    fetchCartProducts(ids).then(
      (rows) => {
        if (!cancelled) setLoaded({ key: idsKey, rows });
      },
      () => {
        if (!cancelled) setLoaded({ key: idsKey, rows: [] });
      },
    );

    return () => {
      // The cart changed or the component unmounted before the answer landed.
      cancelled = true;
    };
  }, [idsKey]);

  // `null` whenever the visible answer belongs to a previous set of ids.
  return loaded?.key === idsKey ? loaded.rows : null;
}