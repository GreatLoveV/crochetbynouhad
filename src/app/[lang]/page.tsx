import Link from "next/link";
import { MessageCircleIcon } from "lucide-react";

import { Hero } from "@/components/home/hero";
import { ProductCard } from "@/components/home/product-card";
import { InstagramIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fill, localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/fr";
import { getDictionary, getLang } from "@/i18n/server";
import { getActiveProducts, getCategories } from "@/lib/data/products";
import { INSTAGRAM_URL } from "@/lib/constants/strings";
import { whatsappUrl } from "@/lib/integrations/whatsapp";

/**
 * Home = hero + catalog, filtered by ?category=<slug>.
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

  // The hero shows the first product's cover photo, so it is always something
  // real that the admin has just uploaded.
  const showcase = products[0] ?? null;

  return (
    <>
      <Hero showcase={showcase} t={t} />

      <section
        id="boutique"
        className="mx-auto max-w-6xl scroll-mt-24 px-5 py-14 sm:py-20 lg:px-8"
      >
        <div className="mb-6 flex flex-col gap-2 sm:mb-8">
          <h2 className="text-3xl font-medium sm:text-4xl">{t.shop.title}</h2>
          <p className="text-sm text-muted-foreground">{t.hero.note}</p>
        </div>

        <CategoryFilter
          lang={lang}
          t={t}
          categories={categories}
          activeSlug={activeCategory?.slug}
        />

        {activeCategory?.isComingSoon ? (
          <ComingSoon lang={lang} t={t} categoryName={activeCategory.name} />
        ) : products.length === 0 ? (
          <p className="mt-8 rounded-3xl border border-dashed border-border px-6 py-16 text-center text-muted-foreground">
            {t.shop.empty}
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} lang={lang} t={t} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

/** Friendly placeholder for a category that has no pieces yet. */
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
    <div className="mt-8 flex flex-col items-center gap-5 rounded-3xl border border-dashed border-border px-6 py-16 text-center">
      <div className="flex flex-col gap-2">
        <h3 className="font-heading text-2xl">{t.shop.comingSoonTitle}</h3>
        <p className="max-w-md text-muted-foreground">{t.shop.comingSoonBody}</p>
      </div>

      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
        <Button
          size="lg"
          className="w-full sm:w-auto"
          render={<a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" />}
        >
          <InstagramIcon />
          {t.shop.comingSoonInstagram}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-full sm:w-auto"
          render={
            <a href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer" />
          }
        >
          <MessageCircleIcon />
          {t.shop.comingSoonWhatsapp}
        </Button>
      </div>

      <Link
        href={localePath(lang, "/#boutique")}
        className="text-sm text-muted-foreground underline underline-offset-4 transition-colors duration-300 ease-soft hover:text-primary"
      >
        {t.shop.comingSoonBack}
      </Link>
    </div>
  );
}

/**
 * Horizontal row of filter pills. Scrolls sideways on a 390px phone instead of
 * wrapping, so the product grid always starts at the same height.
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
    <nav
      aria-label={t.shop.filterLabel}
      className="-mx-5 overflow-x-auto px-5 no-scrollbar lg:mx-0 lg:px-0"
    >
      <ul className="flex w-max gap-2 pb-1">
        <li>
          <FilterPill href={localePath(lang, "/#boutique")} active={activeSlug === undefined}>
            {t.shop.all}
          </FilterPill>
        </li>
        {categories.map((category) => (
          <li key={category.slug}>
            <FilterPill
              href={localePath(lang, `/?category=${category.slug}#boutique`)}
              active={activeSlug === category.slug}
            >
              {category.name}
              {category.isComingSoon ? (
                <Badge variant="secondary" className="ms-1.5 px-1.5 py-0 text-[0.65rem]">
                  {t.shop.comingSoonBadge}
                </Badge>
              ) : null}
            </FilterPill>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function FilterPill({
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
      aria-current={active ? "true" : undefined}
      className={
        active
          ? "inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-semibold whitespace-nowrap text-primary-foreground transition-all duration-300 ease-soft"
          : "inline-flex h-10 items-center rounded-full border border-border bg-transparent px-5 text-sm whitespace-nowrap text-muted-foreground transition-all duration-300 ease-soft hover:border-primary/60 hover:text-foreground"
      }
    >
      {children}
    </Link>
  );
}
