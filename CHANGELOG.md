# Mudanças

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
