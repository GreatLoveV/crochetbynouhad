import { neonConfig, Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "./schema";

/**
 * A second database client, used only when several statements have to succeed
 * or fail together (placing an order writes `orders` + `order_items`).
 *
 * The main client in `./index.ts` speaks HTTP: faster, but it cannot keep a
 * transaction open across several round trips. Transactions need the WebSocket
 * pool below, which does.
 *
 * `ws` is required because a deployed serverless function has no usable global
 * WebSocket on every Node version Neon supports. It must stay in
 * `dependencies` (not `devDependencies`) or Vercel will not bundle it.
 */
neonConfig.webSocketConstructor = ws;

function createClient() {
  return drizzle(new Pool({ connectionString: process.env.DATABASE_URL! }), {
    schema,
  });
}

// Kept at module scope so a warm serverless instance reuses its connections.
let client: ReturnType<typeof createClient> | null = null;

export function getTxDb() {
  client ??= createClient();
  return client;
}