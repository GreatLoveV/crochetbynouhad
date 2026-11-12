import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { ReactNode } from "react"

import { BusyButtonDemo, ToastDemos } from "./demos"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ProductTile, ProductTileSkeleton } from "@/components/product/product-tile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Chain, ChainLoader } from "@/components/ui/chain"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Notice } from "@/components/ui/notice"
import { Photo } from "@/components/ui/photo"
import { Price } from "@/components/ui/price"
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/state"
import { Steps } from "@/components/ui/steps"
import { Textarea } from "@/components/ui/textarea"
import { YarnChips } from "@/components/ui/yarn-chips"
import { getActiveProducts, type ProductSummary } from "@/lib/data/products"
import { fill } from "@/i18n/config"
import { getDictionary, getLang } from "@/i18n/server"

/**
 * Dev-only style guide: every base component in every state, at /fr/styleguide
 * (LTR) and /ar/styleguide (RTL). Not linked, not in the sitemap, and a 404 in
 * production builds.
 *
 * Hover and focus can't be held still on a page, so each gets a "forced"
 * copy with the same classes the real state applies.
 */
export const metadata: Metadata = {
  title: "Style guide",
  robots: { index: false, follow: false },
}

/** Labels of the guide itself (not shop copy, so not in the dictionaries). */
const L = {
  fr: {
    title: "Système « Fouwwa »",
    intro: "Chaque composant de base, dans chaque état. La même page existe en arabe, de droite à gauche.",
    colours: "Couleurs",
    type: "Typographie",
    chain: "La chaînette",
    buttons: "Boutons",
    fields: "Champs",
    badges: "Étiquettes",
    notices: "Messages",
    photos: "Photos et pièces",
    states: "États vides, chargement, erreur",
    steps: "Étapes",
    toasts: "Notifications",
    states_: { rest: "Repos", hover: "Survol", focus: "Focus clavier", disabled: "Désactivé", loading: "En cours" },
    roles: {
      rose: "fond de page",
      laine: "fond des photos, cartes, champs",
      nila: "tout le texte, contour du focus",
      fil: "texte secondaire",
      fouwwa: "action principale, liens, prix, erreurs (toujours avec une icône)",
      naanaa: "bande de l’atelier, succès",
      kurkum: "fil de la chaînette, étiquette « pièce unique », jamais du texte sur Rose",
      trait: "contours de champs, jamais du texte",
    },
    onRose: "sur Rose",
    radii: "Arrondis",
    radiiItems: ["Champ 14 px", "Photo 24 px", "Carte 28 px", "Bouton : pilule"],
    yarn: "Couleurs de laine d’une pièce",
    tones: "La chaînette prend la couleur de la section qui suit",
    divider: "Séparateur",
    drawn: "Se dessine une fois (premier écran)",
    nav: "Navigation : la page en cours",
    loader: "Chargement",
    navItems: ["La boutique", "L’atelier", "Contact"],
    mixed: "Une phrase avec un prix : ce sac coûte",
    filled: "Rempli",
    withPhoto: "Avec photo",
    noPhoto: "Sans photo",
    loadingPhoto: "En chargement",
    sold: "Vendue",
    steps_: [
      "Choisissez une pièce. Elle est unique, elle est réservée pour vous.",
      "Nouhad vous écrit sur WhatsApp pour confirmer.",
      "Vous payez à la livraison, partout au Maroc.",
    ],
    placeholderNote: "Texte provisoire : les étapes définitives viendront avec la refonte des pages.",
  },
  ar: {
    title: "نظام «فوّة»",
    intro: "كل مكوّن أساسي في كل حالاته. الصفحة نفسها موجودة بالفرنسية، من اليسار إلى اليمين.",
    colours: "الألوان",
    type: "الخطوط",
    chain: "السلسلة",
    buttons: "الأزرار",
    fields: "الحقول",
    badges: "الوسوم",
    notices: "الرسائل",
    photos: "الصور والقطع",
    states: "الحالات: فارغ، تحميل، خطأ",
    steps: "الخطوات",
    toasts: "الإشعارات",
    states_: { rest: "عادي", hover: "تمرير المؤشر", focus: "تركيز لوحة المفاتيح", disabled: "معطّل", loading: "قيد التنفيذ" },
    roles: {
      rose: "خلفية الصفحة",
      laine: "خلفية الصور والبطاقات والحقول",
      nila: "كل النصوص، وإطار التركيز",
      fil: "نص ثانوي",
      fouwwa: "الإجراء الرئيسي والروابط والأسعار والأخطاء (دائمًا مع أيقونة)",
      naanaa: "شريط الورشة، والنجاح",
      kurkum: "خيط السلسلة، ووسم «قطعة فريدة»، وليس للنص على الوردي أبدًا",
      trait: "حدود الحقول، وليس للنص أبدًا",
    },
    onRose: "على Rose",
    radii: "الزوايا",
    radiiItems: ["حقل 14 px", "صورة 24 px", "بطاقة 28 px", "زر: حواف مستديرة بالكامل"],
    yarn: "ألوان صوف القطعة",
    tones: "تأخذ السلسلة لون القسم الذي يليها",
    divider: "فاصل",
    drawn: "يُرسم مرة واحدة (الشاشة الأولى)",
    nav: "التنقل: الصفحة الحالية",
    loader: "التحميل",
    navItems: ["المتجر", "الورشة", "تواصل"],
    mixed: "جملة فيها سعر: ثمن هذه الحقيبة",
    filled: "مملوء",
    withPhoto: "مع صورة",
    noPhoto: "بدون صورة",
    loadingPhoto: "قيد التحميل",
    sold: "بيعت",
    steps_: [
      "اختاروا قطعة. إنها فريدة، وتُحجز لكم.",
      "تراسلكم نهاد على واتساب للتأكيد.",
      "تدفعون عند الاستلام، في جميع أنحاء المغرب.",
    ],
    placeholderNote: "نص مؤقت: الخطوات النهائية تأتي مع إعادة تصميم الصفحات.",
  },
} as const

