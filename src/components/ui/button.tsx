import {
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { ChainLoader } from "@/components/ui/chain"

const buttonVariants = cva(
  // « Pelote »: round like a ball of wool, flat, no lift. Focus uses the
  // global Framboise outline (globals.css); colour change marks hover.
  "group/button relative inline-flex shrink-0 items-center justify-center rounded-full border border-transparent font-medium whitespace-nowrap transition-colors duration-200 ease-thread select-none focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-framboise disabled:pointer-events-none disabled:cursor-not-allowed aria-busy:pointer-events-none aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4.5",
  {
    variants: {
      variant: {
        // Prune, the main action of a screen, once; Framboise on hover.
        default:
          "bg-primary text-primary-foreground hover:bg-framboise-fonce active:bg-framboise-fonce disabled:bg-dragee disabled:text-mauve",
        // Plum outline: the second action beside the main one.
        outline:
          "border-prune bg-transparent text-foreground hover:bg-dragee active:bg-dragee aria-expanded:bg-dragee disabled:border-border disabled:text-mauve",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_srgb,var(--color-dragee),var(--color-prune)_7%)] aria-expanded:bg-[color-mix(in_srgb,var(--color-dragee),var(--color-prune)_7%)] disabled:text-mauve",
        ghost:
          "text-foreground hover:bg-dragee aria-expanded:bg-dragee disabled:text-mauve",
        destructive:
          "border-grenade bg-transparent text-grenade hover:bg-grenade-pale disabled:border-border disabled:text-mauve",
        link: "h-auto rounded-none p-0 text-framboise underline decoration-1 underline-offset-4 hover:decoration-2 disabled:text-mauve",
      },
      size: {
        // 44–48px tall: comfortable to tap on a 375px phone.
        default:
          "h-12 gap-2.5 px-6 text-base has-data-[icon=inline-end]:pe-5 has-data-[icon=inline-start]:ps-5",
        xs: "h-7 gap-1 px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-10 gap-2 px-4 text-sm has-data-[icon=inline-end]:pe-3.5 has-data-[icon=inline-start]:ps-3.5 [&_svg:not([class*='size-'])]:size-4",
        lg: "h-14 gap-3 px-8 text-lg has-data-[icon=inline-end]:pe-7 has-data-[icon=inline-start]:ps-7",
        icon: "size-11",
        "icon-xs": "size-7 [&_svg:not([class*='size-'])]:size-3.5",
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

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    /**
     * Shows the chain loader before the label and blocks clicks while an
     * action runs. Pass the "in progress" wording as children ("Envoi…").
     */
    loading?: boolean
  }

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
  loading = false,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size, className }))

  if (isValidElement(render) && render.type !== "button") {
    const element = render as ReactElement<
      { className?: string; children?: ReactNode } & Record<string, unknown>
    >
    const rest = { ...props }
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
      disabled={props.disabled || loading}
      focusableWhenDisabled={loading || props.focusableWhenDisabled}
      aria-busy={loading || undefined}
    >
      {loading && <ChainLoader size="sm" decorative />}
      {children}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
