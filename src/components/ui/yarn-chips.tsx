import { cn } from "cn"

import type { Dictionary } from "@/i18n/dictionaries/fr"

/**
 * The yarn colours of a piece: round chips with their dye names, so colour is
 * never the only signal. A list, so screen readers hear "Couleurs de laine,
 * list, 3 items: Fouwwa, Kurkum, Laine".
 *
 * The chips are fixed palette colours. A piece's real yarn may differ a
 * little; the name says which dye family it belongs to.
 */
export type YarnColour = keyof Dictionary["colours"]

const swatch: Record<YarnColour, string> = {
  rose: "bg-rose",
  laine: "bg-laine",
  barqouq: "bg-barqouq",
  fouwwa: "bg-fouwwa",
  naanaa: "bg-naanaa",
  kurkum: "bg-kurkum",
}

type YarnChipsProps = {
  colours: YarnColour[]
  t: Pick<Dictionary, "colours" | "product">
  /** Unique per page when several pieces show their chips. */
  id?: string
  className?: string
}

export function YarnChips({ colours, t, id = "yarn-colours", className }: YarnChipsProps) {
  if (colours.length === 0) return null
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <p id={id} className="text-sm text-fil">
        {t.product.yarnColours}
      </p>
      <ul aria-labelledby={id} className="flex flex-wrap gap-x-4 gap-y-2">
        {colours.map((c) => (
          <li key={c} className="flex items-center gap-2 text-sm">
            <span
              aria-hidden="true"
              className={cn("size-5 rounded-full border-2 border-laine ring-1 ring-trait", swatch[c])}
            />
            {t.colours[c]}
          </li>
        ))}
      </ul>
    </div>
  )
}
