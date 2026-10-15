# 06 — Engenharia

> Requisitos técnicos e padrões recomendados. O que é **requisito** está marcado como tal; o que é **padrão recomendado** pode ser trocado **desde que os requisitos continuem valendo** e o responsável aprove (D1).

## 1. Stack

### 1.1 Requisitos (valem para qualquer stack)

1. Deploy na **Vercel**.
2. Rotas por idioma `/en` e `/pt-br`, com `lang` correto, `hreflang` e metadados localizados.
3. Todas as strings em **dicionários** com chaves idênticas nos dois idiomas.
4. Valores de identidade apenas em **tokens CSS**.
5. **Página renderizada no servidor/estática** (conteúdo legível sem JS); JS só para interação.
6. Lista de espera com **backend seguro** (segredos só no servidor). **Suspenso por D2 (2026-10-15):** por ora é só front-end e não grava nada; ao existir backend, este requisito volta a valer.
7. Performance e acessibilidade conforme `09-…`.
8. Sem scripts de terceiros além dos aprovados (D8).

### 1.2 Padrão recomendado (se o repositório estiver vazio; confirmar antes de instalar)

| Camada | Escolha | Motivo |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | Vercel nativo, rotas por idioma, route handlers para a lista de espera, SSG por padrão |
| Estilo | **Tailwind CSS v4** com tokens em CSS variables (`@theme` apontando para `tokens.css`) | Velocidade sem valores soltos |
| i18n | **next-intl** (`/en`, `/pt-br`, middleware de detecção com fallback EN) | Padrão maduro com App Router |
| Validação | **zod** | Mesma validação no cliente e no servidor (instalar na fase 3, com o formulário) |
| Banco da lista | ~~Supabase (Postgres)~~ **Nenhum por ora (D2)** | Lista de espera só front-end; Supabase fica como desenho de referência em §5 |
| Fontes | `next/font/local` (Manrope variável, IBM Plex Mono) | Auto-hospedagem, sem CDN |
| Movimento | CSS/SVG; `motion` só se justificar | Orçamento de JS |
| Testes | Playwright (smoke e a11y com axe), Vitest (unidade) | |
| Qualidade | ESLint, Prettier, `tsc --noEmit`, scripts de claims/evidência | |

Alternativa aceitável: Astro com i18n nativo e ilhas, se o responsável preferir menos JS. Os requisitos de §1.1 são os mesmos.

### 1.3 Stack instalada na fase 0 (D1 decidido em 2026-10-15)

Versões fixas (`--save-exact`). Não instaladas ainda, por falta de necessidade: **zod** (a validação do formulário é uma função tipada em `src/lib/waitlist.ts`; zod só se justifica quando houver backend para compartilhar o schema), **Playwright** e **Vitest** (testes, a partir da fase 1), `motion` (só se justificar).

| Pacote | Versão | Nota |
|---|---|---|
| next | 16.4.1 | App Router, Turbopack. No Next 16 o antigo `middleware.ts` chama-se `proxy.ts` |
| react, react-dom | 19.3.1 | |
| next-intl | 4.14.9 | Rotas `/en` e `/pt-br`, cookie `hive_lang` |
| tailwindcss, @tailwindcss/postcss | 4.3.3 | Paleta, tamanhos e breakpoints padrão apagados em `globals.css`; só papéis de `tokens.css` |
| typescript | 6.0.3 | **Não usar o 7.x**: `typescript-eslint` ainda não o suporta (exige `<6.1`) |
| eslint, eslint-config-next | 10.12.0, 16.4.1 | |
| prettier | 3.9.10 | Ignora `docs/`, `CLAUDE.md`, `README.md`, `data/` e `public/brand/` |

Ferramentas de teste e medição (fase 4, só dev): `@playwright/test` 1.64.1 e `@axe-core/playwright` 4.14.0, usando o Edge ou o Chrome já instalados (`PW_CHANNEL`; nenhum navegador é baixado). Lighthouse roda via `npx lighthouse@13.5.0` sem entrar no `package.json`. Vitest **não** foi instalado: os testes de unidade usam o `node --test` embutido (`npm run test:unit`).

Ressalvas conhecidas:

