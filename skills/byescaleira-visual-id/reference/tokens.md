<!-- Gerado por scripts/build.mjs a partir de tokens/tokens.json. Não edite à mão. -->

# Tokens: os valores

Todos os valores da identidade visual, para aplicar em qualquer plataforma. Na web, use as variáveis de `web/tokens.css` em vez de copiar os números. Nas outras plataformas, crie os recursos nativos (cores com variante clara e escura, estilos de texto, espaços) **com estes nomes e estes valores**, nada além.

## Cor

Cada cor tem o valor do tema claro e do escuro. O escuro é o mesmo sistema invertido: `paper` e `ink` trocam de lugar e os sinais clareiam.

| Token | Claro | Escuro | Uso |
| --- | --- | --- | --- |
| `paper` | `#ffffff` (255, 255, 255) | `#000000` (0, 0, 0) | Fundo da página, da janela e da tela. Branco puro no claro, preto puro no escuro: nunca creme, cinza ou um preto "quase". |
| `surface` | `#ffffff` (255, 255, 255) | `#000000` (0, 0, 0) | Fundo de painéis, campos e popovers. Igual a paper: superfícies se separam por fio, não por tom. |
| `sunken` | `#f4f4f4` (244, 244, 244) | `#141414` (20, 20, 20) | Hover, pressionado e aviso neutro. Nunca em bloco grande. |
| `ink` | `#000000` (0, 0, 0) | `#ffffff` (255, 255, 255) | Texto principal e toda interação: botão principal, seleção, filtro ativo, aba ativa, foco. 21:1 sobre paper. |
| `ink-muted` | `#5c5c5c` (92, 92, 92) | `#a3a3a3` (163, 163, 163) | Texto secundário: metadados, legendas, rótulos. 6,7:1 no claro, 8,3:1 no escuro. |
| `ink-faint` | `#737373` (115, 115, 115) | `#8a8a8a` (138, 138, 138) | Placeholder, contagem, item vazio. Só texto curto e não essencial. 4,7:1 no claro, 6,1:1 no escuro. |
| `rule` | `#e8e8e8` (232, 232, 232) | `#262626` (38, 38, 38) | Fio de 1px entre linhas, painéis e seções. É a forma principal de separar áreas. |
| `rule-strong` | `#cccccc` (204, 204, 204) | `#404040` (64, 64, 64) | Borda de controle em repouso (botão secundário, busca, segmented). No hover, a borda vira ink. |
| `warn` | `#9e5700` (158, 87, 0) | `#f0b450` (240, 180, 80) | Âmbar: dúvida e atenção ("leia antes de confirmar", dado incompleto). Texto sobre paper ou warn-wash. 5,5:1 no claro, 9,7:1 no escuro. |
| `warn-wash` | `#fff5e6` (255, 245, 230) | `#2a1f0d` (42, 31, 13) | Fundo de aviso de atenção, sempre com texto em warn. |
| `danger` | `#b3261e` (179, 38, 30) | `#ff7a6b` (255, 122, 107) | Vermelho: erro, cancelado, ação destrutiva. Texto sobre paper ou danger-wash. 6,5:1 no claro, 8,3:1 no escuro. |
| `danger-wash` | `#fdeceb` (253, 236, 235) | `#2c1210` (44, 18, 16) | Fundo de aviso de erro, sempre com texto em danger. |
| `ok` | `#0b7a3f` (11, 122, 63) | `#4fbf7f` (79, 191, 127) | Verde: feito, salvo, já existe. Texto sobre paper ou ok-wash. 5,4:1 no claro, 9,1:1 no escuro. |
| `ok-wash` | `#e9f6ee` (233, 246, 238) | `#0d2318` (13, 35, 24) | Fundo de aviso de sucesso, sempre com texto em ok. |
| `accent` | `#000000` (0, 0, 0) | `#ffffff` (255, 255, 255) | = `ink`. Papel de destaque. Aponta para ink: interação é tinta, nunca uma cor de marca. |
| `accent-wash` | `#f4f4f4` (244, 244, 244) | `#141414` (20, 20, 20) | = `sunken`. Fundo suave de destaque. |
| `on-accent` | `#ffffff` (255, 255, 255) | `#000000` (0, 0, 0) | = `paper`. Texto e ícone sobre ink cheio. |
| `focus` | `#000000` (0, 0, 0) | `#ffffff` (255, 255, 255) | = `ink`. Anel de foco: 2px sólido, afastado 2px, em todo elemento focável. |

### Contraste (WCAG)

`ink` sobre `paper` é 21:1 nos dois temas. O build falha se algum texto ficar abaixo de 4,5:1.

| Par | Claro | Escuro |
| --- | --- | --- |
| `ink-muted` sobre `paper` | 6,7:1 | 8,3:1 |
| `ink-faint` sobre `paper` | 4,7:1 | 6,1:1 |
| `warn` sobre `paper` | 5,5:1 | 11,3:1 |
| `danger` sobre `paper` | 6,5:1 | 8,2:1 |
| `ok` sobre `paper` | 5,4:1 | 9,1:1 |

## Tipografia

