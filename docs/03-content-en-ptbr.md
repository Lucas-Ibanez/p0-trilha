# 03 — Conteúdo: estrutura e textos (EN + PT-BR)

> **Status dos textos: proposta para revisão** do responsável de marca/produto. A estrutura e as regras são firmes; as palavras podem ser ajustadas, desde que respeitem `02-claims-and-voice.md` e mantenham **EN e PT-BR no mesmo nível de afirmação**.
>
> Cada bloco traz uma **chave de dicionário** sugerida (`hero.title`). Implemente como `messages/en.json` e `messages/pt-br.json` com chaves idênticas.
>
> **Ajustes feitos na fase 1 (2026-10-15), para o responsável de marca/produto conferir:**
> - `limits.title` em PT-BR passou a **"O que a prova mostra e não mostra"** (8 palavras; a versão anterior tinha 10 e estourava o limite de H2 de `01-brief.md` §6).
> - Números dentro de textos vêm de `evidence.json` por placeholder, não digitados: a data em `proof.body` e os tempos de prova em `faq.proof.a`, que agora diz "cerca de 7–9 segundos … e 90–180 segundos para a compressão" (em vez de "1,5–3 minutos"; mesmo dado, em segundos como no `evidence.json`).
> - `how.s{n}.caption` virou uma legenda única `how.caption`; as quatro figuras são fragmentos montados com dados reais e dizem "não é captura de tela" (não há capturas reais ainda: `TODO(content)`).
> - Chaves novas, com texto EN e PT-BR escritos nesta fase: `hero.fig.*`, `how.fig.*`, `how.step`, `outcome.*`, `proof.claimLink`, `proof.journal.*`, `proof.outcomes.title`, `proof.rejections.*`, `common.*`, `nav.menu`, `decision.table.caption` e `decision.table.rowHeader`.
> - `proof.rejections.title` e `proof.rejections.by` evitam a palavra "rejeitado/rejected" (a lista de proibidos de `02-…` §4.4 a barra fora de `proof.n2`): "Quatro tentativas que não passaram", "Barrada por".
> - Termos invariantes acrescentados em `data/forbidden-terms.json`: `Demo`, `FAQ`, `Pitch`.
> - **Orçamento de conteúdo:** `check:content` avisa que `decision.body`, `limits.shows.body`, `limits.notshows.body` (EN e PT-BR) e `hive.body` (PT-BR) passam de 35 palavras. Os textos de `docs/03` foram mantidos; cabe ao responsável cortar ou aprovar a exceção.

## 1. Mapa do site

```
/                      → redireciona para /en ou /pt-br (Accept-Language; padrão EN)
/en    /pt-br          → landing (8 seções)
/en/privacy  /pt-br/privacidade   → política de privacidade (texto a fornecer; ver D9)
/en/proof    /pt-br/provas        → FASE OPCIONAL pós-lançamento: tabela completa de transações e arquitetura
```

### 1.1 Seções da landing (ordem fixa)

| # | Âncora | Seção | Superfície | Classe predominante |
|---|---|---|---|---|
| 0 | — | Navegação fixa + faixa de ambiente | berinjela | Hoje |
| 1 | `#top` | Hero | **berinjela** | Hoje |
| 2 | `#decision` | A decisão | branco quente | Hoje |
| 3 | `#how` | Como funciona | branco quente / branco | Hoje |
| 4 | `#demo` | Demo | berinjela | Fato |
| 5 | `#proof` | Provas e limites | branco quente | Fato + Hoje |
| 6 | `#hive` | A Hive (visão) | berinjela | **Visão** + Planejado |
| 7 | `#for` | Para quem | branco quente | Hoje |
| 8 | `#join` | FAQ + lista de espera + rodapé | branco quente → berinjela | Hoje |

## 2. Glossário EN ↔ PT-BR

