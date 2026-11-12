import Image from "next/image"
import type { ReactNode } from "react"
import { cn } from "cn"

import { isOptimizableImageUrl } from "@/lib/constants/images"

/**
 * A photo of Nouhad's work: 24px corners on an undyed-wool (Laine) ground, so
 * the rose page never tints the yarn. No border, no shadow. Text never sits
 * on top of it; badges are solid pills.
 *
 * Without a photo it shows the Laine block with a faint row of chain stitches
 * and the piece's name, never a stock image or an icon. While loading
 * (`loading`), the same block, softly pulsing (still with reduced motion).
 */
type PhotoProps = {
  src?: string | null
  alt: string
  /** Shown in the empty block when there is no photo yet. */
  emptyLabel?: ReactNode
  /** `lang` of the empty label when it differs from the page (French fallback). */
  emptyLabelLang?: string
  ratio?: "4/5" | "1/1" | "3/2"
  sizes?: string
  /**
   * The one photo that is the page's largest element (hero, product page):
   * Next 16 puts a `<link rel=preload>` in the head for it.
   */
  preload?: boolean
  /** Above the fold but not the main photo: fetched eagerly and early. */
  priority?: boolean
  loading?: boolean
  className?: string
  /** Badges and other overlays, placed by the caller. */
  children?: ReactNode
}

const ratios = { "4/5": "aspect-4/5", "1/1": "aspect-square", "3/2": "aspect-3/2" } as const

export function Photo({
  src,
  alt,
  emptyLabel,
  emptyLabelLang,
  ratio = "4/5",
  sizes = "(min-width: 1024px) 30vw, 50vw",
  preload = false,
  priority = false,
  loading = false,
  className,
  children,
}: PhotoProps) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-photo bg-laine",
        (!src || loading) && "photo-stitches",
        loading && "animate-pulse motion-reduce:animate-none",
        ratios[ratio],
        className,
      )}
      aria-busy={loading || undefined}
    >
      {src && !loading ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          {...(preload ? { preload: true } : priority ? { loading: "eager", fetchPriority: "high" } : {})}
          className="object-cover"
          unoptimized={!isOptimizableImageUrl(src)}
        />
      ) : !loading && emptyLabel ? (
        <div
          lang={emptyLabelLang}
          className="flex size-full items-center justify-center p-6 text-center font-heading text-xl text-nila"
        >
          {emptyLabel}
        </div>
      ) : null}
      {children}
    </div>
  )
}
