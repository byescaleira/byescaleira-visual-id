# Android

No Android, o design system veste o app nativo em Jetpack Compose com Material 3: os componentes, a navegação e os comportamentos são os do Material. O design system troca o esquema de cores, as fontes, as formas e o conteúdo.

## Cor

- **Sem cor dinâmica.** Não use `dynamicLightColorScheme`/`dynamicDarkColorScheme`: a cor vinda do papel de parede apagaria a identidade.
- **Monte o `ColorScheme` com os tokens.** Para cada papel do Material, use o valor de [tokens.md](tokens.md) no tema claro e no escuro:

  | Papel do Material | Token |
  |---|---|
  | `primary`, `inversePrimary` (escuro) | `ink` |
  | `onPrimary` | `paper` |
  | `primaryContainer` | `sunken` |
  | `onPrimaryContainer` | `ink` |
  | `secondary`, `tertiary` | `ink` |
  | `onSecondary`, `onTertiary` | `paper` |
  | `secondaryContainer` (indicador da aba ativa) | `ink` |
  | `onSecondaryContainer` | `paper` |
  | `background`, `surface` | `paper` |
  | `surfaceContainer*` (todos os tons) | `paper` |
  | `surfaceVariant` | `sunken` |
  | `onBackground`, `onSurface` | `ink` |
  | `onSurfaceVariant` | `ink-muted` |
  | `outline` | `rule-strong` |
  | `outlineVariant` | `rule` |
  | `error` | `danger` |
  | `onError` | `paper` |
  | `errorContainer` | `danger-wash` |
  | `onErrorContainer` | `danger` |
  | `surfaceTint` | transparente (sem tom de elevação) |

- **Os tons de `surfaceContainer` ficam todos iguais a `paper`.** O Material separa por tom; aqui, separe por fio (`HorizontalDivider` em `rule`).
- **`warn` e `ok` não existem no Material:** exponha-os num `CompositionLocal` próprio (por exemplo, `LocalSignals`) e use-os só em avisos e estados.

## Forma e elevação

- **`Shapes`:**
  - controles em `CircleShape` (pílula);
  - `small` 8 (`radius-inner`), `medium` 10 (`radius-row`), `large` 14 (`radius-block`);
  - folhas com o raio do Material.
- **Sem sombra e sem tom de elevação no conteúdo.** Cartões viram linhas com fio (`ListItem` + `HorizontalDivider`), não `ElevatedCard`. Menus e diálogos mantêm a elevação do Material.

## Tipografia

- **Fontes em `res/font`:** Schibsted Grotesk e Source Serif 4 (variáveis ou nos pesos 400, 600, 650 e 700), em `FontFamily`.
- **`Typography` do Material a partir da escala**, em `sp` (acompanha o tamanho de fonte do sistema):

  | Material | Design system |
  |---|---|
  | `displayLarge` | `hero` |
  | `displayMedium` | `display` (capa) |
  | `headlineLarge` | `headline` |
  | `headlineSmall` | `text-xl` |
  | `titleLarge` | `text-lg` |
  | `titleMedium` | `text-md` |
  | `titleSmall` | `title` |
  | `bodyLarge` | `text-base` |
  | `bodyMedium`, `labelLarge` | `text-sm` |
  | `labelMedium`, `labelSmall` | `text-xs` |

- **Espaçamento:** `letterSpacing` em `em`, negativo só nos grandes.
- **Números em coluna:** `fontFeatureSettings = "tnum"`.

## Componentes

| Design system | Compose (Material 3) |
|---|---|
| Botão principal | `Button` (`primary` = tinta) |
| Botão secundário | `OutlinedButton` (borda `outline`) |
| Botão discreto | `TextButton` |
| Segmented | `SingleChoiceSegmentedButtonRow` |
| Filtro | `FilterChip`: selecionado fica invertido |
| Busca | `SearchBar` / `DockedSearchBar` |
| Linha de lista | `ListItem` + `HorizontalDivider` |
| Aviso | Superfície própria com `*-wash` e texto na cor do sinal (não `Snackbar` para avisos que ficam) |
| Navegação | `NavigationBar` (celular), `NavigationRail` / `NavigationSuiteScaffold` (tablet e janelas largas) |

O indicador da aba ativa fica em tinta (`secondaryContainer` = `ink`), com o ícone em `paper`.

## Ícones

Material Symbols **Outlined**, peso 300 a 400, na cor do texto. Sem a variante Filled colorida.

## Comportamentos nativos

- **Edge-to-edge:** o app desenha sob as barras do sistema. Respeite os insets.
- **Voltar preditivo** e gestos do sistema: não substitua.
- **Ícone do app:** ícone adaptativo e o monocromático para o tema do sistema.
- **Texto:** o tamanho de fonte do sistema escala o texto; teste em 200%.

## Conferir

- [ ] Sem cor dinâmica; `primary` em tinta; nenhum tom de `surfaceContainer` diferente de `paper`.
- [ ] Sem `ElevatedCard` no conteúdo; linhas com fio.
- [ ] Fontes do design system em toda a `Typography`.
- [ ] Claro, escuro, texto em alto contraste e fonte em 200%.
- [ ] Toque de 48×48 e TalkBack lendo todo controle.
