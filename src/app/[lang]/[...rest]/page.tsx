import { notFound } from "next/navigation";

/**
 * Any `/fr/...` or `/ar/...` path that matches no page. Calling `notFound()`
 * here renders `[lang]/not-found.tsx` inside the shop layout, in the right
 * language, instead of a bare global 404.
 */
export default function CatchAll(): never {
  notFound();
}
