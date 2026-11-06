import "server-only";

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";

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
      async authorize(credentials) {
        const email = String(credentials?.email ?? "")
          .trim()
          .toLowerCase();
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;

        const user = await db.query.users.findFirst({
          where: eq(users.email, email),
        });

        // Same answer for "no such account" and "wrong password", so the form
        // cannot be used to find out which addresses are registered.
        if (!user) return null;

        const passwordMatches = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatches) return null;

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