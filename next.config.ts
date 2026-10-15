import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // `next dev` criaria um AGENTS.md; o ponto de entrada para agentes deste repositório é o CLAUDE.md.
  agentRules: false,
};

export default withNextIntl(nextConfig);
