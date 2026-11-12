import Link from "next/link";
import { MessageCircleIcon } from "lucide-react";

import { Hero } from "@/components/home/hero";
import { PieceRow } from "@/components/home/piece-row";
import { InstagramIcon } from "@/components/icons";
import { ProductTile } from "@/components/product/product-tile";
import { Button } from "@/components/ui/button";
import { Chain } from "@/components/ui/chain";
import { Photo } from "@/components/ui/photo";
import { EmptyState } from "@/components/ui/state";
import { Steps } from "@/components/ui/steps";
import { fill, localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/fr";
import { getDictionary, getLang } from "@/i18n/server";
import { getActiveProducts, getCategories } from "@/lib/data/products";
import { INSTAGRAM_URL } from "@/lib/constants/strings";
import { ATELIER_PHOTO } from "@/lib/content/site";
import { whatsappUrl } from "@/lib/integrations/whatsapp";

/**
 * Home (« Fouwwa », docs/design/direction.md): the newest piece, the chain
 * drawn once, the pieces one per row (a tile grid past six, filtered by
 * ?category=<slug>), the atelier on a mint band, and how to order.
 *
 * This page reads `searchParams`, so it renders per request instead of being
 * pre-rendered. That is deliberate: the filter has to work on the server, and
 * it means a product added in /admin is visible immediately, with no revalidation
 * delay. A category link is a plain <Link>, so filtering stays a server
 * navigation — no client-side fetch, no extra JavaScript.
 */
export default async function HomePage({ searchParams }: PageProps<"/[lang]">) {
  const lang = await getLang();
  const t = await getDictionary();
  const params = await searchParams;
  // A repeated ?category=a&category=b arrives as an array; take the first.
  const rawSlug = params.category;
  const requestedSlug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

  // Independent reads, so they run side by side: this page streams in after
  // them, and its first photo is the page's largest element.
  const [categories, all] = await Promise.all([getCategories(lang), getActiveProducts(lang)]);
  // An unknown slug falls back to showing everything rather than an empty grid.
  const activeCategory = categories.find((c) => c.slug === requestedSlug);
  const products = activeCategory ? await getActiveProducts(lang, activeCategory.id) : all;

  // The hero shows the newest piece still for sale (else the newest piece), so
  // it is always something real the admin has just added. It reads the
  // unfiltered list, so the first screen doesn't change with the filter.
  const showcase = all.find((p) => !p.isSoldOut) ?? all[0] ?? null;
  // A short collection is shown one piece per row. Past six pieces the rows
  // would make a very long page, so it becomes a tile grid instead.
  const asRows = products.length <= 6;
  // Unfiltered, the hero already shows the newest piece in full: the rows
  // below start with the next one, so the same photo is never shown twice in
  // a row. A filtered view lists every piece of its category.
  const listed =
    !activeCategory && asRows && showcase && products.length > 1
      ? products.filter((p) => p.id !== showcase.id)
      : products;

  return (
    <>
      <Hero showcase={showcase} lang={lang} t={t} />

      <div className="mx-auto max-w-page px-4 pt-12 sm:px-8 sm:pt-16">
        <Chain draw tone="fouwwa" />
      </div>

      <section
        id="boutique"
        aria-labelledby="boutique-title"
        className="mx-auto max-w-page scroll-mt-28 px-4 pt-10 sm:px-8"
      >
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="boutique-title" className="text-3xl sm:text-4xl">
            {t.shop.title}
          </h2>
          <CategoryFilter lang={lang} t={t} categories={categories} activeSlug={activeCategory?.slug} />
        </div>

        {activeCategory?.isComingSoon ? (
          <ComingSoon lang={lang} t={t} categoryName={activeCategory.name} />
        ) : products.length === 0 ? (
          <EmptyState
            title={t.shop.empty}
            actions={
              <Button
                variant="outline"
                render={<a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" />}
              >
                {t.shop.comingSoonInstagram}
              </Button>
            }
          />
        ) : asRows ? (
          <ul className="flex flex-col gap-16 sm:gap-24">
            {/* Below the hero on every screen size, so the photos load lazily. */}
            {listed.map((product) => (
              <li key={product.id}>
                <PieceRow product={product} lang={lang} t={t} />
              </li>
            ))}
          </ul>
        ) : (
          <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6">
            {products.map((product) => (
              <li key={product.id}>
                <ProductTile product={product} lang={lang} t={t} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mx-auto max-w-page px-4 pt-section sm:px-8">
        <Chain tone="naanaa" />
      </div>
      <Atelier lang={lang} t={t} />

      <section aria-labelledby="steps-title" className="mx-auto max-w-page px-4 pt-section sm:px-8">
        <h2 id="steps-title" className="mb-8 text-3xl sm:text-4xl">
          {t.home.stepsTitle}
        </h2>
        <Steps items={[...t.home.steps]} />
      </section>
    </>
  );
}

/**
 * "L'atelier": who makes the pieces, in a few honest lines, on a full-width
 * Naanaa (mint) band with Laine text (7.1:1). With a photo of Nouhad's hands
 * (set in `lib/content/site.ts`) the band holds it beside the words; without
 * one it stays text, never a stock picture.
 */
function Atelier({ lang, t }: { lang: Locale; t: Dictionary }) {
  const message = fill(t.whatsapp.question, { shop: t.siteName });

  return (
    <section id="atelier" aria-labelledby="atelier-title" className="on-dark scroll-mt-20 bg-naanaa">
      <div
        className={
          ATELIER_PHOTO
            ? "mx-auto grid max-w-page items-center gap-8 px-4 py-16 sm:px-8 sm:py-20 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-14"
            : "mx-auto grid max-w-page gap-6 px-4 py-16 sm:px-8 sm:py-20 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] md:gap-14"
        }
      >
        {ATELIER_PHOTO ? (
          <Photo
            src={ATELIER_PHOTO.url}
            alt={ATELIER_PHOTO.alt[lang]}
            ratio="1/1"
            sizes="(min-width: 768px) 45vw, 100vw"
          />
        ) : (
          <h2 id="atelier-title" className="text-4xl sm:text-5xl">
            {t.home.atelierTitle}
          </h2>
        )}
        <div className="flex max-w-prose flex-col items-start gap-5">
          {ATELIER_PHOTO && (
            <h2 id="atelier-title" className="text-4xl sm:text-5xl">
              {t.home.atelierTitle}
            </h2>
          )}
          <p className="text-xl leading-relaxed">{t.home.atelierBody}</p>
          <p>{t.home.atelierQuestion}</p>
          <Button
            variant="inverse"
            render={<a href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer" />}
          >
            <MessageCircleIcon data-icon="inline-start" aria-hidden="true" />
            {t.home.atelierCta}
          </Button>
        </div>
      </div>
    </section>
  );
}

/** A category with no pieces yet: where to hear about the first ones. */
function ComingSoon({
  lang,
  t,
  categoryName,
}: {
  lang: Locale;
  t: Dictionary;
  categoryName: string;
}) {
  const message = fill(t.whatsapp.comingSoon, { shop: t.siteName, category: categoryName });

  return (
    <EmptyState
      as="h3"
      title={categoryName}
      body={`${t.shop.comingSoonTitle} ${t.shop.comingSoonBody}`}
      actions={
        <>
          <Button render={<a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" />}>
            <InstagramIcon data-icon="inline-start" aria-hidden="true" />
            {t.shop.comingSoonInstagram}
          </Button>
          <Button
            variant="outline"
            render={<a href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer" />}
          >
            <MessageCircleIcon data-icon="inline-start" aria-hidden="true" />
            {t.shop.comingSoonWhatsapp}
          </Button>
          <Button variant="link" className="basis-full" render={<Link href={localePath(lang, "/#boutique")} />}>
            {t.shop.comingSoonBack}
          </Button>
        </>
      }
    />
  );
}

/**
 * The categories as plain words, the current one marked with the chain
 * stitch. Wraps onto a second line on a phone: a row that scrolls sideways
 * hid the last categories with no hint that they were there.
 */
function CategoryFilter({
  lang,
  t,
  categories,
  activeSlug,
}: {
  lang: Locale;
  t: Dictionary;
  categories: { slug: string; name: string; isComingSoon: boolean }[];
  activeSlug: string | undefined;
}) {
  return (
    <nav aria-label={t.shop.filterLabel}>
      <ul className="flex flex-wrap gap-x-5 gap-y-1">
        <li>
          <FilterLink href={localePath(lang, "/#boutique")} active={activeSlug === undefined}>
            {t.shop.all}
          </FilterLink>
        </li>
        {categories.map((category) => (
          <li key={category.slug}>
            <FilterLink
              href={localePath(lang, `/?category=${category.slug}#boutique`)}
              active={activeSlug === category.slug}
            >
              {category.name}
              {category.isComingSoon ? (
                <span className="ms-1.5 text-sm text-fil">({t.shop.comingSoonBadge})</span>
              ) : null}
            </FilterLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function FilterLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={
        active
          ? "stitch-underline inline-flex min-h-11 items-center whitespace-nowrap text-barqouq"
          : "inline-flex min-h-11 items-center whitespace-nowrap text-fil hover:text-barqouq"
      }
    >
      {children}
    </Link>
  );
}
