import Image from "next/image";
import { MessageCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { isOptimizableImageUrl } from "@/lib/constants/images";
import type { ProductSummary } from "@/lib/data/products";
import { strings } from "@/lib/constants/strings";
import { whatsappUrl } from "@/lib/integrations/whatsapp";

/**
 * Short hero above the catalog. `showcase` is the cover photo of the first
 * active product, so the hero always shows something real (and something the
 * admin has just uploaded) instead of a hard-coded stock image.
 */
export function Hero({ showcase }: { showcase: ProductSummary | null }) {
  return (
    <section className="velvet-sheen border-b border-border">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 pt-12 pb-14 sm:pt-16 sm:pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:px-8">
        <div className="flex flex-col items-start gap-6">
          {/* Gold rule + small caps: the Velvet "label" style. */}
          <p className="flex items-center gap-3 text-xs font-semibold tracking-[0.24em] text-primary uppercase">
            <span aria-hidden className="h-px w-8 bg-primary/70" />
            {strings.hero.eyebrow}
          </p>

          <h1 className="text-balance text-5xl leading-[1.02] font-medium sm:text-6xl lg:text-7xl">
            {strings.hero.title}
          </h1>

          <p className="max-w-md text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {strings.hero.body}
          </p>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Button
              size="lg"
              className="w-full sm:w-auto"
              render={<a href="#boutique" />}
            >
              {strings.hero.ctaShop}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
              render={
                <a
                  href={whatsappUrl(
                    `Bonjour ${strings.siteName}, je découvre votre collection et j'aimerais des informations.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <MessageCircleIcon />
              {strings.hero.ctaWhatsapp}
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">{strings.hero.note}</p>
        </div>

        {showcase ? (
          <ShowcaseImage product={showcase} />
        ) : (
          <div className="aspect-4/5 w-full rounded-3xl border border-border bg-card shadow-soft" />
        )}
      </div>
    </section>
  );
}

/** Big, tactile product photo — the anchor of the hero on larger screens. */
function ShowcaseImage({ product }: { product: ProductSummary }) {
  return (
    <div className="relative aspect-4/5 w-full overflow-hidden rounded-3xl border border-border bg-card shadow-lift">
      {product.imageUrl ? (
        <Image
          src={product.imageUrl}
          alt={product.nameFr}
          fill
          priority
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="object-cover"
          // Like every other product photo: an unknown host is loaded as-is
          // instead of failing in the optimiser.
          unoptimized={!isOptimizableImageUrl(product.imageUrl)}
        />
      ) : null}
      <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-border bg-background/80 px-4 py-3 backdrop-blur-sm">
        <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
          {product.categoryNameFr}
        </p>
        <p className="font-heading text-xl leading-tight font-semibold">{product.nameFr}</p>
      </div>
    </div>
  );
}
