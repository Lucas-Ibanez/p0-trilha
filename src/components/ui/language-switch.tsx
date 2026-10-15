"use client";

import { useEffect, useState } from "react";
import {
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  localeCode,
  routing,
  type Locale,
} from "@/i18n/routing";
import { track } from "@/lib/track";

type Props = {
  current: Locale;
  label: string;
  /** Nome de cada idioma, já traduzido (ex.: "English", "Portuguese (Brazil)"). */
  names: Record<Locale, string>;
};

/**
 * Troca de idioma preservando a âncora (`#proof`) da URL atual. Navegação comum (as duas rotas
 * são estáticas), sem o runtime de navegação do next-intl no navegador.
 */
export function LanguageSwitch({ current, label, names }: Props) {
  const [hash, setHash] = useState("");

  useEffect(() => {
    const read = () => setHash(window.location.hash);
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  return (
    <nav aria-label={label}>
      <ul className="flex items-center gap-1 text-label font-semibold">
        {routing.locales.map((locale) => {
          const active = locale === current;
          const lang = locale === "pt-br" ? "pt-BR" : locale;
          return (
            <li key={locale}>
              <a
                href={`/${locale}${hash}`}
                lang={lang}
                hrefLang={lang}
                aria-label={`${localeCode[locale]}, ${names[locale]}`}
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
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