Escreva o PT-BR como português natural, não como tradução palavra a palavra. Termos técnicos que **permanecem em inglês** nos dois idiomas estão marcados.

| EN | PT-BR | Obs. |
|---|---|---|
| agent | agente | |
| delegate / hand work to agents | delegar / entregar trabalho a agentes | |
| delivery | entrega | |
| artifact | artefato | |
| acceptance criteria | critérios de aceite | |
| criteria met / not met | critérios atendidos / não atendidos | Nunca "aprovado/rejeitado" |
| evaluator | avaliador | |
| proof | prova | |
| receipt, journal | **receipt, journal** | Permanecem em inglês, em mono |
| escrow, vault | **escrow, vault** | Permanecem em inglês |
| job | **job** | Permanece; "tarefa" como sinônimo em texto corrido |
| settle / settlement | liquidar / liquidação | |
| release / refund | liberar / devolver (estado técnico `Released`, `RefundedOnFail`, `RefundedOnTimeout` em mono) | |
| deadline | prazo | |
| executor | executor | |
| buyer | comprador | |
| waitlist | lista de espera | |
| devnet, Test USDC, PASS, FAIL, CPI, Groth16, RISC Zero, Solana, Explorer | **iguais** | |
| trust layer | camada de confiança | |
| contextual trust | confiança contextual | |

Tratamento: **você** (PT-BR) / **you** (EN). Neutro em gênero sempre que possível.

## 3. Textos por seção

### 3.0 Navegação e faixa de ambiente

| Chave | EN | PT-BR |
|---|---|---|
| `nav.how` | How it works | Como funciona |
| `nav.demo` | Demo | Demo |
| `nav.proof` | Proof | Provas |
| `nav.hive` | The Hive | A Hive |
| `nav.for` | Who it's for | Para quem |
| `nav.faq` | FAQ | FAQ |
| `nav.cta` | Join the waitlist | Entrar na lista de espera |
| `nav.langLabel` | Language | Idioma |
| `env.banner` | Running on Solana devnet · Test USDC only | Rodando na devnet da Solana · somente Test USDC |

A faixa de ambiente é fixa e discreta (uma linha, 12–13 px, contraste AA).

### 3.1 Hero (`#top`)

| Chave | EN | PT-BR |
|---|---|---|
| `hero.eyebrow` | A trust layer for work between agents | Uma camada de confiança para o trabalho entre agentes |
| `hero.title` | Trust starts with a reason. | Confiança começa com um porquê. |
| `hero.sub` | Today, Hive verifies a specific delivery against criteria agreed before the work starts. The payment follows the verified result, not anyone's discretion. | Hoje, a Hive verifica uma entrega específica contra critérios combinados antes de o trabalho começar. O pagamento segue o resultado verificado, não a decisão discricionária de alguém. |
| `hero.ctaDemo` | Watch the demo | Assistir à demo |
| `hero.ctaWaitlist` | Join the waitlist | Entrar na lista de espera |
| `hero.proofLink` | See a real settlement on Solana Explorer | Ver uma liquidação real no Solana Explorer |

Notas: o H1 usa a assinatura da marca; a explicação concreta fica no `hero.sub` (regra de primeiro contato). Visual: **Diagrama de delegação** (`05-…`, §2), com `hero.caption` = *Illustration of a real flow: delegation, evidence, result.* / *Ilustração de um fluxo real: delegação, evidência, resultado.*

### 3.2 A decisão (`#decision`)

| Chave | EN | PT-BR |
|---|---|---|
| `decision.title` | The delivery arrived. Can you accept it? | A entrega chegou. Dá para aceitar? |
| `decision.body` | When agents do delegated work, someone still has to decide whether the result meets what was agreed. Today that usually means a manual review, or the judgment of a platform in the middle — and neither is easy to check afterwards. | Quando agentes executam trabalho delegado, alguém ainda precisa decidir se o resultado cumpre o combinado. Hoje isso costuma ser revisão manual ou o julgamento de uma plataforma intermediária — e nenhum dos dois é fácil de conferir depois. |
| `decision.q` | Hive answers one question per delivery: do we have grounds to accept this, for this task? | A Hive responde a uma pergunta por entrega: temos fundamento para aceitar isto, nesta tarefa? |

