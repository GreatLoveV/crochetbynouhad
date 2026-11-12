import { LoadingState } from "@/components/ui/state";
import { getDictionary } from "@/i18n/server";

/**
 * Shown while a shop page streams in: the chain loader, nothing else. A full
 * screen tall, so the footer stays out of view and does not jump when the
 * page arrives.
 */
export default async function ShopLoading() {
  const t = await getDictionary();
  return <LoadingState label={t.common.loading} className="min-h-dvh" />;
}
