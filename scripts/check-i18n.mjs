/* Dicionários: mesmas chaves, sem vazios, sem valor idêntico entre idiomas (exceto termos
 * invariantes) e, por heurística, sem texto visível literal em componentes (docs/06 §3 e §11). */
import { flatten, locales, read, readJson, rel, report, stripComments, walk } from "./lib.mjs";

const errors = [];
const { invariantTerms } = readJson("data/forbidden-terms.json");
const dict = Object.fromEntries(locales.map((l) => [l, flatten(readJson(`messages/${l}.json`))]));

const [base, ...others] = locales;
const baseKeys = new Set(Object.keys(dict[base]));

for (const other of others) {
  const otherKeys = new Set(Object.keys(dict[other]));
  for (const key of baseKeys)
    if (!otherKeys.has(key)) errors.push(`${other}: falta a chave "${key}"`);
  for (const key of otherKeys)
    if (!baseKeys.has(key)) errors.push(`${base}: falta a chave "${key}"`);
}

for (const locale of locales) {
  for (const [key, value] of Object.entries(dict[locale])) {
    if (typeof value !== "string" || value.trim() === "") {
      errors.push(`${locale}: valor vazio ou não textual em "${key}"`);
    }
  }
}

/* Idêntico nos dois idiomas só vale se, sem os termos invariantes, não sobra texto. */
const stripInvariants = (text) => {
  let out = text.replace(/<[^>]+>/g, " ");
  for (const term of invariantTerms) out = out.split(term).join(" ");
  return out.replace(/[\s\d\p{P}\p{S}]/gu, "");
};
for (const key of baseKeys) {
  const values = locales.map((l) => dict[l][key]);
  if (values.every((v) => v === values[0]) && stripInvariants(String(values[0])) !== "") {
    errors.push(
      `"${key}" é idêntica em ${locales.join(" e ")} (traduza, ou é um termo invariante?)`,
    );
  }
}

/* Heurística: texto literal visível em JSX (nós de texto e atributos de acessibilidade). */
const textNode = />\s*([^<>{}\n]*\p{L}[^<>{}\n]*?)\s*</gu;
const a11yAttr = /\b(alt|aria-label|title|placeholder)\s*=\s*"([^"{}]*\p{L}[^"{}]*)"/gu;
for (const file of walk("src", [".tsx"])) {
  const path = rel(file);
  const lines = stripComments(read(path)).split("\n");
  lines.forEach((line, index) => {
    for (const match of line.matchAll(textNode)) {
      const text = match[1].trim();
      /* ignora genéricos de TypeScript e expressões: qualquer pista de código descarta. */
      if (/[=;(){}]|=>|\bextends\b/.test(text)) continue;
      errors.push(`${path}:${index + 1}: texto literal "${text}" (use o dicionário)`);
    }
    for (const match of line.matchAll(a11yAttr)) {
      errors.push(`${path}:${index + 1}: ${match[1]}="${match[2]}" literal (use o dicionário)`);
    }
  });
}

report(`check:i18n (${baseKeys.size} chaves x ${locales.length} idiomas)`, errors);