Tabela comparativa (3 linhas, colunas **Today** / **With Hive**):

| Chave | EN | PT-BR |
|---|---|---|
| `decision.table.col1` / `col2` | Today / With Hive | Hoje / Com a Hive |
| `decision.table.r1.q` | When is acceptance defined? | Quando o aceite é definido? |
| `decision.table.r1.a` / `.b` | After the work is delivered. / Before it starts, in the job's committed terms. | Depois da entrega. / Antes de começar, nos termos comprometidos do job. |
| `decision.table.r2.q` | Who decides the payment? | Quem decide o pagamento? |
| `decision.table.r2.a` / `.b` | A reviewer, or the platform in the middle. / The program, from the verified result. | Um revisor ou a plataforma intermediária. / O programa, a partir do resultado verificado. |
| `decision.table.r3.q` | What can you check later? | O que dá para conferir depois? |
| `decision.table.r3.a` / `.b` | A review comment or an internal record. / The terms, the public journal and the transaction. | Um comentário de revisão ou um registro interno. / Os termos, o journal público e a transação. |

### 3.3 Como funciona (`#how`)

Passos (stepper de 4; ver `05-…`). Cada passo: título, 1 parágrafo (≤ 35 palavras), **uma figura real** (print da interface Hive ou fragmento montado com dados de `evidence.json`).

| Chave | EN | PT-BR |
|---|---|---|
| `how.title` | Four steps, from agreement to result | Quatro passos, do combinado ao resultado |
| `how.badge` | Today | Hoje |
| `how.s1.title` | Agree on the criteria | Combine os critérios |
| `how.s1.body` | The buyer fixes the acceptance rule, the executor, the amount and the deadline before any work starts. The funds move into a vault controlled by the program, not by either party. | O comprador fixa a regra de aceite, o executor, o valor e o prazo antes de qualquer trabalho. Os fundos vão para um vault controlado pelo programa, não por nenhuma das partes. |
| `how.s2.title` | Prove the evaluation | Prove a avaliação |
| `how.s2.body` | The executor delivers the artifact and proves, on their own machine, that the agreed evaluator ran on it and produced a verdict. | O executor entrega o artefato e prova, na própria máquina, que o avaliador combinado rodou sobre ele e produziu um veredito. |
| `how.s3.title` | Settle on the result | Liquide pelo resultado |
| `how.s3.body` | A Solana program checks that the proof matches the job and the delivery, verifies it, and in the same transaction releases the payment or returns it. If anything does not match, nothing moves. | Um programa na Solana confere se a prova corresponde ao job e à entrega, verifica a prova e, na mesma transação, libera o pagamento ou o devolve. Se algo não confere, nada se move. |
| `how.s4.title` | If nobody settles | Se ninguém liquida |
| `how.s4.body` | After the deadline, anyone can request the refund. No proof is needed: the condition is the deadline itself. | Depois do prazo, qualquer pessoa pode pedir o reembolso. Não precisa de prova: a condição é o próprio prazo. |
| `how.note` | A failed check is a valid result, not an error: the funds return to the buyer. The same flow runs from the command line or from the Hive interface. | Um resultado "não atendido" é válido, não um erro: os fundos voltam ao comprador. O mesmo fluxo roda pela linha de comando ou pela interface da Hive. |

Legenda de cada figura: `how.s{n}.caption` (uma linha) dizendo se é **tela real da interface** ou **ilustração**.

### 3.4 Demo (`#demo`)

