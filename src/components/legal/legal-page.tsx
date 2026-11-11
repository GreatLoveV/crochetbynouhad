import { Separator } from "@/components/ui/separator";
import type { Dictionary } from "@/i18n/dictionaries/fr";

type LegalContent = Dictionary["legal"]["terms"];

/**
 * Shared body of the two legal pages. The text lives in the dictionaries
 * (`legal.terms`, `legal.privacy`), so both languages stay in step.
 */
export function LegalPage({ content, t }: { content: LegalContent; t: Dictionary }) {
  return (
    <article className="mx-auto max-w-2xl px-5 py-16 sm:py-24">
      <h1 className="text-3xl font-medium sm:text-4xl">{content.title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">{t.legal.placeholder}</p>

      <Separator className="my-8" />

      <div className="flex flex-col gap-6 text-[0.975rem] leading-relaxed text-muted-foreground">
        {content.sections.map((section) => (
          <section key={section.title}>
            <h2 className="mb-2 text-lg font-medium text-foreground">{section.title}</h2>
            <p>{section.body ?? t.legal.toComplete}</p>
          </section>
        ))}
      </div>
    </article>
  );
}
