# Cor

Os valores exatos estão em [tokens.md](tokens.md), gerado de `tokens/tokens.json`. Aqui ficam as regras de uso.

## Os papéis

| Papel | Tokens | Regra |
|---|---|---|
| Fundo | `paper`, `surface` | `paper` na janela, na página e no slide. `surface` em painéis, campos e popovers. São iguais: separe com `rule`, não com tom. |
| Fundo rebaixado | `sunken` | Só hover, pressionado e aviso neutro. Nunca em bloco grande nem como "cartão". |
| Texto | `ink`, `ink-muted`, `ink-faint` | `ink` no principal, `ink-muted` em metadados e rótulos, `ink-faint` só em placeholder e contagem. |
| Fios | `rule`, `rule-strong` | `rule` entre áreas e linhas. `rule-strong` na borda de controle em repouso. No hover, a borda vira `ink`. |
| Interação | `accent` (= `ink`), `on-accent` (= `paper`), `focus` (= `ink`) | Preenchimento cheio de tinta, texto em papel. |
| Atenção | `warn`, `warn-wash` | Dúvida, dado incompleto, "leia antes de confirmar". |
| Erro | `danger`, `danger-wash` | Erro, cancelado, ação destrutiva. |
| Feito | `ok`, `ok-wash` | Salvo, concluído, já existe. |

## Sinais

- **O texto do sinal vai sempre na cor do sinal**, sobre `paper` ou sobre o `*-wash` dele. Nunca texto preto sobre fundo âmbar, nem texto branco sobre fundo vermelho cheio.
- **O sinal acompanha palavras.** "Atenção" em âmbar, sim. Só um ícone âmbar, não.
- **Uma ação destrutiva** é um botão normal (tinta) com o rótulo claro, como "Excluir lote", e confirmação. O vermelho fica para o erro e para a confirmação final, não para todo botão de excluir.

## Cores de dado

São as cores que vêm do conteúdo, não do design: a cor de uma pessoa ou de uma categoria escolhida pelo usuário numa agenda, num calendário ou numa etiqueta.
- **Onde aparecem:** só como fio de 3px (`data-rule-width`) ao lado do item ou ponto de 8px (`data-dot`) ao lado do nome.
- **Sempre com o nome escrito ao lado.** Quem não distingue cores entende pelo texto.
- **Nunca como fundo, texto ou botão.**
- **A paleta é do produto,** não do design system: cada produto declara a sua no arquivo dele em `products/` (veja [Marca](marca.md)).

## Datas especiais

A cor da data (Natal, Carnaval…) segue a mesma ideia da cor de dado: marca pequena, com o nome ao lado.
- **Onde aparece:** só no fio de 3px no topo da página e no ponto de 8px com o nome da data, na barra do topo.
- **Nunca** como fundo, texto, botão, seleção ou foco.
- **Contraste:** 4,5:1 sobre `paper` nos dois temas, conferido no build.
- **As regras completas** estão em [Datas especiais](datas.md).

## Temas

- **Claro e escuro são o mesmo sistema invertido.** `paper` e `ink` trocam de lugar, os cinzas se ajustam e os sinais clareiam para manter o contraste.
- **O tema segue o sistema.** Uma opção manual (claro, escuro ou automático) só existe se o produto precisar. Na web, `data-theme="light"` ou `"dark"` na raiz força um tema.
- **Alto contraste do sistema** (Windows, "Aumentar contraste" da Apple, "texto em alto contraste" do Android): siga o sistema. Os fios viram `ink` e os cinzas de texto viram `ink` (`highContrast` no `tokens.json`). Na web, o `tokens.css` faz isso com `prefers-contrast: more`, e `data-contrast="more"` na raiz força.

## Contraste

- **Texto:** pelo menos 4,5:1. Todos os pares de texto dos tokens passam nos dois temas, e o build falha se algum deixar de passar.
- **Fios** (`rule`) não carregam informação sozinhos. Um controle sempre tem rótulo, ou a borda `rule-strong` e o estado escrito.
- **Cor de dado** nunca carrega texto.

## Proibido

Estas listas também valem para slides e para imagens de apoio.

| Na cor | No fundo e na forma |
|---|---|
| Gradiente | Fundo creme, bege ou "papel envelhecido" |
| Cor de marca ou de destaque inventada | Cartões com sombra para separar conteúdo |
| Ícone, ilustração ou emoji coloridos | Bloco de cor cheio como faixa, cabeçalho ou "hero" |
| Opacidade ou transparência para fazer um cinza novo (use os tokens) | Imagem ou foto só para enfeitar |
