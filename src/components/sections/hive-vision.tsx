import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Section, SectionTitle } from "@/components/ui/section";

/* Seção inteira de classe Visão, exceto a frase-ponte aprovada (docs/02 §2).
 * O diagrama da colmeia (docs/05 §5) entra na fase 2; sem ele, não há legenda de ilustração. */
export async function HiveVision() {
  const t = await getTranslations("hive");

  return (
    <Section id="hive" labelledBy="hive-title" surface="aubergine">
      <div className="mb-4">
        <Badge>{t("badge")}</Badge>
      </div>
      <SectionTitle id="hive-title">{t("title")}</SectionTitle>
      <p className="measure text-h3 mt-8 font-semibold">{t("bridge")}</p>
      <p className="measure text-body text-secondary mt-6">{t("body")}</p>

      <div className="rounded-card border-soft mt-12 border p-6 md:p-8">
        <Badge>{t("planned.badge")}</Badge>
        <ul className="mt-4 grid gap-4 md:grid-cols-2 md:gap-8">
          <li>{t("planned.1")}</li>
          <li>{t("planned.2")}</li>
        </ul>
      </div>
    </Section>
  );
}
