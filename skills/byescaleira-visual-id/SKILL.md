---
name: byescaleira-visual-id
description: Aplica a identidade visual byescaleira (preto e branco, a cor só quando informa, Schibsted Grotesk e Source Serif 4, fios em vez de caixas, um destaque por tela) a qualquer entrega com interface ou visual. Vale para app web, landing page, página avulsa, apresentação de slides, app iOS, iPadOS, macOS, tvOS, Android e Windows (respeitando o nativo de cada um, como o Liquid Glass na Apple), documento, gráfico e imagem. Use sempre que for criar, revisar ou mudar algo visual num projeto byescaleira ou de um produto dele (ex.: CLIO).
---

# Identidade visual byescaleira

Você vai aplicar uma identidade visual fixa. Ela não é ponto de partida para variações: use os tokens e as regras como estão. O que não estiver aqui não entra no projeto. Proponha a adição ao design system ([mudar.md](reference/mudar.md)).

## A fonte da verdade

- **Tokens:** `${CLAUDE_PLUGIN_ROOT}/tokens/tokens.json`, com todas as cores (claro e escuro), a tipografia, o espaço, o raio, o fio, a sombra, o movimento e o layout, cada um com a nota de uso. A mesma coisa, em tabelas: [reference/tokens.md](reference/tokens.md).
- **Web:** `${CLAUDE_PLUGIN_ROOT}/web/tokens.css` (variáveis CSS) e `${CLAUDE_PLUGIN_ROOT}/web/tailwind.css` (Tailwind v4), gerados do JSON.
- **Produtos:** `${CLAUDE_PLUGIN_ROOT}/products/<produto>/<produto>.json`, com o nome, o símbolo, a paleta de cores de dado e o formato do destaque. Hoje existe `clio`.

**Nunca escreva um valor de memória ou "parecido".** Leia o JSON e use o valor exato ou a variável. Nunca edite os arquivos gerados.

## Regras que não mudam

1. **Tinta sobre papel.** O fundo é `paper` (branco puro no claro, preto puro no escuro) e o texto é `ink`. Nada de creme, de cinza de fundo ou de `#111` no lugar do preto.
2. **Interação é tinta.** O botão principal, a seleção, o filtro e a aba ativos e o foco ficam em `ink` com texto em `paper`. Não existe cor de marca. A cor de destaque da plataforma (AccentColor, `primary`, `SystemAccentColor`) é `ink`.
3. **A cor só informa:**
   - **sinais:** `warn` (atenção), `danger` (erro), `ok` (feito), sempre com palavras;
   - **cores de dado:** a cor que vem do conteúdo, só como fio de 3px ou ponto de 8px, sempre com o nome ao lado.

   Nunca use gradiente, bloco de cor, ícone colorido, emoji ou foto decorativa.
4. **Fios, não caixas.** Separe com fio de 1px (`rule`). Nada de cartão com sombra, borda grossa ou superfície de outro tom. Só o que flutua tem sombra ou material.
5. **Um destaque por tela.** Uma peça grande no estilo `hero` (a data, o número), e o resto quieto: títulos em 600, corpo em 400, sem caixa alta e sem ênfase colorida.
6. **Duas fontes.**
   - **Schibsted Grotesk** em toda a interface.
   - **Source Serif 4** só em leitura longa.
   - **Sem monoespaçada:** números em coluna usam algarismos tabulares.
7. **Só os passos de espaço** (4, 8, 12, 16, 24, 32, 48) **e os raios por hierarquia:**
   - controle em cápsula;
   - linha e aviso com 10;
   - popover com 14;
   - opção com 8.
8. **Nativo primeiro.** Nos apps, use os controles, a navegação e os materiais do sistema (Liquid Glass, Material 3, Fluent/Mica), vestidos com estes tokens. Não imite uma plataforma em outra nem redesenhe o que o sistema já faz.
9. **Texto claro, em português, voz ativa.** O botão diz o que acontece. Sem rótulo em caixa alta, sem "·" unindo metadados e sem "→" no fim de link.
10. **Nada sigiloso no que é público.** Landing, login, docs, slides e capturas usam dados inventados.

## Como trabalhar

1. **Identifique a entrega** e leia a página dela. Leia também [principios.md](reference/principios.md) se ainda não leu nesta conversa.

   | Entrega | Leia |
   |---|---|
   | App web, painel, página avulsa | [web.md](reference/web.md) |
   | Landing page | [web.md](reference/web.md#landing-page) |
   | Slides (Keynote, PowerPoint, Google Slides, HTML, artifact) | [slides.md](reference/slides.md) |
   | iPhone, iPad, Mac, Apple TV, Apple Watch | [apple.md](reference/apple.md) |
   | Android | [android.md](reference/android.md) |
   | Windows | [windows.md](reference/windows.md) |
   | Documento, gráfico, imagem | [slides.md](reference/slides.md) (tema, tamanhos e gráficos valem igual) |

2. **Leia o produto,** se a entrega for de um produto (`products/<produto>/`): o nome, o símbolo e as cores de dado.
3. **Consulte o resto da referência quando precisar:**
   - [cor.md](reference/cor.md);
   - [tipografia.md](reference/tipografia.md);
   - [forma.md](reference/forma.md): espaço, raio, fio, movimento, ícones;
   - [componentes.md](reference/componentes.md): anatomia e estados de cada componente;
   - [escrita.md](reference/escrita.md);
   - [marca.md](reference/marca.md).
4. **Monte com os tokens.**
   - **Na web:** importe `web/tokens.css` e use só `var(--…)`.
   - **Nas plataformas nativas:** crie os recursos de cor (com variante clara, escura e de alto contraste), os estilos de texto e os espaços com os nomes e os valores de `tokens.json`, no formato nativo (catálogo de cores, `ColorScheme`, `ResourceDictionary`), uma vez, e use só eles.
5. **Confira antes de entregar,** com a lista da página da entrega e a lista abaixo.

## Antes de entregar

- [ ] **Valores:** nenhuma cor, fonte, tamanho, espaço, raio ou sombra fora dos tokens. Procure hex, `px` e nomes de cor soltos no que você escreveu.
- [ ] **Temas:** claro e escuro conferidos (e alto contraste, nos apps).
- [ ] **Destaque e cor:** um destaque só; nenhuma cor decorativa; os sinais com palavras.
- [ ] **Acessibilidade:** contraste de 4,5:1, foco visível, área de toque da plataforma e nome acessível em todo controle.
- [ ] **Largura:** celular sem rolagem horizontal.
- [ ] **Texto:** voz ativa, sem caixa alta, sem dado real em material público.

Se algo da entrega pedir uma regra que não existe aqui, diga isso a quem pediu e proponha a mudança no design system. Não resolva com um valor próprio no projeto.
