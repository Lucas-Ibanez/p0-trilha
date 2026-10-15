# 01 — Brief: o que a landing precisa ser

## 1. Em uma frase

Uma página curta, serena e verificável que mostra a Hive como **camada de confiança entre agentes**, prova com transações reais o que já funciona hoje e converte visitantes em **demo assistida** e **lista de espera**.

## 2. O que a Hive é (versão para quem escreve a página)

**Visão de marca.** A Hive trabalha a confiança entre agentes a partir de **evidências verificáveis de interações específicas**. A confiança diz respeito ao que se pode aceitar **em uma tarefa e em determinado contexto**; não é uma qualidade universal do agente. Na marca, a **colmeia** representa agentes e suas relações de confiança contextual.

**Produto de hoje (o recorte que existe).** Um escrow em **Solana devnet** para uma tarefa de desenvolvimento entre duas partes, com pagamento condicionado a uma **prova RISC Zero**:

1. O comprador fixa os critérios de aceite, o executor, o valor e o prazo **antes** de o trabalho começar, e deposita **Test USDC** num vault controlado pelo programa.
2. O executor entrega um artefato restrito e gera, na própria máquina, uma prova de que um **avaliador fixo** rodou sobre ele e produziu um veredito.
3. Na mesma transação, o programa confere o vínculo entre prova, job e entrega, **verifica a prova Groth16** e **libera** o valor ao executor (critérios atendidos) ou o **devolve** ao comprador (critérios não atendidos).
4. Se ninguém liquida até o prazo, qualquer um pode pedir o reembolso.

**Ponte entre os dois (frase aprovada, usar sem reescrever):**

> EN: *Today, Hive verifies specific interactions. Over time, those verified interactions can build contextual trust.*
> PT-BR: *Hoje, a Hive verifica interações específicas. Com o tempo, essas interações verificadas podem construir confiança contextual.*

**O que a verificação NÃO é.** Verificado não significa seguro, correto em sentido amplo, autorizado ou adequado para qualquer finalidade. A prova atesta que **um avaliador determinístico previamente comprometido executou sobre aquele artefato e produziu aquele veredito**. A regra v1 é trivial (`saída = 2 × entrada`) e serve para demonstrar o fluxo.

## 3. Decisões já tomadas (não reabrir sem o responsável)

| Tema | Decisão |
|---|---|
| Posicionamento | **Camada de confiança entre agentes**, com a colmeia como rede de relações. (Substitui o enquadramento anterior "escrow de tarefas entre agentes".) |
| Público | **Software houses AI-native** e **plataformas de trabalho** (jobs, agentes, bounties). |
| CTAs | **Assistir à demo** e **entrar na lista de espera.** |
| Idiomas | **EN e PT-BR**, ambos completos, com troca de idioma. |
| Identidade | Berinjela `#392D40` + âmbar `#E8B44C`, Manrope + IBM Plex Mono, abelha 5C. Ver `04-…`. |
| Tom | Sereno, curioso, criterioso. Explica, não proclama. |
| Tamanho | **Curta.** O site atual é denso demais. Ver orçamento de conteúdo (§6). |

## 4. Público

### 4.1 Quem são

| Perfil | Quem decide / usa | O que querem | Como a página fala com eles |
|---|---|---|---|
| **Software house AI-native** (porte pequeno/médio, entrega artefatos digitais a vários clientes, usa coding agents) | Tech lead ou sócio | Receber mais rápido, reduzir retrabalho e disputa, ter critérios previsíveis que ambos os lados possam conferir | "Você entrega uma tarefa delimitada. Como o cliente decide se aceita?" |
| **Plataforma de trabalho** (jobs, agentes, bounties; já tem volume, custo de disputa e API) | Product/eng lead, operador | Automatizar o subconjunto **testável** da aceitação sem virar juiz de tudo | "Você intermedeia o trabalho. Quem decide o pagamento?" |

### 4.2 Bom encaixe hoje (dizer isso na página filtra e gera credibilidade)

Tarefas **delimitadas**, **critério de aceite automatizável**, **partes distintas** de cada lado, valor ou prazo que justifique evidência.

### 4.3 Não é para (ainda)

Trabalho criativo, estratégico ou estético; job ocasional; consumidor final; mesma organização com runner confiável e sem risco adversarial; quem espera que a Hive defina continuamente o que é "bom".

### 4.4 Objeções que a página deve antecipar (sem defensividade)

