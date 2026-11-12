import type { ReactNode } from "react"
import { CircleAlertIcon, CircleCheckIcon, InfoIcon } from "lucide-react"
import { cn } from "cn"

/**
 * A message inside the page (not a toast): what happened and what to do.
 * A bar on the inline-start edge and an icon mark the tone, so the colour is
 * never the only signal. Errors are announced as alerts, the rest politely.
 */
const tones = {
  info: {
    box: "bg-laine border-trait",
    icon: <InfoIcon aria-hidden="true" className="size-5 text-fil" />,
  },
  success: {
    box: "bg-naanaa-pale border-naanaa",
    icon: <CircleCheckIcon aria-hidden="true" className="size-5 text-naanaa" />,
  },
  error: {
    box: "bg-erreur-pale border-erreur",
    icon: <CircleAlertIcon aria-hidden="true" className="size-5 text-erreur" />,
  },
} as const

type NoticeProps = {
  tone?: keyof typeof tones
  title?: ReactNode
  children?: ReactNode
  /** A button or link: the way out ("Revoir le panier"). */
  action?: ReactNode
  className?: string
}

export function Notice({ tone = "info", title, children, action, className }: NoticeProps) {
  const t = tones[tone]
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn("flex gap-3 rounded-lg border-s-4 px-4 py-3.5 text-sm text-nila", t.box, className)}
    >
      <span className="mt-[0.15em] shrink-0">{t.icon}</span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {title && <p className="font-medium">{title}</p>}
        {children && <div className={cn(title && "text-fil")}>{children}</div>}
        {action && <div className="mt-2">{action}</div>}
      </div>
    </div>
  )
}
