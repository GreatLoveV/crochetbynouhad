import "server-only";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "./fr";

/**
 * Loads one language's dictionary. Kept apart from `@/i18n/server` (which
 * uses `next/root-params`) so Server Actions and Route Handlers, where root
 * params are not available, can import it.
 */
const loaders: Record<Locale, () => Promise<Dictionary>> = {
  fr: () => import("./fr").then((module) => module.default),
  ar: () => import("./ar").then((module) => module.default),
};

export function getDictionaryFor(lang: Locale): Promise<Dictionary> {
  return loaders[lang]();
}
