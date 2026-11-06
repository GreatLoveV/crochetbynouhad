"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Loader2Icon, LockIcon, ShoppingBagIcon } from "lucide-react";

import { placeOrder } from "@/app/actions/orders";
import { useCart } from "@/components/cart/cart-provider";
import { cartTotal, lineQuantity } from "@/components/cart/cart-line-rows";
import { useCartProducts } from "@/components/cart/use-cart-products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/format/money";
import { emptyOrderFormState } from "@/lib/validation/order-form";
import { strings } from "@/lib/constants/strings";

/** Suggestions for the city field; the customer can still type anything. */
const MOROCCAN_CITIES = [
  "Casablanca",
  "Rabat",
  "Salé",
  "Marrakech",
  "Tanger",
  "Fès",
  "Agadir",
  "Meknès",
  "Oujda",
  "Kénitra",
  "Tétouan",
];

/**
 * Guest checkout: a short form plus the order summary.
 *
 * The cart lives in the browser, so the page shell is a Server Component and
 * only this form is client-side. On submit the browser sends product ids and
 * quantities; the server re-reads the prices and recalculates the total before
 * saving anything.
 */
export function CheckoutForm() {
  const { items, count, isReady } = useCart();
  const idsKey = items.map((item) => item.productId).join(",");
  const products = useCartProducts(idsKey);
  const [state, formAction, pending] = useActionState(
    placeOrder,
    emptyOrderFormState,
  );

  if (!isReady) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        {strings.common.loading}
      </p>
    );
  }

  if (items.length === 0) {
    return <EmptyCart />;
  }

  if (products === null) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        {strings.common.loading}
      </p>
    );
  }

  // Everything the customer added has been deactivated or deleted.
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-5 py-20 text-center">
        <p className="max-w-md text-muted-foreground">
          {strings.checkout.unavailable}
        </p>
        <Button size="lg" render={<Link href="/#boutique" />}>
          {strings.cart.continueShopping}
        </Button>
      </div>
    );
  }

  const total = cartTotal(products, items);
  const errors = state.fieldErrors ?? {};
  // On a failed submit the action echoes the fields back, so nothing is lost.
  const kept = state.values;

  return (
    <form action={formAction} className="grid gap-10 lg:grid-cols-[1fr_20rem] lg:items-start">
      {/*
        The only cart data the server receives: which product, how many.
        Prices are deliberately absent — the server looks them up itself.
      */}
      <input type="hidden" name="cart" value={JSON.stringify(items)} />

      <div>
        <h2 className="font-heading text-xl">{strings.checkout.summaryTitle}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {count} article{count > 1 ? "s" : ""}
        </p>

        <Separator className="my-5" />

        {state.message ? (
          <p
            role="alert"
            className="mb-5 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {state.message}
          </p>
        ) : null}

        <div className="flex flex-col gap-5">
          <Field
            id="name"
            label={strings.checkout.name}
            error={errors.name}
            render={(props) => (
              <Input
                {...props}
                name="name"
                autoComplete="name"
                defaultValue={kept?.name ?? ""}
                placeholder={strings.checkout.namePlaceholder}
              />
            )}
          />

          <Field
            id="phone"
            label={strings.checkout.phone}
            error={errors.phone}
            hint={strings.checkout.phoneHint}
            render={(props) => (
              <Input
                {...props}
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                defaultValue={kept?.phone ?? ""}
                placeholder={strings.checkout.phonePlaceholder}
              />
            )}
          />

          <Field
            id="city"
            label={strings.checkout.city}
            error={errors.city}
            render={(props) => (
              <>
                <Input
                  {...props}
                  name="city"
                  list="moroccan-cities"
                  autoComplete="address-level2"
                  defaultValue={kept?.city ?? ""}
                  placeholder={strings.checkout.cityPlaceholder}
                />
                {/* Suggestions only: any city can still be typed. */}
                <datalist id="moroccan-cities">
                  {MOROCCAN_CITIES.map((city) => (
                    <option key={city} value={city} />
                  ))}
                </datalist>
              </>
            )}
          />

          <Field
            id="address"
            label={strings.checkout.address}
            error={errors.address}
            render={(props) => (
              <Textarea
                {...props}
                name="address"
                autoComplete="street-address"
                defaultValue={kept?.address ?? ""}
                placeholder={strings.checkout.addressPlaceholder}
              />
            )}
          />

          <Field
            id="notes"
            label={strings.checkout.notes}
            error={errors.notes}
            render={(props) => (
              <Textarea
                {...props}
                name="notes"
                defaultValue={kept?.notes ?? ""}
                placeholder={strings.checkout.notesPlaceholder}
              />
            )}
          />

          {errors.cart ? (
            <p
              role="alert"
              className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              {errors.cart}
            </p>
          ) : null}

          {/* Sticky on phones so the confirm button is always within reach;
              back to a normal inline button from the laptop layout up. */}
          <div className="sticky bottom-0 z-10 -mx-5 mt-2 border-t border-border bg-background/95 px-5 py-3 backdrop-blur-sm lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
            <Button
              type="submit"
              size="lg"
              className="h-13 w-full lg:w-auto lg:px-10"
              disabled={pending}
            >
              {pending ? (
                <>
                  <Loader2Icon className="animate-spin" />
                  {strings.checkout.submitting}
                </>
              ) : (
                strings.checkout.submit
              )}
            </Button>

            <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-muted-foreground lg:justify-start">
              <LockIcon className="size-3.5" />
              {strings.checkout.paymentNote}
            </p>
          </div>
        </div>
      </div>

      {/* The summary is a preview only: the server recalculates everything. */}
      <aside className="rounded-3xl bg-card p-6 shadow-soft lg:sticky lg:top-24">
        <h2 className="font-heading text-xl">{strings.checkout.itemsTitle}</h2>

        <ul className="mt-4 flex flex-col gap-3 text-sm">
          {products.map((product) => {
            const quantity = lineQuantity(product, items);
            return (
              <li key={product.id} className="flex justify-between gap-4">
                <span className="text-muted-foreground">
                  {product.nameFr} × {quantity}
                  {product.reference ? (
                    <span className="mt-0.5 block text-xs tracking-[0.14em] uppercase">
                      {product.reference}
                    </span>
                  ) : null}
                </span>
                <span className="tabular-nums">
                  {formatPrice(product.price * quantity)}
                </span>
              </li>
            );
          })}
        </ul>

        <Separator className="my-4" />

        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">
            {strings.checkout.totalLabel}
          </span>
          <span className="font-heading text-2xl tabular-nums">
            {formatPrice(total)}
          </span>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          {strings.checkout.paymentNote}
        </p>
      </aside>
    </form>
  );
}

/**
 * One labelled field with its error message wired up for screen readers.
 * `render` keeps the input markup next to the label it belongs to.
 */
function Field({
  id,
  label,
  error,
  hint,
  render,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  render: (props: {
    id: string;
    "aria-invalid": boolean;
    "aria-describedby": string | undefined;
  }) => React.ReactNode;
}) {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {render({
        id,
        "aria-invalid": Boolean(error),
        "aria-describedby": describedBy,
      })}
      {error ? (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="flex flex-col items-center gap-5 py-20 text-center">
      <span className="flex size-20 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <ShoppingBagIcon className="size-8" />
      </span>
      <p className="font-heading text-2xl">{strings.checkout.empty}</p>
      <p className="max-w-sm text-muted-foreground">
        {strings.checkout.emptyHint}
      </p>
      <Button size="lg" render={<Link href="/#boutique" />}>
        {strings.cart.continueShopping}
      </Button>
    </div>
  );
}