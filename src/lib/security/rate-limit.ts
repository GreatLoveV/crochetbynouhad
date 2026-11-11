import "server-only";

import { and, eq, gt, lt, sql } from "drizzle-orm";

import { db } from "@/db";
import { attempts } from "@/db/schema";

/**
 * Tiny database-backed rate limiter.
 *
 * Serverless functions share no memory, so the count has to live somewhere
 * every instance can see: the `attempts` table. Traffic is a handful of
 * requests a day, so a COUNT over an indexed (key, created_at) range is cheap.
 */

/** `true` when `key` already has `limit` or more events in the last `windowSeconds`. */
export async function isRateLimited(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<boolean> {
  const [row] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(attempts)
    .where(
      and(
        eq(attempts.key, key),
        gt(attempts.createdAt, sql`now() - make_interval(secs => ${windowSeconds})`),
      ),
    );
  return (row?.total ?? 0) >= limit;
}

/** Records one event for each key, and sweeps rows older than a day. */
export async function recordAttempt(...keys: string[]): Promise<void> {
  if (keys.length === 0) return;
  await db.insert(attempts).values(keys.map((key) => ({ key })));
  await db
    .delete(attempts)
    .where(lt(attempts.createdAt, sql`now() - interval '1 day'`));
}

/** Forgets a key, e.g. the failed logins of an address that just signed in. */
export async function clearAttempts(key: string): Promise<void> {
  await db.delete(attempts).where(eq(attempts.key, key));
}

/**
 * The visitor's IP, from the headers the hosting proxy sets.
 *
 * On Vercel `x-forwarded-for` is overwritten by the platform, so the first
 * entry is the real client. Falls back to a shared bucket rather than
 * skipping the limit when nothing is there.
 */
export function clientIpFrom(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip")?.trim() || "unknown";
}
