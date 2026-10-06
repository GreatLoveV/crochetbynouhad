import type { Metadata } from "next";

/**
 * Wraps every admin screen, the login page included.
 *
 * Belt and braces next to `/robots`: even if a crawler somehow reaches
 * `/admin`, the `noindex` travels in the page head rather than relying on the
 * crawl rules alone.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({
  children,
}: LayoutProps<"/admin">) {
  return children;
}