| Chave | EN | PT-BR |
|---|---|---|
| `demo.title` | See it run on devnet | Veja rodar na devnet |
| `demo.body` | One continuous take through the Hive interface, with real transactions. Every cut and every speed-up is labeled on screen. | Uma tomada contínua pela interface da Hive, com transações reais. Todo corte e toda aceleração são indicados na tela. |
| `demo.technical` | Technical demo | Demo técnica |
| `demo.pitch` | Pitch | Pitch |
| `demo.full` | Full take, uncut | Tomada completa, sem cortes |
| `demo.play` | Play | Reproduzir |
| `demo.soon` | Video coming soon | Vídeo em breve |
| `demo.lang` | Video in English | Vídeo em inglês |
| `demo.cta` | Get notified when it's live | Avise-me quando estiver no ar |

Comportamento: ver `06-engineering.md` §7. Enquanto não houver URL de vídeo, **mostrar o estado `demo.soon`** com o pôster e o link para a lista de espera. **Nunca** um player falso.

### 3.5 Provas e limites (`#proof`)

**Cabeçalho**

| Chave | EN | PT-BR |
|---|---|---|
| `proof.title` | Don't take our word. Open the transactions. | Confira você mesmo: abra as transações. |
| `proof.body` | Every outcome below is a real transaction on Solana devnet, sent through the Hive interface on 2026-10-07. Each link opens it on Solana Explorer. | Cada desfecho abaixo é uma transação real na devnet da Solana, enviada pela interface da Hive em 7 de outubro de 2026. Cada link abre a transação no Solana Explorer. |
| `proof.claim` | *(frase 1 — ver `02-…` §3)* | *(frase 1 — ver `02-…` §3)* |

**Quatro números** (cartões grandes, estilo Bido; valores de `evidence.json`):

| Chave | Valor | EN (rótulo) | PT-BR (rótulo) |
|---|---|---|---|
| `proof.n1` | **3** | outcomes settled: released, refunded on a failed check, refunded on timeout | desfechos liquidados: liberado, devolvido por critérios não atendidos, devolvido por prazo |
| `proof.n2` | **4** | attempts rejected without moving funds | tentativas rejeitadas sem mover fundos |
| `proof.n3` | **99,541 / 99.541** | compute units used to verify the proof on Solana | unidades de computação para verificar a prova na Solana |
| `proof.n4` | **165** | bytes in the public journal of each receipt | bytes no journal público de cada receipt |

(Formato numérico por idioma: `99,541` em EN, `99.541` em PT-BR.)

**Cartões do journal** (7 campos; ver `05-…` §3): título `proof.journal.title` = *What a receipt publishes* / *O que um receipt publica*; legenda = *Fields of the public journal of a real settlement. Hover or tap to copy.* / *Campos do journal público de uma liquidação real. Passe o mouse ou toque para copiar.* As glosas de cada campo vêm de `evidence.json → journalFields[].gloss`.

**Desfechos interativos** (abas **Criteria met / Criteria not met / Deadline passed** e lista dos 4 rejeitados): títulos e textos vêm de `evidence.json → outcomes[]` e `rejections[]`. Rótulo fixo abaixo dos rejeitados: `evidence.rejectionNote`.

**Limites da prova (seção nomeada, obrigatória, legível)**

| Chave | EN | PT-BR |
|---|---|---|
| `limits.title` | What this proof does and doesn't show | O que esta prova mostra e o que não mostra |
| `limits.shows.title` | It shows | Mostra |
| `limits.shows.body` | A previously committed, deterministic evaluator ran on the artifact delivered in the job and produced the published verdict. The program moves the Test USDC only after checking the link between journal, job and delivery, and verifying the proof. | Um avaliador determinístico, comprometido antes, rodou sobre o artefato entregue no job e produziu o veredito publicado. O programa só move o Test USDC depois de conferir o vínculo entre journal, job e entrega e de verificar a prova. |
| `limits.notshows.title` | It doesn't show | Não mostra |
| `limits.notshows.body` | The quality of a piece of software, that the evaluator is complete, or that the software has no vulnerabilities outside the tested model. The v1 rule is trivial (output = 2 × input) and only demonstrates the flow. | Não mostra a qualidade de um software, nem que o avaliador é completo, nem que o software não tem vulnerabilidades fora do modelo testado. A regra v1 é trivial (saída = 2 × entrada) e serve apenas para demonstrar o fluxo. |
| `limits.repro` | Reproduced from a clean clone, not on a new machine. Commands are in the repository README. | Reproduzido a partir de um clone limpo, não em uma máquina nova. Os comandos estão no README do repositório. |

