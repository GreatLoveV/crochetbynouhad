import type { Dictionary } from "./fr";

/**
 * Every Arabic string of the public shop. Same keys as `fr.ts`.
 *
 * Machine-assisted translation: every line is listed in
 * `docs/i18n/translations-review.md` and needs review by a native speaker
 * before launch.
 *
 * House rules for this file:
 * - The visitor is addressed in the plural of politeness (تصفّحوا، سلتكم),
 *   which reads as neutral for women and men alike.
 * - The brand stays in Latin letters: "Crochet by Nouhad".
 * - Digits are Western (0–9), as on the rest of the site.
 * - Quotes use « » like the French copy.
 */
const ar: Dictionary = {
  siteName: "Crochet by Nouhad",
  tagline: "إبداعات كروشيه مصنوعة يدويًا",

  meta: {
    description:
      "حقائب وأوشحة وإكسسوارات تصنعها نهاد بيديها. كل قطعة فريدة، صُنعت بكثير من الوقت والخيط.",
    notFoundTitle: "الصفحة غير موجودة",
  },

  nav: {
    label: "التنقل الرئيسي",
    shop: "المتجر",
    contact: "تواصل معنا",
    cart: "السلة",
    cartPage: "السلة",
    language: "اللغة",
  },

  hero: {
    eyebrow: "كروشيه مصنوع يدويًا",
    title: "قطع فريدة، تُحاك واحدةً تلو الأخرى",
    body: "حقائب وأوشحة وإكسسوارات تصنعها نهاد بيديها. كل قطعة فريدة، صُنعت بكثير من الوقت والخيط.",
    ctaShop: "عرض المجموعة",
    ctaWhatsapp: "الطلب عبر واتساب",
    note: "الدفع عند الاستلام · التوصيل إلى جميع أنحاء المغرب",
  },

  shop: {
    title: "المجموعة",
    filterLabel: "الفئات",
    all: "الكل",
    empty: "لا توجد قطع حاليًا. ترقّبوا الجديد قريبًا!",
    comingSoonBadge: "قريبًا",
    comingSoonTitle: "متوفرة قريبًا.",
    comingSoonBody: "تابعونا على إنستغرام ليصلكم الخبر أولًا.",
    comingSoonInstagram: "المتابعة على إنستغرام",
    comingSoonWhatsapp: "التنبيه عبر واتساب",
    comingSoonBack: "عرض القطع المتوفرة",
  },

  notFound: {
    title: "هذه الصفحة غير موجودة",
    body: "القطعة التي تبحثون عنها لم تعد متوفرة، أو أن الرابط غير صحيح.",
    home: "العودة إلى الصفحة الرئيسية",
  },

  cart: {
    title: "سلة المشتريات",
    empty: "السلة فارغة.",
    emptyHint: "تصفّحوا المجموعة لإضافة قطعكم الأولى.",
    continueShopping: "متابعة التسوق",
    viewPage: "عرض السلة",
    total: "المجموع",
    checkoutHint: "الدفع عند الاستلام.",
    remove: "إزالة {name} من السلة",
    pieces: {
      zero: "لا توجد قطع",
      one: "قطعة واحدة",
      two: "قطعتان",
      few: "{count} قطع",
      many: "{count} قطعة",
      other: "{count} قطعة",
    },
  },

  product: {
    breadcrumb: "مسار التنقل",
    addToCart: "إضافة إلى السلة",
    askWhatsapp: "سؤال؟ واتساب",
    backToShop: "العودة إلى المتجر",
    reference: "المرجع",
    unique: "قطعة فريدة",
    soldOut: "بيعت",
    soldOutHint: "وجدت هذه القطعة صاحبتها.",
    alreadyInCart: "موجودة في السلة",
    alreadyInCartToast: "{name} موجودة في سلتكم بالفعل",
    addedToast: "أُضيفت {name} إلى السلة",
    photoSoon: "الصورة قريبًا",
    viewPhoto: "عرض الصورة {n}",
  },

  checkout: {
    title: "إتمام الطلب",
    subtitle: "الدفع عند الاستلام، في جميع أنحاء المغرب.",
    summaryTitle: "طلبكم",
    itemsTitle: "ملخص الطلب",
    totalLabel: "المبلغ المستحق عند الاستلام",
    paymentNote: "تُؤكَّد مصاريف التوصيل عبر واتساب.",
    name: "الاسم الكامل",
    namePlaceholder: "سلمى العمراني",
    phone: "رقم الهاتف",
    phonePlaceholder: "06 12 34 56 78",
    phoneHint: "لنؤكد معكم الطلب.",
    city: "المدينة",
    cityPlaceholder: "الدار البيضاء",
    address: "عنوان التوصيل",
    addressPlaceholder: "الحي، الشارع، الرقم، الطابق…",
    notes: "رسالة (اختيارية)",
    notesPlaceholder: "تفاصيل حول التوصيل، وقت المرور…",
    submit: "تأكيد الطلب",
    submitting: "جارٍ الإرسال…",
    empty: "السلة فارغة.",
    emptyHint: "أضيفوا قطعة من المتجر قبل الطلب.",
    fixErrors: "يرجى التحقق من المعلومات المُدخلة.",
    unavailable: "إحدى القطع في سلتكم لم تعد متوفرة. يرجى مراجعة السلة.",
    reserved: "حُجزت هذه القطعة للتو.",
    submitError: "تعذّر تسجيل الطلب. أعيدوا المحاولة، أو اطلبوا عبر واتساب.",
    tooMany: "لقد قدّمتم عدة طلبات مؤخرًا. راسلونا على واتساب لإضافة طلب آخر.",
    errors: {
      cartEmpty: "السلة فارغة.",
      cartUnreadable: "تعذّرت قراءة السلة.",
      cartInvalid: "السلة غير صالحة.",
      nameShort: "يرجى إدخال الاسم.",
      nameLong: "الاسم طويل جدًا (80 حرفًا كحد أقصى).",
      phoneMissing: "يرجى إدخال رقم الهاتف.",
      phoneInvalid: "رقم الهاتف غير صالح (مثال: 06 12 34 56 78).",
      cityShort: "يرجى إدخال المدينة.",
      cityLong: "اسم المدينة طويل جدًا.",
      addressShort: "يرجى إدخال عنوان التوصيل.",
      addressLong: "العنوان طويل جدًا (300 حرف كحد أقصى).",
      notesLong: "الرسالة طويلة جدًا (500 حرف كحد أقصى).",
    },
  },

  order: {
    title: "تم استلام الطلب",
    body: "ستتواصل معكم نهاد عبر واتساب لتأكيد الطلب.",
    reference: "رقم الطلب",
    itemFallback: "قطعة",
    keepShopping: "العودة إلى المتجر",
    whatsapp: "للتسريع: إرسال طلبي عبر واتساب",
    whatsappOptional: "اختياري — ستتواصل معكم نهاد على أي حال.",
    notFound: "هذا الطلب غير موجود.",
  },

  orderStatus: {
    new: "مستلَم",
    confirmed: "مؤكَّد",
    shipped: "تم الشحن",
    delivered: "تم التسليم",
    cancelled: "ملغى",
  },

  whatsapp: {
    info: "مرحبًا {shop}، أودّ الحصول على معلومات حول إبداعاتكم.",
    question: "مرحبًا {shop}، لديّ سؤال.",
    discover: "مرحبًا {shop}، اكتشفت مجموعتكم وأودّ الحصول على معلومات.",
    comingSoon: "مرحبًا {shop}، أودّ أن يصلني إشعار عندما تتوفر «{category}».",
    product: "مرحبًا {shop}، لديّ سؤال عن «{name}»{reference}:",
    orderIntro: "مرحبًا، هذا طلبي {reference}:",
    orderTotal: "المجموع: {total} (الدفع عند الاستلام)",
    orderCustomer: "الاسم: {name}، المدينة: {city}",
    orderRecapTotal: "المجموع: {total}",
  },

  footer: {
    blurb: "إبداعات كروشيه حرفية، من المغرب.",
    contactTitle: "تواصل",
    infoTitle: "معلومات",
    terms: "الشروط العامة",
    privacy: "سياسة الخصوصية",
    instagram: "إنستغرام",
    copyright: "جميع الحقوق محفوظة.",
  },

  legal: {
    placeholder: "نص مؤقت — يُستكمل قبل النشر.",
    toComplete: "نص يُستكمل لاحقًا.",
    terms: {
      title: "الشروط العامة للبيع",
      description:
        "الشروط العامة للبيع لدى Crochet by Nouhad — إبداعات كروشيه حرفية، والدفع عند الاستلام.",
      sections: [
        {
          title: "المنتجات",
          body: "كل قطعة مصنوعة يدويًا. الاختلافات الطفيفة في اللون والشكل جزء من طابعها الحرفي.",
        },
        {
          title: "الأسعار والدفع",
          body: "الأسعار معروضة بالدرهم المغربي (MAD). يتم الدفع عند الاستلام، لدى عامل التوصيل.",
        },
        {
          title: "التوصيل",
          body: "تُبلَّغ مدة التوصيل ومصاريفه عند تأكيد الطلب.",
        },
        { title: "الإلغاء والإرجاع", body: null },
        {
          title: "التواصل",
          body: "لأي سؤال، راسلونا على واتساب أو إنستغرام عبر الروابط أسفل الصفحة.",
        },
      ],
    },
    privacy: {
      title: "سياسة الخصوصية",
      description:
        "سياسة الخصوصية لدى Crochet by Nouhad — ما البيانات التي تُجمع عند الطلب وكيف تُستخدم.",
      sections: [
        {
          title: "البيانات المجمَّعة",
          body: "عند الطلب، نسجّل اسمكم ورقم هاتفكم ومدينتكم وعنوان التوصيل. تُستخدم هذه المعلومات فقط لمعالجة طلبكم وتوصيله.",
        },
        {
          title: "الدفع",
          body: "لا يُسجَّل أي دفع عبر الإنترنت: يتم الدفع نقدًا عند الاستلام، لذلك لا نطلب أي بيانات بنكية.",
        },
        { title: "مدة الحفظ", body: null },
        {
          title: "حقوقكم",
          body: "يمكنكم طلب الاطلاع على بياناتكم أو تصحيحها أو حذفها بمراسلتنا عبر روابط التواصل أسفل الصفحة.",
        },
      ],
    },
  },

  og: {
    eyebrow: "صُنع يدويًا",
  },

  common: {
    loading: "جارٍ التحميل…",
    close: "إغلاق",
  },
};

export default ar;
