import Image from "next/image"
import type { ReactNode } from "react"
import { cn } from "cn"

import { isOptimizableImageUrl } from "@/lib/constants/images"

/**
 * A photo of Nouhad's work: soft round corners, no border, no shadow. Light
 * text never sits on top of it; badges are solid.
 *
 * Without a photo it shows a block in the yarn `tone` with the piece's name,
 * never a stock image or an icon. While loading (`loading`), the same block
 * without text.
 */
type PhotoProps = {
  src?: string | null
  alt: string
  /** Shown in the empty block when there is no photo yet. */
  emptyLabel?: ReactNode
  /** `lang` of the empty label when it differs from the page (French fallback). */
  emptyLabelLang?: string
  ratio?: "4/5" | "1/1" | "3/2"
  /** The yarn behind the photo, seen while it loads or when there is none. */
  tone?: Tone
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

/** The basket's pale yarns, for tiles and empty photos. Prune reads on all. */
export const tones = {
  dragee: "bg-dragee",
  framboise: "bg-framboise-pale",
  moutarde: "bg-moutarde-pale",
  sauge: "bg-sauge-pale",
} as const
export type Tone = keyof typeof tones
/** Tiles in a grid take the yarns in turn. */
export const toneAt = (i: number): Tone => (["moutarde", "sauge", "framboise"] as const)[i % 3]

export function Photo({
  src,
  alt,
  emptyLabel,
  emptyLabelLang,
  ratio = "4/5",
  tone = "dragee",
  sizes = "(min-width: 1024px) 30vw, 50vw",
  preload = false,
  priority = false,
  loading = false,
  className,
  children,
}: PhotoProps) {
  return (
    <div
      className={cn("relative w-full overflow-hidden rounded-2xl", tones[tone], ratios[ratio], className)}
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
          className="flex size-full items-center justify-center p-6 text-center font-heading text-xl text-prune"
        >
          {emptyLabel}
        </div>
      ) : null}
      {children}
    </div>
  )
}
