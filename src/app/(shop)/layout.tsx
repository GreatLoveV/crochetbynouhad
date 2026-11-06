import { SiteFooter, SiteHeader } from "@/components/site-chrome";

/**
 * Chrome for the public shop.
 *
 * The root layout (`app/layout.tsx`) stays free of it so that `/admin` can have
 * its own, quieter layout. Putting shop pages in the `(shop)` group changes no
 * URLs — `/products/sac-fleur-rose` is still exactly that.
 */
export default function ShopLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
