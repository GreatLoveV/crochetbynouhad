import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/login-form";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth/auth";
import { strings } from "@/lib/constants/strings";

export const metadata: Metadata = {
  title: strings.admin.loginTitle,
  robots: { index: false, follow: false },
};

/**
 * Login page.
 *
 * Deliberately NOT inside the `(protected)` group, so it does not inherit the
 * admin guard that would redirect it away before it could be shown.
 */
export default async function AdminLoginPage({
  searchParams,
}: PageProps<"/admin/login">) {
  const session = await auth();
  if (session?.user?.id) redirect("/admin");

  const params = await searchParams;
  const raw = Array.isArray(params.from) ? params.from[0] : params.from;
  const from = typeof raw === "string" && raw.startsWith("/admin") ? raw : "";

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-3xl">{strings.admin.loginTitle}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {strings.admin.loginSubtitle}
          </p>
        </div>

        <LoginForm from={from} />

        <div className="mt-8 text-center">
          <Button
            variant="ghost"
            size="sm"
            render={<Link href="/" />}
          >
            {strings.admin.viewSite}
          </Button>
        </div>
      </div>
    </div>
  );
}