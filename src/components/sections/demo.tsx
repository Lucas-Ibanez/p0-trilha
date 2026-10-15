import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/button-link";
import { Section, SectionTitle } from "@/components/ui/section";
import { VideoSlot } from "@/components/ui/video-slot";
import { parseVideoUrl } from "@/lib/demo";

/* URLs vêm do ambiente (docs/06 §7). Sem URL → estado "em breve", nunca um player falso.
 * Cada variável precisa ser lida por extenso para o Next embutir o valor no build. */
const slots = [
  { id: "technical", url: process.env.NEXT_PUBLIC_DEMO_TECHNICAL_URL },
  { id: "pitch", url: process.env.NEXT_PUBLIC_DEMO_PITCH_URL },
  { id: "full", url: process.env.NEXT_PUBLIC_DEMO_FULL_URL },
] as const;

export async function Demo() {
  const t = await getTranslations("demo");
  const tA11y = await getTranslations("a11y");

  return (
    <Section id="demo" labelledBy="demo-title" surface="aubergine">
      <SectionTitle id="demo-title">{t("title")}</SectionTitle>
      <p className="measure text-body text-secondary mt-6">{t("body")}</p>

      <ul className="mt-12 grid gap-6 md:grid-cols-3">
        {slots.map(({ id, url }) => (
          <li key={id} className="rounded-card border-soft bg-card border p-4">
            <VideoSlot
              title={t(id)}
              source={parseVideoUrl(url)}
              labels={{
                soon: t("soon"),
                lang: t("lang"),
                play: t("play"),
                playAria: t("playAria", { title: t(id) }),
                newTab: tA11y("newTab"),
              }}
            />
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <ButtonLink href="#join" variant="secondary" trackEvent={{ name: "cta_waitlist_click" }}>
          {t("cta")}
        </ButtonLink>
      </div>
    </Section>
  );
}
