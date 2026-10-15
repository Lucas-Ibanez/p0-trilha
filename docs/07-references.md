# 07 — Referências

> **Inspiração, não molde.** Quando uma referência conflitar com a marca ou com `02-claims-and-voice.md`, **a Hive vence**. Esta análise foi feita em outubro de 2026 a partir do conteúdo, da estrutura e dos metadados dos sites (não de capturas renderizadas); onde algo é inferência visual, está dito.

## 1. O que cada referência ensina

### 1.1 Bido — `usebido.com` (a mais próxima de espírito)

**O que é:** compras (procurement) com agentes para fabricantes de EV; time ligado a Solana.
**O que se vê na estrutura:** vídeo de hero (`hero.mp4`), tema escuro (`theme-color #0a0a0a`), logo-mascote branco, promessa em uma frase + 2 CTAs, faixa de credibilidade ("backed, trained and awarded by"), *stepper* "STEP 01 / 06", **cartões de número grande com título curto** (10×, −9%, 100%, 0, 24/7, 1) e um bloco de integrações.

| Aprender | Como aplicar na Hive |
|---|---|
| Página curta, uma ação repetida | 8 seções, CTAs de `01-brief.md` §5.2 |
| **Números grandes + título curto** | Os 4 números reais da seção Provas (3 desfechos, 4 rejeições, 99.541 CU, 165 bytes) |
| "Pay on proof, not on promise" (tom próximo da Hive) | Subtexto da seção Provas, em tom sereno, sem slogan de efeito |
| Stepper numerado | "Como funciona" (4 passos) |
| Mascote como elemento recorrente | **A abelha vive no logo e na nav; não** como personagem |
| **Não copiar** | Métricas comerciais (10×, −9%) e faixa "backed by": a Hive **não tem** nenhum dos dois |

### 1.2 Modal — `modal.com`

**O que é:** infraestrutura de nuvem para IA.
**O que se vê:** produto como ilustração (fragmentos de **audit log**, gráficos de containers, utilização de GPU), seções por capacidade com primitivas numeradas (1, 2, 3), citações de clientes, parede de logos, *changelog*, página de **press kit** com download de logo, cor de marca verde com triângulos em gradiente.

| Aprender | Como aplicar |
|---|---|
| **Fragmentos de UI como imagem** (parecem reais porque são reais) | A "anatomia da transação" e os cartões do journal, montados de `evidence.json` |
| Autoridade técnica sem parede de jargão | Detalhe técnico sob demanda (cópia, valor completo, `/proof`) |
| Press kit | Fase opcional: `/brand` com logos SVG e regras de uso |
| **Não copiar** | Volume de páginas, parede de logos, depoimentos |

### 1.3 Pluto Security — `pluto.security`

**O que é:** segurança para o uso de IA em empresas.
**O que se vê:** **metáfora única e consistente** (espaço: planetas, estrelas, astronauta/mascote), `theme-color #FFFF78`, microcopy bem-humorado ("Rule the AI atmosphere"), lista de casos por área ("You get a yes!"), depoimentos, blog de pesquisa.

| Aprender | Como aplicar |
|---|---|
| Uma metáfora **atravessando** ilustração e microcopy deixa a marca memorável numa categoria séria | Colmeia/células/abelha, **contida** (`04-…` §6; `02-…` §4.5) |
| Lista de "quem ganha o quê" por área | "Para quem" com dois perfis, sem lista longa |
| **Não copiar** | O **humor** e o **volume**. O tom da Hive é sereno e criterioso; piada em produto de confiança corrói credibilidade. Sem mascote falante |

### 1.4 Nox Metals — `noxmetals.co`

**O que é:** chapas de alumínio cortadas sob medida, com otimização por IA; rodada seed anunciada no próprio site.
**O que se vê:** vídeo de hero, **analogia direta** ("Metal at the speed of software"), faixa de clientes sérios, **cartões de liga imitando a tabela periódica** (número, símbolo, composição %), painel que parece vivo ("84.0% YIELD · 15,792 LAYOUTS EVALUATED"), **manifesto curto e emocional**, CTA de **ação de produto** ("Instant Quote"), banner de notícia.

