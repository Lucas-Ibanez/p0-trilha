import { getTranslations } from "next-intl/server";
import { Section, SectionTitle } from "@/components/ui/section";

const profiles = ["a", "b"] as const;

export async function Audience() {
  const t = await getTranslations("for");

  return (
    <Section id="for" labelledBy="for-title">
      <SectionTitle id="for-title">{t("title")}</SectionTitle>

      <ul className="mt-12 grid gap-6 md:grid-cols-2">
        {profiles.map((profile) => (
          <li key={profile} className="rounded-card border-soft bg-card border p-6">
            <h3 className="text-h3 font-semibold">{t(`${profile}.title`)}</h3>
            <p className="mt-3">{t(`${profile}.body`)}</p>
          </li>
        ))}
      </ul>

      <div className="rounded-card bg-subtle mt-6 p-6">
        <h3 className="text-h4 font-semibold">{t("fit.title")}</h3>
        <p className="measure mt-2">{t("fit.body")}</p>
      </div>
    </Section>
  );
}
