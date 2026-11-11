ALTER TABLE "order_items" ALTER COLUMN "quantity" SET DEFAULT 1;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "public_token" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "is_unique";--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_public_token_unique" UNIQUE("public_token");