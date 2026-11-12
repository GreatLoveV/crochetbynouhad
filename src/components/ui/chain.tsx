import { useId } from "react"
import { cn } from "cn"

/**
 * The crochet chain (« la chaînette »), the site's star motif.
 *
 * A chain is a row of linked loops worked one after another, so it reads in
 * the direction of the text: left to right in French, right to left in
 * Arabic (mirrored with `rtl:-scale-x-100`, which sets CSS `scale`). Each
 * loop is worked in the next yarn of the basket: Framboise, Moutarde, Sauge.
 *
 * It has three jobs:
 * - `Chain`: the thread between page sections.
 * - `ChainLoader`: the only loading indicator.
 * - `.stitch-underline` (globals.css): the current navigation item.
 */

/** Each loop advances 16 units; the thread crosses itself once per loop. */
const LOOP = 16
const HEIGHT = 14

/** The basket, in the order the loops are worked. */
const YARNS = ["text-framboise", "text-moutarde", "text-sauge"] as const

function loopPath(i: number) {
  const x = i * LOOP
  return `M${x + 2} 7 C ${x + 10} 1, ${x + 22} 1, ${x + 26} 7 C ${x + 22} 13, ${x + 10} 13, ${x + 18} 7`
}

/** One continuous path through every loop, used to draw the thread. */
function chainPath(loops: number) {
  let d = "M2 7"
  for (let i = 0; i < loops; i++) {
    const x = 10 + i * LOOP
    d += ` C ${x} 1, ${x + 12} 1, ${x + 16} 7 C ${x + 12} 13, ${x} 13, ${x + 8} 7`
  }
  return d
}

/** Long enough for a 2400px-wide screen; `slice` crops it to the box. */
const DIVIDER_LOOPS = 150
const DIVIDER_PATH = chainPath(DIVIDER_LOOPS)
const DIVIDER_WIDTH = 10 + DIVIDER_LOOPS * LOOP
const DIVIDER_LOOP_PATHS = YARNS.map((_, c) =>
  Array.from({ length: Math.ceil((DIVIDER_LOOPS - c) / YARNS.length) }, (_, k) =>
    loopPath(c + k * YARNS.length),
  ).join(" "),
)

const STROKE = 2.2

type ChainProps = {
  className?: string
  /**
   * Draw the thread once on first paint (about 1.5 s). Reserved for the
   * thread under the home page's first screen. Reduced motion: drawn
   * already complete.
   */
  draw?: boolean
}

export function Chain({ className, draw = false }: ChainProps) {
  const maskId = useId()
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={`0 0 ${DIVIDER_WIDTH} ${HEIGHT}`}
      preserveAspectRatio="xMinYMid slice"
      className={cn("block h-4 w-full rtl:-scale-x-100", className)}
    >
      {draw && (
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={DIVIDER_WIDTH} height={HEIGHT}>
          <path
            d={DIVIDER_PATH}
            pathLength={1}
            fill="none"
            stroke="white"
            strokeWidth={STROKE + 2}
            strokeLinecap="round"
            className="chain-draw"
          />
        </mask>
      )}
      {/* One path per yarn, holding every third loop: three nodes, not 150. */}
      <g mask={draw ? `url(#${maskId})` : undefined} fill="none" strokeWidth={STROKE} strokeLinecap="round">
        {DIVIDER_LOOP_PATHS.map((d, c) => (
          <path key={c} d={d} stroke="currentColor" className={YARNS[c]} />
        ))}
      </g>
    </svg>
  )
}

type ChainLoaderProps = {
  className?: string
  size?: "sm" | "md"
  /** Accessible name, in the page's language (`t.common.loading`). */
  label?: string
  /**
   * Inside a busy button, which already says what is happening: the loops
   * are hidden from assistive tech and carry no status role, and take the
   * button's own colour.
   */
  decorative?: boolean
}

/**
 * Five loops that light up one after another, in reading direction, like a
 * chain being worked. Reduced motion: all five are shown, still.
 */
export function ChainLoader({
  className,
  size = "md",
  label,
  decorative = false,
}: ChainLoaderProps) {
  const loops = 5
  const svg = (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={`0 0 ${10 + loops * LOOP} ${HEIGHT}`}
      className={cn(
        "shrink-0 rtl:-scale-x-100",
        size === "sm" ? "h-3 w-auto" : "h-4 w-auto",
      )}
    >
      {Array.from({ length: loops }, (_, i) => (
        <path
          key={i}
          d={loopPath(i)}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          className={cn(
            "animate-loop-in motion-reduce:animate-none",
            !decorative && YARNS[i % YARNS.length],
          )}
          style={{ animationDelay: `${i * 0.16}s` }}
        />
      ))}
    </svg>
  )

  if (decorative) {
    return <span className={cn("inline-flex", className)}>{svg}</span>
  }

  return (
    <span role="status" className={cn("inline-flex items-center gap-3", className)}>
      {svg}
      {label && <span className="sr-only">{label}</span>}
    </span>
  )
}
