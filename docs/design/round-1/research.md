# Research: well-designed sites for handmade work

Phase 2 of the redesign, 2026-11-11. The 12 references below are for **principles only**.
Nothing here is to be copied: no site's layout, text, branding or images. Screenshots of
other sites were used for analysis and stay out of this repository.

- Per-site scores and arithmetic: [`reference-audits.md`](reference-audits.md)
- Design analyses for the five strongest (anydesign): [`references/`](references/)

## How the sites were chosen

I looked for small independent makers (crochet, knitting, yarn), handmade textile and
object studios, non-crochet makers known for design, and Arabic or bilingual sites with
strong RTL.

- **Big marketplaces were excluded.**
- **Evidence of design reputation where I could find it:**
  - Heath's site is by BASIC agency, and Heath holds an AIGA Corporate Leadership award.
  - LRNCE is Decorex Africa Designer of the Year 2026 and was shortlisted at the Dezeen
    Awards 2025 (for interiors, not its website).
  - Thmanyah's rebrand is by Milk Network, with a logotype by Wael Morcos.
  - 29LT is a leading bi-script Arabic/Latin type foundry.
  - Laine, PetiteKnit and Pom Pom are widely cited in the knitting community for their
    editorial look.
- **Honest caveat:** web searches turned up no design-gallery or award listings for most
  indie yarn sites, so for those, "well regarded" rests on community reputation and my
  own review rather than an award.
- **Considered and dropped:**
  - Jardin Majorelle: its home page is a ticketing notice.
  - Louvre Abu Dhabi (Arabic): its hero is a video that captured as black.
  - Ace & Jig: too close to Tekla.

## The 12 references

Scores use the design-auditor method on each home page (higher is better; benchmark in
bold).

### Crochet, knitting and yarn

**PetiteKnit** — https://www.petiteknit.com/ · Danish knitwear designer · **85**
- *Works:*
  - Alternating half-screen bands: a portrait of someone wearing the knit on one side, a
    huge two-word pattern name on the other.
  - A four-up "Beginner / Children / Baby / Shop" photo row as navigation.
  - A strict palette (white, one plum for names), so the yarn colours are the only colour.
  - A skip link, no contrast failures, and visible focus on every stop.
- *Doesn't:*
  - Tiny tap targets.
  - Two `h1`s.
  - Uppercase labels everywhere.
  - Microtext footer.

**Laine Publishing** — https://lainepublishing.com/ · Finnish knitting magazine and shop · 74
- *Works:*
  - Magazine-cover heroes: one big, tightly tracked grotesque headline on a portrait.
  - Knits shown worn, in real places.
  - 4:5 pattern cards.
  - Category names as big tappable words.
  - Full `hreflang`.
- *Doesn't:*
  - White text on cream photos.
  - A discount pill pinned over content.
  - No `h1`.

**La Bien Aimée** — https://www.labienaimee.com/ · Paris hand-dyed yarn · 64
- *Works:*
  - The maker's own face beside her skeins in the hero.
  - "Dyed to order in Paris" stated first.
  - Huge, saturated close-ups of the yarn.
  - A French brand with 7 language versions and `hreflang`.
- *Doesn't:*
  - Two promo bars, 11 uppercase nav items and colourful promo panels compete with the
    yarn.
  - Text over photos fails contrast.
  - Unnamed icon links.

**Pom Pom** — https://pompommag.com/ · UK knitting magazine and shop · 64
- *Works:* a warm pink-cream ground and a playful, hand-drawn identity that feels made by
  people.
- *Doesn't:*
  - A signup modal on load.
  - Focus disappears into hidden menus (23 of 25 Tab stops).
  - Images with no `alt`.

**Wool and the Gang** — https://www.woolandthegang.com/ · knit kits · 50
- *Works:* confident fashion photography and a clear "made by you" message.
- *Doesn't:*
  - Reads like any fashion retailer: condensed all-caps on a photo, a 10-item mega nav.
  - No skip link, no `main` and no focus styles.

