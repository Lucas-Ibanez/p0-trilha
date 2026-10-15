import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/button-link";
import { LanguageSwitch } from "@/components/ui/language-switch";
import { MobileMenu } from "@/components/ui/mobile-menu";
import { Link } from "@/i18n/navigation";
import { logo } from "@/lib/brand";

const LOGO_WIDTH = 104;

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
      <div className="container-page flex items-center gap-2 py-2 sm:gap-4">
        <Link href="/" className="inline-flex shrink-0">
          <Image
            src={logo.horizontal.onAubergineWarmWhite}
            alt={t("brand.logoAlt")}
            width={LOGO_WIDTH}
            height={Math.round(LOGO_WIDTH / logo.horizontal.ratio)}
            priority
            unoptimized
          />
        </Link>
        <nav aria-label={t("nav.label")} className="ml-4 hidden lg:block">
          {links}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden lg:block">
            <ButtonLink href="#join" variant="secondary" size="sm">
              {t("nav.cta")}
            </ButtonLink>
          </div>
          <LanguageSwitch />
          <MobileMenu label={t("nav.menu")}>
            <nav aria-label={t("nav.label")}>
              {links}
              <ButtonLink href="#join" variant="secondary" size="sm" className="mt-3">
                {t("nav.cta")}
              </ButtonLink>
            </nav>
          </MobileMenu>
        </div>
      </div>
    </header>
  );
}
