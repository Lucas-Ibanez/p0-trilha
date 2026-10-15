# Hive: landing page

Repositório da landing page bilíngue (EN e PT-BR) da **Hive**, a camada de confiança entre agentes. Aqui ficam o contexto, os dados de evidência e os ativos de marca; o código da página ainda não existe.

> **Leia [CLAUDE.md](CLAUDE.md) primeiro.** Ele define a missão, os inegociáveis, a ordem de leitura dos documentos e o protocolo por fases.

## Mapa das pastas

| Pasta | Conteúdo |
|---|---|
| `CLAUDE.md` | Ponto de entrada: regras e protocolo de trabalho |
| `docs/` | Documentos 01 a 09 (brief, claims, conteúdo, design, visuais, engenharia, referências, fatos, aceite) |
| `docs/sources/` | Fontes originais somente leitura: PDF de posicionamento e identidade (2026-10-05) e preview do logo provisório |
| `data/` | `evidence.json` (fonte única de fatos) e `forbidden-terms.json` (termos proibidos) |
| `public/brand/` | Logos SVG (provisórios, aprovados por ora); nomes e usos em [`MANIFEST.md`](public/brand/MANIFEST.md). `_alt/` guarda alternativas |
| `public/brand/fonts/` | Manrope e IBM Plex Mono auto-hospedadas (licença OFL) |
| `public/media/`, `public/og/` | Capturas/pôsteres e imagens OG (vazias por enquanto) |
| `messages/` | Dicionários `en.json` e `pt-br.json` (a criar na fase 0) |
| `scripts/` | Scripts de lint de claims, evidência e i18n (a criar na fase 0) |
| `supabase/migrations/` | SQL proposto da lista de espera; não aplicar sem aprovação |
| `src/` | Ainda não criada |

## Status

**Fase 0 ainda não iniciada.** Nenhum framework, dependência ou código foi instalado. As decisões D1 (stack) e D2 (backend da lista de espera) em `docs/09-acceptance-and-open-decisions.md` aguardam confirmação.

## Aviso sobre os dados

Os dados de `data/evidence.json` vêm do relatório de **2026-10-07** (commit `faad06c`). Confira no repositório do MVP se algo mudou antes de publicar.