- **JS inicial acima de 120 KB.** Medido: ~144 KB gzip por rota; só `react-dom` (71 KB) e o runtime do Next (50 KB) já somam ~121 KB. O código da página soma ~23 KB. A meta de §8 não é alcançável com Next App Router; ver `09` (decisão sobre o orçamento). Para reduzir: o cliente não carrega mais `next-intl` nem `next/image` (strings entram por props, rastreio por `data-track`).
- **CSP com `'unsafe-inline'` em `script-src`.** As páginas são estáticas (SSG): não há nonce por requisição, e o Next injeta scripts inline de hidratação. Todo o resto é fechado (ver `next.config.ts`; só vale em produção, o dev precisa de `eval`).
- `experimental.inlineCss` está ligado (CSS no `<head>`): tirou ~0,3 s do LCP simulado.

- `npm audit` acusa 5 vulnerabilidades **altas, só em ferramenta de lint (dev)**, na cadeia `eslint-config-next` → `braces` (ReDoS). `npm audit --omit=dev` dá 0. Não afetam o site publicado; reavaliar ao atualizar o `eslint-config-next`.
- Fontes: `next/font/local` com **apenas o subconjunto `latin`** (cobre EN e PT-BR). Os arquivos `latin-ext` continuam em `public/brand/fonts/` sem uso. O glifo `₃` (usado em rótulos como `P₃`) não está no `latin`: se a fase 1 exibir esses rótulos, validar a fonte de reserva ou incluir `latin-ext`.
- O cookie `hive_lang` é gravado pelo seletor de idioma ao clicar (a escolha manual), não pela detecção.

## 2. Estrutura do repositório (sugestão)

```
/
├─ CLAUDE.md
├─ docs/                       # estes documentos (+ docs/sources/ com os PDFs, opcional)
├─ data/
│  └─ evidence.json            # fonte única de fatos (ver 08-facts.md)
├─ public/
│  ├─ brand/                   # logos SVG (a organizar; listar antes de usar; nomes em brand/MANIFEST.md, fonte da verdade)
│  ├─ media/                   # capturas reais (avif/webp) e pôsteres de vídeo
│  └─ og/                      # og-en.png, og-pt-br.png
├─ messages/
│  ├─ en.json
│  └─ pt-br.json
├─ scripts/
│  ├─ check-claims.mjs         # lint de proibidos (02-…)
│  ├─ check-evidence.mjs       # Explorer com cluster=devnet; endereços/ids conferem
│  └─ check-i18n.mjs           # mesmas chaves em en e pt-br; sem valores vazios
├─ src/
│  ├─ app/[locale]/(layout|page).tsx
│  ├─ i18n/{routing,navigation,request}.ts   # next-intl
│  ├─ proxy.ts                 # detecção de idioma (Next 16: antigo middleware)
│  ├─ components/{ui,sections,diagrams}/
│  ├─ lib/{evidence,waitlist,track,format,brand,theme-color}.ts   # waitlist: fase 3, só front-end (D2)
│  └─ styles/{tokens.css,globals.css}
(supabase/migrations/ não existe: backend suspenso por D2)
```

## 3. i18n (requisito)

- **Rotas:** `/en/...` e `/pt-br/...`. `/` redireciona por `Accept-Language` (`pt*` → `/pt-br`; senão `/en`). Persistir a escolha manual em cookie (`hive_lang`, 1 ano, `SameSite=Lax`).
- **Seletor de idioma:** na navegação (`EN | PT`), troca a rota **preservando a âncora** (`#proof`), sem recarregar a posição do usuário se possível. Rótulo acessível "Idioma/Language".
- **SEO:** `<html lang="en">` / `lang="pt-BR"`; `<link rel="alternate" hreflang="en">`, `hreflang="pt-BR"`, `x-default` → `/en`; `canonical` por idioma; `sitemap.xml` com os dois.
- **Dicionários:** `messages/en.json` e `messages/pt-br.json`, **mesmas chaves**. `scripts/check-i18n.mjs` falha se faltar chave, se houver valor vazio ou se um valor for idêntico nos dois idiomas sem estar na lista de termos invariantes (`devnet`, `Test USDC`, `Groth16`…).
- **Formatação:** números e datas via `Intl` com o idioma da rota (`99,541` vs `99.541`; `7 de outubro de 2026` vs `October 7, 2026`). Nunca concatenar strings traduzidas: usar mensagens com placeholders e plurais ICU.
- **Marcação rica** (links dentro de frases, `<code>`): usar *rich text* do next-intl, não `dangerouslySetInnerHTML`.
- **Termos em inglês no PT-BR** conforme o glossário de `03-…` §2.
- **Slogan:** a versão do idioma, sem reescrever.
- **Expansão de texto:** PT-BR é ~15–25 % mais longo; testar quebras de linha em botões, cartões e tabela comparativa.

## 4. Dados e evidência (requisito)

