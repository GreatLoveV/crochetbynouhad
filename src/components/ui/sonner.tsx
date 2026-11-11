"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, CircleAlertIcon } from "lucide-react"

import { ChainLoader } from "@/components/ui/chain"

/**
 * Toasts confirm an action the visitor just took ("Ajouté au panier"). They
 * float, so they are one of the few things with a shadow. The icon colour
 * repeats what the words say; it never carries the meaning alone.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-the" />,
        info: <InfoIcon className="size-4 text-fil" />,
        warning: <TriangleAlertIcon className="size-4 text-encre" />,
        error: <CircleAlertIcon className="size-4 text-grenade" />,
        loading: <ChainLoader size="sm" decorative />,
      }}
      style={
        {
          "--normal-bg": "var(--color-coton)",
          "--normal-text": "var(--color-encre)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast font-sans text-sm! shadow-lift!",
          error: "border-grenade/40!",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
