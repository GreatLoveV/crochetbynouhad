/**
 * Cart constants shared by the browser store and the server.
 *
 * This file must stay free of React and of browser APIs: the checkout server
 * action imports `MAX_QUTY_PER_LINE` from here, and a `"use client"` module
 * would give it a client reference instead of the real number.
 */

export type CartItem = {
  productId: number;
  quantity: number;
};

/** Upper bound per line, just to stop silly quantities from typos. */
export const MAX_QUTY_PER_LINE = 20;

/** Key used in localStorage. Bump to invalidate everyone's saved cart. */
export const CART_STORAGE_KEY = "cbn-cart-v1";