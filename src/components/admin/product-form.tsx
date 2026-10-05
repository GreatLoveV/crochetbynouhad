"use client";

import { useActionState, type ReactNode } from "react";
import { Loader2Icon } from "lucide-react";

import { saveProduct } from "@/app/admin/actions/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { slugify, type ProductFormState } from "@/lib/product-form";
import { strings } from "@/lib/strings";

type Category = { id: number; nameFr: string };

export type ProductFormDefaults = {
  id?: number;
  nameFr: string;
  nameEn: string;
  descriptionFr: string;
  descriptionEn: string;
  categoryId: number | "";
  /** Stored in centimes; shown to Nouhad in dirhams. */
  price: number;
  slug: string;
  isActive: boolean;
};

const initialState: ProductFormState = { status: "idle" };

export function ProductForm({
  categories,
  defaults,
}: {
  categories: Category[];
  defaults: ProductFormDefaults;
}) {
  const [state, formAction, pending] = useActionState(saveProduct, initialState);
  const errors = state.fieldErrors ?? {};
  // On a failed save the server sends back what was typed, so nothing is lost.
  const kept = state.values;

  const value = (field: string, fallback: string) => {
    const keptValue = kept?.[field];
    return typeof keptValue === "string" ? keptValue : fallback;
  };

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {defaults.id ? (
        <input type="hidden" name="productId" value={defaults.id} />
      ) : null}

      {state.message ? (
        <p
          role="alert"
          className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {state.message}
        </p>
      ) : null}

      <div className="flex flex-col gap-5">
        <Field id="nameFr" label={strings.admin.productName} error={errors.nameFr}>
          {(props) => (
            <Input
              {...props}
              name="nameFr"
              defaultValue={value("nameFr", defaults.nameFr)}
              placeholder={strings.admin.productNamePlaceholder}
            />
          )}
        </Field>

        <Field
          id="nameEn"
          label="Nom (anglais)"
          hint="Optionnel —repris du nom français si vide."
          error={errors.nameEn}
        >
          {(props) => (
            <Input
              {...props}
              name="nameEn"
              defaultValue={value("nameEn", defaults.nameEn)}
            />
          )}
        </Field>

        <Field
          id="descriptionFr"
          label={strings.admin.productDescription}
          error={errors.descriptionFr}
        >
          {(props) => (
            <Textarea
              {...props}
              name="descriptionFr"
              rows={5}
              defaultValue={value("descriptionFr", defaults.descriptionFr)}
              placeholder={strings.admin.productDescriptionPlaceholder}
            />
          )}
        </Field>

        <Field
          id="descriptionEn"
          label="Description (anglais)"
          hint="Optionnel — reprise du français si vide."
          error={errors.descriptionEn}
        >
          {(props) => (
            <Textarea
              {...props}
              name="descriptionEn"
              rows={3}
              defaultValue={value("descriptionEn", defaults.descriptionEn)}
            />
          )}
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            id="categoryId"
            label={strings.admin.productCategory}
            error={errors.categoryId}
          >
            {(props) => (
              <select
                {...props}
                name="categoryId"
                defaultValue={String(
                  value("categoryId", String(defaults.categoryId)),
                )}
                className="h-11 w-full rounded-xl border border-input bg-card px-3.5 text-base transition-all duration-300 ease-soft outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 md:text-sm"
              >
                <option value="">—</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nameFr}
                  </option>
                ))}
              </select>
            )}
          </Field>

          <Field
            id="price"
            label={strings.admin.productPrice}
            hint={strings.admin.productPriceHint}
            error={errors.price}
          >
            {(props) => (
              <Input
                {...props}
                name="price"
                inputMode="decimal"
                defaultValue={value(
                  "price",
                  defaults.price ? String(defaults.price / 100) : "",
                )}
                placeholder="250"
              />
            )}
          </Field>
        </div>

        <Field
          id="slug"
          label={strings.admin.productSlug}
          hint={`Laisser vide pour utiliser « ${slugify(
            String(value("nameFr", defaults.nameFr) || "piece"),
          )} ».`}
          error={errors.slug}
        >
          {(props) => (
            <Input
              {...props}
              name="slug"
              defaultValue={value("slug", defaults.slug)}
              placeholder="sac-fleur-rose"
            />
          )}
        </Field>

        <Separator />

        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={
              kept?.isActive === undefined
                ? defaults.isActive
                : Boolean(kept.isActive)
            }
            className="mt-0.5 size-5 accent-primary"
          />
          <span className="flex flex-col gap-1">
            <span className="text-sm font-medium">
              {strings.admin.productActive}
            </span>
            <span className="text-xs text-muted-foreground">
              {strings.admin.productActiveHint}
            </span>
          </span>
        </label>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? (
            <>
              <Loader2Icon className="animate-spin" />
              {strings.admin.saving}
            </>
          ) : (
            strings.admin.save
          )}
        </Button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: (props: {
    id: string;
    "aria-invalid": boolean;
    "aria-describedby": string | undefined;
  }) => ReactNode;
}) {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children({
        id,
        "aria-invalid": Boolean(error),
        "aria-describedby": describedBy,
      })}
      {error ? (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}