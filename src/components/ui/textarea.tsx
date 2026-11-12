import * as React from "react"
import { cn } from "cn"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-28 w-full min-w-0 rounded-md border border-input bg-laine px-3.5 py-3 text-base text-foreground transition-colors duration-200 ease-thread file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-fil hover:border-nila focus-visible:border-fouwwa focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nila disabled:cursor-not-allowed disabled:border-border disabled:bg-rose-fonce disabled:text-fil aria-invalid:border-erreur aria-invalid:shadow-[inset_0_0_0_1px_var(--color-erreur)] aria-invalid:focus-visible:outline-erreur",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
