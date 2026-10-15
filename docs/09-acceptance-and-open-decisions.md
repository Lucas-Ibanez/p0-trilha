# 09 — Critérios de aceite e decisões em aberto

## 1. Definição de "pronto para publicar"

A landing só está pronta quando **todos** os itens abaixo passam, com **comando executado e saída registrada** (não "parece que funciona").

### 1.1 Conteúdo e claims (`02-…`)

- [ ] Cada frase tem uma classe (Fato / Hoje / Planejado / Visão) e o rótulo visível quando aplicável.
- [ ] A frase 1 aparece junto de "verificação on-chain" e do link de uma liquidação real, nos dois idiomas.
- [ ] A seção **Limites da prova** está visível, legível (AA) e **não** é rodapé.
- [ ] Faixa de ambiente (devnet · Test USDC) presente em todas as telas.
- [ ] `npm run check:claims` sem ocorrências fora da `allowlist`.
- [ ] Nenhuma métrica de cliente, depoimento, logo de cliente, "apoiado por", TAM, "primeiro/único".
- [ ] EN e PT-BR dizem a **mesma coisa** (revisão lado a lado das 8 seções).
- [ ] Orçamento de conteúdo (`01-…` §6): 8 seções, ≤ 8 telas, H2 ≤ 8 palavras, parágrafos ≤ 35 palavras, FAQ de 6.

### 1.2 Dados e links

- [ ] `npm run check:evidence` passa; **todo** link de Explorer tem `cluster=devnet` e abre a transação certa (verificar ao menos os 3 desfechos e os 4 rejeitados manualmente).
- [ ] Nenhum hash/endereço/assinatura digitado em componente (busca por padrões base58/hex no `src/`).
- [ ] Hashes truncados mostrados como truncados; **nenhum valor completo inventado**.
- [ ] A mesma transação **não** é repetida em vários blocos sem necessidade.

### 1.3 Design (`04-…`, `05-…`)

- [ ] Nenhum valor literal de cor, fonte, raio ou espaço fora de `tokens.css`.
- [ ] Contrastes conforme `04-…` §2.4 (âmbar nunca texto sobre claro; malva nunca sobre lilás).
- [ ] Um botão âmbar por viewport.
- [ ] A célula é **idêntica** nos três desfechos.
- [ ] Logo sem modificação, com área de proteção e mínimos; favicon provisório registrado como `TODO(brand)`.
- [ ] Sem gradiente, sombra, brilho, partículas, favos atrás de dados, selos, escudos, cadeados.
- [ ] Capturas reais da interface Hive; fragmentos montados de `evidence.json`; legendas dizem "tela real" ou "ilustração".
- [ ] Viewports 360, 390, 768, 1024, 1280, 1536 sem rolagem horizontal da página.

### 1.4 Visuais e movimento (`05-…`)

- [ ] Cada peça tem render estático legível sem JS animado.
- [ ] `prefers-reduced-motion` verificado.
- [ ] Abas, stepper, acordeão e seletor de idioma operam só com teclado; foco visível.
- [ ] Colmeia da visão com selo **Visão**, legenda e itens **Planejado** separados; sem confundir "sem evidência" com "proibido" ou "negativo".

### 1.5 i18n

- [ ] `npm run check:i18n` passa (mesmas chaves, sem vazios).
- [ ] `/` redireciona por `Accept-Language`; troca manual persiste; âncora preservada ao trocar idioma.
- [ ] `<html lang>` correto; `hreflang` (`en`, `pt-BR`, `x-default`), `canonical` e `sitemap` por idioma.
- [ ] Números e datas formatados por idioma (`99,541` / `99.541`).
- [ ] PT-BR sem quebra de layout (texto ~15–25 % mais longo).

### 1.6 Lista de espera e demo

- [ ] Formulário validado no cliente em `/en` e `/pt-br`, com todos os estados (ocioso, enviando, sucesso, erro de campo, erro geral) e o aviso de prévia (D2: sem envio real). *Quando houver backend: envio real validado, com registro de `locale` e `consent_version`, duplicata com a mesma tela de sucesso, honeypot e rate limit funcionando.*
- [ ] Nenhum segredo no bundle do cliente (inspecionar o build) nem em logs.
- [ ] Sem URL de vídeo → estado "em breve", sem player falso. Com URL → *click-to-load*.
- [ ] Eventos de analytics (se houver provedor) sem dados pessoais.

