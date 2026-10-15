/**
 * URL pública do site (canonical, hreflang, OG, sitemap, JSON-LD).
 * Ordem: NEXT_PUBLIC_SITE_URL → URL de produção/preview da Vercel → localhost.
 * TODO(brand): o domínio definitivo ainda não existe (D10); até lá o deploy da Vercel serve.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

/** Deploys de preview não devem ser indexados. */
export function isIndexable(): boolean {
  return process.env.VERCEL_ENV !== "preview";
}
