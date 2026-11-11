/**
 * Strings of the admin, in French, plus the site-wide constants below.
 *
 * The public shop is in French and Arabic: its text lives in the dictionaries
 * under `src/i18n/dictionaries/`, not here. The admin is for Nouhad only and
 * stays in French.
 */
export const strings = {
  siteName: "Crochet by Nouhad",
  admin: {
    title: "Administration",
    soldOut: "Vendu",
    subtitle: "Gérez vos pièces et vos commandes.",
    products: "Pièces",
    orders: "Commandes",
    viewSite: "Voir la boutique",
    logout: "Déconnexion",
    signedInAs: "Connecté",
    backToProducts: "Retour aux pièces",

    loginTitle: "Espace administration",
    loginSubtitle: "Connectez-vous pour gérer la boutique.",
    email: "E-mail",
    password: "Mot de passe",
    signIn: "Se connecter",
    signingIn: "Connexion…",
    invalidCredentials: "E-mail ou mot de passe incorrect.",
    emptyField: "Renseignez votre e-mail et votre mot de passe.",

    newProduct: "Nouvelle pièce",
    editProduct: "Modifier la pièce",
    productName: "Nom (français)",
    productNamePlaceholder: "Sac Fleur Rose",
    productDescription: "Description (français)",
    productDescriptionPlaceholder:
      "Décrivez la pièce, la matière, les dimensions… Une ligne vide sépare les paragraphes.",
    productNameAr: "Nom (arabe)",
    productNameArPlaceholder: "حقيبة الوردة",
    productDescriptionAr: "Description (arabe)",
    arabicOptionalHint:
      "Facultatif. Tant que ce champ est vide, la boutique en arabe affiche le texte français.",
    categoryNameAr: "Nom en arabe",
    categoryNameArSave: "Enregistrer",
    categoryNameArMissing: "Pas encore traduit : la boutique en arabe affiche le nom français.",
    productCategory: "Catégorie",
    productPrice: "Prix (MAD)",
    productPriceHint: "En dirhams, sans décimales : 250 pour 250,00 MAD.",
    productSlug: "Adresse web",
    productReference: "Référence",
    productReferenceHint:
      "Identifiant stable de la pièce, affiché à la boutique et sur chaque commande. Laisser vide pour le générer à l’enregistrement.",
    productActive: "Visible dans la boutique",
    productActiveHint:
      "Décochez pour retirer la pièce de la boutique sans la supprimer.",
    saleStatus: "Disponibilité",
    saleStatusSold: "Vendue — n'apparaît plus comme disponible à la boutique.",
    saleStatusAvailable: "En vente.",
    markSold: "Marquer comme vendue",
    markSoldHint: "Pour une pièce vendue en dehors du site (WhatsApp, en main propre).",
    markAvailable: "Remettre en vente",
    markedSold: "Pièce marquée comme vendue.",
    markedAvailable: "Pièce remise en vente.",
    errorHeldByOrder:
      "Une commande en cours contient cette pièce. Annulez d'abord la commande.",
    errorResold:
      "Une pièce de cette commande a été revendue entre-temps : impossible de la réactiver.",
    loginTooMany:
      "Trop de tentatives. Réessayez dans 15 minutes.",
    save: "Enregistrer",
    saving: "Enregistrement…",
    cancel: "Annuler",
    delete: "Supprimer",
    created: "Pièce enregistrée.",
    updated: "Modifications enregistrées.",
    toggled: "Visibilité mise à jour.",
    fixErrors: "Vérifiez les champs signalés.",
    errorGeneric: "L'enregistrement a échoué. Réessayez.",
    errorNotFound: "Cette pièce n'existe pas.",
    errorSlugTaken: "Cette adresse web est déjà utilisée.",
    deactivate: "Retirer de la boutique",
    reactivate: "Remettre en boutique",
    noProducts: "Aucune pièce pour le moment.",
    images: "Photos",
    imageUrl: "Adresse de la photo",
    imageUrlPlaceholder: "https://…",
    addImage: "Ajouter une photo",
    removeImage: "Retirer",
    firstImageHint:
      "La première photo sert de couverture et apparaît dans la liste de la boutique.",
    noImages: "Aucune photo. La pièce s'affichera sans image.",

    newOrder: "Commandes",
    orderReference: "Commande",
    orderCustomer: "Client",
    orderPhone: "Téléphone",
    orderCity: "Ville",
    orderAddress: "Adresse",
    orderNotes: "Message du client",
    orderDate: "Reçue le",
    orderStatus: "Statut",
    orderItems: "Articles",
    noOrders: "Aucune commande pour le moment.",
    statusUpdated: "Statut mis à jour.",
    whatsappCustomer: "Contacter le client sur WhatsApp",
    orderTotal: "Total",

    categories: "Catégories",
    categoriesSubtitle:
      "Marquez une catégorie « À venir » tant qu’aucune pièce n’y est disponible.",
    categoryComingSoon: "À venir",
    categoryComingSoonHint:
      "La catégorie reste visible avec un badge « Bientôt ».",
    categoryLive: "En ligne",
    categoryUpdated: "Catégorie mise à jour.",
  },

  orderStatus: {
    new: "Reçue",
    confirmed: "Confirmée",
    shipped: "Expédiée",
    delivered: "Livrée",
    cancelled: "Annulée",
  },
} as const;

/** Instagram handle placeholder — replace with the real account when known. */
export const INSTAGRAM_URL = "https://instagram.com/crochetbynouhad";

/**
 * Canonical site origin, used for metadata/OG URLs, the sitemap and robots.txt.
 *
 * Resolution order:
 *   1. `NEXT_PUBLIC_SITE_URL`, if set — wins over everything.
 *   2. Vercel's own project domain, so a deploy needs no configuration.
 *   3. `localhost`, which is correct under `next dev` and nowhere else.
 *
 * Publishing `localhost:3000` as the canonical address would poison search
 * results and link previews while looking completely normal, so a production
 * build with neither of the first two refuses to run.
 *
 * The guard is server-only: `VERCEL_*` is stripped from the browser bundle by
 * design, and `strings.ts` is imported by client components, so evaluating
 * there would throw on every page.
 */
const IS_SERVER = typeof window === "undefined";

const EXPLICIT_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

const VERCEL_HOST =
  process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;

const VERCEL_SITE_URL = VERCEL_HOST
  ? `https://${VERCEL_HOST.replace(/^https?:\/\//, "")}`
  : undefined;

const RESOLVED_SITE_URL = EXPLICIT_SITE_URL ?? VERCEL_SITE_URL;

if (IS_SERVER && process.env.NODE_ENV === "production" && !RESOLVED_SITE_URL) {
  throw new Error(
    "No public origin for the site. Set NEXT_PUBLIC_SITE_URL to the deployed " +
      "origin with no trailing slash, e.g. https://example.com",
  );
}

export const SITE_URL = RESOLVED_SITE_URL ?? "http://localhost:3000";
