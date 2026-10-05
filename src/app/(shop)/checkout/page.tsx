import type { Metadata } from "next";

import { CheckoutForm } from "@/components/checkout/checkout-form";
import { strings } from "@/lib/strings";

export const metadata: Metadata = {
  title: `${strings.checkout.title} | ${strings.siteName}`,
  description: strings.checkout.subtitle,
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <header className="mb-8">
        <p className="text-[0.7rem] tracking-[0.18em] text-muted-foreground uppercase">
          {strings.hero.eyebrow}
        </p>
        <h1 className="mt-2 font-heading text-3xl sm:text-4xl">
          {strings.checkout.title}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {strings.checkout.subtitle}
        </p>
      </header>

      <CheckoutForm />
    </div>
  );
}