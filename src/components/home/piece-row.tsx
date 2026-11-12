import Link from "next/link"
import { MessageCircleIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Photo } from "@/components/ui/photo"
import { Price } from "@/components/ui/price"
import { fill, localePath, type Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/dictionaries/fr"
import type { ProductSummary } from "@/lib/data/products"
import { whatsappUrl } from "@/lib/integrations/whatsapp"

/**
 * One piece, one row (docs/design/direction.md, "One piece at a time"): the
 * photo on the inline start, then its name, category, price and the two ways
 * to act on it. Used while the collection is short (six pieces or fewer);
 * longer collections fall back to the tile grid.
 *
 * The photo always sits on the start side. Rows don't alternate: a zigzag
 * repeated down the page reads as layout filler, not as the work.
 */
export function PieceRow({
  product,
  lang,
  t,
  priority,
}: {
  product: ProductSummary
  lang: Locale
  t: Dictionary
  priority?: boolean
}) {
  const href = localePath(lang, `/products/${product.slug}`)
  const question = fill(t.whatsapp.product, {
    shop: t.siteName,
    name: product.name,
    reference: product.reference ? ` (${product.reference})` : "",
  })
  const titleId = `piece-${product.id}`

  return (
    <article
      aria-labelledby={titleId}
      className="grid items-center gap-6 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] md:gap-14 lg:gap-20"
    >
      <Link href={href} tabIndex={-1} aria-hidden="true" className="block">
        <Photo
          src={product.imageUrl}
          alt=""
          emptyLabel={product.name}
          emptyLabelLang={product.nameLang}
          sizes="(min-width: 768px) 50vw, 100vw"
          priority={priority}
        >
          {product.isSoldOut && (
            <Badge variant="sold" className="absolute top-4 inset-s-4">
              {t.product.soldOut}
            </Badge>
          )}
        </Photo>
      </Link>

      <div className="flex flex-col items-start gap-4">
        {product.categoryName && <p className="text-sm text-fil">{product.categoryName}</p>}
        <h3 id={titleId} lang={product.nameLang} className="text-3xl sm:text-4xl">
          <Link href={href} className="decoration-2 underline-offset-6 hover:underline">
            {product.name}
          </Link>
        </h3>
        {product.isSoldOut ? (
          <p className="text-fil">{t.product.soldOutHint}</p>
        ) : (
          <p className="text-xl font-medium text-fouwwa">
            <Price centimes={product.price} lang={lang} />
          </p>
        )}
        <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
          <Button render={<Link href={href} />} variant={product.isSoldOut ? "outline" : "default"}>
            {t.home.viewPiece}
          </Button>
          {!product.isSoldOut && (
            <Button
              variant="link"
              className="h-11 self-start sm:self-auto"
              render={<a href={whatsappUrl(question)} target="_blank" rel="noopener noreferrer" />}
            >
              <MessageCircleIcon data-icon="inline-start" aria-hidden="true" />
              {t.product.askWhatsapp}
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}
