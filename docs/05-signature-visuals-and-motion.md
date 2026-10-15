# 05 — Visuais de assinatura e movimento

> Aqui está a parte que dá "cara de startup" à página **sem trair a marca**. São quatro peças. Todas usam **dados reais** de `data/evidence.json`, respeitam `02-claims-and-voice.md` e funcionam **sem animação** (estado final estático).

## 0. Princípios

1. **O visual é a evidência.** Em vez de ilustrar "confiança" com símbolos genéricos, a página mostra o que a Hive de fato produz: uma delegação, um journal, um desfecho.
2. **Movimento só explica sequência.** Se uma animação não mostra *o que acontece depois do quê*, ela não entra.
3. **Nada simulado.** Valores animados são os reais; nada de "contador subindo" para fatos, nada de hash que "embaralha".
4. **Estado final primeiro.** Todo componente anima *para* um estado final legível que também é o render estático (SSR, `prefers-reduced-motion`, impressão, robôs).
5. **A célula não muda por causa do resultado.** Nunca.

## 1. Mapa das quatro peças

| Peça | Onde | Origem da ideia | Tipo |
|---|---|---|---|
| **A. Diagrama de delegação** | Hero (autoplay discreto) e Como funciona | Marca (célula + conexão + contexto) + Modal (produto como ilustração) | SVG + HTML |
| **B. Cartões do journal** | Provas | Nox (dado como ornamento) | HTML |
| **C. Desfechos interativos** | Provas | Linear/Modal (produto real) | HTML, abas |
| **D. A colmeia da visão** | A Hive | Marca (rede de relações) + Pluto (metáfora consistente) | SVG |

## 2. Peça A — Diagrama de delegação

**O que mostra:** duas células, uma delega uma tarefa à outra; a evidência chega; o resultado aparece como rótulo.

### 2.1 Anatomia

```
   ⬡ Delegates ───────────────▶ ⬡ Executes
   (comprador)   ● evento        (executor)
       │  rótulo da tarefa: "Bugfix · regression test"
       │  chip: spec_hash af642b56…c49fb778  (critérios comprometidos)
       ▼
   [ cartão de evidência: journal — 7 campos curtos ]
       ▼
   [ rótulo de resultado: Criteria met · PASS ]   [link: Solana Explorer ↗]
```

- Duas **células** (hexágono regular, vértice para cima, cantos suaves, contorno `--text-primary`/`--brand-amber` conforme a superfície). Rótulos de **papel** abaixo de cada célula ("Delegates"/"Delega", "Executes"/"Executa"), não nomes de agentes inventados.
- **Seta** de A para B (direção de delegação) com **rótulo de tarefa** explícito. O texto do rótulo é uma **ilustração** marcada como tal na legenda (`hero.caption`).
- **Ponto circular** percorre a linha (evento: "entrega + prova").
- O **cartão de evidência** usa os valores de `journalExamplePass`. Chips em mono, com cópia.
- O **rótulo de resultado** usa `outcomes[].headline` (nunca "aprovado/rejeitado").

### 2.2 Estados (controle segmentado opcional, no hero só visível em hover/foco; na seção Como funciona, sempre visível)

| Estado | Rótulo | Mostra | Célula |
|---|---|---|---|
| `released` | Criteria met · PASS | Seta de valor de B ← vault → B; link da tx de `outcomes[0]` | **igual** |
| `refundedOnFail` | Criteria not met · FAIL | Valor volta ao comprador; legenda "um resultado verificado, não um erro" | **igual** |
| `refundedOnTimeout` | Deadline passed | Sem cartão de evidência; legenda "sem prova: a condição é o prazo" | **igual** |

### 2.3 Sequência de movimento (hero, loop de ~10 s; pausa fora da viewport e ao focar/passar o mouse)

| t (s) | Evento |
|---|---|
| 0.0 | Células e rótulos de papel já visíveis (estado base) |
| 0.6 | Linha A→B se desenha; rótulo da tarefa surge |
| 1.4 | Chip `spec_hash` sobe sobre a linha ("critérios comprometidos antes") |
| 2.4 | Ponto percorre A→B (entrega) |
| 4.0 | Cartão de evidência se abre abaixo de B (campos aparecem em cascata de 60 ms) |
| 6.0 | Rótulo de resultado e link do Explorer surgem |
| 9.0 | Mantém 1 s e reinicia suavemente (ou para após 2 ciclos) |

