# Espaço, forma, movimento e ícones

Os valores estão em [tokens.md](tokens.md).

## Espaço

Só os sete passos:

| Token | Valor |
|---|---|
| `space-1` | 4 |
| `space-2` | 8 |
| `space-3` | 12 |
| `space-4` | 16 |
| `space-5` | 24 |
| `space-6` | 32 |
| `space-7` | 48 |

Um valor fora da lista é erro, inclusive 6, 10 e 20.

- **Margem lateral:**
  - 16 no celular;
  - 32 nas barras e nas seções em tela larga;
  - em slide, 6% da largura.
- **Entre controles de uma barra:** 8.
- **Entre seções:** 32 ou 48.

## Raio por hierarquia

| O quê | Raio |
|---|---|
| Controle: botão, busca, filtro, segmented | Cápsula (`radius-control`) |
| Etiqueta e contagem | Cápsula (`radius-pill`) |
| Linha selecionada, aviso | 10 (`radius-row`) |
| Popover, menu, folha | 14 (`radius-block`) |
| Opção dentro de popover | 8 (`radius-inner`) |
| Painel, seção, página | 0, reto |

Nas plataformas que desenham os próprios controles e janelas (Liquid Glass, Material, Fluent), vale o raio do sistema. Veja a página de cada plataforma.

## Fio, borda e sombra

- **Todo fio e toda borda têm 1px** (`rule-width`). Nunca há borda grossa. A única exceção é o fio de cor de dado, de 3px.
- **Sombra só no que flutua** (`shadow-pop`): popover e menu, na web e no Windows. Nas plataformas Apple, o que flutua é o material do sistema (Liquid Glass), sem sombra própria.
- **O popover tem borda de 1px em `ink`,** além da sombra.

## Camadas

1. **Conteúdo:** sempre em `paper`, plano.
2. **Navegação e controles flutuantes:** o material da plataforma (vidro na Apple, Mica/Acrylic no Windows, superfícies do Material no Android) ou, na web, `paper` com fio.
3. **Popover e menu:** `surface`, com borda `ink` e `shadow-pop`.

O conteúdo nunca fica em vidro ou em material translúcido.

## Movimento

Pouco e curto. Só responde a uma ação ou mostra uma espera.

| Token | Duração | Onde |
|---|---|---|
| `motion-fast` | 120ms | Fundo, borda e cor de controles e linhas |
| `motion-pop` | 140ms | Popover entrando: 4px para baixo e opacidade |
| `motion-progress` | 1,3s | Barra de carregamento varrendo |
| `motion-spin` | 900ms | Spinner |

**Proibido:**
- seção entrando animada ao rolar;
- parallax;
- movimento decorativo em loop;
- slide com transição chamativa.

Se o sistema pede **menos movimento** (Reduzir movimento, `prefers-reduced-motion`), as transições viram troca direta.

Nas plataformas nativas, use as animações e transições do sistema (a navegação, as folhas, a morfose do vidro) com a duração e a curva dele.

## Ícones

- **De traço,** no mesmo padrão: grade de 24, traço de 1,8, pontas e junções arredondadas, sem preenchimento.
- **Tamanho e cor:** 16 a 18 ao lado de texto, sempre na cor do texto.
- **Nas plataformas nativas, use o conjunto do sistema** no peso que combina com o traço:
  - SF Symbols, peso regular, na Apple;
  - Material Symbols Outlined, peso 300 a 400, no Android;
  - Segoe Fluent Icons, contorno, no Windows.
- **Na web,** desenhe no padrão acima ou use Lucide, que já tem esse traço, com `stroke-width` 1,8.
- **Sem emoji, sem ícone colorido** e sem ícone sozinho onde um rótulo cabe. Ícone sozinho precisa de nome acessível.
