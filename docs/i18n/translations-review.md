# Arabic translations — needs review by a native speaker

**Status: every Arabic line below needs review by a native speaker before launch.**
The translations were machine-assisted. None of them has been checked by a person who
speaks Arabic natively, and none has been approved by Nouhad.

How to review: read the Arabic column against the French one. Correct the Arabic in the
file named under each table, then tick the line here. Keys in the first column are the
same as in the code, so `cart.remove` is `cart.remove` in
`src/i18n/dictionaries/ar.ts`.

## Decisions to confirm first

These choices affect many lines, so it's worth settling them before line-by-line review.

1. **How visitors are addressed.** I used the plural of politeness throughout
   (تصفّحوا، سلتكم، راسلونا), which reads as neutral for women and men. The alternative is
   the feminine singular (تصفّحي، سلتكِ), since most customers are women. This changes
   about 15 lines.
2. **"Vendu" / "بيعت".** The badge on a sold piece. It's feminine, agreeing with قطعة
   (piece). Other options are مُباعة or نفدت.
3. **`product.soldOutHint`.** "وجدت هذه القطعة صاحبتها" keeps the French idea that the
   piece found its (female) owner. Please check that it reads naturally and not as a
   literal translation.
4. **Currency.** Prices on Arabic pages are formatted by the browser as `280,00 د.م.`
   (Western digits, comma decimal, the د.م. symbol). Some shops write `280 درهم`. This
   isn't in the dictionary; it comes from `formatPrice` in `src/lib/format/money.ts`.
5. **Nouhad's name** is written نهاد inside Arabic sentences. The brand stays
   "Crochet by Nouhad" in Latin letters, as decided.
6. **Moroccan or standard Arabic.** Everything is in Modern Standard Arabic. A few
   words could be more Moroccan (for example خرجات in the mini bag description is
   already colloquial). Decide how much Darija is welcome.
7. **Invented placeholder copy.** The legal pages (`legal.*`) and the hero sentence
   (`hero.*`) were placeholder French to begin with. Their Arabic is a translation of a
   placeholder: the French must be finalised first, then translated again.

## Interface (`src/i18n/dictionaries/ar.ts`)

