import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const badgeVariants = cva(
  // A small pill label on or beside a photo. Never colour alone: the word
  // says what it means ("Pièce unique", "Vendue", "Bientôt").
  "group/badge inline-flex min-h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2.5 py-0.5 text-xs font-medium whitespace-nowrap focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nila has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        // Kurkum with Nila text (6.9:1): something good to know (one of a kind).
        default: "bg-kurkum text-nila",
        // Laine on a photo: a quiet fact that must stay readable over any image.
        secondary: "bg-laine text-nila",
        // Nila: the piece is gone ("Vendue").
        sold: "bg-nila text-laine",
        destructive: "bg-erreur-pale text-erreur",
        outline: "border-trait text-foreground",
        ghost: "text-fil",
        link: "text-fouwwa underline underline-offset-4",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
