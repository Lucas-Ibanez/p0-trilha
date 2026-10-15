/* Orçamento de conteúdo (docs/01 §6): H2 ≤ 8 palavras, parágrafos ≤ 35, FAQ de 6 com respostas ≤ 45.
 * H2 e contagem do FAQ são erros; parágrafos acima do limite são avisos (os textos de docs/03 ainda
 * estão em revisão, então o excesso vira pauta para o responsável, não bloqueio de build). */
import { flatten, locales, readJson, report } from "./lib.mjs";

const errors = [];
const warnings = [];

const h2Keys = [
  "decision.title",
  "how.title",
  "demo.title",
  "proof.title",
  "limits.title",
  "hive.title",
  "for.title",
  "faq.title",
  "join.title",
];
const paragraphKeys = [
  "hero.sub",
  "decision.body",
  "how.s1.body",
  "how.s2.body",
  "how.s3.body",
  "how.s4.body",
  "how.note",
  "demo.body",
  "proof.body",
  "limits.shows.body",
  "limits.notshows.body",
  "hive.body",
  "hive.planned.1",
  "hive.planned.2",
  "for.a.body",
  "for.b.body",
  "for.fit.body",
  "join.body",
];

const words = (text) =>
  text
    .replace(/<[^>]+>/g, " ")
    .replace(/\{[^}]+\}/g, "x")
    .split(/\s+/)
    .filter((word) => /[\p{L}\p{N}]/u.test(word)).length;

for (const locale of locales) {
  const dict = flatten(readJson(`messages/${locale}.json`));

  for (const key of h2Keys) {
    const count = words(dict[key] ?? "");
    if (count > 8) errors.push(`${locale} ${key}: H2 com ${count} palavras (máximo 8)`);
  }
  for (const key of paragraphKeys) {
    const count = words(dict[key] ?? "");
    if (count > 35) warnings.push(`${locale} ${key}: ${count} palavras (limite 35)`);
  }

  const faqAnswers = Object.keys(dict).filter((key) => /^faq\.[^.]+\.a$/.test(key));
  if (faqAnswers.length !== 6)
    errors.push(`${locale}: FAQ com ${faqAnswers.length} perguntas (esperado 6)`);
  for (const key of faqAnswers) {
    const count = words(dict[key]);
    if (count > 45) warnings.push(`${locale} ${key}: resposta com ${count} palavras (limite 45)`);
  }
}

report("check:content", errors, warnings);