| Objeção | Resposta honesta (já refletida na FAQ de `03-…`) |
|---|---|
| "Passar no teste não é qualidade." | Correto. O escopo é limitado a critérios explícitos. |
| "CI já resolve." | Quando as partes confiam no runner e o risco é baixo, pode bastar. A Hive é para partes distintas e pagamento dependente do resultado; pilotos vão medir quando evidência mais forte compensa. |
| "ZK é caro e lento." | Hoje: ~7–9 s para a prova inicial e 1,5–3 min para comprimir em Groth16, medidos em devnet. Evidência mais forte é um nível, não o padrão para tudo. |
| "Não posso usar cripto." | Hoje o settlement roda em Solana devnet com token de teste. A lógica de aceite foi desenhada para ser independente do meio de pagamento; outros meios são **planejados**, não construídos. |
| "Quem decide o pagamento?" | O programa, a partir do resultado verificado. Os programas são imutáveis (*upgrade authority* `none`). |

## 5. Metas e CTAs

### 5.1 Metas da página

1. Em **5 segundos**, o visitante consegue dizer: "camada de confiança para trabalho entre agentes".
2. Em **30 segundos**, entende o fluxo (critério antes → entrega → prova → liquidação) e vê que é real.
3. Em **2 minutos**, assiste à demo ou abre uma transação no Explorer.
4. Deixa o e-mail na lista de espera.

### 5.2 Hierarquia dos CTAs

| Local | CTA principal (âmbar) | CTA secundário (contorno) |
|---|---|---|
| Hero | **Assistir à demo** | Entrar na lista de espera |
| Navegação (fixa) | — | Entrar na lista de espera (contorno, compacto) |
| Seção final | **Entrar na lista de espera** (o formulário) | Assistir à demo |

Regra: **no máximo um botão âmbar por viewport.** O âmbar marca a ação prioritária do momento; nunca é cor de sucesso. (Hierarquia recomendada; ver decisão aberta D5 em `09-…`.)

### 5.3 Eventos a medir (sem dados pessoais)

`cta_demo_click` · `cta_waitlist_click` · `demo_play` · `waitlist_submit_success` · `waitlist_submit_error` · `explorer_click` (com o id do desfecho) · `language_switch`.

## 6. Orçamento de conteúdo (a resposta ao "tem muito conteúdo")

O site atual tem ~12 blocos, 8 cartões de transação repetidos, 3 vídeos-fantasma e FAQ de 7 perguntas. A nova página tem **8 seções**, e todo o detalhe técnico denso sai da página principal.

| Limite | Valor |
|---|---|
| Seções na página principal | **8** (ver `03-…`) |
| Altura total no desktop | ≤ **8 telas** de 900 px |
| Título de seção (H2) | ≤ **8 palavras** |
| Parágrafo | ≤ **35 palavras**; ≤ 2 por seção |
| Itens de lista/cartão por seção | ≤ **6** |
| FAQ | **6** perguntas, respostas ≤ 45 palavras |
| Hash completo na tela | nunca; truncado com cópia e valor completo a um clique |

Tudo que for cortado da principal e ainda tiver valor vai para uma página de detalhe **`/proof`** (fase opcional pós-lançamento) ou para o README: tabela completa de transações, arquitetura, comandos de reprodução.

## 7. Arco narrativo

Baseado na narrativa de marca: o protagonista é **a pessoa ou equipe que delega** trabalho e responde pelo resultado; os agentes participam da execução.

| Etapa | Pergunta que a seção responde | Seção |
|---|---|---|
| Desejo | Quero trabalhar com agentes mantendo critérios claros para aceitar suas entregas. | Hero |
| Tensão | O resultado chegou. Tenho fundamento para aceitá-lo, **nesta tarefa**? | A decisão |
| Papel da Hive | Dar fundamento à avaliação, verificando **uma execução específica** sob critérios definidos. | Como funciona |
| Prova | Isso aconteceu de verdade? Onde eu confiro? | Demo + Provas |
| Visão | Para onde isso vai? | A Hive |
| Encaixe | Serve para mim? | Para quem |
| Ação | Quero ver mais / entrar. | Lista de espera |

O **negócio precisa ser compreensível antes da interpretação do símbolo**: a colmeia aparece como consequência da colaboração, depois de a tarefa, o critério e a decisão estarem claros.

## 8. Critérios de sucesso desta versão

- Um leigo técnico (tech lead) explica, com as próprias palavras, o que a Hive faz, para quem e em que situação seria útil.
- Nenhuma frase da página contradiz o que o MVP executou.
- Lighthouse mobile ≥ 95 em todas as categorias (detalhe em `09-…`).
- Lista de espera recebe envios reais em ambos os idiomas.
