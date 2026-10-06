# byescaleira-visual-id

A identidade visual byescaleira: os tokens em JSON, a documentação e as instruções para agentes de IA (com foco no Claude Code) aplicarem a mesma identidade em qualquer projeto:
- **web:** app e landing page;
- **apresentações de slides;**
- **apps nativos:** iPhone, iPad, Mac, Apple TV, Android e Windows, com o que é nativo de cada um, como o Liquid Glass da Apple.

**Preto e branco. A cor só aparece quando informa.**

## A identidade em cinco regras

1. **Tinta sobre papel.** Fundo branco puro (preto puro no tema escuro) e texto em tinta.
2. **Interação é tinta.** Não existe cor de marca: botão principal, seleção e foco em preto (branco no escuro).
3. **A cor só informa:**
   - âmbar para atenção, vermelho para erro, verde para feito;
   - as cores que vêm do próprio dado, em marcas pequenas e com o nome ao lado.
4. **Fios, não caixas.** As áreas se separam por fios de 1px, sem cartões nem sombra.
5. **Um destaque por tela.** Uma peça grande (a data, o número) e o resto quieto, em Schibsted Grotesk, com Source Serif 4 só para leitura longa.

O detalhe de cada regra está em [skills/byescaleira-visual-id/reference/](skills/byescaleira-visual-id/reference/principios.md).

## No site

Em [design.byescaleira.com](https://design.byescaleira.com) estão a apresentação, a [documentação](https://design.byescaleira.com/doc) em formato de livro, a [API](https://design.byescaleira.com/doc/api) (os tokens resolvidos para o tema, o produto e a data especial, em JSON e em CSS) e o botão **Adicionar ao Claude**.

## Com o Claude Code

A skill `byescaleira-visual-id` ensina o Claude a aplicar a identidade. Instale uma vez:

```text
/plugin marketplace add byescaleira/byescaleira-visual-id
/plugin install byescaleira-visual-id@byescaleira-visual-id
```

Depois, peça normalmente: "faça a landing page do produto", "monte os slides da reunião", "crie a tela de configuração no app iOS". A skill entra sozinha em qualquer trabalho visual. Para chamar explicitamente, use `/byescaleira-visual-id`.

Para deixar a skill ligada num projeto (para todo mundo que abrir o repositório), ponha no `.claude/settings.json` do projeto:

```json
{
  "extraKnownMarketplaces": {
    "byescaleira-visual-id": { "source": { "source": "github", "repo": "byescaleira/byescaleira-visual-id" } }
  },
  "enabledPlugins": { "byescaleira-visual-id@byescaleira-visual-id": true }
}
```

**No claude.ai e no app do Claude:** baixe a skill em [design.byescaleira.com/skill.zip](https://design.byescaleira.com/skill.zip) e envie em Customize, Skills.

**O conector** (MCP, só leitura, sem login): `https://design.byescaleira.com/mcp`. No claude.ai, em Customize, Connectors, Add custom connector; no Claude Code, `claude mcp add --transport http byescaleira-design https://design.byescaleira.com/mcp`.

**Outros agentes** (Codex, Cursor, Gemini…): aponte para [AGENTS.md](AGENTS.md), que leva à mesma skill.

## Sem agente

| Para | Use |
|---|---|
| Os valores (cores nos dois temas, tipografia, espaço, raio, movimento) | [`tokens/tokens.json`](tokens/tokens.json), a fonte única, ou a mesma coisa em tabelas, em [reference/tokens.md](skills/byescaleira-visual-id/reference/tokens.md) |
| Web | [`web/tokens.css`](web/tokens.css) (variáveis CSS) e [`web/tailwind.css`](web/tailwind.css) (Tailwind v4). Veja [web.md](skills/byescaleira-visual-id/reference/web.md) |
| Slides | [slides.md](skills/byescaleira-visual-id/reference/slides.md) |
| Apple | [apple.md](skills/byescaleira-visual-id/reference/apple.md) |
| Android | [android.md](skills/byescaleira-visual-id/reference/android.md) |
| Windows | [windows.md](skills/byescaleira-visual-id/reference/windows.md) |
| Componentes (anatomia e estados) | [componentes.md](skills/byescaleira-visual-id/reference/componentes.md) |
| Escrita | [escrita.md](skills/byescaleira-visual-id/reference/escrita.md) |

Nas plataformas nativas não há código pronto, de propósito. Cada app cria os recursos nativos dele (catálogo de cores, `ColorScheme`, `ResourceDictionary`) com os nomes e os valores do JSON, e usa os controles do sistema.

**Na web, com npm** (o pacote da versão, sem precisar de git):

```json
"dependencies": {
  "byescaleira-visual-id": "https://codeload.github.com/byescaleira/byescaleira-visual-id/tar.gz/refs/tags/v1.0.0"
}
```

```ts
import "byescaleira-visual-id/web/tokens.css";
```

## Produtos

Cada produto usa a identidade com o próprio nome, o próprio símbolo e, se tiver, as próprias cores de dado. Fica em [`products/`](products/):
- [CLIO](products/clio/clio.json): publicações judiciais para eventos de prazo na agenda.

Veja [marca.md](skills/byescaleira-visual-id/reference/marca.md) para criar um produto novo.

## Estrutura

| Caminho | O quê |
|---|---|
| `tokens/tokens.json` | **A fonte única.** Todo valor da identidade, com a nota de uso |
| `scripts/build.mjs` | Gera `web/` e `reference/tokens.md` a partir do JSON e confere o contraste |
| `web/` | Gerado: as variáveis CSS e o tema do Tailwind |
| `skills/byescaleira-visual-id/` | A skill: `SKILL.md` (as instruções para o agente) e `reference/` (a documentação completa) |
| `products/` | Os produtos: nome, símbolo, cores de dado |
| `service/` | O serviço de [design.byescaleira.com](https://design.byescaleira.com): apresentação, documentação, API, conector MCP e a skill em .zip |
| `docs/` | As páginas da documentação que são só do serviço (instalar, API, conector, implantação) |
| `deploy/` | Dockerfile, compose e o bloco do Caddy da VPS |
| `.claude-plugin/` | O plugin e o marketplace do Claude Code |

## Mudar a identidade

Projeto nenhum define cor, fonte, espaço, raio ou componente próprio: o que faltar entra aqui primeiro. Edite `tokens/tokens.json` ou a referência, rode `node scripts/build.mjs`, atualize o [CHANGELOG](CHANGELOG.md) e abra um pull request. O passo a passo está em [mudar.md](skills/byescaleira-visual-id/reference/mudar.md).

## Fontes e licença

- **Fontes:** Schibsted Grotesk e Source Serif 4, ambas SIL Open Font License 1.1, livres para apps, sites e documentos.
- **Este repositório:** público para consulta e instalação da skill. Todos os direitos reservados: a identidade não é para uso em produtos de terceiros.
