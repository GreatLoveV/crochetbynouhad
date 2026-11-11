import Link from "next/link";

import { Button } from "@/components/ui/button";
import { localePath } from "@/i18n/config";
import { getDictionary, getLang } from "@/i18n/server";

/** The shop's 404 message, in the page's language. */
export async function NotFoundContent() {
  const lang = await getLang();
  const t = await getDictionary();

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-6 px-5 py-24 text-center sm:py-32">
      <p className="font-heading text-7xl text-primary sm:text-8xl">404</p>
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-medium sm:text-3xl">{t.notFound.title}</h1>
        <p className="text-muted-foreground">{t.notFound.body}</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" render={<Link href={localePath(lang, "/#boutique")} />}>
          {t.cart.continueShopping}
        </Button>
        <Button variant="outline" size="lg" render={<Link href={localePath(lang, "/")} />}>
          {t.notFound.home}
        </Button>
      </div>
    </div>
  );
}
