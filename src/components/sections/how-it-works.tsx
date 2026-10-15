import { getLocale, getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { ExplorerLink } from "@/components/ui/explorer-link";
import { FigureCard, FigureRow, Mono } from "@/components/ui/figure-card";
import { Section, SectionTitle } from "@/components/ui/section";
import type { Locale } from "@/i18n/routing";
import {
  getConstants,
  getFundingTxs,
  getJournalExample,
  getOutcome,
  getProvingNote,
} from "@/lib/evidence";
import { formatNumber } from "@/lib/format";

const steps = ["s1", "s2", "s3", "s4"] as const;
type Step = (typeof steps)[number];

export async function HowItWorks() {
  const t = await getTranslations("how");
  const tOutcome = await getTranslations("outcome");
  const locale = (await getLocale()) as Locale;

  const constants = getConstants();
  const example = getJournalExample();
  const funding = getFundingTxs();
  const released = getOutcome("released");
  const timeout = getOutcome("refundedOnTimeout");
  const slots = `${formatNumber(constants.deadlineSlotsMin, locale)}–${formatNumber(constants.deadlineSlotsMax, locale)}`;

  /* Figuras: fragmentos montados só com dados de evidence.json (docs/04 §7). */
  const figures: Record<Step, React.ReactNode> = {
    s1: (
      <dl>
        <FigureRow label={t("fig.spec")}>
          <Mono>{example.specHash.display}</Mono>
        </FigureRow>
        <FigureRow label={t("fig.deadline")}>
          <Mono>{slots}</Mono>
        </FigureRow>
        <FigureRow label={t("fig.funding")}>
          <ExplorerLink href={funding.U3?.txUrl ?? ""} />
        </FigureRow>
      </dl>
    ),
    s2: (
      <>
        <dl>
          <FigureRow label={t("fig.composite")}>
            {t("fig.compositeValue", { range: constants.provingSeconds.composite })}
          </FigureRow>
          <FigureRow label={t("fig.groth16")}>
            {t("fig.groth16Value", { range: constants.provingSeconds.groth16Compression })}
          </FigureRow>
        </dl>
        <p className="border-soft text-caption text-secondary mt-3 border-t pt-3">
          {getProvingNote(locale)}
        </p>
      </>
    ),
    s3: (
      <dl>
        <FigureRow label={t("fig.instructions")}>
          <Mono>{released.instructions.join(" → ")}</Mono>
        </FigureRow>
        <FigureRow label={tOutcome("state")}>
          <Mono>{released.state}</Mono>
        </FigureRow>
        <FigureRow label={t("fig.verifier")}>
          {tOutcome("verifierYes", {
            cu: formatNumber(released.verifierComputeUnits ?? 0, locale),
          })}
        </FigureRow>
      </dl>
    ),
    s4: (
      <dl>
        <FigureRow label={t("fig.instructions")}>
          <Mono>{timeout.instructions.join(" → ")}</Mono>
        </FigureRow>
        <FigureRow label={tOutcome("state")}>
          <Mono>{timeout.state}</Mono>
        </FigureRow>
        <FigureRow label={t("fig.verifier")}>{tOutcome("verifierNo")}</FigureRow>
      </dl>
    ),
  };

  return (
    <Section id="how" labelledBy="how-title">
      <div className="mb-4">
        <Badge>{t("badge")}</Badge>
      </div>
      <SectionTitle id="how-title">{t("title")}</SectionTitle>

      <ol className="mt-12 space-y-12 md:space-y-16">
        {steps.map((step, index) => (
          <li key={step} className="grid items-start gap-6 md:grid-cols-2 md:gap-12">
            <div>
              <p className="text-caption text-secondary font-semibold">
                {t("step", { n: index + 1 })}
              </p>
              <h3 className="text-h3 mt-2 font-semibold">{t(`${step}.title`)}</h3>
              <p className="measure mt-3">{t(`${step}.body`)}</p>
            </div>
            <FigureCard caption={t("caption")}>{figures[step]}</FigureCard>
          </li>
        ))}
      </ol>

      <p className="measure text-body mt-12 font-semibold">{t("note")}</p>
    </Section>
  );
}
