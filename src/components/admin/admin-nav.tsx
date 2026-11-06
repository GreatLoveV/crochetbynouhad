"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PackageIcon, ShoppingBagIcon, TagIcon } from "lucide-react";

import { strings } from "@/lib/constants/strings";

/**
 * Sidebar navigation for the admin.
 *
 * A client component only so it can highlight the section you are in.
 */
export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      <NavLink
        href="/admin/products"
        icon={<PackageIcon className="size-4" />}
        label={strings.admin.products}
        active={pathname.startsWith("/admin/products")}
      />
      <NavLink
        href="/admin/categories"
        icon={<TagIcon className="size-4" />}
        label={strings.admin.categories}
        active={pathname.startsWith("/admin/categories")}
      />
      <NavLink
        href="/admin/orders"
        icon={<ShoppingBagIcon className="size-4" />}
        label={strings.admin.orders}
        active={pathname.startsWith("/admin/orders")}
      />
    </nav>
  );
}

function NavLink({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm transition-colors duration-300 ease-soft ${
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}