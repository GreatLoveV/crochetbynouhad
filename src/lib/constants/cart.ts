/**
 * Cart constants shared by the browser store and the server.
 *
 * This file must stay free of React and of browser APIs: the checkout server
 * action imports from here, and a `"use client"` module would give it a client
 * reference instead of the real value.
 */

/** Every bag is one of a kind, so a cart line is just which bag. */
export type CartItem = {
  productId: number;
};

/** More bags than anyone orders at once; stops a malformed cart early. */
export const MAX_CART_ITEMS = 20;

/** Key used in localStorage. Bump to invalidate everyone's saved cart. */
export const CART_STORAGE_KEY = "cbn-cart-v1";
