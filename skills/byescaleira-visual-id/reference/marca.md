# Marca e produtos

O design system é a identidade comum. Cada produto (o CLIO é o primeiro) usa esta identidade com o próprio nome. Não existe uma "marca mãe" desenhada: o que dá unidade é o sistema, não um logotipo.

## O que é comum a todos

Tudo o que está em [tokens.md](tokens.md) e nas outras páginas da referência:
- as cores;
- as fontes;
- a escala;
- o espaço e a forma;
- os componentes;
- a escrita.

Um produto não muda nada disso.

## O que cada produto tem

Cada produto tem um arquivo em `products/<produto>/<produto>.json` com:

| Campo | O quê |
|---|---|
| `name` | O nome, como aparece na barra do topo e na capa |
| `wordmark` | A marca escrita: o nome no estilo `brand` (Schibsted Grotesk 700, -0,03em) em `ink`. Não há logotipo desenhado |
| `mark` | O símbolo, só para ícone de app e de aba do navegador (SVG em `products/<produto>/`) |
| `expansion` | A sigla por extenso, se houver |
| `dataColors` | A paleta de cores de dado do produto, se houver (ex.: as cores de pessoa de uma agenda) |
| `heroFormat` | Como o produto escreve a peça de destaque (ex.: a data em `dd.mm`) |
| `language` | A língua da interface |

## O símbolo

- **Um quadrado `ink`** de raio 8 (em 32 de lado), com um único sinal de traço em `paper`, de 3,4 de espessura com pontas arredondadas, derivado da inicial ou da ideia do produto.
- **Sem cor, sem degradê e sem sombra.** No tema escuro, o quadrado continua `ink` claro, ou seja, inverte.
- **Onde aparece:** só no ícone do app e na aba do navegador. Na interface, a marca é o nome escrito.
- **Ícone de app nas plataformas:**
  - o mesmo desenho no formato de cada uma;
  - variante escura e "tingida" do iOS: o sinal sobre o fundo do sistema;
  - ícone monocromático do Android: só o sinal.

## A sigla por extenso

Quando o nome é uma sigla e aparece por extenso, use uma palavra por linha: as iniciais em `ink` e o resto da palavra em `ink-faint`.

## Um produto novo

1. **Escolha o nome.**
2. **Desenhe o sinal do símbolo** pela regra acima.
3. **Decida o formato da peça de destaque.**
4. **Crie `products/<produto>/`** com o JSON e o SVG.
5. **Se o produto tiver cores de dado,** liste-as em `dataColors`, com o significado de cada uma. Elas seguem a regra de [cor de dado](cor.md#cores-de-dado).
6. **Abra a mudança no design system** (veja [Mudar o design system](mudar.md)).
