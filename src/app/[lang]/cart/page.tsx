import type { Metadata } from "next";

import { CartPageView } from "@/components/cart/cart-page-view";
import { getDictionary } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return {
    title: t.cart.title,
    description: t.cart.emptyHint,
    robots: { index: false, follow: false },
  };
}

export default async function CartPage() {
  const t = await getDictionary();
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <header className="mb-8">
        <h1 className="font-heading text-3xl sm:text-4xl">{t.cart.title}</h1>
      </header>
      <CartPageView />
    </div>
  );
}
