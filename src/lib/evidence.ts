import evidence from "@data/evidence.json";
import type { Locale } from "@/i18n/routing";

/** Fonte única de fatos (docs/08-facts.md). Nenhum componente digita hash, endereço ou URL. */

const EXPLORER = "https://explorer.solana.com";
const CLUSTER = "devnet";

export type OutcomeId = "released" | "refundedOnFail" | "refundedOnTimeout";
export type RejectionId =
  "tamperedProof" | "otherJobReceipt" | "refundTooEarly" | "secondSettlement";

type Localized = Record<Locale, string>;

export function explorerTxUrl(signature: string): string {
  return `${EXPLORER}/tx/${signature}?cluster=${CLUSTER}`;
}

export function explorerAddressUrl(address: string): string {
  return `${EXPLORER}/address/${address}?cluster=${CLUSTER}`;
}

export function getMeta() {
  return evidence.meta;
}

export function getConstants() {
  return evidence.constants;
}

/** Texto da medição de prova no idioma da rota (o dado traz EN e PT-BR). */
export function getProvingNote(locale: Locale): string {
  return evidence.constants.provingNote[locale];
}

/** Os quatro números da seção Provas (docs/08 §4.1), sempre derivados dos dados. */
export function getHeadlineNumbers() {
  return {
    settledOutcomes: evidence.outcomes.length,
    rejectedAttempts: evidence.rejections.length,
    verifierComputeUnits: evidence.constants.verifierComputeUnits,
    journalBytes: evidence.constants.journalBytes,
  };
}

/** Data da rodada final na interface (ISO `YYYY-MM-DD`). */
export function getRunDate(): string {
  return evidence.constants.runOn;
}

export function getPrograms() {
  const { escrow, groth16Verifier, testUsdcMint } = evidence.programs;
  return {
    escrow: {
      ...escrow,
      addressUrl: explorerAddressUrl(escrow.address),
      finalizationTxUrl: explorerTxUrl(escrow.finalizationTx.signature),
    },
    groth16Verifier: {
      ...groth16Verifier,
      addressUrl: explorerAddressUrl(groth16Verifier.address),
    },
    testUsdcMint: {
      ...testUsdcMint,
      addressUrl: explorerAddressUrl(testUsdcMint.address),
    },
  };
}

export function getOutcomes() {
  return evidence.outcomes.map((outcome) => ({
    ...outcome,
    id: outcome.id as OutcomeId,
    headline: outcome.headline as Localized,
    result: outcome.result as Localized,
    txUrl: explorerTxUrl(outcome.tx.signature),
  }));
}

export function getOutcome(id: OutcomeId) {
  const outcome = getOutcomes().find((item) => item.id === id);
  if (!outcome) throw new Error(`Unknown outcome: ${id}`);
  return outcome;
}

export function getRejections() {
  return evidence.rejections.map((rejection) => ({
    ...rejection,
    id: rejection.id as RejectionId,
    title: rejection.title as Localized,
    txUrl: explorerTxUrl(rejection.tx.signature),
  }));
}

export function getRejectionNote(locale: Locale): string {
  return evidence.rejectionNote[locale];
}

const JOURNAL_TYPE_BYTES: Record<string, number> = { u8: 1, u32: 4, bytes32: 32 };

/** Campos do journal com tamanho em bytes (a soma é 165; ver scripts/check-evidence.mjs). */
export function getJournalFields() {
  return evidence.journalFields.map((field) => ({
    ...field,
    bytes: JOURNAL_TYPE_BYTES[field.type] ?? 0,
    gloss: field.gloss as Localized,
  }));
}

const JOURNAL_EXAMPLE_KEY: Record<string, keyof typeof evidence.journalExamplePass | null> = {
  schema_version: null,
  job_id: "jobId",
  spec_hash: "specHash",
  harness_hash: "harnessHash",
  artifact_hash: "artifactHash",
  image_id: "imageId",
  verdict: "verdict",
};

/**
 * Cartões do journal: campo + valor de exemplo exibido. `display` é null quando o exemplo não traz
 * o valor (hoje, `schema_version`); `full` só existe quando o dado completo está em evidence.json.
 */
export function getJournalCards() {
  const example = evidence.journalExamplePass;
  return getJournalFields().map((field) => {
    const key = JOURNAL_EXAMPLE_KEY[field.name] ?? null;
    const value = key ? example[key] : null;
    const isHash = value !== null && typeof value === "object";
    return {
      ...field,
      isVerdict: field.name === "verdict",
      display: isHash ? value.display : typeof value === "string" ? value : null,
      full: isHash ? value.full : null,
    };
  });
}

/** Valores exibidos do journal de exemplo. `full` é null quando o valor completo não foi obtido. */
export function getJournalExample() {
  return evidence.journalExamplePass;
}

export function getFundingTxs() {
  return Object.fromEntries(
    Object.entries(evidence.fundingTxs).map(([step, tx]) => [
      step,
      { signature: tx.signature, txUrl: explorerTxUrl(tx.signature) },
    ]),
  );
}
