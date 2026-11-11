import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { isOptimizableImageUrl } from "@/lib/constants/images";
import { formatPrice } from "@/lib/format/money";
import { localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/fr";
import type { ProductSummary } from "@/lib/data/products";

/**
 * One tile in the catalog grid. Pure server component: the only thing the
 * browser needs is the link to the product page.
 */
export function ProductCard({
  product,
  lang,
  t,
}: {
  product: ProductSummary;
  lang: Locale;
  t: Dictionary;
}) {
  return (
    <Card className="group relative gap-0 overflow-hidden rounded-3xl py-0 transition-all duration-500 ease-soft hover:-translate-y-1 hover:shadow-lift">
      <Link
        href={localePath(lang, `/products/${product.slug}`)}
        className="flex flex-col focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
      >
        <div className="relative aspect-4/5 w-full overflow-hidden bg-muted">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw"
              className="object-cover transition-transform duration-700 ease-soft group-hover:scale-105"
              unoptimized={!isOptimizableImageUrl(product.imageUrl)}
            />
          ) : (
            <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
              {product.categoryName}
            </div>
          )}

          {/* A sold-out piece stays in the grid, clearly marked. */}
          {product.isSoldOut ? (
            <Badge
              variant="secondary"
              className="absolute top-3 inset-s-3 shadow-soft"
            >
              {t.product.soldOut}
            </Badge>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col gap-1 p-4">
          <p className="text-[0.7rem] tracking-[0.18em] text-muted-foreground uppercase">
            {product.categoryName}
          </p>
          <h3 lang={product.nameLang} className="font-heading text-lg leading-snug font-semibold">
            {product.name}
          </h3>
          <p className="mt-1 text-sm font-medium text-primary tabular-nums">
            <bdi>{formatPrice(product.price, lang)}</bdi>
          </p>
        </div>
      </Link>
    </Card>
  );
}
