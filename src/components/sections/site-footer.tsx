import { getTranslations } from "next-intl/server";
import { ExternalLink } from "@/components/ui/external-link";
import { getMeta, getPrograms } from "@/lib/evidence";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const { repoUrl } = getMeta();
  const { escrow } = getPrograms();

  return (
    <footer data-surface="aubergine" className="bg-page text-primary">
      <div className="container-page text-caption grid gap-6 py-12 md:grid-cols-[1fr_auto]">
        <div className="space-y-2">
          <p className="text-h4 font-semibold">{t("signature")}</p>
          <p className="text-secondary">{t("env")}</p>
          <p className="text-secondary">
            {t.rich("legacy", { code: (chunks) => <code className="font-mono">{chunks}</code> })}
          </p>
          <p className="text-secondary">{t("license")}</p>
          <p className="text-secondary">{t("built")}</p>
        </div>
        <nav aria-label={t("links.label")}>
          <ul className="space-y-2">
            <li>
              <ExternalLink href={repoUrl} className="underline underline-offset-4">
                {t("links.code")}
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href={escrow.addressUrl} className="underline underline-offset-4">
                {t("links.explorer")}
              </ExternalLink>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