- `src/lib/evidence.ts` importa `data/evidence.json` e exporta **funções tipadas** (`getOutcome('released')`, `getJournalFields()`, `explorerTxUrl(sig)`).
- `explorerTxUrl` e `explorerAddressUrl` **sempre** adicionam `?cluster=devnet`. Nenhum componente monta URL de Explorer manualmente.
- `scripts/check-evidence.mjs` (roda no CI e no `prebuild`):
  1. todo `explorerUrl` contém `cluster=devnet` e a assinatura corresponde à URL;
  2. os endereços batem com `08-facts.md`;
  3. `journalBytes === 165` e os offsets somam o esperado (`0,4,36,68,100,132,164`);
  4. nenhum campo `full` é preenchido com valor de tamanho errado (hash de 32 bytes = 64 hex).
- Valores **truncados** são mostrados como truncados; **não** completar de memória.

## 5. Lista de espera

> **D2 (2026-10-15): sem backend por ora.** Implementar só o front-end (formulário, validação no cliente, estados, acessibilidade) com uma função de envio isolada em `src/lib/waitlist.ts` que **não envia nada**; trocar só essa função quando houver backend. O formulário mostra um aviso visível de que é uma prévia e o cadastro ainda não é gravado; a interface nunca afirma que algo foi salvo nem promete contato. As subseções 5.2 a 5.5 descrevem o backend **suspenso** e servem de referência futura; 5.1 vale para o front-end.
>
> **Implementado (fase 3):** `src/components/sections/waitlist-form.tsx` (estados ocioso, enviando, sucesso de prévia, erro de campo com resumo focável e `aria-invalid`/`aria-describedby`, erro genérico) e `src/lib/waitlist.ts` (`validateWaitlist`, `submitWaitlist` que descarta o payload). **Degradação sem JS:** o formulário é inerte (`method="dialog"` fora de `<dialog>` não navega nem coloca o e-mail na URL) e um `<noscript>` avisa; não há POST sem backend. O vídeo da demo segue `§7` (`src/lib/demo.ts`, `video-slot.tsx`): YouTube vira `youtube-nocookie.com`, `.mp4/.webm` vira `<video preload="none">`, qualquer outro HTTPS vira link externo; tudo só depois do clique.

### 5.1 Requisitos funcionais

- Campos: e-mail (obrigatório), empresa (opcional), perfil (`software_house` | `job_platform` | `other`), o que delegaria primeiro (opcional, ≤ 500 caracteres), **consentimento** (obrigatório), idioma (preenchido automaticamente), origem (`utm_*`/referrer curto, opcional).
- Validação **no cliente e no servidor** (mesmo schema zod).
- Resposta de sucesso **idêntica** para e-mail novo e já cadastrado (não vazar quem está na lista).
- Estados: ocioso, enviando (botão desabilitado, rótulo "Enviando…"), sucesso, erro genérico, erro de campo. Mensagens em `join.*`. Região `aria-live="polite"` para status. Foco move para o resumo de erro ou para a mensagem de sucesso.
- Funciona **sem JS** como fallback (formulário `POST` para a rota), com redirecionamento a uma tela de sucesso localizada. Se isso custar demais, aceitar degradação com mensagem clara; registrar no relatório.

### 5.2 Anti-abuso (sem prejudicar a UX)

- **Honeypot** (campo oculto fora do fluxo de teclado e leitores de tela: `tabindex=-1`, `aria-hidden`, `autocomplete=off`).
- **Rate limit** por IP (hash do IP com *salt* de ambiente, janela curta). Sem CAPTCHA visível na v1; se houver abuso, Cloudflare Turnstile ou equivalente (D8).
- Tamanho máximo de corpo; recusar `Content-Type` inesperado; checar `Origin`.
- Normalização de e-mail (`trim`, `lower`).

### 5.3 Dados e privacidade (LGPD / GDPR — texto legal exige revisão humana, D9)

- Base legal: **consentimento explícito** por caixa **não pré-marcada**, com link para a política de privacidade e versão do texto de consentimento registrada (`consent_version`).
- Finalidade única: contato sobre acesso antecipado. Sem venda/compartilhamento. Canal para pedir exclusão (e-mail a definir, D9).
- Não registrar e-mail em logs, analytics ou mensagens de erro.
- Retenção: definir (D9).

### 5.4 Esquema SQL proposto (**propor, não aplicar em produção sem aprovação**)

