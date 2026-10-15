import type { Metadata } from "next";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { OrganizationJsonLd } from "@/components/seo/json-ld";
import { ClickTracker } from "@/components/ui/click-tracker";
import { RevealObserver } from "@/components/ui/reveal-observer";
import { SiteFooter } from "@/components/sections/site-footer";
import { SiteHeader } from "@/components/sections/site-header";
import { htmlLang, isLocale, routing, type Locale } from "@/i18n/routing";
import { getSiteUrl, isIndexable } from "@/lib/site";
import { themeColor } from "@/lib/theme-color";
import "@/styles/globals.css";

/* Só o subconjunto latin: cobre EN e PT-BR (acentos em U+00C0–00FF). */
const manrope = localFont({
  src: "../../../public/brand/fonts/manrope-wght-latin.woff2",
  weight: "200 800",
  variable: "--font-manrope",
  display: "swap",
});

/* Mono só para identificadores técnicos (um único peso, 400); não é pré-carregada. */
const plexMono = localFont({
  src: "../../../public/brand/fonts/ibm-plex-mono-400-latin.woff2",
  weight: "400",
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

const ogLocale: Record<Locale, string> = { en: "en_US", "pt-br": "pt_BR" };

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: "meta" });
  const other = routing.locales.find((item) => item !== locale) ?? locale;
  const image = {
    url: `/og/og-${locale}.png`,
    width: 1200,
    height: 630,
    alt: t("og.alt"),
  };

  return {
    metadataBase: new URL(getSiteUrl()),
    title: t("title"),
    description: t("description"),
    ...(isIndexable() ? {} : { robots: { index: false, follow: false } }),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        "pt-BR": "/pt-br",
        "x-default": "/en",
      },
    },
    openGraph: {
      type: "website",
      siteName: "Hive",
      title: t("title"),
      description: t("description"),
      url: `/${locale}`,
      locale: ogLocale[locale],
      alternateLocale: [ogLocale[other]],
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [{ url: image.url, alt: image.alt }],
    },
    /* TODO(brand): favicon e app icon provisórios, derivados do símbolo (D10). */
    icons: {
      icon: [
        { url: "/brand/hive-favicon-amber.svg", type: "image/svg+xml" },
        { url: "/brand/app-icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      ],
      shortcut: "/favicon.ico",
      apple: [{ url: "/brand/app-icons/apple-touch-icon.png", sizes: "180x180" }],
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
        <SiteHeader />
        {children}
        <SiteFooter />
        <RevealObserver />
        <ClickTracker />
        <OrganizationJsonLd />
      </body>
    </html>
  );
}
