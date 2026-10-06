# Apple: iPhone, iPad, Mac e Apple TV

Nas plataformas Apple, o design system veste o app nativo. Não substitui a interface do sistema. A navegação, as barras, os menus e as folhas são os do sistema, em **Liquid Glass**. O design system muda a cor de destaque (tinta), as fontes, o conteúdo e o que é próprio do produto.

Conferido no Xcode 27 (SDKs 27). Liquid Glass existe desde iOS, iPadOS, macOS, tvOS e watchOS 26.

> [!IMPORTANT]
> A partir dos SDKs 27, o Liquid Glass é obrigatório: a chave `UIDesignRequiresCompatibility` é ignorada em apps compilados para iOS, iPadOS, macOS e tvOS 27. A identidade preto e branco tem de funcionar **com** o vidro, não no lugar dele.

## As duas camadas

| Camada | O que é | Como fica |
|---|---|---|
| **Conteúdo** | Listas, textos, a peça de destaque, formulários | `paper` puro, plano, com fios `rule`. **Nunca em vidro** |
| **Navegação e controles** | Barra de abas, barra lateral, barra de ferramentas, botões flutuantes, menus, popovers, folhas | O Liquid Glass do sistema, com o rótulo e o ícone em `ink` |

O vidro não tem cor própria. Sobre o `paper` preto e branco, ele fica preto e branco, que é o que se quer.

## Cor

- **Cor de destaque do app = `ink`.** No catálogo de cores, crie `AccentColor` com preto (claro) e branco (escuro). Assim, controles, seleção e o vidro "proeminente" ficam em tinta.
- **Cada token é uma cor do catálogo** com variante clara e escura, com os valores de [tokens.md](tokens.md). Use os mesmos nomes em camelCase: `paper`, `ink`, `inkMuted`, `rule`, `warn`… Crie também a variante de **alto contraste**: `inkMuted` e `inkFaint` viram `ink`, e `rule` vira `ink`.
- **Não use as cores semânticas do sistema** (`.secondary`, `.blue`, `systemGray`) no lugar dos tokens. A exceção são as cores que o próprio sistema aplica aos controles dele.
- **Tingir o vidro** (`Glass.tint`, `.glassProminent`) só na ação principal da tela, e só com `ink`. Nunca tinja vários controles nem use cor de sinal no vidro.

## Liquid Glass: o que usar

- **Navegação do sistema primeiro.** `TabView`, `NavigationSplitView`, `.toolbar` e `.searchable` já vêm em vidro. Não refaça.
- **Botões sobre o conteúdo:**
  - `.buttonStyle(.glass)` para as ações secundárias;
  - `.buttonStyle(.glassProminent)` para a principal, que fica em tinta por causa do `AccentColor`.
- **Controle próprio flutuante:** `.glassEffect(.regular, in: .capsule)` como último modificador. Junte os vizinhos num `GlassEffectContainer(spacing:)` para que se fundam e animem juntos.
- **`.clear` só sobre mídia** (foto, vídeo), com uma camada escura de 35% embaixo. Na interface preto e branco, use `.regular`.
- **Pouco vidro na tela.** O vidro é para o que é funcional e flutua, não para enfeitar cartões.
- **Proibido:**
  - vidro no conteúdo: lista, cartão, seção, fundo de tela;
  - vidro empilhado em vidro;
  - vidro colorido com cor de marca.

```swift
// Ação principal flutuante, em tinta; secundária em vidro neutro.
HStack {
    Button("Filtrar", systemImage: "line.3.horizontal.decrease") { }
        .buttonStyle(.glass)
    Button("Aprovar 3 eventos") { }
        .buttonStyle(.glassProminent)
}
```

**Compatibilidade com sistemas anteriores ao 26:** `if #available(iOS 26, macOS 26, tvOS 26, watchOS 26, *)` em volta do vidro. Como alternativa, um fundo `paper` com fio `rule` (não um material translúcido inventado). No visionOS, as APIs de vidro não existem: use `#if !os(visionOS)`. A janela do visionOS já é de vidro.

