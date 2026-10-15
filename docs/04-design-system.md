# 04 — Design system da landing

> Traduz a identidade da Hive (documento *Posicionamento e Identidade*, estado de 05.10.2026) para a web. **Valores só existem como tokens.** Componentes referenciam papéis, nunca valores. Trocar a identidade inteira deve exigir alterar **somente** `src/styles/tokens.css`.
>
> Legenda de origem: **[marca]** = valor/regra do documento de identidade · **[derivado]** = decisão desta landing a partir da marca, a validar com Leonardo · **[TODO]** = ainda indefinido.

## 1. Intenção visual

Serenidade, precisão, controle, cooperação. Sobriedade com personalidade. **Berinjela organiza a identidade e as superfícies; âmbar concentra a atenção** nas ações principais e em detalhes da marca. O produto é rigor: a página deve parecer **instrumento de precisão**, não anúncio.

**Imagem-alvo:** a clareza técnica do Linear, os fragmentos de produto do Modal, os números grandes do Bido e a ideia do Nox de transformar o dado do domínio em ornamento. Tudo isso **em berinjela e âmbar, sem gradientes, sem brilho**. (Ver `07-references.md`.)

## 2. Cores (tokens por papel)

### 2.1 Paleta da marca [marca]

| Nome | Hex | Papel |
|---|---|---|
| Berinjela profundo | `#392D40` | Cor principal: identidade, fundos institucionais, texto principal sobre claro |
| Âmbar | `#E8B44C` | Ação principal, detalhes da abelha, foco/seleção |
| Branco quente | `#FAF7F5` | Fundo geral claro |
| Lilás suave | `#E7DFE9` | Superfícies secundárias, bordas suaves, seleção |
| Malva | `#796680` | Texto secundário sobre claro |
| Branco puro | `#FFFFFF` | Painéis, cartões, tabelas |
| Texto principal (dark) | `#FCF8F2` | Texto sobre berinjela (do dark mode da marca) |
| Texto secundário (dark) | `#DED5E3` | Texto secundário sobre berinjela |
| Texto sobre âmbar (dark) | `#302936` | Rótulo de botão âmbar em contexto escuro |
| Borda (dark) | `#726878` | Divisórias **não textuais** sobre escuro |

O dark mode "berinjela acinzentado" da marca (`#45404C` fundo, `#35303D` menu, `#4D4655` painel, `#57505F` campos) é para **dashboards/produto**. A landing usa o **berinjela `#392D40`** como superfície escura institucional (a marca: "o berinjela permanece a cor principal, inclusive em fundos institucionais"). Não misturar os dois escuros na mesma página.

### 2.2 Estratégia de superfícies [derivado]

A página alterna **bandas** berinjela e branco quente. Não há alternador de tema na v1 (um acabamento completo; ver D13). Ordem: berinjela (hero) → claro → claro → berinjela (demo) → claro (provas) → berinjela (visão) → claro → claro/berinjela (final).

### 2.3 Tokens

```css
/* src/styles/tokens.css — ÚNICO lugar com valores de identidade */
:root {
  /* marca (primitivos) */
  --brand-aubergine:  #392D40;
  --brand-amber:      #E8B44C;
  --brand-warm-white: #FAF7F5;
  --brand-lilac:      #E7DFE9;
  --brand-mauve:      #796680;
  --brand-white:      #FFFFFF;
  --brand-dark-text:  #FCF8F2;
  --brand-dark-muted: #DED5E3;
  --brand-dark-border:#726878;
  --brand-on-amber-dark: #302936;

  /* papéis — superfície clara (padrão) */
  --surface-page:     var(--brand-warm-white);
  --surface-card:     var(--brand-white);
  --surface-subtle:   var(--brand-lilac);
  --text-primary:     var(--brand-aubergine);
  --text-secondary:   var(--brand-mauve);       /* só sobre warm-white/white; ver §2.4 */
  --border-soft:      var(--brand-lilac);
  --action-bg:        var(--brand-amber);
  --action-text:      var(--brand-aubergine);
  --focus-ring:       var(--brand-aubergine);   /* sobre claro */
  --link:             var(--brand-aubergine);

  /* tipografia */
  --font-sans: "Manrope", system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, "SFMono-Regular", Menlo, monospace;

  /* forma */
  --radius-control: 8px;    /* botões, campos [marca: testar] */
  --radius-card:    12px;   /* cartões [marca: testar] */
  --radius-pill:    999px;  /* só filtros/chips de estado */

  /* espaço (escala 4 px) */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px; --space-4: 16px;
  --space-6: 24px; --space-8: 32px; --space-12: 48px; --space-16: 64px;
  --space-24: 96px; --space-32: 128px;

  /* largura */
  --container: 1200px;
  --measure:   68ch;        /* 60–75 caracteres [marca] */
}

/* superfície escura institucional: reatribui PAPÉIS, não componentes */
[data-surface="aubergine"] {
  --surface-page:   var(--brand-aubergine);
  --surface-card:   color-mix(in srgb, var(--brand-warm-white) 6%, var(--brand-aubergine));  /* [derivado] */
  --surface-subtle: color-mix(in srgb, var(--brand-warm-white) 10%, var(--brand-aubergine)); /* [derivado] */
  --text-primary:   var(--brand-warm-white);        /* ver §2.4: usar #FAF7F5 (12,13:1) */
  --text-secondary: var(--brand-dark-muted);
  --border-soft:    color-mix(in srgb, var(--brand-warm-white) 16%, transparent);           /* [derivado] */
  --action-bg:      var(--brand-amber);
  --action-text:    var(--brand-aubergine);
  --focus-ring:     var(--brand-amber);
  --link:           var(--brand-warm-white);
}
```

