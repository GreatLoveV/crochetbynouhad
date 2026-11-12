import type { ReactNode } from "react"
import { cn } from "cn"

/**
 * Numbered steps, only for content that is really a sequence (how to order:
 * choose, confirm on WhatsApp, pay on delivery). Markazi numerals in plum
 * on a round of pale yarn, one yarn per step; the list is a real <ol>, so the
 * order is announced.
 */
const ROUNDS = ["bg-framboise-pale", "bg-moutarde-pale", "bg-sauge-pale"] as const

export function Steps({ items, className }: { items: ReactNode[]; className?: string }) {
  return (
    <ol className={cn("grid gap-8 sm:grid-cols-3 sm:gap-6", className)}>
      {items.map((item, i) => (
        <li key={i} className="flex flex-col gap-3">
          <span
            aria-hidden="true"
            className={cn(
              "flex size-14 items-center justify-center rounded-full font-heading text-3xl leading-none font-medium text-prune",
              ROUNDS[i % ROUNDS.length],
            )}
          >
            {i + 1}
          </span>
          <div className="text-mauve">{item}</div>
        </li>
      ))}
    </ol>
  )
}
