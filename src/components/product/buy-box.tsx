"use client";

import { toast } from "sonner";
import { MessageCircleIcon, ShoppingBagIcon } from "lucide-react";

import { useCart } from "@/components/cart/cart-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/format/money";
import { strings } from "@/lib/constants/strings";
import { whatsappUrl } from "@/lib/integrations/whatsapp";

/**
 * Price, "add to cart" and the WhatsApp question button.
 *
 * Client component: it writes to the cart, which lives in the browser. The
 * price it displays comes from the database via the server component parent,
 * and is recomputed again on the server at checkout.
 *
 * Every bag is one of a kind: no quantity, it can be in the cart once, and a
 * sold one keeps its page but cannot be ordered.
 */
export function ProductBuyBox({
  productId,
  name,
  price,
  productUrl,
  reference,
  isSoldOut,
}: {
  productId: number;
  name: string;
  /** In centimes. */
  price: number;
  /** Absolute URL, so the message can be pasted anywhere and still work. */
  productUrl: string;
  reference: string | null;
  isSoldOut: boolean;
}) {
  const { addItem, items } = useCart();
  const alreadyInCart = items.some((item) => item.productId === productId);

  function handleAddToCart() {
    if (alreadyInCart) {
      toast.info(`${name} est déjà dans votre panier`);
      return;
    }
    addItem(productId);
    toast.success(`${name} ajouté au panier`, { description: formatPrice(price) });
  }

  // Sent straight to WhatsApp: no account needed, which is how most customers
  // will actually order. The cart + checkout come as the other path.
  const referenceLine = reference ? ` (${reference})` : "";
  const message = [
    `Bonjour ${strings.siteName}, j'ai une question à propos de « ${name} »${referenceLine} :`,
    productUrl,
  ].join("\n");

  const buttonLabel = isSoldOut
    ? strings.product.soldOut
    : alreadyInCart
      ? strings.product.alreadyInCart
      : strings.product.addToCart;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <p className="font-heading text-4xl font-semibold text-primary tabular-nums">
            {formatPrice(price)}
          </p>
          <Badge variant="secondary">{strings.product.unique}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {isSoldOut ? strings.product.soldOutHint : strings.cart.checkoutHint}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Button
          size="lg"
          className="w-full"
          onClick={handleAddToCart}
          disabled={isSoldOut || alreadyInCart}
        >
          <ShoppingBagIcon data-icon="inline-start" />
          {buttonLabel}
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
          {strings.product.askWhatsapp}
        </Button>
      </div>

      <Separator />

      <p className="text-sm leading-relaxed text-muted-foreground">
        {strings.hero.note}
      </p>
    </div>
  );
}
