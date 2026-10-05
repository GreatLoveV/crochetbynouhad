import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

/**
 * The one place that decides whether the current visitor is allowed into the
 * admin.
 *
 * `src/proxy.ts` also checks the session, but only as a fast redirect for
 * screens. A server action is a plain POST to the page it lives on, so relying
 * on the proxy alone would let anyone who knows the URL call it directly. Every
 * admin page and every admin server action starts with `requireAdmin()`.
 */

export const ADMIN_LOGIN_PATH = "/admin/login";

/**
 * Returns the signed-in admin, or sends them to the login page.
 *
 * Use at the top of any admin page. Redirecting is right for a screen: there is
 * nothing useful to show a stranger.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) redirect(ADMIN_LOGIN_PATH);
  return session.user;
}

/**
 * Same check, but for server actions: returns `null` instead of redirecting, so
 * the caller can return an error message rather than bouncing the visitor
 * mid-submit. Always check the result.
 */
export async function getAdmin() {
  const session = await auth();
  return session?.user?.id ? session.user : null;
}