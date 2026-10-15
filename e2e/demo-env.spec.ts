import { expect, test } from "@playwright/test";

/**
 * Só roda quando o build e o teste recebem as URLs de vídeo, por exemplo:
 *   NEXT_PUBLIC_DEMO_TECHNICAL_URL=https://www.youtube.com/watch?v=aqz-KE-bpKQ \
 *   NEXT_PUBLIC_DEMO_PITCH_URL=https://example.com/media/pitch.mp4 \
 *   NEXT_PUBLIC_DEMO_FULL_URL=https://vimeo.com/123456 \
 *   npm run build && npm run test:e2e -- demo-env
 * Verifica o click-to-load e que a CSP (gerada das mesmas variáveis) deixa o vídeo carregar.
 */
const configured = Boolean(
  process.env.NEXT_PUBLIC_DEMO_TECHNICAL_URL &&
  process.env.NEXT_PUBLIC_DEMO_PITCH_URL &&
  process.env.NEXT_PUBLIC_DEMO_FULL_URL,
);
test.skip(!configured, "defina NEXT_PUBLIC_DEMO_*_URL no build e no teste");

test("CSP libera só o que a demo usa e o vídeo só carrega depois do clique", async ({
  page,
  request,
}) => {
  const csp = (await request.get("/en")).headers()["content-security-policy"] ?? "";
  expect(csp).toContain("frame-src https://www.youtube-nocookie.com");
  expect(csp).toMatch(/media-src 'self' https:\/\/example\.com/);

  const violations: string[] = [];
  page.on("console", (message) => {
    if (/Content Security Policy|Refused to/i.test(message.text())) violations.push(message.text());
  });
  const thirdParty: string[] = [];
  page.on("request", (req) => {
    if (/youtube|ytimg|googlevideo/.test(req.url())) thirdParty.push(req.url());
  });

  await page.goto("/en");
  await page.waitForLoadState("networkidle");
  await expect(page.locator("#demo iframe, #demo video")).toHaveCount(0);
  expect(thirdParty).toEqual([]);

  const items = page.locator("#demo li");
  await items.nth(0).getByRole("button", { name: /Play/ }).click();
  const iframe = items.nth(0).locator("iframe");
  await expect(iframe).toHaveAttribute(
    "src",
    /^https:\/\/www\.youtube-nocookie\.com\/embed\/aqz-KE-bpKQ\?autoplay=1/,
  );
  await expect(iframe).toHaveAttribute("referrerpolicy", "strict-origin-when-cross-origin");

  await items.nth(1).getByRole("button", { name: /Play/ }).click();
  const video = items.nth(1).locator("video");
  await expect(video).toHaveAttribute("preload", "none");
  await expect(video).toHaveAttribute("src", "https://example.com/media/pitch.mp4");

  const link = items.nth(2).getByRole("link", { name: /Play/ });
  await expect(link).toHaveAttribute("rel", /noopener/);
  await expect(link).toHaveAttribute("href", "https://vimeo.com/123456");

  await page.waitForTimeout(1500);
  expect(violations).toEqual([]);
});
