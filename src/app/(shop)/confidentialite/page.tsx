import type { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import { strings } from "@/lib/strings";

export const metadata: Metadata = {
  title: strings.legal.privacyTitle,
  description:
    "Politique de confidentialité de Crochet by Nouhad — quelles données sont collectées lors d'une commande et comment elles sont utilisées.",
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-2xl px-5 py-16 sm:py-24">
      <h1 className="text-3xl font-medium sm:text-4xl">
        {strings.legal.privacyTitle}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Texte de remplacement — à compléter avant la mise en ligne.
      </p>

      <Separator className="my-8" />

      <div className="flex flex-col gap-6 text-[0.975rem] leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-2 text-lg font-medium text-foreground">
            Données collectées
          </h2>
          <p>
            Lors d&apos;une commande, nous enregistrons votre nom, votre numéro
            de téléphone, votre ville et votre adresse de livraison. Ces
            informations servent uniquement à traiter et livrer votre commande.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-medium text-foreground">
            Paiement
          </h2>
          <p>
            Aucun paiement en ligne n&apos;est enregistré : le règlement se fait
            en espèces à la livraison. Aucune donnée bancaire n&apos;est donc
            demandée.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-medium text-foreground">
            Conservation
          </h2>
          <p>Texte à compléter.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-medium text-foreground">
            Vos droits
          </h2>
          <p>
            Vous pouvez demander l&apos;accès, la rectification ou la
            suppression de vos données en nous écrivant via les liens de
            contact en bas de page.
          </p>
        </section>
      </div>
    </article>
  );
}
