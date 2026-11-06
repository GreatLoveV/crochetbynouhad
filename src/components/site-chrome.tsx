import Link from "next/link";
import { MessageCircleIcon } from "lucide-react";

import { CartButton } from "@/components/cart/cart-sheet";
import { InstagramIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { INSTAGRAM_URL, strings } from "@/lib/constants/strings";
import { whatsappUrl } from "@/lib/integrations/whatsapp";

/**
 * Sticky site header. Server component — only the cart drawer is a client
 * island, so the rest of the header ships as plain HTML.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:h-20 lg:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          {/* Small terracotta stitch mark, purely decorative. */}
          <span
            aria-hidden
            className="size-2.5 rounded-full bg-primary transition-transform duration-300 ease-soft group-hover:scale-125"
          />
          <span className="flex flex-col leading-none">
            <span className="font-heading text-lg tracking-tight sm:text-xl">
              {strings.siteName}
            </span>
            <span className="mt-0.5 hidden text-[0.7rem] tracking-[0.18em] text-muted-foreground uppercase sm:block">
              {strings.tagline}
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <nav className="hidden items-center gap-1 sm:flex">
            <Button
              variant="ghost"
              size="sm"
              render={<Link href="/#boutique" />}
            >
              {strings.nav.shop}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              render={<Link href="/cart" />}
            >
              {strings.nav.cartPage}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              render={
                <a
                  href={whatsappUrl(
                    `Bonjour ${strings.siteName}, j'aimerais des informations sur vos créations.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              {strings.nav.contact}
            </Button>
          </nav>

          <CartButton />
        </div>
      </div>
    </header>
  );
}

/** Site footer: contact channels, legal links and the cash-on-delivery note. */
export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/70 bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-3 lg:px-8">
        <div className="flex flex-col gap-3">
          <span className="font-heading text-xl">{strings.siteName}</span>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            {strings.footer.blurb}
          </p>
          <p className="text-sm text-muted-foreground">{strings.hero.note}</p>
        </div>

        <nav className="flex flex-col gap-3">
          <span className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
            {strings.footer.contactTitle}
          </span>
          <a
            href={whatsappUrl(`Bonjour ${strings.siteName}, j'ai une question.`)}
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
            {strings.footer.instagram}
          </a>
        </nav>

        <nav className="flex flex-col gap-3">
          <span className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
            {strings.footer.infoTitle}
          </span>
          <Link
            href="/conditions"
            className="w-fit text-sm transition-colors duration-300 ease-soft hover:text-primary"
          >
            {strings.footer.terms}
          </Link>
          <Link
            href="/confidentialite"
            className="w-fit text-sm transition-colors duration-300 ease-soft hover:text-primary"
          >
            {strings.footer.privacy}
          </Link>
        </nav>
      </div>

      <div className="border-t border-border/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <span>
            © {new Date().getFullYear()} {strings.siteName}.{" "}
            {strings.footer.copyright}
          </span>
          <span>{strings.hero.note}</span>
        </div>
      </div>
    </footer>
  );
}
