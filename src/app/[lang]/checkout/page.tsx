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
    <div className="mx-auto w-full max-w-page px-4 pt-8 sm:px-8 sm:pt-12">
      <header className="mb-8 flex flex-col gap-2">
        <h1 className="text-4xl sm:text-5xl">{t.checkout.title}</h1>
        <p className="text-fil">{t.checkout.subtitle}</p>
      </header>

      <CheckoutForm />
    </div>
  );
}
