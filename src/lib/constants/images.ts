/**
 * Which image hosts `next/image` is allowed to optimise.
 *
 * `next/image` refuses to fetch a host it has not been told about, which would
 * leave a broken image on the shop the moment Nouhad pastes a link from a new
 * host. So instead of trusting every host, anything not on this list is
 * rendered with `unoptimized` — the browser loads the original file directly.
 *
 * This list must stay in step with `remotePatterns` in `next.config.ts`; that
 * file is what Next actually reads at build time, this one is what the
 * components ask.
 */
export const OPTIMIZABLE_IMAGE_HOSTS = [
  "placehold.co",
  "*.public.blob.vercel-storage.com",
] as const;

/** `true` when the URL is http(s) and its host is on the list. */
export function isOptimizableImageUrl(url: string | null | undefined): boolean {
  if (!url) return false;

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false;

  return OPTIMIZABLE_IMAGE_HOSTS.some((pattern) =>
    pattern.startsWith("*.")
      ? parsed.hostname.endsWith(pattern.slice(1))
      : parsed.hostname === pattern,
  );
}