import { getTranslations } from "next-intl/server";
import { Section, SectionTitle } from "@/components/ui/section";

const rows = ["r1", "r2", "r3"] as const;

export async function Decision() {
  const t = await getTranslations("decision");

  return (
    <Section id="decision" labelledBy="decision-title">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionTitle id="decision-title">{t("title")}</SectionTitle>
          <p className="measure text-body mt-6">{t("body")}</p>
          <p className="measure text-body mt-4 font-semibold">{t("q")}</p>
        </div>

        <div className="lg:col-span-7">
          {/* md+: tabela real. Abaixo: lista de definições com a mesma relação linha/coluna. */}
          <table className="rounded-card border-soft hidden w-full border-separate border-spacing-0 overflow-hidden border text-left md:table">
            <caption className="sr-only">{t("table.caption")}</caption>
            <thead>
              <tr>
                <th scope="col" className="border-soft border-b p-4">
                  <span className="sr-only">{t("table.rowHeader")}</span>
                </th>
                <th scope="col" className="border-soft text-label border-b p-4 font-semibold">
                  {t("table.col1")}
                </th>
                <th
                  scope="col"
                  className="border-soft bg-subtle text-label border-b p-4 font-semibold"
                >
                  {t("table.col2")}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row}>
                  <th scope="row" className="border-soft border-b p-4 font-semibold">
                    {t(`table.${row}.q`)}
                  </th>
                  <td className="border-soft text-secondary border-b p-4">{t(`table.${row}.a`)}</td>
                  <td className="border-soft bg-subtle border-b p-4">{t(`table.${row}.b`)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <ul className="space-y-4 md:hidden">
            {rows.map((row) => (
              <li key={row} className="rounded-card border-soft bg-card border p-4">
                <h3 className="text-h4 font-semibold">{t(`table.${row}.q`)}</h3>
                <dl className="mt-3 space-y-3">
                  <div>
                    <dt className="text-caption text-secondary">{t("table.col1")}</dt>
                    <dd>{t(`table.${row}.a`)}</dd>
                  </div>
                  <div className="bg-subtle rounded-control p-3">
                    <dt className="text-caption">{t("table.col2")}</dt>
                    <dd>{t(`table.${row}.b`)}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
