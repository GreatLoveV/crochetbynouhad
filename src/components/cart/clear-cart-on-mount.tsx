"use client";

import { useEffect } from "react";

import { useCart } from "@/components/cart/cart-provider";

/**
 * Empties the cart once the customer reaches the confirmation page.
 *
 * A server action cannot reach localStorage, so the clearing has to happen in
 * the browser. Mounting this only on the confirmation page means the cart is
 * emptied after a successful order and never otherwise.
 */
export function ClearCartOnMount() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return null;
}