"use client";

import Link from "next/link";

import { useCart } from "@/components/cart/cart-provider";
import { CartLineRows, cartTotal } from "@/components/cart/cart-line-rows";
import { useCartProducts } from "@/components/cart/use-cart-products";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { Price } from "@/components/ui/price";
import { EmptyState, LoadingState } from "@/components/ui/state";
import { useI18n } from "@/i18n/client";
import { plural } from "@/i18n/format";

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
  if (!isReady) return <LoadingState label={t.common.loading} />;

  if (items.length === 0) {
    return (
      <EmptyState
        title={t.cart.empty}
        body={t.cart.emptyHint}
        actions={<Button render={<Link href={href("/#boutique")} />}>{t.cart.continueShopping}</Button>}
      />
    );
  }

  return <CartPageLines idsKey={idsKey} count={count} removeItem={removeItem} />;
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

  if (products === null) return <LoadingState label={t.common.loading} />;

  // A product can disappear between adding it and opening the cart.
  if (products.length === 0) {
    return (
      <Notice
        tone="error"
        title={t.checkout.unavailable}
        action={
          <Button variant="outline" size="sm" render={<Link href={href("/#boutique")} />}>
            {t.cart.continueShopping}
          </Button>
        }
      />
    );
  }

  const total = cartTotal(products);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-start lg:gap-16">
      <div>
        <p className="text-fil">{plural(lang, t.cart.pieces, count)}</p>
        <CartLineRows products={products} onRemove={removeItem} />
        <Button variant="link" className="mt-4" render={<Link href={href("/#boutique")} />}>
          {t.cart.continueShopping}
        </Button>
      </div>

      {/* Sticky on desktop so the total stays visible while scrolling. */}
      <aside aria-labelledby="cart-summary" className="bg-lin p-6 lg:sticky lg:top-28">
        <h2 id="cart-summary" className="text-2xl">
          {t.checkout.summaryTitle}
        </h2>

        <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-trait pt-4">
          <span>{t.checkout.totalLabel}</span>
          <Price centimes={total} lang={lang} className="text-xl font-medium" />
        </div>

        <Button className="mt-6 w-full" render={<Link href={href("/checkout")} />}>
          {t.checkout.title}
        </Button>

        <p className="mt-3 text-sm text-fil">{t.checkout.paymentNote}</p>
      </aside>
    </div>
  );
}
