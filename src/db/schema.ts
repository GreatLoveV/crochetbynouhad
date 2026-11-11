import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  pgEnum,
  index,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const roleEnum = pgEnum("role", ["admin"]);

export const orderStatusEnum = pgEnum("order_status", [
  "new",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").notNull().default("admin"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  // Legacy English name. No longer shown or edited (the site is French and
  // Arabic); kept until its removal is approved.
  nameEn: text("name_en").notNull(),
  nameFr: text("name_fr").notNull(),
  // Arabic name. Optional: pages fall back to the French name when empty.
  nameAr: text("name_ar"),
  // A category with no pieces yet: shown with a "Bientôt" badge instead of
  // being hidden, so visitors know it is coming.
  isComingSoon: boolean("is_coming_soon").notNull().default(false),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id),
  nameFr: text("name_fr").notNull(),
  // Arabic name and description. Optional: Arabic pages fall back to the
  // French text when they are empty.
  nameAr: text("name_ar"),
  descriptionFr: text("description_fr").notNull(),
  descriptionAr: text("description_ar"),
  // Legacy English text. No longer shown or edited; kept until its removal is
  // approved. New products copy the French text here to satisfy NOT NULL.
  nameEn: text("name_en").notNull(),
  descriptionEn: text("description_en").notNull(),
  price: integer("price").notNull(),
  reference: text("reference").unique(),
  isActive: boolean("is_active").notNull().default(true),
  // Every bag is one of a kind: no quantity, and the bag is taken out of
  // circulation the moment an order is placed (until that order is cancelled).
  isSoldOut: boolean("is_sold_out").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const productImages = pgTable("product_images", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  url: text("url").notNull(),
  position: integer("position").notNull().default(0),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  city: text("city").notNull(),
  address: text("address").notNull(),
  notes: text("notes"),
  status: orderStatusEnum("status").notNull().default("new"),
  // Unguessable id for the customer's confirmation link. The numeric id is
  // sequential, so using it in a public URL would let anyone read every order.
  publicToken: uuid("public_token").notNull().defaultRandom().unique(),
  total: integer("total").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  // Always 1 (every bag is unique). Kept so old order rows stay readable.
  quantity: integer("quantity").notNull().default(1),
  unitPrice: integer("unit_price").notNull(),
  productName: text("product_name"),
  productReference: text("product_reference"),
});

/**
 * One row per rate-limited event (a failed login, a placed order), keyed by
 * what is being limited, e.g. `login:ip:1.2.3.4`. Counted over a time window by
 * `src/lib/security/rate-limit.ts`; rows older than a day are swept away.
 */
export const attempts = pgTable(
  "attempts",
  {
    id: serial("id").primaryKey(),
    key: text("key").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("attempts_key_created_at_idx").on(table.key, table.createdAt)],
);

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  images: many(productImages),
  orderItems: many(orderItems),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));
