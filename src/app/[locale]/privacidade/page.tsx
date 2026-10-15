import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PrivacyPage } from "@/components/sections/privacy-page";
import { privacyPath } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

/* O slug em português só existe em /pt-br; em /en o caminho é /privacy. */
export function generateStaticParams() {
  return [{ locale: "pt-br" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "pt-br") return {};
  const t = await getTranslations({ locale, namespace: "privacy" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: privacyPath["pt-br"],
      languages: { en: privacyPath.en, "pt-BR": privacyPath["pt-br"], "x-default": privacyPath.en },
    },
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (locale !== "pt-br") notFound();
  setRequestLocale(locale);
  return <PrivacyPage />;
}
