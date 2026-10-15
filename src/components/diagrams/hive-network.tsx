import { getTranslations } from "next-intl/server";
import { HexCell, hexPartialPath } from "@/components/diagrams/hex-cell";

/**
 * Peça D (docs/05 §5): a colmeia da visão. Seção inteira de classe Visão, rotulada, com legenda.
 * Regras de significado (docs/02 §7): células idênticas (ninguém é "mais confiável"), espessura
 * uniforme em todas as linhas, e só dois estados desenhados: evidência neste contexto (Trust Halo
 * parcial) e ainda sem evidência (tracejado). Proximidade entre células não significa confiança.
 */

const R = 34;
const STROKE = 3;
const HALO_GAP = 12;

type Node = { id: string; letter: string; x: number; y: number };
type Link = {
  from: string;
  to: string;
  context: "review" | "deploy" | "data";
  state: "plain" | "evidence" | "none";
};
type Layout = { width: number; height: number; nodes: Node[]; links: Link[] };

const full: Layout = {
  width: 640,
  height: 340,
  nodes: [
    { id: "a", letter: "A", x: 70, y: 170 },
    { id: "b", letter: "B", x: 290, y: 80 },
    { id: "c", letter: "C", x: 290, y: 260 },
    { id: "d", letter: "D", x: 550, y: 80 },
    { id: "e", letter: "E", x: 550, y: 260 },
  ],
  links: [
    { from: "a", to: "b", context: "review", state: "evidence" },
    { from: "a", to: "c", context: "deploy", state: "none" },
    { from: "b", to: "d", context: "data", state: "plain" },
    { from: "c", to: "e", context: "data", state: "plain" },
  ],
};

const compact: Layout = {
  width: 320,
  height: 340,
  nodes: [
    { id: "a", letter: "A", x: 60, y: 170 },
    { id: "b", letter: "B", x: 260, y: 70 },
    { id: "c", letter: "C", x: 260, y: 270 },
  ],
  links: [
    { from: "a", to: "b", context: "review", state: "evidence" },
    { from: "a", to: "c", context: "deploy", state: "none" },
  ],
};

const f = (n: number) => n.toFixed(1);

function geometry(a: Node, b: Node) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length = Math.hypot(dx, dy);
  const ux = dx / length;
  const uy = dy / length;
  const startGap = R + 8;
  const tipGap = R + 8; // a ponta da seta para antes da célula (e do halo parcial)
  const headLength = 12;
  const x1 = a.x + ux * startGap;
  const y1 = a.y + uy * startGap;
  const tipX = b.x - ux * tipGap;
  const tipY = b.y - uy * tipGap;
  const x2 = tipX - ux * headLength;
  const y2 = tipY - uy * headLength;
  const nx = -uy * 7;
  const ny = ux * 7;
  return {
    line: `M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}`,
    head: `M${f(x2 + nx)} ${f(y2 + ny)}L${f(tipX)} ${f(tipY)}L${f(x2 - nx)} ${f(y2 - ny)}Z`,
    mid: { x: (x1 + x2) / 2, y: (y1 + y2) / 2 },
  };
}

async function Network({ layout, ariaLabel }: { layout: Layout; ariaLabel: string }) {
  const t = await getTranslations("hive.fig");
  const byId = new Map(layout.nodes.map((node) => [node.id, node]));

  return (
    <svg
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      role="img"
      aria-label={ariaLabel}
      className="mx-auto h-auto w-full"
    >
      {layout.links.map((link) => {
        const from = byId.get(link.from)!;
        const to = byId.get(link.to)!;
        const { line, head, mid } = geometry(from, to);
        const dashed = link.state === "none";

        return (
          <g key={`${link.from}-${link.to}`}>
            <path
              d={line}
              pathLength={1}
              fill="none"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={dashed ? "6 7" : undefined}
              className={`${dashed ? "hn-fade stroke-secondary" : "hn-link stroke-primary"}`}
            />
            <path
              d={head}
              fill="none"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`hn-fade ${dashed ? "stroke-secondary" : "stroke-primary"}`}
            />
            {link.state === "evidence" ? (
              <path
                d={hexPartialPath(to.x, to.y, R + HALO_GAP, [0, 1, 2, 3])}
                fill="none"
                strokeWidth={STROKE}
                strokeLinecap="round"
                className="hn-fade stroke-action"
              />
            ) : null}
            <text
              x={mid.x}
              y={mid.y - 10}
              textAnchor="middle"
              paintOrder="stroke"
              strokeWidth={6}
              strokeLinejoin="round"
              className="hn-fade text-caption fill-primary stroke-page font-semibold"
            >
              {t(`ctx.${link.context}`)}
            </text>
          </g>
        );
      })}

      {layout.nodes.map((node) => (
        <g key={node.id}>
          <HexCell cx={node.x} cy={node.y} r={R} />
          <text
            x={node.x}
            y={node.y + R + HALO_GAP + 20}
            textAnchor="middle"
            className="text-caption fill-secondary"
          >
            {t("agent", { letter: node.letter })}
          </text>
        </g>
      ))}
    </svg>
  );
}

function LegendSwatch({ kind }: { kind: "evidence" | "none" }) {
  return (
    <svg viewBox="0 0 48 20" aria-hidden="true" className="h-5 w-12 shrink-0">
      {kind === "evidence" ? (
        <>
          <path d="M2 10H34" strokeWidth={3} strokeLinecap="round" className="stroke-primary" />
          <path
            d="M40 3L45 6.5V13.5L40 17"
            fill="none"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-action"
          />
        </>
      ) : (
        <path
          d="M2 10H40"
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray="5 6"
          className="stroke-secondary"
        />
      )}
    </svg>
  );
}

export async function HiveNetwork() {
  const t = await getTranslations("hive");

  return (
    <figure data-reveal data-draw className="mx-auto mt-12 max-w-3xl">
      <div className="hidden md:block">
        <Network layout={full} ariaLabel={t("fig.alt")} />
      </div>
      <div className="mx-auto max-w-sm md:hidden">
        <Network layout={compact} ariaLabel={t("fig.altCompact")} />
      </div>

      <ul className="text-label mt-6 flex flex-wrap gap-x-8 gap-y-3">
        <li className="flex items-center gap-3">
          <LegendSwatch kind="evidence" />
          {t("legend.evidence")}
        </li>
        <li className="flex items-center gap-3">
          <LegendSwatch kind="none" />
          {t("legend.none")}
        </li>
      </ul>
      <figcaption className="text-caption text-secondary mt-4">{t("caption")}</figcaption>
    </figure>
  );
}
