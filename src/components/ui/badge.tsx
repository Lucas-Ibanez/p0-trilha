/** Selo de classe de afirmação (Hoje / Planejado / Visão). Texto sempre; nunca só cor ou ícone. */
export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-pill border-primary text-primary text-caption inline-flex items-center border px-3 py-1 font-semibold">
      {children}
    </span>
  );
}
