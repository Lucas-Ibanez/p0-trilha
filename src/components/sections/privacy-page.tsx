import { getLocale, getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import type { Locale } from "@/i18n/routing";
import { formatDate } from "@/lib/format";
import { richTags } from "@/lib/rich";

const sections = ["s1", "s2", "s3", "s4", "s5", "s6", "s7"] as const;

/** Data da última revisão do texto (ISO). Atualize junto com qualquer mudança em `privacy.*`. */
const UPDATED = "2026-10-15";

/**
 * Política de privacidade mínima (D9). Descreve só o que o site faz hoje, que é quase nada.
 * Rascunho visível: o texto precisa de revisão jurídica antes de a lista de espera abrir.
 * TODO(legal): controlador, base legal, retenção e canal de exclusão, quando houver coleta real.
 */
export async function PrivacyPage() {
  const t = await getTranslations("privacy");
  const locale = (await getLocale()) as Locale;

  return (
    <main id="content" className="bg-page text-primary">
      <div className="container-page py-[var(--section-y)]">
        <div className="mb-4">
          <Badge>{t("draft")}</Badge>
        </div>
        <h1 className="text-h1 max-w-[20ch] font-bold">{t("title")}</h1>
        <p className="text-caption text-secondary mt-4">
          {t("updated", { date: formatDate(UPDATED, locale) })}
        </p>

        <div className="mt-12 space-y-10">
          {sections.map((section) => (
            <section key={section} aria-labelledby={`privacy-${section}`}>
              <h2 id={`privacy-${section}`} className="text-h3 font-semibold">
                {t(`${section}.title`)}
              </h2>
              <p className="measure mt-3">{t.rich(`${section}.body`, richTags)}</p>
            </section>
          ))}
        </div>

        <div className="mt-12">
          <ButtonLink href={`/${locale}`} variant="secondary">
            {t("back")}
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
