import { lang as rootLang } from "next/root-params";
import { notFound } from "next/navigation";

import { hasLocale, type Locale } from "@/i18n/config";
import { getDictionaryFor } from "@/i18n/dictionaries";
import type { Dictionary } from "@/i18n/dictionaries/fr";

/**
 * Server-side access to the current language.
 *
 * `next/root-params` reads the `[lang]` segment from anywhere on the server
 * (pages, layouts, `generateMetadata`, shared components) without passing it
 * down. It does not work in Client Components, Server Actions or Route
 * Handlers: those get the language as an argument instead.
 */

/** The language of the current request. Anything else is a 404. */
export async function getLang(): Promise<Locale> {
  const value = await rootLang();
  if (!hasLocale(value)) notFound();
  return value;
}

/** The dictionary of the current request's language. */
export async function getDictionary(): Promise<Dictionary> {
  return getDictionaryFor(await getLang());
}
