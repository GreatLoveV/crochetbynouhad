# Research, round 2

Phase 2 of the second redesign. This round looks at 10 working sites: crochet and knit makers,
yarn dyers, handmade textile and ceramics shops, and three Arabic-first sites. It asks what
makes a handmade shop feel *made by a person*, and what makes a bilingual French/Arabic shop
work in both directions. Round 1's research is kept in [`round-1/research.md`](round-1/research.md).

- Scores and arithmetic: [`reference-audits.md`](reference-audits.md).
- Deep analyses (anydesign `design.md`, contrast tables and tokens) for the five strongest sites:
  [`references/`](references).
- Measured on 2026-11-12 with Playwright (desktop 1440, mobile 390) and the built-in browser.
- No images, text or branding from these sites are stored in the repository. Captures stay in
  the session scratchpad. Each site is studied for principles only.

## How the sites were found

| Source | Sites |
|---|---|
| Exa searches (crochet studio, hand-knit shop, Moroccan ceramics, Arabic handmade, Saudi crafts) | BEŶT, SUKA, Amano, Najdunes, Wasl Studio, Mækiki Studio, Lissy & Rudi |
| Awwwards (Site of the Day, craft and fashion categories) | G-uld |
| AD Middle East feature on Moroccan makers | LRNCE |
| A UX case study (AldalatiUX) about designing Arabic-first | Mo Al-Asala |
| Land-book | The Knotty Ones (dropped: shop closed, HTTP 402) |
| Exa | Irisée Handmade, D.PUIN (dropped: their TLS setup refuses this browser) |

Big marketplaces (Etsy, Amazon Handmade, Jumia) were left out, as the brief asks.

## The sites

Score = design-auditor overall score, same formula as round 1. Higher is better.

### 1. Najdunes — https://najdunes.com/ — **95**
*Arabic-first design and craft studio, Saudi Arabia. Exa. Deep audit.*

- **Works:**
  - Arabic is designed first, not translated. The language uses `lang="ar" dir="rtl"`, hreflang
    ar/en/x-default, and a skip link written in Arabic.
  - Type is tokenised per script. Arabic body is 1.125rem against 1rem for Latin, and Arabic
    headings get line-height 1.4 against 1.1. Arabic is never letter-spaced; Latin is tracked
    slightly tighter.
  - IBM Plex Sans Arabic in a light weight at 75 px gives a calm, large display without
    shouting.
  - A warm desert palette (ink `#1E1915`, dune `#EFE3CF`) with one woven-textile red (sadu
    `#A8262B`). The colour comes from the subject. Body contrast is 13.7:1.
  - No small targets, and reduced motion is respected.
- **Doesn't:**
  - 4 Tab stops have no visible focus.
  - The staggered cards leave a white seam between two dark sections.
  - The hero asks visitors to hover, which a phone can't do.
  - It's a studio site, not a shop, so there is less to get wrong.

### 2. BEŶT — https://www.beyt.ma/ — **73**
*Ceramics house, Casablanca, in French. Exa. Deep audit.*

- **Works:**
  - The UI uses one navy ink (`#1C3754`, 12.2:1 on white), so all the colour comes from the
    objects.
  - The seventeen glazes have Moroccan names (Grenadine, Safran, Chefchaouen, Mogador). That
    turns a palette into geography. This is the strongest single idea in the set for a
    Moroccan maker.
  - Editorial pacing: sections read like the pages of a magazine, and press covers are shown
    as objects with captions.
  - Sunlit lifestyle photos with the pieces in use.
- **Doesn't:**
  - No skip link and no `main`.
  - 9 targets under 24 px; the language links are about 12 px tall.
  - Didot is an Apple-only system font, so Windows and Android users see Georgia, a plainer
    page.
  - Justified prose opens rivers.
  - The navigation is 11.5 px tracked uppercase.

### 3. LRNCE — https://lrnce.com/ — **63**
*Moroccan ceramics and textiles, Marrakech. AD Middle East. Quick audit (deep audit in round 1).*

- **Works:**
  - Hand-painted, naive motifs are used as brand illustration, so the brand feels drawn
    rather than designed.
  - Warm photography of the studio and the makers.
- **Doesn't:**
  - 7 icon links have no name.
  - 6 Tab stops land inside hidden menus.
  - 21 small targets.
  - A popup, a chat bubble and a promo bar all compete on the first screen.

### 4. Lissy & Rudi — https://www.lissyandrudi.com/ — **62**
*Crochet artists, New Zealand. Exa. Quick audit.*

- **Works:**
  - Crochet treated as art: large, saturated pieces and installations fill the screen.
  - A joyful, personal voice; you know who makes the work.
  - Has a skip link.
- **Doesn't:**
  - Text over the pink knitted wall fails contrast (13 nodes).
  - 26 controls have no name (a Wix build).
  - No `h1`.
  - Nine font families.

