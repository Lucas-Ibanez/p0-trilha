import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PrivacyPage } from "@/components/sections/privacy-page";
import { privacyPath } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

/* O slug em inglês só existe em /en; em /pt-br o caminho é /privacidade. */
export function generateStaticParams() {
  return [{ locale: "en" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "en") return {};
  const t = await getTranslations({ locale, namespace: "privacy" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: privacyPath.en,
      languages: { en: privacyPath.en, "pt-BR": privacyPath["pt-br"], "x-default": privacyPath.en },
    },
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (locale !== "en") notFound();
  setRequestLocale(locale);
  return <PrivacyPage />;
}
