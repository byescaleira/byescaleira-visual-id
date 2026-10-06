# Mudanças

## 1.1.0

- **Datas especiais** (`seasons` no `tokens.json`): Ano-novo, Carnaval, Páscoa, Festa junina, Dia da Advocacia, Independência, Dia das Crianças e Natal. A cor da data aparece só no fio de 3px no topo e no ponto com o nome da data; a interação continua tinta. Regra nova em [datas.md](skills/byescaleira-visual-id/reference/datas.md), na regra 3 da `SKILL.md`, em princípios e em cor. O build confere 4,5:1 de cada cor sobre o papel e o formato de cada período.
- **Alto contraste no `tokens.json`** (`color.highContrast`): os cinzas de texto e os fios viram `ink`. O `tokens.css` aplica com `prefers-contrast: more` e com `data-contrast="more"`.
- **`tokens.css`:** `data-season="<id>"` liga `--season`. No Tailwind, `season` entra nas cores.
- **Layout:** `doc-nav-width`, `doc-toc-width` e `doc-max-width`, para a documentação em livro.
- **Serviço `design.byescaleira.com`** (`service/`, `deploy/`, `docs/`):
  - a apresentação, com a API ao vivo e o **Adicionar ao Claude** (Claude Code pelo link `claude-cli://`, conferido no Claude Code 2.1.289; claude.ai pela skill em .zip; o conector; e a web);
  - a documentação em formato de livro em `/doc`, gerada da referência da skill e de `docs/`, com busca;
  - a API pública em `/api/v1`: tokens, temas (claro, escuro e alto contraste, com produto e data especial, em JSON e em CSS), produtos, datas, contraste e a referência em Markdown, com especificação OpenAPI 3.1;
  - o conector MCP em `/mcp`, só leitura e sem login: `design_guide`, `design_reference`, `design_theme`, `design_contrast`, `design_find_token` e `design_season`;
  - a skill em `/skill.zip`, com os tokens em `assets/` para quem usa sem o plugin.

## 1.0.0

Primeira versão, separada do design system do CLIO.

- **`tokens/tokens.json` como fonte única.** Cores em claro e escuro, sinais, papéis de interação, tipografia (Schibsted Grotesk e Source Serif 4), espaço, raio, fio, sombra, movimento e layout, cada um com a nota de uso.
- **Gerador `scripts/build.mjs`.** Produz as variáveis CSS, o tema do Tailwind v4 e a tabela de valores. Confere o contraste.
- **Skill `byescaleira-visual-id` para o Claude Code**, com a referência completa:
  - princípios, cor, tipografia, forma, componentes, escrita e marca;
  - web (app e landing page) e slides;
  - Apple (com Liquid Glass, conferido nos SDKs 27), Android (Material 3) e Windows (WinUI 3, Mica).
- **Produto CLIO** em `products/clio/`: nome, símbolo, cores de dado (Google Agenda) e o formato da data em destaque.
- **Mudança de nomes em relação ao design system do CLIO:**
  - `date-hero` virou `hero`;
  - `teor` virou `reading`;
  - as cores `event-*` saíram do núcleo e foram para as cores de dado do produto CLIO;
  - as variáveis `--text-day` e `--text-batch` passaram a ser do CLIO; no núcleo há `--text-hero`.
