# byescaleira-visual-id

O repositório da identidade visual byescaleira. Este arquivo é para quem **muda** a identidade. Para **aplicar** a identidade num projeto, use a skill em [skills/byescaleira-visual-id/SKILL.md](skills/byescaleira-visual-id/SKILL.md).

## O que é cada coisa

- **`tokens/tokens.json`:** a fonte única. Todo valor (cor nos dois temas, tipografia, espaço, raio, fio, sombra, movimento, layout) mora aqui, com a nota de uso.
- **`scripts/build.mjs`:** gera, a partir do JSON, `web/tokens.css`, `web/tailwind.css` e `skills/byescaleira-visual-id/reference/tokens.md`. Confere o contraste de todo par de texto (4,5:1). Sem dependências: só Node 20+.
- **`skills/byescaleira-visual-id/`:** a skill do Claude Code. `SKILL.md` é a instrução curta e `reference/` é a documentação completa. É também a documentação para pessoas: o README aponta para lá.
- **`products/<produto>/`:** a camada de cada produto (nome, símbolo, cores de dado, formato do destaque).
- **`.claude-plugin/`:** o plugin e o marketplace. O plugin é o repositório inteiro, por isso a skill lê `${CLAUDE_PLUGIN_ROOT}/tokens/tokens.json`.

## Regras

- **Nunca edite um arquivo gerado** (`web/*.css`, `reference/tokens.md`). Edite o JSON e rode `node scripts/build.mjs`.
- **Sem código de plataforma.** Nada de Swift, Kotlin, XAML ou componentes prontos. As plataformas nativas recebem documentação (o que usar do sistema e como mapear os tokens). Na web, só o CSS gerado dos tokens.
- **Toda mudança de regra atualiza a página da referência** que fala do assunto, a `SKILL.md` (se mudar uma das regras que não mudam) e o `CHANGELOG.md`.
- **Repositório público:** nada de dado de cliente, processo, pessoa da equipe ou configuração de escritório. Exemplos sempre inventados.
- **Afirmações sobre plataformas** (APIs do Liquid Glass, Material, WinUI) **só conferidas** nos SDKs ou na documentação oficial. Diga a versão conferida.
- **Documentação em português do Brasil,** voz ativa, frases curtas, sem caixa alta em rótulos. Nomes de token e de API em inglês, como são.

## Antes de commitar

```bash
node scripts/build.mjs --check
claude plugin validate .
```

**Versão:** suba a versão em `package.json`, `.claude-plugin/plugin.json` e `tokens/tokens.json`, e depois crie a tag `vX.Y.Z` (veja [mudar.md](skills/byescaleira-visual-id/reference/mudar.md#versões)).
