"use client";

/**
 * The browser side of the cart: a tiny external store over localStorage.
 *
 * Why not just `useState` + `useEffect`? The cart has to be read AFTER the
 * page hydrates (localStorage does not exist on the server, and reading it
 * during render would make the server HTML disagree with the first client
 * render). `useSyncExternalStore` is built for exactly this: the server
 * snapshot is the empty cart, the browser snapshot is the saved cart.
 *
 * Only product ids are stored — never names or prices. Every bag is unique,
 * so a bag is either in the cart or not; there is no quantity.
 */

import { CART_STORAGE_KEY, MAX_CART_ITEMS, type CartItem } from "@/lib/constants/cart";

export { CART_STORAGE_KEY, type CartItem };

/** Stable reference so the "server snapshot" never looks like a new array. */
const EMPTY_CART: CartItem[] = [];

/**
 * localStorage content, read once and cached. Reading it on every render would
 * be slow and would return a new array each time, which useSyncExternalStore
 * treats as a change.
 */
let cache: CartItem[] | null = null;

const listeners = new Set<() => void>();

/**
 * Defensive parse: localStorage can hold anything, or be missing entirely.
 * Older carts stored `{ productId, quantity }`; the quantity is simply ignored.
 */
function parse(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const seen = new Set<number>();
    return parsed.flatMap((entry) => {
      if (typeof entry !== "object" || entry === null) return [];
      const { productId } = entry as Record<string, unknown>;
      if (typeof productId !== "number" || !Number.isInteger(productId)) return [];
      if (seen.has(productId)) return [];
      seen.add(productId);
      return [{ productId }];
    }).slice(0, MAX_CART_ITEMS);
  } catch {
    // Private mode / corrupted value: start from an empty cart.
    return [];
  }
}

function readBrowserCart(): CartItem[] {
  cache ??= parse(window.localStorage.getItem(CART_STORAGE_KEY));
  return cache;
}

/** Tells React that the stored cart changed. */
function notify() {
  for (const listener of listeners) listener();
}

function write(next: CartItem[]) {
  cache = next;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage full or blocked (private mode): the cart still works for this
    // page view, it just will not survive a refresh.
  }
  notify();
}

/** useSyncExternalStore: which snapshot to read. */
export const cartStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    // Another tab changed the cart: drop our cache and re-read.
    const onStorage = () => {
      cache = null;
      listener();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  },
  getSnapshot: readBrowserCart,
  // Rendered on the server (and for the very first client render): no cart yet.
  getServerSnapshot: () => EMPTY_CART,
};

/* ---------------------------------------------------------------- mutations */

/** Adds a bag. Adding one that is already there changes nothing. */
export function addToCart(productId: number) {
  const current = readBrowserCart();
  if (current.some((item) => item.productId === productId)) return;
  if (current.length >= MAX_CART_ITEMS) return;
  write([...current, { productId }]);
}

export function removeFromCart(productId: number) {
  write(readBrowserCart().filter((item) => item.productId !== productId));
}

export function clearCart() {
  write([]);
}
