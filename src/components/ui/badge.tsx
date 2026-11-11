import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const badgeVariants = cva(
  // A small square label on or beside a photo. Never colour alone: the word
  // says what it means ("Pièce unique", "Vendue", "Bientôt").
  "group/badge inline-flex min-h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-sm border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-the has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        // Thé on its pale tint: something good to know (one of a kind, new).
        default: "bg-the-pale text-the-fonce",
        // Coton on a photo: a quiet fact that must stay readable over any image.
        secondary: "bg-coton text-encre",
        // Ink: the piece is gone ("Vendue").
        sold: "bg-encre text-coton",
        destructive: "bg-grenade-pale text-grenade",
        outline: "border-trait text-foreground",
        ghost: "text-fil",
        link: "text-the underline underline-offset-4",
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
