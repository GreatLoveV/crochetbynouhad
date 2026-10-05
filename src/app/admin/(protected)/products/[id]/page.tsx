import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

import { ProductImageManager } from "@/components/admin/product-image-manager";
import { ProductForm } from "@/components/admin/product-form";
import { getAdminCategories, getAdminProduct } from "@/lib/admin-products";
import { formatPrice } from "@/lib/money";
import { strings } from "@/lib/strings";

export const metadata = { title: "Modifier la pièce — Administration" };

export default async function EditProductPage({
  params,
}: PageProps<"/admin/products/[id]">) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId) || productId < 1) notFound();

  // Both reads in parallel: no reason to wait for the categories first.
  const [product, categories] = await Promise.all([
    getAdminProduct(productId),
    getAdminCategories(),
  ]);

  if (!product) notFound();

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
        <div className="flex flex-wrap items-baseline gap-3">
          <h1 className="text-2xl font-semibold">{product.nameFr}</h1>
          <span className="text-sm text-muted-foreground tabular-nums">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <ProductForm
          categories={categories}
          defaults={{
            id: product.id,
            nameFr: product.nameFr,
            nameEn: product.nameEn,
            descriptionFr: product.descriptionFr,
            descriptionEn: product.descriptionEn,
            categoryId: product.categoryId,
            price: product.price,
            slug: product.slug,
            isActive: product.isActive,
          }}
        />

        <aside className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold">{strings.admin.images}</h2>
          <ProductImageManager
            productId={product.id}
            images={product.images}
          />
        </aside>
      </div>
    </div>
  );
}