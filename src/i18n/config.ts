/**
 * The two languages of the shop, and everything that depends on which one is
 * active. Plain constants with no server imports, so client components can use
 * them too.
 *
 * Every public URL starts with the language: `/fr/...` or `/ar/...`. A path
 * without one is redirected by `src/proxy.ts`.
 */
export const locales = ["fr", "ar"] as const;

export type Locale = (typeof locales)[number];

/** French is the default: the language of any URL that has none. */
export const defaultLocale: Locale = "fr";

/** Remembers the language a visitor picked with the switcher. */
export const LOCALE_COOKIE = "cbn-lang";

export function hasLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

export function dirOf(lang: Locale): "ltr" | "rtl" {
  return lang === "ar" ? "rtl" : "ltr";
}

/**
 * The tag passed to `Intl`. Arabic pages use Western digits (0–9), as most
 * Moroccan shops do, so the numbering system is pinned to `latn`.
 */
export const intlLocale: Record<Locale, string> = {
  fr: "fr-MA",
  ar: "ar-MA-u-nu-latn",
};

/** Open Graph locale, read by WhatsApp and social link previews. */
export const ogLocale: Record<Locale, string> = {
  fr: "fr_MA",
  ar: "ar_MA",
};

/** Each language's own name, for the switcher ("Français", "العربية"). */
export const localeName: Record<Locale, string> = {
  fr: "Français",
  ar: "العربية",
};

/**
 * The switcher's short label on phones. Each is part of the full name above,
 * so the link's accessible name contains what is seen (WCAG 2.5.3).
 */
export const localeShortName: Record<Locale, string> = {
  fr: "FR",
  ar: "عربي",
};

/** The language the switcher offers from this one. */
export function otherLocale(lang: Locale): Locale {
  return lang === "fr" ? "ar" : "fr";
}

/**
 * Prefixes an in-site path with the language.
 *
 * `localePath("ar", "/")` → `/ar`, `localePath("ar", "/cart")` → `/ar/cart`,
 * `localePath("fr", "/#boutique")` → `/fr#boutique`.
 */
export function localePath(lang: Locale, path: string): string {
  if (!path.startsWith("/")) throw new Error(`localePath expects an absolute path, got "${path}"`);
  const rest = path === "/" ? "" : path.startsWith("/#") || path.startsWith("/?") ? path.slice(1) : path;
  return `/${lang}${rest}`;
}

/**
 * Swaps the language at the start of a pathname, keeping the rest:
 * `/fr/products/sac` → `/ar/products/sac`. A path with no language gets one.
 */
export function switchLocalePath(pathname: string, to: Locale): string {
  const segments = pathname.split("/");
  if (hasLocale(segments[1])) {
    segments[1] = to;
    return segments.join("/") || `/${to}`;
  }
  return localePath(to, pathname || "/");
}

/**
 * Replaces `{name}` placeholders in a dictionary string.
 * `fill("Bonjour {shop}", { shop: "Crochet by Nouhad" })`.
 */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
