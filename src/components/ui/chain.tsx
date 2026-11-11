import { cn } from "cn"

/**
 * The crochet chain (« la chaînette »), the site's one ornament.
 *
 * A chain is a row of linked loops worked one after another, so it reads in
 * the direction of the text: left to right in French, right to left in
 * Arabic (mirrored with `rtl:-scale-x-100`, which sets CSS `scale`).
 *
 * It has three jobs and no others:
 * - `Chain`: the divider between the first screen and the pieces.
 * - `ChainLoader`: the only loading indicator.
 * - `.stitch-underline` (globals.css): the current navigation item.
 */

/** Each loop advances 16 units; the thread crosses itself once per loop. */
const LOOP = 16
const HEIGHT = 14

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

type ChainProps = {
  className?: string
  /**
   * Draw the thread once on first paint (about 1.5 s). Reserved for the
   * divider under the home page's first screen. Reduced motion: drawn
   * already complete.
   */
  draw?: boolean
}

export function Chain({ className, draw = false }: ChainProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={`0 0 ${DIVIDER_WIDTH} ${HEIGHT}`}
      preserveAspectRatio="xMinYMid slice"
      className={cn("block h-3.5 w-full text-the rtl:-scale-x-100", className)}
    >
      <path
        d={DIVIDER_PATH}
        pathLength={1}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        className={cn(draw && "chain-draw")}
      />
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
   * are hidden from assistive tech and carry no status role.
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
        size === "sm" ? "h-3 w-auto" : "h-3.5 w-auto",
      )}
    >
      {Array.from({ length: loops }, (_, i) => (
        <path
          key={i}
          d={`M${i * LOOP + 2} 7 C ${i * LOOP + 10} 1, ${i * LOOP + 22} 1, ${i * LOOP + 26} 7 C ${i * LOOP + 22} 13, ${i * LOOP + 10} 13, ${i * LOOP + 18} 7`}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          className="animate-loop-in motion-reduce:animate-none"
          style={{ animationDelay: `${i * 0.16}s` }}
        />
      ))}
    </svg>
  )

  if (decorative) {
    return <span className={cn("inline-flex", className)}>{svg}</span>
  }

  return (
    <span
      role="status"
      className={cn("inline-flex items-center gap-3 text-the", className)}
    >
      {svg}
      {label && <span className="sr-only">{label}</span>}
    </span>
  )
}
