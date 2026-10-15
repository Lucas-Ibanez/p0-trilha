import { getLocale, getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/button-link";
import { LanguageSwitch } from "@/components/ui/language-switch";
import { MobileMenu } from "@/components/ui/mobile-menu";
import type { Locale } from "@/i18n/routing";
import { logo } from "@/lib/brand";

/* Mínimo da assinatura horizontal: 128 px (docs/04 §5). */
const LOGO_WIDTH = 128;

const sections = [
  { id: "how", key: "how" },
  { id: "demo", key: "demo" },
  { id: "proof", key: "proof" },
  { id: "hive", key: "hive" },
  { id: "for", key: "for" },
  { id: "faq", key: "faq" },
] as const;

export async function SiteHeader() {
  const t = await getTranslations();
  const locale = (await getLocale()) as Locale;

  const links = (
    <ul className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-6">
      {sections.map(({ id, key }) => (
        <li key={id}>
          <a
            href={`#${id}`}
            className="text-label text-secondary hover:text-primary inline-flex min-h-11 items-center font-semibold"
          >
            {t(`nav.${key}`)}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <header data-surface="aubergine" className="bg-page text-primary sticky top-0 z-40">
      <a
        href="#content"
        className="rounded-control focus:bg-action focus:text-on-action sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2"
      >
        {t("a11y.skip")}
      </a>
      <p className="border-soft text-caption text-secondary border-b px-4 py-1.5 text-center">
        {t("env.banner")}
      </p>
      <div className="container-page flex items-center gap-2 py-3 sm:gap-4">
        <a href={`/${locale}`} className="inline-flex shrink-0">
          {/* <img> simples: SVG já otimizado e com dimensões; evita o runtime do next/image no cliente. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logo.horizontal.onAubergineWarmWhite}
            alt={t("brand.logoAlt")}
            width={LOGO_WIDTH}
            height={Math.round(LOGO_WIDTH / logo.horizontal.ratio)}
          />
        </a>
        <nav aria-label={t("nav.label")} className="ml-4 hidden lg:block">
          {links}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden lg:block">
            <ButtonLink
              href="#join"
              variant="secondary"
              size="sm"
              trackEvent={{ name: "cta_waitlist_click" }}
            >
              {t("nav.cta")}
            </ButtonLink>
          </div>
          <LanguageSwitch
            current={locale}
            label={t("nav.langLabel")}
            names={{ en: t("nav.lang.enName"), "pt-br": t("nav.lang.ptName") }}
          />
          <MobileMenu label={t("nav.menu")}>
            <nav aria-label={t("nav.label")}>
              {links}
              <ButtonLink
                href="#join"
                variant="secondary"
                size="sm"
                className="mt-3"
                trackEvent={{ name: "cta_waitlist_click" }}
              >
                {t("nav.cta")}
              </ButtonLink>
            </nav>
          </MobileMenu>
        </div>
      </div>
    </header>
  );
}
