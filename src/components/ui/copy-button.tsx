"use client";

import { useEffect, useState } from "react";

type Props = {
  value: string;
  label: string;
  copiedLabel: string;
  /** Nome acessível completo, por exemplo "Copiar image_id". */
  ariaLabel: string;
};

export function CopyButton({ value, label, copiedLabel, ariaLabel }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <>
      <button
        type="button"
        aria-label={ariaLabel}
        onClick={() => {
          navigator.clipboard
            .writeText(value)
            .then(() => setCopied(true))
            .catch(() => setCopied(false));
        }}
        className="rounded-control border-primary text-caption inline-flex min-h-11 items-center border px-3 font-semibold"
      >
        {copied ? copiedLabel : label}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? copiedLabel : ""}
      </span>
    </>
  );
}