### 2.4 Contraste (medido; WCAG 2.2)

| Par (texto/elemento → fundo) | Razão | Uso permitido |
|---|---|---|
| `#392D40` → `#FAF7F5` | **12,13 : 1** | Todo texto sobre claro |
| `#392D40` → `#FFFFFF` | 12,94 : 1 | Cartões |
| `#796680` → `#FAF7F5` | 4,89 : 1 | Texto secundário **≥ 16 px** sobre warm-white. Passa AA (≥ 4,5). |
| `#796680` → `#FFFFFF` | 5,22 : 1 | Idem sobre branco |
| `#796680` → `#E7DFE9` | **4,01 : 1** | ⚠ **Não passa AA para texto normal.** Não usar malva sobre lilás. Sobre lilás, usar berinjela. |
| `#FAF7F5` → `#392D40` | 12,13 : 1 | Texto sobre berinjela |
| `#DED5E3` → `#392D40` | 9,08 : 1 | Texto secundário sobre berinjela |
| `#392D40` → `#E8B44C` | 6,82 : 1 | Rótulo de botão âmbar |
| `#E8B44C` → `#392D40` | 6,82 : 1 | Âmbar como texto/ícone **sobre berinjela** |
| `#E8B44C` → `#FAF7F5` | **1,78 : 1** | ⚠ **Âmbar nunca é texto, link ou ícone informativo sobre claro.** Só como preenchimento de botão (com texto berinjela) ou detalhe decorativo da abelha. |
| `#726878` → `#392D40` | 2,44 : 1 | Só divisórias decorativas. Nunca texto, nunca borda funcional de controle (usar ≥ 3:1). |

Regras: bordas funcionais de controles e foco ≥ 3:1. Foco visível sempre (anel de 2 px + deslocamento de 2 px). Validar no build com axe e Lighthouse.

### 2.5 Uso do âmbar [marca]

Concentrado em **ação prioritária, detalhes da logo e foco/seleção**. Evitar grandes áreas preenchidas. **Âmbar não é cor de sucesso** e não indica aprovação.

### 2.6 Cores de status [TODO]

O documento de marca diz que verde e vermelho aparecem nos estudos, mas **seus códigos finais não foram definidos**. A landing **não depende deles**:

- Desfechos usam **rótulo + ícone + forma**, em berinjela/malva/lilás, com o nome técnico em mono (`Released`, `RefundedOnFail`, `RefundedOnTimeout`).
- Se o responsável definir verde/vermelho depois, entram **como tokens** (`--status-ok`, `--status-fail`) e **sempre** acompanhados de ícone e rótulo. Nunca preencher a célula com a cor.

## 3. Tipografia

Famílias [marca]: **Manrope** (comunicação e interface) + **IBM Plex Mono** (somente conteúdo técnico). Não introduzir terceira família. Plus Jakarta Sans e IBM Plex Sans são alternativas comparadas, **não** usar.

- Auto-hospedar (licença OFL). Subset **latin + latin-ext** (acentos do PT-BR). Manrope variável (pesos 400–800); IBM Plex Mono 400 (e 500 se necessário).
- `font-display: swap`; pré-carregar só o peso do hero. Fallback com métricas ajustadas para evitar salto de layout.
- Validar acentos, `0/O`, `1/I/l`, e **algarismos tabulares** (`font-variant-numeric: tabular-nums`) na versão da Manrope usada; se não houver `tnum`, alinhar números em mono.

### 3.1 Escala

A escala do documento de marca é para produto; para marketing a landing **estende** os títulos, mantendo família e pesos. Registrar a extensão no documento de marca após aprovação (D13).

