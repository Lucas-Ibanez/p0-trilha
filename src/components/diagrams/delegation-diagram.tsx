import { getLocale, getTranslations } from "next-intl/server";
import { HexCell } from "@/components/diagrams/hex-cell";
import { Mono } from "@/components/ui/figure-card";
import { Tabs, type TabItem } from "@/components/ui/tabs";
import type { Locale } from "@/i18n/routing";
import { getJournalExample, getJournalFields, getOutcomes, type OutcomeId } from "@/lib/evidence";

/**
 * Peça A (docs/05 §2): delegação, evidência e resultado, tudo com dados de evidence.json.
 * Movimento em CSS puro (globals.css, `.dd-*`), sem JS e só com prefers-reduced-motion:
 * no-preference; o estado base já é o frame final (~6 s), legível sem animação.
 * A célula é idêntica nos três desfechos: só o rótulo muda.
 */
export async function DelegationDiagram() {
  const t = await getTranslations("hero");
  const tOutcome = await getTranslations("outcome");
  const locale = (await getLocale()) as Locale;
  const outcomes = getOutcomes();
  const fields = getJournalFields();
  const example = getJournalExample();

  const items: TabItem[] = outcomes.map((outcome) => {
    const hasProof = outcome.requiresProof;
    const verdict = outcome.verdict;

    return {
      id: outcome.id satisfies OutcomeId,
      label: outcome.headline[locale],
      panel: (
        <div>
          {/* Cena base: duas células iguais e a seta de delegação (decorativa: o texto abaixo diz tudo). */}
          <svg viewBox="0 0 360 80" aria-hidden="true" className="mt-5 w-full">
            <HexCell cx={44} cy={40} r={30} />
            <HexCell cx={316} cy={40} r={30} />
            <path
              d="M84 40H262"
              pathLength={1}
              strokeWidth={3}
              strokeLinecap="round"
              fill="none"
              className="dd-line stroke-primary"
            />
            <path d="M262 32L276 40L262 48Z" className="dd-line-head fill-primary" />
            <circle cx={84} cy={40} r={5} className="dd-dot fill-action" />
          </svg>
          <div className="text-label flex justify-between font-semibold">
            <span>{t("fig.delegates")}</span>
            <span>{t("fig.executes")}</span>
          </div>

          <p className="dd-task text-label mt-4">{t("fig.task")}</p>

          <dl className="mt-4 space-y-4">
            <div className="dd-spec">
              <dt className="text-caption text-secondary">{t("fig.committed")}</dt>
              <dd className="mt-1">
                <Mono>{example.specHash.display}</Mono>
              </dd>
            </div>

            {hasProof ? (
              <div className="dd-card rounded-control border-soft border p-3">
                <dt className="text-caption text-secondary">{t("fig.evidence")}</dt>
                <dd className="mt-2 flex flex-wrap gap-1.5">
                  {fields.map((field, index) => (
                    <span
                      key={field.name}
                      className="dd-field rounded-control border-soft font-mono text-caption border px-2 py-0.5"
                      style={{ "--i": index } as React.CSSProperties}
                    >
                      {field.name}
                    </span>
                  ))}
                </dd>
              </div>
            ) : (
              <div className="dd-card">
                <dt className="text-caption text-secondary">{t("fig.evidence")}</dt>
                <dd className="text-caption mt-1">{tOutcome("verifierNo")}</dd>
              </div>
            )}

            <div className="dd-result">
              <dt className="text-caption text-secondary">{t("fig.result")}</dt>
              <dd className="mt-1">
                <span className="text-h4 font-semibold">
                  {outcome.headline[locale]}
                  {verdict ? ` · ${verdict}` : null}
                </span>
                <span className="mt-1 block">{outcome.result[locale]}</span>
              </dd>
            </div>
          </dl>
        </div>
      ),
    };
  });

  return (
    <figure className="rounded-card border-soft bg-card border p-5 md:p-6">
      <Tabs items={items} ariaLabel={t("fig.states")} variant="segmented" />
      <figcaption className="text-caption text-secondary mt-6">{t("caption")}</figcaption>
    </figure>
  );
}
