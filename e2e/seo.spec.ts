import { expect, test } from "@playwright/test";
import { collectConsole, routes } from "./helpers";

for (const route of routes) {
  const locale = route === "/en" ? "en" : "pt-br";
  const htmlLang = locale === "en" ? "en" : "pt-BR";

  test.describe(route, () => {
    test("metadata, OG, hreflang, canonical, theme-color e console limpo", async ({
      page,
      request,
    }) => {
      const problems = collectConsole(page);
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);

      await expect(page.locator("html")).toHaveAttribute("lang", htmlLang);
      await expect(page.locator("h1")).toHaveCount(1);
      expect((await page.title()).length).toBeGreaterThan(10);

      const meta = (selector: string) => page.locator(selector).first().getAttribute("content");
      expect(await meta('meta[name="description"]')).toBeTruthy();
      expect(await meta('meta[name="theme-color"]')).toBe("#392D40");
      expect(await meta('meta[property="og:image"]')).toContain(`/og/og-${locale}.png`);
      expect(await meta('meta[property="og:image:width"]')).toBe("1200");
      expect(await meta('meta[property="og:image:height"]')).toBe("630");
      expect(await meta('meta[property="og:image:alt"]')).toBeTruthy();
      expect(await meta('meta[name="twitter:card"]')).toBe("summary_large_image");
      expect(await meta('meta[property="og:locale"]')).toBe(locale === "en" ? "en_US" : "pt_BR");

      const alternates = await page
        .locator('link[rel="alternate"][hreflang]')
        .evaluateAll((links) =>
          links.map(
            (link) =>
              `${link.getAttribute("hreflang")}=${new URL((link as HTMLLinkElement).href).pathname}`,
          ),
        );
      expect(alternates.sort()).toEqual(["en=/en", "pt-BR=/pt-br", "x-default=/en"]);
      const canonical = (await page.locator('link[rel="canonical"]').getAttribute("href")) ?? "";
      expect(new URL(canonical).pathname).toBe(route);

      // A imagem OG e os ícones existem.
      for (const path of [
        `/og/og-${locale}.png`,
        "/brand/hive-favicon-amber.svg",
        "/brand/app-icons/apple-touch-icon.png",
        "/favicon.ico",
      ]) {
        expect((await request.get(path)).status(), path).toBe(200);
      }
      expect(problems).toEqual([]);
    });

    test("JSON-LD Organization só com fatos", async ({ page }) => {
      await page.goto(route);
      const raw = await page.locator('script[type="application/ld+json"]').textContent();
      const data = JSON.parse(raw ?? "{}");
      expect(data["@type"]).toBe("Organization");
      expect(data.name).toBe("Hive");
      expect(Object.keys(data).sort()).toEqual([
        "@context",
        "@type",
        "logo",
        "name",
        "sameAs",
        "url",
      ]);
      expect(data.sameAs).toEqual(["https://github.com/Lucas-Ibanez/colosseum-hackathon-sparta"]);
    });
  });
}

test("headers de segurança e CSP", async ({ request }) => {
  const response = await request.get("/en");
  const headers = response.headers();
  const csp = headers["content-security-policy"] ?? "";
  expect(csp).toContain("default-src 'self'");
  expect(csp).toContain("frame-ancestors 'none'");
  expect(csp).toContain("object-src 'none'");
  // Vídeos oficiais do YouTube (D6): só o domínio sem cookies e só em frame-src.
  expect(csp).toContain("frame-src https://www.youtube-nocookie.com");
  expect(csp).not.toMatch(/unsafe-eval/);
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["permissions-policy"]).toContain("camera=()");
  expect(headers["x-powered-by"]).toBeUndefined();
});

test("robots.txt e sitemap.xml", async ({ request }) => {
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Allow: /");
  expect(robots).toMatch(/Sitemap: https?:\/\/.+\/sitemap\.xml/);

  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toMatch(/<loc>https?:\/\/[^<]+\/en<\/loc>/);
  expect(sitemap).toMatch(/<loc>https?:\/\/[^<]+\/pt-br<\/loc>/);
  expect(sitemap).toContain('hreflang="pt-BR"');
  expect(sitemap).toContain('hreflang="x-default"');
  expect(sitemap).toMatch(/<loc>https?:\/\/[^<]+\/en\/privacy<\/loc>/);
  expect(sitemap).toMatch(/<loc>https?:\/\/[^<]+\/pt-br\/privacidade<\/loc>/);
});

test.describe("política de privacidade (D9)", () => {
  for (const [path, locale, title] of [
    ["/en/privacy", "en", "Privacy"],
    ["/pt-br/privacidade", "pt-BR", "Privacidade"],
  ] as const) {
    test(`${path}: rascunho visível, hreflang cruzado e sem coleta prometida`, async ({ page }) => {
      const problems = collectConsole(page);
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.locator("h1")).toHaveText(title);
      await expect(page.locator("main")).toContainText(
        locale === "en" ? "pending legal review" : "pendente de revisão jurídica",
      );
      await expect(page.locator("h2")).toHaveCount(7);
      const alternates = await page
        .locator('link[rel="alternate"][hreflang]')
        .evaluateAll((links) =>
          links.map(
            (l) => `${l.getAttribute("hreflang")}=${new URL((l as HTMLLinkElement).href).pathname}`,
          ),
        );
      expect(alternates.sort()).toEqual([
        "en=/en/privacy",
        "pt-BR=/pt-br/privacidade",
        "x-default=/en/privacy",
      ]);
      expect(problems).toEqual([]);
    });
  }

  test("o slug de um idioma não existe no outro", async ({ request }) => {
    expect((await request.get("/en/privacidade")).status()).toBe(404);
    expect((await request.get("/pt-br/privacy")).status()).toBe(404);
  });

  test("rodapé e consentimento do formulário apontam para a política do idioma", async ({
    page,
  }) => {
    await page.goto("/pt-br");
    await expect(page.locator("footer a[href='/pt-br/privacidade']")).toHaveCount(1);
    const consent = page.locator("#join form a[href='/pt-br/privacidade']");
    await expect(consent).toHaveAttribute("target", "_blank");
    await expect(consent).toHaveAttribute("rel", /noopener/);
  });
});

test("404 localizado dentro do layout", async ({ page }) => {
  const response = await page.goto("/pt-br/nao-existe");
  expect(response?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveText("Esta página não existe");
  await expect(page.locator("header")).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
});
