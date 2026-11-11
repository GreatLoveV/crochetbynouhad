import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ChevronRightIcon } from "lucide-react";

import { ImageGallery } from "@/components/product/image-gallery";
import { ProductBuyBox } from "@/components/product/buy-box";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
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
    <div className="mx-auto max-w-page px-4 pt-6 pb-4 sm:px-8 sm:pt-8">
      <nav aria-label={t.product.breadcrumb} className="mb-6 text-sm text-fil">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href={localePath(lang, "/")} className="inline-flex min-h-8 items-center underline-offset-4 hover:underline">
              {t.nav.shop}
            </Link>
          </li>
          <li aria-hidden="true">
            {/* Points along the reading direction, so it flips in Arabic. */}
            <ChevronRightIcon className="size-4 rtl:-scale-x-100" />
          </li>
          <li>
            <Link
              href={localePath(lang, `/?category=${product.categorySlug}#boutique`)}
              className="inline-flex min-h-8 items-center underline-offset-4 hover:underline"
            >
              {product.categoryName}
            </Link>
          </li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
        <ImageGallery images={product.images} alt={product.name} altLang={product.nameLang} />

        <div className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
          <div className="flex flex-col gap-3">
            <h1 lang={product.nameLang} className="text-4xl sm:text-5xl">
              {product.name}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="text-2xl">
                <Price centimes={product.price} lang={lang} />
              </p>
              {product.isSoldOut ? (
                <Badge variant="sold">{t.product.soldOut}</Badge>
              ) : (
                <Badge>{t.product.unique}</Badge>
              )}
            </div>
            {/* Every piece is one of a kind, so the reference names this exact
                item in Nouhad's notebook. */}
            {product.reference ? (
              <p className="text-sm text-fil">
                {t.product.reference} <bdi>{product.reference}</bdi>
              </p>
            ) : null}
          </div>

          <ProductBuyBox
            productId={product.id}
            name={product.name}
            price={product.price}
            productUrl={productUrl}
            reference={product.reference}
            isSoldOut={product.isSoldOut}
          />

          {/* whitespace-pre-line keeps the line breaks the admin typed. */}
          <p
            lang={product.descriptionLang}
            className="max-w-prose border-t border-border pt-6 whitespace-pre-line"
          >
            {product.description}
          </p>
        </div>
      </div>

      <Link
        href={localePath(lang, "/#boutique")}
        className="mt-12 inline-flex min-h-11 items-center gap-2 text-the underline decoration-1 underline-offset-4 hover:decoration-2"
      >
        {/* "Back" points against the reading direction: flips in Arabic. */}
        <ArrowLeftIcon aria-hidden="true" className="size-4 rtl:-scale-x-100" />
        {t.product.backToShop}
      </Link>
    </div>
  );
}
