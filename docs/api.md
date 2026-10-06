# API

Os tokens da identidade, servidos em JSON e em CSS e resolvidos para o tema, o produto e a data. Pública, só leitura e sem chave.

## O básico

- **Endereço:** `https://design.byescaleira.com/api/v1`. O índice, com os links, está no próprio endereço.
- **Só leitura:** todas as rotas são `GET`. Não há chave nem login.
- **CORS aberto:** dá para chamar de qualquer site, direto do navegador.
- **Cache:** as respostas valem 5 minutos (`Cache-Control: public, max-age=300`). O cabeçalho `X-Design-Version` diz a versão da identidade.
- **Especificação:** OpenAPI 3.1 em [`/api/openapi.json`](/api/openapi.json). Cada endereço, com o botão de testar, está na [Referência da API](/doc/referencia-da-api).

```bash
curl https://design.byescaleira.com/api/v1/themes/dark
```

## Temas

Um tema é o design system inteiro resolvido para um caso. Ele combina quatro escolhas:

| Escolha | Onde | Valores |
|---|---|---|
| Modo e contraste | no caminho | `light`, `dark`, `light-high-contrast`, `dark-high-contrast` |
| Produto | `product` | `clio`, ou nenhum |
| Data especial | `season` | `none` (padrão), `auto` ou o id de uma data, como `natal` |
| Dia | `date` | aaaa-mm-dd, para `season=auto`. Padrão: hoje, no fuso de São Paulo |

```bash
curl "https://design.byescaleira.com/api/v1/themes/dark?product=clio&season=auto"
```

A resposta traz:
- **`color`:** todas as cores do tema, com os apelidos já resolvidos (`accent` vem com o valor de `ink`). No alto contraste, os cinzas de texto e os fios já vêm em tinta. Com uma data, vem também `season`.
- **`dataColors`:** as cores de dado do produto, com o nome e o token (`data-lavanda`).
- **`type`, `space`, `radius`, `border`, `shadow`, `motion`, `layout`:** os mesmos valores em todos os temas.
- **`product`** e **`season`:** o que foi combinado, ou `null`.

### Em CSS

Termine o nome do tema em `.css` para receber as variáveis num `:root` só, sem media queries. Serve para quem quer um tema fixo, como um e-mail ou uma captura:

```html
<link rel="stylesheet" href="https://design.byescaleira.com/api/v1/themes/dark.css?product=clio">
```

Para o tema que segue o sistema (claro, escuro e alto contraste pela preferência da pessoa), use o CSS completo:

```html
<link rel="stylesheet" href="https://design.byescaleira.com/api/v1/tokens.css">
```

## Datas especiais

A identidade tem cores de datas especiais: Natal, Ano-novo, Carnaval, Páscoa, Festa junina e outras. A regra de uso está em [Datas especiais](/doc/datas). Na API:

- [`/api/v1/seasons`](/api/v1/seasons): todas as datas, com o período no ano, a data em vigor e as próximas;
- [`/api/v1/seasons/current`](/api/v1/seasons/current): a data de hoje, ou `null`;
- `/api/v1/seasons/{id}?year=2027`: uma data, com o período no ano pedido. O Carnaval e a Páscoa mudam de dia a cada ano.

Com o `tokens.css`, basta pôr `data-season="<id>"` na raiz da página para ligar a cor da data em `--season`.

## Produtos

- [`/api/v1/products`](/api/v1/products): os produtos.
- [`/api/v1/products/clio`](/api/v1/products/clio): o nome, a sigla, o formato do destaque e as cores de dado.
- [`/api/v1/products/clio/mark.svg?theme=dark`](/api/v1/products/clio/mark.svg?theme=dark): o símbolo, para ícone de app e de aba.

## Ferramentas

- **Contraste:** [`/api/v1/contrast?foreground=ink-muted&background=paper&theme=dark`](/api/v1/contrast?foreground=ink-muted&background=paper&theme=dark). Aceita hex ou nome de token. Todo texto precisa de 4,5:1.
- **Referência em Markdown:** [`/api/v1/reference`](/api/v1/reference) lista as páginas, e `/api/v1/reference/{página}` devolve o Markdown, para agentes e ferramentas. `skill` devolve o SKILL.md.

## Erros

Os erros vêm em JSON, com um código e uma mensagem que diz o que fazer:

```json
{ "error": { "code": "unknown_theme", "message": "Tema desconhecido: \"sepia\". Use um destes: light, dark, light-high-contrast, dark-high-contrast." } }
```

| Status | Quando |
|---|---|
| 400 | Um parâmetro no formato errado: a data, o ano, a cor |
| 404 | Um tema, produto, data ou página que não existe |

## Versões

O `v1` do endereço só muda se a forma das respostas mudar. Os valores mudam com a versão da identidade, que vem em `X-Design-Version` e em cada tema (`version`). O que mudou em cada versão está em [Versões](/doc/versoes).
