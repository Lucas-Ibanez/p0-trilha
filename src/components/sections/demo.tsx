import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/button-link";
import { Section, SectionTitle } from "@/components/ui/section";
import { logo } from "@/lib/brand";

/* URLs vêm do ambiente (docs/06 §7). Sem URL → estado "em breve", nunca um player falso. */
const slots = [
  { id: "technical", url: process.env.NEXT_PUBLIC_DEMO_TECHNICAL_URL },
  { id: "pitch", url: process.env.NEXT_PUBLIC_DEMO_PITCH_URL },
  { id: "full", url: process.env.NEXT_PUBLIC_DEMO_FULL_URL },
] as const;

const SYMBOL_WIDTH = 56;

export async function Demo() {
  const t = await getTranslations("demo");

  return (
    <Section id="demo" labelledBy="demo-title" surface="aubergine">
      <SectionTitle id="demo-title">{t("title")}</SectionTitle>
      <p className="measure text-body text-secondary mt-6">{t("body")}</p>

      <ul className="mt-12 grid gap-6 md:grid-cols-3">
        {slots.map(({ id, url }) => (
          <li key={id} className="rounded-card border-soft bg-card border p-4">
            {/* Pôster provisório: sem captura real da interface ainda (TODO(content)). */}
            <div className="rounded-control bg-subtle flex aspect-video items-center justify-center">
              <Image
                src={logo.symbol.onAubergineWarmWhite}
                alt=""
                aria-hidden="true"
                width={SYMBOL_WIDTH}
                height={Math.round(SYMBOL_WIDTH / logo.symbol.ratio)}
                unoptimized
              />
            </div>
            <h3 className="text-h4 mt-4 font-semibold">{t(id)}</h3>
            {url ? (
              <ButtonLink
                href={url}
                variant="secondary"
                size="sm"
                className="mt-3"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("play")}
                <span className="sr-only"> ({t(id)})</span>
              </ButtonLink>
            ) : (
              <p className="text-secondary mt-1">{t("soon")}</p>
            )}
            <p className="text-caption text-secondary mt-1">{t("lang")}</p>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <ButtonLink href="#join" variant="secondary">
          {t("cta")}
        </ButtonLink>
      </div>
    </Section>
  );
}
