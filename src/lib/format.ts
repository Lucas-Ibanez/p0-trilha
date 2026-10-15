import { htmlLang, type Locale } from "@/i18n/routing";

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(htmlLang[locale]).format(value);
}

/** Aceita datas ISO `YYYY-MM-DD`; interpreta em UTC para não deslocar o dia. */
export function formatDate(isoDate: string, locale: Locale): string {
  return new Intl.DateTimeFormat(htmlLang[locale], {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T00:00:00Z`));
}
