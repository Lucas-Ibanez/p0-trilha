"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import {
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  localeCode,
  routing,
  type Locale,
} from "@/i18n/routing";
import { track } from "@/lib/track";

/** Troca de idioma preservando a âncora (`#proof`) da URL atual. */
export function LanguageSwitch() {
  const t = useTranslations("nav");
  const current = useLocale() as Locale;
  const [hash, setHash] = useState("");

  useEffect(() => {
    const read = () => setHash(window.location.hash);
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  const names: Record<Locale, string> = {
    en: t("lang.enName"),
    "pt-br": t("lang.ptName"),
  };

  return (
    <nav aria-label={t("langLabel")}>
      <ul className="flex items-center gap-1 text-label font-semibold">
        {routing.locales.map((locale) => {
          const active = locale === current;
          return (
            <li key={locale}>
              <Link
                href={`/${hash}`}
                locale={locale}
                lang={locale === "pt-br" ? "pt-BR" : locale}
                hrefLang={locale === "pt-br" ? "pt-BR" : locale}
                aria-label={names[locale]}
                aria-current={active ? "true" : undefined}
                onClick={() => {
                  /* A escolha manual vale por 1 ano e vence a detecção por Accept-Language. */
                  document.cookie = `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=${LOCALE_COOKIE_MAX_AGE}; SameSite=Lax`;
                  track({ name: "language_switch", props: { to: locale } });
                }}
                className={
                  "rounded-control inline-flex min-h-11 min-w-11 items-center justify-center px-3 " +
                  (active ? "bg-subtle text-primary" : "text-secondary hover:text-primary")
                }
              >
                {localeCode[locale]}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