### 5. Amano — https://foreveramano.com/ — **61**
*Hand-knit picture jumpers, UK and Ecuador. Exa. Deep audit.*

- **Works:**
  - A neutral black-and-white frame (Inter, square buttons) lets very colourful knitwear
    supply all the colour.
  - Every piece and every collection has a name, like a book chapter.
  - Pieces are shown worn, outdoors, in natural light.
  - Skip link, and all Tab stops visible.
- **Doesn't:**
  - White text over busy photos.
  - 12 images without `alt` and no `h1`.
  - A newsletter popup covers the first screen on load, plus a chat bubble.
  - No reduced-motion rule.

### 6. SUKA — https://www.sukaconcept.com/ — **53**
*Colourful crochet accessories, made on Lombok, sold from Amsterdam. Exa. Deep audit.*

- **Works:**
  - Saturated bands of colour (sun `#FAEC56`, tomato `#EA5629`, berry `#6B2038`) used as
    surfaces. The page has rhythm even where the photos are quiet.
  - Photos of hands crocheting sit beside the finished pieces.
  - Soft 20 px photo corners and pill buttons make the shop feel soft, like the material.
  - Product cards stay white, so yarn colours stay true.
- **Doesn't:**
  - Sun yellow on tomato is 2.93:1.
  - 5 images without `alt`, one unnamed control and two `h1`s.
  - Uppercase dotted titles ("OUR.STORY") that would not survive in Arabic.
  - Letter-spaced body text.

### 7. Wasl Studio — https://wasl-studio.com/ — **52**
*Saudi crafts shop, Arabic only, built on Salla. Exa. Quick audit.*

- **Works:**
  - A real Arabic e-commerce flow (cart and checkout are right to left) with the Cairo
    typeface.
  - Product photos on plain ground, with prices in Arabic numerals.
- **Doesn't:**
  - White text on the lavender top bar fails contrast.
  - No skip link, and 20 of 25 Tab stops show no focus.
  - 15 px body text is too small for Arabic.
  - An 11-item navigation wraps to two rows.
  - It looks like the platform's template rather than the maker.

### 8. G-uld — https://g-uld.dk/ — **38**
*Plant-dyed yarn, Denmark. Awwwards Site of the Day. Quick audit.*

- **Works:**
  - Colour taken from the dye pots. Every swatch is a real plant-dyed yarn, and the swatches
    are the palette.
  - Slow, confident editorial pacing, with large close-ups of fibre.
- **Doesn't:**
  - No `lang` attribute.
  - White tracked labels over photos fail contrast.
  - 4 images without `alt`, no skip link and no `h1`.
  - GSAP motion with no reduced-motion rule. An award does not mean accessible.

### 9. Mo Al-Asala — https://moalasala.com/ — **37**
*Arabic-first heritage clothing (hoodies with Arabic sayings). A UX case study. Deep audit.*

- **Works:**
  - Designed in Arabic first; the case study says checkout is right to left too.
  - Amiri, a classical Naskh, at 72 px gives the name real calligraphic presence.
  - A tagline about thread, "الفخامة في كل خيط", that partners the heading.
- **Doesn't:**
  - Body text at 80 % opacity on charcoal (worst 1.21:1).
  - The mobile page scrolls sideways.
  - Amiri navigation at 14 px and Naskh headings at line-height 1.0.
  - Meaningless stat cards ("∞", "100%").
  - Everything centred, which hides the reading direction.
  - The generic "black and gold luxury" look.

### 10. Mækiki Studio — https://maekiki-studio.com/ — **36**
*Colourful crochet, Germany. Exa. Quick audit.*

- **Works:**
  - Bold, cheerful crochet photographed flat on colour, so every product reads at thumbnail
    size.
- **Doesn't:**
  - 0 of 25 Tab stops show focus.
  - The cookie button is 1.47:1.
  - No skip link and 16 small targets.
  - Body line-height 1.15.
  - A stock pattern with visible watermarks behind the logo, the clearest example of what the
    brief forbids.

## What the strong sites share

1. **Colour comes from the material, and has names.** BEŶT's glazes, G-uld's dye pots,
   Najdunes's sadu red and SUKA's island colours. None of them chose a palette from a colour
   wheel. The colour is taken from the craft and named in the craft's language.
2. **A quiet frame for loud work.** Amano and BEŶT keep the interface to one ink, so the
   pieces carry all the colour. SUKA is the exception: it uses colour as surfaces, never
   *behind* products.
3. **The maker is visible.** Hands at work (SUKA), the studio (LRNCE), the artist's voice
   (Lissy & Rudi). The sites that feel handmade show a person, not just products.
4. **Pieces have names.** Amano's jumpers and BEŶT's glazes. A name makes a one-of-a-kind
   piece feel one of a kind.
5. **Soft geometry for soft material.** SUKA's 20 px photo corners and pill buttons suit
   yarn. The square sites (BEŶT, Amano) are for ceramics and an editorial tone.
