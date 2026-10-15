import { getLocale, getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/button-link";
import { ExplorerLink } from "@/components/ui/explorer-link";
import { FigureRow, Mono } from "@/components/ui/figure-card";
import type { Locale } from "@/i18n/routing";
import { getJournalExample, getOutcome } from "@/lib/evidence";

export async function Hero() {
  const t = await getTranslations("hero");
  const locale = (await getLocale()) as Locale;
  const released = getOutcome("released");
  const example = getJournalExample();

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      data-surface="aubergine"
      className="bg-page text-primary"
    >
      <div className="container-page grid gap-12 py-[var(--section-y)] lg:grid-cols-[1fr_minmax(0,26rem)] lg:items-center">
        <div>
          <p className="text-label text-secondary font-semibold">{t("eyebrow")}</p>
          <h1 id="hero-title" className="text-h1 mt-4 max-w-[16ch] font-bold">
            {t("title")}
          </h1>
          <p className="measure text-body text-secondary mt-6">{t("sub")}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="#demo">{t("ctaDemo")}</ButtonLink>
            <ButtonLink href="#join" variant="secondary">
              {t("ctaWaitlist")}
            </ButtonLink>
          </div>
          <p className="text-label mt-6">
            <ExplorerLink href={released.txUrl}>{t("proofLink")}</ExplorerLink>
          </p>
        </div>

        {/* Quadro estático: o diagrama de delegação animado entra na fase 2 (docs/05 §2). */}
        <figure className="rounded-card border-soft bg-card border p-6">
          <div className="text-label flex items-center gap-3 font-semibold">
            <span className="rounded-control border-soft border px-3 py-2">
              {t("fig.delegates")}
            </span>
            <span aria-hidden="true">→</span>
            <span className="rounded-control border-soft border px-3 py-2">
              {t("fig.executes")}
            </span>
          </div>
          <dl className="mt-6">
            <FigureRow label={t("fig.committed")}>
              <Mono>{example.specHash.display}</Mono>
            </FigureRow>
            <FigureRow label={t("fig.result")}>
              <span className="text-h4 font-semibold">
                {released.headline[locale]} · {example.verdict}
              </span>
            </FigureRow>
          </dl>
          <figcaption className="text-caption text-secondary mt-6">{t("caption")}</figcaption>
        </figure>
      </div>
    </section>
  );
}
