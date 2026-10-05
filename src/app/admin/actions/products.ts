"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { products } from "@/db/schema";
import { getAdmin } from "@/lib/admin";
import {
  createProduct,
  isAllowedImageUrl,
  addProductImage as insertProductImage,
  moveProductImage as shiftProductImage,
  removeProductImage as deleteProductImage,
  resolveProductSlug,
  setProductActive,
  toProductInput,
  updateProduct,
} from "@/lib/admin-products";
import { madToCentimes } from "@/lib/money";
import { productFormSchema, type ProductFormState } from "@/lib/product-form";
import { strings } from "@/lib/strings";

/**
 * Everything the admin can change about a product.
 *
 * Every action starts with `getAdmin()`. `src/proxy.ts` already redirects
 * signed-out visitors, but a server action is a POST to the page it is used on,
 * so that redirect can be bypassed — this is the check that actually counts.
 */

function unauthorized(): ProductFormState {
  return { status: "error", message: strings.admin.errorGeneric };
}

function formValues(formData: FormData) {
  return {
    nameFr: String(formData.get("nameFr") ?? ""),
    nameEn: String(formData.get("nameEn") ?? ""),
    descriptionFr: String(formData.get("descriptionFr") ?? ""),
    descriptionEn: String(formData.get("descriptionEn") ?? ""),
    categoryId: String(formData.get("categoryId") ?? ""),
    price: String(formData.get("price") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    isActive: formData.get("isActive") === "on",
  };
}

/** Creates or updates one piece, depending on whether the form carries an id. */
export async function saveProduct(
  _previous: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  if (!(await getAdmin())) return unauthorized();

  const values = formValues(formData);
  const parsed = productFormSchema.safeParse(values);
  if (!parsed.success) {
    return {
      status: "error",
      message: strings.admin.fixErrors,
      values,
      fieldErrors: toFieldErrors(parsed.error),
    };
  }

  const data = parsed.data;
  const price = madToCentimes(data.price);
  if (price === null) {
    return { status: "error", message: strings.admin.fixErrors, values };
  }

  const productId = Number(formData.get("productId"));
  const editing = Number.isInteger(productId) && productId > 0;

  try {
    if (editing) {
      const exists = await db.query.products.findFirst({
        where: eq(products.id, productId),
        columns: { id: true },
      });
      if (!exists) {
        return { status: "error", message: strings.admin.errorNotFound, values };
      }
    }

    const resolved = await resolveProductSlug({
      slug: data.slug ?? "",
      nameFr: data.nameFr,
      productId: editing ? productId : undefined,
    });
    if (!resolved.ok) {
      return { status: "error", message: strings.admin.errorSlugTaken, values };
    }

    const input = toProductInput(data, price, resolved.slug);

    if (editing) {
      const previousSlug = await updateProduct(productId, input);

      revalidatePath("/admin/products");
      revalidatePath("/");
      revalidatePath(`/products/${resolved.slug}`);
      // A renamed piece leaves its old public URL behind.
      if (previousSlug && previousSlug !== resolved.slug) {
        revalidatePath(`/products/${previousSlug}`);
      }
      return { status: "idle", values, message: strings.admin.updated };
    }

    await createProduct(input);

    revalidatePath("/");
    revalidatePath("/admin/products");
    return { status: "idle", values, message: strings.admin.created };
  } catch (error) {
    console.error("[saveProduct]", error);
    return { status: "error", message: strings.admin.errorGeneric, values };
  }
}

/**
 * Shows or hides a piece from the shop.
 *
 * There is no delete: products are referenced by past orders, and a customer
 * who remembers an order number must still be able to read it.
 */
export async function toggleProductActive(formData: FormData): Promise<void> {
  if (!(await getAdmin())) return;

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id < 1) return;

  const current = await db.query.products.findFirst({
    where: eq(products.id, id),
    columns: { isActive: true },
  });
  if (!current) return;

  const updated = await setProductActive(id, !current.isActive);
  if (!updated) return;

  revalidatePath("/");
  revalidatePath("/admin/products");
  revalidatePath(`/products/${updated.slug}`);
}

export async function addProductImage(formData: FormData): Promise<void> {
  if (!(await getAdmin())) return;

  const productId = Number(formData.get("id"));
  const url = String(formData.get("url") ?? "").trim();
  if (!Number.isInteger(productId) || productId < 1) return;
  if (!isAllowedImageUrl(url)) return;

  await insertProductImage(productId, url);

  revalidatePath("/admin/products");
}

export async function removeProductImage(formData: FormData): Promise<void> {
  if (!(await getAdmin())) return;

  const imageId = Number(formData.get("imageId"));
  if (!Number.isInteger(imageId) || imageId < 1) return;

  await deleteProductImage(imageId);

  revalidatePath("/admin/products");
}

export async function moveProductImage(formData: FormData): Promise<void> {
  if (!(await getAdmin())) return;

  const imageId = Number(formData.get("imageId"));
  const direction = String(formData.get("direction"));
  if (!Number.isInteger(imageId) || imageId < 1) return;
  if (direction !== "up" && direction !== "down") return;

  if (!(await shiftProductImage(imageId, direction))) return;

  revalidatePath("/admin/products");
}

function toFieldErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? "form");
    fieldErrors[field] ??= issue.message;
  }
  return fieldErrors;
}