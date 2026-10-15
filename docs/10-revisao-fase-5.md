# 10 — Revisão adversarial (fase 5)

> Resposta às perguntas de `09-acceptance-and-open-decisions.md` §2, com evidência executável. Data: 2026-10-15.
>
> **Limite desta revisão:** `09` §2 pede alguém que **não escreveu** as seções. Esta revisão foi feita pelo mesmo agente que construiu a página, só que com postura adversarial e com **testes que olham o que o visitante vê** (texto renderizado e cores computadas), não os dicionários. Ela reduz o risco, mas **não substitui** uma revisão humana independente (itens da seção 5).

## 1. Resultado

**Nenhuma pendência crítica para publicar a landing em modo prévia.** Seis achados reais foram corrigidos nesta fase (seção 3). Ficam pendências que dependem de pessoas (seção 5), duas delas **bloqueiam abrir a lista de espera de verdade** (D2 backend, D9 revisão jurídica), não a publicação da landing.

## 2. As dez perguntas

| # | Pergunta | Resposta | Evidência | Status |
|---|---|---|---|---|
| 1 | Inflação de claim | Dois trechos prometiam mais que a prova (achados A1 e A2); corrigidos. Sobram três afirmações sobre o **repositório** que não dá para verificar daqui (seção 4). | Leitura integral do texto renderizado de `/en`, `/pt-br` e das políticas; `e2e/review.spec.ts` aplica a lista de proibidos (`data/forbidden-terms.json`) ao **texto renderizado**, incluindo `evidence.json` e atributos `alt`/`aria-label` | ✅ corrigido, 🔶 seção 4 |
| 2 | A Hive "decide"? | Não. Toda decisão de pagamento é atribuída ao **programa**, a partir do **resultado verificado**; os rótulos são "Critérios atendidos/não atendidos"; nenhum botão ou imagem aprova ou rejeita. | Regra `hive-decides` e `verdict-words` no teste de texto renderizado; `faq.decides` | ✅ |
| 3 | Visão virando funcionalidade | Não: a seção tem selo **Visão**, legenda "não é uma funcionalidade disponível hoje" e os dois itens **Planejado** em bloco separado; o texto usa "pode". Observação de baixo risco: o *eyebrow* do hero ("uma camada de confiança para o trabalho entre agentes") é posicionamento, mas o subtítulo logo abaixo começa com "Hoje". | Leitura; `e2e/interaction.spec.ts` (colmeia com legenda) | ✅ |
| 4 | Selo escondido | Não. A célula é idêntica nos 3 desfechos; nenhuma cor de status; sem ícone de check, escudo ou cadeado; âmbar só em ação, foco, halo da Visão e ponto de evento. | `review.spec.ts` percorre **todas** as cores computadas (texto, fundo, contorno, traço, preenchimento) e exige paleta da marca (roxo/neutro/âmbar); `interaction.spec.ts` compara o `path` da célula | ✅ |
| 5 | Hash disfarçado | Não. Nenhum hash completo no texto; todo valor truncado tem reticências; só o `image_id` tem botão Copiar (único com valor completo em `evidence.json`); os demais dizem que o valor completo está no repositório. | `review.spec.ts`: nenhum hex ≥ 32 nem base58 ≥ 32 no texto visível; cartões de hash contêm `…` | ✅ |
| 6 | Drift EN/PT-BR | Não encontrado. Mesmas chaves, mesmos números, mesmo nível de afirmação (comparado lado a lado). | `check:i18n`; `review.spec.ts`: o multiconjunto de números visíveis é igual nos dois idiomas | ✅ |
| 7 | Dado órfão | Nenhum. Todo número visível é derivado de `evidence.json` ou é constante documentada (`2 × entrada`, passos 1 a 4, ano do rodapé, licença, memória medida). | `review.spec.ts` lista cada número visível e falha se não está no conjunto permitido | ✅ |
| 8 | Vazamento | A prévia **não envia nada** (zero requisições), não grava cookie, `localStorage` nem `sessionStorage`, não põe o e-mail na URL e não registra nada no console. Não há backend, logo não há log de e-mail. | `waitlist-demo.spec.ts` e `review.spec.ts`; `unit` do validador | ✅ (em prévia) |
| 9 | Cluster errado | Nenhum: 11 links do Explorer na página, todos com `cluster=devnet`, nas duas rotas. | `check:evidence`; `i18n.spec.ts` | ✅ |
| 10 | Compreensão em 5 s | **Não testável sem pessoas.** Protocolo na seção 5. | — | ⏳ humano |

Os testes não são só confirmações: injetei um texto com "trustless" e "50 times safer" e um tom verde, e quatro testes falharam (proibidos, número órfão, paridade EN/PT, cor de status); depois revertei.

## 3. Achados e correções

