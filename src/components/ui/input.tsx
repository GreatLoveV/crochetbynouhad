import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-md border border-input bg-background px-3.5 py-2 text-base text-foreground transition-colors duration-200 ease-thread file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-mauve hover:border-prune focus-visible:border-framboise focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-framboise disabled:cursor-not-allowed disabled:border-border disabled:bg-dragee disabled:text-mauve aria-invalid:border-grenade aria-invalid:shadow-[inset_0_0_0_1px_var(--color-grenade)] aria-invalid:focus-visible:outline-grenade",
        className
      )}
      {...props}
    />
  )
}

export { Input }
