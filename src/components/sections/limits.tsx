import { getTranslations } from "next-intl/server";
import { Section, SectionTitle } from "@/components/ui/section";

/** Limites da prova: seção nomeada e legível, não rodapé (CLAUDE.md, inegociável 6). */
export async function Limits() {
  const t = await getTranslations("limits");

  return (
    <Section id="limits" labelledBy="limits-title">
      <SectionTitle id="limits-title">{t("title")}</SectionTitle>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-card bg-subtle p-6">
          <h3 className="text-h3 font-semibold">{t("shows.title")}</h3>
          <p className="mt-3">{t("shows.body")}</p>
        </div>
        <div className="rounded-card bg-subtle p-6">
          <h3 className="text-h3 font-semibold">{t("notshows.title")}</h3>
          <p className="mt-3">{t("notshows.body")}</p>
        </div>
      </div>
      <p className="measure mt-6">{t("repro")}</p>
    </Section>
  );
}
