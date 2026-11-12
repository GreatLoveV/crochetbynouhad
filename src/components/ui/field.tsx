import type { ReactNode } from "react"
import { CircleAlertIcon } from "lucide-react"
import { cn } from "cn"

import { Label } from "@/components/ui/label"

/**
 * A form field: label above, control, then a hint or an error below.
 *
 * The control is passed as a render function so it receives the ids it must
 * point at (`aria-describedby`) and `aria-invalid`. The error replaces the
 * hint, is announced, and starts with an icon so it never relies on red.
 *
 *   <Field id="phone" label="Téléphone" hint="…" error={errors.phone}>
 *     {(p) => <Input {...p} name="phone" type="tel" />}
 *   </Field>
 */
type ControlProps = {
  id: string
  "aria-describedby"?: string
  "aria-invalid"?: true
}

type FieldProps = {
  id: string
  label: ReactNode
  /** Shown after the label, quieter: "(facultatif)". */
  optional?: ReactNode
  hint?: ReactNode
  error?: ReactNode
  className?: string
  children: (control: ControlProps) => ReactNode
}

export function Field({ id, label, optional, hint, error, className, children }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [errorId ?? hintId].filter(Boolean).join(" ") || undefined

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={id}>
        {label}
        {optional && <span className="font-normal text-fil">{optional}</span>}
      </Label>
      {children({
        id,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
      })}
      {error ? <FieldError id={errorId!}>{error}</FieldError> : hint && <FieldHint id={hintId!}>{hint}</FieldHint>}
    </div>
  )
}

export function FieldHint({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="text-sm text-fil">
      {children}
    </p>
  )
}

export function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} role="alert" className="flex items-start gap-1.5 text-sm text-erreur">
      <CircleAlertIcon aria-hidden="true" className="mt-[0.2em] size-4 shrink-0" />
      <span>{children}</span>
    </p>
  )
}
