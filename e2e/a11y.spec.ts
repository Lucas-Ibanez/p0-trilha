import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { routes } from "./helpers";

const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

async function audit(page: Page, context: string) {
  const { violations } = await new AxeBuilder({ page }).withTags(tags).analyze();
  const summary = violations.map(
    (v) => `${v.impact} ${v.id}: ${v.nodes.length} nó(s), ex.: ${v.nodes[0]?.target.join(" ")}`,
  );
  expect(summary, context).toEqual([]);
}

for (const route of ["/en/privacy", "/pt-br/privacidade"]) {
  test(`${route}: axe sem violações`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(route);
    await audit(page, route);
  });
}

for (const route of routes) {
  test.describe(route, () => {
    test("axe: nenhuma violação (desktop e mobile, estado inicial)", async ({ page }) => {
      // Sem animação: o axe mede contraste e uma opacidade em transição daria falso resultado.
      await page.emulateMedia({ reducedMotion: "reduce" });
      for (const width of [1280, 390]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(route);
        await page.waitForLoadState("networkidle");
        await audit(page, `${route} @${width}`);
      }
    });

    test("axe: com abas trocadas, FAQ aberto e formulário com erros", async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(route);
      const lists = page.getByRole("tablist");
      await lists.nth(0).getByRole("tab").nth(2).click();
      await lists.nth(1).getByRole("tab").nth(2).click();
      await lists.nth(2).getByRole("tab").nth(1).click();
      for (const item of await page.locator("#faq details > summary").all()) await item.click();
      await page.locator('#join form button[type="submit"]').click();
      await expect(page.locator("#join form [role=alert]")).toBeFocused();
      await audit(page, `${route} com estados alterados`);
    });

    test("axe: modo reduced-motion e menu mobile aberto", async ({ browser }) => {
      const context = await browser.newContext({
        reducedMotion: "reduce",
        viewport: { width: 390, height: 800 },
      });
      const page = await context.newPage();
      await page.goto(route);
      await page.locator("header details > summary").click();
      await audit(page, `${route} menu aberto`);
      await context.close();
    });

    test("teclado: primeiro Tab vai ao skip link e leva ao conteúdo", async ({ page }) => {
      await page.goto(route);
      await page.keyboard.press("Tab");
      const skip = page.locator("a[href='#content']");
      await expect(skip).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(/#content$/);
    });
  });
}
