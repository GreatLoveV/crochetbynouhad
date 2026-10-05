import { NotFoundContent } from "@/components/not-found-content";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

/**
 * Last-resort 404, for URLs that match no route at all.
 *
 * This one renders directly in the root layout, which no longer carries the
 * site chrome (that moved to `(shop)/layout.tsx`), so it brings its own.
 */
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <NotFoundContent />
      </main>
      <SiteFooter />
    </>
  );
}