6. **Pieces worn or in use, in daylight.** Every strong site shows the work outside the
   studio, not only on white.
7. **Editorial pacing over a grid of equal blocks.** Sections of different size and weight
   (BEŶT, G-uld). This is the opposite of our current page, where every section is the same
   volume.

## Arabic and RTL lessons

From Najdunes, Mo Al-Asala and Wasl, plus the RTL typography sources read in Phase 1
(4080studio, Hossam X, Creative4All, LearnType, SmartTech, Gradiently, NxFold, ijjad):

1. **Two type systems, not one flipped.** Najdunes, the top score, sets Arabic one step larger
   (1.125rem against 1rem), with line-height 1.6–1.8 for text and 1.4 or more for headings.
   It is the only site in the set that did this.
2. **Never letter-space Arabic,** and never use uppercase, italics or tracking as emphasis in
   Arabic: they break the joins or do nothing. SUKA's and BEŶT's tracked uppercase labels
   would not survive translation, so the design should not depend on them in French either.
3. **Naskh needs room.** Amiri at 14 px and at line-height 1.0 (Mo Al-Asala) is cramped and
   clips marks. Arabic UI text should be at least 16 px, and Naskh headings need a
   line-height of 1.5 or more.
4. **Pair by eye.** Match the Arabic and Latin faces on weight, stroke contrast and x-height
   against Arabic tooth height, not on name. Najdunes uses one superfamily (Plex) for both
   scripts; that is the safe route.
5. **Don't centre everything.** Centred layouts (Mo Al-Asala) hide the reading direction. A
   start-aligned layout lets Arabic visibly read from the right.
6. **Mirror only what points.** Chevrons, arrows and progress mirror. Logos, photos, clocks
   and the phone-number order do not. Our current breadcrumb chevron in AR points the wrong
   way (Phase 1 bug).
7. **Isolate numbers and Latin runs** with `<bdi>`, especially prices, phone numbers and
   WhatsApp links, so "MAD 250" doesn't reorder inside Arabic text.
8. **Keep RTL through the whole flow.** Mo Al-Asala and Wasl both keep cart and checkout right
   to left; a checkout that flips back to left to right breaks trust.
9. **Localise the small things:** the skip link (Najdunes writes it in Arabic), empty states,
   placeholders and `aria-label`s. Our current Arabic empty state is in Latin script.

## Mistakes to avoid

Each of these cost a reference site points, and each is cheap for us to avoid:

- Text over photos without a solid backing (Amano, G-uld, Lissy & Rudi).
- Low-opacity grey text on dark grounds (Mo Al-Asala, 1.21:1).
- Bright-on-bright pairs that look fine and fail (SUKA 2.93:1).
- No skip link, no `main`, no `h1`, or two `h1`s.
- Icon-only controls with no name (LRNCE, Lissy & Rudi).
- Targets under 24 px, especially language switchers.
- Popups, chat bubbles and promo bars on the first screen.
- Motion with no reduced-motion fallback (Amano, G-uld).
- Mobile pages that scroll sideways (Mo Al-Asala).
- Device-only fonts (BEŶT's Didot).
- Meaningless stats and filler (Mo Al-Asala).
- Template looks: black and gold luxury, or a platform theme left unchanged (Wasl).
- **Stock images.** Mækiki's watermarked pattern is the clearest example. Our site will only
  use photos of the maker's own work.

## Benchmark and target

| | Score |
|---|---|
| Benchmark: Najdunes (highest in the set) | **95** |
| Best shop in the set: BEŶT | 73 |
| Our current site, « Le fil » ([Phase 7 audit](../audit/phase-7-audit.md); the missing points are mostly placeholder photos) | 86 |
| **Our target** | **96 or higher** (the brief's minimum is 85) |

Najdunes reaches 95 with less surface (no shop, cart or forms). To beat it we have to score
96 with a full shop, a cart, a checkout form and two languages. That means:

- zero blockers or criticals
- at most one warning
- every Tab stop visibly focused, in both languages

## What this means for direction (input to Phase 3)

These are leads for Phase 3, not decisions:

- **Named colours from the yarn.** Take the palette from the mother's own yarns and give the
  colours Moroccan names, as BEŶT does for its glazes. The current palette is restrained and
  the user found it bland. Colour should be the brand, with the frame kept quiet around the
  photos.
- **The chain stays, and gets bigger.** The user liked the threads; it can carry the page as
  SUKA's colour bands do, rather than appear twice as a hairline.
- **Show the mother at work.** One section with hands, hook and yarn, if photos exist.
- **Name the pieces.** Each one-of-a-kind piece gets a name in both languages.
- **Soft corners on photos and pills on buttons,** to suit the material.
- **Per-script type tokens** from the start, with Arabic sized up.
- **Pacing:** one big moment per page and quieter sections around it.

**Blocking dependency:** every one of these depends on real photos of the mother's work. The
current site shows grey placeholder boxes. Before Phase 4 we need either access to the
production product images or a folder of photos.
