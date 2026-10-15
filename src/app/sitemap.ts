import type { MetadataRoute } from "next";
import { privacyPath } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/site";

/** Uma entrada por idioma, cada uma apontando para as alternativas (hreflang). */
export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSiteUrl();
  const languages = {
    en: `${site}/en`,
    "pt-BR": `${site}/pt-br`,
    "x-default": `${site}/en`,
  };

  const privacyLanguages = {
    en: `${site}${privacyPath.en}`,
    "pt-BR": `${site}${privacyPath["pt-br"]}`,
    "x-default": `${site}${privacyPath.en}`,
  };

  return [
    { url: `${site}/en`, alternates: { languages } },
    { url: `${site}/pt-br`, alternates: { languages } },
    { url: privacyLanguages.en, alternates: { languages: privacyLanguages } },
    { url: privacyLanguages["pt-BR"], alternates: { languages: privacyLanguages } },
  ];
}
