import { getLocale, getTranslations } from "next-intl/server";
import { CopyButton } from "@/components/ui/copy-button";
import { JournalCards } from "@/components/ui/journal-cards";
import { ExplorerLink } from "@/components/ui/explorer-link";
import { Mono } from "@/components/ui/figure-card";
import { Section, SectionTitle } from "@/components/ui/section";
import { Tabs, type TabItem } from "@/components/ui/tabs";
import type { Locale } from "@/i18n/routing";
import {
  getHeadlineNumbers,
  getJournalCards,
  getOutcome,
  getOutcomes,
  getRejectionNote,
  getRejections,
  getRunDate,
} from "@/lib/evidence";
import { formatDate, formatNumber } from "@/lib/format";

export async function Proof() {
  const t = await getTranslations("proof");
  const tCommon = await getTranslations("common");
  const tOutcome = await getTranslations("outcome");
  const locale = (await getLocale()) as Locale;

  const numbers = getHeadlineNumbers();
  const cards = getJournalCards();
  const released = getOutcome("released");
  const outcomes = getOutcomes();
  const rejections = getRejections();

  const stats = [
    { key: "n1", value: numbers.settledOutcomes },
    { key: "n2", value: numbers.rejectedAttempts },
    { key: "n3", value: numbers.verifierComputeUnits },
    { key: "n4", value: numbers.journalBytes },
  ] as const;

  const outcomeItems: TabItem[] = outcomes.map((outcome) => ({
    id: outcome.id,
    label: outcome.headline[locale],
    fallbackTitle: <h4 className="text-h4 font-semibold">{outcome.headline[locale]}</h4>,
    panel: (
      <div className="rounded-card border-soft bg-card border p-5 md:p-6">
        <p className="text-h4 font-semibold">{outcome.result[locale]}</p>
        <dl className="mt-4 grid gap-4 md:grid-cols-3">
          <div>
            <dt className="text-caption text-secondary">{tOutcome("state")}</dt>
            <dd>
              <Mono>{outcome.state}</Mono>
            </dd>
          </div>
          <div>
            <dt className="text-caption text-secondary">{tOutcome("instructions")}</dt>
            <dd>
              <Mono>{outcome.instructions.join(" → ")}</Mono>
            </dd>
          </div>
          <div>
            <dt className="text-caption text-secondary">{tOutcome("tx")}</dt>
            <dd>
              <p className="mb-1">
                {outcome.verifierInvoked
                  ? tOutcome("verifierYes", {
                      cu: formatNumber(outcome.verifierComputeUnits ?? 0, locale),
                    })
                  : tOutcome("verifierNo")}
              </p>
              <ExplorerLink href={outcome.txUrl} explorerId={outcome.id} />
            </dd>
          </div>
        </dl>
      </div>
    ),
  }));

  return (
    <Section id="proof" labelledBy="proof-title">
      <SectionTitle id="proof-title">{t("title")}</SectionTitle>
      <p className="measure text-body mt-6">
        {t("body", { date: formatDate(getRunDate(), locale) })}
      </p>

      <ul className="mt-12 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ key, value }) => (
          <li key={key} className="rounded-card border-soft bg-card border p-5">
            <p className="text-metric font-semibold tabular-nums">{formatNumber(value, locale)}</p>
            <p className="text-caption text-secondary mt-3">{t(key)}</p>
          </li>
        ))}
      </ul>

      <div className="mt-16">
        <h3 className="text-h3 font-semibold">{t("journal.title")}</h3>
        <p className="text-secondary mt-2">{t("journal.caption")}</p>

        <JournalCards
          cards={cards.map((card) => ({
            name: card.name,
            startsAt: t("journal.startsAt", { offset: card.offset }),
            bytes: card.bytes,
            display: card.isVerdict ? null : card.display,
            full: card.full,
            verdictLabel: card.isVerdict ? `${released.headline[locale]} · ${card.display}` : null,
            gloss: card.gloss[locale],
          }))}
          barLabel={t("journal.barLabel", { bytes: numbers.journalBytes })}
          noExample={t("journal.noExample")}
          fullInRepo={t("journal.fullInRepo")}
          copyLabel={tCommon("copy")}
          copiedLabel={tCommon("copied")}
          copyAriaTemplate={tCommon("copyValue", { name: "{name}" })}
        />
      </div>

      <div className="mt-16">
        <h3 className="text-h3 font-semibold">{t("outcomes.title")}</h3>
        <Tabs
          items={outcomeItems}
          ariaLabel={t("outcomes.tabsLabel")}
          variant="segmented"
          className="mt-6"
          panelsClassName="mt-4"
        />

        {/* Frase 1 (docs/02 §3): junto da verificação on-chain e do link de uma liquidação real. */}
        <p className="measure border-primary text-body mt-8 border-l-4 pl-4 font-semibold">
          {t("claim")}{" "}
          <ExplorerLink href={released.txUrl} explorerId={released.id} className="font-semibold">
            {t("claimLink")}
          </ExplorerLink>
        </p>
      </div>

      <div className="mt-16">
        <h3 className="text-h3 font-semibold">{t("rejections.title")}</h3>
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {rejections.map((rejection) => (
            <li key={rejection.id} className="rounded-card border-soft bg-card border p-5">
              <h4 className="text-h4 font-semibold">{rejection.title[locale]}</h4>
              <dl className="mt-3 space-y-3">
                <div>
                  <dt className="text-caption text-secondary">{t("rejections.by")}</dt>
                  <dd>
                    <Mono>{rejection.rejectedBy}</Mono>
                  </dd>
                </div>
                <div>
                  <dt className="text-caption text-secondary">{t("rejections.error")}</dt>
                  <dd className="flex flex-wrap items-center gap-2">
                    <Mono>
                      {rejection.name} ({rejection.code})
                    </Mono>
                    <CopyButton
                      value={rejection.name}
                      label={tCommon("copy")}
                      copiedLabel={tCommon("copied")}
                      ariaLabel={tCommon("copyValue", { name: rejection.name })}
                    />
                  </dd>
                </div>
              </dl>
              <p className="mt-4">
                <ExplorerLink href={rejection.txUrl} explorerId={rejection.id} />
              </p>
            </li>
          ))}
        </ul>
        <p className="text-secondary mt-4">{getRejectionNote(locale)}</p>
      </div>
    </Section>
  );
}
