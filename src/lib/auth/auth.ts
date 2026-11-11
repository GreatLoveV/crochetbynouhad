import "server-only";

import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";
import {
  clearAttempts,
  clientIpFrom,
  isRateLimited,
  recordAttempt,
} from "@/lib/security/rate-limit";

/**
 * Brute-force protection. Checked inside `authorize`, not only in the login
 * form's action, because Auth.js also exposes the credentials callback as a
 * plain POST endpoint that never goes through the form.
 */
const LOGIN_WINDOW_SECONDS = 15 * 60;
const MAX_FAILURES_PER_EMAIL = 5;
const MAX_FAILURES_PER_IP = 10;

/** Thrown when there were too many failed attempts; the form shows its own message. */
export class TooManyLoginAttempts extends CredentialsSignin {
  code = "rate_limited";
}

/**
 * Authentication for the admin area.
 *
 * Credentials + a signed JWT cookie (no session table, nothing to clean up).
 * `AUTH_SECRET` is read automatically from the environment by Auth.js.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      name: "Identifiants",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials, request) {
        const email = String(credentials?.email ?? "")
          .trim()
          .toLowerCase();
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;

        const emailKey = `login:email:${email}`;
        const ipKey = `login:ip:${clientIpFrom(request.headers)}`;
        if (
          (await isRateLimited(emailKey, MAX_FAILURES_PER_EMAIL, LOGIN_WINDOW_SECONDS)) ||
          (await isRateLimited(ipKey, MAX_FAILURES_PER_IP, LOGIN_WINDOW_SECONDS))
        ) {
          throw new TooManyLoginAttempts();
        }

        const user = await db.query.users.findFirst({
          where: eq(users.email, email),
        });

        // Same answer for "no such account" and "wrong password", so the form
        // cannot be used to find out which addresses are registered.
        const passwordMatches = user
          ? await bcrypt.compare(password, user.passwordHash)
          : false;
        if (!user || !passwordMatches) {
          await recordAttempt(emailKey, ipKey);
          return null;
        }

        await clearAttempts(emailKey);

        return { id: String(user.id), email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    // The id and role are added to the token once, at sign-in.
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role ?? "admin";
      }
      return token;
    },
    session({ session, token }) {
      // Only ever copied from a token we ourselves signed.
      if (session.user && typeof token.id === "string") {
        session.user.id = token.id;
        session.user.role = token.role ?? "admin";
      }
      return session;
    },
  },
});