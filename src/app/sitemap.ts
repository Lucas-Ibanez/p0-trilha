import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

/** Uma entrada por idioma, cada uma apontando para as alternativas (hreflang). */
export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSiteUrl();
  const languages = {
    en: `${site}/en`,
    "pt-BR": `${site}/pt-br`,
    "x-default": `${site}/en`,
  };

  return [
    { url: `${site}/en`, alternates: { languages } },
    { url: `${site}/pt-br`, alternates: { languages } },
  ];
}
