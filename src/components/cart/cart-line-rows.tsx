"use client";

import Image from "next/image";
import Link from "next/link";
import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CartItem } from "@/lib/cart";
import { isOptimizableImageUrl } from "@/lib/images";
import { formatPrice } from "@/lib/money";
import type { ProductSummary } from "@/lib/products";

/**
 * The list of products in the cart.
 *
 * Shared by the drawer and the /cart page so both look and behave the same.
 * Names and prices come from the server (`useCartProducts`); the only thing
 * this reads from the cart is how many of each product the customer wants.
 */

/** Total in centimes, from the server prices — never from anything cached. */
export function cartTotal(
  products: ProductSummary[],
  items: CartItem[],
): number {
  const quantities = new Map(items.map((item) => [item.productId, item.quantity]));
  return products.reduce(
    (sum, product) => sum + product.price * (quantities.get(product.id) ?? 0),
    0,
  );
}

export function CartLineRows({
  products,
  items,
  onQuantityChange,
  onRemove,
  onNavigate,
}: {
  products: ProductSummary[];
  items: CartItem[];
  onQuantityChange: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
  /** The drawer uses this to close itself when a product is clicked. */
  onNavigate?: () => void;
}) {
  const quantities = new Map(items.map((item) => [item.productId, item.quantity]));

  return (
    <ul className="flex flex-col divide-y divide-border">
      {products.map((product) => {
        const quantity = quantities.get(product.id) ?? 0;
        return (
          <li key={product.id} className="flex gap-4 py-4">
            <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-muted">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.nameFr}
                  fill
                  sizes="96px"
                  className="object-cover"
                  unoptimized={!isOptimizableImageUrl(product.imageUrl)}
                />
              ) : null}
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <p className="text-[0.7rem] tracking-[0.18em] text-muted-foreground uppercase">
                {product.categoryNameFr}
              </p>
              <Link
                href={`/products/${product.slug}`}
                onClick={onNavigate}
                className="font-heading text-base leading-tight transition-colors duration-300 ease-soft hover:text-primary"
              >
                {product.nameFr}
              </Link>
              <p className="text-sm text-muted-foreground">
                {formatPrice(product.price)}
              </p>

              <div className="mt-auto flex items-center gap-2 pt-2">
                <div className="flex items-center gap-1 rounded-full border border-border p-0.5">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label="Retirer un article"
                    onClick={() => onQuantityChange(product.id, quantity - 1)}
                  >
                    <MinusIcon />
                  </Button>
                  <span className="w-6 text-center text-sm tabular-nums">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label="Ajouter un article"
                    onClick={() => onQuantityChange(product.id, quantity + 1)}
                  >
                    <PlusIcon />
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Supprimer la ligne"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => onRemove(product.id)}
                >
                  <Trash2Icon />
                </Button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}