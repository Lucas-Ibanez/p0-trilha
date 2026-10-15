import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

export const root = join(dirname(fileURLToPath(import.meta.url)), "..");

export const read = (path) => readFileSync(join(root, path), "utf8");
export const readJson = (path) => JSON.parse(read(path));
export const rel = (abs) => relative(root, abs).replaceAll("\\", "/");

export const locales = ["en", "pt-br"];

/** Achata um dicionário em { "a.b.c": "valor" }. */
export function flatten(obj, prefix = "") {
  const out = {};
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(out, flatten(value, path));
    } else {
      out[path] = value;
    }
  }
  return out;
}

/** Lista arquivos de `dir` (relativo à raiz) cuja extensão está em `exts`. */
export function walk(dir, exts) {
  const files = [];
  const visit = (current) => {
    for (const name of readdirSync(current)) {
      const full = join(current, name);
      if (statSync(full).isDirectory()) visit(full);
      else if (exts.some((ext) => name.endsWith(ext))) files.push(full);
    }
  };
  visit(join(root, dir));
  return files;
}

/** Remove comentários de código preservando as quebras de linha (números de linha estáveis). */
export function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/(^|[^:\\"'`])\/\/.*$/gm, "$1");
}

export function report(name, errors, warnings = []) {
  for (const w of warnings) console.warn(`  aviso ${w}`);
  for (const e of errors) console.error(`  erro  ${e}`);
  if (errors.length) {
    console.error(`${name}: FALHOU (${errors.length} erro(s), ${warnings.length} aviso(s))`);
    process.exit(1);
  }
  console.log(`${name}: ok${warnings.length ? ` (${warnings.length} aviso(s))` : ""}`);
}
