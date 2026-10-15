import { getTranslations, setRequestLocale } from "next-intl/server";
import { isLocale } from "@/i18n/routing";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ locale: string }> };

/* Fase 0: casca da página. As seções do mapa de docs/03 §1.1 entram na fase 1. */
export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("hero");

  return (
    <main id="content" data-surface="aubergine" className="bg-page text-primary">
      <section
        id="top"
        aria-labelledby="hero-title"
        className="container-page py-[var(--section-y)]"
      >
        <p className="text-label text-secondary font-semibold">{t("eyebrow")}</p>
        <h1 id="hero-title" className="text-h1 mt-4 max-w-[20ch] font-bold">
          {t("title")}
        </h1>
        <p className="measure text-body text-secondary mt-6">{t("sub")}</p>
      </section>
    </main>
  );
}
