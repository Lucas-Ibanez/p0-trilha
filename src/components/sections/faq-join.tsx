import { getTranslations } from "next-intl/server";
import { WaitlistForm } from "@/components/sections/waitlist-form";
import { ButtonLink } from "@/components/ui/button-link";
import { Section, SectionTitle } from "@/components/ui/section";
import { getConstants } from "@/lib/evidence";
import { richTags } from "@/lib/rich";

const questions = ["mainnet", "decides", "correct", "ci", "proof", "rails"] as const; // claims-allow: mainnet (id de pergunta, não texto)

export async function FaqJoin() {
  const t = await getTranslations("faq");
  const tJoin = await getTranslations("join");
  const { provingSeconds } = getConstants();

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
            <WaitlistForm />
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
