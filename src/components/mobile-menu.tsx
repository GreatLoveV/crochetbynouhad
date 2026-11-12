"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MenuIcon } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useI18n } from "@/i18n/client"

/**
 * The section links on a phone, so the header stays one row: brand, language,
 * bag, menu. The panel slides in from the inline start (left in French, right
 * in Arabic) in 180 ms; with reduced motion it simply appears (globals.css).
 * Each link closes the panel, including "L'atelier", which only scrolls.
 */
export function MobileMenu({ contactHref, className }: { contactHref: string; className?: string }) {
  const { lang, t, href, dir } = useI18n()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const onShop = pathname === `/${lang}` || pathname.startsWith(`/${lang}/products`)

  const link =
    "flex min-h-12 items-center border-b border-border font-heading text-2xl transition-colors duration-150 ease-thread hover:text-fouwwa"

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" className={className} />}
      >
        <MenuIcon aria-hidden="true" />
        <span className="sr-only">{t.nav.menu}</span>
      </SheetTrigger>
      <SheetContent
        side={dir === "rtl" ? "right" : "left"}
        closeLabel={t.common.close}
        className="duration-180 data-ending-style:duration-150 data-[side=left]:w-[min(22rem,88vw)] data-[side=right]:w-[min(22rem,88vw)]"
      >
        <SheetHeader>
          <SheetTitle>{t.nav.menu}</SheetTitle>
        </SheetHeader>
        <nav aria-label={t.nav.label} className="px-5">
          <ul className="flex flex-col">
            <li>
              <Link
                href={href("/")}
                aria-current={onShop ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={cn(link, onShop && "text-fouwwa")}
              >
                {t.nav.shop}
              </Link>
            </li>
            <li>
              <Link href={href("/#atelier")} onClick={() => setOpen(false)} className={link}>
                {t.nav.atelier}
              </Link>
            </li>
            <li>
              <a
                href={contactHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className={link}
              >
                {t.nav.contact}
              </a>
            </li>
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