Durações de UI 200–400 ms, `ease-out`. Nada de `bounce`/`elastic`.

### 2.4 Estático / acessível

- Render estático = frame em t≈6 s, com tudo visível.
- `prefers-reduced-motion: reduce` → só o frame estático; troca de estado sem transição.
- `role="img"` + `aria-label` descrevendo o fluxo, ou texto equivalente em `sr-only`; o controle segmentado é um `tablist` navegável por teclado.

## 3. Peça B — Cartões do journal ("tabela periódica" da Hive)

Inspirada nos cartões de liga do Nox (número atômico, símbolo, composição). Aqui, o "elemento" é **cada campo do journal de 165 bytes**.

### 3.1 Cartão

```
┌─────────────────────────┐
│ 36                      │  ← offset (mono, pequeno, canto superior esquerdo)
│                         │
│ spec_hash               │  ← nome do campo (mono, 14 px, destaque)
│ af642b56…c49fb778   ⧉   │  ← valor truncado (mono) + Copiar
│ The acceptance criteria │  ← glosa humana (Manrope 13–14 px, text-secondary)
│ agreed up front         │
└─────────────────────────┘
```

- **7 cartões**, na ordem dos offsets **0, 4, 36, 68, 100, 132, 164** (de `evidence.json → journalFields`). Grade 4+3 no desktop; rolagem horizontal com *scroll-snap* no mobile.
- Um **indicador de largura** (barra fina de 165 bytes dividida em 7 trechos proporcionais) acima dos cartões: ao passar o mouse/foco em um cartão, o trecho correspondente acende (`--brand-amber` como foco). Isso comunica que o journal é pequeno, fixo e completo.
- `verdict` mostra o rótulo **Criteria met · PASS** em mono/Manrope, **sem cor de aprovação**.
- Valor completo: só quando `full != null` em `evidence.json` (hoje, apenas `image_id`). Para os demais, mostrar o truncado e **não** sugerir que há mais.
- Título e legenda: `proof.journal.title` e legenda de `03-…` §3.5.

### 3.2 Por que isso funciona

Transforma o termo mais técnico da página (journal) no elemento mais memorável e escaneável, com dados reais, no espírito de "dado como identidade". Também dá ao visitante uma forma **concreta** de entender que o veredito está vinculado a job, critérios, avaliador e artefato.

## 4. Peça C — Desfechos interativos (Provas)

- **Abas:** `Criteria met` · `Criteria not met` · `Deadline passed`. Cada aba mostra: título (`headline`), resultado (`result`), instruções em mono (`deliver` + `release` etc.), se o verificador foi invocado e os CU (`verifierComputeUnits`), e o link do Explorer (`ExplorerLink`).
- Abaixo, **lista dos 4 rejeitados** (`rejections[]`): título, "rejeitado por" (programa), nome e código do erro em mono (com cópia), link do Explorer, e a linha fixa `rejectionNote`.
- O **link** de cada transação abre em nova aba, mostra `Solana Explorer ↗` e **sempre** tem `cluster=devnet` (teste automatizado em `09-…`).
- A **frase 1** fica logo abaixo das abas.
- **Não** repetir a mesma transação em vários lugares da página: o PASS aparece aqui e no hero (link único). O site anterior repetia o link 3 vezes.

## 5. Peça D — A colmeia da visão

**Seção rotulada Visão.** Mostra, sem prometer, a ideia de **confiança contextual**.

### 5.1 Composição