### 3.6 A Hive — visão (`#hive`)

**Seção inteira rotulada Visão.** A frase-ponte aprovada abre a seção.

| Chave | EN | PT-BR |
|---|---|---|
| `hive.badge` | Vision | Visão |
| `hive.title` | From verified deliveries to contextual trust | De entregas verificadas à confiança contextual |
| `hive.bridge` | Today, Hive verifies specific interactions. Over time, those verified interactions can build contextual trust. | Hoje, a Hive verifica interações específicas. Com o tempo, essas interações verificadas podem construir confiança contextual. |
| `hive.body` | Trust isn't a badge on an agent. It's a relation: A trusts B for a given task, under given conditions. The same agent can have relevant evidence for code review and none yet for deployment. | Confiança não é um selo no agente. É uma relação: A confia em B para determinada tarefa, sob determinadas condições. O mesmo agente pode ter evidências relevantes para revisão de código e nenhuma ainda para deploy. |
| `hive.legend.evidence` | Evidence for this context | Evidência para este contexto |
| `hive.legend.none` | No evidence yet | Ainda sem evidência |
| `hive.caption` | Illustration of the vision. Not a feature available today. | Ilustração da visão. Não é uma funcionalidade disponível hoje. |
| `hive.planned.badge` | Planned | Planejado |
| `hive.planned.1` | Deterministic evaluators for real, bounded tasks, still on restricted artifacts. | Avaliadores determinísticos para tarefas reais e delimitadas, ainda sobre artefatos restritos. |
| `hive.planned.2` | Pilots that compare zkVM evidence with simpler mechanisms, such as signed CI and human review, to learn how much evidence each kind of task needs. | Pilotos que comparam evidência zkVM com mecanismos mais simples, como CI assinado e revisão humana, para entender quanta evidência cada tipo de tarefa exige. |

Diagrama: `05-…` §4. Nada de "marketplace", "reputação", "score".

### 3.7 Para quem (`#for`)

| Chave | EN | PT-BR |
|---|---|---|
| `for.title` | Built for teams that hand work to agents | Para times que entregam trabalho a agentes |
| `for.a.title` | AI-native software houses | Software houses AI-native |
| `for.a.body` | You deliver bounded tasks to several clients and want acceptance both sides can check, with less rework. | Você entrega tarefas delimitadas a vários clientes e quer um aceite que os dois lados possam conferir, com menos retrabalho. |
| `for.b.title` | Job and agent platforms | Plataformas de jobs e agentes |
| `for.b.body` | You intermediate the work and want to automate the testable part of acceptance without becoming the judge of everything. | Você intermedeia o trabalho e quer automatizar a parte testável do aceite sem virar o juiz de tudo. |
| `for.fit.title` | Best fit today | Melhor encaixe hoje |
| `for.fit.body` | Bounded tasks, acceptance criteria that can be automated, and distinct parties on each side. Not for creative or strategic work. | Tarefas delimitadas, critérios de aceite que podem ser automatizados e partes distintas de cada lado. Não serve para trabalho criativo ou estratégico. |

### 3.8 FAQ, lista de espera e rodapé (`#join`)

**FAQ** (6; acordeão acessível; respostas ≤ 45 palavras)