- **Schibsted Grotesk** (`sans`): Toda a interface: títulos, navegação, botões, números. SIL Open Font License 1.1; Google Fonts `Schibsted Grotesk`, npm `@fontsource-variable/schibsted-grotesk`.
- **Source Serif 4** (`serif`): Só leitura longa: textos de várias linhas, documentos, citações. SIL Open Font License 1.1; Google Fonts `Source Serif 4`, npm `@fontsource-variable/source-serif-4`.

Tamanhos em px (web, Android em sp, Windows em epx) e em pt (Apple: 1pt = 1px de layout; a coluna pt é para slides e documentos impressos, 1px = 0,75pt). Onde há dois valores, o tamanho é fluido entre o mínimo e o máximo conforme a largura.

| Estilo | Família | px | pt (slides) | Peso | Entrelinha | Espaçamento | Uso |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `hero` | Schibsted Grotesk | 56–104 | 42–78 | 700 | 0.8 | -0.05em | A peça grande da tela, uma só: a data, o número, a palavra que resume a tela. |
| `display` | Schibsted Grotesk | 52–136 | 39–102 | 650 | 0.92 | -0.05em | Título de página avulsa e de capa de slide. No máximo 12ch. |
| `headline` | Schibsted Grotesk | 32–56 | 24–42 | 600 | 1.05 | -0.035em | Título de seção de landing e de slide. No máximo 18ch. |
| `text-xl` | Schibsted Grotesk | 28 | 21 | 600 | 1.2 | 0 | Título de tela. |
| `text-lg` | Schibsted Grotesk | 22.4 | 16.8 | 600 | 1.25 | -0.02em | Título de seção. |
| `text-md` | Schibsted Grotesk | 18 | 13.5 | 650 | 1.25 | -0.01em | Título de grupo e lead. |
| `text-base` | Schibsted Grotesk | 15 | 11.3 | 400 | 1.5 | 0 | Corpo da interface. |
| `title` | Schibsted Grotesk | 15 | 11.3 | 600 | 1.35 | -0.005em | Título de linha de lista e de cartão de evento. |
| `text-sm` | Schibsted Grotesk | 13 | 9.8 | 400 | 1.45 | 0 | Metadados, botões, filtros, avisos. |
| `text-xs` | Schibsted Grotesk | 12 | 9 | 650 | 1.6 | 0 | Etiquetas, contagens, horários. |
| `brand` | Schibsted Grotesk | 16.8 | 12.6 | 700 | 1 | -0.03em | O nome do produto, em tinta. A marca é só o nome. |
| `reading` | Source Serif 4 | 18 | 13.5 | 400 | 1.7 | 0 | Leitura longa, na medida de 68ch. |
| `excerpt` | Source Serif 4 | 13 | 9.8 | 400 | 1.45 | 0 | Trecho de texto longo numa lista, cortado em 2 linhas. |

## Espaço

| Token | Valor | Uso |
| --- | --- | --- |
| `space-1` | 4 | Ajuste fino: entre título e contagem. |
| `space-2` | 8 | Entre controles de uma barra; entre ícone e texto. |
| `space-3` | 12 | Padding vertical de linhas e avisos. |
| `space-4` | 16 | Padding horizontal de avisos; margem lateral mínima no celular. |
| `space-5` | 24 | Entre colunas de uma linha; entre abas. |
| `space-6` | 32 | Margem lateral das barras e entre seções. |
| `space-7` | 48 | Respiro de página e de estado vazio. |

## Raio

| Token | Valor | Uso |
| --- | --- | --- |
| `radius-control` | cápsula (metade da altura) | Todo controle: botão, busca, filtro, segmented. Sempre pílula. |
| `radius-pill` | cápsula (metade da altura) | Etiquetas e contagens. |
| `radius-row` | 10 | Linha selecionada e avisos. |
| `radius-block` | 14 | Popovers, menus e folhas. |
| `radius-inner` | 8 | Opções dentro de um popover. |

## Fio e marcas de dado

| Token | Valor | Uso |
| --- | --- | --- |
| `rule-width` | 1 | Todo fio e toda borda. Não existe borda grossa; a única exceção é o fio de cor de dado (3px). |
| `data-rule-width` | 3 | O fio de cor de dado, ao lado do item que ele marca. |
| `data-dot` | 8 | O ponto de cor de dado, ao lado do nome que ele marca. |

## Sombra

- `shadow-pop`: deslocamento 24 para baixo, desfoque 48, preto a 12%. Só em popover, a única superfície que flutua (na web e no Windows). Nas plataformas Apple, quem flutua é o vidro do sistema.

## Movimento

| Token | Duração | Curva | Uso |
| --- | --- | --- | --- |
| `motion-fast` | 120ms | ease | Fundo, borda e cor de controles e linhas. |
| `motion-pop` | 140ms | ease-out | Popover entrando (4px para baixo e opacidade). |
| `motion-progress` | 1300ms | linear | Barra de carregamento. |
| `motion-spin` | 900ms | linear | Spinner. |

## Layout

| Token | Valor | Uso |
| --- | --- | --- |
| `measure` | `68ch` | Largura máxima de texto de leitura. |
| `index-width` | `clamp(340px, 26vw, 540px)` | Coluna de lista ao lado da leitura: cresce com a janela. |
| `topbar-height` | `52px` | Altura mínima da barra do topo na web. |
| `gutter-mobile` | `16px` | Margem lateral no celular. |
