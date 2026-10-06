# syntax=docker/dockerfile:1
# design.byescaleira.com: a apresentação, a documentação, a API e o conector MCP, num processo só.
# Build no contexto da raiz do repositório (deploy/docker-compose.prod.yml: context: ..), porque o serviço lê
# tokens/, products/, skills/, web/, docs/ e CHANGELOG.md, a mesma fonte do pacote.

# ---- deps: lockfile primeiro (cacheia npm ci) ---------------------------------
FROM node:22.23.3-alpine3.24 AS deps
WORKDIR /app/service
COPY service/package.json service/package-lock.json ./
# tsx roda o TypeScript em produção, como no CLIO: as devDependencies entram.
RUN npm ci --no-audit --no-fund

# ---- runtime --------------------------------------------------------------------
FROM node:22.23.3-alpine3.24
RUN apk add --no-cache tini
WORKDIR /app
COPY tokens/ tokens/
COPY products/ products/
COPY skills/ skills/
COPY web/ web/
COPY docs/ docs/
COPY CHANGELOG.md ./
COPY --from=deps /app/service/node_modules service/node_modules
COPY service/ service/
WORKDIR /app/service
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=4200 \
    DESIGN_ROOT=/app
EXPOSE 4200
# Sem estado: nada é gravado, então o container roda como node e sem volume.
USER node
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:4200/api/health || exit 1
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node_modules/.bin/tsx", "src/server.ts"]
