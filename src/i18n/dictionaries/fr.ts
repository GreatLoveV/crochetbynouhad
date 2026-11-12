/**
 * Every French string of the public shop.
 *
 * `ar.ts` must have exactly the same keys: its type is derived from this file,
 * so a missing or misspelled key is a type error, not a blank on the page.
 *
 * Placeholders in braces (`{shop}`, `{name}`) are filled with `fill()` from
 * `@/i18n/config`. Plural strings are objects keyed by `Intl.PluralRules`
 * categories and read with `plural()` from `@/i18n/format`.
 *
 * The admin is not translated (it is for Nouhad only); its strings stay in
 * `@/lib/constants/strings`.
 */
const fr = {
  siteName: "Crochet by Nouhad",
  tagline: "Créations au crochet, faites main",

  meta: {
    description:
      "Sacs, écharpes et accessoires réalisés à la main par Nouhad. Chaque pièce est unique, faite avec du temps et beaucoup de fil.",
    notFoundTitle: "Page introuvable",
  },

  nav: {
    label: "Navigation principale",
    shop: "La boutique",
    atelier: "L’atelier",
    contact: "Contact",
    cart: "Panier",
    cartPage: "Panier",
    language: "Langue",
    menu: "Menu",
  },

  hero: {
    eyebrow: "Fait main au crochet",
    title: "Des pièces uniques, crochées une à une",
    body: "Sacs, écharpes et accessoires réalisés à la main par Nouhad. Chaque pièce est unique, faite avec du temps et beaucoup de fil.",
    ctaShop: "Voir la collection",
    ctaWhatsapp: "Commander sur WhatsApp",
    note: "Paiement à la livraison, partout au Maroc.",
  },

  home: {
    atelierTitle: "L’atelier",
    atelierBody:
      "Chaque pièce est crochetée à la main par Nouhad, chez elle, au Maroc. Aucune n’existe en double : quand une pièce est vendue, elle reste ici, marquée « Vendu », pour montrer ce que ses mains savent faire.",
    atelierQuestion: "Une question sur une pièce ?",
    atelierCta: "Écrire à Nouhad",
    viewPiece: "Voir la pièce",
    stepsTitle: "Comment commander",
    steps: [
      "Choisissez une pièce et confirmez votre commande ici, en quelques champs.",
      "Nouhad vous écrit sur WhatsApp pour confirmer la livraison et ses frais.",
      "Vous payez en espèces à la livraison, partout au Maroc.",
    ],
  },

  shop: {
    title: "La collection",
    filterLabel: "Catégories",
    all: "Tout",
    empty: "Aucune pièce pour le moment. Revenez bientôt !",
    comingSoonBadge: "Bientôt",
    comingSoonTitle: "Bientôt disponible.",
    comingSoonBody: "Suivez-nous sur Instagram pour être prévenu.",
    comingSoonInstagram: "Suivre sur Instagram",
    comingSoonWhatsapp: "Être prévenu sur WhatsApp",
    comingSoonBack: "Voir les pièces disponibles",
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
    remove: "Retirer {name} du panier",
    pieces: { one: "{count} pièce", other: "{count} pièces" } as Plural,
  },

  product: {
    breadcrumb: "Fil d'Ariane",
    addToCart: "Ajouter au panier",
    askWhatsapp: "Une question ? WhatsApp",
    backToShop: "Retour à la boutique",
    reference: "Référence",
    unique: "Pièce unique",
    soldOut: "Vendu",
    soldOutHint: "Cette pièce a déjà trouvé sa propriétaire.",
    alreadyInCart: "Déjà dans votre panier",
    alreadyInCartToast: "{name} est déjà dans votre panier",
    addedToast: "{name} ajouté au panier",
    photoSoon: "Photo à venir",
    viewPhoto: "Voir la photo {n}",
    yarnColours: "Couleurs de laine",
  },
  /** Dye names of the palette, also used for the yarn of each piece. */
  colours: {
    rose: "Rose",
    laine: "Laine",
    barqouq: "Barqouq",
    fouwwa: "Fouwwa",
    naanaa: "Naanaa",
    kurkum: "Kurkum",
  },

  checkout: {
    title: "Commander",
    subtitle: "Paiement à la livraison, partout au Maroc.",
    summaryTitle: "Votre commande",
    itemsTitle: "Récapitulatif",
    totalLabel: "Total à payer à la livraison",
    paymentNote: "Frais de livraison confirmés par WhatsApp.",
    /** `{link}` becomes a link to the page named by the matching `…Link`. */
    legalTerms: "En confirmant, vous acceptez les {link}.",
    legalTermsLink: "conditions générales",
    legalPrivacy: "Vos coordonnées servent à confirmer et livrer la commande ({link}).",
    legalPrivacyLink: "confidentialité",
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
    reserved: "Cette pièce vient d'être réservée.",
    submitError:
      "La commande n'a pas pu être enregistrée. Réessayez, ou commandez via WhatsApp.",
    tooMany:
      "Vous avez déjà passé plusieurs commandes récemment. Écrivez-nous sur WhatsApp pour en ajouter une autre.",
    /** Field errors, keyed by the codes in `@/lib/validation/checkout`. */
    errors: {
      cartEmpty: "Votre panier est vide.",
      cartUnreadable: "Panier illisible.",
      cartInvalid: "Panier invalide.",
      nameShort: "Indiquez votre nom.",
      nameLong: "Nom trop long (80 caractères maximum).",
      phoneMissing: "Indiquez votre numéro de téléphone.",
      phoneInvalid: "Numéro de téléphone invalide (ex. 06 12 34 56 78).",
      cityShort: "Indiquez votre ville.",
      cityLong: "Nom de ville trop long.",
      addressShort: "Indiquez votre adresse de livraison.",
      addressLong: "Adresse trop longue (300 caractères maximum).",
      notesLong: "Message trop long (500 caractères maximum).",
    },
  },

  order: {
    title: "Commande reçue",
    body: "Nouhad vous contactera sur WhatsApp pour confirmer votre commande.",
    reference: "Numéro de commande",
    itemFallback: "Pièce",
    keepShopping: "Retourner à la boutique",
    whatsapp: "Accélérer : envoyer ma commande sur WhatsApp",
    whatsappOptional: "Facultatif — Nouhad vous contactera de toute façon.",
    notFound: "Cette commande est introuvable.",
  },

  orderStatus: {
    new: "Reçue",
    confirmed: "Confirmée",
    shipped: "Expédiée",
    delivered: "Livrée",
    cancelled: "Annulée",
  },

  /** Prefilled WhatsApp messages. Sent to Nouhad in the visitor's language. */
  whatsapp: {
    info: "Bonjour {shop}, j'aimerais des informations sur vos créations.",
    question: "Bonjour {shop}, j'ai une question.",
    discover: "Bonjour {shop}, je découvre votre collection et j'aimerais des informations.",
    comingSoon: "Bonjour {shop}, je souhaite être prévenu quand « {category} » sera disponible.",
    product: "Bonjour {shop}, j'ai une question à propos de « {name} »{reference} :",
    orderIntro: "Bonjour, voici ma commande {reference} :",
    orderTotal: "Total : {total} (paiement à la livraison)",
    orderCustomer: "Nom : {name}, Ville : {city}",
    orderRecapTotal: "Total : {total}",
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
    placeholder: "Texte de remplacement — à compléter avant la mise en ligne.",
    toComplete: "Texte à compléter.",
    terms: {
      title: "Conditions générales de vente",
      description:
        "Conditions générales de vente de Crochet by Nouhad — créations artisanales au crochet, paiement à la livraison.",
      sections: [
        {
          title: "Produits",
          body: "Chaque pièce est confectionnée à la main. De légères variations de couleur et de forme font partie de l'aspect artisanal du produit.",
        },
        {
          title: "Prix et paiement",
          body: "Les prix sont indiqués en dirhams marocains (MAD). Le paiement se fait à la livraison, auprès du livreur.",
        },
        {
          title: "Livraison",
          body: "Les délais et frais de livraison sont communiqués lors de la confirmation de la commande.",
        },
        { title: "Annulation et retours", body: null },
        {
          title: "Contact",
          body: "Pour toute question, écrivez-nous sur WhatsApp ou Instagram via les liens en bas de page.",
        },
      ],
    },
    privacy: {
      title: "Politique de confidentialité",
      description:
        "Politique de confidentialité de Crochet by Nouhad — quelles données sont collectées lors d'une commande et comment elles sont utilisées.",
      sections: [
        {
          title: "Données collectées",
          body: "Lors d'une commande, nous enregistrons votre nom, votre numéro de téléphone, votre ville et votre adresse de livraison. Ces informations servent uniquement à traiter et livrer votre commande.",
        },
        {
          title: "Paiement",
          body: "Aucun paiement en ligne n'est enregistré : le règlement se fait en espèces à la livraison. Aucune donnée bancaire n'est donc demandée.",
        },
        { title: "Conservation", body: null },
        {
          title: "Vos droits",
          body: "Vous pouvez demander l'accès, la rectification ou la suppression de vos données en nous écrivant via les liens de contact en bas de page.",
        },
      ],
    },
  },

  og: {
    eyebrow: "Fait main",
  },

  common: {
    loading: "Chargement…",
    skipToContent: "Aller au contenu",
    close: "Fermer",
    retry: "Réessayer",
    loadErrorTitle: "La page ne s’est pas chargée",
    loadErrorBody: "Vérifiez votre connexion, puis réessayez. Vous pouvez aussi écrire à Nouhad sur WhatsApp.",
  },
};

/**
 * A string that changes with a number. French needs `one` and `other`; Arabic
 * also uses `zero`, `two`, `few` and `many`.
 */
export type Plural = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };

/** The shape every language must match: same keys, any text. */
export type Dictionary = Widen<typeof fr>;

type Widen<T> = T extends Plural
  ? Plural
  : T extends string
  ? string
  : T extends null
    ? null
    : T extends readonly (infer U)[]
      ? Widen<U>[]
      : { [K in keyof T]: Widen<T[K]> };

export default fr satisfies Dictionary;
