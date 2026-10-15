import type { Metadata } from "next";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SiteFooter } from "@/components/sections/site-footer";
import { SiteHeader } from "@/components/sections/site-header";
import { htmlLang, isLocale, routing } from "@/i18n/routing";
import { themeColor } from "@/lib/theme-color";
import "@/styles/globals.css";

/* Só o subconjunto latin: cobre EN e PT-BR (acentos em U+00C0–00FF). */
const manrope = localFont({
  src: "../../../public/brand/fonts/manrope-wght-latin.woff2",
  weight: "200 800",
  variable: "--font-manrope",
  display: "swap",
});

/* Mono só para identificadores técnicos; não é pré-carregada (não entra no hero). */
const plexMono = localFont({
  src: [
    { path: "../../../public/brand/fonts/ibm-plex-mono-400-latin.woff2", weight: "400" },
    { path: "../../../public/brand/fonts/ibm-plex-mono-500-latin.woff2", weight: "500" },
  ],
  variable: "--font-plex-mono",
  display: "swap",
  preload: false,
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: "meta" });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return {
    ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        "pt-BR": "/pt-br",
        "x-default": "/en",
      },
    },
  };
}

export const viewport = {
  themeColor,
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={htmlLang[locale]} className={`${manrope.variable} ${plexMono.variable}`}>
      <body>
        <NextIntlClientProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