| ✓ | Key | Français | العربية |
|---|---|---|---|
| ☐ | `siteName` | Crochet by Nouhad | Crochet by Nouhad |
| ☐ | `tagline` | Créations au crochet, faites main | إبداعات كروشيه مصنوعة يدويًا |
| ☐ | `meta.description` | Sacs, écharpes et accessoires réalisés à la main par Nouhad. Chaque pièce est unique, faite avec du temps et beaucoup de fil. | حقائب وأوشحة وإكسسوارات تصنعها نهاد بيديها. كل قطعة فريدة، صُنعت بكثير من الوقت والخيط. |
| ☐ | `meta.notFoundTitle` | Page introuvable | الصفحة غير موجودة |
| ☐ | `nav.label` | Navigation principale | التنقل الرئيسي |
| ☐ | `nav.shop` | La boutique | المتجر |
| ☐ | `nav.contact` | Contact | تواصل معنا |
| ☐ | `nav.cart` | Panier | السلة |
| ☐ | `nav.cartPage` | Panier | السلة |
| ☐ | `nav.language` | Langue | اللغة |
| ☐ | `hero.eyebrow` | Fait main au crochet | كروشيه مصنوع يدويًا |
| ☐ | `hero.title` | Des pièces uniques, crochées une à une | قطع فريدة، تُحاك واحدةً تلو الأخرى |
| ☐ | `hero.body` | Sacs, écharpes et accessoires réalisés à la main par Nouhad. Chaque pièce est unique, faite avec du temps et beaucoup de fil. | حقائب وأوشحة وإكسسوارات تصنعها نهاد بيديها. كل قطعة فريدة، صُنعت بكثير من الوقت والخيط. |
| ☐ | `hero.ctaShop` | Voir la collection | عرض المجموعة |
| ☐ | `hero.ctaWhatsapp` | Commander sur WhatsApp | الطلب عبر واتساب |
| ☐ | `hero.note` | Paiement à la livraison · Livraison partout au Maroc | الدفع عند الاستلام · التوصيل إلى جميع أنحاء المغرب |
| ☐ | `shop.title` | La collection | المجموعة |
| ☐ | `shop.filterLabel` | Catégories | الفئات |
| ☐ | `shop.all` | Tout | الكل |
| ☐ | `shop.empty` | Aucune pièce pour le moment. Revenez bientôt ! | لا توجد قطع حاليًا. ترقّبوا الجديد قريبًا! |
| ☐ | `shop.comingSoonBadge` | Bientôt | قريبًا |
| ☐ | `shop.comingSoonTitle` | Bientôt disponible. | متوفرة قريبًا. |
| ☐ | `shop.comingSoonBody` | Suivez-nous sur Instagram pour être prévenu. | تابعونا على إنستغرام ليصلكم الخبر أولًا. |
| ☐ | `shop.comingSoonInstagram` | Suivre sur Instagram | المتابعة على إنستغرام |
| ☐ | `shop.comingSoonWhatsapp` | Être prévenu sur WhatsApp | التنبيه عبر واتساب |
| ☐ | `shop.comingSoonBack` | Voir les pièces disponibles | عرض القطع المتوفرة |
| ☐ | `notFound.title` | Cette page n'existe pas | هذه الصفحة غير موجودة |
| ☐ | `notFound.body` | La pièce que vous cherchez n'est plus disponible ou le lien est incorrect. | القطعة التي تبحثون عنها لم تعد متوفرة، أو أن الرابط غير صحيح. |
| ☐ | `notFound.home` | Retour à l'accueil | العودة إلى الصفحة الرئيسية |
| ☐ | `cart.title` | Votre panier | سلة المشتريات |
| ☐ | `cart.empty` | Votre panier est vide. | السلة فارغة. |
| ☐ | `cart.emptyHint` | Parcourez la collection pour ajouter vos premières pièces. | تصفّحوا المجموعة لإضافة قطعكم الأولى. |
| ☐ | `cart.continueShopping` | Continuer mes achats | متابعة التسوق |
| ☐ | `cart.viewPage` | Voir le panier | عرض السلة |
| ☐ | `cart.total` | Total | المجموع |
| ☐ | `cart.checkoutHint` | Le paiement se fait à la livraison. | الدفع عند الاستلام. |
| ☐ | `cart.remove` | Retirer {name} du panier | إزالة {name} من السلة |
| ☐ | `cart.pieces.one` | {count} pièce | قطعة واحدة |
| ☐ | `cart.pieces.other` | {count} pièces | {count} قطعة |
| ☐ | `cart.pieces.zero` | (à compléter) | لا توجد قطع |
| ☐ | `cart.pieces.two` | (à compléter) | قطعتان |
| ☐ | `cart.pieces.few` | (à compléter) | {count} قطع |
| ☐ | `cart.pieces.many` | (à compléter) | {count} قطعة |
| ☐ | `product.breadcrumb` | Fil d'Ariane | مسار التنقل |
| ☐ | `product.addToCart` | Ajouter au panier | إضافة إلى السلة |
| ☐ | `product.askWhatsapp` | Une question ? WhatsApp | سؤال؟ واتساب |
| ☐ | `product.backToShop` | Retour à la boutique | العودة إلى المتجر |
| ☐ | `product.reference` | Référence | المرجع |
| ☐ | `product.unique` | Pièce unique | قطعة فريدة |
| ☐ | `product.soldOut` | Vendu | بيعت |
| ☐ | `product.soldOutHint` | Cette pièce a déjà trouvé sa propriétaire. | وجدت هذه القطعة صاحبتها. |
| ☐ | `product.alreadyInCart` | Déjà dans votre panier | موجودة في السلة |
| ☐ | `product.alreadyInCartToast` | {name} est déjà dans votre panier | {name} موجودة في سلتكم بالفعل |
| ☐ | `product.addedToast` | {name} ajouté au panier | أُضيفت {name} إلى السلة |
| ☐ | `product.photoSoon` | Photo à venir | الصورة قريبًا |
| ☐ | `product.viewPhoto` | Voir la photo {n} | عرض الصورة {n} |
| ☐ | `checkout.title` | Commander | إتمام الطلب |
| ☐ | `checkout.subtitle` | Paiement à la livraison, partout au Maroc. | الدفع عند الاستلام، في جميع أنحاء المغرب. |
| ☐ | `checkout.summaryTitle` | Votre commande | طلبكم |
| ☐ | `checkout.itemsTitle` | Récapitulatif | ملخص الطلب |
| ☐ | `checkout.totalLabel` | Total à payer à la livraison | المبلغ المستحق عند الاستلام |
| ☐ | `checkout.paymentNote` | Frais de livraison confirmés par WhatsApp. | تُؤكَّد مصاريف التوصيل عبر واتساب. |
| ☐ | `checkout.name` | Nom complet | الاسم الكامل |
| ☐ | `checkout.namePlaceholder` | Salma El Amrani | سلمى العمراني |
| ☐ | `checkout.phone` | Téléphone | رقم الهاتف |
| ☐ | `checkout.phonePlaceholder` | 06 12 34 56 78 | 06 12 34 56 78 |
| ☐ | `checkout.phoneHint` | Pour confirmer la commande avec vous. | لنؤكد معكم الطلب. |
| ☐ | `checkout.city` | Ville | المدينة |
| ☐ | `checkout.cityPlaceholder` | Casablanca | الدار البيضاء |
| ☐ | `checkout.address` | Adresse de livraison | عنوان التوصيل |
| ☐ | `checkout.addressPlaceholder` | Quartier, rue, numéro, étage… | الحي، الشارع، الرقم، الطابق… |
| ☐ | `checkout.notes` | Message (facultatif) | رسالة (اختيارية) |
| ☐ | `checkout.notesPlaceholder` | Précisions sur la livraison, heure de passage… | تفاصيل حول التوصيل، وقت المرور… |
| ☐ | `checkout.submit` | Confirmer ma commande | تأكيد الطلب |
| ☐ | `checkout.submitting` | Envoi en cours… | جارٍ الإرسال… |
| ☐ | `checkout.empty` | Votre panier est vide. | السلة فارغة. |
| ☐ | `checkout.emptyHint` | Ajoutez une pièce à la boutique avant de commander. | أضيفوا قطعة من المتجر قبل الطلب. |
| ☐ | `checkout.fixErrors` | Vérifiez les informations saisies. | يرجى التحقق من المعلومات المُدخلة. |
| ☐ | `checkout.unavailable` | Une pièce de votre panier n'est plus disponible. Merci de revoir votre panier. | إحدى القطع في سلتكم لم تعد متوفرة. يرجى مراجعة السلة. |
| ☐ | `checkout.reserved` | Cette pièce vient d'être réservée. | حُجزت هذه القطعة للتو. |
| ☐ | `checkout.submitError` | La commande n'a pas pu être enregistrée. Réessayez, ou commandez via WhatsApp. | تعذّر تسجيل الطلب. أعيدوا المحاولة، أو اطلبوا عبر واتساب. |
| ☐ | `checkout.tooMany` | Vous avez déjà passé plusieurs commandes récemment. Écrivez-nous sur WhatsApp pour en ajouter une autre. | لقد قدّمتم عدة طلبات مؤخرًا. راسلونا على واتساب لإضافة طلب آخر. |
| ☐ | `checkout.errors.cartEmpty` | Votre panier est vide. | السلة فارغة. |
| ☐ | `checkout.errors.cartUnreadable` | Panier illisible. | تعذّرت قراءة السلة. |
| ☐ | `checkout.errors.cartInvalid` | Panier invalide. | السلة غير صالحة. |
| ☐ | `checkout.errors.nameShort` | Indiquez votre nom. | يرجى إدخال الاسم. |
| ☐ | `checkout.errors.nameLong` | Nom trop long (80 caractères maximum). | الاسم طويل جدًا (80 حرفًا كحد أقصى). |
| ☐ | `checkout.errors.phoneMissing` | Indiquez votre numéro de téléphone. | يرجى إدخال رقم الهاتف. |
| ☐ | `checkout.errors.phoneInvalid` | Numéro de téléphone invalide (ex. 06 12 34 56 78). | رقم الهاتف غير صالح (مثال: 06 12 34 56 78). |
| ☐ | `checkout.errors.cityShort` | Indiquez votre ville. | يرجى إدخال المدينة. |
| ☐ | `checkout.errors.cityLong` | Nom de ville trop long. | اسم المدينة طويل جدًا. |
| ☐ | `checkout.errors.addressShort` | Indiquez votre adresse de livraison. | يرجى إدخال عنوان التوصيل. |
| ☐ | `checkout.errors.addressLong` | Adresse trop longue (300 caractères maximum). | العنوان طويل جدًا (300 حرف كحد أقصى). |
| ☐ | `checkout.errors.notesLong` | Message trop long (500 caractères maximum). | الرسالة طويلة جدًا (500 حرف كحد أقصى). |
| ☐ | `order.title` | Commande reçue | تم استلام الطلب |
| ☐ | `order.body` | Nouhad vous contactera sur WhatsApp pour confirmer votre commande. | ستتواصل معكم نهاد عبر واتساب لتأكيد الطلب. |
| ☐ | `order.reference` | Numéro de commande | رقم الطلب |
| ☐ | `order.itemFallback` | Pièce | قطعة |
| ☐ | `order.keepShopping` | Retourner à la boutique | العودة إلى المتجر |
| ☐ | `order.whatsapp` | Accélérer : envoyer ma commande sur WhatsApp | للتسريع: إرسال طلبي عبر واتساب |
| ☐ | `order.whatsappOptional` | Facultatif — Nouhad vous contactera de toute façon. | اختياري — ستتواصل معكم نهاد على أي حال. |
| ☐ | `order.notFound` | Cette commande est introuvable. | هذا الطلب غير موجود. |
| ☐ | `orderStatus.new` | Reçue | مستلَم |
| ☐ | `orderStatus.confirmed` | Confirmée | مؤكَّد |
| ☐ | `orderStatus.shipped` | Expédiée | تم الشحن |
| ☐ | `orderStatus.delivered` | Livrée | تم التسليم |
| ☐ | `orderStatus.cancelled` | Annulée | ملغى |
| ☐ | `whatsapp.info` | Bonjour {shop}, j'aimerais des informations sur vos créations. | مرحبًا {shop}، أودّ الحصول على معلومات حول إبداعاتكم. |
| ☐ | `whatsapp.question` | Bonjour {shop}, j'ai une question. | مرحبًا {shop}، لديّ سؤال. |
| ☐ | `whatsapp.discover` | Bonjour {shop}, je découvre votre collection et j'aimerais des informations. | مرحبًا {shop}، اكتشفت مجموعتكم وأودّ الحصول على معلومات. |
| ☐ | `whatsapp.comingSoon` | Bonjour {shop}, je souhaite être prévenu quand « {category} » sera disponible. | مرحبًا {shop}، أودّ أن يصلني إشعار عندما تتوفر «{category}». |
| ☐ | `whatsapp.product` | Bonjour {shop}, j'ai une question à propos de « {name} »{reference} : | مرحبًا {shop}، لديّ سؤال عن «{name}»{reference}: |
| ☐ | `whatsapp.orderIntro` | Bonjour, voici ma commande {reference} : | مرحبًا، هذا طلبي {reference}: |
| ☐ | `whatsapp.orderTotal` | Total : {total} (paiement à la livraison) | المجموع: {total} (الدفع عند الاستلام) |
| ☐ | `whatsapp.orderCustomer` | Nom : {name}, Ville : {city} | الاسم: {name}، المدينة: {city} |
| ☐ | `whatsapp.orderRecapTotal` | Total : {total} | المجموع: {total} |
| ☐ | `footer.blurb` | Créations artisanales au crochet, depuis le Maroc. | إبداعات كروشيه حرفية، من المغرب. |
| ☐ | `footer.contactTitle` | Contact | تواصل |
| ☐ | `footer.infoTitle` | Informations | معلومات |
| ☐ | `footer.terms` | Conditions générales | الشروط العامة |
| ☐ | `footer.privacy` | Politique de confidentialité | سياسة الخصوصية |
| ☐ | `footer.instagram` | Instagram | إنستغرام |
| ☐ | `footer.copyright` | Tous droits réservés. | جميع الحقوق محفوظة. |
| ☐ | `legal.placeholder` | Texte de remplacement — à compléter avant la mise en ligne. | نص مؤقت — يُستكمل قبل النشر. |
| ☐ | `legal.toComplete` ⚠️ | Texte à compléter. | نص يُستكمل لاحقًا. |
| ☐ | `legal.terms.title` ⚠️ | Conditions générales de vente | الشروط العامة للبيع |
| ☐ | `legal.terms.description` ⚠️ | Conditions générales de vente de Crochet by Nouhad — créations artisanales au crochet, paiement à la livraison. | الشروط العامة للبيع لدى Crochet by Nouhad — إبداعات كروشيه حرفية، والدفع عند الاستلام. |
| ☐ | `legal.terms.sections.0.title` ⚠️ | Produits | المنتجات |
| ☐ | `legal.terms.sections.0.body` ⚠️ | Chaque pièce est confectionnée à la main. De légères variations de couleur et de forme font partie de l'aspect artisanal du produit. | كل قطعة مصنوعة يدويًا. الاختلافات الطفيفة في اللون والشكل جزء من طابعها الحرفي. |
| ☐ | `legal.terms.sections.1.title` ⚠️ | Prix et paiement | الأسعار والدفع |
| ☐ | `legal.terms.sections.1.body` ⚠️ | Les prix sont indiqués en dirhams marocains (MAD). Le paiement se fait à la livraison, auprès du livreur. | الأسعار معروضة بالدرهم المغربي (MAD). يتم الدفع عند الاستلام، لدى عامل التوصيل. |
| ☐ | `legal.terms.sections.2.title` ⚠️ | Livraison | التوصيل |
| ☐ | `legal.terms.sections.2.body` ⚠️ | Les délais et frais de livraison sont communiqués lors de la confirmation de la commande. | تُبلَّغ مدة التوصيل ومصاريفه عند تأكيد الطلب. |
| ☐ | `legal.terms.sections.3.title` ⚠️ | Annulation et retours | الإلغاء والإرجاع |
| ☐ | `legal.terms.sections.3.body` ⚠️ | (à compléter) | (يُستكمل) |
| ☐ | `legal.terms.sections.4.title` ⚠️ | Contact | التواصل |
| ☐ | `legal.terms.sections.4.body` ⚠️ | Pour toute question, écrivez-nous sur WhatsApp ou Instagram via les liens en bas de page. | لأي سؤال، راسلونا على واتساب أو إنستغرام عبر الروابط أسفل الصفحة. |
| ☐ | `legal.privacy.title` ⚠️ | Politique de confidentialité | سياسة الخصوصية |
| ☐ | `legal.privacy.description` ⚠️ | Politique de confidentialité de Crochet by Nouhad — quelles données sont collectées lors d'une commande et comment elles sont utilisées. | سياسة الخصوصية لدى Crochet by Nouhad — ما البيانات التي تُجمع عند الطلب وكيف تُستخدم. |
| ☐ | `legal.privacy.sections.0.title` ⚠️ | Données collectées | البيانات المجمَّعة |
| ☐ | `legal.privacy.sections.0.body` ⚠️ | Lors d'une commande, nous enregistrons votre nom, votre numéro de téléphone, votre ville et votre adresse de livraison. Ces informations servent uniquement à traiter et livrer votre commande. | عند الطلب، نسجّل اسمكم ورقم هاتفكم ومدينتكم وعنوان التوصيل. تُستخدم هذه المعلومات فقط لمعالجة طلبكم وتوصيله. |
| ☐ | `legal.privacy.sections.1.title` ⚠️ | Paiement | الدفع |
| ☐ | `legal.privacy.sections.1.body` ⚠️ | Aucun paiement en ligne n'est enregistré : le règlement se fait en espèces à la livraison. Aucune donnée bancaire n'est donc demandée. | لا يُسجَّل أي دفع عبر الإنترنت: يتم الدفع نقدًا عند الاستلام، لذلك لا نطلب أي بيانات بنكية. |
| ☐ | `legal.privacy.sections.2.title` ⚠️ | Conservation | مدة الحفظ |
| ☐ | `legal.privacy.sections.2.body` ⚠️ | (à compléter) | (يُستكمل) |
| ☐ | `legal.privacy.sections.3.title` ⚠️ | Vos droits | حقوقكم |
| ☐ | `legal.privacy.sections.3.body` ⚠️ | Vous pouvez demander l'accès, la rectification ou la suppression de vos données en nous écrivant via les liens de contact en bas de page. | يمكنكم طلب الاطلاع على بياناتكم أو تصحيحها أو حذفها بمراسلتنا عبر روابط التواصل أسفل الصفحة. |
| ☐ | `og.eyebrow` | Fait main | صُنع يدويًا |
| ☐ | `common.loading` | Chargement… | جارٍ التحميل… |
| ☐ | `common.close` | Fermer | إغلاق |

