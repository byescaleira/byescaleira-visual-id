# Mudar o design system

Projeto nenhum define cor, raio, sombra, fonte, espaço ou componente próprio. Se algo faltar, a mudança entra primeiro aqui, no repositório `byescaleira/byescaleira-visual-id`, e só então é usada no projeto.

## Quando mudar

- **Falta um token:** por exemplo, um sinal novo com um significado que nenhum dos três cobre. Antes, confira se não é o caso de usar um que já existe.
- **Falta um componente ou um padrão:** um controle que a tela precisa e que não está em [componentes.md](componentes.md).
- **Um produto novo** (veja [Marca e produtos](marca.md)).

Gosto não é motivo. "Ficaria mais bonito com azul" não é.

## Como

1. **Edite `tokens/tokens.json`** (a fonte única) ou a página da referência que descreve a regra.
2. **Rode `node scripts/build.mjs`.** Ele regera `web/tokens.css`, `web/tailwind.css` e `reference/tokens.md`, e falha se algum texto ficar abaixo de 4,5:1 de contraste.
3. **Atualize a página da referência** que fala do assunto e o [CHANGELOG](../../../CHANGELOG.md).
4. **Rode `node scripts/build.mjs --check`.** O CI roda o mesmo.
5. **Abra um pull request** descrevendo o motivo: a tela que precisou e por que nada do que existe serviu.
6. **Ao publicar,** crie a tag da versão (`v1.1.0`). Os projetos atualizam o endereço do pacote para a tag nova.

## Versões

- **Correção:** um valor errado ou um texto.
- **Menor:** um token, um componente ou um produto novos.
- **Maior:** um token renomeado ou removido, ou uma regra que muda o visual que já existe.

Numa versão maior, liste no CHANGELOG o que cada projeto precisa trocar.