| Chave | EN | PT-BR |
|---|---|---|
| `faq.title` | Questions | Perguntas |
| `faq.mainnet.q` | Is this live on mainnet? | Isso está na mainnet? |
| `faq.mainnet.a` | No. Devnet and Test USDC only. Nothing here moves real money. | Não. Apenas devnet e Test USDC. Nada aqui move dinheiro real. |
| `faq.decides.q` | Who decides whether the executor gets paid? | Quem decide se o executor recebe? |
| `faq.decides.a` | The program, from the verified result. The escrow and verifier programs are immutable (upgrade authority `none`), and no button in the interface decides the outcome. | O programa, a partir do resultado verificado. Os programas de escrow e de verificação são imutáveis (*upgrade authority* `none`), e nenhum botão da interface decide o desfecho. |
| `faq.correct.q` | Does a PASS mean the software is correct? | Um PASS significa que o software está correto? |
| `faq.correct.a` | No. It means the agreed evaluator ran on that artifact and produced that result. Today Hive checks one restricted artifact against a deterministic rule, not a whole codebase. | Não. Significa que o avaliador combinado rodou sobre aquele artefato e produziu aquele resultado. Hoje a Hive verifica um artefato restrito contra uma regra determinística, não uma base de código inteira. |
| `faq.ci.q` | Isn't CI enough? | CI não basta? |
| `faq.ci.a` | Often, yes: when both sides trust the runner and the risk is low. Hive is for distinct parties whose payment depends on the result. We plan pilots to measure when stronger evidence is worth it. | Muitas vezes, sim: quando as duas partes confiam no runner e o risco é baixo. A Hive é para partes distintas cujo pagamento depende do resultado. Planejamos pilotos para medir quando evidência mais forte compensa. |
| `faq.proof.q` | Where is the proof generated, and how long does it take? | Onde a prova é gerada e quanto tempo leva? |
| `faq.proof.a` | Locally, on the executor's machine, then compressed to Groth16 in a local container with no network access. In our devnet runs: about 7–9 seconds for the first proof and 1.5–3 minutes for compression. | Localmente, na máquina do executor, e depois comprimida em Groth16 num container local sem acesso à rede. Em nossas rodadas na devnet: cerca de 7–9 segundos para a primeira prova e 1,5–3 minutos para a compressão. |
| `faq.rails.q` | Do I need crypto to use it? | Preciso de cripto para usar? |
| `faq.rails.a` | Today, settlement runs on Solana devnet with a test token. The acceptance logic is designed to be independent of the payment rail; other rails are planned, not built. | Hoje, a liquidação roda na devnet da Solana com um token de teste. A lógica de aceite foi desenhada para ser independente do meio de pagamento; outros meios são planejados, não construídos. |

(`faq.rails.a` toca uma intenção de estratégia: confirmar com o responsável — D14 em `09-…`.)

**Lista de espera**

| Chave | EN | PT-BR |
|---|---|---|
| `join.title` | Join the waitlist | Entre na lista de espera |
| `join.body` | Tell us about your workflow. We'll write to you as early access opens. | Conte como é o seu fluxo de trabalho. Escrevemos para você quando o acesso antecipado abrir. |
| `join.email.label` | Work email | E-mail de trabalho |
| `join.company.label` | Company (optional) | Empresa (opcional) |
| `join.segment.label` | You are | Você é |
| `join.segment.sh` | An AI-native software house | Uma software house AI-native |
| `join.segment.jp` | A job or agent platform | Uma plataforma de jobs ou agentes |
| `join.segment.ot` | Something else | Outro perfil |
| `join.usecase.label` | What would you delegate first? (optional) | O que você delegaria primeiro? (opcional) |
| `join.usecase.hint` | A task you could describe in one sentence. 500 characters max. | Uma tarefa que você descreveria em uma frase. Máximo de 500 caracteres. |
| `join.consent` | I agree that Hive stores my details to contact me about early access. See the [privacy policy]. | Concordo que a Hive armazene meus dados para entrar em contato sobre o acesso antecipado. Veja a [política de privacidade]. |
| `join.submit` | Join the waitlist | Entrar na lista de espera |
| `join.submitting` | Sending… | Enviando… |
| `join.success.title` | You're on the list. | Você está na lista. |
| `join.success.body` | We'll write to you at the address you gave. | Escreveremos para o e-mail informado. |
| `join.error.generic` | We couldn't save that. Please try again in a moment. | Não conseguimos salvar. Tente novamente em instantes. |
| `join.error.email` | Enter a valid email address. | Informe um e-mail válido. |
| `join.error.consent` | We need your consent to store your details. | Precisamos do seu consentimento para armazenar seus dados. |
| `join.watch` | Or watch the demo first | Ou assista primeiro à demo |

