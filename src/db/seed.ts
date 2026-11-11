import { db } from "./index";
import { categories, products, productImages } from "./schema";
import { CATEGORY_NAMES_AR, PRODUCT_TEXT_AR } from "./seed-arabic";

async function seed() {
  console.log("Seeding...");

  const insertedCategories = await db
    .insert(categories)
    .values([
      { slug: "sacs", nameAr: CATEGORY_NAMES_AR["sacs"], nameFr: "Sacs", nameEn: "Bags" },
      { slug: "echarpes", nameAr: CATEGORY_NAMES_AR["echarpes"], nameFr: "Écharpes", nameEn: "Scarves" },
      { slug: "accessoires", nameAr: CATEGORY_NAMES_AR["accessoires"], nameFr: "Accessoires", nameEn: "Accessories" },
    ])
    .returning();

  const sacs = insertedCategories.find((c) => c.slug === "sacs")!;
  const echarpes = insertedCategories.find((c) => c.slug === "echarpes")!;
  const accessoires = insertedCategories.find((c) => c.slug === "accessoires")!;

  // 2. Products
  const insertedProducts = await db
    .insert(products)
    .values([
      {
        slug: "sac-fleur-rose",
        categoryId: sacs.id,
        nameAr: PRODUCT_TEXT_AR["sac-fleur-rose"].name,
        descriptionAr: PRODUCT_TEXT_AR["sac-fleur-rose"].description,
        nameFr: "Sac Fleur Rose",
        nameEn: "Rose Flower Bag",
        descriptionFr:
          "Sac tote fait main au crochet, motif fleur rose, doublure intérieure.",
        descriptionEn:
          "Handmade crochet tote bag with a rose flower pattern and inner lining.",
        price: 25000, // 250.00 MAD
      },
      {
        slug: "mini-sac-bandouliere",
        categoryId: sacs.id,
        nameAr: PRODUCT_TEXT_AR["mini-sac-bandouliere"].name,
        descriptionAr: PRODUCT_TEXT_AR["mini-sac-bandouliere"].description,
        nameFr: "Mini Sac Bandoulière",
        nameEn: "Mini Crossbody Bag",
        descriptionFr:
          "Petit sac bandoulière au crochet, idéal pour les sorties.",
        descriptionEn: "Small crochet crossbody bag, perfect for going out.",
        price: 18000, // 180.00 MAD
      },
      {
        slug: "pochette-perlee",
        categoryId: accessoires.id,
        nameAr: PRODUCT_TEXT_AR["pochette-perlee"].name,
        descriptionAr: PRODUCT_TEXT_AR["pochette-perlee"].description,
        nameFr: "Pochette Perlée",
        nameEn: "Beaded Clutch",
        descriptionFr: "Pochette au crochet ornée de perles, fermeture zip.",
        descriptionEn: "Crochet clutch decorated with beads, zip closure.",
        price: 22000, // 220.00 MAD
      },
      {
        slug: "echarpe-hiver",
        categoryId: echarpes.id,
        nameAr: PRODUCT_TEXT_AR["echarpe-hiver"].name,
        descriptionAr: PRODUCT_TEXT_AR["echarpe-hiver"].description,
        nameFr: "Écharpe d'Hiver",
        nameEn: "Winter Scarf",
        descriptionFr: "Écharpe chaude en laine crochetée à la main.",
        descriptionEn: "Warm hand-crocheted wool scarf.",
        price: 15000, // 150.00 MAD
      },
      {
        slug: "sac-plage-raphia",
        categoryId: sacs.id,
        nameAr: PRODUCT_TEXT_AR["sac-plage-raphia"].name,
        descriptionAr: PRODUCT_TEXT_AR["sac-plage-raphia"].description,
        nameFr: "Sac de Plage Raphia",
        nameEn: "Raffia Beach Bag",
        descriptionFr:
          "Grand sac de plage en raphia crocheté, spacieux et léger.",
        descriptionEn: "Large crocheted raffia beach bag, spacious and light.",
        price: 28000, // 280.00 MAD
      },
      {
        slug: "beret-laine",
        categoryId: accessoires.id,
        nameAr: PRODUCT_TEXT_AR["beret-laine"].name,
        descriptionAr: PRODUCT_TEXT_AR["beret-laine"].description,
        nameFr: "Béret en Laine",
        nameEn: "Wool Beret",
        descriptionFr: "Béret doux en laine, plusieurs coloris disponibles.",
        descriptionEn: "Soft wool beret, available in several colors.",
        price: 12000, // 120.00 MAD
      },
    ])
    .returning();
  // 3. Product images (placeholder URLs — swap for real ones later)
  const imageRows = insertedProducts.flatMap((product) => [
    {
      productId: product.id,
      url: `https://placehold.co/600x600?text=${encodeURIComponent(product.nameEn)}+1`,
      position: 0,
    },
    {
      productId: product.id,
      url: `https://placehold.co/600x600?text=${encodeURIComponent(product.nameEn)}+2`,
      position: 1,
    },
  ]);

  await db.insert(productImages).values(imageRows);

  console.log(
    `Seeded ${insertedCategories.length} categories, ${insertedProducts.length} products, ${imageRows.length} images.`,
  );
}
seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
