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

/* Heurística: texto literal visível em JSX (nós de texto, inclusive em várias linhas, e
 * atributos de acessibilidade). Descarta o que parece código (genéricos, expressões). */
const textNode = /(?<![=\-])>([^<>{}]*?\p{L}[^<>{}]*?)</gu;
const a11yAttr = /(alt|aria-label|title|placeholder)\s*=\s*"([^"{}]*\p{L}[^"{}]*)"/gu;
const lineOf = (source, offset) => source.slice(0, offset).split("\n").length;
for (const file of walk("src", [".tsx"])) {
  const path = rel(file);
  const source = stripComments(read(path));
  for (const match of source.matchAll(textNode)) {
    const text = match[1].replace(/\s+/g, " ").trim();
    if (!text || /[=;()]|=>|extends|return/.test(text)) continue;
    errors.push(
      `${path}:${lineOf(source, match.index)}: texto literal "${text}" (use o dicionário)`,
    );
  }
  for (const match of source.matchAll(a11yAttr)) {
    errors.push(
      `${path}:${lineOf(source, match.index)}: ${match[1]}="${match[2]}" literal (use o dicionário)`,
    );
  }
}

report(`check:i18n (${baseKeys.size} chaves x ${locales.length} idiomas)`, errors);
