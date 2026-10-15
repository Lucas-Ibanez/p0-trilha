import { expect, test } from "@playwright/test";
import { collectConsole, routes } from "./helpers";

for (const route of routes) {
  test.describe(route, () => {
    test("abas: clique, setas, Home/End e célula idêntica nos 3 desfechos", async ({ page }) => {
      const problems = collectConsole(page);
      await page.goto(route);

      const lists = page.getByRole("tablist");
      await expect(lists).toHaveCount(3);
      await expect(lists.nth(0)).toHaveAttribute("aria-orientation", "horizontal");
      await expect(lists.nth(1)).toHaveAttribute("aria-orientation", "vertical");

      // Hero: 3 desfechos.
      const heroTabs = lists.nth(0).getByRole("tab");
      await heroTabs.nth(1).click();
      await expect(heroTabs.nth(1)).toHaveAttribute("aria-selected", "true");
      await expect(heroTabs.nth(0)).toHaveAttribute("tabindex", "-1");

      // A célula (path do hexágono) é a mesma em todos os painéis.
      const hexPaths = await page
        .locator("#top [role=tabpanel] svg path:first-of-type")
        .evaluateAll((paths) => paths.map((p) => p.getAttribute("d")));
      expect(hexPaths).toHaveLength(3);
      expect(new Set(hexPaths).size).toBe(1);

      await heroTabs.nth(1).focus();
      await page.keyboard.press("ArrowRight");
      await expect(heroTabs.nth(2)).toBeFocused();
      await page.keyboard.press("ArrowRight");
      await expect(heroTabs.nth(0)).toBeFocused();
      await page.keyboard.press("End");
      await expect(heroTabs.nth(2)).toBeFocused();
      await page.keyboard.press("Home");
      await expect(heroTabs.nth(0)).toBeFocused();

      // Passos (vertical): setas verticais avançam; horizontais não.
      const stepTabs = lists.nth(1).getByRole("tab");
      await stepTabs.nth(0).focus();
      await page.keyboard.press("ArrowDown");
      await expect(stepTabs.nth(1)).toHaveAttribute("aria-selected", "true");
      await page.keyboard.press("ArrowRight");
      await expect(stepTabs.nth(1)).toHaveAttribute("aria-selected", "true");

      // Desfechos: a aba do prazo mostra o estado e o link devnet.
      const outcomeTabs = lists.nth(2).getByRole("tab");
      await outcomeTabs.nth(2).click();
      const panel = page.getByRole("tabpanel").filter({ hasText: "RefundedOnTimeout" });
      await expect(panel).toBeVisible();
      await expect(panel.locator('a[href*="cluster=devnet"]')).toHaveCount(1);

      expect(problems).toEqual([]);
    });

    test("journal: foco no cartão destaca o trecho da barra", async ({ page }) => {
      await page.goto(route);
      const cards = page.locator("#proof ul.snap-x > li");
      await expect(cards).toHaveCount(7);
      const segments = cards
        .first()
        .locator("xpath=../preceding-sibling::div[@role='img'][1]/span");
      await expect(segments).toHaveCount(7);
      await cards.nth(2).focus();
      const dimmed = await segments.evaluateAll((els) =>
        els.map((e) => e.className.includes("bg-soft")),
      );
      expect(dimmed).toEqual([true, true, false, true, true, true, true]);
    });

    test("colmeia: 5 células, espessura única, 1 conexão tracejada e legenda de ilustração", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(route);
      const svg = page.locator('#hive svg[role="img"]').first();
      const info = await svg.evaluate((el) => ({
        cells: [...el.querySelectorAll("path")].filter((p) => /Q/.test(p.getAttribute("d") ?? ""))
          .length,
        widths: [
          ...new Set([...el.querySelectorAll("path")].map((p) => p.getAttribute("stroke-width"))),
        ],
        dashed: el.querySelectorAll("[stroke-dasharray]").length,
      }));
      expect(info).toEqual({ cells: 5, widths: ["3"], dashed: 1 });
      await expect(page.locator("#hive figcaption")).not.toBeEmpty();
    });
  });
}

test("prefers-reduced-motion: nada animado, nada armado, ponto de evento oculto", async ({
  browser,
}) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/en");
  const result = await page.evaluate(() => {
    const animated = [".dd-line", ".dd-task", ".dd-spec", ".dd-card", ".dd-result"].map(
      (selector) => getComputedStyle(document.querySelector(selector)!).animationName,
    );
    return {
      animated,
      armed: document.querySelectorAll("[data-armed]").length,
      dot: getComputedStyle(document.querySelector(".dd-dot")!).opacity,
    };
  });
  expect(result.animated.every((name) => name === "none")).toBe(true);
  expect(result.armed).toBe(0);
  expect(result.dot).toBe("0");
  await context.close();
});

test("movimento normal: hero anima; seções abaixo da dobra são reveladas ao rolar", async ({
  page,
}) => {
  await page.goto("/en");
  const heroAnimated = await page.evaluate(
    () => getComputedStyle(document.querySelector(".dd-line")!).animationName,
  );
  expect(heroAnimated).not.toBe("none");
  expect(await page.locator("#top [data-armed]").count()).toBe(0);
  await page.locator("#hive").scrollIntoViewIfNeeded();
  await expect(page.locator("#hive [data-draw]")).toHaveAttribute("data-revealed", "true");
});

test("sem JavaScript: conteúdo legível, painéis empilhados e formulário inerte", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/en");
  await expect(page.getByRole("tablist")).toHaveCount(0);
  const panels = page.locator('[id*="-panel-"]');
  await expect(panels).toHaveCount(10);
  for (const panel of await panels.all()) await expect(panel).toBeVisible();
  await expect(page.locator("#proof")).toContainText("RefundedOnFail");

  await page.locator('#join form button[type="submit"]').click();
  expect(new URL(page.url()).search).toBe("");
  await context.close();
});
