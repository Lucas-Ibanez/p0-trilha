import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";
import { parseVideoUrl } from "./src/lib/demo";
import { demoVideoUrls } from "./src/lib/demo-videos";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/* Domínios de vídeo permitidos vêm das mesmas variáveis que alimentam a demo (docs/06 §7 e §10):
 * sem URL, nada de terceiros; com YouTube, só youtube-nocookie.com em frame-src; arquivos de vídeo
 * só da origem declarada em media-src. */
const demoSources = Object.values(demoVideoUrls)
  .map(parseVideoUrl)
  .filter((source) => source !== null);

const frameSrc = demoSources.some((source) => source.kind === "youtube")
  ? "https://www.youtube-nocookie.com"
  : "'none'";
const mediaSrc = [
  "'self'",
  ...new Set(
    demoSources.flatMap((source) => (source.kind === "file" ? [new URL(source.src).origin] : [])),
  ),
].join(" ");

/* 'unsafe-inline' em script-src: o Next injeta scripts inline de hidratação e, em páginas
 * estáticas, não há nonce por requisição. Todo o resto é fechado. */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  `frame-src ${frameSrc}`,
  `media-src ${mediaSrc}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // `next dev` criaria um AGENTS.md; o ponto de entrada para agentes deste repositório é o CLAUDE.md.
  agentRules: false,
  // CSS no <head> em vez de <link>: tira um round trip do caminho crítico (LCP). Tailwind gera pouco CSS (~7 KB).
  experimental: { inlineCss: true },
  async headers() {
    // Em desenvolvimento o React precisa de eval; a CSP vale só no build de produção.
    if (process.env.NODE_ENV !== "production") return [];
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default withNextIntl(nextConfig);
