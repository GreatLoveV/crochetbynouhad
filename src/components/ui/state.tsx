import type { ReactNode } from "react"
import { cn } from "cn"

import { ChainLoader } from "@/components/ui/chain"

/**
 * Whole-area states: nothing here yet, still loading, or failed to load.
 * They are the only centred blocks on the site. Each says what is going on
 * and offers the next step; none apologises or jokes.
 */

type StateProps = {
  title: ReactNode
  body?: ReactNode
  /** Buttons or links, main action first. */
  actions?: ReactNode
  className?: string
  /** Heading level, to fit the page outline. */
  as?: "h1" | "h2" | "h3"
}

/** Nothing to show: an empty cart, an empty category. */
export function EmptyState({ title, body, actions, className, as: H = "h2" }: StateProps) {
  return (
    <div className={cn("mx-auto flex max-w-prose flex-col items-center gap-4 px-4 py-16 text-center", className)}>
      {/* A short length of chain, waiting for its first stitch. */}
      <svg aria-hidden="true" viewBox="0 0 74 14" className="h-5 w-auto text-kurkum rtl:-scale-x-100">
        <path
          d="M2 7 C 10 1, 22 1, 26 7 C 22 13, 10 13, 18 7 C 26 1, 38 1, 42 7 C 38 13, 26 13, 34 7 C 42 1, 54 1, 58 7 C 54 13, 42 13, 50 7 L 72 7"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
        />
      </svg>
      <H className={H === "h1" ? "text-3xl sm:text-4xl" : "text-2xl"}>{title}</H>
      {body && <p className="text-fil">{body}</p>}
      {actions && <div className="mt-2 flex flex-wrap justify-center gap-3">{actions}</div>}
    </div>
  )
}

/** Still loading: the chain loader, with its label for screen readers. */
export function LoadingState({ label, className }: { label: string; className?: string }) {
  return (
    <div className={cn("flex min-h-40 items-center justify-center py-16", className)}>
      <ChainLoader label={label} />
    </div>
  )
}

/** Failed to load: what failed, and a way to try again or get help. */
export function ErrorState({ title, body, actions, className, as: H = "h2" }: StateProps) {
  return (
    <div
      role="alert"
      className={cn("mx-auto flex max-w-prose flex-col items-center gap-4 px-4 py-16 text-center", className)}
    >
      {/* The same chain, broken: one loop has come undone. */}
      <svg aria-hidden="true" viewBox="0 0 74 14" className="h-5 w-auto text-erreur rtl:-scale-x-100">
        <path
          d="M2 7 C 10 1, 22 1, 26 7 C 22 13, 10 13, 18 7 C 26 1, 38 1, 42 7 C 38 13, 26 13, 34 7 M 48 9 C 54 13, 60 5, 72 7"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
        />
      </svg>
      <H className={H === "h1" ? "text-3xl sm:text-4xl" : "text-2xl"}>{title}</H>
      {body && <p className="text-fil">{body}</p>}
      {actions && <div className="mt-2 flex flex-wrap justify-center gap-3">{actions}</div>}
    </div>
  )
}