| Aprender | Como aplicar |
|---|---|
| **Dado do domínio como ornamento** | **Cartões do journal** (7 campos com offset), a ideia mais forte desta página |
| Painel técnico que "pulsa" sem mentir | Indicador de largura do journal (165 bytes em 7 trechos) |
| Manifesto curto | Uma frase na seção A decisão, sem virar texto longo |
| **Não copiar** | CTA de compra; faixa de clientes; "better than any human planner" (claim de superioridade) |

### 1.5 Linear — `linear.app` (adicionada nesta análise)

**O que é:** gestão de produto com agentes. **O que se vê:** fundo escuro (`#08090a`), interface real do produto como hero (issue, atividade, agente), legendas numeradas **"Fig 0.1, 0.2, 0.3"**, changelog em destaque, página "Method".

| Aprender | Como aplicar |
|---|---|
| **Interface real como hero**, não ilustração abstrata | Capturas reais da interface Hive + diagrama montado com dados reais |
| **Legendas numeradas (Fig 0.1)** | Dão rigor técnico sem esforço; usar nas figuras de "Como funciona" |
| Trata agentes como colegas | Mesmo espírito: agentes delegam e executam; a Hive dá o fundamento |

## 2. Padrões comuns e destino na Hive

| Padrão | Onde aparece | Equivalente real da Hive |
|---|---|---|
| Promessa em uma frase + no máx. 2 CTAs | Todos | Assinatura + `hero.sub`; Demo e lista de espera |
| Vídeo/produto no hero | Bido, Nox, Linear | Diagrama de delegação (+ demo em modal) |
| Faixa de credibilidade | Bido, Nox, Pluto, Modal | **Não** como "endossos". Faixa "Built with": Solana, RISC Zero, Anchor, **em texto**, rotulada como tecnologia usada |
| Produto como ilustração | Modal, Linear, Nox | Anatomia da transação, tela de compromissos × journal |
| Dado como ornamento | Nox, Bido | Cartões do journal |
| Fluxo numerado em poucos passos | Bido, Modal | 4 passos |
| Metáfora visual consistente | Pluto, Bido | Colmeia, contida |
| Página curta, ação repetida | Bido, Nox | 8 seções |

**Sobre a faixa "Built with":** usar **nomes em texto** (mono, pequenos), não os logotipos oficiais, para evitar a impressão de endosso e questões de uso de marca. Texto de apoio: *Built with open technology*. / *Construído com tecnologia aberta.* Nada de "parceiro", "apoiado por".

## 3. O que as referências têm em comum e a Hive NÃO tem (não fingir)

Clientes, depoimentos, métricas de ganho, rodada de investimento, parede de logos, integrações com sistemas de clientes. **Nenhum desses elementos entra**, nem como placeholder. A credibilidade da Hive vem de **prova verificável** e **honestidade sobre limites**.

## 4. Candidatas para uma segunda rodada

> **Não verificadas nesta sessão** (vindas de conhecimento prévio; os sites mudam). Antes de usar como referência, abrir e confirmar. Sugestão: quem for revisar manda capturas.

| Grupo | Candidatas | Por que olhar |
|---|---|---|
| Infra para agentes | E2B, Browserbase, Resend, Vercel, Railway | Landing técnica limpa, produto como ilustração, CTA para desenvolvedor |
| Zk / cripto sóbrio | Succinct, Boundless (RISC Zero), Phantom, Squads | Como comunicam prova sem teatro cripto; vizinhança direta da Hive |
| Confiança e finanças B2B | Mercury, Ramp, Stripe | Tom sóbrio, números, hierarquia clara |
| Galerias para garimpar | Godly, Land-book, Awwwards, One Page Love | Padrões de hero, tipografia, ritmo |

## 5. Como usar este arquivo

1. **Antes de desenhar uma seção**, ler a linha da referência correspondente.
2. **Nunca** copiar layout, ilustração ou texto: a Hive reinterpreta o **princípio** com seus próprios tokens e dados.
3. Se uma decisão de design for justificada só por "o Modal faz assim", ela está fraca. Justifique pelo **leitor** (tech lead / operador de plataforma) e pelo **porquê** da marca.
