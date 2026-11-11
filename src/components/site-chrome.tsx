import Link from "next/link";
import { MessageCircleIcon } from "lucide-react";

import { CartButton } from "@/components/cart/cart-sheet";
import { InstagramIcon } from "@/components/icons";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { fill, localePath } from "@/i18n/config";
import { getDictionary, getLang } from "@/i18n/server";
import { INSTAGRAM_URL } from "@/lib/constants/strings";
import { whatsappUrl } from "@/lib/integrations/whatsapp";

/**
 * Sticky site header. Server component — only the cart drawer and the
 * language link are client islands, so the rest ships as plain HTML.
 */
export async function SiteHeader() {
  const lang = await getLang();
  const t = await getDictionary();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:h-20 lg:px-8">
        <Link href={localePath(lang, "/")} className="group flex items-center gap-2.5">
          {/* Small gold stitch mark, purely decorative. */}
          <span
            aria-hidden
            className="size-2 rotate-45 bg-primary transition-transform duration-300 ease-soft group-hover:rotate-[135deg]"
          />
          <span className="flex flex-col leading-none">
            {/* The brand is written in Latin letters in both languages. */}
            <span className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
              {t.siteName}
            </span>
            <span className="mt-0.5 hidden text-[0.7rem] tracking-[0.18em] text-muted-foreground uppercase sm:block">
              {t.tagline}
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <nav aria-label={t.nav.label} className="hidden items-center gap-1 sm:flex">
            <Button variant="ghost" size="sm" render={<Link href={localePath(lang, "/#boutique")} />}>
              {t.nav.shop}
            </Button>
            <Button variant="ghost" size="sm" render={<Link href={localePath(lang, "/cart")} />}>
              {t.nav.cartPage}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              render={
                <a
                  href={whatsappUrl(fill(t.whatsapp.info, { shop: t.siteName }))}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              {t.nav.contact}
            </Button>
          </nav>

          <LanguageSwitcher />
          <CartButton />
        </div>
      </div>
    </header>
  );
}

/** Site footer: contact channels, legal links and the cash-on-delivery note. */
export async function SiteFooter() {
  const lang = await getLang();
  const t = await getDictionary();

  return (
    <footer className="mt-24 border-t border-border bg-card/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-3 lg:px-8">
        <div className="flex flex-col gap-3">
          <span className="font-heading text-2xl font-semibold">{t.siteName}</span>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">{t.footer.blurb}</p>
          <p className="text-sm text-muted-foreground">{t.hero.note}</p>
        </div>

        <nav aria-label={t.footer.contactTitle} className="flex flex-col gap-3">
          <span className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
            {t.footer.contactTitle}
          </span>
          <a
            href={whatsappUrl(fill(t.whatsapp.question, { shop: t.siteName }))}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-fit items-center gap-2 text-sm transition-colors duration-300 ease-soft hover:text-primary"
          >
            <MessageCircleIcon className="size-4" />
            WhatsApp
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-fit items-center gap-2 text-sm transition-colors duration-300 ease-soft hover:text-primary"
          >
            <InstagramIcon className="size-4" />
            {t.footer.instagram}
          </a>
        </nav>

        <nav aria-label={t.footer.infoTitle} className="flex flex-col gap-3">
          <span className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
            {t.footer.infoTitle}
          </span>
          <Link
            href={localePath(lang, "/conditions")}
            className="w-fit text-sm transition-colors duration-300 ease-soft hover:text-primary"
          >
            {t.footer.terms}
          </Link>
          <Link
            href={localePath(lang, "/confidentialite")}
            className="w-fit text-sm transition-colors duration-300 ease-soft hover:text-primary"
          >
            {t.footer.privacy}
          </Link>
        </nav>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <span>
            © <bdi>{new Date().getFullYear()}</bdi> <bdi>{t.siteName}</bdi>.{" "}
            {t.footer.copyright}
          </span>
          <span>{t.hero.note}</span>
        </div>
      </div>
    </footer>
  );
}
