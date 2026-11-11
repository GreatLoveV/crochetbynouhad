import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ChevronRightIcon } from "lucide-react";

import { ImageGallery } from "@/components/product/image-gallery";
import { ProductBuyBox } from "@/components/product/buy-box";
import { Badge } from "@/components/ui/badge";
import { locales, localePath, ogLocale } from "@/i18n/config";
import { alternatesFor } from "@/i18n/metadata";
import { getDictionary, getLang } from "@/i18n/server";
import { formatPrice } from "@/lib/format/money";
import { getActiveProductSlugs, getProductBySlug } from "@/lib/data/products";
import { SITE_URL } from "@/lib/constants/strings";

/**
 * Product pages are the links shared on WhatsApp and Instagram, so they are
 * pre-rendered at build time and refreshed in the background once a minute:
 * a product changed in /admin appears within a minute, without a redeploy.
 */
export const revalidate = 60;

/** Pre-render one page per active product, in the language of the layout. */
export async function generateStaticParams() {
  const slugs = await getActiveProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const lang = await getLang();
  const t = await getDictionary();
  const product = await getProductBySlug(lang, slug);

  // A missing product still needs a title for the 404 page.
  if (!product) return { title: t.meta.notFoundTitle, robots: { index: false } };

  const path = `/products/${slug}`;
  return {
    title: product.name,
    description: product.description,
    alternates: alternatesFor(lang, path),
    openGraph: {
      // Repeated on purpose: defining `openGraph` here replaces the layout's
      // rather than merging with it, so locale and siteName have to be carried
      // across or WhatsApp drops the link preview.
      type: "article",
      locale: ogLocale[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => ogLocale[l]),
      siteName: t.siteName,
      url: localePath(lang, path),
      title: `${product.name} — ${formatPrice(product.price, lang)}`,
      description: product.description,
      images: product.images[0]
        ? [{ url: product.images[0].url, alt: product.name }]
        : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: PageProps<"/[lang]/products/[slug]">) {
  const { slug } = await params;
  const lang = await getLang();
  const t = await getDictionary();
  const product = await getProductBySlug(lang, slug);

  // Unknown slug OR a product the admin deactivated: the same 404 for both, so
  // a discontinued piece cannot be reached by guessing its old link.
  if (!product) notFound();

  // Absolute URL, so the prefilled WhatsApp message works anywhere.
  const productUrl = `${SITE_URL}${localePath(lang, `/products/${product.slug}`)}`;

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:py-12 lg:px-8">
      <nav
        aria-label={t.product.breadcrumb}
        className="mb-6 flex items-center gap-1 text-sm text-muted-foreground"
      >
        <Link
          href={localePath(lang, "/")}
          className="transition-colors duration-300 ease-soft hover:text-primary"
        >
          {t.siteName}
        </Link>
        {/* Points along the reading direction, so it flips in Arabic. */}
        <ChevronRightIcon aria-hidden className="size-4 rtl:-scale-x-100" />
        <Link
          href={localePath(lang, `/?category=${product.categorySlug}#boutique`)}
          className="transition-colors duration-300 ease-soft hover:text-primary"
        >
          {product.categoryName}
        </Link>
        <ChevronRightIcon aria-hidden className="size-4 rtl:-scale-x-100" />
        <span lang={product.nameLang} className="truncate text-foreground">
          {product.name}
        </span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <ImageGallery images={product.images} alt={product.name} />

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
                {product.categoryName}
              </p>
              {product.isSoldOut ? (
                <Badge variant="secondary">{t.product.soldOut}</Badge>
              ) : null}
            </div>
            <h1
              lang={product.nameLang}
              className="text-3xl leading-tight font-medium sm:text-4xl"
            >
              {product.name}
            </h1>
            {/* Every piece is one of a kind, so the reference is the name of
                this exact item in Nouhad's notebook. */}
            {product.reference ? (
              <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
                {t.product.reference} <bdi>{product.reference}</bdi>
              </p>
            ) : null}
          </div>

          {/* whitespace-pre-line keeps the line breaks the admin typed. */}
          <p
            lang={product.descriptionLang}
            className="text-base leading-relaxed whitespace-pre-line text-muted-foreground"
          >
            {product.description}
          </p>

          <ProductBuyBox
            productId={product.id}
            name={product.name}
            price={product.price}
            productUrl={productUrl}
            reference={product.reference}
            isSoldOut={product.isSoldOut}
          />
        </div>
      </div>

      <Link
        href={localePath(lang, "/#boutique")}
        className="mt-12 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors duration-300 ease-soft hover:text-primary"
      >
        {/* "Back" points against the reading direction: flips in Arabic. */}
        <ArrowLeftIcon aria-hidden className="size-4 rtl:-scale-x-100" />
        {t.product.backToShop}
      </Link>
    </div>
  );
}
