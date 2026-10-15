"use client";

import { useState } from "react";
import { CopyButton } from "@/components/ui/copy-button";

export type JournalCardData = {
  name: string;
  startsAt: string;
  bytes: number;
  /** Valor truncado exibido, ou null quando o exemplo não traz o campo. */
  display: string | null;
  /** Valor completo, só quando existe em evidence.json. */
  full: string | null;
  /** Rótulo do veredito (ex.: "Criteria met · PASS"); presente só no campo `verdict`. */
  verdictLabel: string | null;
  gloss: string;
};

type Props = {
  cards: JournalCardData[];
  barLabel: string;
  noExample: string;
  fullInRepo: string;
  copyLabel: string;
  copiedLabel: string;
  /** Texto com o marcador {name}, por exemplo "Copiar {name}". */
  copyAriaTemplate: string;
};

/**
 * Peça B (docs/05 §3): os 7 campos do journal de 165 bytes. A barra mostra a largura de cada
 * campo; ao passar o mouse ou focar um cartão, o trecho correspondente fica em destaque.
 * O destaque é aubergine sobre lilás (não âmbar: âmbar sobre claro não tem contraste, 04 §2.4).
 */
export function JournalCards({
  cards,
  barLabel,
  noExample,
  fullInRepo,
  copyLabel,
  copiedLabel,
  copyAriaTemplate,
}: Props) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <>
      <div role="img" aria-label={barLabel} className="mt-6 flex h-2 gap-0.5">
        {cards.map((card, index) => (
          <span
            key={card.name}
            aria-hidden="true"
            className={`rounded-pill transition-colors ${
              active === null || active === index ? "bg-primary" : "bg-soft"
            }`}
            style={{ flexGrow: card.bytes, flexBasis: 0 }}
          />
        ))}
      </div>

      {/* relative: sem isso, o span sr-only (absoluto) dos botões de cópia escapa do clip e alarga a página. */}
      <ul className="relative -mx-[var(--gutter)] mt-6 flex scroll-px-[var(--gutter)] snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-2 md:static md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-4">
        {cards.map((card, index) => (
          <li
            key={card.name}
            tabIndex={0}
            aria-label={card.name}
            onMouseEnter={() => setActive(index)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(index)}
            onBlur={() => setActive(null)}
            className={`rounded-card bg-card flex min-w-[15rem] shrink-0 snap-start flex-col gap-2 border p-4 md:min-w-0 ${
              active === index ? "border-primary" : "border-soft"
            }`}
          >
            <p className="font-mono text-caption text-secondary">{card.startsAt}</p>
            <p className="font-mono text-label">{card.name}</p>
            {card.verdictLabel ? (
              <p className="font-semibold">{card.verdictLabel}</p>
            ) : card.display ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-mono break-all">{card.display}</span>
                {card.full ? (
                  <CopyButton
                    value={card.full}
                    label={copyLabel}
                    copiedLabel={copiedLabel}
                    ariaLabel={copyAriaTemplate.replace("{name}", card.name)}
                  />
                ) : null}
              </div>
            ) : (
              <p className="text-caption text-secondary">{noExample}</p>
            )}
            {card.display && !card.verdictLabel && !card.full ? (
              <p className="text-caption text-secondary">{fullInRepo}</p>
            ) : null}
            <p className="text-caption text-secondary mt-auto">{card.gloss}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
