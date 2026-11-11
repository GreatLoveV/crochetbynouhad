"use client";

import { toast } from "sonner";
import { MessageCircleIcon, ShoppingBagIcon } from "lucide-react";

import { useCart } from "@/components/cart/cart-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { fill } from "@/i18n/config";
import { useI18n } from "@/i18n/client";
import { formatPrice } from "@/lib/format/money";
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
  const { lang, t } = useI18n();
  const { addItem, items } = useCart();
  const alreadyInCart = items.some((item) => item.productId === productId);

  function handleAddToCart() {
    if (alreadyInCart) {
      toast.info(fill(t.product.alreadyInCartToast, { name }));
      return;
    }
    addItem(productId);
    toast.success(fill(t.product.addedToast, { name }), {
      description: formatPrice(price, lang),
    });
  }

  // Sent straight to WhatsApp: no account needed, which is how most customers
  // will actually order. The cart + checkout come as the other path.
  const referenceLine = reference ? ` (${reference})` : "";
  const message = [
    fill(t.whatsapp.product, { shop: t.siteName, name, reference: referenceLine }),
    productUrl,
  ].join("\n");

  const buttonLabel = isSoldOut
    ? t.product.soldOut
    : alreadyInCart
      ? t.product.alreadyInCart
      : t.product.addToCart;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <p className="font-heading text-4xl font-semibold text-primary tabular-nums">
            <bdi>{formatPrice(price, lang)}</bdi>
          </p>
          <Badge variant="secondary">{t.product.unique}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {isSoldOut ? t.product.soldOutHint : t.cart.checkoutHint}
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
          {t.product.askWhatsapp}
        </Button>
      </div>

      <Separator />

      <p className="text-sm leading-relaxed text-muted-foreground">
        {t.hero.note}
      </p>
    </div>
  );
}
