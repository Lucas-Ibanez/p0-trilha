/** Eventos de docs/01-brief.md §5.3. Sem dados pessoais nos props. */
export type TrackEvent =
  | { name: "cta_demo_click" }
  | { name: "cta_waitlist_click" }
  | { name: "demo_play" }
  | { name: "waitlist_submit_success" }
  | { name: "waitlist_submit_error" }
  | { name: "explorer_click"; props: { outcomeId: string } }
  | { name: "language_switch"; props: { to: string } };

/** No-op até a decisão D8 (analytics). Quando houver provedor, só esta função muda. */
export function track(event: TrackEvent): void {
  void event;
}
