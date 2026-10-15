# Manifesto de marca (`public/brand/`)

**Fonte da verdade dos nomes dos arquivos de marca.** Padrão: `hive-<tipo>-<variante>.svg`.

- **Tipos:** `horizontal`, `vertical`, `symbol`, `symbol-reduced`, `wordmark`, `app-icon`, `favicon`.
- **Variantes:** `amber` (`#E8B44C`), `aubergine` (`#392D40`), `warm-white` (`#FAF7F5`), `white` (`#FFFFFF`), `two-tone` (asas âmbar + corpo berinjela, para fundo claro), `mono`.

Os SVGs **não foram editados** (conteúdo, geometria e cores intactos); só foram movidos e renomeados. A classificação veio da leitura do SVG (viewBox, formas, `fill`) e de renderização sobre fundo branco e berinjela, não do nome original.

> **Provisório, aprovado para uso por enquanto.** Todos os SVGs trazem o comentário `PROVISÓRIO: rastreado da prancha 1 do PDF de identidade (05.10.2026). Não é o desenho mestre vetorial.` O desenho mestre ainda não existe (`TODO(brand)`, D10); até ele chegar, estes arquivos são os usados na landing.

## Logos SVG

| Nome original | Nome novo | Tipo | Variante | Fundo recomendado | Observações |
|---|---|---|---|---|---|
| `logo/hive-horizontal-ambar.svg` | `hive-horizontal-amber.svg` | horizontal | amber | berinjela | Abelha e wordmark inteiros em âmbar. Navegação e rodapé sobre berinjela. |
| `logo/hive-horizontal-branco.svg` | `hive-horizontal-warm-white.svg` | horizontal | warm-white | berinjela | Cor `#FAF7F5` (branco quente), não `#FFFFFF`. Invisível sobre fundo claro. |
| `logo/hive-horizontal-berinjela.svg` | `hive-horizontal-two-tone.svg` | horizontal | two-tone | claro | O nome original enganava: asas em âmbar, corpo da abelha e wordmark em berinjela. Não é mono berinjela. Sobre berinjela, só as asas aparecem. |
| `logo/hive-wordmark-berinjela.svg` | `hive-wordmark-aubergine.svg` | wordmark | aubergine | claro | Wordmark rastreado do PDF (como na prancha). Sobre berinjela fica invisível. |
| `logo/hive-wordmark-branco.svg` | `hive-wordmark-warm-white.svg` | wordmark | warm-white | berinjela | Mesmo desenho do anterior em `#FAF7F5`. |
| `symbol/hive-symbol-ambar.svg` | `hive-symbol-amber.svg` | symbol | amber | berinjela | Só a abelha, uma cor. Base do favicon provisório (abaixo). |
| `symbol/hive-symbol-branco.svg` | `hive-symbol-warm-white.svg` | symbol | warm-white | berinjela | Só a abelha em `#FAF7F5`. |
| `symbol/hive-symbol.svg` | `hive-symbol-two-tone.svg` | symbol | two-tone | claro | O nome original (sem sufixo) não dizia a cor: asas âmbar, corpo berinjela. |

## Em `_alt/` (alternativas; não usar como padrão)

| Nome original | Nome atual | Observações |
|---|---|---|
| `logo/hive-wordmark-manrope600-berinjela.svg` | `_alt/hive-wordmark-aubergine-manrope600.svg` | Mantido como alternativa por decisão do responsável. Wordmark composto em Manrope 600 (contornos, sem `<text>`), com letras diferentes do wordmark rastreado (traço mais fino, "i" com pingo quadrado, viewBox 1000 × 395.5 em vez de 1000 × 404.5). O `docs/04-design-system.md` §5 proíbe "digitar" o wordmark em fonte; o `docs/sources/preview-logo-provisorio.png` o rotula como "regra escrita". O wordmark padrão continua sendo o rastreado (`hive-wordmark-aubergine.svg`). |

## Outros ativos de marca

| Caminho | Conteúdo | Observações |
|---|---|---|
| `fonts/` | Manrope (variável) e IBM Plex Mono 400/500, WOFF2 `latin` + `latin-ext`, `fonts.css`, licenças OFL | Veio de uma pasta `fonts/` na raiz; decidido mantê-las aqui, servidas por `public/brand/fonts/`. O `README.md` dela ainda cita `brand/MANIFEST.md`, `DESIGN.md` e `worker/static/fonts/` (do repositório do MVP); esses caminhos não existem aqui. Na fase 0, se o framework escolhido pedir um pipeline de fontes próprio, copiar os arquivos daqui sem alterá-los. |
| `hive-favicon-amber.svg` | **Provisório, gerado** | Quadrado berinjela com o símbolo âmbar copiado de `hive-symbol-amber.svg` (nenhum caminho redesenhado). Gerado por `npm run assets:generate`. `TODO(brand)`: o favicon definitivo ainda não existe (D10). |
| `app-icons/` | **Provisório, gerado** | `favicon-32.png`, `apple-touch-icon.png` (180), `icon-512.png`, a partir do favicon acima (berinjela + âmbar, sem a palavra "hive"). `public/favicon.ico` e `public/og/og-{en,pt-br}.png` saem do mesmo script. `TODO(brand)`: ícones e OG definitivos. |
| `mascot/` | Vazia (`.gitkeep`) | Mascote desligado na landing até haver arquivo aprovado (D12). |
| `_other/` | Não criada | Não havia PDF, PNG ou outro arquivo de marca a mover para cá. O PDF de identidade e o PNG de preview ficam em `docs/sources/`, fora de `public/`, para não serem publicados no site. |

## Variantes ainda ausentes

- `hive-horizontal-white`, `hive-wordmark-amber`: opcionais, não previstas como obrigatórias.
- **`hive-vertical-*`** (hero/capa institucional): não existe.
- **`hive-symbol-reduced-*`**: não existe versão específica para tamanhos pequenos. Os arquivos `symbol` são o símbolo isolado, que o design system chama de "Reduzida". Decidir se basta.
- **`hive-favicon-*` e `hive-app-icon-*` definitivos**: não existem (`TODO(brand)`); os provisórios gerados estão acima.
- `mono`, `white` (`#FFFFFF`): não existem.
