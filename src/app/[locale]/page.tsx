import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Audience } from "@/components/sections/audience";
import { Decision } from "@/components/sections/decision";
import { Demo } from "@/components/sections/demo";
import { FaqJoin } from "@/components/sections/faq-join";
import { Hero } from "@/components/sections/hero";
import { HiveVision } from "@/components/sections/hive-vision";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Limits } from "@/components/sections/limits";
import { Proof } from "@/components/sections/proof";
import { isLocale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

/* Ordem fixa das seções: docs/03 §1.1. Superfícies alternam berinjela e claro (docs/04 §2.2). */
export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  return (
    <main id="content">
      <Hero />
      <Decision />
      <HowItWorks />
      <Demo />
      <Proof />
      <Limits />
      <HiveVision />
      <Audience />
      <FaqJoin />
    </main>
  );
}
