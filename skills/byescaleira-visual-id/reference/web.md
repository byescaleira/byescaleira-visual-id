# Web: app e landing page

Na web, o design system entra como CSS. As variáveis vêm de `web/tokens.css` (e `web/tailwind.css` para Tailwind v4), geradas de `tokens/tokens.json`. Não há biblioteca de componentes. Os componentes de [componentes.md](componentes.md) são montados no projeto com estas variáveis.

## Instalar

**Com npm:**

```json
"dependencies": {
  "byescaleira-visual-id": "https://codeload.github.com/byescaleira/byescaleira-visual-id/tar.gz/refs/tags/v1.0.0",
  "@fontsource-variable/schibsted-grotesk": "^5",
  "@fontsource-variable/source-serif-4": "^5"
}
```

```ts
import "@fontsource-variable/schibsted-grotesk";
import "@fontsource-variable/source-serif-4";
import "byescaleira-visual-id/web/tokens.css";
import "./app.css"; // o CSS do projeto, só com var(--…)
```

O endereço é o do pacote da versão (tag) no GitHub: o `npm install` baixa o arquivo, sem precisar de git na máquina ou no Docker.

**Sem npm** (página avulsa, artifact): copie o conteúdo de `web/tokens.css` para um `<style>` e carregue as fontes do Google Fonts (`family=Schibsted+Grotesk:wght@400..900&family=Source+Serif+4:opsz,wght@8..60,400..700`). Copiar o arquivo inteiro é o mesmo que importar; o que não pode é escolher valores à mão.

**Com Tailwind v4:** importe `tokens.css` e depois `tailwind.css`. As classes ficam `bg-paper`, `text-ink`, `text-ink-muted`, `border-rule`, `text-warn`, `rounded-control`, `font-serif`… A paleta padrão do Tailwind é desligada (`--color-*: initial`): `bg-blue-500` não existe, de propósito.

## Base

```css
body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font: 400 var(--text-base) / 1.5 var(--sans);
  -webkit-font-smoothing: antialiased;
}
:focus-visible {
  outline: 2px solid var(--focus);
  outline-offset: 2px;
}
```

- **Tema:** segue `prefers-color-scheme`. Para forçar um, use `data-theme="light"` ou `"dark"` no `<html>`.
- **Alto contraste:** segue `prefers-contrast: more`. Para forçar, use `data-contrast="more"` no `<html>`.
- **Data especial:** `data-season="<id>"` no `<html>` liga `--season`, só para o fio do topo e o ponto com o nome da data ([datas.md](datas.md)).
- **Pela API, sem npm:** `https://design.byescaleira.com/api/v1/tokens.css` é o mesmo arquivo. Para um tema fixo, já resolvido, use `/api/v1/themes/<tema>.css`.
- **Espaço, raio e fio:** só as variáveis (`var(--space-4)`, `var(--radius-row)`, `1px solid var(--rule)`). Um número solto no CSS do projeto é erro, com duas exceções: 0 e os 2px do anel de foco.
- **Números em coluna:** `font-variant-numeric: tabular-nums`.
- **Menos movimento:** com `@media (prefers-reduced-motion: reduce)`, as transições viram troca direta.

## App

- **Layout:** barra do topo, barra de filtros e duas colunas:
  - **à esquerda, a lista,** com largura `var(--index-width)`;
  - **à direita, a leitura.**
- **Rolagem:** só os painéis rolam, nunca a janela. A altura vai explícita em toda a cadeia (`height: 100dvh` e `grid-template-rows` com `minmax(0, 1fr)`). Os painéis usam `overscroll-behavior: contain`.
- **Container queries no painel,** não media queries na janela: o painel decide o arranjo dele.
- **Telas estreitas:** a lista e a leitura se alternam, com "Voltar". Sem rolagem horizontal e com margem de 16.
- **Estado na URL** (filtros, item aberto), para o link levar à mesma tela.
- **Destaque:** a peça `hero` no cabeçalho da leitura (a data, o número).

## Landing page

A landing explica o produto. Não vende.
1. **Abertura:**
   - o nome do produto em `display`;
   - uma frase do que ele faz em `text-md`;
   - a ação principal (botão em tinta) e, se houver, uma secundária.

   Sem imagem de fundo, sem gradiente e sem mockup colorido.
2. **Como funciona:** passos numerados, só se forem de fato uma sequência, em linhas com fio.
3. **O produto em uso:** a interface real, em preto e branco, com dados inventados e claramente inventados. Nunca dados reais.
4. **Detalhes:** o que é preciso para usar, limites e segurança, em seções separadas por fio, com títulos em `headline`.
5. **Rodapé:** uma linha com fio em cima, links em `ink-muted`.

- **Largura:** o texto fica na medida (`--measure`). As seções ficam alinhadas à esquerda, numa coluna de leitura.
- **Movimento:** nenhum ao rolar. Se houver um momento animado, que seja um só, na abertura e curto.
- **Imagens:** só capturas da própria interface, nos dois temas se possível, com borda `rule` e sem sombra.

## Páginas avulsas (login, erro, aviso)

O mesmo cabeçalho mínimo (o nome do produto) e uma coluna central de até 420px:
- o título em `text-xl`;
- o texto em `ink-muted`;
- o controle principal em tinta.

A mensagem de erro diz o que fazer.

## Conferir

- [ ] Nenhuma cor, raio, sombra, fonte ou espaço fora das variáveis.
- [ ] Claro e escuro (`data-theme` e a preferência do sistema).
- [ ] 375px de largura sem rolagem horizontal.
- [ ] Foco visível no teclado em todo controle; contraste de 4,5:1.
- [ ] Um destaque só por tela; nenhum dado real em página pública.
