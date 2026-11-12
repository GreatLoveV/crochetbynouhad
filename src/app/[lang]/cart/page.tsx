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
    <div className="mx-auto w-full max-w-page px-4 pt-8 sm:px-8 sm:pt-12">
      <header className="mb-8">
        <h1 className="text-4xl sm:text-5xl">{t.cart.title}</h1>
      </header>
      {/* The bag is read in the browser: a loader, then the form or the empty
          message. The reserved height keeps the footer below the screen
          through all three, so nothing jumps (layout shift). */}
      <div className="min-h-[80dvh]">
        <CartPageView />
      </div>
    </div>
  );
}
