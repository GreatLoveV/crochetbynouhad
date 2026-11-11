import { cn } from "cn"

import type { Locale } from "@/i18n/config"
import { formatPrice } from "@/lib/format/money"

/**
 * A price, always through `formatPrice` (centimes in, one formatting rule),
 * isolated with <bdi> so "250,00 د.م." keeps its order inside Arabic text.
 */
export function Price({
  centimes,
  lang,
  className,
}: {
  centimes: number
  lang: Locale
  className?: string
}) {
  return <bdi className={cn("font-normal whitespace-nowrap", className)}>{formatPrice(centimes, lang)}</bdi>
}