Regra: se o e-mail já estiver na lista, mostrar **a mesma tela de sucesso** (não revelar quem já se cadastrou).

**Rodapé**

| Chave | EN | PT-BR |
|---|---|---|
| `footer.signature` | Hive. Trust starts with a reason. | Hive. Confiança começa com um porquê. |
| `footer.env` | Devnet and Test USDC only; none of this exists on mainnet. | Apenas devnet e Test USDC; nada disto existe na mainnet. |
| `footer.legacy` | The repository and the code keep the project's earlier name, `vericode`. | O repositório e o código mantêm o nome anterior do projeto, `vericode`. |
| `footer.license` | © 2026 Hive. Code under the Apache-2.0 license. | © 2026 Hive. Código sob licença Apache-2.0. |
| `footer.built` | Built for the Colosseum hackathon. | Construído para o hackathon da Colosseum. |
| `footer.links.code` | GitHub repository | Repositório no GitHub |
| `footer.links.privacy` | Privacy | Privacidade |
| `footer.links.explorer` | Escrow program on Explorer | Programa de escrow no Explorer |

**Bloco "Time" (opcional, decisão D7):** se aprovado, uma linha compacta acima do rodapé: Lucas Ibanez (CEO & CTO), Henrique Martins (Strategy Lead), Leonardo Papandrea (COO & CPO), cada um com papel de uma linha. Sem fotos, sem biografia longa.

## 4. Metadados e compartilhamento

| Chave | EN | PT-BR |
|---|---|---|
| `meta.title` | Hive. Trust starts with a reason. | Hive. Confiança começa com um porquê. |
| `meta.description` | Hive is a trust layer for work between agents. Today it verifies a specific delivery against agreed criteria and settles payment from the result, on Solana devnet. | A Hive é uma camada de confiança para o trabalho entre agentes. Hoje ela verifica uma entrega específica contra critérios combinados e liquida o pagamento a partir do resultado, na devnet da Solana. |
| `meta.og.alt` | Hive logo and the line: Trust starts with a reason. | Logo da Hive e a frase: Confiança começa com um porquê. |

`theme-color`: `#392D40`. Uma imagem OG por idioma (1200×630): berinjela, logo horizontal em âmbar/branco quente, o slogan do idioma. Sem células mudando de cor.

## 5. Padrões de microcopy

- Erros e rejeições: neutros, dizem **o que** divergiu e **o que** foi preservado ("O estado do job não foi alterado"). Nunca culpam o usuário. Mostram o nome técnico do erro em campo secundário, com cópia.
- Estados vazios: honestos ("Vídeo em breve", "Valor completo disponível no repositório"). Nunca um valor plausível inventado.
- Botões: verbo + objeto, caixa de frase, sem ponto final.
- Links externos: indicam que abrem em nova aba e **sempre** dizem para onde vão ("Solana Explorer", "GitHub").
- Hash truncado: `af642b56…c49fb778` em mono, com botão **Copiar** e acesso ao valor completo quando existir; se o completo não existir em `evidence.json`, mostrar só o truncado e **não** sugerir que é completo.
