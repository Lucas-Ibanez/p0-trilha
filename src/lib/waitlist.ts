import type { Locale } from "@/i18n/routing";

/**
 * Lista de espera, só front-end (D2, 2026-10-15): nada é enviado nem gravado.
 * Quando houver backend, só `submitWaitlist` muda e `WAITLIST_MODE` passa a "live"; o formulário,
 * a validação e os estados continuam como estão. O desenho do backend está em docs/06 §5.2–5.5.
 */
export const WAITLIST_MODE: "preview" | "live" = "preview";

export const EMAIL_MAX = 254;
export const COMPANY_MAX = 120;
export const USE_CASE_MAX = 500;
export const SOURCE_MAX = 120;

/** Versão do texto de consentimento registrada com o cadastro (docs/06 §5.3). */
export const CONSENT_VERSION = "preview-0";

export const segments = ["software_house", "job_platform", "other"] as const;
export type Segment = (typeof segments)[number];

export type WaitlistInput = {
  email: string;
  company: string;
  segment: string;
  useCase: string;
  consent: boolean;
};

export type WaitlistPayload = {
  email: string;
  company: string | null;
  segment: Segment;
  useCase: string | null;
  locale: Locale;
  consentVersion: string;
  source: string | null;
};

export type FieldError = "email" | "segment" | "consent";
export type ValidationResult =
  | { ok: true; value: Omit<WaitlistPayload, "locale" | "consentVersion" | "source"> }
  | { ok: false; errors: Partial<Record<FieldError, true>> };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isSegment(value: string): value is Segment {
  return (segments as readonly string[]).includes(value);
}

/** Normaliza (trim e minúsculas no e-mail) e valida. Mesmo contrato que o backend terá. */
export function validateWaitlist(input: WaitlistInput): ValidationResult {
  const email = input.email.trim().toLowerCase();
  const errors: Partial<Record<FieldError, true>> = {};

  if (email.length === 0 || email.length > EMAIL_MAX || !EMAIL_PATTERN.test(email)) {
    errors.email = true;
  }
  if (!isSegment(input.segment)) errors.segment = true;
  if (!input.consent) errors.consent = true;

  if (Object.keys(errors).length > 0 || !isSegment(input.segment)) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      email,
      company: input.company.trim().slice(0, COMPANY_MAX) || null,
      segment: input.segment,
      useCase: input.useCase.trim().slice(0, USE_CASE_MAX) || null,
    },
  };
}

/** Origem curta e sem dado pessoal: utm_* ou o domínio do referrer (docs/06 §5.1). */
export function readSource(): string | null {
  const params = new URLSearchParams(window.location.search);
  const utm = ["utm_source", "utm_medium", "utm_campaign"]
    .map((key) => params.get(key))
    .filter(Boolean)
    .join("/");
  if (utm) return utm.slice(0, SOURCE_MAX);

  try {
    const host = document.referrer ? new URL(document.referrer).hostname : "";
    return host ? host.slice(0, SOURCE_MAX) : null;
  } catch {
    return null;
  }
}

export type SubmitResult = { ok: true; mode: "preview" | "live" };

/**
 * PRÉVIA: descarta o payload. Não há rede, backend nem armazenamento (D2). A pausa curta só
 * deixa o estado "Enviando…" visível, para o fluxo ser testável como será de verdade.
 */
export async function submitWaitlist(payload: WaitlistPayload): Promise<SubmitResult> {
  void payload;
  await new Promise((resolve) => setTimeout(resolve, 400));
  return { ok: true, mode: "preview" };
}
