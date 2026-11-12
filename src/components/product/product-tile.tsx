import Link from "next/link"
import { cn } from "cn"

import { Badge } from "@/components/ui/badge"
import { Photo, tones, type Tone } from "@/components/ui/photo"
import { Price } from "@/components/ui/price"
import { localePath, type Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/dictionaries/fr"
import type { ProductSummary } from "@/lib/data/products"

/**
 * One piece in the grid: the photo on a tile of yarn colour, then the name
 * and the price beneath it. No border or shadow; the whole tile is one link.
 *
 * A sold piece stays, marked "Vendu" in place of its price, because it shows
 * what Nouhad can make. Hover only underlines the name: the photo is left
 * alone (no zoom), it is her work and should look as it is.
 */
export function ProductTile({
  product,
  lang,
  t,
  feature = false,
  sizes,
  priority,
  tone = "moutarde",
}: {
  product: ProductSummary
  lang: Locale
  t: Dictionary
  /** The large tile at the start of the grid (the newest piece). */
  feature?: boolean
  sizes?: string
  priority?: boolean
  /** The tile's yarn; the grid passes `toneAt(i)`. */
  tone?: Tone
}) {
  return (
    <Link
      href={localePath(lang, `/products/${product.slug}`)}
      className={cn("group flex flex-col gap-3", feature && "sm:col-span-2 sm:row-span-2")}
    >
      <div
        className={cn(
          "rounded-[1.5rem] p-2 transition-colors sm:p-2.5",
          tones[tone],
          feature && "sm:flex sm:flex-1 sm:flex-col",
        )}
      >
        <Photo
          src={product.imageUrl}
          // The name below is the link's text; read once, not twice.
          alt=""
          emptyLabel={product.name}
          emptyLabelLang={product.nameLang}
          sizes={
            sizes ?? (feature ? "(min-width: 640px) 60vw, 100vw" : "(min-width: 1024px) 25vw, 50vw")
          }
          priority={priority}
          tone={tone}
          className={cn("rounded-2xl", feature && "sm:aspect-auto sm:flex-1")}
        >
          {product.isSoldOut && (
            <Badge variant="sold" className="absolute top-3 inset-s-3">
              {t.product.soldOut}
            </Badge>
          )}
        </Photo>
      </div>
      <div className="flex flex-col gap-0.5 px-1">
        <h3
          lang={product.nameLang}
          className={cn(
            "font-heading leading-snug decoration-1 underline-offset-4 group-hover:underline",
            feature ? "text-2xl" : "text-xl",
          )}
        >
          {product.name}
        </h3>
        {product.isSoldOut ? (
          <p className="text-sm text-mauve">{t.product.soldOutHint}</p>
        ) : (
          <p className="text-sm">
            <Price centimes={product.price} lang={lang} />
          </p>
        )}
      </div>
    </Link>
  )
}

/** The tile while the grid loads: the photo block and two short lines. */
export function ProductTileSkeleton({ feature = false }: { feature?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={cn("flex flex-col gap-3", feature && "sm:col-span-2 sm:row-span-2")}
    >
      <div
        className={cn(
          "rounded-[1.5rem] bg-dragee p-2 sm:p-2.5",
          feature && "sm:flex sm:flex-1 sm:flex-col",
        )}
      >
        <Photo
          alt=""
          loading
          tone="framboise"
          className={cn(feature && "sm:aspect-auto sm:flex-1")}
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="h-5 w-2/3 rounded-full bg-dragee" />
        <span className="h-4 w-1/3 rounded-full bg-dragee" />
      </div>
    </div>
  )
}
