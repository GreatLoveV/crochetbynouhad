import type { Metadata } from "next";

import { CheckoutForm } from "@/components/checkout/checkout-form";
import { getDictionary } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return {
    title: t.checkout.title,
    description: t.checkout.subtitle,
    robots: { index: false, follow: false },
  };
}

export default async function CheckoutPage() {
  const t = await getDictionary();
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <header className="mb-8">
        <p className="text-[0.7rem] tracking-[0.18em] text-muted-foreground uppercase">
          {t.hero.eyebrow}
        </p>
        <h1 className="mt-2 font-heading text-3xl sm:text-4xl">{t.checkout.title}</h1>
        <p className="mt-2 text-muted-foreground">{t.checkout.subtitle}</p>
      </header>

      <CheckoutForm />
    </div>
  );
}
