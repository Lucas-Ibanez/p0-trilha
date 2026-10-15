# Hive: landing page

Repositório da landing page bilíngue (EN e PT-BR) da **Hive**, a camada de confiança entre agentes. Next.js (App Router) + TypeScript + Tailwind v4 + next-intl.

> **Leia [CLAUDE.md](CLAUDE.md) primeiro.** Ele define a missão, os inegociáveis, a ordem de leitura dos documentos e o protocolo por fases.

## Status

**Fase 0 concluída** (scaffold, tokens, fontes, i18n, `evidence.json` importável, scripts de verificação). **Fase 1 (seções estáticas) ainda não iniciada.**

Decisões fechadas em 2026-10-15: **D1** manter a stack padrão; **D2** a lista de espera é só front-end, sem backend por ora (ver `docs/09-acceptance-and-open-decisions.md`).

## Como rodar

Requer Node 20.9 ou superior.

```bash
npm install
npm run dev          # http://localhost:3000 (redireciona para /en ou /pt-br)
npm run build        # roda os checks e gera as rotas estáticas
npm run check        # claims, i18n, evidência e tokens
npm run lint && npm run typecheck
cp .env.example .env.local   # opcional; todas as variáveis são públicas e podem ficar vazias
```

## Mapa das pastas

| Pasta | Conteúdo |
|---|---|
| `CLAUDE.md` | Ponto de entrada: regras e protocolo de trabalho |
| `docs/` | Documentos 01 a 09 (brief, claims, conteúdo, design, visuais, engenharia, referências, fatos, aceite) |
| `docs/sources/` | Fontes originais somente leitura: PDF de posicionamento e identidade (2026-10-05) e preview do logo provisório |
| `data/` | `evidence.json` (fonte única de fatos) e `forbidden-terms.json` (termos proibidos) |
| `messages/` | Dicionários `en.json` e `pt-br.json` (mesmas chaves) |
| `src/app/[locale]/` | Layout e página por idioma |
| `src/components/` | `sections/` (header, footer), `ui/`, `diagrams/` |
| `src/i18n/` | Rotas, navegação e carregamento de mensagens (next-intl) |
| `src/lib/` | `evidence` (único ponto de acesso aos fatos), `format`, `track` (no-op), `brand`, `theme-color` |
| `src/styles/` | `tokens.css` (único lugar com valores de identidade) e `globals.css` |
| `scripts/` | `check-claims`, `check-i18n`, `check-evidence`, `check-tokens` |
| `public/brand/` | Logos SVG (provisórios, aprovados por ora); nomes e usos em [`MANIFEST.md`](public/brand/MANIFEST.md). `_alt/` guarda alternativas; `fonts/` as fontes auto-hospedadas (OFL) |
| `public/media/`, `public/og/` | Capturas/pôsteres e imagens OG (vazias por enquanto) |

## Aviso sobre os dados

Os dados de `data/evidence.json` vêm do relatório de **2026-10-07** (commit `faad06c`). Confira no repositório do MVP se algo mudou antes de publicar.