```sql
-- supabase/migrations/0001_waitlist.sql
create table if not exists public.waitlist_signups (
  id               uuid primary key default gen_random_uuid(),
  email            text        not null check (char_length(email) <= 254),
  company          text        check (company is null or char_length(company) <= 120),
  segment          text        not null check (segment in ('software_house','job_platform','other')),
  use_case         text        check (use_case is null or char_length(use_case) <= 500),
  locale           text        not null check (locale in ('en','pt-br')),
  consent_version  text        not null,
  consent_at       timestamptz not null default now(),
  source           text        check (source is null or char_length(source) <= 120),
  created_at       timestamptz not null default now()
);

create unique index if not exists waitlist_signups_email_key
  on public.waitlist_signups (lower(email));

-- RLS ligado e SEM políticas: nenhum acesso pelo cliente/anon.
-- Só o servidor, com a chave de serviço, grava.
alter table public.waitlist_signups enable row level security;
revoke all on public.waitlist_signups from anon, authenticated;
```

### 5.5 Rota

`POST /api/waitlist` (route handler, runtime Node): valida → honeypot → rate limit → `insert ... on conflict do nothing` → responde `200 { ok: true }` sempre que a entrada for válida (inclusive duplicada). Erros de validação `422` com códigos de campo, nunca texto cru do banco.

### 5.6 Variáveis de ambiente (`.env.example`; **nunca** commitar valores)

Por D2, só estas valem agora (as de Supabase e `WAITLIST_IP_SALT` saíram do `.env.example` e voltam com o backend):

```
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_DEMO_TECHNICAL_URL=   # vazio = estado "em breve"
NEXT_PUBLIC_DEMO_PITCH_URL=
NEXT_PUBLIC_DEMO_FULL_URL=
```

Segredos: fora do repositório e **fora de prompts**. Se for necessário aplicar a migration, **peça aprovação explícita** e proponha o SQL; não execute contra produção por conta própria.

## 6. Analytics (D8)

- Padrão: **nenhum até decisão**. Implementar `track(event, props)` em `src/lib/track.ts` como **no-op** com a lista de eventos de `01-brief.md` §5.3. Quando o responsável escolher (Vercel Analytics, Plausible ou similar), só trocar a implementação.
- Sem cookies de terceiros, sem fingerprinting, sem dados pessoais nos eventos. Sem banner de cookies se não houver cookies não essenciais.

## 7. Vídeo da demo

- Três slots: **técnica** (~3 min), **pitch** (~3 min), **tomada completa** (~13 min). URLs vêm de variáveis de ambiente.
- **Sem URL → estado "em breve"** (`demo.soon`): pôster + link para a lista de espera. **Nunca** um player vazio ou falso.
- **Com URL:** componente *click-to-load* (mostra o pôster; só carrega o iframe/`<video>` ao clicar), para não carregar JS/cookies de terceiros no primeiro load. Se for YouTube, usar o domínio `youtube-nocookie.com`. Se for arquivo próprio, `<video preload="none" controls playsinline>` com legendas `.vtt` (EN; PT-BR se existir).
- O vídeo é **em inglês**; a página PT-BR exibe `demo.lang` ("Vídeo em inglês") até haver versão/legendas em PT-BR.
- Pôster e miniaturas em AVIF/WebP com dimensões declaradas.

## 8. Performance (requisito)

| Métrica (mobile, 4G rápida simulada) | Meta |
|---|---|
| Lighthouse Performance / Accessibility / Best Practices / SEO | **≥ 95** cada |
| LCP | **≤ 2,5 s** |
| CLS | **≤ 0,05** |
| INP | **≤ 200 ms** |
| JS inicial (gzip) | **≤ 120 KB** na rota |
| Peso total da primeira dobra | **≤ 500 KB**, excluindo vídeo |

Táticas: SSG; fontes subset auto-hospedadas e pré-carga só do peso do hero; imagens AVIF/WebP com `width/height`, `loading="lazy"` abaixo da dobra e `fetchpriority="high"` só na imagem do LCP; componentes interativos hidratados sob demanda; sem bibliotecas de animação pesadas; sem webfonts de terceiros.

## 9. Acessibilidade (requisito: WCAG 2.2 AA)

