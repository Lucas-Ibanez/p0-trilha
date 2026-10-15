# CLAUDE.md — Landing page da Hive

> Ponto de entrada. Leia este arquivo inteiro antes de qualquer ação, depois os documentos em `docs/` na ordem indicada abaixo. Este arquivo é curto de propósito: o detalhe vive nos documentos.

## 1. Missão

Construir **do zero** a landing page bilíngue (**EN** e **PT-BR**) da **Hive**, substituindo o site atual (`https://hive-landingpage-seven.vercel.app/`), que é denso demais, parece um relatório técnico e não tem cara de startup.

A página precisa fazer quatro coisas, nesta ordem:

1. Explicar em poucos segundos **o que a Hive é**: uma **camada de confiança entre agentes**.
2. Mostrar que **funciona de verdade** hoje (transações reais em Solana devnet), sem prometer além disso.
3. Levar o visitante a **assistir à demo**.
4. Levar o visitante a **entrar na lista de espera**.

**Público:** software houses AI-native e plataformas de trabalho (jobs, agentes, bounties). Não é página para consumidor final nem para "toda a economia de agentes".

**Posicionamento:** *camada de confiança entre agentes*, com a colmeia como rede de relações. A confiança é **contextual** e nasce de **evidências verificáveis de interações específicas**. Assinatura oficial: **PT** "Hive. Confiança começa com um porquê." · **EN** "Hive. Trust starts with a reason."

## 2. Regra de ouro (a que mais importa)

**Hoje, a Hive verifica interações específicas. Com o tempo, essas interações verificadas podem construir confiança contextual.**

O produto de hoje é um escrow em Solana devnet condicionado a uma prova RISC Zero. A rede de agentes, o perfil contextual e a reputação são **visão**, não funcionalidade. A página conta a visão, mas **toda frase pertence a uma destas quatro classes e a classe precisa ser visível**: `Fato verificado` · `Hoje` · `Planejado` · `Visão`. Detalhes em `docs/02-claims-and-voice.md`. Em caso de dúvida entre vender mais ou dizer menos, **diga menos**.

## 3. Ordem de leitura e precedência

| # | Arquivo | Governa |
|---|---|---|
| 1 | `docs/02-claims-and-voice.md` | **O que se pode dizer.** Vence qualquer conflito de significado. |
| 2 | `docs/01-brief.md` | Para quem, por quê, metas, arco narrativo. |
| 3 | `docs/03-content-en-ptbr.md` | Estrutura da página e textos EN + PT-BR. |
| 4 | `docs/08-facts.md` + `data/evidence.json` | Números, endereços, transações. **Fonte única de fatos.** |
| 5 | `docs/04-design-system.md` | Tokens, tipografia, logo, formas, layout. |
| 6 | `docs/05-signature-visuals-and-motion.md` | Diagrama de delegação, cartões do journal, colmeia da visão, movimento. |
| 7 | `docs/06-engineering.md` | Stack, i18n, lista de espera, performance, a11y, SEO. |
| 8 | `docs/07-references.md` | O que aprendemos de Bido, Modal, Pluto, Nox, Linear. Inspiração, não molde. |
| 9 | `docs/09-acceptance-and-open-decisions.md` | Critérios de aceite e decisões que dependem de um humano. |

Precedência: **claims > conteúdo > fatos > design > engenharia**. Se algo conflitar sobre **o que um elemento significa ou promete**, vence o documento mais acima. Se conflitar sobre **como parece**, vence `04-design-system.md`.

## 4. Inegociáveis

1. **Nenhum número, hash, endereço ou link de Explorer é digitado à mão.** Tudo vem de `data/evidence.json`. Link de Explorer sempre com `cluster=devnet`.
2. **Todas as strings visíveis ficam em dicionários** (`en` e `pt-br`), com as mesmas chaves. Nenhum texto literal em componente. Alterar um idioma sem o outro é erro.
3. **Valores de identidade (cor, fonte, raio, espaçamento) só existem em tokens.** Nenhum `#392D40` dentro de componente.
4. **A célula (hexágono) nunca muda por causa do resultado.** O resultado vai em um rótulo. Célula verde ou vermelha vira selo de aprovação, que a marca proíbe.
5. **Sem dado simulado apresentado como real.** Ilustração é rotulada como ilustração. Vídeo que não existe aparece como "em breve", nunca como player fingindo.
6. **Os limites da prova são uma seção nomeada e visível**, nunca rodapé cinza de baixo contraste.
7. **Sem segredos no front-end.** Chaves do backend da lista de espera só no servidor.
8. **Não instalar dependência pesada sem necessidade clara** e sem registrá-la no relatório.
9. **Não decidir sozinho** o que está em `docs/09-acceptance-and-open-decisions.md` (seção "Decisões em aberto"). Pergunte.