### 1.7 Performance, a11y, SEO (`06-…`)

- [ ] Lighthouse mobile **≥ 95** em Performance, Accessibility, Best Practices e SEO, nas duas rotas. LCP ≤ 2,5 s, CLS ≤ 0,05, INP ≤ 200 ms, JS inicial ≤ 120 KB gzip.
- [ ] axe (Playwright) sem violações sérias/críticas nas duas rotas; teste manual de teclado e de leitor de tela em amostra.
- [ ] OG por idioma e `theme-color` corretos; JSON-LD sem dados falsos.
- [ ] Headers de segurança e CSP aplicados; `npm audit` sem críticos.

## 2. Revisão adversarial (fase 5; por alguém que **não** escreveu a seção)

Perguntas a responder com evidência:

1. **Inflação de claim:** existe alguma frase que um tech lead cético leria como promessa maior que a prova?
2. **A Hive "decide"?** Alguma frase, botão ou imagem sugere que a Hive (e não o programa) aprova/rejeita ou que há discricionariedade?
3. **Visão virando funcionalidade:** a seção A Hive poderia ser lida como algo que o produto já faz?
4. **Selo escondido:** alguma cor, ícone ou célula sugere "aprovado/confiável" de forma geral?
5. **Hash disfarçado:** algum valor truncado se passa por completo?
6. **Drift EN/PT-BR:** um idioma promete mais que o outro?
7. **Dado órfão:** algum número da página não está em `evidence.json`?
8. **Vazamento:** a lista de espera revela quem está cadastrado, ou registra e-mail em log?
9. **Cluster errado:** algum link de Explorer sem `cluster=devnet`?
10. **Compreensão em 5 s:** um leigo técnico diz "camada de confiança para trabalho entre agentes"? (testar com 3 pessoas)

## 3. Divergências entre as fontes (e como esta landing resolve)

| # | Tema | Fonte A | Fonte B | Resolução na landing |
|---|---|---|---|---|
| 1 | Enquadramento | Site atual: "escrow para tarefas entre agentes, liquidado por prova" | Marca/decisão atual: **camada de confiança entre agentes** | **Camada de confiança**, com o produto de hoje como recorte comprovado e a visão rotulada |
| 2 | Mascote e favos | Guia de UI do MVP: fora da interface de produto | Marca: mascote guia, favos como linguagem institucional | A landing é institucional: favos **só** muito sutis; mascote **desligado** por padrão (D12) |
| 3 | Halo e rede | Guia de UI: fora da UI do MVP (sugere perfil) | Marca: recurso de visão | Permitidos **só** na seção A Hive, rotulados |
| 4 | Idioma | Guia de UI: padrão a definir; sugere EN | Decisão atual: EN e PT-BR | Dois idiomas completos; padrão EN com detecção (D3) |
| 5 | Papel da Solana | Tese/Panorama: primeiro adaptador, não identidade do produto | MVP: Solana devnet | Dizer "hoje, em Solana devnet"; **não** apresentar Solana como a identidade da Hive |
| 6 | zkVM | Panorama/negócio: nível premium de evidência | MVP: zkVM é o núcleo | Mostrar o que existe; **Planejado** inclui pilotos comparando com CI assinado e revisão humana |
| 7 | Público | Site atual: jurados e devs de zk | Decisão atual: software houses e plataformas | Texto começa pela tarefa e pela decisão; detalhe técnico sob demanda; GitHub/reprodução ficam secundários |
| 8 | Slogan no hero | Marca: não reescrever | Hero precisa de explicação concreta | H1 = assinatura (sem "Hive." por causa do logo ao lado) + subtítulo concreto; confirmar (D4) |

## 4. Decisões em aberto (**pergunte ao responsável; não assuma**)

Cada item traz a **recomendação padrão** para destravar o trabalho. Se o responsável não responder, implemente o padrão **sem fechar** a decisão e registre no relatório.

