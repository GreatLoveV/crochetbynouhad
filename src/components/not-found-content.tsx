import Link from "next/link";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/state";
import { localePath } from "@/i18n/config";
import { getDictionary, getLang } from "@/i18n/server";

/** The shop's 404 message, in the page's language. */
export async function NotFoundContent() {
  const lang = await getLang();
  const t = await getDictionary();

  return (
    <EmptyState
      as="h1"
      className="py-24 sm:py-32"
      title={t.notFound.title}
      body={t.notFound.body}
      actions={
        <>
          <Button render={<Link href={localePath(lang, "/#boutique")} />}>{t.cart.continueShopping}</Button>
          <Button variant="outline" render={<Link href={localePath(lang, "/")} />}>
            {t.notFound.home}
          </Button>
        </>
      }
    />
  );
}
