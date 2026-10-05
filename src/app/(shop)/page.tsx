import Link from "next/link";

import { Hero } from "@/components/home/hero";
import { ProductCard } from "@/components/home/product-card";
import { getActiveProducts, getCategories } from "@/lib/products";
import { strings } from "@/lib/strings";

/**
 * Home = hero + catalog, filtered by ?category=<slug>.
 *
 * This page reads `searchParams`, so it renders per request instead of being
 * pre-rendered. That is deliberate: the filter has to work on the server, and
 * it means a product added in /admin is visible immediately, with no revalidation
 * delay. A category link is a plain <Link>, so filtering stays a server
 * navigation — no client-side fetch, no extra JavaScript.
 */
export default async function HomePage({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  // A repeated ?category=a&category=b arrives as an array; take the first.
  const rawSlug = params.category;
  const requestedSlug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

  const categories = await getCategories();
  // An unknown slug falls back to showing everything rather than an empty grid.
  const activeCategory = categories.find((c) => c.slug === requestedSlug);
  const products = await getActiveProducts(activeCategory?.id);

  // The hero shows the first product's cover photo, so it is always something
  // real that the admin has just uploaded.
  const showcase = products[0] ?? null;

  return (
    <>
      <Hero showcase={showcase} />

      <section
        id="boutique"
        className="mx-auto max-w-6xl scroll-mt-24 px-5 py-14 sm:py-20 lg:px-8"
      >
        <div className="mb-6 flex flex-col gap-2 sm:mb-8">
          <h2 className="text-3xl font-medium sm:text-4xl">
            {strings.shop.title}
          </h2>
          <p className="text-sm text-muted-foreground">{strings.hero.note}</p>
        </div>

        <CategoryFilter
          categories={categories}
          activeSlug={activeCategory?.slug}
        />

        {products.length === 0 ? (
          <p className="mt-8 rounded-3xl border border-dashed border-border px-6 py-16 text-center text-muted-foreground">
            {strings.shop.empty}
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

/**
 * Horizontal row of filter pills. Scrolls sideways on a 390px phone instead of
 * wrapping, so the product grid always starts at the same height.
 */
function CategoryFilter({
  categories,
  activeSlug,
}: {
  categories: { slug: string; nameFr: string }[];
  activeSlug: string | undefined;
}) {
  return (
    <nav
      aria-label={strings.nav.shop}
      className="-mx-5 overflow-x-auto px-5 no-scrollbar lg:mx-0 lg:px-0"
    >
      <ul className="flex w-max gap-2 pb-1">
        <li>
          <FilterPill href="/#boutique" active={activeSlug === undefined}>
            {strings.shop.all}
          </FilterPill>
        </li>
        {categories.map((category) => (
          <li key={category.slug}>
            <FilterPill
              href={`/?category=${category.slug}#boutique`}
              active={activeSlug === category.slug}
            >
              {category.nameFr}
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
          ? "inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-medium whitespace-nowrap text-primary-foreground transition-all duration-300 ease-soft hover:-translate-y-0.5 hover:bg-primary/90"
          : "inline-flex h-10 items-center rounded-full border border-border bg-card px-5 text-sm whitespace-nowrap transition-all duration-300 ease-soft hover:-translate-y-0.5 hover:border-foreground/25 hover:bg-accent hover:text-accent-foreground"
      }
    >
      {children}
    </Link>
  );
}