import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";
import { alternatesFor } from "@/i18n/metadata";
import { getDictionary, getLang } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return {
    title: t.legal.terms.title,
    description: t.legal.terms.description,
    alternates: alternatesFor(await getLang(), "/conditions"),
  };
}

export default async function TermsPage() {
  const t = await getDictionary();
  return <LegalPage content={t.legal.terms} t={t} />;
}
