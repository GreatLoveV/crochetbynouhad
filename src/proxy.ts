import { NextResponse } from "next/server";

import { auth } from "@/lib/auth/auth";

/**
 * Fast redirect for the admin screens.
 *
 * This only reads the session cookie — no database query — because it runs on
 * every request. It is a convenience, not the security boundary: the real check
 * is `requireAdmin()` in `src/lib/auth/admin.ts`, called by every admin page and
 * every admin server action. (A server action is a POST to the page it is used
 * on, so a matcher gap would otherwise leave it wide open.)
 */
export async function proxy(request: Request & { nextUrl: URL; url: string }) {
  const { pathname } = new URL(request.url);

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

export const config = {
  // Only /admin, and never the Next.js internals.
  matcher: ["/admin/:path*", "/admin"],
};