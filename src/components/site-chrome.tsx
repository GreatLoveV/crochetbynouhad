import Link from "next/link";

import { CartButton } from "@/components/cart/cart-sheet";
import { InstagramIcon } from "@/components/icons";
import { LanguageSwitcher } from "@/components/language-switcher";
import { NavLinks } from "@/components/nav-links";
import { fill, localePath } from "@/i18n/config";
import { getDictionary, getLang } from "@/i18n/server";
import { INSTAGRAM_URL } from "@/lib/constants/strings";
import { whatsappUrl } from "@/lib/integrations/whatsapp";

/**
 * Header: the brand on the inline start; navigation, the other language and
 * the bag on the inline end. Server component; the navigation, language link
 * and bag are small client islands.
 *
 * On a phone the three links don't fit beside the brand, so they move to a
 * second row that scrolls sideways if it must.
 */
export async function SiteHeader() {
  const lang = await getLang();
  const t = await getDictionary();
  const contactHref = whatsappUrl(fill(t.whatsapp.info, { shop: t.siteName }));

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-coton/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-page items-center justify-between gap-4 px-4 sm:h-18 sm:px-8">
        {/* The brand is written in Latin letters in both languages. */}
        <Link
          href={localePath(lang, "/")}
          lang="fr"
          dir="ltr"
          className="font-heading text-2xl leading-none font-semibold whitespace-nowrap sm:text-[1.75rem]"
        >
          {t.siteName}
        </Link>

        <div className="flex items-center gap-2 sm:gap-6">
          <NavLinks contactHref={contactHref} className="hidden md:block" />
          <LanguageSwitcher />
          <CartButton />
        </div>
      </div>
      <NavLinks
        contactHref={contactHref}
        className="overflow-x-auto border-t border-border px-4 no-scrollbar md:hidden"
      />
    </header>
  );
}

/** Footer: who, how to reach her, the legal pages, and how payment works. */
export async function SiteFooter() {
  const lang = await getLang();
  const t = await getDictionary();

  const link = "w-fit underline-offset-4 decoration-1 hover:underline";

  return (
    <footer className="mt-section border-t border-border bg-lin">
      <div className="mx-auto grid max-w-page gap-10 px-4 py-14 sm:grid-cols-[1.4fr_1fr_1fr] sm:px-8">
        <div className="flex flex-col gap-3">
          <p lang="fr" dir="ltr" className="w-fit font-heading text-2xl font-semibold">
            {t.siteName}
          </p>
          <p className="max-w-xs text-sm text-fil">{t.footer.blurb}</p>
          <p className="max-w-xs text-sm text-fil">{t.hero.note}</p>
        </div>

        <nav aria-labelledby="footer-contact" className="flex flex-col gap-3 text-sm">
          <h2 id="footer-contact" className="font-sans text-sm font-medium">
            {t.footer.contactTitle}
          </h2>
          <a
            href={whatsappUrl(fill(t.whatsapp.question, { shop: t.siteName }))}
            target="_blank"
            rel="noopener noreferrer"
            className={link}
          >
            WhatsApp
          </a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={`${link} flex items-center gap-2`}>
            <InstagramIcon className="size-4" aria-hidden="true" />
            {t.footer.instagram}
          </a>
        </nav>

        <nav aria-labelledby="footer-info" className="flex flex-col gap-3 text-sm">
          <h2 id="footer-info" className="font-sans text-sm font-medium">
            {t.footer.infoTitle}
          </h2>
          <Link href={localePath(lang, "/conditions")} className={link}>
            {t.footer.terms}
          </Link>
          <Link href={localePath(lang, "/confidentialite")} className={link}>
            {t.footer.privacy}
          </Link>
        </nav>
      </div>

      <div className="mx-auto max-w-page px-4 pb-8 text-xs text-fil sm:px-8">
        © <bdi>{new Date().getFullYear()}</bdi> <bdi>{t.siteName}</bdi>. {t.footer.copyright}
      </div>
    </footer>
  );
}
