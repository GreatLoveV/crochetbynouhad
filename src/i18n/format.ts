import { intlLocale, type Locale } from "@/i18n/config";
import type { Plural } from "@/i18n/dictionaries/fr";

/**
 * Locale-aware formatting that is not money. Prices go through `formatPrice`
 * in `@/lib/format/money`, which takes the same `Locale`.
 */

/** Picks the right plural form, then fills `{count}`. */
export function plural(lang: Locale, forms: Plural, count: number): string {
  const category = new Intl.PluralRules(intlLocale[lang]).select(count);
  const template = forms[category] ?? forms.other;
  return template.replace("{count}", String(count));
}

/** A day such as "11 novembre 2026" / "11 نونبر 2026" (Western digits). */
export function formatDate(lang: Locale, date: Date): string {
  return new Intl.DateTimeFormat(intlLocale[lang], { dateStyle: "long" }).format(date);
}
