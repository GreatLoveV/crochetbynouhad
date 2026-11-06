import Link from "next/link";

import { logoutAction } from "@/app/admin/actions/auth";
import { AdminNav } from "@/components/admin/admin-nav";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth/admin";
import { strings } from "@/lib/constants/strings";

/**
 * Layout for every admin screen except the login page.
 *
 * The guard lives here AND in each server action. `src/proxy.ts` redirects
 * signed-out visitors, but this is the check that actually protects the data.
 */
export default async function AdminLayout({
  children,
}: LayoutProps<"/admin">) {
  const admin = await requireAdmin();

  return (
    <div className="flex min-h-full flex-col bg-secondary/25">
      <header className="border-b border-border/70 bg-background">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 lg:px-8">
          <div className="flex items-center gap-2.5">
            <span aria-hidden className="size-2.5 rounded-full bg-primary" />
            <span className="font-heading text-lg">{strings.admin.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              render={<Link href="/" />}
            >
              {strings.admin.viewSite}
            </Button>
            <form action={logoutAction}>
              <Button variant="outline" size="sm" type="submit">
                {strings.admin.logout}
              </Button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-5 py-8 lg:flex-row lg:gap-12 lg:px-8">
        <aside className="lg:w-52 lg:shrink-0">
          <AdminNav />
          <p className="mt-6 hidden text-xs text-muted-foreground lg:block">
            {admin.email}
          </p>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}