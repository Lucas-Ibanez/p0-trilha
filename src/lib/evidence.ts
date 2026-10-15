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

export function getJournalFields() {
  return evidence.journalFields.map((field) => ({
    ...field,
    gloss: field.gloss as Localized,
  }));
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
