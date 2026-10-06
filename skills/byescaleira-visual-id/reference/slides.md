# Apresentações de slides

Vale para qualquer ferramenta: Keynote, PowerPoint, Google Slides, um deck em HTML ou o tipo de artifact de slides do Claude. O slide é uma página do design system em 16:9: papel, tinta, fios e uma peça grande.

## Tema

| Elemento | Valor |
|---|---|
| Tamanho | 16:9 (1920×1080) |
| Fundo | `paper`. Deck claro por padrão; escuro (preto puro, texto branco) para sala escura ou palco. Não misture os dois no mesmo deck |
| Texto | `ink`; secundário em `ink-muted` |
| Fonte | Schibsted Grotesk em tudo. Source Serif 4 só em citação longa |
| Margem | 6% da largura (≈ 115px em 1920) em todos os lados |
| Fios | 1px em `rule`, para separar colunas e linhas de tabela |

**Esquema de cores do Office (PowerPoint):**
- **Base:**
  - Escuro 1 = `ink`;
  - Claro 1 = `paper`;
  - Escuro 2 = `ink-muted`;
  - Claro 2 = `sunken`.
- **Destaques:** nenhum vira cor de marca.
  - Destaque 1 = `ink`;
  - Destaque 2 = `ink-muted`;
  - Destaque 3 = `rule-strong`;
  - Destaque 4 = `warn`;
  - Destaque 5 = `danger`;
  - Destaque 6 = `ok`.
- **Hiperlink:** `ink`.
- **Fontes do tema:** Schibsted Grotesk no título e no corpo.

No Keynote e no Google Slides, crie as mesmas cores na paleta personalizada, com os valores de [tokens.md](tokens.md) (tema claro).

## Tamanhos

O texto de slide é lido de longe. Em 1920×1080:

| Papel | Estilo | Tamanho |
|---|---|---|
| Número ou data de destaque | `hero` | 200–280px, peso 700, -0,05em |
| Título de capa | `display` | 120–160px, peso 650, -0,05em, no máximo 12 caracteres por linha |
| Título de slide | `headline` | 64–80px, peso 600, -0,035em |
| Texto | `text-md` | 32–40px, peso 400 |
| Legenda, fonte, rodapé | `text-sm` | 20–24px, `ink-muted` |

Nunca abaixo de 20px.

## Tipos de slide

1. **Capa:**
   - o título em `display`, alinhado à esquerda, na metade de baixo;
   - o nome do produto em `brand` no canto superior esquerdo;
   - a data no canto inferior.
2. **Seção:** uma palavra ou frase curta em `headline`, sozinha.
3. **Ideia:** um título que é a frase da ideia (não um rótulo), mais um apoio de 1 a 3 linhas.
4. **Número:**
   - o número em `hero`;
   - abaixo, o que ele mede, em `text-md`;
   - a fonte em `text-sm`.

   Um número por slide.
5. **Lista:** até 5 itens, em linhas separadas por fio, sem marcadores coloridos. Numere só se for sequência.
6. **Comparação:** duas colunas separadas por um fio vertical, com o título de cada uma em `text-md` 600.
7. **Tabela:** fios horizontais em `rule`, cabeçalho em `ink-muted` `text-sm`, números com algarismos tabulares, alinhados à direita.
8. **Imagem:** captura da interface real, com borda `rule`, em tela cheia ou ao lado do texto. Sem moldura de aparelho colorida.
9. **Fechamento:** a ação ou a pergunta em `headline` e o contato em `text-md`.

## Gráficos

- **Cores:** séries em `ink`, `ink-muted` e `rule-strong`. Destaque o dado que importa em `ink` e o resto em cinza.
- **Sinais:** use as cores de sinal só quando o dado for um sinal (atrasado em `danger`, concluído em `ok`).
- **Rótulos:** direto nas séries, sem legenda separada quando der.
- **Forma:** sem 3D, sem sombra, sem gradiente, sem pizza com mais de 3 fatias.

## Regras

- **Uma ideia por slide,** um destaque por slide.
- **Alinhamento à esquerda.** Centralizado só na capa, se o título for curto.
- **Sem caixa alta,** sem sobretítulo acima do título e sem numeração "01 / 02" se não for sequência.
- **Transição:** nenhuma ou dissolver curto. Animação de entrada só para revelar um passo de uma sequência.
- **Ícones:** de traço, na cor do texto, e só quando ajudam a ler.
- **Dados reais de cliente ou processo nunca aparecem** em slide que sai da empresa. Use exemplos inventados.

## Conferir

- [ ] Fundo `paper` puro e texto `ink`; nenhuma cor fora dos sinais.
- [ ] Nenhum texto abaixo de 20px; margens de 6%.
- [ ] Um destaque por slide.
- [ ] Fontes embutidas ou instaladas na máquina que apresenta: exporte em PDF para conferir.
