import { LoadingState } from "@/components/ui/state";
import { getDictionary } from "@/i18n/server";

/** Shown while a shop page streams in: the chain loader, nothing else. */
export default async function ShopLoading() {
  const t = await getDictionary();
  return <LoadingState label={t.common.loading} className="min-h-[50vh]" />;
}
