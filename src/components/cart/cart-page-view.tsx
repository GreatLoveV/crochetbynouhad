"use client";

import Link from "next/link";
import { ShoppingBagIcon } from "lucide-react";

import { useCart } from "@/components/cart/cart-provider";
import {
  CartLineRows,
  cartTotal,
} from "@/components/cart/cart-line-rows";
import { useCartProducts } from "@/components/cart/use-cart-products";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/i18n/client";
import { plural } from "@/i18n/format";
import { formatPrice } from "@/lib/format/money";

/**
 * The /cart page body.
 *
 * The cart lives in localStorage, so the page shell is a Server Component and
 * only this part is client-side. It reuses the drawer's line list and the same
 * server fetch, so the two can never disagree.
 */
export function CartPageView() {
  const { t, href } = useI18n();
  const { items, count, isReady, removeItem } = useCart();
  const idsKey = items.map((item) => item.productId).join(",");

  // Before hydration localStorage is unknown, so neither state is the truth yet.
  if (!isReady) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        {t.common.loading}
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-5 py-20 text-center">
        <span className="flex size-20 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <ShoppingBagIcon className="size-8" />
        </span>
        <p className="font-heading text-2xl">{t.cart.empty}</p>
        <p className="max-w-sm text-muted-foreground">
          {t.cart.emptyHint}
        </p>
        <Button size="lg" render={<Link href={href("/#boutique")} />}>
          {t.cart.continueShopping}
        </Button>
      </div>
    );
  }

  return (
    <CartPageLines
      idsKey={idsKey}
      count={count}
      removeItem={removeItem}
    />
  );
}

function CartPageLines({
  idsKey,
  count,
  removeItem,
}: {
  idsKey: string;
  count: number;
  removeItem: (productId: number) => void;
}) {
  const { lang, t, href } = useI18n();
  const products = useCartProducts(idsKey);

  if (products === null) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        {t.common.loading}
      </p>
    );
  }

  // A product can disappear between adding it and opening the cart.
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-5 py-20 text-center">
        <p className="font-heading text-2xl">{t.checkout.unavailable}</p>
        <Button size="lg" render={<Link href={href("/#boutique")} />}>
          {t.cart.continueShopping}
        </Button>
      </div>
    );
  }

  const total = cartTotal(products);

  return (
    <>
      <div className="grid gap-10 lg:grid-cols-[1fr_20rem] lg:items-start">
        <div>
          <p className="text-sm text-muted-foreground">
            {plural(lang, t.cart.pieces, count)}
          </p>
          <CartLineRows
            products={products}
            onRemove={removeItem}
          />
          <Button
            variant="ghost"
            className="mt-2"
            render={<Link href={href("/#boutique")} />}
          >
            {t.cart.continueShopping}
          </Button>
        </div>

        {/* Sticky on desktop so the total stays visible while scrolling. */}
        <div className="rounded-3xl bg-card p-6 shadow-soft lg:sticky lg:top-24">
          <h2 className="font-heading text-xl">{t.checkout.summaryTitle}</h2>

          <Separator className="my-4" />

          <ul className="flex flex-col gap-2 text-sm">
            {products.map((product) => (
              <li key={product.id} className="flex justify-between gap-4">
                <span lang={product.nameLang} className="text-muted-foreground">
                  {product.name}
                </span>
                <span className="tabular-nums">
                  <bdi>{formatPrice(product.price, lang)}</bdi>
                </span>
              </li>
            ))}
          </ul>

          <Separator className="my-4" />

          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">
              {t.checkout.totalLabel}
            </span>
            <span className="font-heading text-2xl tabular-nums">
              <bdi>{formatPrice(total, lang)}</bdi>
            </span>
          </div>

          <Button className="mt-5 w-full" size="lg" render={<Link href={href("/checkout")} />}>
            {t.checkout.title}
          </Button>

          <p className="mt-3 text-center text-xs text-muted-foreground">
            {t.checkout.paymentNote}
          </p>
        </div>
      </div>
    </>
  );
}