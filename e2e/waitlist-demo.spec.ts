import { expect, test } from "@playwright/test";
import { collectConsole, routes } from "./helpers";

for (const route of routes) {
  test.describe(`${route} lista de espera`, () => {
    test("validação, prévia sem envio e sucesso honesto", async ({ page }) => {
      const problems = collectConsole(page);
      const requests: string[] = [];
      await page.goto(route);
      const form = page.locator("#join form");

      await expect(form).toContainText(route === "/en" ? "Preview" : "Prévia");
      await expect(form.locator("#waitlist-consent")).not.toBeChecked();
      await expect(form.locator("#waitlist-email")).toHaveAttribute("autocomplete", "email");

      // Envio vazio: foco no resumo, 3 erros, campos marcados.
      await form.locator('button[type="submit"]').click();
      const summary = form.locator("[role=alert]");
      await expect(summary).toBeFocused();
      await expect(summary.locator("a")).toHaveCount(3);
      await expect(form.locator("#waitlist-email")).toHaveAttribute("aria-invalid", "true");
      await expect(form.locator("#waitlist-consent")).toHaveAttribute("aria-invalid", "true");
      expect(new URL(page.url()).search).toBe("");

      // Link do resumo leva o foco ao campo.
      await summary.locator("a").first().click();
      await expect(form.locator("#waitlist-email")).toBeFocused();

      // E-mail inválido: só o erro de e-mail.
      await form.locator("#waitlist-email").fill("foo@bar");
      await form.locator("#waitlist-consent").check();
      await form.locator('input[name="segment"]').first().check();
      await form.locator('button[type="submit"]').click();
      await expect(summary.locator("li")).toHaveCount(1);

      // Válido: "Enviando…", depois a prévia; nada vai para a rede.
      await form.locator("#waitlist-email").fill("Ana@Empresa.com ");
      page.on("request", (request) => requests.push(`${request.method()} ${request.url()}`));
      const submit = form.locator('button[type="submit"]');
      await submit.click();
      await expect(submit).toBeDisabled();
      await expect(submit).toHaveText(route === "/en" ? "Sending…" : "Enviando…");

      const success = page.locator('#join [role=status][tabindex="-1"]');
      await expect(success).toBeFocused();
      await expect(success).toContainText(
        route === "/en" ? "Nothing was sent" : "Nada foi enviado",
      );
      await expect(page.locator("#join")).not.toContainText(
        /You're on the list|Você está na lista/,
      );
      expect(requests).toEqual([]);

      await success.getByRole("button").click();
      await expect(form.locator("#waitlist-email")).toHaveValue("");
      expect(problems).toEqual([]);
    });
  });
}

test("demo (D6): dois vídeos oficiais, terceiro slot oculto, nada de terceiros antes do clique", async ({
  page,
}) => {
  const external: string[] = [];
  const cspViolations: string[] = [];
  page.on("request", (request) => {
    if (!request.url().startsWith("http://localhost")) external.push(request.url());
  });
  page.on("console", (message) => {
    if (/Content Security Policy|Refused to/i.test(message.text()))
      cspViolations.push(message.text());
  });
  await page.goto("/en");
  await page.waitForLoadState("networkidle");
  await expect(page.locator("#demo iframe, #demo video")).toHaveCount(0);
  const slots = page.locator("#demo ul > li");
  await expect(slots).toHaveCount(2);
  await expect(slots.nth(0)).toContainText("Demo");
  await expect(slots.nth(1)).toContainText("Pitch");
  await expect(page.locator("#demo")).not.toContainText(/coming soon|em breve/i);
  // Com vídeo no ar, o CTA da seção é a lista de espera (não "avise-me quando estiver no ar").
  await expect(
    page.locator("#demo").getByRole("link", { name: "Join the waitlist" }),
  ).toBeVisible();
  expect(external).toEqual([]);

  // O botão carrega o player só ao clicar; o embed aponta para os vídeos oficiais, sem cookies.
  await slots.nth(0).getByRole("button", { name: /Play/ }).click();
  await expect(slots.nth(0).locator("iframe")).toHaveAttribute(
    "src",
    /youtube-nocookie\.com\/embed\/AmIFw_lY8Ck\?autoplay=1/,
  );
  await slots.nth(1).getByRole("button", { name: /Play/ }).click();
  await expect(slots.nth(1).locator("iframe")).toHaveAttribute(
    "src",
    /youtube-nocookie\.com\/embed\/1nEBPdJG-8o\?autoplay=1/,
  );
  // A CSP deixa os embeds carregarem: nenhuma violação registrada.
  await page.waitForTimeout(1500);
  expect(cspViolations).toEqual([]);
});