## 5. Protocolo de trabalho

### Antes de escrever código

1. Inspecione o repositório: stack existente, `public/brand/` (logos SVG já salvos, ainda a organizar; `public/brand/MANIFEST.md` é a fonte da verdade dos nomes), scripts, configurações. Liste os arquivos de marca encontrados e mapeie os nomes ao uso previsto. Se um nome for ambíguo, pergunte.
2. Se o repositório estiver vazio, siga a stack padrão de `docs/06-engineering.md` e **confirme com o responsável** antes de instalar.
3. Produza um **plano curto**: fase, arquivos a criar/alterar, riscos e o comando que prova que a fase está pronta.

### Fases (uma por vez; não avance sem o aceite da anterior)

| Fase | Entrega | Aceite |
|---|---|---|
| 0 | Scaffold, tokens, fontes auto-hospedadas, i18n `/en` e `/pt-br`, `evidence.json` importável, **script de lint de claims** | Páginas vazias em 2 idiomas; lint roda; tokens sem valores soltos |
| 1 | Seções estáticas completas nos dois idiomas, mobile-first | Sem texto fora do dicionário; checklist de claims limpo |
| 2 | Visuais de assinatura (`05-…`) | Funcionam sem JS animado (estado final estático) e com `prefers-reduced-motion` |
| 3 | Lista de espera + player de demo | Envio real validado; estado "demo em breve" correto |
| 4 | SEO/OG, a11y, performance, polimento | Metas de `09-…` atingidas e medidas |
| 5 | Revisão adversarial de claims e de design | Relatório sem pendências críticas |

### Ao concluir cada fase, retorne sempre

1. Arquivos criados/modificados.
2. Resumo do que mudou e quais inegociáveis foram preservados.
3. **Comandos realmente executados** e a saída resumida real (build, lint, testes, Lighthouse).
4. Lacunas, hipóteses não confirmadas e decisões que precisam de humano.

"Deve funcionar" não é evidência. Evidência é comando executado.

## 6. Quando parar e perguntar

- Faltar um fato (hash completo, URL de vídeo, texto legal): **não preencher com algo plausível**. Deixe um marcador `TODO(content)` visível no relatório e siga com um estado vazio honesto.
- Um texto que você queira escrever tocar a lista de proibidos de `02-…`: pare e proponha alternativa.
- A identidade não cobrir um caso (cor de status verde/vermelho, mascote, favicon): use a solução neutra descrita em `04-…` e registre.
- Uma referência (`07-…`) sugerir algo que a marca proíbe: a marca vence.

## 7. O que NÃO fazer

- Não criar seções além do mapa de `03-…`. A página é **curta**. Menos é o ponto.
- Não colocar métricas de cliente, depoimentos, logos de cliente, "backed by", "parceiro de" ou TAM: **nada disso existe ainda**.
- Não usar estética de "startup de IA" genérica: gradientes roxo-azul, orbes brilhantes, robôs, cadeados, escudos.
- Não usar a abelha como selo de aprovação, nem animá-la como personagem.
- Não traduzir literalmente o EN para o PT-BR. Escreva o PT-BR como português natural (ver glossário em `03-…`).
- Não otimizar prematuramente nem reescrever o slogan.

## 8. Fontes originais (somente leitura, se copiadas para `docs/sources/`)

Posicionamento e Identidade (05.10.2026) · Tese geral da camada de confiança agent-to-agent · Modelo de Negócio, Cliente e Expansão · Panorama Competitivo · Estado do MVP (07.10.2026) · `HIVE_MVP_UI_GUIDE.md`. Quando houver divergência entre estes documentos e os arquivos em `docs/`, **os arquivos em `docs/` refletem as decisões mais recentes** da conversa de criação da landing, e as divergências relevantes estão listadas em `docs/09-…`.
