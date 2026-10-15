type Props = {
  id: string;
  /** id do título da seção (aria-labelledby). */
  labelledBy: string;
  surface?: "light" | "aubergine";
  children: React.ReactNode;
};

/** Banda da página: reatribui papéis de cor pela superfície (docs/04 §2.2). */
export function Section({ id, labelledBy, surface = "light", children }: Props) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-surface={surface === "aubergine" ? "aubergine" : undefined}
      className="bg-page text-primary"
    >
      <div className="container-page py-[var(--section-y)]">{children}</div>
    </section>
  );
}

export function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-h2 max-w-[24ch] font-semibold">
      {children}
    </h2>
  );
}
