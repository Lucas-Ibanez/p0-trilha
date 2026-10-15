import { getLocale, getTranslations } from "next-intl/server";
import { WaitlistForm, type WaitlistLabels } from "@/components/sections/waitlist-form";
import { ButtonLink } from "@/components/ui/button-link";
import { Section, SectionTitle } from "@/components/ui/section";
import { getConstants } from "@/lib/evidence";
import { privacyPath, type Locale } from "@/i18n/routing";
import { richTags } from "@/lib/rich";
import { USE_CASE_MAX, WAITLIST_MODE } from "@/lib/waitlist";

const questions = ["mainnet", "decides", "correct", "ci", "proof", "rails"] as const; // claims-allow: mainnet (id de pergunta, não texto)

export async function FaqJoin() {
  const t = await getTranslations("faq");
  const tJoin = await getTranslations("join");
  const tA11y = await getTranslations("a11y");
  const { provingSeconds } = getConstants();
  const locale = (await getLocale()) as Locale;
  const preview = WAITLIST_MODE === "preview";

  /* O formulário é cliente: recebe só as strings de que precisa, sem o runtime do next-intl. */
  const labels: WaitlistLabels = {
    preview: {
      badge: tJoin("preview.badge"),
      notice: tJoin("preview.notice"),
      successTitle: tJoin("preview.successTitle"),
      successBody: tJoin("preview.successBody"),
      reset: tJoin("preview.reset"),
    },
    noscript: tJoin("noscript"),
    email: tJoin("email.label"),
    company: tJoin("company.label"),
    segment: {
      label: tJoin("segment.label"),
      sh: tJoin("segment.sh"),
      jp: tJoin("segment.jp"),
      ot: tJoin("segment.ot"),
    },
    usecase: { label: tJoin("usecase.label"), hint: tJoin("usecase.hint", { max: USE_CASE_MAX }) },
    submit: tJoin("submit"),
    submitting: tJoin("submitting"),
    error: {
      summary: tJoin("error.summary"),
      generic: tJoin("error.generic"),
      email: tJoin("error.email"),
      segment: tJoin("error.segment"),
      // Em prévia nada é armazenado: o consentimento do texto final seria uma afirmação falsa.
      consent: preview ? tJoin("preview.consentError") : tJoin("error.consent"),
    },
  };

  return (
    <Section id="join" labelledBy="join-title">
      <div className="grid gap-12 lg:grid-cols-12">
        <div id="faq" className="lg:col-span-7">
          <SectionTitle id="faq-title">{t("title")}</SectionTitle>
          <div className="mt-8">
            {questions.map((id) => (
              <details key={id} className="border-soft group border-b first:border-t">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 font-semibold">
                  <span>{t(`${id}.q`)}</span>
                  <span aria-hidden="true" className="text-h4 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="measure pb-5">
                  {t.rich(`${id}.a`, {
                    ...richTags,
                    composite: provingSeconds.composite,
                    groth16: provingSeconds.groth16Compression,
                  })}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* Lista de espera só front-end (D2): ver src/lib/waitlist.ts. */}
        <div className="lg:col-span-5">
          <h2 id="join-title" className="text-h2 font-semibold">
            {tJoin("title")}
          </h2>
          <p className="measure mt-4">{tJoin("body")}</p>
          <div className="mt-6">
            <WaitlistForm
              labels={labels}
              locale={locale}
              consent={tJoin.rich(preview ? "preview.consent" : "consent", {
                policy: (chunks) => (
                  <a
                    href={privacyPath[locale]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold underline underline-offset-4"
                  >
                    {chunks}
                    <span className="sr-only"> ({tA11y("newTab")})</span>
                  </a>
                ),
              })}
            />
          </div>
          <div className="mt-6">
            <ButtonLink href="#demo" variant="secondary" trackEvent={{ name: "cta_demo_click" }}>
              {tJoin("watch")}
            </ButtonLink>
          </div>
        </div>
      </div>
    </Section>
  );
}
