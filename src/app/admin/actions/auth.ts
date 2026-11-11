"use server";

import { unstable_rethrow } from "next/navigation";
import { CredentialsSignin } from "next-auth";

import { signIn, signOut } from "@/lib/auth/auth";
import { ADMIN_LOGIN_PATH } from "@/lib/auth/admin";
import { strings } from "@/lib/constants/strings";

export type LoginState = {
  error?: string;
};

/**
 * Signs an admin in.
 *
 * Auth.js signals success by throwing a redirect, so a `catch` that treats
 * every error as a failed login would break the happy path: the redirect has to
 * be re-thrown untouched for Next to actually leave the page.
 */
export async function loginAction(
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const from = String(formData.get("from") ?? "");
  // Only ever redirect to a path inside this site.
  const redirectTo = from.startsWith("/admin") ? from : ADMIN_LOGIN_PATH;

  if (!email || !password) return { error: strings.admin.emptyField };

  try {
    await signIn("credentials", { email, password, redirectTo });
  } catch (error) {
    // Lets Next's own redirect (the success path) through untouched.
    unstable_rethrow(error);
    if (error instanceof CredentialsSignin && error.code === "rate_limited") {
      return { error: strings.admin.loginTooMany };
    }
    return { error: strings.admin.invalidCredentials };
  }

  // No redirect means Auth.js refused the credentials.
  return { error: strings.admin.invalidCredentials };
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}