⚠️ = translated from French placeholder text that has to be rewritten anyway (see decision 7).

## Sample catalogue (`src/db/seed-arabic.ts`)

These are the sample pieces in the development database, not real ones. Real pieces get
their Arabic name and description in the admin (**Pièces → Modifier → Nom (arabe)**).
Category names are edited under **Catégories → Nom en arabe**.

| ✓ | Item | Arabic |
|---|---|---|
| ☐ | category `sacs` | حقائب |
| ☐ | category `echarpes` | أوشحة |
| ☐ | category `accessoires` | إكسسوارات |
| ☐ | `sac-fleur-rose` name | حقيبة الوردة |
| ☐ | `sac-fleur-rose` description | حقيبة يد كروشيه مصنوعة يدويًا، بنقشة وردة، مع بطانة داخلية. |
| ☐ | `mini-sac-bandouliere` name | حقيبة كتف صغيرة |
| ☐ | `mini-sac-bandouliere` description | حقيبة كتف صغيرة من الكروشيه، مثالية للخرجات. |
| ☐ | `pochette-perlee` name | محفظة يد بالخرز |
| ☐ | `pochette-perlee` description | محفظة يد من الكروشيه مزيّنة بالخرز، تُغلق بسحّاب. |
| ☐ | `echarpe-hiver` name | وشاح الشتاء |
| ☐ | `echarpe-hiver` description | وشاح دافئ من الصوف، محاك يدويًا بالكروشيه. |
| ☐ | `sac-plage-raphia` name | حقيبة شاطئ من الرافيا |
| ☐ | `sac-plage-raphia` description | حقيبة شاطئ كبيرة من الرافيا المحاكة بالكروشيه، واسعة وخفيفة. |
| ☐ | `beret-laine` name | بيريه من الصوف |
| ☐ | `beret-laine` description | بيريه ناعم من الصوف، متوفر بعدة ألوان. |

