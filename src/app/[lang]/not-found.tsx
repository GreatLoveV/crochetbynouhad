import { NotFoundContent } from "@/components/not-found-content";

/**
 * 404 for anything inside the shop: an unknown URL, or a product that no
 * longer exists or has been deactivated. The site header and footer come from
 * `[lang]/layout.tsx`, in the page's language.
 */
export default function ShopNotFound() {
  return <NotFoundContent />;
}
