import {
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const buttonVariants = cva(
  // Tailored, not bubbly: softly squared corners and a little letter-spacing.
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-[0.95rem] font-semibold tracking-[0.02em] whitespace-nowrap transition-all duration-300 ease-soft outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4.5",
  {
    variants: {
      variant: {
        // Gold, the one strong colour on the page: reserved for the main action.
        default:
          "bg-primary text-primary-foreground shadow-soft hover:-translate-y-0.5 hover:bg-[color-mix(in_oklch,var(--primary),white_12%)] hover:shadow-lift",
        // Gold hairline on the dark ground: the quiet, secondary action.
        outline:
          "border-primary/45 bg-transparent text-foreground hover:-translate-y-0.5 hover:border-primary hover:bg-primary/10 hover:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:-translate-y-0.5 hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_8%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "text-foreground/80 hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "h-auto rounded-none p-0 text-primary underline-offset-4 hover:underline",
      },
      size: {
        // Minimum height of 44px on default/lg keeps primary CTAs comfortable
        // to tap on a 390px-wide phone.
        default:
          "h-11 gap-2 px-6 has-data-[icon=inline-end]:pe-5 has-data-[icon=inline-start]:ps-5",
        xs: "h-7 gap-1 px-3 text-xs has-data-[icon=inline-end]:pe-2.5 has-data-[icon=inline-start]:ps-2.5 [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-9 gap-1.5 px-4 text-sm has-data-[icon=inline-end]:pe-3.5 has-data-[icon=inline-start]:ps-3.5 [&_svg:not([class*='size-'])]:size-4",
        lg: "h-12 gap-2.5 px-8 text-base has-data-[icon=inline-end]:pe-7 has-data-[icon=inline-start]:ps-7",
        icon: "size-11",
        "icon-xs":
          "size-7 has-data-[icon=inline-end]:pe-2.5 has-data-[icon=inline-start]:ps-2.5 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-9",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type ButtonProps = ButtonPrimitive.Props & VariantProps<typeof buttonVariants>

/**
 * A button — or a link that LOOKS like a button.
 *
 * `<Button render={<Link href="/" />}>` is used all over the shop. Handing a
 * link to Base UI's Button makes it complain (it expects a real <button>), and
 * its `nativeButton={false}` escape hatch adds `role="button"`, so screen
 * readers would announce a link as a button. Instead, when `render` is an
 * element other than <button>, the element is simply styled and kept as the
 * link it is: real link semantics, no Base UI warning.
 */
function Button({
  className,
  variant = "default",
  size = "default",
  render,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size, className }))

  if (isValidElement(render) && render.type !== "button") {
    const element = render as ReactElement<
      { className?: string; children?: ReactNode } & Record<string, unknown>
    >
    const { children, ...rest } = props
    // Button-only behaviour has no meaning on a link.
    for (const key of ["nativeButton", "disabled", "focusableWhenDisabled"]) {
      delete (rest as Record<string, unknown>)[key]
    }
    return cloneElement(element, {
      ...(rest as Record<string, unknown>),
      ...element.props,
      "data-slot": "button",
      className: cn(classes, element.props.className),
      children: children ?? element.props.children,
    })
  }

  return (
    <ButtonPrimitive
      data-slot="button"
      className={classes}
      render={render}
      {...props}
    />
  )
}

export { Button, buttonVariants }
