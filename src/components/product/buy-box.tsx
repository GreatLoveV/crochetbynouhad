"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MessageCircleIcon, MinusIcon, PlusIcon, ShoppingBagIcon } from "lucide-react";

import { useCart } from "@/components/cart/cart-provider";
import { MAX_QUTY_PER_LINE } from "@/components/cart/cart-storage";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/money";
import { strings } from "@/lib/strings";
import { whatsappUrl } from "@/lib/whatsapp";

/**
 * Price, quantity selector, "add to cart" and the WhatsApp order button.
 *
 * Client component: it holds the chosen quantity and writes to the cart, which
 * lives in the browser. The price it displays comes from the database via the
 * server component parent, and is recomputed again on the server at checkout.
 */
export function ProductBuyBox({
  productId,
  name,
  price,
  productUrl,
}: {
  productId: number;
  name: string;
  /** In centimes. */
  price: number;
  /** Absolute URL, so the message can be pasted anywhere and still work. */
  productUrl: string;
}) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const decrement = () => setQuantity((q) => Math.max(q - 1, 1));
  const increment = () =>
    setQuantity((q) => Math.min(q + 1, MAX_QUTY_PER_LINE));

  function handleAddToCart() {
    addItem(productId, quantity);
    toast.success(`${name} ajouté au panier`, {
      description:
        quantity > 1 ? `${quantity} articles · ${formatPrice(price * quantity)}` : formatPrice(price),
    });
  }

  // Sent straight to WhatsApp: no account needed, which is how most customers
  // will actually order. The cart + checkout come as the other path.
  const message = [
    `${strings.hero.eyebrow} — ${strings.product.orderWhatsapp}`,
    "",
    `${name} — ${formatPrice(price)}${quantity > 1 ? ` x${quantity}` : ""}`,
    productUrl,
  ].join("\n");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-3xl font-medium tabular-nums">{formatPrice(price)}</p>
        <p className="text-sm text-muted-foreground">{strings.cart.checkoutHint}</p>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium">{strings.product.quantity}</span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-full border border-border p-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={decrement}
              disabled={quantity <= 1}
              aria-label="Diminuer la quantité"
            >
              <MinusIcon />
            </Button>
            <span className="w-10 text-center font-medium tabular-nums">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={increment}
              disabled={quantity >= MAX_QUTY_PER_LINE}
              aria-label="Augmenter la quantité"
            >
              <PlusIcon />
            </Button>
          </div>

          {quantity > 1 ? (
            <span className="text-sm text-muted-foreground tabular-nums">
              {formatPrice(price * quantity)}
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Button size="lg" className="w-full" onClick={handleAddToCart}>
          <ShoppingBagIcon data-icon="inline-start" />
          {strings.product.addToCart}
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="w-full"
          render={
            <a
              href={whatsappUrl(message)}
              target="_blank"
              rel="noopener noreferrer"
            />
          }
        >
          <MessageCircleIcon data-icon="inline-start" />
          {strings.product.orderWhatsapp}
        </Button>
      </div>

      <Separator />

      <p className="text-sm leading-relaxed text-muted-foreground">
        {strings.hero.note}
      </p>
    </div>
  );
}