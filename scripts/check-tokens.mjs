/* Nenhum valor de identidade fora de src/styles/tokens.css (CLAUDE.md, inegociável 3). */
import { read, rel, report, stripComments, walk } from "./lib.mjs";

const errors = [];
const TOKENS = "src/styles/tokens.css";
const THEME_COLOR = "src/lib/theme-color.ts";

const hex = /#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})\b/gi;
const colorFn = /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch)\(/gi;
const paletteUtility =
  /\b(?:bg|text|border|fill|stroke|ring|outline|from|via|to|divide|shadow)-(?:black|white|(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3})\b/g;

for (const file of walk("src", [".css", ".ts", ".tsx"])) {
  const path = rel(file);
  if (path === TOKENS) continue;
  const lines = stripComments(read(path)).split("\n");
  lines.forEach((line, index) => {
    if (path !== THEME_COLOR) {
      for (const m of line.matchAll(hex)) errors.push(`${path}:${index + 1}: cor literal ${m[0]}`);
    }
    for (const m of line.matchAll(colorFn))
      errors.push(`${path}:${index + 1}: função de cor ${m[0]}`);
    for (const m of line.matchAll(paletteUtility)) {
      errors.push(`${path}:${index + 1}: utilitário de paleta ${m[0]} (use um papel)`);
    }
    if (path.endsWith(".css") && /font-family\s*:/i.test(line) && !/var\(--font-/.test(line)) {
      errors.push(`${path}:${index + 1}: font-family fora de token`);
    }
  });
}

/* O <meta theme-color> não lê CSS vars: o valor em theme-color.ts precisa seguir o token. */
const aubergine = read(TOKENS).match(/--brand-aubergine:\s*(#[0-9a-f]{6})/i)?.[1];
const themeColor = read(THEME_COLOR).match(/themeColor\s*=\s*"(#[0-9a-f]{6})"/i)?.[1];
if (!aubergine || !themeColor || aubergine.toLowerCase() !== themeColor.toLowerCase()) {
  errors.push(
    `${THEME_COLOR}: themeColor (${themeColor}) difere de --brand-aubergine (${aubergine})`,
  );
}

report("check:tokens", errors);
