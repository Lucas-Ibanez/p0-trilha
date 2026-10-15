/**
 * Célula (hexágono): regular, vértice para cima, cantos discretamente arredondados, contorno de
 * espessura constante (docs/04 §4). É sempre a mesma forma: o resultado nunca muda a célula.
 */

type Point = { x: number; y: number };

function vertices(cx: number, cy: number, r: number): Point[] {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = ((-90 + 60 * i) * Math.PI) / 180;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
}

function toward(from: Point, to: Point, distance: number): Point {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy);
  return { x: from.x + (dx / length) * distance, y: from.y + (dy / length) * distance };
}

const f = (n: number) => n.toFixed(2);

export function hexPath(cx: number, cy: number, r: number, round = 4): string {
  const pts = vertices(cx, cy, r);
  const parts = pts.map((p, i) => {
    const prev = pts[(i + 5) % 6]!;
    const next = pts[(i + 1) % 6]!;
    const a = toward(p, prev, round);
    const b = toward(p, next, round);
    return `${i === 0 ? "M" : "L"}${f(a.x)} ${f(a.y)}Q${f(p.x)} ${f(p.y)} ${f(b.x)} ${f(b.y)}`;
  });
  return `${parts.join("")}Z`;
}

/** Contorno parcial (o Trust Halo da seção de Visão): só `edges` dos 6 lados, sem preenchimento. */
export function hexPartialPath(cx: number, cy: number, r: number, edges: number[]): string {
  const pts = vertices(cx, cy, r);
  return edges
    .map((edge) => {
      const a = pts[edge % 6]!;
      const b = pts[(edge + 1) % 6]!;
      return `M${f(a.x)} ${f(a.y)}L${f(b.x)} ${f(b.y)}`;
    })
    .join("");
}

type CellProps = {
  cx: number;
  cy: number;
  r?: number;
  className?: string;
};

/** Mesma forma, mesmo estilo, em todos os estados (docs/02 §7.1). */
export function HexCell({ cx, cy, r = 34, className = "" }: CellProps) {
  return (
    <path
      d={hexPath(cx, cy, r)}
      fill="none"
      strokeWidth={3}
      strokeLinejoin="round"
      className={`stroke-primary ${className}`.trim()}
    />
  );
}
