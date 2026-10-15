import { expect, test } from "@playwright/test";
import { routes } from "./helpers";

const widths = [360, 390, 768, 1024, 1280, 1536];

for (const route of routes) {
  for (const width of widths) {
    test(`${route} @${width}: sem rolagem horizontal da página`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route);
      await page.waitForLoadState("networkidle");
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    });
  }
}

for (const [name, width] of [
  ["mobile", 390],
  ["desktop", 1280],
] as const) {
  test(`no máximo um botão âmbar por viewport (${name})`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/en");
    const worst = await page.evaluate(() => {
      const amber = [...document.querySelectorAll<HTMLElement>("a,button")].filter(
        (el) => el.className.includes("bg-action") && !el.className.includes("focus:bg-action"),
      );
      const total = document.documentElement.scrollHeight;
      let max = 0;
      for (let y = 0; y < total; y += 100) {
        const visible = amber.filter((el) => {
          const rect = el.getBoundingClientRect();
          const top = rect.top + window.scrollY;
          return rect.width > 0 && top < y + innerHeight && top + rect.height > y;
        }).length;
        max = Math.max(max, visible);
      }
      return { count: amber.length, max };
    });
    expect(worst.count).toBeGreaterThanOrEqual(2); // CTA do hero e envio da lista
    expect(worst.max).toBeLessThanOrEqual(1);
  });
}
