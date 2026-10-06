/**
 * Every user-facing string lives here, in French.
 *
 * The site is French-only for now (no i18n, no [locale] routes). Keeping the
 * copy in one file means switching to next-intl later is a mechanical change
 * instead of a hunt through the JSX.
 */
export const strings = {
  siteName: "Crochet by Nouhad",
  tagline: "Créations au crochet, faites main",

  nav: {
    shop: "La boutique",
    contact: "Contact",
    cart: "Panier",
    cartPage: "Panier",
  },

  hero: {
    eyebrow: "Fait main au crochet",
    title: "Des pièces uniques, crochées une à une",
    body: "Sacs, écharpes et accessoires réalisés à la main par Nouhad. Chaque pièce est unique, faite avec du temps et beaucoup de fil.",
    ctaShop: "Voir la collection",
    ctaWhatsapp: "Commander sur WhatsApp",
    note: "Paiement à la livraison · Livraison partout au Maroc",
  },

  shop: {
    title: "La collection",
    all: "Tout",
    empty: "Aucune pièce pour le moment. Revenez bientôt !",
  },

  notFound: {
    title: "Cette page n'existe pas",
    body: "La pièce que vous cherchez n'est plus disponible ou le lien est incorrect.",
    home: "Retour à l'accueil",
  },

  cart: {
    title: "Votre panier",
    empty: "Votre panier est vide.",
    emptyHint: "Parcourez la collection pour ajouter vos premières pièces.",
    continueShopping: "Continuer mes achats",
    viewPage: "Voir le panier",
    total: "Total",
    checkoutHint: "Le paiement se fait à la livraison.",
    whatsapp: "Commander via WhatsApp",
  },

  product: {
    quantity: "Quantité",
    addToCart: "Ajouter au panier",
    orderWhatsapp: "Commander / poser une question",
    backToShop: "Retour à la boutique",
  },

  checkout: {
    title: "Commander",
    subtitle: "Paiement à la livraison, partout au Maroc.",
    summaryTitle: "Votre commande",
    itemsTitle: "Récapitulatif",
    totalLabel: "Total à payer à la livraison",
    paymentNote:
      "Vous ne payez rien maintenant. Nous nous arrangeons à la livraison.",
    name: "Nom complet",
    namePlaceholder: "Salma El Amrani",
    phone: "Téléphone",
    phonePlaceholder: "06 12 34 56 78",
    phoneHint: "Pour confirmer la commande avec vous.",
    city: "Ville",
    cityPlaceholder: "Casablanca",
    address: "Adresse de livraison",
    addressPlaceholder: "Quartier, rue, numéro, étage…",
    notes: "Message (facultatif)",
    notesPlaceholder: "Précisions sur la livraison, heure de passage…",
    submit: "Confirmer ma commande",
    submitting: "Envoi en cours…",
    empty: "Votre panier est vide.",
    emptyHint: "Ajoutez une pièce à la boutique avant de commander.",
    fixErrors: "Vérifiez les informations saisies.",
    unavailable:
      "Une pièce de votre panier n'est plus disponible. Merci de revoir votre panier.",
    submitError:
      "La commande n'a pas pu être enregistrée. Réessayez, ou commandez via WhatsApp.",
  },

  order: {
    confirmationPath: "/order/confirmation",
    title: "Merci pour votre commande !",
    body: "Nouhad va vous contacter pour confirmer les détails et le prix de la livraison.",
    reference: "Numéro de commande",
    keepShopping: "Retourner à la boutique",
    whatsapp: "Envoyer le récapitulatif sur WhatsApp",
  },

  footer: {
    blurb: "Créations artisanales au crochet, depuis le Maroc.",
    contactTitle: "Contact",
    infoTitle: "Informations",
    terms: "Conditions générales",
    privacy: "Politique de confidentialité",
    instagram: "Instagram",
    copyright: "Tous droits réservés.",
  },

  legal: {
    termsTitle: "Conditions générales de vente",
    privacyTitle: "Politique de confidentialité",
  },

  common: {
    loading: "Chargement…",
  },

  admin: {
    title: "Administration",
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
    productCategory: "Catégorie",
    productPrice: "Prix (MAD)",
    productPriceHint: "En dirhams, sans décimales : 250 pour 250,00 MAD.",
    productSlug: "Adresse web",
    productActive: "Visible dans la boutique",
    productActiveHint:
      "Décochez pour retirer la pièce de la boutique sans la supprimer.",
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
    whatsappCustomer: "Écrire sur WhatsApp",
    orderTotal: "Total",
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
