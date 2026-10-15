import { getMeta } from "@/lib/evidence";
import { getSiteUrl } from "@/lib/site";

/**
 * JSON-LD `Organization` (docs/06 §10): só fatos. Sem aggregateRating, review ou qualquer dado
 * que o projeto não tenha. O repositório vem de evidence.json.
 */
export function OrganizationJsonLd() {
  const site = getSiteUrl();
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Hive",
    url: site,
    logo: `${site}/brand/app-icons/icon-512.png`,
    sameAs: [getMeta().repoUrl],
  };

  // `<` escapado para o JSON nunca fechar a tag <script>.
  const json = JSON.stringify(data).replace(/</g, "\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
