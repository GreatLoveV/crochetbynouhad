"use client";

import { toast } from "sonner";
import { MessageCircleIcon } from "lucide-react";

import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { fill } from "@/i18n/config";
import { useI18n } from "@/i18n/client";
import { formatPrice } from "@/lib/format/money";
import { whatsappUrl } from "@/lib/integrations/whatsapp";

/**
 * The two ways to get this piece: ask on WhatsApp (how most customers
 * order, so it is the main action) or add it to the bag and confirm the
 * order on the site.
 *
 * Client component: it writes to the cart, which lives in the browser. The
 * price shown comes from the database via the server parent, and is
 * recomputed on the server at checkout.
 *
 * Every piece is one of a kind: no quantity, it can be in the bag once, and a
 * sold one keeps its page but can't be ordered.
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

  const referenceLine = reference ? ` (${reference})` : "";
  const message = [
    fill(t.whatsapp.product, { shop: t.siteName, name, reference: referenceLine }),
    productUrl,
  ].join("\n");

  return (
    <div className="flex flex-col gap-3">
      <Button
        className="w-full"
        render={<a href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer" />}
      >
        <MessageCircleIcon data-icon="inline-start" aria-hidden="true" />
        {isSoldOut ? t.product.askWhatsapp : t.hero.ctaWhatsapp}
      </Button>

      <Button
        variant="outline"
        className="w-full"
        onClick={handleAddToCart}
        disabled={isSoldOut || alreadyInCart}
      >
        {isSoldOut ? t.product.soldOut : alreadyInCart ? t.product.alreadyInCart : t.product.addToCart}
      </Button>

      <p className="text-sm text-mauve">{isSoldOut ? t.product.soldOutHint : t.hero.note}</p>
    </div>
  );
}
