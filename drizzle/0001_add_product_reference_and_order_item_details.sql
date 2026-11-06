ALTER TABLE "order_items" ADD COLUMN "product_name" text;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "product_reference" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "reference" text;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_reference_unique" UNIQUE("reference");

-- Backfill: generate references for existing products (CN-0001 style)
UPDATE "products"
SET "reference" = 'CN-' || LPAD("id"::text, 4, '0')
WHERE "reference" IS NULL;

-- Backfill order_items with historical product details
UPDATE "order_items" oi
SET
  "product_name" = p."name_fr",
  "product_reference" = p."reference"
FROM "products" p
WHERE oi."product_id" = p."id"
  AND (oi."product_name" IS NULL OR oi."product_reference" IS NULL);