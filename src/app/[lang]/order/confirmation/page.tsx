import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { CheckCircle2Icon, MessageCircleIcon } from "lucide-react";

import { ClearCartOnMount } from "@/components/cart/clear-cart-on-mount";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { fill, localePath } from "@/i18n/config";
import { getDictionary, getLang } from "@/i18n/server";
import { formatPrice } from "@/lib/format/money";
import { buildOrderWhatsappMessage, getOrderSummaryByToken } from "@/lib/data/orders";
import { SITE_URL } from "@/lib/constants/strings";
import { whatsappUrl } from "@/lib/integrations/whatsapp";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.order.title, robots: { index: false, follow: false } };
}

/** Cookie set by `placeOrder`; its value is the public token of the order just placed. */
const ORDER_COOKIE = "cbn-order";

/** Next 16: `searchParams` and `cookies()` are promises, so the page is async. */
export default async function OrderConfirmationPage({
  searchParams,
}: PageProps<"/[lang]/order/confirmation">) {
  const lang = await getLang();
  const t = await getDictionary();
  const params = await searchParams;
  const raw = Array.isArray(params.t) ? params.t[0] : params.t;
  const token = raw ?? "";

  // Only the browser that just placed this order gets the name and city, and
  // only that browser has its cart emptied. Someone opening a forwarded link
  // sees the recap without personal details, and keeps their own cart.
  const cookieStore = await cookies();
  const unlocked = token !== "" && cookieStore.get(ORDER_COOKIE)?.value === token;

  // Unknown or malformed token: a plain 404.
  const order = await getOrderSummaryByToken(token, { includeCustomer: unlocked });
  if (!order) notFound();

  const recap = [
    `${t.siteName} — ${t.order.reference} ${order.reference}`,
    "",
    ...order.lines.map(
      (line) =>
        `• ${line.name ?? t.order.itemFallback} x${line.quantity} — ${formatPrice(line.unitPrice * line.quantity, lang)}`,
    ),
    "",
    fill(t.whatsapp.orderRecapTotal, { total: formatPrice(order.total, lang) }),
  ].join("\n");

  // Full message only for the customer; the fallback keeps the raw recap.
  const whatsappHref = whatsappUrl(
    unlocked ? buildOrderWhatsappMessage(order, SITE_URL, lang, t) : recap,
  );

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-14 sm:px-8 sm:py-20">
      {unlocked ? <ClearCartOnMount /> : null}

      <div className="flex flex-col items-center text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <CheckCircle2Icon className="size-8" />
        </span>

        <h1 className="mt-6 font-heading text-3xl sm:text-4xl">
          {t.order.title}
        </h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          {t.order.body}
        </p>

        <div className="mt-7 rounded-2xl bg-card px-6 py-4 shadow-soft">
          <p className="text-[0.7rem] tracking-[0.18em] text-muted-foreground uppercase">
            {t.order.reference}
          </p>
          <p className="font-heading text-2xl tabular-nums">
            <bdi>{order.reference}</bdi>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{t.orderStatus[order.status]}</p>
        </div>
      </div>

      <ul className="mt-8 flex flex-col divide-y divide-border rounded-2xl bg-card px-6 shadow-soft">
        {order.lines.map((line, index) => (
          <li key={index} className="flex justify-between gap-4 py-4 text-sm">
            <span className="text-muted-foreground">
              {/* The name is the French snapshot saved with the order. */}
              <span lang={line.name ? "fr" : undefined}>{line.name ?? t.order.itemFallback}</span>{" "}
              × {line.quantity}
              <span className="mt-0.5 block text-xs tracking-[0.14em] uppercase">
                <bdi>{line.reference}</bdi>
              </span>
            </span>
            <span className="tabular-nums">
              <bdi>{formatPrice(line.unitPrice * line.quantity, lang)}</bdi>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-baseline justify-between rounded-2xl bg-card px-6 py-4 shadow-soft">
        <span className="text-sm text-muted-foreground">
          {t.cart.total}
        </span>
        <span className="font-heading text-xl tabular-nums">
          <bdi>{formatPrice(order.total, lang)}</bdi>
        </span>
      </div>

      <Separator className="my-8" />

      <div className="flex flex-col items-center gap-3">
        <Button
          variant="outline"
          size="lg"
          className="w-full sm:w-auto sm:px-8"
          render={
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
            />
          }
        >
          <MessageCircleIcon />
          {t.order.whatsapp}
        </Button>
        <p className="text-xs text-muted-foreground">
          {t.order.whatsappOptional}
        </p>

        <Button variant="ghost" render={<Link href={localePath(lang, "/#boutique")} />}>
          {t.order.keepShopping}
        </Button>
      </div>
    </div>
  );
}
