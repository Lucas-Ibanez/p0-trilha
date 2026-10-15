import { defineConfig } from "@playwright/test";

/* Roda contra o build de produção: `npm run build && npm run test:e2e`.
 * PW_CHANNEL escolhe o navegador instalado (msedge, chrome); nenhum navegador é baixado. */
const PORT = 3100;

export default defineConfig({
  testDir: "e2e",
  timeout: 30_000,
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    channel: process.env.PW_CHANNEL ?? "msedge",
  },
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}/en`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
