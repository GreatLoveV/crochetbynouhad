"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";

import {
  addToCart,
  cartStore,
  clearCart,
  removeFromCart,
  type CartItem,
} from "@/components/cart/cart-storage";

/**
 * React context around the cart store, so components can call
 * `useCart()` instead of importing the storage helpers directly.
 *
 * The cart lives in the BROWSER only, and only as a list of product ids.
 * Names and prices are re-fetched from the database every time the cart is
 * rendered, so editing localStorage can never change a price.
 */
type CartContextValue = {
  items: CartItem[];
  /** Number of bags in the cart — what the header badge shows. */
  count: number;
  /** False until the browser has taken over from the server render. */
  isReady: boolean;
  addItem: (productId: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot,
  );

  // True in the browser, false during the server render / first client render.
  const isReady = useSyncExternalStore(
    cartStore.subscribe,
    () => true,
    () => false,
  );

  const value = useMemo(
    () => ({
      items,
      count: items.length,
      isReady,
      addItem: addToCart,
      removeItem: removeFromCart,
      clearCart,
    }),
    [items, isReady],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export type { CartItem } from "@/components/cart/cart-storage";

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside <CartProvider>");
  }
  return context;
}
