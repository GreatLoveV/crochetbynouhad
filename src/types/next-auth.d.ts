import type { DefaultSession } from "next-auth";

/**
 * Teaches TypeScript about the extra fields the `jwt` and `session` callbacks
 * in `src/lib/auth.ts` add.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  /** `role` comes back from the `authorize` callback in `src/lib/auth.ts`. */
  interface User {
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}

/**
 * The same interface, reached through the package Auth.js actually reads.
 * Declaring both is what makes `token.id` typed instead of `unknown`.
 */
declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}