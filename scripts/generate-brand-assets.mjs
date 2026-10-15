/* Gera os ativos derivados da marca a partir dos SVGs e das fontes do repositório:
 *   - public/og/og-en.png e og-pt-br.png (1200×630): logo horizontal + slogan do idioma
 *   - public/brand/hive-favicon-amber.svg (favicon PROVISÓRIO: símbolo âmbar sobre berinjela)
 *   - public/brand/app-icons/{favicon-32,apple-touch-icon,icon-512}.png e public/favicon.ico
 * Nada do desenho é alterado: os caminhos do símbolo são copiados de hive-symbol-amber.svg.
 * TODO(brand): favicon e app icon definitivos ainda não existem (docs/04 §5, D10).
 * Uso: npm run assets:generate (precisa de Edge ou Chrome; PW_CHANNEL escolhe: msedge | chrome). */
import { chromium } from "@playwright/test";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { locales, read, readJson, root } from "./lib.mjs";

const channel = process.env.PW_CHANNEL ?? "msedge";
const AUBERGINE = read("src/styles/tokens.css").match(
  /--brand-aubergine:\s*(#[0-9a-fA-F]{6})/,
)?.[1];
const WARM_WHITE = read("src/styles/tokens.css").match(
  /--brand-warm-white:\s*(#[0-9a-fA-F]{6})/,
)?.[1];
if (!AUBERGINE || !WARM_WHITE)
  throw new Error("tokens.css sem --brand-aubergine/--brand-warm-white");

const dataUri = (path, mime) =>
  `data:${mime};base64,${readFileSync(join(root, path)).toString("base64")}`;

/* ── Favicon: símbolo âmbar copiado do SVG da marca, sobre quadrado berinjela ─────────────── */
const symbol = read("public/brand/hive-symbol-amber.svg");
const symbolViewBox = symbol.match(/viewBox="([^"]+)"/)?.[1] ?? "0 0 999 953";
const [, , vbW, vbH] = symbolViewBox.split(" ").map(Number);
const symbolBody = symbol.match(/<g[\s\S]*<\/g>/)?.[0];
if (!symbolBody) throw new Error("hive-symbol-amber.svg: grupo de caminhos não encontrado");

const SIZE = 64;
const symbolWidth = 42;
const symbolHeight = (symbolWidth * vbH) / vbW;
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" role="img" aria-label="hive">
<!-- PROVISÓRIO (TODO(brand)): derivado de hive-symbol-amber.svg, que é rastreado da prancha 1; não é o desenho mestre. -->
<title>hive</title>
<rect width="${SIZE}" height="${SIZE}" fill="${AUBERGINE}"/>
<svg x="${(SIZE - symbolWidth) / 2}" y="${(SIZE - symbolHeight) / 2}" width="${symbolWidth}" height="${symbolHeight}" viewBox="${symbolViewBox}">${symbolBody}</svg>
</svg>
`;
writeFileSync(join(root, "public/brand/hive-favicon-amber.svg"), faviconSvg);

/* ── Páginas HTML renderizadas em PNG ────────────────────────────────────────────────────────── */
const fonts = `
@font-face { font-family: "Manrope"; font-weight: 200 800; src: url(${dataUri("public/brand/fonts/manrope-wght-latin.woff2", "font/woff2")}) format("woff2"); }
@font-face { font-family: "Manrope"; font-weight: 200 800; src: url(${dataUri("public/brand/fonts/manrope-wght-latin-ext.woff2", "font/woff2")}) format("woff2"); unicode-range: U+0100-02BA; }`;

const ogHtml = (locale) => {
  const messages = readJson(`messages/${locale}.json`);
  return `<!doctype html><html><head><meta charset="utf-8"><style>${fonts}
html,body{margin:0;width:1200px;height:630px;overflow:hidden}
body{background:${AUBERGINE};color:${WARM_WHITE};font-family:"Manrope",sans-serif;position:relative}
img{position:absolute;left:80px;top:72px;width:360px}
h1{position:absolute;left:80px;top:250px;margin:0;font-size:84px;line-height:1.1;font-weight:700;max-width:900px}
p{position:absolute;left:80px;bottom:64px;margin:0;font-size:28px;font-weight:500;opacity:.85}
</style></head><body>
<img src="${dataUri("public/brand/hive-horizontal-warm-white.svg", "image/svg+xml")}" alt="">
<h1>${messages.hero.title}</h1>
<p>${messages.env.banner}</p>
</body></html>`;
};

const iconHtml = (px) =>
  `<!doctype html><html><body style="margin:0"><img src="${dataUri("public/brand/hive-favicon-amber.svg", "image/svg+xml")}" width="${px}" height="${px}" style="display:block"></body></html>`;

const browser = await chromium.launch({ channel });
const context = await browser.newContext({ deviceScaleFactor: 1 });
const page = await context.newPage();

mkdirSync(join(root, "public/og"), { recursive: true });
for (const locale of locales) {
  await page.setViewportSize({ width: 1200, height: 630 });
  await page.setContent(ogHtml(locale));
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: join(root, `public/og/og-${locale}.png`),
    clip: { x: 0, y: 0, width: 1200, height: 630 },
  });
}

mkdirSync(join(root, "public/brand/app-icons"), { recursive: true });
const icons = { "favicon-32.png": 32, "apple-touch-icon.png": 180, "icon-512.png": 512 };
for (const [name, px] of Object.entries(icons)) {
  await page.setViewportSize({ width: px, height: px });
  await page.setContent(iconHtml(px));
  await page.screenshot({
    path: join(root, "public/brand/app-icons", name),
    clip: { x: 0, y: 0, width: px, height: px },
  });
}
await browser.close();

/* favicon.ico: um único PNG de 32×32 dentro do contêiner ICO. */
const png = readFileSync(join(root, "public/brand/app-icons/favicon-32.png"));
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); // reservado
header.writeUInt16LE(1, 2); // tipo: ícone
header.writeUInt16LE(1, 4); // 1 imagem
header.writeUInt8(32, 6); // largura
header.writeUInt8(32, 7); // altura
header.writeUInt16LE(1, 10); // planos
header.writeUInt16LE(32, 12); // bits por pixel
header.writeUInt32LE(png.length, 14); // tamanho dos dados
header.writeUInt32LE(22, 18); // deslocamento dos dados
writeFileSync(join(root, "public/favicon.ico"), Buffer.concat([header, png]));

console.log(
  "ativos gerados: og-en.png, og-pt-br.png, hive-favicon-amber.svg, favicon-32/apple-touch/icon-512, favicon.ico",
);
