"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { MessageCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/state";
import { useI18n } from "@/i18n/client";
import { fill } from "@/i18n/config";
import { whatsappUrl } from "@/lib/integrations/whatsapp";

/**
 * A page of the shop failed to render (most often the database didn't
 * answer). The header and footer stay; this says what happened and offers to
 * try again or to order on WhatsApp, which works whatever the site does.
 */
export default function ShopError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const { t } = useI18n();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      as="h1"
      className="py-24"
      title={t.common.loadErrorTitle}
      body={t.common.loadErrorBody}
      actions={
        <>
          <Button onClick={() => retry()}>{t.common.retry}</Button>
          <Button
            variant="outline"
            render={
              <a
                href={whatsappUrl(fill(t.whatsapp.question, { shop: t.siteName }))}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            <MessageCircleIcon data-icon="inline-start" aria-hidden="true" />
            {t.hero.ctaWhatsapp}
          </Button>
        </>
      }
    />
  );
}