### Handmade beyond crochet

**Heath Ceramics** — https://www.heathceramics.com/ · Californian pottery since 1948 · 73
- *Works:*
  - Products shot on the same clay-white as the page, so the objects float.
  - Radius 0.
  - A schoolbook serif for editorial sentences.
  - A typographic category list as navigation.
- *Doesn't:*
  - A 13 px body.
  - No `h1`.
  - Light text on photos.
  - Relies on an overlay widget for accessibility.

**LRNCE** — https://lrnce.com/ · Marrakech ceramics and textiles studio · 63
- *Works:*
  - The closest in spirit to Nouhad: Moroccan, handmade, playful.
  - Full-bleed, grainy, warm-flash photos of the work at the scale where the brush marks
    show.
  - Sand ground #EEE3D4 with one terracotta.
  - A serif reserved for one editorial sentence.
  - Studio address and hours in the footer.
- *Doesn't:*
  - Newsletter popup, chat bubble, promo bar and cookie bar all on the first screen.
  - Unnamed icon links.
  - Focus lost in hidden menus.

**Tekla** — https://teklafabrics.com/ · Copenhagen textiles · 62
- *Works:*
  - Close, dark texture shots where you can feel the weave.
  - Two-up bands with a plain one-line caption.
  - Four greys and nothing else.
  - An honest consent dialog.
- *Doesn't:*
  - Weight 300 at 14 px.
  - 85 % of mobile targets are tiny.
  - No skip link, `main` or `h1`.

### Arabic and bilingual (RTL)

**Thmanyah** — https://thmanyah.com/ · Saudi Arabic media · 66
- *Works:*
  - Natively Arabic: the layout grows from the right, and thumbnails sit at the inline
    start.
  - No letter-spacing.
  - Headline line-height 1.5–1.6.
  - IBM Plex Sans Arabic carries Latin words inside Arabic sentences without a style
    break.
  - Arabic months with Western digits.
  - Custom Arabic lettering on newsletter covers is the expressive layer.
- *Doesn't:* orange link text at 3.01:1, no skip link, small targets.

**Jameel Arts Centre** — https://jameelartscentre.org/ar/ · Dubai, bilingual · 50
- *Works:* the hero sets Arabic and English titles of the same show side by side, each in
  its own typographic voice: Arabic calligraphic display beside a Latin grotesque.
- *Doesn't:* unnamed controls, no skip link, contrast failures.

**Mathaf** — https://mathaf.org.qa/ar/ · Arab Museum of Modern Art, Doha · 50
- *Works:*
  - Very large Arabic display type in a house script face over a painting.
  - A confident RTL nav.
  - Separate Arabic and Latin webfonts tuned per script.
- *Doesn't:* white type on a busy painting, no focus styles.

**29LT** — https://www.29lt.com/ · bi-script Arabic/Latin type foundry · 50
- *Works:* specimens show Arabic and Latin designed as matched pairs, which is the best
  live demonstration of weight and colour matching across scripts.
- *Doesn't:* no `lang` attribute (on a bilingual foundry), body line-height 1.0, and no
  skip link.

## What the best ones share

### Showing the work
- **The work fills the first screen.**
  - LRNCE, Laine, Tekla and PetiteKnit open on a photograph at full bleed or half bleed,
    with no frame, border or radius.
  - The current Nouhad home page does the opposite: a framed card beside a text column.
- **Two kinds of photo, used deliberately.**
  - *In-use or worn* photos (Laine, PetiteKnit, La Bien Aimée) sell desire and scale.
  - *Object on the page colour* (Heath, Tekla listings) sells the object and keeps grids
    calm.
- **A detail crop for texture.** Tekla and LRNCE show the weave or brush mark so close you
  can feel it. For crochet, that means the stitch.