| ID | Severidade | Achado | Correção |
|---|---|---|---|
| A1 | **Alta** | `demo.body` prometia "uma tomada contínua… todo corte e toda aceleração indicados na tela". Os vídeos reais (D6) não foram verificados, então a promessa podia ser falsa. | Texto neutro: "Uma demo da Hive rodando na devnet da Solana e o vídeo de pitch." |
| A2 | **Média** | `faq.rails.a` dizia "outros meios de pagamento são planejados", que `08` §8 classifica como Visão/D14. | Agora diz que nenhum outro meio de pagamento foi construído. |
| A3 | **Média** | O consentimento do formulário ("Concordo que a Hive armazene meus dados…") contradizia o aviso de que nada é armazenado. | Em prévia, o consentimento diz que nada é enviado nem armazenado; o texto final volta quando houver backend (D9). |
| A4 | **Média** | O logo horizontal do cabeçalho tinha 104 px, abaixo do mínimo de 128 px da marca (`04` §5); foi reduzido na fase 4 para caber em 360 px. | 128 px em todas as larguras; o menu mobile virou ícone; folga de 12 px ao redor (teste de largura mínima em 360, 390, 768 e 1280). |
| A5 | Baixa | O rótulo "Demo técnica" não correspondia ao vídeo "Demo" informado. | Rótulo "Demo". |
| A6 | Baixa | O CTA "Avise-me quando estiver no ar" ficou incoerente com vídeos já no ar. | Com vídeo no ar, o CTA da seção é "Entrar na lista de espera". |

Corrigidos antes, por testes automatizados (fase 4): nome acessível do seletor de idioma sem o texto visível; `role="group"` dentro de `<ul>`; `<div>` solto dentro de `<dl>`.

## 4. Fatos que só quem conhece o repositório pode confirmar

Nada foi inventado, mas estes pontos vêm dos textos de `03` e **não estão em `08-facts.md`**; confirmar antes de publicar:

1. `limits.repro`: "Os comandos estão no README do repositório."
2. Cartões do journal: "Valor completo disponível no repositório" (os hashes completos de `job_id`, `spec_hash`, `harness_hash` e `artifact_hash`).
3. `faq.proof.a`: a compressão Groth16 roda "num container local sem acesso à rede".
4. `demo.lang`: os dois vídeos são **em inglês** (o áudio não foi verificado).
5. O que os vídeos realmente mostram (a página só diz "demo" e "pitch").

## 5. Pendências humanas

| Item | Quem | Observação |
|---|---|---|
| Teste de compreensão em 5 s (pergunta 10) | Leonardo + Henrique | Mostrar o hero por 5 s a 3 tech leads e perguntar "o que a Hive faz?". Sucesso: dizem algo como "camada de confiança para trabalho entre agentes". Registrar as respostas aqui. |
| Revisão jurídica da política (D9) e dados do controlador | Henrique | **Bloqueia abrir a lista de espera.** |
| Backend da lista de espera (D2) | Lucas | **Bloqueia abrir a lista de espera.** Até lá, a página fica em modo prévia. |
| Leitor de tela real (NVDA ou VoiceOver) em amostra | qualquer pessoa | O axe e o teclado passam, mas não substituem. |
| Itens da seção 4 | Lucas | — |
| Textos acima de 35 palavras (`check:content`, 7 avisos) | Leonardo | Cortar ou aprovar a exceção. |
| Ativos definitivos: favicon, ícones, OG, SVGs mestres, capturas reais, legendas `.vtt`, pôsteres | Leonardo / Lucas | Hoje provisórios, marcados `TODO(brand)`/`TODO(content)`. |
| LCP de campo após o deploy (D17) | Lucas | Reabrir D17 se passar de 2,5 s em mobile. |
| D7 (equipe), D8 (analytics), D10 a D13, D15, D16 | vários | Seguem no padrão do documento. |

## 6. Checklists

- **`02` §8 (claims):** classes visíveis (Hoje, Planejado, Visão, link do Explorer ao lado dos fatos); frase 1 com link real nos dois idiomas; limites da prova em seção própria; faixa de ambiente em todas as telas, inclusive política e 404; lista de proibidos limpa (dicionários, componentes **e** texto renderizado); números e links de `evidence.json`; EN e PT-BR no mesmo nível; célula idêntica; nenhum logo, depoimento ou métrica de cliente. ✅
- **`04` §10 (design):** nenhum valor de marca fora de `tokens.css` e **nenhum efeito proibido** (`check:tokens` agora barra sombra, blur e degradê); contraste conferido pelo axe; um âmbar por viewport; logo ≥ 128 px; sem rolagem horizontal em 6 larguras × 2 idiomas; hashes em mono. ✅ (favicon provisório)
- **`05` §8 (visuais):** estado final legível sem animação e sem JS; `prefers-reduced-motion` testado; abas, passos e FAQ só com teclado; colmeia com selo, legenda e Planejado separado. ✅
- **`09` §1.1 a §1.7:** ver `README.md` para os comandos; números de performance em `06` §1.3 e §8. A meta de JS foi rebaixada (D17).

## 7. Como reproduzir

```bash
npm run check          # claims, i18n, conteúdo, evidência, tokens (inclui efeitos proibidos)
npm run test:unit      # 11 testes
npm run build && npm run test:e2e   # 60 testes (+1 que exige as URLs de vídeo), incluindo e2e/review.spec.ts e o axe
```
