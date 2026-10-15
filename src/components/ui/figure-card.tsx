type Props = {
  caption: string;
  children: React.ReactNode;
};

/** Cartão de figura montada com dados reais; a legenda diz que é ilustração (docs/04 §7). */
export function FigureCard({ caption, children }: Props) {
  return (
    <figure className="rounded-card border-soft bg-card border p-5 md:p-6">
      {children}
      <figcaption className="text-caption text-secondary mt-5">{caption}</figcaption>
    </figure>
  );
}

export function FigureRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-soft border-t py-3 first:border-t-0 first:pt-0 last:pb-0">
      <dt className="text-caption text-secondary">{label}</dt>
      <dd className="mt-1">{children}</dd>
    </div>
  );
}

/** Identificador técnico (hash, instrução, nome de erro): mono, com quebra segura em telas estreitas. */
export function Mono({ children }: { children: React.ReactNode }) {
  return <span className="font-mono text-mono break-all">{children}</span>;
}
