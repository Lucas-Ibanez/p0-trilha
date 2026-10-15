"use client";

import { useId, useRef, useState, useSyncExternalStore } from "react";

export type TabItem = {
  id: string;
  /** Rótulo do botão da aba. */
  label: React.ReactNode;
  /** Conteúdo do painel (já renderizado no servidor). */
  panel: React.ReactNode;
  /** Título mostrado só enquanto o JS não está ativo, quando as abas não existem. */
  fallbackTitle?: React.ReactNode;
};

type Props = {
  items: TabItem[];
  ariaLabel: string;
  orientation?: "horizontal" | "vertical";
  /** Estilo dos botões: "segmented" (controle compacto) ou "steps" (lista de passos). */
  variant?: "segmented" | "steps";
  className?: string;
  listClassName?: string;
  panelsClassName?: string;
};

/* false no servidor e na hidratação, true depois: liga as abas sem setState em effect. */
const subscribe = () => () => {};
const useEnhanced = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

const listBase = {
  segmented: "rounded-control border-soft flex flex-wrap gap-1 border p-1",
  steps: "flex flex-col gap-2",
};

const tabBase = {
  segmented:
    "rounded-control text-label min-h-11 flex-auto px-3 py-2 text-center font-semibold transition-colors",
  steps:
    "rounded-control border-soft text-left min-h-11 w-full border px-4 py-3 font-semibold transition-colors",
};

/**
 * Abas no padrão WAI-ARIA (setas, Home/End). Sem JS, todos os painéis aparecem empilhados
 * com o título de reserva: o conteúdo continua legível (docs/05 §0, estado final primeiro).
 */
export function Tabs({
  items,
  ariaLabel,
  orientation = "horizontal",
  variant = "segmented",
  className = "",
  listClassName = "",
  panelsClassName = "",
}: Props) {
  const uid = useId();
  const [active, setActive] = useState(0);
  const enhanced = useEnhanced();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const focusTab = (index: number) => {
    const next = (index + items.length) % items.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const prevKey = orientation === "vertical" ? "ArrowUp" : "ArrowLeft";
    const nextKey = orientation === "vertical" ? "ArrowDown" : "ArrowRight";
    if (event.key === nextKey) focusTab(active + 1);
    else if (event.key === prevKey) focusTab(active - 1);
    else if (event.key === "Home") focusTab(0);
    else if (event.key === "End") focusTab(items.length - 1);
    else return;
    event.preventDefault();
  };

  return (
    <div data-enhanced={enhanced} className={`group ${className}`.trim()}>
      <div
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation={orientation}
        onKeyDown={onKeyDown}
        className={`hidden group-data-[enhanced=true]:flex ${listBase[variant]} ${listClassName}`.trim()}
      >
        {items.map((item, index) => {
          const selected = index === active;
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={`${uid}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${uid}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              className={`${tabBase[variant]} ${
                selected ? "bg-primary text-page" : "text-primary hover:bg-subtle"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className={panelsClassName}>
        {items.map((item, index) => (
          <div
            key={item.id}
            role={enhanced ? "tabpanel" : undefined}
            id={`${uid}-panel-${item.id}`}
            aria-labelledby={enhanced ? `${uid}-tab-${item.id}` : undefined}
            tabIndex={enhanced ? 0 : undefined}
            hidden={enhanced && index !== active}
            className="mb-8 last:mb-0 group-data-[enhanced=true]:mb-0"
          >
            {item.fallbackTitle ? (
              <div className="group-data-[enhanced=true]:hidden">{item.fallbackTitle}</div>
            ) : null}
            {item.panel}
          </div>
        ))}
      </div>
    </div>
  );
}
