# Datas especiais

Em algumas datas (Natal, Carnaval, Festa junina…) a tela pode vestir a cor da data. A cor da data informa a data, como um sinal informa um estado: aparece pequena, sempre com o nome ao lado, e some quando o período acaba.

Os períodos e as cores estão em [tokens.md](tokens.md#datas-especiais), gerados de `tokens.json` (`seasons`).

## O que muda

Só duas marcas:
- **um fio de 3px** (`data-rule-width`) na cor da data, no topo da página ou da janela, acima da barra do topo;
- **um ponto de 8px** (`data-dot`) na cor da data, com o nome da data escrito ao lado, na barra do topo, antes da navegação.

## O que não muda

- **O fundo** continua `paper`, e o texto continua `ink`.
- **A interação** continua tinta: o botão principal, a seleção e o foco nunca vestem a cor da data.
- **O destaque, o símbolo e a marca escrita** não mudam.
- **Nada de enfeite:** sem ilustração, emoji, ícone temático, gradiente ou faixa de cor cheia.
- **Os sinais** (`warn`, `danger`, `ok`) continuam como estão, mesmo quando a cor da data é parecida.

## Quando aparece

- **Sozinha, pelo período.** O período é o de `tokens.json`, no fuso de São Paulo. O Carnaval e a Páscoa mudam de dia a cada ano: são contados a partir do domingo de Páscoa. Se dois períodos se cruzam, vale o mais curto.
- **Onde a pessoa está de passagem:** a apresentação, a documentação, a tela inicial de um app.
- **Nunca** em tela de erro, de login, de pagamento ou de ação destrutiva, nem em material impresso, documento ou captura.
- **O produto decide** se usa as datas. Um produto pode desligar todas ou escolher algumas.

## Como aplicar

- **Na web:** ponha `data-season="<id>"` na raiz (`<html>`). O `tokens.css` liga a variável `--season`, nos dois temas. Use `--season` só no fio do topo e no ponto. A data de hoje vem da API (`/api/v1/seasons/current`) ou do próprio código, com os períodos do `tokens.json`.
- **Nos apps:** a mesma coisa, com a cor da data como recurso de cor (variante clara e escura) e o fio e o ponto desenhados no conteúdo, nunca no vidro ou no material do sistema.
- **No alto contraste:** a data não aparece. O sistema pediu menos ruído.

## Acrescentar uma data

1. Escolha a cor, com 4,5:1 sobre `paper` no claro e no escuro. O build confere.
2. Ponha a data em `seasons.list` no `tokens.json`, com o `id`, o `name`, o período (`from` e `to` em MM-DD, ou `easter`) e a nota de uso.
3. Rode `node scripts/build.mjs` e siga [Mudar o design system](mudar.md).
