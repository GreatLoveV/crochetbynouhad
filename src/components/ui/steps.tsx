import type { ReactNode } from "react"
import { cn } from "cn"

/**
 * Numbered steps, only for content that is really a sequence (how to order:
 * choose, confirm on WhatsApp, pay on delivery). Markazi numerals in Thé
 * above a hairline; the list is a real <ol>, so the order is announced.
 */
export function Steps({ items, className }: { items: ReactNode[]; className?: string }) {
  return (
    <ol className={cn("grid gap-8 sm:grid-cols-3 sm:gap-6", className)}>
      {items.map((item, i) => (
        <li key={i} className="flex flex-col gap-2 border-t border-trait pt-4">
          <span aria-hidden="true" className="font-heading text-3xl leading-none font-medium text-the">
            {i + 1}
          </span>
          <div className="text-fil">{item}</div>
        </li>
      ))}
    </ol>
  )
}
