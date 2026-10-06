# Adicionar ao Claude

Com a skill, o Claude aplica a identidade sozinho em qualquer trabalho visual. Com o conector, ele consulta os tokens e as regras na hora. Escolha pelo lugar onde você usa o Claude.

> [!NOTE]
> Conferido em 06/10/2026 no Claude Code 2.1.289 (comandos `claude plugin` e `claude mcp add`, link `claude-cli://`) e na documentação oficial do claude.ai (claude.com/docs: skills e conectores). Se uma tela do Claude mudar de nome, siga a documentação oficial.

| Onde | O que instalar | Como |
|---|---|---|
| Claude Code (terminal, app desktop, IDE) | O plugin, que traz a skill | [No Claude Code](#no-claude-code) |
| claude.ai e app do Claude | A skill, em arquivo .zip | [No claude.ai e no app](#no-claude-ai-e-no-app) |
| Qualquer um dos dois, para consultar | O conector MCP | [O conector](#o-conector) |

## No Claude Code

**Pelo botão.** Na [apresentação](/#adicionar), **Abrir no Claude Code** abre o terminal com o pedido de instalação já escrito. Confira o texto e aperte Enter. O Claude roda os comandos abaixo e pede a sua permissão antes.

> [!NOTE]
> O botão usa o endereço `claude-cli://`, que o Claude Code registra no sistema na primeira vez que você manda um pedido numa sessão. Se nada acontecer ao clicar, abra o Claude Code uma vez, mande qualquer pedido e tente de novo.

**Pelo terminal:**

```bash
claude plugin marketplace add byescaleira/byescaleira-visual-id
claude plugin install byescaleira-visual-id@byescaleira-visual-id
```

**Dentro do Claude Code:**

```text
/plugin marketplace add byescaleira/byescaleira-visual-id
/plugin install byescaleira-visual-id@byescaleira-visual-id
```

Depois, peça normalmente: "faça a landing page do produto", "monte os slides da reunião", "crie a tela de configuração no app iOS". A skill entra sozinha. Para chamar explicitamente, use `/byescaleira-visual-id`.

### Para o projeto inteiro

Para todo mundo que abrir um repositório ter a skill, ponha no `.claude/settings.json` do projeto:

```json
{
  "extraKnownMarketplaces": {
    "byescaleira-visual-id": { "source": { "source": "github", "repo": "byescaleira/byescaleira-visual-id" } }
  },
  "enabledPlugins": { "byescaleira-visual-id@byescaleira-visual-id": true }
}
```

Quem abrir o projeto recebe o plugin depois de confiar na pasta.

## No claude.ai e no app

1. Baixe a skill: [skill.zip](/skill.zip). O arquivo traz a pasta `byescaleira-visual-id/` com as regras, a referência inteira e os tokens.
2. No claude.ai ou no app do Claude, abra [Customize, Skills](https://claude.ai/customize/skills) e envie o arquivo.
3. Ligue a skill. Com ela ligada, o Claude a usa quando o pedido for visual.

Nos planos Team e Enterprise, quem administra pode compartilhar a skill ou publicá-la para a organização inteira, na mesma tela.

> [!IMPORTANT]
> A skill enviada é uma cópia. Quando sair uma versão nova da identidade, baixe e envie de novo. No Claude Code, o plugin se atualiza com `claude plugin marketplace update`.

## O conector

O conector é um servidor MCP só de leitura, sem login, em:

```text
https://design.byescaleira.com/mcp
```

- **No claude.ai e no app:** abra [Customize, Connectors](https://claude.ai/customize/connectors), escolha **Add custom connector**, cole o endereço e escolha sem login. O plano Free aceita um conector desses.
- **No Claude Code:**

```bash
claude mcp add --transport http byescaleira-design https://design.byescaleira.com/mcp
```

As ferramentas estão em [O conector](/doc/conector).

## Sem o Claude

Na web, ligue o CSS dos tokens direto da API, ou instale o pacote. O passo a passo está em [Web](/doc/web).

```html
<link rel="stylesheet" href="https://design.byescaleira.com/api/v1/tokens.css">
```
