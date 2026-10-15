import { getTranslations } from "next-intl/server";
import { DelegationDiagram } from "@/components/diagrams/delegation-diagram";
import { ButtonLink } from "@/components/ui/button-link";
import { ExplorerLink } from "@/components/ui/explorer-link";
import { getOutcome } from "@/lib/evidence";

export async function Hero() {
  const t = await getTranslations("hero");
  const released = getOutcome("released");

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      data-surface="aubergine"
      className="bg-page text-primary"
    >
      <div className="container-page grid gap-12 py-[var(--section-y)] lg:grid-cols-[1fr_minmax(0,28rem)] lg:items-center">
        <div>
          <p className="text-label text-secondary font-semibold">{t("eyebrow")}</p>
          <h1 id="hero-title" className="text-h1 mt-4 max-w-[16ch] font-bold">
            {t("title")}
          </h1>
          <p className="measure text-body text-secondary mt-6">{t("sub")}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="#demo" trackEvent={{ name: "cta_demo_click" }}>
              {t("ctaDemo")}
            </ButtonLink>
            <ButtonLink
              href="#join"
              variant="secondary"
              trackEvent={{ name: "cta_waitlist_click" }}
            >
              {t("ctaWaitlist")}
            </ButtonLink>
          </div>
          <p className="text-label mt-6">
            <ExplorerLink href={released.txUrl} explorerId={released.id}>
              {t("proofLink")}
            </ExplorerLink>
          </p>
        </div>

        <DelegationDiagram />
      </div>
    </section>
  );
}
