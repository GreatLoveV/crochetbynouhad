import Link from "next/link";

import { Button } from "@/components/ui/button";
import { strings } from "@/lib/strings";

/**
 * The 404 message, with no header or footer of its own.
 *
 * Shared by the two `not-found.tsx` files: the shop one gets the site chrome
 * from `(shop)/layout.tsx`, while the root one (for URLs outside every route
 * group) has to bring its own.
 */
export function NotFoundContent() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-6 px-5 py-24 text-center sm:py-32">
      <p className="font-heading text-7xl text-primary sm:text-8xl">404</p>
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-medium sm:text-3xl">
          {strings.notFound.title}
        </h1>
        <p className="text-muted-foreground">{strings.notFound.body}</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" render={<Link href="/#boutique" />}>
          {strings.cart.continueShopping}
        </Button>
        <Button
          variant="outline"
          size="lg"
          render={<Link href="/">Retour à l&apos;accueil</Link>}
        >
          {strings.notFound.home}
        </Button>
      </div>
    </div>
  );
}