import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import {
  ProductForm,
  type ProductFormDefaults,
} from "@/components/admin/product-form";
import { getAdminCategories } from "@/lib/data/admin-products";
import { requireAdmin } from "@/lib/auth/admin";
import { strings } from "@/lib/constants/strings";

export const metadata = { title: "Nouvelle pièce — Administration" };

export default async function NewProductPage() {
  await requireAdmin();

  const categories = await getAdminCategories();

  const defaults: ProductFormDefaults = {
    nameFr: "",
    nameEn: "",
    descriptionFr: "",
    descriptionEn: "",
    categoryId: "",
    price: 0,
    slug: "",
    reference: "",
    isActive: true,
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" />
          {strings.admin.backToProducts}
        </Link>
        <h1 className="text-2xl font-semibold">{strings.admin.newProduct}</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <ProductForm categories={categories} defaults={defaults} />
        <aside className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
          Les photos s’ajoutent depuis la page de la pièce, une fois
          enregistrée.
        </aside>
      </div>
    </div>
  );
}