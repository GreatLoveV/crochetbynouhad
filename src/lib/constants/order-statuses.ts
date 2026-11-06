import { orderStatusEnum } from "@/db/schema";

/**
 * Order lifecycle as seen by the admin.
 *
 * This lives OUTSIDE `@/lib/data/admin-orders` on purpose: that module connects to
 * the database, so any client component importing a constant from it would pull
 * `@neondatabase/serverless` (and the `process.env.DATABASE_URL!` read at
 * module load) into the browser bundle, where `neon()` throws. Drizzle's table
 * definitions themselves are plain metadata — safe to bundle anywhere.
 */
export type OrderStatus = (typeof orderStatusEnum.enumValues)[number];

export const ORDER_STATUSES = orderStatusEnum.enumValues;

/** Guards a status coming from a form before it reaches the enum column. */
export function isOrderStatus(value: string): value is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(value);
}