# Componentes

Cada componente vem descrito pela anatomia, pelos estados e pelos tokens. Em cada plataforma, monte-o a partir do controle nativo equivalente, indicado em "Nativo", vestido com estes tokens. Não redesenhe um controle que o sistema já oferece.

Nos estados abaixo, "invertido" quer dizer fundo `ink` e texto `on-accent`.

## Ações

### Botão

| Variação | Repouso | Hover / pressionado | Uso |
|---|---|---|---|
| Principal | Invertido | Pressionado: `ink` com opacidade 0,85 | A ação principal da tela. Uma por área |
| Secundário | `paper`, borda `rule-strong`, texto `ink` | Borda `ink`; pressionado em `sunken` | As demais ações |
| Discreto | Só texto `ink`, sublinhado em `rule-strong` | Sublinhado em `ink` | Ações de baixo peso: "Descartar", "Voltar" |

- **Medidas:** forma em cápsula, texto `text-sm` 600, altura mínima de 36 na web e de 44 em toque, padding horizontal de 16.
- **Desativado:** `ink-faint` e borda `rule`. Nunca com opacidade sobre o botão inteiro.
- **Rótulo:** o verbo do que acontece, como "Aprovar 3 eventos" ou "Salvar". Nunca "OK", "Enviar" ou "Clique aqui".
- **Nativo:** `Button` com estilo próprio ou o vidro do sistema (Apple), `Button`/`OutlinedButton`/`TextButton` (Android), `Button` com estilo de destaque (Windows).

### Botão de ícone

Cápsula ou círculo, com ícone de traço de 18 e nome acessível obrigatório. Os estados são os do botão secundário.

### Segmented

Uma cápsula com borda `rule-strong` e as opções dentro. A ativa fica invertida. Use para 2 a 4 opções que trocam a vista.

- **Nativo:** `Picker` em `.segmented` (Apple), `SingleChoiceSegmentedButtonRow` (Android), `SelectorBar` ou `Segmented` (Windows).

## Navegação

### Barra do topo (web e desktop)

- **À esquerda:** o nome do produto no estilo `brand`.
- **À direita:** as abas e as ações.
- **Embaixo:** um fio `rule`.
- **Medidas:** altura de 52 e margem lateral de 32 (16 no celular).
- **Aba ativa:** sublinhado de 2px em `ink` e texto `ink` 600. As outras ficam em `ink-muted`.
- **Contagem numa aba:** pílula invertida, em `text-xs`.

### Navegação nativa

No celular, no tablet, no Mac, na TV e no Windows, use a navegação do sistema: barra de abas, barra lateral, barra de ferramentas, `NavigationView`. Ela já traz o material próprio (vidro, Material, Mica). O design system muda só:
- a cor de destaque, que vira `ink`;
- as fontes;
- o conteúdo.

## Busca e filtros

- **Busca:** campo em cápsula, borda `rule-strong` e ícone de lupa. O texto digitado fica em `ink` e o placeholder em `ink-faint`. Um botão de limpar aparece quando há texto.
- **Barra de filtros:** uma linha acima do conteúdo, com a busca e os menus em pílula.
- **Menu de filtro:** pílula com o nome do filtro.
  - Com seleção, fica invertida e mostra a contagem.
  - Abre um popover com as opções marcáveis e "Limpar".
- **Nativo:** `.searchable` e `Menu` (Apple), `SearchBar` e `FilterChip` (Android), `AutoSuggestBox` e `DropDownButton` (Windows).

## Listas

### Linha de lista

- **Separação:** fio `rule` embaixo, sem caixa. O padding vertical é de 12.
- **Conteúdo:** o título em `title`, os metadados em `text-sm` `ink-muted` e o trecho de texto longo em `excerpt` (2 linhas).
- **Hover:** fundo `sunken`.
- **Selecionada:** invertida, com raio 10. Os tons secundários viram `paper` atenuado (opacidade 0,7).
- **Número em coluna:** algarismos tabulares.
- **Nativo:** `List` com estilo plano (Apple), `LazyColumn` com `HorizontalDivider` (Android), `ListView` (Windows). A seleção sempre invertida, em tinta.

### Linha de agenda (item com hora e responsável)

- **Quando:** a data ou a hora à esquerda, com o fio de cor de dado de 3px ao lado.
- **O quê:** o título e a ação.
- **Quem:** um ponto de cor de dado de 8px e o nome.
- **Ações:** à direita, ou embaixo em tela estreita.
- **Dúvidas:** em `warn`, abaixo do texto.

## Estado

### Etiqueta de estado

Texto em `text-xs` com um ponto de 8px antes:
- **ponto cheio:** pede ação;
- **ponto vazado:** já resolvido.

A cor é a do texto, ou do sinal quando o estado é um sinal. Nunca é uma pílula de cor cheia.

### Aviso

- **Forma:** bloco com raio 10 e padding de 12 por 16.
- **Neutro:** fundo `sunken`, texto `ink`.
- **Atenção, erro e feito:** fundo `*-wash` e texto na cor do sinal.
- **Tamanho:** no máximo 96 caracteres por linha. Uma frase diz o que aconteceu e o que fazer.

### Carregando

- **Barra de carregamento:** fio de 2px em `ink` varrendo o topo da área (`motion-progress`).
- **Spinner:** só dentro de botão ou de aviso.
- **Nada de esqueleto colorido.** O esqueleto, se houver, é `sunken`.

### Vazio

Texto curto centralizado em `ink-muted`, que diz o que fazer, com a ação, se houver, num botão secundário. Nunca use ilustração.

## Destaque

### Hero

A peça grande da tela no estilo `hero`, com uma linha de apoio ao lado ou embaixo em `text-md` (a primeira palavra em `ink` 600 e o resto em `ink-muted`).
- **Data:** como o produto escreve, por exemplo `28.09`.
- **Número:** sem unidade, com a unidade na linha de apoio.

Clicar na data abre o calendário em popover. Não há setas de anterior e próximo ao lado.

## Superfícies flutuantes

### Popover e menu

- **Forma:** `surface`, borda de 1px em `ink`, raio 14 e `shadow-pop`.
- **Entrada:** `motion-pop`.
- **Opções:** raio 8. A ativa fica invertida.
- **Nativo:** `Menu` e `popover` (Apple, já em vidro), `DropdownMenu` (Android), `MenuFlyout` (Windows).

### Folha e diálogo

Use os do sistema. O título é a pergunta ou a ação. Os botões são o verbo ("Excluir lote") e "Cancelar". A ação destrutiva fica com o papel destrutivo do sistema.

## Formulário

- **Campo:**
  - rótulo em `text-sm` 600, acima;
  - entrada em cápsula com borda `rule-strong` (`ink` no foco);
  - dica em `text-xs` `ink-muted`, abaixo;
  - erro em `danger`, abaixo, no lugar da dica.
- **Caixa de marcar:** quadrado com raio 4 e borda `rule-strong`. Marcada, fica cheia de `ink` com o visto em `paper`.
- **Lista editável:** uma linha por item, com fio, um botão "Remover" discreto e "Adicionar" secundário no fim.
- **Nativo:** `Form` (Apple), `OutlinedTextField` (Android), `TextBox` com `Header` (Windows), cada um com estes tokens.

## Acessibilidade de todos

- **Foco visível:** anel de 2px em `ink`, afastado 2px. Nas plataformas nativas, o foco do sistema.
- **Área de toque:** pelo menos 44 por 44 (Apple), 48 por 48 (Android) e 40 por 40 (Windows).
- **Nome acessível:** todo controle tem. A cor nunca é o único sinal.