## Other Arabic text in the code

| ✓ | Where | Arabic |
|---|---|---|
| ☐ | `src/components/checkout/checkout-form.tsx` — city suggestions | الدار البيضاء، الرباط، سلا، مراكش، طنجة، فاس، أكادير، مكناس، وجدة، القنيطرة، تطوان |
| ☐ | `src/app/global-not-found.tsx` — last-resort 404 | هذه الصفحة غير موجودة · الصفحة الرئيسية |
| ☐ | `src/i18n/config.ts` — language switcher label | العربية |
| ☐ | `src/lib/constants/strings.ts` — admin placeholder for the Arabic name | حقيبة الوردة |

## Added in phases 5 and 6

New interface strings, same rules as above. The French is first-draft copy too: the
atelier lines only restate facts already on the site, and the steps describe the real
ordering flow (form, WhatsApp confirmation, cash on delivery).

| ✓ | Key | French | Arabic |
|---|---|---|---|
| ☐ | `nav.atelier` | L’atelier | الورشة |
| ☐ | `hero.note` (reworded, no more "·") | Paiement à la livraison, partout au Maroc. | الدفع عند الاستلام، في جميع أنحاء المغرب. |
| ☐ | `home.atelierTitle` | L’atelier | الورشة |
| ☐ | `home.atelierBody` | Chaque pièce est crochetée à la main par Nouhad, chez elle, au Maroc. Aucune n’existe en double : quand une pièce est vendue, elle reste ici, marquée « Vendu », pour montrer ce que ses mains savent faire. | تحيك نهاد كل قطعة بيديها، في بيتها بالمغرب. لا توجد قطعتان متشابهتان: عندما تُباع قطعة تبقى هنا، مع إشارة «بيعت»، لتُظهر ما تصنعه يداها. |
| ☐ | `home.atelierQuestion` | Une question sur une pièce ? | سؤال عن قطعة؟ |
| ☐ | `home.atelierCta` | Écrire à Nouhad | مراسلة نهاد |
| ☐ | `home.stepsTitle` | Comment commander | كيف تطلبون |
| ☐ | `home.steps[0]` | Choisissez une pièce et confirmez votre commande ici, en quelques champs. | اختاروا قطعة وأكّدوا طلبكم هنا، في بضعة حقول. |
| ☐ | `home.steps[1]` | Nouhad vous écrit sur WhatsApp pour confirmer la livraison et ses frais. | تراسلكم نهاد على واتساب لتأكيد التوصيل ومصاريفه. |
| ☐ | `home.steps[2]` | Vous payez en espèces à la livraison, partout au Maroc. | تدفعون نقدًا عند الاستلام، في جميع أنحاء المغرب. |
| ☐ | `common.retry` | Réessayer | إعادة المحاولة |
| ☐ | `common.loadErrorTitle` | La page ne s’est pas chargée | لم تُحمَّل الصفحة |
| ☐ | `common.loadErrorBody` | Vérifiez votre connexion, puis réessayez. Vous pouvez aussi écrire à Nouhad sur WhatsApp. | تحقّقوا من الاتصال، ثم أعيدوا المحاولة. يمكنكم أيضًا مراسلة نهاد على واتساب. |

