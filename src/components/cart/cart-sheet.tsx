"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ShoppingBagIcon } from "lucide-react";

import { useCart } from "@/components/cart/cart-provider";
import {
  CartLineRows,
  cartTotal,
} from "@/components/cart/cart-line-rows";
import { useCartProducts } from "@/components/cart/use-cart-products";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Price } from "@/components/ui/price";
import { EmptyState, LoadingState } from "@/components/ui/state";
import { useI18n } from "@/i18n/client";
import { plural } from "@/i18n/format";
import { cn } from "cn";

/**
 * Header cart button + drawer.
 *
 * The drawer is the quick view; /cart is the full page. Both show the same
 * lines and are fed by the same server fetch, so a price change shows up in
 * both at once.
 */
export function CartButton() {
  const { t, dir } = useI18n();
  const { count, isReady } = useCart();
  const [open, setOpen] = useState(false);
  // The badge makes one small loop when a piece is added (not on page load,
  // not on removal). Keying the badge by this counter replays the animation.
  const previous = useRef<number | null>(null);
  const [added, setAdded] = useState(0);
  useEffect(() => {
    if (!isReady) return;
    if (previous.current !== null && count > previous.current) setAdded((n) => n + 1);
    previous.current = count;
  }, [count, isReady]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label={t.nav.cart}
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "relative",
        )}
      >
        <ShoppingBagIcon />
        {/* The badge is only rendered after hydration, so the server HTML and
            the first client render match. */}
        {isReady && count > 0 ? (
          <span
            key={added}
            className={cn(
              "absolute top-1 inset-e-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-the px-1 font-sans text-[0.6875rem] leading-none font-medium text-coton tabular-nums",
              added > 0 && "animate-badge-loop",
            )}
          >
            {count > 99 ? "99+" : count}
          </span>
        ) : null}
      </SheetTrigger>

      {/* Slides in from the end of the line: the right in French, the left
          in Arabic, matching where the cart button sits. */}
      <SheetContent
        side={dir === "rtl" ? "left" : "right"}
        closeLabel={t.common.close}
        className="w-full sm:max-w-md"
      >
        <CartDrawerBody onClose={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

function CartDrawerBody({ onClose }: { onClose: () => void }) {
  const { lang, t } = useI18n();
  const { items, count, isReady, removeItem } = useCart();
  const idsKey = items.map((item) => item.productId).join(",");

  return (
    <>
      <SheetHeader>
        <SheetTitle>{t.cart.title}</SheetTitle>
        <SheetDescription>
          {isReady && count > 0
            ? plural(lang, t.cart.pieces, count)
            : t.cart.emptyHint}
        </SheetDescription>
      </SheetHeader>

      {items.length === 0 ? (
        <EmptyCart onClose={onClose} />
      ) : (
        <DrawerLines
          idsKey={idsKey}
          onClose={onClose}
          onRemove={removeItem}
        />
      )}
    </>
  );
}

function EmptyCart({ onClose }: { onClose: () => void }) {
  const { t } = useI18n();
  return (
    <>
      <EmptyState
        as="h3"
        title={t.cart.empty}
        body={t.cart.emptyHint}
        className="flex-1 justify-center"
        actions={
          <Button variant="outline" onClick={onClose}>
            {t.cart.continueShopping}
          </Button>
        }
      />
    </>
  );
}

function DrawerLines({
  idsKey,
  onClose,
  onRemove,
}: {
  idsKey: string;
  onClose: () => void;
  onRemove: (productId: number) => void;
}) {
  const { lang, t, href } = useI18n();
  const products = useCartProducts(idsKey);

  if (products === null) {
    return <LoadingState label={t.common.loading} className="flex-1" />;
  }

  const total = cartTotal(products);

  return (
    <>
      <div className="flex-1 overflow-y-auto px-5">
        <CartLineRows
          products={products}
          onRemove={onRemove}
          onNavigate={onClose}
        />
      </div>

      <SheetFooter>
        <div className="flex items-baseline justify-between border-t border-border pt-4">
          <span>{t.cart.total}</span>
          <Price centimes={total} lang={lang} className="text-lg font-medium" />
        </div>

        <Button
          className="w-full"
          render={<Link href={href("/checkout")} onClick={onClose} />}
        >
          {t.checkout.title}
        </Button>

        <div className="flex items-center justify-center gap-4">
          <Link
            href={href("/cart")}
            onClick={onClose}
            className="inline-flex min-h-11 items-center text-sm text-the underline decoration-1 underline-offset-4 hover:decoration-2"
          >
            {t.cart.viewPage}
          </Link>
        </div>

        <p className="text-center text-sm text-fil">
          {t.cart.checkoutHint}
        </p>
      </SheetFooter>
    </>
  );
}