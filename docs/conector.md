# O conector

Um servidor MCP só de leitura, sem login, para o Claude consultar a identidade na hora: as regras, o tema resolvido, a referência, o contraste e o token de um valor.

## Para que serve

A skill ensina as regras. O conector dá os valores na hora e confere o que já está escrito. Use os dois juntos, ou só o conector onde a skill não chega. No app do Claude, por exemplo, o conector funciona em qualquer conversa, sem enviar arquivo.

- **Endereço:** `https://design.byescaleira.com/mcp` (HTTP com streaming, sem sessão).
- **Login:** nenhum. O conector não guarda nada e só lê.
- **Como adicionar:** veja [Adicionar ao Claude](/doc/instalar#o-conector). Os passos foram conferidos em 06/10/2026, no Claude Code 2.1.289 e na documentação oficial do claude.ai.

## Ferramentas

| Ferramenta | O que faz |
|---|---|
| `design_guide` | Devolve a skill: as regras que não mudam e a lista do que conferir. O Claude chama antes de criar algo visual, se a skill não estiver carregada |
| `design_reference` | Uma página da referência em Markdown (`cor`, `web`, `apple`…). Sem página, lista todas |
| `design_theme` | O tema resolvido, em JSON ou CSS, com produto e data especial, como em `/api/v1/themes` |
| `design_contrast` | O contraste de duas cores, em hex ou nome de token |
| `design_find_token` | Diz se um valor solto (`#5c5c5c`, `16px`) é do design system e qual token usar |
| `design_season` | A data especial de um dia, ou nenhuma |

Há também o prompt **aplicar-identidade**: no app do Claude, ele aparece no menu do conector e traz as regras com o pedido que você escrever.

## Exemplos de pedido

- "Revise o CSS deste componente com o conector byescaleira e troque os valores soltos pelos tokens."
- "Qual é a cor de `ink-muted` no tema escuro com alto contraste?"
- "Monte o tema do CLIO em CSS para o Natal."
- "Esse cinza `#666` passa de contraste sobre o papel?"

## Segurança

O conector só lê o design system, que é público. Ele não acessa nada da sua conta nem do seu computador. O que ele devolve são dados do design system: o Claude não trata como ordem.
