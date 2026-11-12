"use client";

import Link from "next/link";
import { Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";
import { Price } from "@/components/ui/price";
import { fill } from "@/i18n/config";
import { useI18n } from "@/i18n/client";
import type { ProductSummary } from "@/lib/data/products";

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
  const { lang, t, href } = useI18n();
  return (
    <ul className="flex flex-col divide-y divide-border">
      {products.map((product) => (
        <li key={product.id} className="flex gap-4 py-4">
          <div className="w-20 shrink-0 sm:w-24">
            <Photo
              src={product.imageUrl}
              alt=""
              ratio="4/5"
              sizes="96px"
            />
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <Link
              href={href(`/products/${product.slug}`)}
              onClick={onNavigate}
              lang={product.nameLang}
              className="w-fit font-heading text-xl leading-snug decoration-1 underline-offset-4 hover:underline"
            >
              {product.name}
            </Link>
            <p className="text-sm">
              <Price centimes={product.price} lang={lang} />
            </p>
            {/* The reference identifies this exact piece in the order. */}
            <p className="text-xs text-fil">
              {t.product.unique}
              {product.reference ? (
                <>
                  {" "}
                  <bdi>{product.reference}</bdi>
                </>
              ) : null}
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            aria-label={fill(t.cart.remove, { name: product.name })}
            className="-me-2 shrink-0 self-start text-fil hover:text-erreur"
            onClick={() => onRemove(product.id)}
          >
            <Trash2Icon aria-hidden="true" />
          </Button>
        </li>
      ))}
    </ul>
  );
}