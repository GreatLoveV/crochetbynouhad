import Link from "next/link";
import Image from "next/image";
import { PlusIcon } from "lucide-react";

import { toggleProductActive } from "@/app/admin/actions/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAdminProducts } from "@/lib/data/admin-products";
import { formatPrice } from "@/lib/format/money";
import { strings } from "@/lib/constants/strings";

export default async function AdminProductsPage() {
  // The protected layout already ran `requireAdmin()`; this page only reads.
  const products = await getAdminProducts();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">{strings.admin.products}</h1>
          <p className="text-sm text-muted-foreground">
            {products.length} pièce{products.length > 1 ? "s" : ""} ·{" "}
            {products.filter((product) => product.isActive).length} visible
          </p>
        </div>
        <Button render={<Link href="/admin/products/new" />}>
          <PlusIcon />
          {strings.admin.newProduct}
        </Button>
      </div>

      {products.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          {strings.admin.noProducts}
        </p>
      ) : (
        <div className="rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Photo</TableHead>
                <TableHead>{strings.admin.productName}</TableHead>
                <TableHead className="hidden sm:table-cell">
                  {strings.admin.productCategory}
                </TableHead>
                <TableHead className="text-right">
                  {strings.admin.productPrice}
                </TableHead>
                <TableHead className="w-28 text-right">Visibilité</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="relative size-11 overflow-hidden rounded-lg bg-muted">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt=""
                          fill
                          sizes="44px"
                          className="object-cover"
                          unoptimized
                        />
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">{product.nameFr}</span>
                      <span className="text-xs text-muted-foreground">
                        /{product.slug}
                      </span>
                      {product.reference ? (
                        <span className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
                          {product.reference}
                        </span>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground sm:table-cell">
                    {product.categoryNameFr}
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {formatPrice(product.price)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-wrap justify-end gap-1">
                      <Badge
                        variant={product.isActive ? "default" : "secondary"}
                      >
                        {product.isActive ? "En ligne" : "Retirée"}
                      </Badge>
                      {product.isUnique && product.isSoldOut ? (
                        <Badge variant="secondary">{strings.product.soldOut}</Badge>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        render={
                          <Link href={`/admin/products/${product.id}`} />
                        }
                      >
                        {strings.admin.editProduct}
                      </Button>
                      <ToggleActiveButton
                        id={product.id}
                        isActive={product.isActive}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

/**
 * A form button because the action is a Server Action: the product id travels
 * in the body, hidden input, never as a query string.
 */
function ToggleActiveButton({
  id,
  isActive,
}: {
  id: number;
  isActive: boolean;
}) {
  return (
    <form action={toggleProductActive}>
      <input type="hidden" name="id" value={id} />
      <Button size="sm" variant="ghost" type="submit">
        {isActive ? strings.admin.deactivate : strings.admin.reactivate}
      </Button>
    </form>
  );
}