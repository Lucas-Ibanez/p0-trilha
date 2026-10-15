"use client";

import { useEffect } from "react";
import { track, type TrackEvent } from "@/lib/track";

/**
 * Um único ouvinte de clique para os eventos de analytics (docs/01 §5.3). Os links e botões do
 * servidor só carregam `data-track` (e `data-track-id`), então não precisam ser componentes
 * cliente. `track()` segue sem efeito até a decisão D8.
 */
export function ClickTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const element = (event.target as Element | null)?.closest<HTMLElement>("[data-track]");
      if (!element) return;
      const name = element.dataset.track;
      const id = element.dataset.trackId;

      if (name === "explorer_click" && id) {
        track({ name, props: { outcomeId: id } });
      } else if (name === "cta_demo_click" || name === "cta_waitlist_click") {
        track({ name } satisfies TrackEvent);
      }
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
