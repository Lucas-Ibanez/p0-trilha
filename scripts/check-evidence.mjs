/* Valida data/evidence.json (docs/06 §4): URLs de Explorer, endereços, journal e hashes. */
import { read, readJson, report } from "./lib.mjs";

const errors = [];
const evidence = readJson("data/evidence.json");
const facts = read("docs/08-facts.md");
const bad = (message) => errors.push(message);
const base58 = (min, max) => new RegExp(`^[1-9A-HJ-NP-Za-km-z]{${min},${max}}$`);

/* 0. Cluster */
if (evidence.meta.cluster !== "devnet") {
  bad(`meta.cluster deve ser "devnet" (é "${evidence.meta.cluster}")`);
}

/* 1. Toda explorerUrl: cluster=devnet e assinatura igual à do campo irmão. */
const txRefs = [];
const collect = (node, path) => {
  if (!node || typeof node !== "object") return;
  if (typeof node.explorerUrl === "string") txRefs.push({ path, ...node });
  for (const [key, value] of Object.entries(node)) collect(value, `${path}.${key}`);
};
collect(evidence, "evidence");

for (const ref of txRefs) {
  let url;
  try {
    url = new URL(ref.explorerUrl);
  } catch {
    bad(`${ref.path}: explorerUrl inválida`);
    continue;
  }
  if (url.origin !== "https://explorer.solana.com")
    bad(`${ref.path}: origem inesperada ${url.origin}`);
  if (url.searchParams.get("cluster") !== "devnet") bad(`${ref.path}: falta cluster=devnet`);
  if (url.pathname !== `/tx/${ref.signature}`)
    bad(`${ref.path}: a assinatura não corresponde à URL`);
  if (!base58(80, 90).test(ref.signature))
    bad(`${ref.path}: assinatura fora do formato base58 (80–90)`);
}

/* 2. Endereços batem com docs/08-facts.md. */
const addresses = {
  "programs.escrow.address": evidence.programs.escrow.address,
  "programs.groth16Verifier.address": evidence.programs.groth16Verifier.address,
  "programs.testUsdcMint.address": evidence.programs.testUsdcMint.address,
  "constants.imageId": evidence.constants.imageId,
};
for (const [path, value] of Object.entries(addresses)) {
  if (!facts.includes(`\`${value}\``)) bad(`${path} (${value}) não consta em docs/08-facts.md`);
  if (path.endsWith("address") && !base58(32, 44).test(value))
    bad(`${path}: formato de endereço inválido`);
}

/* 3. Journal: 165 bytes e offsets 0,4,36,68,100,132,164. */
const sizeOf = { u8: 1, u32: 4, bytes32: 32 };
const expectedOffsets = [0, 4, 36, 68, 100, 132, 164];
const fields = evidence.journalFields;
if (evidence.constants.journalBytes !== 165) {
  bad(`journalBytes deve ser 165 (é ${evidence.constants.journalBytes})`);
}
if (JSON.stringify(fields.map((f) => f.offset)) !== JSON.stringify(expectedOffsets)) {
  bad(`offsets do journal: ${fields.map((f) => f.offset)} (esperado ${expectedOffsets})`);
}
let cursor = 0;
for (const field of fields) {
  if (field.offset !== cursor)
    bad(`journalFields.${field.name}: offset ${field.offset}, esperado ${cursor} pelos tamanhos`);
  cursor += sizeOf[field.type] ?? Number.NaN;
}
if (cursor !== evidence.constants.journalBytes) {
  bad(`os tamanhos dos campos somam ${cursor}, não ${evidence.constants.journalBytes}`);
}

/* 4. Campos `full`: hash de 32 bytes = 64 hex; nunca completar de memória. */
const example = evidence.journalExamplePass;
for (const [name, value] of Object.entries(example)) {
  if (!value || typeof value !== "object" || !("full" in value)) continue;
  if (value.full !== null && !/^[0-9a-f]{64}$/.test(value.full))
    bad(`journalExamplePass.${name}.full não tem 64 hex`);
  if (value.full === null && /^[0-9a-f]{64}$/.test(value.display ?? "")) {
    bad(`journalExamplePass.${name}: display completo, mas full é null`);
  }
  if (
    value.full !== null &&
    value.display !== `${value.full.slice(0, 8)}…${value.full.slice(-8)}`
  ) {
    bad(`journalExamplePass.${name}: display não corresponde ao início e ao fim de full`);
  }
}
if (example.imageId.full !== evidence.constants.imageId) {
  bad("journalExamplePass.imageId.full difere de constants.imageId");
}

/* 5. Desfechos e rejeições: contagens e coerência com o verificador. */
if (evidence.outcomes.length !== 3) bad(`esperados 3 desfechos, há ${evidence.outcomes.length}`);
for (const outcome of evidence.outcomes) {
  if (outcome.verifierInvoked !== outcome.requiresProof) {
    bad(`outcomes.${outcome.id}: verifierInvoked deve igualar requiresProof`);
  }
}
if (evidence.rejections.length !== 4)
  bad(`esperadas 4 rejeições, há ${evidence.rejections.length}`);

report(`check:evidence (${txRefs.length} URLs de Explorer)`, errors);
