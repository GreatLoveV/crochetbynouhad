import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";
import { alternatesFor, openGraphFor } from "@/i18n/metadata";
import { getDictionary, getLang } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  const lang = await getLang();
  const { title, description } = t.legal.terms;
  return {
    title,
    description,
    alternates: alternatesFor(lang, "/conditions"),
    openGraph: openGraphFor(lang, "/conditions", { siteName: t.siteName, title, description }),
  };
}

export default async function TermsPage() {
  const t = await getDictionary();
  return <LegalPage content={t.legal.terms} t={t} />;
}