## Added in round 2 (the « Fouwwa » redesign)

Same rules as above. Each French line is checked against the Arabic.

| ✓ | Key | French | Arabic |
|---|---|---|---|
| ☐ | `nav.menu` (phone menu button and title) | Menu | القائمة |
| ☐ | `home.viewPiece` (button on each piece) | Voir la pièce | شاهدوا القطعة |
| ☐ | `product.yarnColours` (label for a piece's yarn colours, not shown yet) | Couleurs de laine | ألوان الصوف |
| ☐ | `colours.rose` | Rose | ورد |
| ☐ | `colours.laine` | Laine | صوف |
| ☐ | `colours.barqouq` (plum, replaced `colours.nila` after Phase 5) | Barqouq | برقوق |
| ☐ | `colours.fouwwa` (madder) | Fouwwa | فوّة |
| ☐ | `colours.naanaa` (mint) | Naanaa | نعناع |
| ☐ | `colours.kurkum` (turmeric) | Kurkum | كركم |
| ☐ | `localeShortName` in `src/i18n/config.ts` (language switch on phones) | FR | عربي |
| ☐ | `checkout.errors.phoneInvalid` (direction marks only: the example number is isolated so it reads `06 12 34 56 78`) | — | wording unchanged |

**Decisions for this round:**

1. **Arabic display face.** Headings, piece names and the brand's Arabic setting use
   **Aref Ruqaa**, an Eastern handwritten script. The everyday Moroccan hand is Maghribi,
   which has no good free webfont. If Ruqaa feels foreign for a Moroccan shop, the
   alternative is **Reem Kufi** (calmer and geometric). Please judge it on the live pages.
2. **French colour names.** The palette is named after wool dyes in Darija, written in
   Latin letters (Fouwwa, Naanaa, Kurkum, Barqouq). A French reader may prefer
   **Garance, Menthe, Curcuma and Prune**. The names will appear in the shop once each piece
   lists its yarn colours.
3. **"شاهدوا القطعة"** follows the plural of politeness, like the rest of the site (decision
   1 at the top of this file). In the feminine singular it would be "شاهدي القطعة".
