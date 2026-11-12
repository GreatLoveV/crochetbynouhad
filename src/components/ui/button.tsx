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
  // « Fouwwa »: flat pills, no lift. Focus uses the global Barqouq outline
  // (globals.css); a darker fill or a Laine wash marks hover. A press shrinks
  // the pill by 3 % (none with reduced motion).
  "group/button relative inline-flex shrink-0 items-center justify-center rounded-full border border-transparent font-medium whitespace-nowrap transition-[color,background-color,border-color,scale] duration-150 ease-thread select-none motion-safe:active:not-aria-busy:scale-[0.97] focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-barqouq disabled:pointer-events-none disabled:cursor-not-allowed aria-busy:pointer-events-none aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4.5",
  {
    variants: {
      variant: {
        // Fouwwa: the main action of a screen, once.
        default:
          "bg-primary text-primary-foreground hover:bg-fouwwa-fonce active:bg-fouwwa-fonce disabled:bg-rose-fonce disabled:text-fil",
        // Barqouq outline: the second action beside the main one.
        outline:
          "border-barqouq bg-transparent text-foreground hover:bg-laine active:bg-laine aria-expanded:bg-laine disabled:border-border disabled:text-fil",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-rose-fonce aria-expanded:bg-rose-fonce disabled:text-fil",
        ghost:
          "text-foreground hover:bg-laine aria-expanded:bg-laine disabled:text-fil",
        destructive:
          "border-erreur bg-transparent text-erreur hover:bg-erreur-pale disabled:border-border disabled:text-fil",
        // On a dark band (Naanaa, Barqouq): Laine fill, or a Laine outline.
        inverse:
          "bg-laine text-barqouq hover:bg-rose active:bg-rose disabled:opacity-60",
        "inverse-outline":
          "border-laine bg-transparent text-laine hover:bg-laine/10 active:bg-laine/15 disabled:opacity-60",
        link: "h-auto rounded-none p-0 text-fouwwa underline decoration-1 underline-offset-4 hover:decoration-2 disabled:text-fil",
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
