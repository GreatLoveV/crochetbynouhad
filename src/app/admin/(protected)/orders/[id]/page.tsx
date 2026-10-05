import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { OrderStatusControl } from "@/components/admin/order-status-control";
import { Button } from "@/components/ui/button";
import { getAdminOrder } from "@/lib/admin-orders";
import { formatPrice } from "@/lib/money";
import { strings } from "@/lib/strings";

export const metadata = { title: "Commande — Administration" };

export default async function AdminOrderPage({
  params,
}: PageProps<"/admin/orders/[id]">) {
  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isInteger(orderId) || orderId < 1) notFound();

  const order = await getAdminOrder(orderId);
  if (!order) notFound();

  const whatsappHref = `https://wa.me/${order.phone.replace(/[^0-9]/g, "")}`;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" />
          {strings.admin.orders}
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tabular-nums">
            {order.reference}
          </h1>
          <OrderStatusBadge status={order.status} />
          <time
            dateTime={order.createdAt.toISOString()}
            className="text-sm text-muted-foreground"
          >
            {new Intl.DateTimeFormat("fr-FR", {
              dateStyle: "long",
              timeStyle: "short",
              timeZone: "Africa/Casablanca",
            }).format(order.createdAt)}
          </time>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="flex flex-col gap-6">
          <section className="rounded-xl border border-border p-4">
            <h2 className="mb-3 text-sm font-semibold">
              {strings.admin.orderItems}
            </h2>
            <table className="w-full text-sm">
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="py-2 pr-3">
                      {item.slug ? (
                        <Link
                          href={`/products/${item.slug}`}
                          className="hover:underline"
                        >
                          {item.nameFr}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground line-through">
                          {item.nameFr}
                        </span>
                      )}
                    </td>
                    <td className="w-16 py-2 pr-3 text-right tabular-nums text-muted-foreground">
                      ×{item.quantity}
                    </td>
                    <td className="w-28 py-2 text-right tabular-nums">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="pt-3 font-semibold" colSpan={2}>
                    {strings.admin.orderTotal}
                  </td>
                  <td className="pt-3 text-right font-semibold tabular-nums">
                    {formatPrice(order.total)}
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="mt-2 text-xs text-muted-foreground">
              Les prix sont ceux enregistrés au moment de la commande.
            </p>
          </section>

          {order.notes ? (
            <section className="rounded-xl border border-border p-4">
              <h2 className="mb-2 text-sm font-semibold">
                {strings.admin.orderNotes}
              </h2>
              <p className="text-sm whitespace-pre-line">{order.notes}</p>
            </section>
          ) : null}
        </div>

        <aside className="flex flex-col gap-6">
          <section className="flex flex-col gap-3 rounded-xl border border-border p-4">
            <h2 className="text-sm font-semibold">{strings.admin.orderCustomer}</h2>
            <dl className="flex flex-col gap-2 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">
                  {strings.admin.orderCustomer}
                </dt>
                <dd className="font-medium">{order.customerName}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">
                  {strings.admin.orderPhone}
                </dt>
                <dd>
                  <a
                    href={`tel:${order.phone.replace(/\s+/g, "")}`}
                    className="hover:underline"
                  >
                    {order.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">
                  {strings.admin.orderCity}
                </dt>
                <dd>{order.city}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">
                  {strings.admin.orderAddress}
                </dt>
                <dd className="whitespace-pre-line">{order.address}</dd>
              </div>
            </dl>
            <Button
              variant="outline"
              render={<a href={whatsappHref} target="_blank" rel="noreferrer" />}
            >
              {strings.admin.whatsappCustomer}
            </Button>
          </section>

          <section className="rounded-xl border border-border p-4">
            <OrderStatusControl orderId={order.id} status={order.status} />
          </section>
        </aside>
      </div>
    </div>
  );
}