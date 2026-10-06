# Tipografia

Os tamanhos, pesos, entrelinhas e espaçamentos exatos estão em [tokens.md](tokens.md).

## As duas famílias

- **Schibsted Grotesk** (`sans`) para toda a interface: títulos, navegação, botões, números, rótulos. É variável (pesos 400 a 900).
- **Source Serif 4** (`serif`) só para leitura longa: textos de várias linhas, documentos, citações e o trecho deles numa lista.
- **Sem fonte monoespaçada,** nem para números ou código na interface. Números em colunas usam algarismos tabulares (`tabular-nums`, `monospacedDigit()`, `FontFeature("tnum")`). Na peça de destaque, os algarismos são proporcionais.
- **Sem terceira família.** Nem a fonte do sistema como "segunda voz": ela só entra como reserva, se a fonte do design system não carregar.

As duas fontes são SIL Open Font License: podem ir dentro de apps, sites e documentos. Use as do Google Fonts ou os pacotes npm `@fontsource-variable/schibsted-grotesk` e `@fontsource-variable/source-serif-4`.

## A escala

Escala 1,25 sobre 15px:

| Estilo | Tamanho |
|---|---|
| `text-xs` | 12 |
| `text-sm` | 13 |
| `text-base` | 15 |
| `text-md` | 18 |
| `text-lg` | 22,4 |
| `text-xl` | 28 |

Ficam fora da escala, de propósito, as peças de destaque:
- **`hero`:** o destaque da tela, de 56 a 104;
- **`display`:** o título de página avulsa e de capa;
- **`headline`:** o título de seção de landing e de slide.

| Estilo | Para quê |
|---|---|
| `hero` | A peça grande da tela, uma só. Peso 700, entrelinha 0,8, -0,05em |
| `display` | Capa e título de página avulsa, no máximo 12 caracteres por linha |
| `headline` | Título de seção de landing e de slide, no máximo 18 caracteres por linha |
| `text-xl`, `text-lg` | Título de tela e de seção |
| `text-md` | Título de grupo e lead |
| `text-base` | Corpo |
| `title` | Título de linha de lista |
| `text-sm` | Metadados, botões, filtros, avisos |
| `text-xs` | Etiquetas, contagens, horários |
| `brand` | O nome do produto, na barra do topo |
| `reading`, `excerpt` | Leitura longa e o trecho dela, em serifa |

## Peso

- **400:** corpo.
- **600:** títulos.
- **650:** títulos de grupo e etiquetas.
- **700:** só a peça de destaque e o nome do produto.

Não use 800 e 900, nem itálico para dar ênfase. Para destacar, use a hierarquia.

## Espaçamento entre letras

- **Negativo nos tamanhos grandes:**
  - -0,05em em `hero` e `display`;
  - -0,035em em `headline`;
  - -0,02em em `text-lg`.
- **Zero no corpo.**
- **Nunca positivo:** nada de texto "espaçado" em caixa alta.

## Regras de texto

- **Sem caixa alta em rótulos,** títulos, botões e abas. A caixa alta só aparece quando é o formato do próprio dado, como um código ou um texto que o usuário escreveu assim.
- **Sem sublinhado, a não ser em link.** O link é `ink` com sublinhado discreto (`rule-strong`), que escurece no hover.
- **Medida:** texto de leitura em até 68 caracteres por linha (`measure`). A serifa tem entrelinha 1,7, e a interface de 1,35 a 1,5.
- **Alinhamento à esquerda.** Centralizado só na capa de slide e em estado vazio curto. Nunca justificado.

## Tamanho do texto do sistema

O texto acompanha o tamanho que a pessoa escolheu no sistema: Dynamic Type na Apple, escala de fonte no Android e no Windows, zoom na web. Os tamanhos da tabela são a base, no tamanho padrão. A peça de destaque pode crescer menos que o corpo, mas não pode ficar parada.
