CREATE TABLE "attempts" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "attempts_key_created_at_idx" ON "attempts" USING btree ("key","created_at");