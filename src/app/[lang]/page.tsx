import Link from "next/link";
import { MessageCircleIcon } from "lucide-react";

import { Hero } from "@/components/home/hero";
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
 * Home: the newest piece, the chain, the pieces (filtered by
 * ?category=<slug>), the atelier, and how to order.
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

  const categories = await getCategories(lang);
  // An unknown slug falls back to showing everything rather than an empty grid.
  const activeCategory = categories.find((c) => c.slug === requestedSlug);
  const products = await getActiveProducts(lang, activeCategory?.id);

  // The hero shows the newest piece still for sale (else the newest piece), so
  // it is always something real the admin has just added. It reads the
  // unfiltered list, so the first screen doesn't change with the filter.
  const all = activeCategory ? await getActiveProducts(lang) : products;
  const showcase = all.find((p) => !p.isSoldOut) ?? all[0] ?? null;
  // The newest piece gets the large tile when the grid is long enough to
  // carry it; a short or filtered list stays even.
  const feature = !activeCategory && products.length >= 5;

  return (
    <>
      <Hero showcase={showcase} lang={lang} t={t} />

      <div className="mx-auto max-w-page px-4 pt-12 sm:px-8 sm:pt-16">
        <Chain draw />
      </div>

      <section
        id="boutique"
        aria-labelledby="boutique-title"
        className="mx-auto max-w-page scroll-mt-28 px-4 pt-10 sm:px-8"
      >
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="boutique-title" className="text-4xl">
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
        ) : (
          <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
            {products.map((product, i) => {
              const big = i === 0 && feature;
              return (
                <li key={product.id} className={big ? "col-span-2 sm:row-span-2 sm:flex sm:flex-col" : undefined}>
                  <ProductTile product={product} lang={lang} t={t} feature={big} priority={i < 2} />
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <Atelier lang={lang} t={t} />

      <section aria-labelledby="steps-title" className="mx-auto max-w-page px-4 pt-section sm:px-8">
        <h2 id="steps-title" className="mb-8 text-4xl">
          {t.home.stepsTitle}
        </h2>
        <Steps items={[...t.home.steps]} />
      </section>
    </>
  );
}

/**
 * "L'atelier": who makes the pieces, in a few honest lines. With a photo of
 * Nouhad's hands (set in `lib/content/site.ts`) it becomes a two-column band;
 * without one it stays text, never a stock picture.
 */
function Atelier({ lang, t }: { lang: Locale; t: Dictionary }) {
  const message = fill(t.whatsapp.question, { shop: t.siteName });
  const title = (
    <h2 id="atelier-title" className="text-4xl">
      {t.home.atelierTitle}
    </h2>
  );
  const text = (
    <div className="flex max-w-prose flex-col items-start gap-5">
      <p className="font-heading text-2xl font-normal">{t.home.atelierBody}</p>
      <p className="text-fil">{t.home.atelierQuestion}</p>
      <Button
        variant="outline"
        render={<a href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer" />}
      >
        <MessageCircleIcon data-icon="inline-start" aria-hidden="true" />
        {t.home.atelierCta}
      </Button>
    </div>
  );

  return (
    <section
      id="atelier"
      aria-labelledby="atelier-title"
      className="mx-auto mt-section max-w-page scroll-mt-28 px-4 sm:px-8"
    >
      {ATELIER_PHOTO ? (
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
          <Photo
            src={ATELIER_PHOTO.url}
            alt={ATELIER_PHOTO.alt[lang]}
            ratio="1/1"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
          <div className="flex flex-col gap-5">
            {title}
            {text}
          </div>
        </div>
      ) : (
        // Without a photo: the title on the inline start, the words beside it.
        <div className="grid gap-5 border-t border-border pt-section md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] md:gap-14">
          {title}
          {text}
        </div>
      )}
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
 * stitch. Scrolls sideways on a phone instead of wrapping.
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
    <nav aria-label={t.shop.filterLabel} className="-mx-4 overflow-x-auto px-4 no-scrollbar sm:mx-0 sm:px-0">
      <ul className="flex w-max gap-5">
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
          ? "stitch-underline inline-flex min-h-11 items-center whitespace-nowrap text-encre"
          : "inline-flex min-h-11 items-center whitespace-nowrap text-fil hover:text-encre"
      }
    >
      {children}
    </Link>
  );
}
