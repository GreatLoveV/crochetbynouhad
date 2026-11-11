import { toggleCategoryComingSoon } from "@/app/admin/actions/categories";
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
import { getAdminCategoryList } from "@/lib/data/admin-products";
import { requireAdmin } from "@/lib/auth/admin";
import { strings } from "@/lib/constants/strings";

export const metadata = { title: "Catégories — Administration" };

export default async function AdminCategoriesPage() {
  // Checked here too, not only in the layout: a layout is not re-run on
  // client-side navigation, so it cannot be the only guard for a page's data.
  await requireAdmin();

  const categories = await getAdminCategoryList();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">{strings.admin.categories}</h1>
        <p className="text-sm text-muted-foreground">
          {strings.admin.categoriesSubtitle}
        </p>
      </div>

      <div className="rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Catégorie</TableHead>
              <TableHead className="hidden sm:table-cell">
                {strings.admin.products}
              </TableHead>
              <TableHead className="w-32 text-right">État</TableHead>
              <TableHead className="w-40 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.nameFr}</TableCell>
                <TableCell className="hidden text-muted-foreground tabular-nums sm:table-cell">
                  {category.productCount}
                </TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant={category.isComingSoon ? "secondary" : "default"}
                  >
                    {category.isComingSoon
                      ? strings.admin.categoryComingSoon
                      : strings.admin.categoryLive}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <form action={toggleCategoryComingSoon}>
                    <input type="hidden" name="id" value={category.id} />
                    <Button size="sm" variant="ghost" type="submit">
                      {category.isComingSoon
                        ? strings.admin.categoryLive
                        : strings.admin.categoryComingSoon}
                    </Button>
                  </form>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