| ID | Decisão | Recomendação padrão | Dono sugerido |
|---|---|---|---|
| **D1** | Stack | Next.js (App Router) + TS + Tailwind v4 + next-intl | Lucas |
| | ↳ **DECIDIDO em 2026-10-15** | Manter a stack padrão. Versões instaladas e ressalvas em `06-engineering.md` §1.3. | Lucas |
| **D2** | Backend da lista de espera e quem recebe os cadastros | Supabase (acesso só pelo servidor, RLS sem políticas), exportação manual no início | Lucas |
| | ↳ **DECIDIDO em 2026-10-15** | **Sem backend por ora.** A lista de espera é só front-end e não grava nada. Fica suspenso: Supabase, `POST /api/waitlist`, rate limit, honeypot e migrations (o desenho de `06-engineering.md` §5 permanece como referência para quando houver backend). **Condição de honestidade:** enquanto não houver backend, a interface não pode afirmar que o cadastro foi gravado nem prometer contato; o formulário traz aviso visível de que é uma prévia. A página não vai a produção com o formulário nesse modo sem nova decisão do responsável. | Lucas |
| **D3** | Idioma padrão e detecção; slug do PT | EN como padrão; detectar `Accept-Language`; rota `/pt-br` | Leonardo |
| **D4** | Usar o slogan **sem** o prefixo "Hive." no H1 do hero | Sim (o logo aparece ao lado); redação completa no rodapé e no `<title>` | Leonardo |
| **D5** | Hierarquia de CTAs (âmbar no hero) | Hero: **Assistir à demo** âmbar, lista de espera em contorno; seção final: lista de espera âmbar | Leonardo + Henrique |
| **D6** | Vídeos: hospedagem, legendas, versão PT-BR, data de publicação | Slots por env; "em breve" até existir; vídeo em inglês | Lucas |
| **D7** | Bloco de equipe | Opcional e compacto (3 nomes e papéis, sem fotos) | Todos |
| **D8** | Analytics, anti-bot e scripts de terceiros | `track()` no-op; sem terceiros; rate limit + honeypot; Turnstile só se houver abuso | Lucas |
| **D9** | Textos legais: política de privacidade, controlador, canal de exclusão, retenção, base legal | Consentimento explícito; **texto exige revisão jurídica**; página mínima no lançamento | Henrique (revisão jurídica externa) |
| **D10** | Domínio, favicon definitivo, imagens OG, press kit | Provisórios agora; registrar `TODO(brand)` | Leonardo |
| **D11** | Cores de status (verde/vermelho) | **Não usar**; rótulo + ícone + forma em tons da marca | Leonardo |
| **D12** | Mascote na landing | **Desligado** até haver arquivo aprovado | Leonardo |
| **D13** | Escala tipográfica de marketing (H2 40/28, corpo 18/16…) e ausência de alternador de tema na v1 | Aprovar a extensão e registrá-la no documento de marca; uma só aparência completa | Leonardo |
| **D14** | Declarações de **Planejado**: outros meios de pagamento; pilotos comparando zkVM × CI assinado × revisão humana | Manter só se o time confirmar que aceita dizê-las publicamente | Henrique + Lucas |
| **D15** | Páginas pós-lançamento `/proof` e `/brand` | Adiar; manter o detalhe no README | Todos |
| **D16** | Rodapé: "Construído para o hackathon da Colosseum" e link do GitHub | Manter (são fatos) | Todos |

## 5. Pendências de ativos (não bloqueiam a fase 0)

| Ativo | Estado | Quem fornece |
|---|---|---|
| Logos SVG (horizontal, vertical, reduzida, wordmark, variantes) | **Salvos; ainda a organizar** em `public/brand/` | Leonardo |
| Capturas reais da interface Hive (lista, novo job, compromissos × journal, verificação, liquidação, rejeição) | A exportar (AVIF/WebP) | Lucas |
| Hashes completos (`job_id`, `spec_hash`, `harness_hash`, `artifact_hash`) | Só truncados em `evidence.json`; completos no repositório | Lucas |
| Vídeos (técnico, pitch, tomada completa) e pôsteres | Não publicados | Lucas |
| Favicon / app icon / OG | Pendentes | Leonardo |
| Textos de privacidade | Pendentes | Henrique |

## 6. Relatório padrão de cada fase

```
Fase: <n> — <nome>
Arquivos criados/modificados: ...
O que mudou (resumo) e inegociáveis preservados: ...
Comandos executados (saída resumida real):
  $ npm run check:claims   → ...
  $ npm run check:i18n     → ...
  $ npm run check:evidence → ...
  $ npm run build / test:e2e / lighthouse → ...
Lacunas, hipóteses não confirmadas, TODO(content)/TODO(brand): ...
Decisões que precisam de humano (IDs): ...
Próxima fase bloqueada por: ...
```
