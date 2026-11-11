"use client";

import Link from "next/link";
import { useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/i18n/client";
import { plural } from "@/i18n/format";
import { formatPrice } from "@/lib/format/money";
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

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label={t.nav.cart}
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "relative text-foreground/80 hover:text-accent-foreground",
        )}
      >
        <ShoppingBagIcon />
        {/* The badge is only rendered after hydration, so the server HTML and
            the first client render match. */}
        {isReady && count > 0 ? (
          <span className="absolute -top-0.5 -inset-e-0.5 flex size-5 items-center justify-center rounded-full bg-primary text-[0.7rem] font-semibold text-primary-foreground tabular-nums">
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
      <div className="flex flex-1 flex-col items-center gap-4 py-16 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <ShoppingBagIcon className="size-7" />
        </span>
        <p className="text-muted-foreground">{t.cart.empty}</p>
        <p className="max-w-56 text-sm text-muted-foreground/80">
          {t.cart.emptyHint}
        </p>
      </div>
      <SheetFooter>
        <Button className="w-full" size="lg" onClick={onClose}>
          {t.cart.continueShopping}
        </Button>
      </SheetFooter>
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
    return (
      <p className="flex-1 py-8 text-center text-sm text-muted-foreground">
        {t.common.loading}
      </p>
    );
  }

  const total = cartTotal(products);

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6">
        <CartLineRows
          products={products}
          onRemove={onRemove}
          onNavigate={onClose}
        />
      </div>

      <SheetFooter>
        <Separator className="mb-2" />
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">
            {t.cart.total}
          </span>
          <span className="font-heading text-xl tabular-nums">
            <bdi>{formatPrice(total, lang)}</bdi>
          </span>
        </div>

        <Button
          className="w-full"
          size="lg"
          render={<Link href={href("/checkout")} onClick={onClose} />}
        >
          {t.checkout.title}
        </Button>

        <div className="flex items-center justify-center gap-4">
          <Link
            href={href("/cart")}
            onClick={onClose}
            className="text-sm text-muted-foreground underline underline-offset-4 transition-colors duration-300 ease-soft hover:text-primary"
          >
            {t.cart.viewPage}
          </Link>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          {t.cart.checkoutHint}
        </p>
      </SheetFooter>
    </>
  );
}