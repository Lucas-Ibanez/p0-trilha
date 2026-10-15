"use client";

import { useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { Locale } from "@/i18n/routing";
import { track } from "@/lib/track";
import {
  COMPANY_MAX,
  CONSENT_VERSION,
  EMAIL_MAX,
  USE_CASE_MAX,
  WAITLIST_MODE,
  readSource,
  segments,
  submitWaitlist,
  validateWaitlist,
  type FieldError,
  type Segment,
} from "@/lib/waitlist";

type Status = "idle" | "submitting" | "success" | "error";

const segmentKey: Record<Segment, "sh" | "jp" | "ot"> = {
  software_house: "sh",
  job_platform: "jp",
  other: "ot",
};

const fieldClass =
  "rounded-control border-primary bg-card text-primary min-h-12 w-full border px-4 py-3 aria-[invalid=true]:border-2";
const labelClass = "text-label block font-semibold";
const hintClass = "text-caption text-secondary mt-1";
const errorClass = "text-label mt-1 font-semibold";

/**
 * Lista de espera, só front-end (D2): valida no cliente e mostra todos os estados, mas não envia
 * nada. O aviso de prévia é visível e a interface nunca afirma que algo foi gravado.
 * Sem JS o formulário não faz nada (method="dialog" fora de <dialog> é inerte), e o <noscript> avisa.
 */
export type WaitlistLabels = {
  preview: {
    badge: string;
    notice: string;
    successTitle: string;
    successBody: string;
    reset: string;
  };
  noscript: string;
  email: string;
  company: string;
  segment: { label: string; sh: string; jp: string; ot: string };
  usecase: { label: string; hint: string };
  submit: string;
  submitting: string;
  error: { summary: string; generic: string; email: string; segment: string; consent: string };
};

type Props = {
  labels: WaitlistLabels;
  /** Texto de consentimento já renderizado no servidor (marcação rica do next-intl). */
  consent: React.ReactNode;
  locale: Locale;
};

export function WaitlistForm({ labels, consent, locale }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Partial<Record<FieldError, true>>>({});
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const preview = WAITLIST_MODE === "preview";

  const errorSummary = (Object.keys(errors) as FieldError[]).map((field) => ({
    field,
    message: labels.error[field],
  }));

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const data = new FormData(event.currentTarget);
    const result = validateWaitlist({
      email: String(data.get("email") ?? ""),
      company: String(data.get("company") ?? ""),
      segment: String(data.get("segment") ?? ""),
      useCase: String(data.get("useCase") ?? ""),
      consent: data.get("consent") === "on",
    });

    if (!result.ok) {
      setErrors(result.errors);
      setStatus("idle");
      track({ name: "waitlist_submit_error" });
      // Espera o resumo de erros existir no DOM antes de mover o foco.
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setErrors({});
    setStatus("submitting");
    try {
      await submitWaitlist({
        ...result.value,
        locale,
        consentVersion: CONSENT_VERSION,
        source: readSource(),
      });
      setStatus("success");
      track({ name: "waitlist_submit_success" });
      requestAnimationFrame(() => successRef.current?.focus());
    } catch {
      setStatus("error");
      track({ name: "waitlist_submit_error" });
      requestAnimationFrame(() => summaryRef.current?.focus());
    }
  }

  if (status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="rounded-card border-primary bg-subtle border-2 p-6"
      >
        <h3 className="text-h3 font-semibold">{labels.preview.successTitle}</h3>
        <p className="mt-2">{labels.preview.successBody}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="rounded-control border-primary mt-4 min-h-11 border-2 px-4 font-semibold"
        >
          {labels.preview.reset}
        </button>
      </div>
    );
  }

  const submitting = status === "submitting";
  const showErrors = errorSummary.length > 0 || status === "error";

  return (
    <form method="dialog" noValidate onSubmit={onSubmit} className="space-y-6">
      {preview ? (
        <div className="rounded-card border-primary border-2 p-4">
          <Badge>{labels.preview.badge}</Badge>
          <p className="mt-2">{labels.preview.notice}</p>
        </div>
      ) : null}

      <noscript>
        <p className="font-semibold">{labels.noscript}</p>
      </noscript>

      <div
        ref={summaryRef}
        tabIndex={-1}
        role={showErrors ? "alert" : undefined}
        className={showErrors ? "rounded-card border-primary border-2 p-4" : "sr-only"}
      >
        {showErrors ? (
          status === "error" ? (
            <p className="font-semibold">{labels.error.generic}</p>
          ) : (
            <>
              <p className="font-semibold">{labels.error.summary}</p>
              <ul className="mt-2 list-disc pl-5">
                {errorSummary.map(({ field, message }) => (
                  <li key={field}>
                    <a
                      href={`#waitlist-${field}`}
                      onClick={(event) => {
                        event.preventDefault();
                        const target =
                          field === "segment"
                            ? document.querySelector<HTMLElement>("input[name=segment]")
                            : document.getElementById(`waitlist-${field}`);
                        target?.focus();
                      }}
                      className="underline underline-offset-4"
                    >
                      {message}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )
        ) : null}
      </div>

      <div>
        <label htmlFor="waitlist-email" className={labelClass}>
          {labels.email}
        </label>
        <input
          id="waitlist-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          maxLength={EMAIL_MAX}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "waitlist-email-error" : undefined}
          className={`${fieldClass} mt-2`}
        />
        {errors.email ? (
          <p id="waitlist-email-error" className={errorClass}>
            {labels.error.email}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="waitlist-company" className={labelClass}>
          {labels.company}
        </label>
        <input
          id="waitlist-company"
          name="company"
          type="text"
          autoComplete="organization"
          maxLength={COMPANY_MAX}
          className={`${fieldClass} mt-2`}
        />
      </div>

      <fieldset
        id="waitlist-segment"
        aria-describedby={errors.segment ? "waitlist-segment-error" : undefined}
      >
        <legend className={labelClass}>{labels.segment.label}</legend>
        <div className="mt-2 space-y-2">
          {segments.map((segment) => (
            <label
              key={segment}
              className="rounded-control border-soft bg-card flex min-h-12 cursor-pointer items-center gap-3 border px-4 py-2"
            >
              <input
                type="radio"
                name="segment"
                value={segment}
                className="size-5 shrink-0 accent-[var(--text-primary)]"
              />
              <span>{labels.segment[segmentKey[segment]]}</span>
            </label>
          ))}
        </div>
        {errors.segment ? (
          <p id="waitlist-segment-error" className={errorClass}>
            {labels.error.segment}
          </p>
        ) : null}
      </fieldset>

      <div>
        <label htmlFor="waitlist-usecase" className={labelClass}>
          {labels.usecase.label}
        </label>
        <textarea
          id="waitlist-usecase"
          name="useCase"
          rows={3}
          maxLength={USE_CASE_MAX}
          aria-describedby="waitlist-usecase-hint"
          className={`${fieldClass} mt-2`}
        />
        <p id="waitlist-usecase-hint" className={hintClass}>
          {labels.usecase.hint}
        </p>
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            id="waitlist-consent"
            name="consent"
            type="checkbox"
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? "waitlist-consent-error" : undefined}
            className="mt-1 size-5 shrink-0 accent-[var(--text-primary)]"
          />
          <span>{consent}</span>
        </label>
        {errors.consent ? (
          <p id="waitlist-consent-error" className={errorClass}>
            {labels.error.consent}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="bg-action text-on-action rounded-control min-h-12 w-full px-6 font-semibold transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-auto"
      >
        {submitting ? labels.submitting : labels.submit}
      </button>

      <p role="status" aria-live="polite" className="sr-only">
        {submitting ? labels.submitting : ""}
      </p>
    </form>
  );
}
