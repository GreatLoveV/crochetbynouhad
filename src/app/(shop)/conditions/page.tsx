import type { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import { strings } from "@/lib/strings";

export const metadata: Metadata = {
  title: strings.legal.termsTitle,
  description:
    "Conditions générales de vente de Crochet by Nouhad — creations artisanales au crochet, paiement a la livraison.",
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-2xl px-5 py-16 sm:py-24">
      <h1 className="text-3xl font-medium sm:text-4xl">
        {strings.legal.termsTitle}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Texte de remplacement — à compléter avant la mise en ligne.
      </p>

      <Separator className="my-8" />

      <div className="flex flex-col gap-6 text-[0.975rem] leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-2 text-lg font-medium text-foreground">
            Produits
          </h2>
          <p>
            Chaque pièce est confectionnée à la main. De légères variations de
            couleur et de forme font partie de l&apos;aspect artisanal du
            produit.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-medium text-foreground">
            Prix et paiement
          </h2>
          <p>
            Les prix sont indiqués en dirhams marocains (MAD). Le paiement se
            fait à la livraison, auprès du livreur.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-medium text-foreground">Livraison</h2>
          <p>
            Les délais et frais de livraison sont communiqués lors de la
            confirmation de la commande.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-medium text-foreground">
            Annulation et retours
          </h2>
          <p>Texte à compléter.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-medium text-foreground">Contact</h2>
          <p>
            Pour toute question, écrivez-nous sur WhatsApp ou Instagram via les
            liens en bas de page.
          </p>
        </section>
      </div>
    </article>
  );
}
