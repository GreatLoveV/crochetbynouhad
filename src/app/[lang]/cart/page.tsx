import type { Metadata } from "next";

import { CartPageView } from "@/components/cart/cart-page-view";
import { strings } from "@/lib/constants/strings";

export const metadata: Metadata = {
  title: `${strings.cart.title} | ${strings.siteName}`,
  description: strings.cart.emptyHint,
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <header className="mb-8">
        <h1 className="font-heading text-3xl sm:text-4xl">{strings.cart.title}</h1>
      </header>
      <CartPageView />
    </div>
  );
}