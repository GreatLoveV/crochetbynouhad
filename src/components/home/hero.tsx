import Link from "next/link";
import { MessageCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";
import { fill, localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/fr";
import type { ProductSummary } from "@/lib/data/products";
import { whatsappUrl } from "@/lib/integrations/whatsapp";

/**
 * The first screen is the work: the newest piece's photo takes about 60 % of
 * the width (first on a phone), the title and the two ways to order sit
 * beside it. The photo is whatever the admin uploaded last, never a stock
 * image; without one it is a Lin block with the piece's name.
 */
export function Hero({
  showcase,
  lang,
  t,
}: {
  showcase: ProductSummary | null;
  lang: Locale;
  t: Dictionary;
}) {
  return (
    <section className="mx-auto grid max-w-page gap-8 px-4 pt-6 sm:px-8 sm:pt-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end lg:gap-14">
      {showcase ? (
        <Link href={localePath(lang, `/products/${showcase.slug}`)} className="group block">
          <Photo
            src={showcase.imageUrl}
            // The caption below names the piece; read once, not twice.
            alt=""
            emptyLabel={showcase.name}
            emptyLabelLang={showcase.nameLang}
            sizes="(min-width: 1024px) 58vw, 100vw"
            preload
            // On a laptop the 4:5 photo would push the title below the fold:
            // it keeps its width and is capped in height instead (cropped).
            className="lg:aspect-auto lg:h-[min(74vh,46rem)]"
          />
          <span lang={showcase.nameLang} className="mt-2 block text-sm text-fil group-hover:underline">
            {showcase.name}
          </span>
        </Link>
      ) : (
        <Photo alt="" />
      )}

      <div className="flex flex-col items-start gap-5 lg:pb-8">
        <h1 className="text-4xl sm:text-5xl">{t.hero.title}</h1>
        <p className="max-w-[34ch] text-lg text-fil">{t.hero.body}</p>
        <div className="mt-1 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
          <Button
            render={
              <a
                href={whatsappUrl(fill(t.whatsapp.discover, { shop: t.siteName }))}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            <MessageCircleIcon data-icon="inline-start" aria-hidden="true" />
            {t.hero.ctaWhatsapp}
          </Button>
          <Button variant="outline" render={<a href="#boutique" />}>
            {t.hero.ctaShop}
          </Button>
        </div>
      </div>
    </section>
  );
}