const PALETTE = [
  { key: "rose", name: "Rose", hex: "#FBEDEA", ratio: null, ink: "text-nila" },
  { key: "laine", name: "Laine", hex: "#FFFDF9", ratio: null, ink: "text-nila" },
  { key: "nila", name: "Nila", hex: "#1E2461", ratio: "12,4:1", ink: "text-laine" },
  { key: "fil", name: "Fil", hex: "#4D4F7A", ratio: "6,8:1", ink: "text-laine" },
  { key: "fouwwa", name: "Fouwwa", hex: "#9C1D3B", ratio: "6,9:1", ink: "text-laine" },
  { key: "naanaa", name: "Naanaa", hex: "#1C6347", ratio: "6,3:1", ink: "text-laine" },
  { key: "kurkum", name: "Kurkum", hex: "#E9A93A", ratio: "1,8:1", ink: "text-nila" },
  { key: "trait", name: "Trait", hex: "#6F6E96", ratio: "4,2:1", ink: "text-laine" },
] as const

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-8 border-t border-border pt-10">
      <h2 id={id} className="text-3xl">
        {title}
      </h2>
      {children}
    </section>
  )
}

function Specimen({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-2">
      <span className="text-xs text-fil">{label}</span>
      {children}
    </div>
  )
}

export default async function StyleguidePage() {
  if (process.env.NODE_ENV === "production") notFound()

  const lang = await getLang()
  const t = await getDictionary()
  const l = L[lang]

  const products = await getActiveProducts(lang)
  const sample: ProductSummary = products[0] ?? {
    id: 0,
    slug: "exemple",
    name: lang === "ar" ? "حقيبة الوردة" : "Sac Fleur Rose",
    nameLang: lang,
    price: 25000,
    imageUrl: null,
    categoryName: "",
    reference: null,
    isSoldOut: false,
  }
  const tiles: ProductSummary[] = [
    sample,
    { ...(products[1] ?? sample), imageUrl: null },
    { ...(products[2] ?? sample), isSoldOut: true },
  ]

  return (
    <div className="mx-auto flex max-w-page flex-col gap-16 px-4 py-12 sm:px-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-5xl">{l.title}</h1>
        <p className="max-w-prose text-lg text-fil">{l.intro}</p>
      </header>

      <Section id="colours" title={l.colours}>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {PALETTE.map((c) => (
            <li key={c.key} className="flex flex-col gap-2">
              <span
                className={`flex h-24 items-end rounded-xl p-2.5 text-xs ${c.ink} outline -outline-offset-1 outline-border`}
                style={{ background: c.hex }}
              >
                {c.ratio && (
                  <bdi>
                    {c.ratio}
                  </bdi>
                )}
              </span>
              <span className="text-sm font-medium" lang="fr">
                {c.name} <bdi className="font-normal text-fil">{c.hex}</bdi>
              </span>
              <span className="text-xs text-fil">{l.roles[c.key]}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-fil">
          {l.onRose}: Nila 12,4 · Fil 6,8 · Fouwwa 6,9 · Naanaa 6,3 · Trait 4,2 (UI) · Kurkum 1,8 (jamais du texte). Laine sur Fouwwa 7,8 · Nila sur Kurkum 6,9
        </p>
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-sans font-medium">{l.radii}</h3>
          <ul className="flex flex-wrap items-end gap-4">
            {[
              "h-12 w-32 rounded-md border border-input bg-laine",
              "h-24 w-20 rounded-photo bg-laine photo-stitches",
              "h-24 w-32 rounded-card bg-card ring-1 ring-foreground/10",
              "h-12 w-32 rounded-full bg-fouwwa",
            ].map((cls, i) => (
              <li key={cls} className="flex flex-col gap-2">
                <span className={cls} />
                <span className="text-xs text-fil">{l.radiiItems[i]}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section id="type" title={l.type}>
        <div className="flex flex-col gap-6">
          <Specimen label={lang === "ar" ? "5xl · Aref Ruqaa 700, 1.5" : "5xl · Fraunces 600, SOFT 100, WONK 1"}>
            <p className="font-heading text-5xl font-semibold">{t.hero.title}</p>
          </Specimen>
          <Specimen label={lang === "ar" ? "3xl · Aref Ruqaa 700" : "3xl · Fraunces 600"}>
            <p className="font-heading text-3xl font-semibold">{t.shop.title}</p>
          </Specimen>
          <Specimen label={lang === "ar" ? "xl · Aref Ruqaa 700" : "xl · Fraunces 500"}>
            <p className="font-heading text-xl font-medium">{tiles[0].name}</p>
          </Specimen>
          <Specimen label="lg · Readex Pro 350">
            <p className="max-w-prose text-lg">{t.hero.body}</p>
          </Specimen>
          <Specimen label="base · Readex Pro 350">
            <p className="max-w-prose">
              {t.legal.terms.sections[0].body} {l.mixed} <Price centimes={25000} lang={lang} />
              {lang === "ar" ? "، " : ", "}
              <bdi>Crochet by Nouhad</bdi> <bdi>CN-0002</bdi>.
            </p>
          </Specimen>
          <Specimen label="sm · Readex Pro 350, Fil">
            <p className="text-sm text-fil">{t.checkout.phoneHint}</p>
          </Specimen>
          <Specimen label="xs · Readex Pro 350, Fil">
            <p className="text-xs text-fil">{t.footer.copyright}</p>
          </Specimen>
        </div>
      </Section>

      <Section id="chain" title={l.chain}>
        <Specimen label={l.divider}>
          <Chain />
        </Specimen>
        <Specimen label={l.drawn}>
          <Chain draw />
        </Specimen>
        <Specimen label={l.tones}>
          <div className="flex w-full flex-col gap-3">
            <Chain tone="kurkum" />
            <Chain tone="naanaa" />
            <Chain tone="nila" />
          </div>
        </Specimen>
        <Specimen label={l.nav}>
          <nav aria-label={t.nav.label} className="flex items-center gap-6">
            {l.navItems.map((item, i) => (
              <a
                key={item}
                href="#chain"
                aria-current={i === 0 ? "page" : undefined}
                className={`py-2.5 text-base ${i === 0 ? "stitch-underline" : "text-fil hover:text-nila"}`}
              >
                {item}
              </a>
            ))}
            <LanguageSwitcher />
          </nav>
        </Specimen>
        <Specimen label={l.loader}>
          <ChainLoader label={t.common.loading} />
        </Specimen>
      </Section>

      <Section id="buttons" title={l.buttons}>
        {(["default", "outline", "secondary", "ghost", "destructive", "link"] as const).map((variant) => {
          const forcedHover = {
            default: "bg-fouwwa-fonce",
            outline: "bg-laine",
            secondary: "bg-rose-fonce",
            ghost: "bg-laine",
            destructive: "bg-erreur-pale",
            link: "decoration-2",
          }[variant]
          const label =
            variant === "default" ? t.hero.ctaWhatsapp : variant === "destructive" ? fill(t.cart.remove, { name: tiles[0].name }) : t.hero.ctaShop
          return (
            <div key={variant} className="flex flex-wrap items-end gap-x-6 gap-y-4">
              <Specimen label={`${variant} · ${l.states_.rest}`}>
                <Button variant={variant}>{label}</Button>
              </Specimen>
              <Specimen label={l.states_.hover}>
                <Button variant={variant} className={forcedHover}>
                  {label}
                </Button>
              </Specimen>
              <Specimen label={l.states_.focus}>
                <Button variant={variant} className="outline-solid! outline-2! outline-offset-3! outline-nila!">
                  {label}
                </Button>
              </Specimen>
              <Specimen label={l.states_.disabled}>
                <Button variant={variant} disabled>
                  {label}
                </Button>
              </Specimen>
              {variant === "default" && (
                <Specimen label={l.states_.loading}>
                  <Button loading>{t.checkout.submitting}</Button>
                </Specimen>
              )}
            </div>
          )
        })}
        <div className="flex flex-wrap items-end gap-4">
          <Specimen label="lg">
            <Button size="lg">{t.hero.ctaWhatsapp}</Button>
          </Specimen>
          <Specimen label="sm">
            <Button size="sm" variant="outline">
              {t.cart.viewPage}
            </Button>
          </Specimen>
          <Specimen label={`${l.states_.loading} (clic)`}>
            <BusyButtonDemo />
          </Specimen>
        </div>
      </Section>

      <Section id="fields" title={l.fields}>
        <div className="grid max-w-3xl gap-6 sm:grid-cols-2">
          <Field id="sg-name" label={t.checkout.name}>
            {(p) => <Input {...p} placeholder={t.checkout.namePlaceholder} autoComplete="off" />}
          </Field>
          <Field id="sg-phone" label={t.checkout.phone} hint={t.checkout.phoneHint}>
            {(p) => <Input {...p} type="tel" dir="ltr" defaultValue="06 12 34 56 78" className="rtl:text-end" />}
          </Field>
          <Field id="sg-city-focus" label={`${t.checkout.city} · ${l.states_.focus}`}>
            {(p) => (
              <Input
                {...p}
                defaultValue={t.checkout.cityPlaceholder}
                className="border-fouwwa outline-solid! outline-2! outline-offset-2! outline-nila!"
              />
            )}
          </Field>
          <Field id="sg-phone-err" label={t.checkout.phone} error={t.checkout.errors.phoneInvalid}>
            {(p) => <Input {...p} type="tel" dir="ltr" defaultValue="123" className="rtl:text-end" />}
          </Field>
          <Field id="sg-disabled" label={`${t.checkout.city} · ${l.states_.disabled}`}>
            {(p) => <Input {...p} disabled defaultValue={t.checkout.cityPlaceholder} />}
          </Field>
          <Field id="sg-address-err" label={t.checkout.address} error={t.checkout.errors.addressShort}>
            {(p) => <Input {...p} placeholder={t.checkout.addressPlaceholder} />}
          </Field>
          <Field id="sg-notes" label={t.checkout.notes} className="sm:col-span-2">
            {(p) => <Textarea {...p} placeholder={t.checkout.notesPlaceholder} />}
          </Field>
        </div>
      </Section>

      <Section id="badges" title={l.badges}>
        <div className="flex flex-wrap items-center gap-3">
          <Badge>{t.product.unique}</Badge>
          <Badge variant="sold">{t.product.soldOut}</Badge>
          <Badge variant="secondary" className="outline outline-border">
            {t.shop.comingSoonBadge}
          </Badge>
          <Badge variant="outline">{t.orderStatus.confirmed}</Badge>
          <Badge variant="destructive">{t.orderStatus.cancelled}</Badge>
        </div>
      </Section>

      <Section id="notices" title={l.notices}>
        <div className="flex max-w-2xl flex-col gap-4">
          <Notice>{t.checkout.paymentNote}</Notice>
          <Notice tone="success" title={t.order.title}>
            {t.order.body}
          </Notice>
          <Notice
            tone="error"
            title={t.checkout.unavailable}
            action={
              <Button variant="outline" size="sm">
                {t.cart.viewPage}
              </Button>
            }
          />
        </div>
      </Section>

      <Section id="photos" title={l.photos}>
        <div className="grid grid-cols-3 gap-4 sm:max-w-xl">
          <Specimen label={l.withPhoto}>
            <Photo src={tiles[0].imageUrl} alt={tiles[0].name} emptyLabel={tiles[0].name} />
          </Specimen>
          <Specimen label={l.noPhoto}>
            <Photo alt={tiles[1].name} emptyLabel={tiles[1].name} emptyLabelLang={tiles[1].nameLang} />
          </Specimen>
          <Specimen label={l.loadingPhoto}>
            <Photo alt="" loading />
          </Specimen>
        </div>
        <Specimen label={l.yarn}>
          <YarnChips colours={["fouwwa", "kurkum", "laine"]} t={t} id="sg-yarn" />
        </Specimen>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          <ProductTile product={tiles[0]} lang={lang} t={t} feature />
          <ProductTile product={tiles[1]} lang={lang} t={t} />
          <ProductTile product={tiles[2]} lang={lang} t={t} />
          <ProductTileSkeleton />
          <ProductTileSkeleton />
        </div>
      </Section>

      <Section id="states" title={l.states}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-card bg-laine">
            <EmptyState
              as="h3"
              title={t.cart.empty}
              body={t.cart.emptyHint}
              actions={<Button variant="outline">{t.cart.continueShopping}</Button>}
            />
          </div>
          <div className="rounded-card bg-laine">
            <LoadingState label={t.common.loading} />
          </div>
          <div className="rounded-card bg-laine">
            <ErrorState
              as="h3"
              title={t.common.loadErrorTitle}
              body={t.common.loadErrorBody}
              actions={
                <>
                  <Button>{t.common.retry}</Button>
                  <Button variant="outline">{t.hero.ctaWhatsapp}</Button>
                </>
              }
            />
          </div>
        </div>
      </Section>

      <Section id="steps" title={l.steps}>
        <Steps items={[...l.steps_]} />
        <p className="text-xs text-fil">{l.placeholderNote}</p>
      </Section>

      <Section id="toasts" title={l.toasts}>
        <ToastDemos sampleName={tiles[0].name} />
      </Section>
    </div>
  )
}
