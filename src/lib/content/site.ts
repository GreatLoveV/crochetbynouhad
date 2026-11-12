/**
 * Site content that isn't a product and isn't interface text.
 *
 * The "L'atelier" band on the home page shows a photo of Nouhad's hands at
 * work when one is set here. Until then the band is text only: the site never
 * shows a stock picture in its place.
 *
 * To add it: put the photo online (a Vercel Blob link is resized by Next.js;
 * any https link works), paste its URL below, and describe it in both
 * languages for screen readers. See README.md, "The workshop photo".
 */
export const ATELIER_PHOTO: {
  url: string
  alt: { fr: string; ar: string }
} | null = null
