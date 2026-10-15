/**
 * Revisão adversarial (fase 5, docs/09 §2): cada teste tenta *quebrar* uma das garantias da página
 * olhando para o que o visitante realmente vê (texto renderizado, cores computadas), não para os
 * dicionários. As perguntas 1–9 do documento têm um teste; a 10 (compreensão em 5 s) exige pessoas.
 */
import { expect, test, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";

const evidence = JSON.parse(readFileSync("data/evidence.json", "utf8"));
const forbidden = JSON.parse(readFileSync("data/forbidden-terms.json", "utf8")) as {
  rules: {
    id: string;
    severity: "error" | "warn";
    allowKeys: string[];
    en: string[];
    "pt-br": string[];
  }[];
};
const messages = {
  en: JSON.parse(readFileSync("messages/en.json", "utf8")),
  "pt-br": JSON.parse(readFileSync("messages/pt-br.json", "utf8")),
};

const pages = [
  { route: "/en", locale: "en" },
  { route: "/pt-br", locale: "pt-br" },
  { route: "/en/privacy", locale: "en" },
  { route: "/pt-br/privacidade", locale: "pt-br" },
] as const;

/** Texto que o visitante lê: conteúdo visível mais alt/aria-label/title, tudo em uma string. */
async function visibleText(page: Page): Promise<string> {
  return page.evaluate(() => {
    const attrs = [...document.querySelectorAll("[alt],[aria-label],[title]")]
      .flatMap((el) => ["alt", "aria-label", "title"].map((a) => el.getAttribute(a) ?? ""))
      .filter(Boolean);
    return `${document.body.innerText}\n${attrs.join("\n")}`;
  });
}

/** Número isolado: não colado a letras, hífen, ponto ou vírgula (descarta Groth16, x86, v3.0.0). */
const NUMBER = /(?<![\w.,-])\d[\d.,]*\d|(?<![\w.,-])\d/g;
const squash = (text: string) => text.replace(/\s+/g, " ").trim();
const stripTags = (text: string) => text.replace(/<[^>]+>/g, "");

function lookup(locale: "en" | "pt-br", key: string): string | undefined {
  return key
    .split(".")
    .reduce<unknown>(
      (node, part) => (node as Record<string, unknown>)?.[part],
      messages[locale],
    ) as string | undefined;
}

// ── Perguntas 1, 2, 3 e 6 (claims, "a Hive decide", visão, drift): lista de proibidos no texto renderizado
for (const { route, locale } of pages) {
  test(`${route}: nenhum termo proibido no texto renderizado (fora da allowlist)`, async ({
    page,
  }) => {
    await page.goto(route);
    let text = squash(await visibleText(page));

    const found: string[] = [];
    for (const rule of forbidden.rules.filter((r) => r.severity === "error")) {
      // Trechos que a lista autoriza (negados ou explicados) saem do texto antes do teste.
      let scoped = text;
      for (const key of rule.allowKeys) {
        const value = lookup(locale, key);
        if (value) scoped = scoped.split(squash(stripTags(value))).join(" ");
      }
      for (const pattern of rule[locale]) {
        const match = scoped.match(new RegExp(pattern, "iu"));
        if (match) found.push(`[${rule.id}] /${pattern}/ em "…${match[0]}…"`);
      }
    }
    expect(found).toEqual([]);
    text = "";
  });
}

// ── Pergunta 7 (dado órfão): todo número visível vem de evidence.json ou é constante documentada
test("todo número visível é rastreável a evidence.json", async ({ page }) => {
  const formats = (n: number) => [
    new Intl.NumberFormat("en").format(n),
    new Intl.NumberFormat("pt-BR").format(n),
  ];
  const allowed = new Set<string>(
    [
      evidence.outcomes.length,
      evidence.rejections.length,
      evidence.constants.verifierComputeUnits,
      evidence.constants.journalBytes,
      evidence.constants.deadlineSlotsMin,
      evidence.constants.deadlineSlotsMax,
      ...evidence.journalFields.map((f: { offset: number }) => f.offset),
      ...evidence.rejections.map((r: { code: number }) => r.code),
    ].flatMap(formats),
  );
  // Códigos de erro do programa aparecem sem separador de milhar.
  for (const r of evidence.rejections as { code: number }[]) allowed.add(String(r.code));
  // Faixas de tempo de prova e a data da rodada (evidence.constants).
  for (const range of [
    evidence.constants.provingSeconds.composite,
    evidence.constants.provingSeconds.groth16Compression,
  ]) {
    for (const part of String(range).split("–")) allowed.add(part);
  }
  const [year, month, day] = evidence.constants.runOn.split("-");
  [year, String(Number(month)), String(Number(day))].forEach((v) => allowed.add(v));
  // Constantes de texto documentadas: regra v1 (2 × entrada), 1 Test USDC, passos 1–4, ano do rodapé, licença, memória medida.
  ["1", "2", "3", "4", "2.0", "7.6", "7,6", "2026", "0", "6", "500", "128"].forEach((v) =>
    allowed.add(v),
  );

  const orphans = new Map<string, string[]>();
  for (const { route } of pages.slice(0, 2)) {
    await page.goto(route);
    // Valores truncados de hash (af642b56…c49fb778) trazem dígitos que não são números da página.
    const text = squash((await visibleText(page)).replace(/[0-9a-f]{4,}…[0-9a-f]{4,}/g, " "));
    const tokens = [...text.matchAll(/(?<![\w.,-])\d[\d.,]*\d|(?<![\w.,-])\d/g)].map((m) =>
      m[0].replace(/[.,]$/, ""),
    );
    for (const token of tokens) {
      if (!allowed.has(token)) orphans.set(token, [...(orphans.get(token) ?? []), route]);
    }
  }
  expect([...orphans.entries()]).toEqual([]);
});

// ── Pergunta 6 (drift EN/PT-BR): os mesmos números nos dois idiomas
test("EN e PT-BR exibem os mesmos números (ignorando separadores)", async ({ page }) => {
  const counts: Record<string, number>[] = [];
  for (const route of ["/en", "/pt-br"]) {
    await page.goto(route);
    const text = squash((await visibleText(page)).replace(/[0-9a-f]{4,}…[0-9a-f]{4,}/g, " "));
    const tally: Record<string, number> = {};
    for (const m of text.matchAll(NUMBER)) {
      const token = m[0].replace(/[.,]/g, "");
      tally[token] = (tally[token] ?? 0) + 1;
    }
    counts.push(tally);
  }
  const diff: Record<string, string> = {};
  for (const token of new Set([...Object.keys(counts[0] ?? {}), ...Object.keys(counts[1] ?? {})])) {
    const en = counts[0]?.[token] ?? 0;
    const pt = counts[1]?.[token] ?? 0;
    if (en !== pt) diff[token] = `en=${en} pt=${pt}`;
  }
  expect(diff).toEqual({});
});

// ── Pergunta 5 (hash disfarçado)
test("nenhum hash ou assinatura completo no texto; todo valor truncado mostra reticências", async ({
  page,
}) => {
  for (const route of ["/en", "/pt-br"]) {
    await page.goto(route);
    const text = await visibleText(page);
    expect(text.match(/\b[0-9a-f]{32,}\b/gi) ?? [], `${route}: hex longo`).toEqual([]);
    expect(text.match(/\b[1-9A-HJ-NP-Za-km-z]{32,}\b/g) ?? [], `${route}: base58 longo`).toEqual(
      [],
    );

    const cards = await page
      .locator("#proof ul.snap-x > li")
      .evaluateAll((els) => els.map((el) => (el as HTMLElement).innerText));
    const hashCards = cards.filter(
      (c) =>
        /_hash|_id|image_id/.test(c) &&
        !c.startsWith("Começa no byte 0") &&
        !c.startsWith("Starts at byte 0"),
    );
    for (const card of hashCards) expect(card, card).toContain("…");
  }
});

// ── Pergunta 4 (selo escondido) e cores de status (D11): só a paleta da marca, nada verde ou vermelho
test("nenhuma cor de status: todo texto, fundo, contorno e traço é paleta da marca", async ({
  page,
}) => {
  for (const route of ["/en", "/pt-br"]) {
    await page.goto(route);
    // Estado final das tabs e do formulário com erro, onde cores de status costumam aparecer.
    await page.getByRole("tablist").nth(0).getByRole("tab").nth(1).click();
    await page.locator('#join form button[type="submit"]').click();

    const offenders = await page.evaluate(() => {
      const hsl = (r: number, g: number, b: number) => {
        const R = r / 255;
        const G = g / 255;
        const B = b / 255;
        const max = Math.max(R, G, B);
        const min = Math.min(R, G, B);
        const l = (max + min) / 2;
        const d = max - min;
        if (d === 0) return { h: 0, s: 0, l, chroma: 0 };
        const s = d / (1 - Math.abs(2 * l - 1));
        const h = max === R ? ((G - B) / d) % 6 : max === G ? (B - R) / d + 2 : (R - G) / d + 4;
        return { h: (h * 60 + 360) % 360, s, l, chroma: d };
      };
      const AMBER = { r: 232, g: 180, b: 76 };
      const bad = new Set<string>();
      for (const el of document.querySelectorAll("body *")) {
        const style = getComputedStyle(el);
        for (const prop of [
          "color",
          "backgroundColor",
          "borderTopColor",
          "outlineColor",
          "fill",
          "stroke",
        ] as const) {
          const value = style[prop];
          const m = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
          if (!m) continue;
          const [r, g, b] = [Number(m[1]), Number(m[2]), Number(m[3])];
          const alpha = m[4] === undefined ? 1 : Number(m[4]);
          if (alpha === 0) continue;
          if (r === AMBER.r && g === AMBER.g && b === AMBER.b) continue; // âmbar da marca
          const { h, chroma } = hsl(r, g, b);
          // Berinjela, malva, lilás, brancos e suas misturas: matiz roxo (250–330°) ou quase sem croma.
          const brand = chroma < 0.1 || (h >= 250 && h <= 330);
          if (!brand) bad.add(`${el.tagName}.${prop}=${value}`);
        }
      }
      return [...bad];
    });
    expect(offenders, route).toEqual([]);
  }
});

// ── Pergunta 8 (vazamento) e privacidade: nada armazenado, nenhum terceiro no carregamento
test("a página não grava cookie, localStorage nem chama terceiros, nem depois de enviar a prévia", async ({
  page,
  context,
}) => {
  const external: string[] = [];
  page.on("request", (request) => {
    if (!request.url().startsWith("http://localhost")) external.push(request.url());
  });
  await page.goto("/en");
  await page.waitForLoadState("networkidle");
  expect(await context.cookies()).toEqual([]);

  const form = page.locator("#join form");
  await form.locator("#waitlist-email").fill("ana@empresa.com");
  await form.locator('input[name="segment"]').first().check();
  await form.locator("#waitlist-consent").check();
  await form.locator('button[type="submit"]').click();
  await expect(page.locator('#join [role=status][tabindex="-1"]')).toBeVisible();

  const storage = await page.evaluate(() => ({
    local: localStorage.length,
    session: sessionStorage.length,
  }));
  expect(storage).toEqual({ local: 0, session: 0 });
  expect(await context.cookies()).toEqual([]);
  expect(external).toEqual([]);
});

// ── Marca: tamanhos mínimos do logo (docs/04 §5)
test("logo horizontal respeita o mínimo de 128 px em todas as larguras", async ({ page }) => {
  for (const width of [360, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/en");
    const logoWidth = await page
      .locator('header img[alt="Hive"]')
      .evaluate((img) => img.getBoundingClientRect().width);
    expect(logoWidth, `@${width}`).toBeGreaterThanOrEqual(128);
    // Cabeçalho cabe sem rolagem horizontal e o menu continua alcançável.
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, `@${width}`).toBeLessThanOrEqual(0);
  }
});
