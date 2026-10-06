# Windows

No Windows, o design system veste o app nativo em WinUI 3 (Windows App SDK) com os controles do Fluent. A janela, a barra de título, a navegação e os materiais (Mica e Acrylic) são os do sistema. O design system troca as cores de destaque, as fontes, as formas e o conteúdo.

## Cor

- **Cor de destaque = `ink`.** Sobrescreva os recursos de destaque no tema claro e no escuro (`ThemeDictionaries` com chaves `Light` e `Dark`):
  - `SystemAccentColor`, `SystemAccentColorLight1`…`Light3` e `SystemAccentColorDark1`…`Dark3` ficam em `ink`. No claro é preto, e os tons "Dark" podem ser `#1a1a1a`, `#333333` e `#4d4d4d` para os estados. No escuro, o inverso.
  - O texto sobre destaque fica em `paper`.
- **Os tokens como recursos.** Cada token vira um `SolidColorBrush` com o nome do token em PascalCase (`PaperBrush`, `InkBrush`, `InkMutedBrush`, `RuleBrush`, `WarnBrush`…), com os valores de [tokens.md](tokens.md). Use sempre `{ThemeResource …}`, nunca `StaticResource`, para trocar de tema sozinho.
- **Alto contraste:** no dicionário `HighContrast`, aponte os pincéis para as cores do sistema:
  - `SystemColorWindowColor` para o fundo;
  - `SystemColorWindowTextColor` para o texto e os fios;
  - `SystemColorHighlightColor` e `SystemColorHighlightTextColor` para a interação.

  O design system cede: quem usa alto contraste escolheu as cores.

## Materiais

- **Janela:** `MicaBackdrop` como `SystemBackdrop` da janela principal. O Mica é quase neutro e combina com o preto e branco.
- **Conteúdo:** sobre o Mica, a área de conteúdo é `paper` opaco, com fios `rule`. O texto nunca fica direto sobre material translúcido.
- **Acrylic** (`DesktopAcrylicBackdrop`) só em superfícies passageiras, como menus e flyouts, que o sistema já desenha assim.
- **Sem material inventado** (transparência própria, desfoque próprio).

## Tipografia

- **Fontes no pacote do app:** Schibsted Grotesk e Source Serif 4, referenciadas como `ms-appx:///Assets/Fonts/<arquivo>#<família>`.
- **Sobrescreva `ContentControlThemeFontFamily`** com a `sans`, para todos os controles herdarem a fonte.
- **Estilos de texto próprios a partir da escala,** no lugar de `TitleTextBlockStyle`, `BodyTextBlockStyle` etc.:
  - tamanho do token, em epx;
  - `FontWeight` 400, 600, 650 ou 700;
  - `CharacterSpacing` em milésimos de em, por exemplo -50 para -0,05em.
- **Tamanho do texto do sistema:** deixe `IsTextScaleFactorEnabled` ligado (o padrão).

## Forma

- **`ControlCornerRadius`:** o padrão do Fluent nos controles. Botões, caixas de texto e combos podem ir para cápsula, pondo `CornerRadius` com a metade da altura. Siga uma regra só no app inteiro.
- **`OverlayCornerRadius`:** 14 (`radius-block`).
- **Bordas de 1px e sem sombra** no conteúdo. Flyouts e menus mantêm a sombra do sistema.

## Componentes

| Design system | WinUI |
|---|---|
| Botão principal | `Button` com `Style="{StaticResource AccentButtonStyle}"`, que fica em tinta |
| Botão secundário | `Button` padrão |
| Botão discreto | `HyperlinkButton` |
| Segmented | `SelectorBar` |
| Busca | `AutoSuggestBox` com ícone de lupa |
| Filtro | `DropDownButton` com `MenuFlyout` de opções marcáveis |
| Lista | `ListView` com separador de 1px. A seleção fica em tinta |
| Aviso | `InfoBar`, com as cores do sinal (`warn`, `danger`, `ok`) e o texto em uma frase |
| Navegação | `NavigationView` (lateral em janelas largas, no topo em janelas estreitas) |
| Barra de título | `TitleBar` personalizada com `ExtendsContentIntoTitleBar`, e o nome do produto no estilo `brand` |

## Ícones

Segoe Fluent Icons, contorno, na cor do texto. O ícone do app é monocromático e vale em fundo claro e escuro.

## Conferir

- [ ] Destaque em tinta em todos os estados (repouso, hover, pressionado).
- [ ] Mica na janela; conteúdo opaco em `paper`.
- [ ] Fonte do design system em todos os controles.
- [ ] Claro, escuro e os temas de alto contraste.
- [ ] Teclado (Tab, setas, Enter, Esc) e Narrador em todos os controles.
