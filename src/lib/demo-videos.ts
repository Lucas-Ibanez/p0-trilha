/**
 * URLs dos vídeos da demo (D6, decidido em 2026-10-15). Os padrões são os vídeos oficiais; as
 * variáveis de ambiente `NEXT_PUBLIC_DEMO_*_URL` sobrescrevem, e um valor vazio desliga o slot
 * (estado "em breve"). Lido também por next.config.ts para montar a CSP.
 *
 * Os nomes seguem docs/06 §5.6: `technical` é o vídeo "Demo"; `full` (tomada completa) ainda não existe.
 * Sem importar nada com alias `@/`, porque o next.config.ts importa este arquivo.
 */
export const demoVideoUrls = {
  technical:
    process.env.NEXT_PUBLIC_DEMO_TECHNICAL_URL ?? "https://www.youtube.com/watch?v=AmIFw_lY8Ck",
  pitch: process.env.NEXT_PUBLIC_DEMO_PITCH_URL ?? "https://www.youtube.com/watch?v=1nEBPdJG-8o",
  full: process.env.NEXT_PUBLIC_DEMO_FULL_URL ?? "",
} as const;

export type DemoSlotId = keyof typeof demoVideoUrls;
