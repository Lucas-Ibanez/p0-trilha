# 02 — Claims e tom de voz

> **Este documento vence qualquer conflito sobre o que a página diz ou promete.** Existe porque a Hive é uma startup de *confiança*: uma frase inflada custa mais caro aqui do que em qualquer outro produto.

## 1. Princípio

**Verificado não significa seguro, correto, autorizado nem adequado para qualquer finalidade.** A página demonstra um "porquê" (critério, evidência, limite), não uma garantia. Cada afirmação importante precisa ter um fundamento compreensível a um clique de distância.

## 2. As quatro classes de afirmação

Toda frase da página pertence a **exatamente uma** classe. Se não souber qual, ela não entra.

| Classe | Significa | Exemplo | Rótulo visível |
|---|---|---|---|
| **Fato verificado** | Aconteceu e há transação/commit que prova | "Três desfechos liquidados em devnet em 2026-10-07" | Link para o Explorer ao lado |
| **Hoje** | O MVP faz isso, em devnet, com Test USDC | "A prova é gerada localmente e verificada em devnet por CPI" | Faixa de ambiente persistente (devnet · Test USDC) |
| **Planejado** | Está no plano, não está construído | "Avaliadores determinísticos para tarefas reais e delimitadas" | Selo **Planejado / Planned** |
| **Visão** | Direção de marca e produto; pode não acontecer como descrita | "Confiança contextual construída ao longo de interações verificadas" | Selo **Visão / Vision** + legenda "ilustração, não é funcionalidade atual" |

Regras:

- Selos têm texto, nunca só cor ou ícone.
- Conteúdo de **Planejado** e **Visão** nunca usa verbo no presente de capacidade ("a Hive mapeia…"). Use "pode", "planejamos", "a visão é".
- A seção **A Hive** (colmeia/rede) é inteira de classe **Visão**, com exceção da frase-ponte aprovada.

## 3. Frases obrigatórias (não reescrever)

1. **Frase 1 (claim congelado)**, sempre junto de qualquer menção a "verificação on-chain" e ao link de uma liquidação real:
   - **EN:** *Hive's Groth16 receipt is verified on devnet via CPI to the immutable Groth16 verifier of risc0-solana v3.0.0, in the same instruction that releases or refunds the job's Test USDC.*
   - **PT-BR:** *A receipt Groth16 da Hive é verificada em devnet por CPI ao verificador Groth16 imutável de risc0-solana v3.0.0, na mesma instrução que libera ou devolve o Test USDC do job.*
2. **Limites da prova**, em seção nomeada e legível (ver `03-…`, seção 5).
3. **Faixa de ambiente** visível em todas as telas: *Solana devnet · Test USDC only* / *Solana devnet · somente Test USDC*.
4. **Slogan** com a redação oficial do idioma. EN "Hive. Trust starts with a reason." · PT-BR "Hive. Confiança começa com um porquê." (Uso do slogan sem o prefixo "Hive." no H1 do hero: decisão aberta D4.)
5. **Rodapé:** *Devnet and Test USDC only; none of this exists on mainnet.* · *O repositório e o código mantêm o nome anterior, `vericode`.*

## 4. Lista de proibidos

> O script `scripts/check-claims.mjs` (fase 0) lê os dicionários e componentes e **falha o build** ao encontrar qualquer termo abaixo fora da `allowlist` (chaves específicas de dicionário onde o termo aparece **negado ou explicado**, como `faq.mainnet`). Termos entre aspas valem em EN e PT-BR.

### 4.1 Sobre o código e a prova

| Não dizer | Por quê | Dizer |
|---|---|---|
| "o código está correto" / "code is correct" | A prova não atesta qualidade | "O artefato passou pelo avaliador determinístico comprometido." |
| "trustless" / "ninguém precisa confiar em ninguém" | Há confiança residual (harness, escopo, operador) | "A decisão de pagamento não depende de julgamento discricionário da plataforma." |
| "qualquer repositório" / "any codebase" / "arbitrary code" | v1 verifica **um artefato restrito** | "Uma classe restrita de artefato e de avaliador na v1." |
| "ZK on-chain" (sozinho) | Só vale com a frase 1 e link de liquidação real | A **frase 1**, por inteiro. |
| "auditado" / "audited" | Houve revisões internas adversariais, não auditoria independente | "Revisado internamente por revisões adversariais separadas." (só se necessário) |
| "privado" / "privacidade total" / "private" | O provador conhece os inputs | "Código e testes podem ficar fora da cadeia; os inputs ainda são conhecidos por quem prova." |
| "máquina nova" / "new machine" | Foi clone e targets novos, toolchains isoladas copiadas | "Reproduzido a partir de um clone, em ambiente limpo." |
| "Verifier Router" como caminho atual | O Router de devnet não foi inicializado; a verificação é por CPI direta | "CPI direta ao verificador Groth16 imutável." |
| "tecnologia criptográfica própria" | Usamos RISC Zero e risc0-solana | "Protocolo e integração desenvolvidos internamente." |
| "ZK prova qualidade/segurança/valor do software" | Falso | — |

### 4.2 Sobre rede, dinheiro e escala

| Não dizer | Dizer |
|---|---|
| "mainnet" como disponível / "dinheiro real" / "USDC" sozinho / "$" | "Solana devnet" e "Test USDC", sempre juntos |
| "ao vivo", "em produção", "lançado" | "Rodando em devnet" |
| "marketplace", "catálogo de agentes", "matching" como oferta atual | (omitir; se citado, rotular **Visão**) |
| "reputação", "score", "nível de confiança", "ranking de agentes" | "evidências de interações específicas" |
| "agente confiável", "agente verificado", "agente certificado" | "interação verificada" |
| "Sybil-proof", "à prova de manipulação" | "sinais baseados em entregas verificadas" |
| "protocolo aberto", "padrão" (sem evidência) | "código aberto sob Apache-2.0" (isto é fato) |

