"use client";

import Link from "next/link";
import { useActionState } from "react";

import { placeOrder } from "@/app/actions/orders";
import { useCart } from "@/components/cart/cart-provider";
import { cartTotal } from "@/components/cart/cart-line-rows";
import { useCartProducts } from "@/components/cart/use-cart-products";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";
import { Photo } from "@/components/ui/photo";
import { Price } from "@/components/ui/price";
import { EmptyState, LoadingState } from "@/components/ui/state";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/i18n/client";
import type { Locale } from "@/i18n/config";
import { plural } from "@/i18n/format";
import { emptyOrderFormState } from "@/lib/validation/order-form";

/**
 * Suggestions for the city field, written the way each language writes them;
 * the customer can still type anything.
 */
const MOROCCAN_CITIES: Record<Locale, string[]> = {
  fr: [
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
  ],
  ar: [
    "الدار البيضاء",
    "الرباط",
    "سلا",
    "مراكش",
    "طنجة",
    "فاس",
    "أكادير",
    "مكناس",
    "وجدة",
    "القنيطرة",
    "تطوان",
  ],
};

/**
 * Guest checkout: a short form plus the order summary.
 *
 * The cart lives in the browser, so the page shell is a Server Component and
 * only this form is client-side. On submit the browser sends product ids and
 * quantities; the server re-reads the prices and recalculates the total before
 * saving anything.
 */
export function CheckoutForm() {
  const { lang, t, href } = useI18n();
  const { items, count, isReady } = useCart();
  const idsKey = items.map((item) => item.productId).join(",");
  const products = useCartProducts(idsKey);
  const [state, formAction, pending] = useActionState(placeOrder, emptyOrderFormState);

  if (!isReady) return <LoadingState label={t.common.loading} />;

  if (items.length === 0) {
    return (
      <EmptyState
        title={t.checkout.empty}
        body={t.checkout.emptyHint}
        actions={<Button render={<Link href={href("/#boutique")} />}>{t.cart.continueShopping}</Button>}
      />
    );
  }

  if (products === null) return <LoadingState label={t.common.loading} />;

  // Everything the customer added has been deactivated or deleted.
  if (products.length === 0) {
    return (
      <Notice
        tone="error"
        title={t.checkout.unavailable}
        action={
          <Button variant="outline" size="sm" render={<Link href={href("/#boutique")} />}>
            {t.cart.continueShopping}
          </Button>
        }
      />
    );
  }

  const total = cartTotal(products);
  const errors = state.fieldErrors ?? {};
  // On a failed submit the action echoes the fields back, so nothing is lost.
  const kept = state.values;

  return (
    <form
      action={formAction}
      noValidate
      className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-16"
    >
      {/*
        The only cart data the server receives: which bags.
        Prices are deliberately absent — the server looks them up itself.
      */}
      <input type="hidden" name="cart" value={JSON.stringify(items)} />
      {/* So the server answers, and redirects, in the language of the page. */}
      <input type="hidden" name="lang" value={lang} />

      {/* Honeypot: invisible to people and screen readers, filled by bots.
          The server rejects any submit where it is not empty. */}
      <div aria-hidden className="absolute -inset-s-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <div className="flex max-w-xl flex-col gap-6">
        {state.message ? <Notice tone="error" title={state.message} /> : null}

        <Field id="name" label={t.checkout.name} error={errors.name}>
          {(p) => (
            <Input
              {...p}
              name="name"
              autoComplete="name"
              defaultValue={kept?.name ?? ""}
              placeholder={t.checkout.namePlaceholder}
            />
          )}
        </Field>

        <Field id="phone" label={t.checkout.phone} hint={t.checkout.phoneHint} error={errors.phone}>
          {(p) => (
            <Input
              {...p}
              name="phone"
              type="tel"
              inputMode="tel"
              // Phone digits read left to right even on an Arabic page; the
              // text still sits at the start (right) edge there.
              dir="ltr"
              className="rtl:text-end"
              autoComplete="tel"
              defaultValue={kept?.phone ?? ""}
              placeholder={t.checkout.phonePlaceholder}
            />
          )}
        </Field>

        <Field id="city" label={t.checkout.city} error={errors.city}>
          {(p) => (
            <>
              <Input
                {...p}
                name="city"
                list="moroccan-cities"
                autoComplete="address-level2"
                defaultValue={kept?.city ?? ""}
                placeholder={t.checkout.cityPlaceholder}
              />
              {/* Suggestions only: any city can still be typed. */}
              <datalist id="moroccan-cities">
                {MOROCCAN_CITIES[lang].map((city) => (
                  <option key={city} value={city} />
                ))}
              </datalist>
            </>
          )}
        </Field>

        <Field id="address" label={t.checkout.address} error={errors.address}>
          {(p) => (
            <Textarea
              {...p}
              name="address"
              autoComplete="street-address"
              defaultValue={kept?.address ?? ""}
              placeholder={t.checkout.addressPlaceholder}
            />
          )}
        </Field>

        <Field id="notes" label={t.checkout.notes} error={errors.notes}>
          {(p) => (
            <Textarea {...p} name="notes" defaultValue={kept?.notes ?? ""} placeholder={t.checkout.notesPlaceholder} />
          )}
        </Field>

        {errors.cart ? <Notice tone="error" title={errors.cart} /> : null}

        {/* Sticky on phones so the confirm button is always within reach;
            back to a normal inline button from the laptop layout up. */}
        <div className="sticky bottom-0 z-10 -mx-4 border-t border-border bg-coton px-4 py-3 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0">
          {/* On a phone the summary is below the form: the amount rides along
              with the button so it is seen before confirming. */}
          <p className="mb-2 flex items-baseline justify-between gap-4 lg:hidden">
            <span className="text-sm">{t.checkout.totalLabel}</span>
            <Price centimes={total} lang={lang} className="font-medium" />
          </p>
          <Button type="submit" className="w-full sm:w-auto sm:px-10" loading={pending}>
            {pending ? t.checkout.submitting : t.checkout.submit}
          </Button>
          <p className="mt-2 text-sm text-fil">{t.checkout.paymentNote}</p>
        </div>
      </div>

      {/* The summary is a preview only: the server recalculates everything. */}
      <aside aria-labelledby="checkout-summary" className="bg-lin p-6 lg:sticky lg:top-28">
        <h2 id="checkout-summary" className="text-2xl">
          {t.checkout.itemsTitle}
        </h2>
        <p className="mt-1 text-sm text-fil">{plural(lang, t.cart.pieces, count)}</p>

        <ul className="mt-5 flex flex-col gap-4">
          {products.map((product) => (
            <li key={product.id} className="flex items-start gap-3">
              <div className="w-14 shrink-0">
                <Photo src={product.imageUrl} alt="" sizes="56px" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <span lang={product.nameLang} className="font-heading text-lg leading-snug">
                  {product.name}
                </span>
                {product.reference ? (
                  <bdi className="text-xs text-fil">{product.reference}</bdi>
                ) : null}
              </div>
              <Price centimes={product.price} lang={lang} className="text-sm" />
            </li>
          ))}
        </ul>

        <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-trait pt-4">
          <span>{t.checkout.totalLabel}</span>
          <Price centimes={total} lang={lang} className="text-xl font-medium" />
        </div>
      </aside>
    </form>
  );
}
