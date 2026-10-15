import { getLocale, getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/button-link";

/** 404 localizado, dentro do layout (cabeçalho, faixa de ambiente e rodapé). */
export default async function NotFound() {
  const t = await getTranslations("notFound");
  const locale = await getLocale();

  return (
    <main id="content" data-surface="aubergine" className="bg-page text-primary">
      <div className="container-page py-[var(--section-y)]">
        <h1 className="text-h2 max-w-[24ch] font-semibold">{t("title")}</h1>
        <p className="measure text-body text-secondary mt-4">{t("body")}</p>
        <div className="mt-8">
          <ButtonLink href={`/${locale}`}>{t("back")}</ButtonLink>
        </div>
      </div>
    </main>
  );
}
