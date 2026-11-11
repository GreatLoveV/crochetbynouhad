"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useI18n } from "@/i18n/client"
import { fill } from "@/i18n/config"

/** The parts of the style guide that need a click: toasts and a busy button. */
export function ToastDemos({ sampleName }: { sampleName: string }) {
  const { t } = useI18n()
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="outline" size="sm" onClick={() => toast.success(fill(t.product.addedToast, { name: sampleName }))}>
        {t.product.addToCart}
      </Button>
      <Button variant="outline" size="sm" onClick={() => toast(fill(t.product.alreadyInCartToast, { name: sampleName }))}>
        {t.product.alreadyInCart}
      </Button>
      <Button variant="outline" size="sm" onClick={() => toast.error(t.checkout.submitError)}>
        {t.checkout.submit}
      </Button>
    </div>
  )
}

export function BusyButtonDemo() {
  const { t } = useI18n()
  const [busy, setBusy] = useState(false)
  return (
    <Button
      loading={busy}
      onClick={() => {
        setBusy(true)
        setTimeout(() => setBusy(false), 2500)
      }}
    >
      {busy ? t.checkout.submitting : t.checkout.submit}
    </Button>
  )
}
