"use client";

import { useEffect } from "react";

/**
 * Revelação ao rolar (docs/05 §6): opacidade + deslocamento ≤ 12 px, uma vez.
 * Só "arma" elementos que ainda estão abaixo da dobra; o que já está visível, e tudo com
 * prefers-reduced-motion, fica no estado final. Sem JS também fica no estado final.
 * Elementos marcados com data-reveal; o CSS está em globals.css.
 */
export function RevealObserver() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const targets = [...document.querySelectorAll<HTMLElement>("[data-reveal]")].filter(
      (el) => el.getBoundingClientRect().top > window.innerHeight,
    );
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.revealed = "true";
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    for (const el of targets) {
      el.dataset.armed = "true";
      observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return null;
}