| Papel | Fonte/peso | Desktop | Mobile | Entrelinha | Origem |
|---|---|---|---|---|---|
| Título de destaque (H1 do hero) | Manrope 700 | **56 px** | **36 px** | 1,15 | [marca] |
| H2 de seção | Manrope 600 | 40 px | 28 px | 1,2 | [derivado] |
| H3 | Manrope 600 | 24 px | 20 px | 1,3 | [derivado] (marca: 20/18) |
| H4 / título de cartão | Manrope 600 | 18–20 px | 18 px | 1,3 | [marca] |
| Corpo | Manrope 400 | 18 px | 16 px | 1,5–1,6 | [derivado] (marca: 16/24) |
| Métrica / número grande | Manrope 600 | 56–72 px | 40–48 px | 1,05 | [derivado] (marca: 32–40) |
| Rótulo de campo, botão | Manrope 500–600 | 14–16 px | 14–16 px | — | [marca] |
| Legenda | Manrope 400 | 13–14 px | 13–14 px | 1,45 | [marca] |
| ID, hash, código | IBM Plex Mono 400 | 13–14 px | 13–14 px | 1,5 | [marca] |

Regras: pesos Regular/Medium/SemiBold na maior parte; **evitar pesos muito grossos**; hierarquia por tamanho, espaço e agrupamento. Largura de leitura **60–75 caracteres** (`--measure`). Não reduzir fonte para caber: quebrar ou reorganizar. Totais/métricas em Manrope; **só identificadores e sequências técnicas** em mono. Hashes: permitir seleção, cópia e acesso ao valor completo.

## 4. Forma, superfície e espaço [marca + derivado]

| Forma | Função na landing | Detalhe |
|---|---|---|
| **Hexágono** | Identidade de um agente (célula) | Regular, **vértice para cima**, cantos discretamente arredondados, contorno de espessura constante |
| **Linha** | Relação/delegação | Reta em conexões simples; curva suave para desvios; **espessura uniforme** |
| **Ponto circular** | Evento/atividade | Percorre a linha em animação; a célula permanece |
| **Retângulo de cantos suaves** | Informação | Cartões (12 px), botões e campos (8 px) |
| **Contorno externo parcial** | Seleção/contexto | Só na seção de Visão (Trust Halo), com rótulo |

- **Seta** indica direção de delegação (quem contratou quem). **Tracejado** indica "ainda sem evidência", sempre com legenda.
- Cápsula (`--radius-pill`) só para chips de estado e filtros.
- Sem sombras, sem brilho, sem relevo, sem textura, sem degradê **na logo e nos símbolos**. Para cartões, elevação por **borda suave**, não sombra.
- Ritmo vertical: seções com `96–128 px` (desktop) / `64–80 px` (mobile). Container `1200 px`, grade de 12 colunas, gutter 24 px.
- Breakpoints de teste: **360, 390, 768, 1024, 1280, 1536**.

## 5. Logo [marca]

Arquivos SVG já existem e serão organizados em `public/brand/`. **Liste a pasta, mapeie cada arquivo ao uso e pergunte se algo for ambíguo.** Não recriar, redesenhar, vetorizar de novo nem "digitar" o wordmark em fonte.

| Uso | Assinatura | Cores |
|---|---|---|
| Navegação, rodapé | **Horizontal** (abelha à esquerda, wordmark à direita) | Sobre berinjela: símbolo inteiro em **âmbar** ou **branco quente**. Sobre claro: asas âmbar + corpo berinjela |
| Hero/capa institucional (se houver) | Vertical | idem |
| Espaços pequenos | **Reduzida** (símbolo isolado) | Uma cor |
| Favicon | Reduzida, uma cor, quadrada: **âmbar sobre berinjela** | **[TODO(brand)]**: não existe ainda; usar provisório e registrar |
| App icon / apple-touch | Berinjela + âmbar (principal) | Não incluir a palavra "hive" |

- **Área de proteção:** `x = H ÷ 4` (H = altura da abelha) em todos os lados da assinatura inteira.
- **Tamanhos mínimos (a testar):** horizontal 128 px de largura; vertical 80 px; símbolo 24 px de altura; wordmark isolado 72 px; favicon 16/32 px.
- **Nunca:** esticar/inclinar, girar/espelhar, trocar cores livremente, adicionar efeitos, baixo contraste, separar partes da abelha, alterar a composição, invadir a área de proteção, usar a abelha como selo de aprovação. Não acrescentar olhos, rosto, pernas, antenas, listras ou ferrão.
- Wordmark em minúsculas ("hive"). No texto corrido, escrever **Hive**.

## 6. Elementos da marca: o que entra e o que não entra

A landing é **material institucional**, então tem mais liberdade que a interface do MVP, **com contenção**.

