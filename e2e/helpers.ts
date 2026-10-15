import type { Page } from "@playwright/test";

export const routes = ["/en", "/pt-br"] as const;

/** Reúne erros e avisos do console e exceções da página, para o teste afirmar que não há nenhum. */
export function collectConsole(page: Page): string[] {
  const problems: string[] = [];
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      problems.push(`${message.type()}: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => problems.push(`exception: ${error.message}`));
  return problems;
}
