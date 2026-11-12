# Direction « Fouwwa », round 2

Phase 3. This direction has to answer three things:

- The user's verdict on round 1: plain, the colours aren't good, only the threads were liked.
- The lessons in [`research.md`](research.md).
- The brief: the photos of the maker's work are the heart of the site.

Board: [`direction.html`](direction.html), screenshot in [`direction.png`](direction.png).
Round 1's direction is kept in [`round-1/`](round-1).

**Fouwwa** (فوّة) is madder, the root that dyes Moroccan wool red. The site's colours come
from wool dyes, in the same way the pieces do.

## Subject, audience and job

- **Subject:** one-of-a-kind crochet bags, scarves and accessories, each made once by one
  maker (Nouhad) in Morocco.
- **Audience:** Moroccan buyers on their phones, reading French or Arabic. They pay cash on
  delivery and often ask questions on WhatsApp first.
- **The page's job:** make each piece feel singular and made by a person, then make it easy to
  order or ask about it, in either language.

## Palette: six named colours

Every colour has a dye or material name in both languages, as BEŶT names its glazes. The
names will appear in the shop: each piece lists the yarn colours used.

| Name (FR / AR) | Hex | Role | Text contrast |
|---|---|---|---|
| **Rose** / ورد | `#FBEDEA` | page ground | indigo on rose 12.4:1 |
| **Laine** / صوف | `#FFFDF9` | cards and frames behind photos (undyed wool) | indigo on wool 14.0:1 |
| ~~**Nila** / نيلة~~ **Barqouq** / برقوق | ~~`#1E2461`~~ `#3A1C33` | text, outlines, footer (plum; replaced indigo after Phase 5) | wool on plum 14.8:1 |
| **Fouwwa** / فوّة | `#9C1D3B` | main action, prices, active states (madder) | wool on madder 7.8:1, rose on madder 6.9:1 |
| **Naanaa** / نعناع | `#1C6347` | atelier band, success (mint) | wool on mint 7.1:1 |
| **Kurkum** / كركم | `#E9A93A` | chain thread, small surfaces (turmeric) | indigo on turmeric 6.9:1. **Never as text on rose (1.8:1).** |

The pairs above pass AA, and nearly all of them pass AAA. Errors use madder plus an icon and
a message, never colour alone.

