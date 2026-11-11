import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";
import { alternatesFor } from "@/i18n/metadata";
import { getDictionary, getLang } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return {
    title: t.legal.privacy.title,
    description: t.legal.privacy.description,
    alternates: alternatesFor(await getLang(), "/confidentialite"),
  };
}

export default async function PrivacyPage() {
  const t = await getDictionary();
  return <LegalPage content={t.legal.privacy} t={t} />;
}
