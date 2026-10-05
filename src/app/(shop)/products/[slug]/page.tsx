import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRightIcon } from "lucide-react";

import { ImageGallery } from "@/components/product/image-gallery";
import { ProductBuyBox } from "@/components/product/buy-box";
import { formatPrice } from "@/lib/money";
import { getActiveProductSlugs, getProductBySlug } from "@/lib/products";
import { SITE_URL, strings } from "@/lib/strings";

/**
 * Product pages are the links shared on WhatsApp and Instagram, so they are
 * pre-rendered at build time and refreshed in the background once a minute:
 * a product changed in /admin appears within a minute, without a redeploy.
 */
export const revalidate = 60;

/** Pre-render one page per active product. */
export async function generateStaticParams() {
  const slugs = await getActiveProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  // A missing product still needs a title for the 404 page.
  if (!product) return { title: "Page introuvable" };

  return {
    title: product.nameFr,
    description: product.descriptionFr,
    openGraph: {
      title: `${product.nameFr} — ${formatPrice(product.price)}`,
      description: product.descriptionFr,
      images: product.images[0]
        ? [{ url: product.images[0].url, alt: product.nameFr }]
        : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  // Unknown slug OR a product the admin deactivated: the same 404 for both, so
  // a discontinued piece cannot be reached by guessing its old link.
  if (!product) notFound();

  // Absolute URL, so the prefilled WhatsApp message works anywhere.
  const productUrl = `${SITE_URL}/products/${product.slug}`;

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:py-12 lg:px-8">
      <nav
        aria-label="Fil d'Ariane"
        className="mb-6 flex items-center gap-1 text-sm text-muted-foreground"
      >
        <Link
          href="/"
          className="transition-colors duration-300 ease-soft hover:text-primary"
        >
          {strings.siteName}
        </Link>
        <ChevronRightIcon className="size-4" />
        <Link
          href={`/?category=${product.categorySlug}#boutique`}
          className="transition-colors duration-300 ease-soft hover:text-primary"
        >
          {product.categoryNameFr}
        </Link>
        <ChevronRightIcon className="size-4" />
        <span className="truncate text-foreground">{product.nameFr}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <ImageGallery images={product.images} alt={product.nameFr} />

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
              {product.categoryNameFr}
            </p>
            <h1 className="text-3xl leading-tight font-medium sm:text-4xl">
              {product.nameFr}
            </h1>
          </div>

          {/* whitespace-pre-line keeps the line breaks the admin typed. */}
          <p className="text-base leading-relaxed whitespace-pre-line text-muted-foreground">
            {product.descriptionFr}
          </p>

          <ProductBuyBox
            productId={product.id}
            name={product.nameFr}
            price={product.price}
            productUrl={productUrl}
          />
        </div>
      </div>

      <Link
        href="/#boutique"
        className="mt-12 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors duration-300 ease-soft hover:text-primary"
      >
        ← {strings.product.backToShop}
      </Link>
    </div>
  );
}