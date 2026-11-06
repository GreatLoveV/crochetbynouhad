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
import { formatPrice } from "@/lib/format/money";
import { strings } from "@/lib/constants/strings";
import { cn } from "cn";

/**
 * Header cart button + drawer.
 *
 * The drawer is the quick view; /cart is the full page. Both show the same
 * lines and are fed by the same server fetch, so a price change shows up in
 * both at once.
 */
export function CartButton() {
  const { count, isReady } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label={strings.nav.cart}
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "relative text-foreground/80 hover:text-accent-foreground",
        )}
      >
        <ShoppingBagIcon />
        {/* The badge is only rendered after hydration, so the server HTML and
            the first client render match. */}
        {isReady && count > 0 ? (
          <span className="absolute -top-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-primary text-[0.7rem] font-semibold text-primary-foreground tabular-nums">
            {count > 99 ? "99+" : count}
          </span>
        ) : null}
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-md">
        <CartDrawerBody onClose={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

function CartDrawerBody({ onClose }: { onClose: () => void }) {
  const { items, count, isReady, setQuantity, removeItem } = useCart();
  const idsKey = items.map((item) => item.productId).join(",");

  return (
    <>
      <SheetHeader>
        <SheetTitle>{strings.cart.title}</SheetTitle>
        <SheetDescription>
          {isReady && count > 0
            ? `${count} article${count > 1 ? "s" : ""}`
            : strings.cart.emptyHint}
        </SheetDescription>
      </SheetHeader>

      {items.length === 0 ? (
        <EmptyCart onClose={onClose} />
      ) : (
        <DrawerLines
          idsKey={idsKey}
          items={items}
          onClose={onClose}
          onQuantityChange={setQuantity}
          onRemove={removeItem}
        />
      )}
    </>
  );
}

function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="flex flex-1 flex-col items-center gap-4 py-16 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <ShoppingBagIcon className="size-7" />
        </span>
        <p className="text-muted-foreground">{strings.cart.empty}</p>
        <p className="max-w-56 text-sm text-muted-foreground/80">
          {strings.cart.emptyHint}
        </p>
      </div>
      <SheetFooter>
        <Button className="w-full" size="lg" onClick={onClose}>
          {strings.cart.continueShopping}
        </Button>
      </SheetFooter>
    </>
  );
}

function DrawerLines({
  idsKey,
  items,
  onClose,
  onQuantityChange,
  onRemove,
}: {
  idsKey: string;
  items: ReturnType<typeof useCart>["items"];
  onClose: () => void;
  onQuantityChange: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}) {
  const products = useCartProducts(idsKey);

  if (products === null) {
    return (
      <p className="flex-1 py-8 text-center text-sm text-muted-foreground">
        {strings.common.loading}
      </p>
    );
  }

  const total = cartTotal(products, items);

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6">
        <CartLineRows
          products={products}
          items={items}
          onQuantityChange={onQuantityChange}
          onRemove={onRemove}
          onNavigate={onClose}
        />
      </div>

      <SheetFooter>
        <Separator className="mb-2" />
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">
            {strings.cart.total}
          </span>
          <span className="font-heading text-xl tabular-nums">
            {formatPrice(total)}
          </span>
        </div>

        <Button
          className="w-full"
          size="lg"
          render={<Link href="/checkout" onClick={onClose} />}
        >
          {strings.checkout.title}
        </Button>

        <div className="flex items-center justify-center gap-4">
          <Link
            href="/cart"
            onClick={onClose}
            className="text-sm text-muted-foreground underline underline-offset-4 transition-colors duration-300 ease-soft hover:text-primary"
          >
            {strings.cart.viewPage}
          </Link>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          {strings.cart.checkoutHint}
        </p>
      </SheetFooter>
    </>
  );
}