- **Crops:** 4:5 portrait for garments and bags, square-ish for flat objects, 1:1 for
  Instagram-style strips. Media corners are square (0 radius) at Heath, Laine, Tekla and
  PetiteKnit.

### Typography
- **One expressive move, everything else quiet.**
  - Laine: huge tight grotesque.
  - PetiteKnit: two-word names at display size.
  - Heath and LRNCE: a literary serif for one sentence.
- **Two families at most, with distinct roles.** The UI face is plain and readable.
- **The weak sites rely on uppercase letter-spaced labels.** This doesn't transfer to
  Arabic.

### Colour
- **The UI is nearly colourless, so the work supplies the colour.** Warm off-whites:
  #EEE3D4 (LRNCE), #F7F0EA (Heath), #F6F4EE (Thmanyah), #F6F6F6 (Tekla).
- **At most one accent:** LRNCE terracotta #945738 and PetiteKnit plum.
- **None of the best sites uses a dark ground for product.** The two that go dark (Tekla
  interiors, LRNCE flash photos) do it *inside the photograph*, not in the UI.

### Layout and white space
- **Alternating half-screen bands** (PetiteKnit, Laine): image and text swap sides.
  - This mirrors naturally in RTL.
- **Edge-to-edge grids with hairline gutters** (Tekla) versus airy centred grids (Heath).
- **Generous vertical rhythm** (60–100 px between sections), with dense footers kept at
  the bottom.

### Navigation
- **Three to five top-level items** at the best sites (Laine 3, Tekla 4, PetiteKnit 3).
- **Categories as pictures or big words:** PetiteKnit's photo row, Heath's serif list,
  Laine's large tabs.
- **Language switching:**
  - Good: a plain named switcher (PetiteKnit "English ▾", Jameel "English").
  - Bad: flags only. Flags are countries, not languages, and there's no single flag for
    French or Arabic.

### The maker's story
- **The maker's face and place:**
  - La Bien Aimée shows the dyer in the hero.
  - LRNCE gives its studio address and hours.
  - PetiteKnit's Instagram strip shows real life.
- **One honest line** ("Dyed to order in Paris") beats an about-page essay.

### Leading to a purchase or contact
- **One clear action per band**, and price shown plainly next to the name (Heath, Laine).
- **The best shops let you act without an account.**
  - Nouhad already does this better than most: WhatsApp and cash on delivery.
  - The redesign should make that path *more* visible, not hide it.

### Motion
- **Mostly still.**
  - Slideshows (Heath, Laine) are the main motion.
  - Most of the strong sites respect `prefers-reduced-motion`.
- **None needs scroll-jacking.** A slow image fade or a crossfade between photos is the
  most any of them does.

### Mobile
- **The photo comes first, then one line, then one button.**
  - PetiteKnit and Laine keep the headline large on phones.
- **The most common failure is tap targets under 24 px** (9 of 12 sites).

## Arabic and RTL: what good sites do

- **Mirror the layout, not the content.**
  - Logo, nav, thumbnails and reading order move to the right (Thmanyah, Mathaf).
  - Photos are not flipped.
  - Directional icons (arrows, chevrons, "back") flip. Other icons (search, bag,
    WhatsApp) don't.
- **Type pairing by colour and weight, not by name.**
  - Thmanyah uses one family that covers both scripts (IBM Plex Sans Arabic).
  - Mathaf and 29LT use separate but matched faces.
  - The common advice, which matches what I measured: Arabic needs more vertical room and
    reads small at the same font size. So set it about 10–15 % larger optically, and keep
    body line-height at 1.6–1.8 versus 1.5 for Latin.
- **No letter-spacing, no uppercase.** Arabic has no case, and tracking breaks the joins.
  Hierarchy has to come from size, weight and space. This is one more reason to drop the
  current uppercase eyebrows.
