import { z } from "zod";

import { madToCentimes } from "@/lib/format/money";

/**
 * Validation for the product form in the admin.
 *
 * Same rule as the checkout: the browser sends whatever it likes, this decides
 * what is actually written.
 */

export const productFormSchema = z.object({
  nameFr: z
    .string()
    .trim()
    .min(2, "Indiquez le nom de la pièce.")
    .max(120, "Nom trop long."),
  // The site is French-only, so the English fields are optional: the action
  // copies the French text when they are left empty (the columns are NOT NULL).
  nameEn: z.string().trim().max(120, "Nom trop long.").optional(),
  descriptionFr: z
    .string()
    .trim()
    .min(10, "Décrivez la pièce en quelques mots.")
    .max(4000, "Description trop longue."),
  descriptionEn: z.string().trim().max(4000, "Description trop longue.").optional(),
  categoryId: z.coerce
    .number({ error: "Choisissez une catégorie." })
    .int("Choisissez une catégorie.")
    .positive("Choisissez une catégorie."),
  // Typed in dirhams ("250" or "250,50") and stored in centimes.
  price: z
    .string()
    .trim()
    .min(1, "Indiquez un prix.")
    .refine((value) => madToCentimes(value) !== null, "Prix invalide.")
    .refine((value) => (madToCentimes(value) ?? 0) > 0, "Le prix doit être supérieur à 0."),
  slug: z
    .string()
    .trim()
    .max(120, "Adresse web trop longue.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Lettres minuscules, chiffres et tirets uniquement (ex : sac-fleur-rose).",
    )
    .optional()
    .or(z.literal("")),
  reference: z
    .string()
    .trim()
    .max(40, "Référence trop longue.")
    .regex(/^[A-Za-z0-9\-]+$/, "Caractères alphanumériques et tirets uniquement.")
    .optional()
    .or(z.literal("")),
  isActive: z.boolean(),
  // No `isSoldOut` here on purpose: the form must never write it. An edit page
  // opened before an order came in would otherwise put a sold bag back on sale
  // when saved. Sold / available are separate, explicit actions.
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export type ProductFormState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
  /** Echoed back so the form keeps what was typed. */
  values?: Record<string, string | boolean>;
};

/**
 * Turns "Sac Fleur Rose" into "sac-fleur-rose": accents dropped, everything else
 * reduced to single dashes.
 */
export function slugify(value: string): string {
  return value
    .normalize("NFD")
    // Combining accents left over after NFD: drop them.
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}