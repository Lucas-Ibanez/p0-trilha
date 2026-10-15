import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/button-link";
import { Section, SectionTitle } from "@/components/ui/section";
import { VideoSlot } from "@/components/ui/video-slot";
import { parseVideoUrl } from "@/lib/demo";
import { demoVideoUrls } from "@/lib/demo-videos";

/* URLs: src/lib/demo-videos.ts (D6). Slot sem URL não é mostrado quando há ao menos um vídeo;
 * sem nenhum vídeo, os três aparecem como "em breve". Nunca um player falso. */
const slotIds = ["technical", "pitch", "full"] as const;

export async function Demo() {
  const t = await getTranslations("demo");
  const tA11y = await getTranslations("a11y");
  const tNav = await getTranslations("nav");

  const parsed = slotIds.map((id) => ({ id, source: parseVideoUrl(demoVideoUrls[id]) }));
  const live = parsed.filter((slot) => slot.source !== null);
  const slots = live.length > 0 ? live : parsed;

  return (
    <Section id="demo" labelledBy="demo-title" surface="aubergine">
      <SectionTitle id="demo-title">{t("title")}</SectionTitle>
      <p className="measure text-body text-secondary mt-6">{t("body")}</p>

      <ul
        className={`mt-12 grid gap-6 md:grid-cols-2 ${slots.length === 3 ? "lg:grid-cols-3" : ""}`}
      >
        {slots.map(({ id, source }) => (
          <li key={id} className="rounded-card border-soft bg-card border p-4">
            <VideoSlot
              title={t(id)}
              source={source}
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
          {live.length > 0 ? tNav("cta") : t("cta")}
        </ButtonLink>
      </div>
    </Section>
  );
}
