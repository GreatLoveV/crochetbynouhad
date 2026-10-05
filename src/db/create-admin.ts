import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import { db } from "./index";
import { users } from "./schema";

/**
 * Creates (or re-sets the password of) the admin account.
 *
 *   npm run create-admin -- admin@crochetbynouhad.ma 'un-mot-de-passe-solide'
 *
 * The password is hashed with bcrypt before it touches the database — the plain
 * password is never stored. Running it again with the same address only updates
 * the password, so it doubles as a "I forgot my password" tool.
 *
 * Note: no top-level `await` anywhere in this project (tsx compiles to CommonJS),
 * hence the `main()` wrapper.
 */

async function main() {
  const [email, password] = process.argv.slice(2);

  if (!email || !password) {
    console.error(
      "Usage: npm run create-admin -- <email> <mot-de-passe>\n" +
        "Example: npm run create-admin -- admin@crochetbynouhad.ma 'mon-mot-de-passe'",
    );
    process.exit(1);
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (password.length < 8) {
    console.error("Le mot de passe doit faire au moins 8 caractères.");
    process.exit(1);
  }

  // 12 rounds: high enough to be slow for an attacker, fast enough for a login.
  const passwordHash = await bcrypt.hash(password, 12);

  const existing = await db.query.users.findFirst({
    where: eq(users.email, normalizedEmail),
  });

  if (existing) {
    await db
      .update(users)
      .set({ passwordHash })
      .where(eq(users.email, normalizedEmail));
    console.log(`Mot de passe mis à jour pour ${normalizedEmail}.`);
    return;
  }

  await db.insert(users).values({ email: normalizedEmail, passwordHash });
  console.log(`Compte admin créé : ${normalizedEmail}`);
}

main().catch((error) => {
  console.error("Échec :", error);
  process.exit(1);
});