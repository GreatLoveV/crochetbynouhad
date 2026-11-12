"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";

import { useI18n } from "@/i18n/client";

/**
 * The three header links. The current page is marked with the chain stitch
 * under the word (`stitch-underline`) and `aria-current`, so it is announced
 * and doesn't rely on colour.
 */
export function NavLinks({ contactHref, className }: { contactHref: string; className?: string }) {
  const { lang, t, href } = useI18n();
  const pathname = usePathname();
  const onShop = pathname === `/${lang}` || pathname.startsWith(`/${lang}/products`);

  const base =
    "inline-flex min-h-11 items-center py-2 text-base transition-colors duration-150 ease-thread hover:text-nila";

  return (
    <nav aria-label={t.nav.label} className={className}>
      <ul className="flex items-center gap-6">
        <li>
          <Link
            href={href("/")}
            aria-current={onShop ? "page" : undefined}
            className={cn(base, onShop ? "stitch-underline text-nila" : "text-fil")}
          >
            {t.nav.shop}
          </Link>
        </li>
        <li>
          <Link href={href("/#atelier")} className={cn(base, "text-fil")}>
            {t.nav.atelier}
          </Link>
        </li>
        <li>
          <a href={contactHref} target="_blank" rel="noopener noreferrer" className={cn(base, "text-fil")}>
            {t.nav.contact}
          </a>
        </li>
      </ul>
    </nav>
  );
}
