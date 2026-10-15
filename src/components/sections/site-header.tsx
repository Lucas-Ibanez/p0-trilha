import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { LanguageSwitch } from "@/components/ui/language-switch";
import { Link } from "@/i18n/navigation";
import { logo } from "@/lib/brand";

const LOGO_WIDTH = 140;

export async function SiteHeader() {
  const t = await getTranslations();

  return (
    <header data-surface="aubergine" className="bg-page text-primary">
      <a
        href="#content"
        className="rounded-control focus:bg-action focus:text-on-action sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2"
      >
        {t("a11y.skip")}
      </a>
      <p className="border-soft text-caption text-secondary border-b py-2 text-center">
        {t("env.banner")}
      </p>
      <div className="container-page flex items-center justify-between py-4">
        <Link href="/" className="inline-flex">
          <Image
            src={logo.horizontal.onAubergineWarmWhite}
            alt={t("brand.logoAlt")}
            width={LOGO_WIDTH}
            height={Math.round(LOGO_WIDTH / logo.horizontal.ratio)}
            priority
            unoptimized
          />
        </Link>
        <LanguageSwitch />
      </div>
    </header>
  );
}
