/* Lista de bloqueio de docs/02 §4 (data/forbidden-terms.json) sobre dicionários e componentes.
 * É lista de bloqueio + revisão humana; não substitui o checklist de 02 §8.
 * Severidade `error` falha o build; `warn` só avisa (use --strict para falhar também). */
import { flatten, locales, read, readJson, rel, report, stripComments, walk } from "./lib.mjs";

const strict = process.argv.includes("--strict");
const { rules } = readJson("data/forbidden-terms.json");
const errors = [];
const warnings = [];

const compile = (patterns) => patterns.map((source) => ({ source, re: new RegExp(source, "iu") }));
const compiled = rules.map((rule) => ({
  ...rule,
  perLocale: Object.fromEntries(locales.map((l) => [l, compile(rule[l] ?? [])])),
  all: compile([...new Set([...(rule.en ?? []), ...(rule["pt-br"] ?? [])])]),
}));

const push = (rule, message) =>
  (rule.severity === "error" || strict ? errors : warnings).push(message);

/* 1. Dicionários: cada idioma contra a lista do próprio idioma; allowKeys isenta a chave. */
for (const locale of locales) {
  const entries = flatten(readJson(`messages/${locale}.json`));
  for (const [key, value] of Object.entries(entries)) {
    for (const rule of compiled) {
      if (rule.allowKeys.includes(key)) continue;
      for (const { source, re } of rule.perLocale[locale]) {
        if (re.test(String(value))) {
          push(rule, `messages/${locale}.json "${key}": [${rule.id}] /${source}/ (${rule.reason})`);
        }
      }
    }
  }
}

/* 2. Componentes: literais de string e texto JSX, com os dois conjuntos de padrões.
 *    Isenção por linha: comentário `claims-allow: <id-da-regra>` na própria linha. */
const literal = /(["'`])((?:\\.|(?!\1)[^\\\n])*)\1|>([^<>{}\n]+)</gu;
for (const file of walk("src", [".ts", ".tsx"])) {
  const path = rel(file);
  const original = read(path).split("\n");
  const code = stripComments(original.join("\n")).split("\n");
  code.forEach((line, index) => {
    for (const match of line.matchAll(literal)) {
      const text = match[2] ?? match[3] ?? "";
      for (const rule of compiled) {
        if (original[index].includes(`claims-allow: ${rule.id}`)) continue;
        for (const { source, re } of rule.all) {
          if (re.test(text))
            push(rule, `${path}:${index + 1}: [${rule.id}] /${source}/ em "${text}"`);
        }
      }
    }
  });
}

report(`check:claims (${rules.length} regras)`, errors, warnings);
