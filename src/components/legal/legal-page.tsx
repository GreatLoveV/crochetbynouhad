import { Notice } from "@/components/ui/notice";
import type { Dictionary } from "@/i18n/dictionaries/fr";

type LegalContent = Dictionary["legal"]["terms"];

/**
 * Shared body of the two legal pages. The text lives in the dictionaries
 * (`legal.terms`, `legal.privacy`), so both languages stay in step.
 */
export function LegalPage({ content, t }: { content: LegalContent; t: Dictionary }) {
  return (
    <article className="mx-auto max-w-page px-4 pt-10 sm:px-8 sm:pt-16">
      <div className="max-w-prose">
        <h1 className="text-4xl sm:text-5xl">{content.title}</h1>
        <Notice className="mt-6">{t.legal.placeholder}</Notice>

        <div className="mt-10 flex flex-col gap-8">
          {content.sections.map((section) => (
            <section key={section.title} className="border-t border-border pt-6">
              <h2 className="mb-2 text-2xl">{section.title}</h2>
              <p className={section.body ? undefined : "text-mauve italic"}>{section.body ?? t.legal.toComplete}</p>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