| Elemento | Na landing | Condição |
|---|---|---|
| Abelha/logo | ✅ nav, rodapé, OG | Regras de §5 |
| Hexágono (célula) | ✅ diagramas | Idêntico em todos os resultados |
| Conexões, setas, pontos de evento | ✅ | Espessura uniforme |
| **Trust Halo** | ⚠ só na seção **A Hive** | Rotulado como Visão; sem brilho, sem camadas concêntricas, sem aparência de escudo |
| **Rede de células** (colmeia) | ⚠ só na seção **A Hive** | Células separadas e conectadas; **não preencher** a superfície com favos |
| Padrão de favos de fundo | ⚠ opcional, **muito sutil**, só nas bordas do hero/CTA final, nunca atrás de dados | Se competir com os hashes, remova |
| Mascote | ❌ por padrão | Só se houver arquivo **aprovado** em `public/brand/`; nesse caso, apenas como guia, nunca no lugar do resultado |
| Taxonomia Unknown/Observed/Established/Restricted | ❌ | Pressupõe histórico que o MVP não tem |
| Selos, escudos, "verified badge", cadeados | ❌ | Violam "verificado ≠ seguro" |
| Partículas, brilho, glassmorphism, orbes | ❌ | Não agregam evidência |

## 7. Imagens

- **Capturas reais da interface da Hive** (mesma interface do MVP): lista de jobs, novo job, compromissos × journal, verificação on-chain, liquidação, rejeições. Exportar em AVIF/WebP com largura e altura declaradas. Se a captura mostrar um hash truncado, legendar como "tela real".
- **Fragmentos montados** (cartão de journal, anatomia da transação) **a partir de `evidence.json`**, nunca com valores digitados. Rotular "ilustração" quando recortados.
- **Proibido:** foto de banco de imagens, 3D genérico, robôs, circuitos, cadeados, correntes (chain), abelhas realistas, ilustrações geradas por IA de "agentes". Proibido também o visual genérico de startup de IA: gradiente roxo→azul, orbes, brilho neon.
- Cada imagem tem `alt` descritivo no idioma da página.

## 8. Layout por seção (resumo; detalhe de conteúdo em `03-…`)

| Seção | Layout desktop | Layout mobile |
|---|---|---|
| Hero | 2 colunas: texto à esquerda (H1, sub, 2 CTAs), **diagrama de delegação** à direita | Texto, CTAs, diagrama abaixo |
| A decisão | Texto em 5 colunas + tabela comparativa em 7 | Empilhado; tabela vira cartões por linha |
| Como funciona | **Stepper** (passos à esquerda, figura à direita, fixo ao rolar) | Passos como acordeão/linha do tempo com figura |
| Demo | Vídeo grande centralizado; 2–3 miniaturas | Vídeo full-bleed |
| Provas | 4 números em grade → 7 cartões do journal → abas de desfechos → lista de rejeitados → **limites (2 colunas)** | Números 2×2; cartões em rolagem horizontal com snap; abas |
| A Hive | Diagrama largo + legenda; selo **Visão**; 2 itens "Planejado" | Diagrama simplificado (3 células) |
| Para quem | 2 cartões + faixa de encaixe | Empilhado |
| FAQ + lista de espera | FAQ em 7 colunas, formulário em 5, lado a lado | Empilhado |

## 9. Componentes (nomes sugeridos)

`Button` (primary|secondary) · `Badge` (Today|Planned|Vision|Env) · `Nav` · `EnvBanner` · `LangSwitch` · `Section` (com `data-surface`) · `Stepper` · `FigureCard` · `StatCard` · `JournalCard` · `OutcomeTabs` · `RejectionList` · `LimitsBlock` · `DelegationDiagram` · `HiveNetwork` · `AudienceCard` · `Accordion` · `WaitlistForm` · `VideoSlot` · `CopyChip` · `ExplorerLink`.

Cada componente aceita **chaves de dicionário**, não strings; e lê dados de `evidence.json`, não props com valores.

## 10. Checklist de design (por fase)

- [ ] Nenhum valor literal de cor/fonte/raio/espaço fora de `tokens.css`.
- [ ] Contrastes conferem com §2.4; âmbar nunca como texto sobre claro; malva nunca sobre lilás.
- [ ] Um botão âmbar por viewport.
- [ ] Célula idêntica em todos os resultados.
- [ ] Logo sem modificação, com área de proteção e tamanhos mínimos.
- [ ] Sem gradiente, sombra, brilho ou favos atrás de dados.
- [ ] Mobile (360 px) sem rolagem horizontal da página; tabelas largas rolam dentro do próprio contêiner.
- [ ] Hashes em mono com cópia; nenhum hash "completo" que na verdade é truncado.
