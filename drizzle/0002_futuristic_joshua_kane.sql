ALTER TABLE "categories" ADD COLUMN "is_coming_soon" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "is_unique" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "is_sold_out" boolean DEFAULT false NOT NULL;

-- Only crochet bags are made today. The scarves and accessories are seeded
-- sample rows: hide them (never delete) and mark both categories as coming
-- soon. Nouhad flips a category live again from /admin/categories.
UPDATE "products"
SET "is_active" = false
WHERE "category_id" IN (
  SELECT "id" FROM "categories" WHERE "slug" IN ('echarpes', 'accessoires')
);

UPDATE "categories"
SET "is_coming_soon" = true
WHERE "slug" IN ('echarpes', 'accessoires');