### 4.3 Sobre mercado, tração e concorrência

| Não dizer | Por quê |
|---|---|
| "o primeiro", "o único", "sem concorrentes", "inédito", "categoria nova" | Não há base para exclusividade em escrow, Solana, zkVM, job lifecycle, evaluator ou *verify-then-pay* |
| Qualquer TAM/SAM/SOM, "bilhões", "mercado de US$ X" | Denominadores e disposição a pagar **não foram medidos** |
| Logos de cliente, depoimentos, "usado por", "X times", pilotos, receita | **Não existem.** Nada disso pode aparecer, nem como placeholder |
| "apoiado por", "parceria com", "endossado por" | Não há. Citar Solana, RISC Zero, Anchor apenas como **tecnologia usada** |
| "mais rápido/barato que CI / revisão humana" | Não foi medido. Pilotos futuros compararão |
| Nomear concorrentes | A landing não faz comparação nominal |
| Qualquer métrica de ganho (−X% custo, 10× mais rápido) | Não medida |

### 4.4 Sobre a interface e o veredito

| Não dizer | Dizer |
|---|---|
| "Aprovado" / "Rejeitado" como veredito | "Critérios atendidos" / "Critérios não atendidos" |
| "seguro", "confiável", "garantido", "certificado" | descrever **o que foi verificado** |
| "a Hive decide", "a IA decide", "Hive aprova" | "o programa libera/devolve a partir do resultado verificado" |
| "Every verified interaction strengthens the Hive" | Uma interação pode evidenciar falha e **reduzir** confiança. Evitar a ideia de acúmulo monotônico |
| "Agents act. Hive decides what can happen next" / "Hive lives between action and consequence" | Exploradas e **não adotadas**: excedem o MVP |

### 4.5 Metáfora: contida

Não atribuir significado extra à colmeia. **Não estabelecido:** mel = dinheiro, rainha = CEO, pólen = dados, asas = APIs, ferrão = segurança. Evidência, política, identidade, permissão e liquidação mantêm linguagem tecnológica normal. Proximidade entre células **não** significa relação de confiança.

## 5. Números

- Todo número vem de `data/evidence.json` (ver `08-facts.md`). Cada número tem fonte e data.
- Não arredondar para cima, não somar, não extrapolar. "99.541 CU" é o custo do verificador na transação de liquidação; "~122 mil CU" é o total daquela transação.
- Tempos de prova são **medições em WSL com 7,6 GiB de RAM**; não são promessa de desempenho.
- Valores monetários: sempre "Test USDC", nunca símbolo de moeda.
- Datas em ISO ou por extenso conforme o idioma (`2026-10-07` / "7 de outubro de 2026").

## 6. Tom de voz

**Personalidade:** serena, curiosa, criteriosa. Intenções: clareza, precisão, controle, cooperação.

| Faça | Evite |
|---|---|
| Explicar. Dizer o critério e o limite. | Proclamar, prometer, vender. |
| Frases curtas, voz ativa, verbos concretos. | Jargão antes do conceito. ("CPI", "Groth16" só depois de dizer o que fazem.) |
| Começar pela **tarefa, critério e decisão**; arquitetura depois, sob demanda. | Abrir com a visão abstrata da "economia de agentes". |
| Perguntas simples e humanas, com moderação ("Dá para aceitar?"). | Perguntas retóricas em série. |
| Caixa de frase (*Sentence case*) em títulos e botões. Maiúsculas só para siglas e códigos (API, ID, PASS). | Title Case, CAIXA ALTA decorativa. |
| Detalhe técnico em IBM Plex Mono, com cópia. | Mono em parágrafos. |
| Admitir limite sem pedir desculpas. | Hype, exclamação, emoji, trocadilho, humor de marca (o de Pluto **não** serve aqui). |

**Teste final de cada frase:** *"Isso explica um porquê, ou só soa convincente?"* Se for o segundo, reescreva ou corte.

**Primeira pessoa:** "nós" apenas para fatos sobre o projeto ("Planejamos pilotos…"); a página fala com **você** (PT-BR) / **you** (EN).

## 7. Regras visuais que são claims

(Detalhe em `04-…` e `05-…`; aqui porque mudam o significado.)

1. A **célula** é idêntica em "critérios atendidos", "não atendidos" e "prazo vencido". O que muda é o **rótulo**.
2. A abelha **não é selo** de aprovação. Sem escudo, cadeado, "verified badge".
3. Espessura ou densidade de linha **não** indica confiança.
4. Cores de status vêm **sempre** com ícone e rótulo; âmbar **não** é cor de sucesso.
5. O **Trust Halo** e a rede de células aparecem **somente** na seção de Visão, rotulados.
6. Ausência de evidência, histórico negativo e proibição por política são **estados diferentes**; nunca desenhar como equivalentes.

## 8. Checklist de claims (rodar antes de cada merge)

- [ ] Cada frase tem uma classe (Fato / Hoje / Planejado / Visão) e o rótulo visível quando aplicável.
- [ ] A frase 1 aparece onde se fala de verificação on-chain, com link real.
- [ ] Os limites da prova estão visíveis e legíveis (contraste AA).
- [ ] Faixa de ambiente presente.
- [ ] Nenhum termo da lista de proibidos fora da `allowlist`.
- [ ] Todo número e link vem de `evidence.json`; todo Explorer tem `cluster=devnet`.
- [ ] EN e PT-BR dizem a **mesma coisa** (mesmo nível de afirmação, não só tradução).
- [ ] Nenhuma célula muda de cor por resultado.
- [ ] Nenhum logo, depoimento ou métrica de cliente.
