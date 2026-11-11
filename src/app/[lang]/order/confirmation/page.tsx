import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { CheckCircle2Icon, MessageCircleIcon } from "lucide-react";

import { ClearCartOnMount } from "@/components/cart/clear-cart-on-mount";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
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
    <div className="mx-auto w-full max-w-2xl px-4 pt-10 sm:px-8 sm:pt-16">
      {unlocked ? <ClearCartOnMount /> : null}

      <div className="flex flex-col items-start gap-4">
        <CheckCircle2Icon aria-hidden="true" className="size-8 text-the" />
        <h1 className="text-4xl sm:text-5xl">{t.order.title}</h1>
        <p className="max-w-prose text-lg text-fil">{t.order.body}</p>
        <Badge variant="outline">{t.orderStatus[order.status]}</Badge>
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-4 border-y border-border py-5">
        <div>
          <dt className="text-sm text-fil">{t.order.reference}</dt>
          <dd className="font-heading text-2xl">
            <bdi>{order.reference}</bdi>
          </dd>
        </div>
        <div>
          <dt className="text-sm text-fil">{t.cart.total}</dt>
          <dd className="text-xl font-medium">
            <Price centimes={order.total} lang={lang} />
          </dd>
        </div>
      </dl>

      <ul className="flex flex-col divide-y divide-border">
        {order.lines.map((line, index) => (
          <li key={index} className="flex justify-between gap-4 py-4">
            <span>
              {/* The name is the French snapshot saved with the order. */}
              <span lang={line.name ? "fr" : undefined} className="font-heading text-xl">
                {line.name ?? t.order.itemFallback}
              </span>{" "}
              <span className="text-fil">× {line.quantity}</span>
              <bdi className="block text-xs text-fil">{line.reference}</bdi>
            </span>
            <Price centimes={line.unitPrice * line.quantity} lang={lang} />
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col items-start gap-3 border-t border-border pt-8">
        <Button render={<a href={whatsappHref} target="_blank" rel="noopener noreferrer" />}>
          <MessageCircleIcon data-icon="inline-start" aria-hidden="true" />
          {t.order.whatsapp}
        </Button>
        <p className="text-sm text-fil">{t.order.whatsappOptional}</p>
        <Button variant="link" className="mt-4" render={<Link href={localePath(lang, "/#boutique")} />}>
          {t.order.keepShopping}
        </Button>
      </div>
    </div>
  );
}
