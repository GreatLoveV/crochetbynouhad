"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { isOptimizableImageUrl } from "@/lib/constants/images";
import { formatPrice } from "@/lib/format/money";
import type { ProductSummary } from "@/lib/data/products";
import { strings } from "@/lib/constants/strings";

/**
 * The list of products in the cart.
 *
 * Shared by the drawer and the /cart page so both look and behave the same.
 * Names and prices come from the server (`useCartProducts`). Every bag is
 * unique, so a line is one bag: there is nothing to increase, only to remove.
 */

/** Total in centimes, from the server prices — never from anything cached. */
export function cartTotal(products: ProductSummary[]): number {
  return products.reduce((sum, product) => sum + product.price, 0);
}

export function CartLineRows({
  products,
  onRemove,
  onNavigate,
}: {
  products: ProductSummary[];
  onRemove: (productId: number) => void;
  /** The drawer uses this to close itself when a product is clicked. */
  onNavigate?: () => void;
}) {
  return (
    <ul className="flex flex-col divide-y divide-border">
      {products.map((product) => {
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
              {/* The reference identifies this exact piece in the order. */}
              {product.reference ? (
                <p className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
                  {product.reference}
                </p>
              ) : null}

              <div className="mt-auto flex items-center gap-2 pt-2">
                <span className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
                  {strings.product.unique}
                </span>

                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label={`Retirer ${product.nameFr} du panier`}
                  className="ml-auto text-muted-foreground hover:text-destructive"
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