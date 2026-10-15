import { defineRouting } from "next-intl/routing";

export const LOCALE_COOKIE = "hive_lang";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const routing = defineRouting({
  locales: ["en", "pt-br"],
  defaultLocale: "en",
  localePrefix: "always",
  localeCookie: {
    name: LOCALE_COOKIE,
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: "lax",
  },
});

export type Locale = (typeof routing.locales)[number];

export function isLocale(value: string): value is Locale {
  return (routing.locales as readonly string[]).includes(value);
}

/** Valor do atributo `lang` do HTML (BCP 47) para cada rota. */
export const htmlLang: Record<Locale, string> = {
  en: "en",
  "pt-br": "pt-BR",
};

/** Rótulo curto do seletor de idioma (códigos, não texto traduzível). */
export const localeCode: Record<Locale, string> = {
  en: "EN",
  "pt-br": "PT",
};