- **Mixed content:**
  - Latin words, brand names, phone numbers and prices inside Arabic sentences need
    isolation (`<bdi>` or `unicode-bidi: isolate`) or they jump around.
  - Thmanyah handles «PRIMETIME» cleanly with guillemets and a shared family.
  - Product references like `CN-0002` and phone numbers must stay LTR inside RTL text.
- **Digits.**
  - Thmanyah and Jameel use Arabic month names with **Western digits 0–9**.
  - Morocco commonly uses Western digits in everyday print and commerce. I'll recommend
    Western digits in Phase 4, but it's your call.
- **Expressive Arabic is an asset.** Thmanyah's lettering, Mathaf's script display and
  Jameel's calligraphic titles prove Arabic can carry *more* character than Latin. The
  Arabic pages should feel designed for Arabic, not like the French layout flipped.

## Common mistakes to avoid

1. Popups, chat bubbles and promo bars stacked over the work on arrival (LRNCE, Pom Pom,
   Laine, Tekla, PetiteKnit).
2. Light text on photos without a scrim (Laine, Wool and the Gang, Mathaf, Heath).
3. Tap targets under 24 px, especially icon buttons and language flags (9 of 12).
4. No skip link, no `main`, no `h1` or two `h1`s (8 of 12).
5. Focus escaping into hidden menus (Pom Pom, LRNCE).
6. Tiny or thin body text (Heath 13 px, Tekla 300 at 14 px).
7. Low-contrast accent used for small text (Thmanyah's orange).
8. Uppercase letter-spaced labels as the main hierarchy device (most Latin sites). These
   fail in Arabic.
9. Flags as language switchers.
10. Missing `lang` on a multilingual site (29LT).
11. Busy promotional colour competing with the products (La Bien Aimée).
12. Accessibility overlays instead of accessible markup (Heath).

## Benchmark

| | Score |
|---|---|
| Highest reference (PetiteKnit) | **85** |
| Our target | **≥ 86** (beat 85; the brief's minimum of 85 is also met) |

Nouhad's current site hasn't been audited yet; that happens in Phase 7 for the redesign.
From the Phase 1 review it already does several things well that many references don't:
cash on delivery, WhatsApp, `noindex` on checkout. But the redesign has to avoid every
mistake above to clear 85.

## Sources

- [BASIC: Heath Ceramics ecommerce case study](https://basicagency.com/case-studies/heath-ceramics-ecommerce-web-design)
- [AIGA: Heath Ceramics Corporate Leader](https://www.aiga.org/design/design-leadership/aiga-corporate-leadership-award/aiga-corporate-leader-heath-ceramics)
- [Bizcommunity: LRNCE named Decorex Africa Designer of the Year 2026](https://www.bizcommunity.com/article/morocco-based-lrnce-crowned-decorex-africa-designer-of-the-year-2026-847493a)
- [Dezeen Awards 2025 longlist (LRNCE's Rosemary)](https://www.dezeen.com/awards/2025/longlists/rosemary/)
- [Behance: Thmanyah rebrand](https://www.behance.net/gallery/192657457/Thmanyah)
- [Thmanyah font licence](https://ask.thmanyah.com/hc/en-001/articles/45993930027281-Thmanyah-Font-for-Everyone)
- [29LT blog: typography](https://blog.29lt.com/tag/typography)
- [TPTQ Arabic: a custom typeface for Louvre Abu Dhabi](https://tptq-arabic.com/blog/a_custom_typeface_for_the_louvre_abu_dhabi)
- [Creative Bloq: What's different about Arabic web design?](https://creativebloq.com/web-design/arabic-91412873)
- [Glyphs forum: Arabic + Latin vertical metrics](https://forum.glyphsapp.com/t/arabic-latin-vertical-metrics-strategy/33320)
- [Alex Strick: Why do Arabic fonts appear so small?](https://alexstrick.com/personal/2017-03-12-why-are-arabic-fonts-so-small.html)
- [Freshy Sites: best artisan websites](https://freshysites.com/web-design-development/best-artisan-websites/)