- Estrutura semântica: `header`, `nav`, `main`, `section` com `aria-labelledby`, `footer`. Um único `h1`; níveis sem pulo.
- **Skip link** "Ir para o conteúdo / Skip to content".
- Teclado: todo controle alcançável; **stepper**, **abas**, **acordeão** e **seletor de idioma** seguem os padrões WAI-ARIA (setas, Home/End onde couber).
- Foco visível (ver `04-…` §2.4); alvos de toque ≥ 44×44 px no mobile.
- Formulário: `label` associado, `autocomplete="email"`, erros por campo com `aria-describedby`, `aria-invalid`, resumo de erros focável, status em `aria-live`.
- Cor nunca é o único sinal. Links externos anunciam "abre em nova aba".
- Diagramas: texto alternativo ou descrição equivalente em `sr-only`; SVG decorativo com `aria-hidden`.
- `prefers-reduced-motion` e `prefers-contrast` respeitados quando relevante.
- Tabela comparativa: `<table>` real com `th scope`; no mobile, vira lista de definições **sem perder** a relação linha/coluna.
- Ferramentas no CI: axe (Playwright) nas duas rotas, mais verificação manual de teclado e leitor de tela em amostra.

## 10. SEO, compartilhamento e segurança

- `<title>` e `meta description` por idioma (`03-…` §4); `canonical`; `og:*` e `twitter:*` (`summary_large_image`); `theme-color: #392D40`; imagens OG por idioma (1200×630) com `alt`.
- `robots.txt`, `sitemap.xml`, ícones (favicon 32 px e SVG, `apple-touch-icon`) — **favicon definitivo pendente (TODO(brand))**: usar provisório e registrar.
- JSON-LD `Organization` com `name`, `url`, `logo`, `sameAs` (GitHub). **Sem** `aggregateRating`, `review` ou qualquer dado não verdadeiro.
- Headers de segurança (via `next.config` ou `vercel.json`): `Content-Security-Policy` restritiva (`default-src 'self'`; `connect-src 'self'` + domínio do banco **somente no servidor**; `frame-src` só do provedor de vídeo se houver), `Referrer-Policy: strict-origin-when-cross-origin`, `X-Content-Type-Options: nosniff`, `Permissions-Policy` mínima, `frame-ancestors 'none'`.
- Links externos: `rel="noopener noreferrer"`.
- Dependências: fixar versões; `npm audit` sem críticos antes do deploy.

## 11. Scripts e CI

| Script | O que faz | Quando |
|---|---|---|
| `check-claims` | Procura termos proibidos (`02-…` §4) nos dicionários e componentes; só passa com `allowlist` por chave | `prebuild` e CI |
| `check-i18n` | Chaves iguais; sem vazios; sem string literal visível fora de dicionário (heurística) | `prebuild` e CI |
| `check-evidence` | Valida `evidence.json` e URLs de Explorer | `prebuild` e CI |
| `check-content` | Orçamento de conteúdo de `01-brief.md` §6 (H2 ≤ 8 palavras e FAQ de 6 falham; parágrafos > 35 e respostas > 45 só avisam) | `prebuild` e CI |
| `check-tokens` | Nenhuma cor, função de cor ou utilitário de paleta fora de `tokens.css`; `theme-color` igual a `--brand-aubergine` | `prebuild` e CI |
| `test:unit` | `node --test`: validação da lista de espera e leitura das URLs de vídeo | CI |
| `test:e2e` | Playwright contra o build (`npm run build` antes): SEO/OG/JSON-LD/headers/404, i18n, layout em 6 larguras, abas por teclado, movimento reduzido, sem JS, formulário, demo e **axe** (WCAG 2.2 AA) nas duas rotas. `demo-env.spec.ts` só roda com as URLs de vídeo definidas | CI |
| `assets:generate` | Regera OG, favicon e ícones provisórios a partir dos SVGs da marca | manual |
| `typecheck`, `lint` | TS e ESLint | CI |
| `test:e2e` | Playwright: carrega `/en` e `/pt-br`, troca de idioma, envia a lista (modo teste), navega por teclado, axe | CI |
| `lighthouse` | Metas de §8 | Antes do deploy |

`check-claims` é **lista de bloqueio + revisão humana**, não substitui o checklist de `02-…` §8.

## 12. Convenções de código

- TypeScript estrito; sem `any` injustificado.
- Componentes pequenos e sem lógica de negócio; texto sempre por chave; dados sempre de `evidence`.
- Commits pequenos e focados; mensagem no imperativo; um assunto por commit.
- Sem comentários óbvios; comentar **por quê**, não **o quê**.
- Nenhum `console.log` em produção.

## 13. O que NÃO fazer (engenharia)

- Não expor `SUPABASE_SERVICE_ROLE_KEY` ao cliente nem a logs.
- Não usar `localStorage` para dados do formulário além de preferências triviais (e idioma via cookie).
- Não embutir iframes/scripts de terceiros no primeiro carregamento.
- Não deixar o formulário depender só de JS sem plano de degradação.
- Não aplicar migrations em produção sem aprovação.
- Não criar páginas além do mapa de `03-…`.
