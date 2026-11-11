import { NextResponse, type NextRequest } from "next/server";

import { auth } from "@/lib/auth/auth";
import {
  defaultLocale,
  hasLocale,
  LOCALE_COOKIE,
  type Locale,
} from "@/i18n/config";

/**
 * Runs before every page request. Two jobs:
 *
 * 1. Language. Every public URL starts with `/fr` or `/ar`. A path without one
 *    (`/`, or an old shared link such as `/products/sac-fleur-rose`) is
 *    redirected to the same path in the visitor's language: the one they
 *    last picked with the switcher (a cookie), else the first of French or
 *    Arabic their browser asks for, else French.
 *
 * 2. Admin. A fast redirect for signed-out visitors. This only reads the
 *    session cookie, no database query. It is a convenience, not the security
 *    boundary: the real check is `requireAdmin()` in `src/lib/auth/admin.ts`,
 *    called by every admin page and every admin server action. (A server
 *    action is a POST to the page it is used on, so a matcher gap would
 *    otherwise leave it wide open.)
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return adminRedirect(request, pathname);
  }

  const first = pathname.split("/")[1];
  if (hasLocale(first)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLocale(request)}${pathname === "/" ? "" : pathname}`;
  // 307: the target depends on the visitor, so browsers must not cache it.
  return NextResponse.redirect(url, 307);
}

async function adminRedirect(request: NextRequest, pathname: string) {
  const session = await auth();
  const isLoggedIn = Boolean(session?.user?.id);

  // Already signed in and sitting on the login form: skip it.
  if (pathname === "/admin/login") {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    const login = new URL("/admin/login", request.url);
    // Remember where they were heading so login can send them back.
    if (pathname !== "/admin") login.searchParams.set("from", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

/** Cookie from the switcher first, then `Accept-Language`, then French. */
function preferredLocale(request: NextRequest): Locale {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  if (hasLocale(saved)) return saved;
  return fromAcceptLanguage(request.headers.get("accept-language")) ?? defaultLocale;
}

/**
 * Reads `Accept-Language` by hand, e.g. `ar-MA,ar;q=0.9,fr;q=0.8,en;q=0.7`.
 * Only the language part matters (`ar-MA` counts as `ar`). The highest `q`
 * among our languages wins; ties keep the browser's order.
 */
function fromAcceptLanguage(header: string | null): Locale | undefined {
  if (!header) return undefined;

  let best: { lang: Locale; q: number } | undefined;
  for (const part of header.split(",").slice(0, 20)) {
    const [tag, ...params] = part.trim().split(";");
    const base = tag.trim().toLowerCase().split("-")[0];
    if (!hasLocale(base)) continue;

    const qParam = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
    const q = qParam ? Number(qParam.slice(2)) : 1;
    if (!Number.isFinite(q) || q <= 0) continue;

    if (!best || q > best.q) best = { lang: base, q };
  }
  return best?.lang;
}

export const config = {
  // Every page, but never Next's internals, the API (auth), or files with an
  // extension (favicon.ico, robots.txt, sitemap.xml, images).
  matcher: ["/((?!api/|_next/|.*\\.[^/]+$).*)"],
};