- 5–6 **células** separadas, com papéis genéricos ("Agent A", "Agent B", …), todas **idênticas** em estilo.
- **Conexões** com **seta** (quem delega a quem) e **rótulo de contexto** explícito em cada uma. Exemplos de rótulos: `Code review`, `Deployment`, `Data transform`.
- **Uma** conexão destacada com **Trust Halo** (segundo contorno hexagonal afastado e parcialmente destacado) e o rótulo "Code review" → legenda **Evidência para este contexto**.
- **Uma** conexão **tracejada** com o rótulo "Deployment" → legenda **Ainda sem evidência**.
- **Espessura uniforme** em todas as linhas. Espessura nunca comunica confiança.
- Sem nenhuma célula "mais brilhante", "mais cheia" ou "maior": **ninguém é "mais confiável"**. Diferença só por **rótulo e contorno de contexto**.

### 5.2 O que NÃO desenhar

Selo, escudo, check verde, estrelas, barras de nível, perfil/score, halos que sugiram "o agente é bom", brilho, camadas concêntricas múltiplas, favos preenchendo a tela, partículas.

### 5.3 Texto obrigatório junto ao diagrama

- Selo **Vision / Visão**.
- Legenda: `hive.caption` — *Illustration of the vision. Not a feature available today.*
- Legenda de estados (dois itens apenas): evidência neste contexto / ainda sem evidência.
- Os dois itens **Planejado** (`hive.planned.*`) em bloco separado, com selo **Planned / Planejado**.

### 5.4 Movimento

Muito contido: ao entrar na viewport, as conexões se desenham uma vez (≤ 1,2 s); o halo "respira" **não**. Sem loop. Reduzido: estado final.

## 6. Movimento global

| Regra | Valor |
|---|---|
| Biblioteca | CSS + SVG sempre que possível. Motion/Framer só se justificar; sem GSAP |
| Revelação ao rolar | Opacidade + deslocamento de ≤ 12 px, 240 ms, **uma vez**, sem atraso encadeado longo |
| Stepper (Como funciona) | Troca de figura com *cross-fade* 200 ms; progresso discreto no rótulo "Passo 2 de 4" |
| `prefers-reduced-motion` | Tudo vai direto ao estado final; sem parallax, sem vídeo em loop |
| Pausar | Animações em loop pausam fora da viewport e quando a aba não está visível |
| Orçamento | Sem long tasks > 50 ms causados por animação; 60 fps em dispositivo médio; não bloquear a thread principal no carregamento |
| Proibido | Parallax pesado, cursor customizado, scroll-jacking, partículas, confete, contadores de fato, hash "embaralhando" |

## 7. Fundo do hero (opcional)

Se houver mídia de fundo, preferir **o próprio produto** (loop curto, mudo, ≤ 3 MB, pôster estático) a abstrações. Alternativa sóbria: berinjela chapado + **contorno de hexágonos muito sutil** nas bordas. Em ambos os casos, o texto mantém contraste ≥ 7:1 e nada compete com o H1 e os CTAs.

## 7.1 Esboço do hero (referência de composição)

```
┌──────────────────────────────────────────────────────────────────────┐
│ [logo]        How it works · Demo · Proof · The Hive · For · FAQ   [Join the waitlist] │
│ Running on Solana devnet · Test USDC only                                         │
│                                                                       │
│  A trust layer for work between agents        ⬡ ───────▶ ⬡            │
│                                               ┌─ journal ─┐           │
│  Trust starts                                 │ …7 campos │           │
│  with a reason.                               └───────────┘           │
│                                               Criteria met · PASS ↗   │
│  Today, Hive verifies a specific delivery…                            │
│                                                                       │
│  [ Watch the demo ]  ( Join the waitlist )                            │
│  See a real settlement on Solana Explorer ↗                           │
└──────────────────────────────────────────────────────────────────────┘
```

## 8. Critérios de aceite dos visuais

- [ ] Cada peça tem render estático legível sem JS animado.
- [ ] Nenhum valor numérico/hash/URL digitado em componente; tudo de `evidence.json`.
- [ ] A célula é idêntica nos três desfechos (teste visual/snapshot).
- [ ] A colmeia traz selo Visão, legenda e itens Planejado separados.
- [ ] Abas, stepper e acordeão operam só com teclado; anel de foco visível.
- [ ] `prefers-reduced-motion` verificado.
- [ ] Nenhum elemento da lista "O que NÃO desenhar" aparece.
