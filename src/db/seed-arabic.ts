import { eq, and, isNull } from "drizzle-orm";

import { db } from "./index";
import { categories, products } from "./schema";

/**
 * Arabic text for the sample catalogue in `seed.ts`, keyed by slug.
 *
 * Machine-assisted translation, listed in `docs/i18n/translations-review.md`
 * for a native speaker to check. Real pieces get their Arabic text in the
 * admin.
 */
export const CATEGORY_NAMES_AR: Record<string, string> = {
  sacs: "حقائب",
  echarpes: "أوشحة",
  accessoires: "إكسسوارات",
};

export const PRODUCT_TEXT_AR: Record<string, { name: string; description: string }> = {
  "sac-fleur-rose": {
    name: "حقيبة الوردة",
    description: "حقيبة يد كروشيه مصنوعة يدويًا، بنقشة وردة، مع بطانة داخلية.",
  },
  "mini-sac-bandouliere": {
    name: "حقيبة كتف صغيرة",
    description: "حقيبة كتف صغيرة من الكروشيه، مثالية للخرجات.",
  },
  "pochette-perlee": {
    name: "محفظة يد بالخرز",
    description: "محفظة يد من الكروشيه مزيّنة بالخرز، تُغلق بسحّاب.",
  },
  "echarpe-hiver": {
    name: "وشاح الشتاء",
    description: "وشاح دافئ من الصوف، محاك يدويًا بالكروشيه.",
  },
  "sac-plage-raphia": {
    name: "حقيبة شاطئ من الرافيا",
    description: "حقيبة شاطئ كبيرة من الرافيا المحاكة بالكروشيه، واسعة وخفيفة.",
  },
  "beret-laine": {
    name: "بيريه من الصوف",
    description: "بيريه ناعم من الصوف، متوفر بعدة ألوان.",
  },
};

/**
 * Fills the Arabic columns of an existing sample catalogue, only where they
 * are still empty: anything typed in the admin is never overwritten.
 * Run with `npm run seed:ar`.
 */
async function backfill() {
  let filled = 0;
  for (const [slug, nameAr] of Object.entries(CATEGORY_NAMES_AR)) {
    const rows = await db
      .update(categories)
      .set({ nameAr })
      .where(and(eq(categories.slug, slug), isNull(categories.nameAr)))
      .returning({ id: categories.id });
    filled += rows.length;
  }
  for (const [slug, text] of Object.entries(PRODUCT_TEXT_AR)) {
    const nameRows = await db
      .update(products)
      .set({ nameAr: text.name })
      .where(and(eq(products.slug, slug), isNull(products.nameAr)))
      .returning({ id: products.id });
    const descriptionRows = await db
      .update(products)
      .set({ descriptionAr: text.description })
      .where(and(eq(products.slug, slug), isNull(products.descriptionAr)))
      .returning({ id: products.id });
    filled += nameRows.length + descriptionRows.length;
  }
  console.log(`Arabic text filled in ${filled} empty field(s).`);
}

// Only when run directly, not when `seed.ts` imports the tables above.
if (process.argv[1]?.split("\\").join("/").endsWith("src/db/seed-arabic.ts")) {
  backfill()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