**Why these colours:**
- **Colour from the material** (BEŶT's glazes, G-uld's dye pots, Najdunes's sadu red). Madder
  and indigo are the two classic dyes of Moroccan wool.
- **Quiet frame for loud work** (Amano, BEŶT). Only rose, indigo and madder touch the
  interface.
- **Colour as surfaces** (SUKA). Mint and turmeric come in as whole bands and as the chain,
  never behind a product photo, so yarn colours stay true.
- **Your own words:** "the colour used isn't that good". Round 1 was off-white with a single
  green. This direction is clearly colourful.

## Type

| Role | Latin (FR) | Arabic (AR) |
|---|---|---|
| Display: page titles, piece names, section titles | **Fraunces**, variable, `SOFT 100`, `WONK 1`, 650, line-height 1.02, tracking −0.01em | **Aref Ruqaa** 700, line-height 1.5, no tracking, about 8 % larger |
| Text and UI: body, subheads, buttons, forms | **Readex Pro** 400/500, 16 px, line-height 1.6 | **Readex Pro** 400/500, 18 px, line-height 1.8, no tracking |

**Coverage, checked in the next/font data:**
- Aref Ruqaa: `arabic`, `latin`, `latin-ext`.
- Fraunces: `latin`, `latin-ext`, which cover é, è, ç, œ, «, », ’ and the narrow no-break space.
- Readex Pro: `arabic`, `latin`, `latin-ext`, which covers both scripts and the digits.

All three are on Google Fonts and will be self-hosted with `next/font`, which is already used.
No new dependency.

**Why these faces:**
- **Ruqaa is the everyday handwritten script.** Handwriting suits handmade work, and it gives
  the Arabic version its own display presence instead of the French page flipped (Najdunes,
  Mo Al-Asala).
- **Fraunces with the Soft axis at 100** has round, swollen terminals, close to yarn. By eye, it
  matches Ruqaa Bold in weight and stroke contrast (see the board).
- **Readex Pro** is already on the site and is designed for Arabic and Latin together, so both
  scripts share a text voice.
- **Per-script tokens** (Najdunes): Arabic sizes up one step with a taller line-height, is
  never letter-spaced, and never uses uppercase or italics for emphasis. Uppercase isn't used
  in French either, so the two languages carry the same hierarchy.
- **Ruqaa is for short names and titles only.** On the board, a 32 px Ruqaa subhead was
  hard to read. It was moved to Readex, and that rule stands.

⚠️ **For you and for a native reader:** Ruqaa is an Eastern script. The Moroccan everyday hand
is Maghribi, which has no good free webfont. If Ruqaa feels foreign for a Moroccan shop, the
fallback is Reem Kufi (calmer, geometric, same coverage). This is a taste question I can't
settle alone.

## Layout

- **Start-aligned, never centred everything.** In Arabic the page should visibly read from
  the right (Mo Al-Asala lesson). Content measure is at most 68 characters in French and 60 in
  Arabic.
- **One piece at a time** instead of a four-column grid. Each piece gets a large row: a photo
  on the start side, then its name, a one-line story, the yarn colours used (round chips with
  their dye names) and two actions. Rows alternate sides on wide screens. On phones the photo
  comes first. With two to ten pieces this is better than an empty grid; the catalogue page
  becomes a denser two-column grid only when there are more than six.
- **Pacing:** one big moment per page (the hero piece on home, the gallery on a product page),
  with quieter sections around it (BEŶT, G-uld).
- **Home order:** hero piece, then the other pieces, then the atelier band (mint, her hands and
  her words), then how to order, then the footer (indigo). How to order is a real sequence
  (choose, we call to confirm, pay on delivery), so numbering it is honest.
- **Navigation on one row on phones:** logo, language pill, cart. The section links move into
  a menu. This fixes the 45 px second row from Phase 1.
- **Geometry by role, not one radius for everything:**
  - Photos: 24 px.
  - Cards and frames: 28 px.
  - Buttons and the language switch: full pill.
  - Inputs: 14 px.
  - This follows SUKA's soft tiers, chosen to suit a soft material.

## Photos

- **Only the maker's own photos.** Never stock images, and never images from other websites.
- Shown large, with 24 px corners, on a wool (`#FFFDF9`) frame so the yarn colours don't pick
  up the rose ground.
- Ideally the piece is worn or in use, in daylight (Amano, SUKA). Product shots on plain
  ground work too.
- **No text over photos.** Text always sits beside or below the photo, on a solid ground.
  Every reference that broke this rule lost a blocker for it.
- **Alt text in both languages,** taken from each piece's name and description.
- **Without a photo:** a wool frame with a faint chain-stitch pattern and the piece's name.
  This replaces today's grey placehold.co box.
- **Needed from you:** the real product photos, and ideally one or two of her hands at work
  for the atelier band.

## The chain

The user liked the threads, so they become the signature. A thick crochet chain (interlocked
loops, 5 px stroke):

- separates the major sections;
- changes colour with the section it leads into (madder, turmeric, mint);
- runs in the reading direction. It is symmetrical, so nothing needs mirroring.

It replaces the thin hairline chain of round 1. It is decoration only: `aria-hidden`, never a
control.

## Motion (genjutsu cast, in Phase 5)

- **One orchestrated moment:** on first load of the home page, the hero chain is drawn
  stitch by stitch (about 900 ms, ease-out). Nothing else moves on load.
- **Motion that answers an action:**
  - Add to cart: the cart count gives a short pulse.
  - Menu: opens with a 180 ms slide from the start side.
  - Accordion: opens in place.
  - Buttons: a press state.
- **Not used:** scroll-triggered fade-ups on every section, parallax, auto-playing carousels.
- **`prefers-reduced-motion: reduce`:** the chain is simply there, and transitions become
  instant opacity changes.

## Check against generic defaults (frontend-design process)

I ran the brief "Moroccan handmade crochet shop" through my own first instincts. The defaults
were: cream ground, terracotta accent, a high-contrast serif, zellige tile patterns, Moorish
arch photo frames, and tracked uppercase eyebrows. What I changed:

| First instinct | Why it's generic | Changed to |
|---|---|---|
| Cream `#F4F1EA` ground with terracotta "henné" | the most common AI-generated palette; round 1 was already near it | **rose ground with madder**: a dye red, cooler and specific to wool |
| Zellige pattern and arch-shaped photo frames | Moroccan-cliché decoration that says nothing about crochet | **the crochet chain**, the one motif that comes from the craft itself |
| A high-contrast Didone display | the default "premium" serif (BEŶT uses Didot) | **Fraunces Soft** (rounded, yarn-like) paired with **Ruqaa** |
| Tracked uppercase labels above each section | template chrome; doesn't work in Arabic | **no eyebrows**; sections start with their title |
| A four-column product grid with identical cards | the SaaS card kit, and empty with 2 products | **one piece per row** |
| "→" on every button, mid-dot meta strings | template tells | plain verbs: "Voir la pièce", "Écrire sur WhatsApp" |

Boldness is spent in one place: **colour plus the chain**. Everything else (the text face, the
grid and the forms) stays quiet.

## Traceability

| Choice | Research source |
|---|---|
| Named dye colours | BEŶT glazes; G-uld dye pots; Najdunes sadu |
| Neutral frame around photos | Amano; BEŶT |
| Colour bands as surfaces | SUKA |
| Soft radii, pill buttons | SUKA |
| Hands at work (atelier band) | SUKA; LRNCE; Lissy & Rudi |
| Named pieces | Amano; BEŶT |
| Per-script type, Arabic one step larger | Najdunes; RTL sources |
| Arabic display face with presence | Mo Al-Asala (Amiri), with its size and line-height mistakes avoided |
| Start-aligned layout | Mo Al-Asala (counter-example) |
| No text on photos, no popups, 24 px+ targets | the failures of Amano, G-uld, Lissy & Rudi, BEŶT, LRNCE |
| One motion moment, reduced motion | Amano and G-uld (counter-examples); frontend-design |

## Moodboard (words, not images)

There are no third-party images in the repository. These describe the mood:

- Skeins drying in the dyers' souk, Marrakech: madder red, indigo and saffron yellow hanging
  in the sun.
- A block of nila indigo, dark blue that stains the hands.
- Rose water and the rose valley of Kelaat M'Gouna: the pale pink ground.
- A glass of mint tea on a tray: the mint band.
- Turmeric in a spice cone: the thread colour.
- A handwritten Ruqaa note or a shop sign painted by hand.
- A crochet chain coming off the hook, the first row of every piece.
- A bag worn at a market, in daylight.

## New UI text (for native review)

The board copy is placeholder only. The text below will become real UI in Phase 4 or 5. It
will be added to both dictionaries and listed in `docs/i18n/` for a native reader:

- Colour names: Rose / ورد, Laine / صوف, Nila / نيلة, Fouwwa / فوّة, Naanaa / نعناع,
  Kurkum / كركم.
- "Couleurs de laine" / "ألوان الصوف" (label for a piece's yarn chips).
- "L'atelier" / "الورشة".
- "Voir la pièce" / "شاهدوا القطعة".
- The placeholder text for a missing photo: "Photo à venir" / "الصورة قريبًا".

## Open questions for you

1. **Photos.** These are needed before Phase 4 screenshots mean anything.
2. **Ruqaa or Reem Kufi** for Arabic display (see the note above).
3. **The piece names.** Will your mom name each piece? Place names (Tafilalt, Ourika) fit the
   palette idea.
4. **The stashed Pelote work.** It is superseded by this direction. Should I drop the stash?
