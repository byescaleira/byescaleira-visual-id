# A identidade visual byescaleira

Preto e branco. A cor só aparece quando informa. Esta é a documentação da identidade comum aos produtos byescaleira: as regras, os valores e como aplicá-los em cada lugar.

## O que é

Uma identidade fixa, não um ponto de partida para variações. Ela tem:
- **os tokens:** cada cor (claro, escuro e alto contraste), tamanho de texto, espaço, raio, fio, sombra e movimento, num arquivo só, o [`tokens.json`](https://github.com/byescaleira/byescaleira-visual-id/blob/main/tokens/tokens.json);
- **as regras:** o que fazer e o que nunca fazer, nas páginas desta documentação;
- **a skill do Claude:** as mesmas regras, para o Claude aplicar sozinho em qualquer trabalho visual;
- **a API e o conector:** os tokens servidos na hora, para ferramentas e para o Claude.

Cada produto (o [CLIO](/doc/marca) é o primeiro) usa a identidade com o próprio nome, o próprio símbolo e, se tiver, as próprias cores de dado.

## As cinco regras

1. **Tinta sobre papel.** Fundo branco puro (preto puro no escuro) e texto em tinta.
2. **Interação é tinta.** Não existe cor de marca: o botão principal, a seleção e o foco ficam em tinta cheia.
3. **A cor só informa.** Âmbar para atenção, vermelho para erro, verde para feito, sempre com palavras. A cor de um dado e a de uma data especial aparecem só como marca pequena, com o nome ao lado.
4. **Fios, não caixas.** As áreas se separam por fios de 1px, sem cartões nem sombra.
5. **Um destaque por tela.** Uma peça grande e o resto quieto.

O detalhe de cada uma está em [Princípios](/doc/principios).

## Por onde seguir

| Você quer | Leia |
|---|---|
| Que o Claude aplique a identidade | [Adicionar ao Claude](/doc/instalar) |
| Montar uma página ou um app web | [Web](/doc/web) e [Componentes](/doc/componentes) |
| Fazer slides ou um documento | [Slides](/doc/slides) |
| Montar um app nativo | [Apple](/doc/apple), [Android](/doc/android) ou [Windows](/doc/windows) |
| Ler os valores | [Tokens](/doc/tokens), ou na [API](/doc/api) |
| Propor uma mudança | [Mudar o design system](/doc/mudar) |

## De onde vêm estas páginas

As páginas de Princípios a Windows são a referência da skill: o Claude lê exatamente o mesmo texto. As de instalação, API e conector são do serviço. Tudo vem do repositório [`byescaleira/byescaleira-visual-id`](https://github.com/byescaleira/byescaleira-visual-id), e cada página tem o link para editar no fim.
