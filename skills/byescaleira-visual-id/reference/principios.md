# Princípios

Cinco regras valem para tudo: site, app, slide, documento. Quando uma decisão não estiver escrita em outro lugar, decida por elas.

## 1. Tinta sobre papel

O fundo é `paper`: branco puro no tema claro, preto puro no escuro. O texto é `ink`, o inverso. Nada de creme, de cinza-azulado ou de um preto "quase" (`#111`, `#0b0b0b`) no lugar.

Cinzas existem só para hierarquia: `ink-muted` para o que é secundário e `ink-faint` para o que quase não importa.

## 2. Interação é tinta

Não há cor de marca. Tudo o que é interação usa `ink`, com texto em `paper`:
- o botão principal;
- a linha selecionada;
- o filtro ativo;
- a aba ativa;
- o anel de foco.

Uma seleção é sempre a linha **invertida**, em tinta cheia. Nas plataformas que têm cor de destaque do sistema (tint, accent color, colorScheme.primary), a cor de destaque é `ink`.

## 3. A cor informa, nunca decora

A cor só aparece em três casos.

**Sinais:**
- `warn` (âmbar) para dúvida e atenção;
- `danger` (vermelho) para erro e ação destrutiva;
- `ok` (verde) para feito, salvo ou "já existe".

**Cores de dado:** a cor que vem do próprio dado, como a cor de uma pessoa numa agenda ou a de uma categoria escolhida pelo usuário. Ela aparece só como marca pequena (um fio de 3px ou um ponto de 8px) e sempre com o nome ao lado. Nunca é o único jeito de saber a informação.

**Datas especiais:** a cor da data informa a data (Natal, Carnaval, Festa junina…). Ela aparece só no fio de 3px no topo e no ponto de 8px com o nome da data, durante o período, e some sozinha. Veja [Datas especiais](datas.md).

Fora isso não existe cor. Isso vale para gradiente, bloco de cor cheio, ícone colorido, ilustração colorida, fundo de marca e foto como decoração.

## 4. Fios, não caixas

As áreas se separam por fios de 1px (`rule`):
- listas são linhas separadas por fios, sem cartões;
- seções se separam por um fio ou por espaço;
- não há sombra, a não ser no que flutua;
- não há borda grossa.

Superfícies têm o mesmo tom do fundo (`surface` = `paper`). O que separa é o fio, não a diferença de cinza.

## 5. Um destaque por tela

Cada tela tem uma peça grande, e só uma. No estilo `hero`, ela é:
- a data;
- o número que resume a tela;
- a palavra que diz onde você está.

Todo o resto fica quieto: um peso só para títulos (600), corpo em 400, sem caixa alta e sem ênfase colorida. Se duas coisas competem pelo destaque, uma delas não é destaque.

## Como decidir o que não está escrito

1. **Remova antes de acrescentar.** Se a tela funciona sem o elemento, ele sai.
2. **Prefira o nativo da plataforma** (controles, navegação, materiais do sistema), vestido com estes tokens. Não imite o visual de uma plataforma na outra.
3. **Se faltar algo,** um token, um componente ou um padrão, **não invente no projeto.** Proponha a adição no design system (veja [Mudar o design system](mudar.md)) e use depois de aprovada.
