# Implantação

Como o serviço de `design.byescaleira.com` roda: um container só, público na internet, sem VPN, sem segredo e sem estado.

## O que o serviço serve

| Endereço | O quê |
|---|---|
| `/` | A apresentação |
| `/doc` | Esta documentação |
| `/api` | A [API](/doc/api), só leitura |
| `/mcp` | O [conector](/doc/conector), só leitura e sem login |
| `/skill.zip` | A skill para enviar ao claude.ai |
| `/tokens.css`, `/llms.txt` | O CSS dos tokens e o índice para agentes |

Tudo sai do repositório: `tokens/`, `products/`, `skills/`, `web/`, `docs/` e `CHANGELOG.md`. O código fica em `service/` e não guarda valor nenhum. Uma mudança na identidade chega ao site quando a imagem é construída de novo.

## Como está montado

- **Container `design-byescaleira`,** construído por `deploy/Dockerfile`, com Node 22. Roda como o usuário `node`, com o sistema de arquivos só de leitura.
- **Rede `vpn_services`,** a mesma do CLIO: o container fica em `10.99.0.30:4200`, sem porta publicada no servidor. Confira se o endereço está livre antes de subir.
- **Caddy no servidor,** com HTTPS e certificado Let's Encrypt, repassando `design.byescaleira.com` para o container. O bloco está em `deploy/caddy-site.Caddyfile`.
- **Sem VPN:** o site é público. Não há dado de cliente, segredo nem login.

## Subir pela primeira vez

1. **No DNS,** aponte `design.byescaleira.com` para o servidor.
2. **No servidor,** no checkout do repositório:

```bash
cp deploy/env.example deploy/.env
docker compose -f deploy/docker-compose.prod.yml --env-file deploy/.env up -d --build
```

3. **No Caddy,** junte o bloco de `deploy/caddy-site.Caddyfile` ao Caddyfile do servidor e recarregue:

```bash
sudo caddy reload --config /etc/caddy/Caddyfile
```

4. **Confira:**

```bash
curl https://design.byescaleira.com/api/health
```

A resposta é `{"ok":true,"version":"…"}`, com a versão do `tokens.json`.

## Variáveis (`deploy/.env`)

| Variável | Para quê | Obrigatória |
|---|---|---|
| `PUBLIC_URL` | O endereço público: links, especificação OpenAPI e o Host aceito em `/mcp` | Sim |
| `MCP_ALLOWED_HOSTS` | Outros nomes aceitos em `/mcp`, separados por vírgula | Não |

O `docker-compose.prod.yml` já define `HOST`, `PORT` e `NODE_ENV=production` (que liga o cache das respostas).

## Atualizar

Depois de uma versão nova (veja [Mudar o design system](/doc/mudar#versoes)):

```bash
git pull
docker compose -f deploy/docker-compose.prod.yml --env-file deploy/.env up -d --build
```

Os endereços dos arquivos do site levam a versão (`site.css?v=1.1.0`): quem abrir a página depois recebe o CSS novo, sem cache velho.

## Rodar localmente

```bash
cd service
npm install
npm run dev
```

O serviço sobe em `http://localhost:4200`, sem cache, e reinicia a cada mudança no código. Para ver uma data especial, acrescente `?data=2026-12-20` ao endereço de qualquer página.

Antes de commitar:

```bash
node scripts/build.mjs --check
cd service && npm run typecheck && npm test
```