**Acessibilidade:** o vidro do sistema se ajusta sozinho.
- **Reduzir transparência:** o vidro fica mais fosco.
- **Aumentar contraste:** preto ou branco, com borda.
- **Reduzir movimento:** menos efeito.

Num controle próprio, leia `@Environment(\.accessibilityReduceTransparency)` e use um fundo opaco (`surface` com fio `ink`) quando estiver ligado.

## Tipografia

- **Inclua as fontes no app.** São Schibsted Grotesk e Source Serif 4, nos arquivos variáveis ou nos pesos 400, 600, 650 e 700. Declare-as em `UIAppFonts` (iOS, iPadOS, tvOS, watchOS, Catalyst) ou em `ATSApplicationFontsPath` (macOS).
- **Use `Font.custom(nome, size:, relativeTo:)`** com o nome PostScript da fonte e o estilo de texto do sistema mais próximo, para acompanhar o Dynamic Type:

  | Estilo do design system | `relativeTo:` |
  |---|---|
  | `hero` | `.largeTitle` |
  | `text-xl` | `.title` |
  | `text-lg` | `.title2` |
  | `text-md` | `.title3` |
  | `text-base`, `title` | `.body` |
  | `text-sm` | `.subheadline` |
  | `text-xs` | `.caption` |

- **Números em coluna:** `.monospacedDigit()`. Espaçamento negativo nos grandes: `.tracking(-0.05 * tamanho)`.
- **Espaços que crescem com o texto:** `@ScaledMetric`.
- **Se a fonte não carregar,** o SwiftUI cai na fonte do sistema sem avisar. Confira no app rodando.

## Ícones

SF Symbols em peso regular, na cor do texto (`.foregroundStyle(ink)`), sem a variante colorida (`.multicolor` não). Em botão de ícone sozinho, o nome acessível vem do rótulo do `Label`.

## Por dispositivo

**iPhone:**
- **Navegação:** barra de abas embaixo, que encolhe ao rolar (`.tabBarMinimizeBehavior(.onScrollDown)`).
- **Ações:** principal na barra de ferramentas ou num botão flutuante.
- **Conteúdo:** em largura total, com margem de 16.
- **Destaque:** a peça `hero` no alto do conteúdo, não na barra.

**iPad:**
- **Navegação:** `NavigationSplitView` com barra lateral (vidro) e conteúdo. A lista e a leitura ficam lado a lado, como na web larga.
- **Ponteiro:** use o hover do sistema, que no conteúdo vira `sunken`.

**Mac:**
- **Janela:** barra lateral e barra de ferramentas do sistema, em vidro.
- **Controles:** com borda em cápsula, `borderShape = .capsule` no AppKit.
- **Medidas:** densidade de desktop, com linha de lista de 28 a 32 e texto base de 13 (`text-sm`) onde o Mac usa 13.
- **Atalhos:** atalho de teclado para toda ação principal, com menus na barra de menus.
- **AppKit:** `NSGlassEffectView` com o conteúdo dentro de `contentView`.

**Apple TV:**
- **Foco:** é tudo. Os controles padrão ganham vidro e crescem ao receber foco; use-os em vez de desenhar o foco à mão.
- **Distância:** o texto é lido de longe. Base de 29 (no lugar de 15), com a mesma escala de 1,25 e o `hero` maior.
- **Fundo:** `paper` preto (tema escuro) por padrão, porque a sala costuma estar escura.
- **Nada de toque fino:** navegação por foco, sem barras de filtro densas.

**Apple Watch:** use a toolbar e os estilos de botão do sistema. O vidro muda pouco ali. O conteúdo é `paper` preto, e o destaque é o `hero`.

## Conferir

- [ ] `AccentColor` em tinta; nenhuma cor do sistema no lugar dos tokens.
- [ ] Conteúdo plano em `paper`; vidro só na navegação e nos controles flutuantes.
- [ ] Um controle tingido no máximo, e em tinta.
- [ ] Fontes carregando (não caiu na do sistema) e acompanhando o Dynamic Type.
- [ ] Claro, escuro, Aumentar contraste e Reduzir transparência.
- [ ] Toque de 44×44, VoiceOver lendo todo controle.
