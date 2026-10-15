import { expect, test } from "@playwright/test";

test("/ redireciona por Accept-Language e o cookie manual vence", async ({ browser }) => {
  const cases: [string, string][] = [
    ["en-US", "/en"],
    ["pt-BR", "/pt-br"],
    ["pt-PT", "/pt-br"],
    ["fr-FR", "/en"],
  ];
  for (const [language, expected] of cases) {
    // `locale` define o Accept-Language real do navegador (extraHTTPHeaders não vale na navegação).
    const context = await browser.newContext({ locale: language });
    const page = await context.newPage();
    await page.goto("/");
    expect(new URL(page.url()).pathname, `Accept-Language "${language}"`).toBe(expected);
    await context.close();
  }

  const context = await browser.newContext({ locale: "en-US" });
  await context.addCookies([{ name: "hive_lang", value: "pt-br", url: "http://localhost:3100" }]);
  const page = await context.newPage();
  await page.goto("/");
  expect(new URL(page.url()).pathname).toBe("/pt-br");
  await context.close();
});

test("trocar o idioma preserva a âncora e grava o cookie hive_lang", async ({ page, context }) => {
  await page.goto("/en#proof");
  const link = page.getByRole("link", { name: "Portuguese (Brazil)" });
  await expect(link).toHaveAttribute("href", "/pt-br#proof");
  await link.click();
  await expect(page).toHaveURL(/\/pt-br#proof$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");

  const cookie = (await context.cookies()).find((c) => c.name === "hive_lang");
  expect(cookie?.value).toBe("pt-br");
  expect(cookie?.sameSite).toBe("Lax");
});

test("EN e PT-BR trazem as mesmas seções e os mesmos links do Explorer, todos com cluster=devnet", async ({
  page,
}) => {
  const anchors: string[][] = [];
  const explorer: string[][] = [];
  for (const route of ["/en", "/pt-br"]) {
    await page.goto(route);
    anchors.push(await page.locator("main section[id]").evaluateAll((els) => els.map((e) => e.id)));
    explorer.push(
      await page
        .locator('a[href*="explorer.solana.com"]')
        .evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).href)),
    );
  }
  expect(anchors[0]).toEqual([
    "top",
    "decision",
    "how",
    "demo",
    "proof",
    "limits",
    "hive",
    "for",
    "join",
  ]);
  expect(anchors[1]).toEqual(anchors[0]);
  expect(explorer[0]).toEqual(explorer[1]);
  expect(explorer[0]?.length).toBeGreaterThanOrEqual(9);
  for (const href of explorer[0] ?? []) expect(href).toContain("cluster=devnet");
});
