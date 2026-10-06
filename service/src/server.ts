import { fileURLToPath } from "node:url";
import { serve } from "@hono/node-server";
import { createApp } from "./app.js";
import { loadDesign } from "./design/load.js";

/**
 * Sobe design.byescaleira.com. Tudo por variável de ambiente (deploy/env.example):
 *   PORT         padrão 4200
 *   HOST         padrão 127.0.0.1; no container, 0.0.0.0
 *   PUBLIC_URL   o endereço público, para links e para o Host aceito em /mcp
 *   DESIGN_ROOT  a raiz do repositório (tokens/, products/, skills/, web/, docs/); padrão: a deste checkout
 *   MCP_ALLOWED_HOSTS  outros Hosts aceitos em /mcp, separados por vírgula
 *   NODE_ENV     production liga o cache das respostas; fora disso, nada fica em cache
 */
const port = Number(process.env.PORT ?? 4200);
const hostname = process.env.HOST ?? "127.0.0.1";
const publicUrl = (process.env.PUBLIC_URL ?? `http://localhost:${port}`).replace(/\/$/, "");
const root = process.env.DESIGN_ROOT ?? fileURLToPath(new URL("../../", import.meta.url));
const publicDir = fileURLToPath(new URL("../public/", import.meta.url));

const ds = loadDesign(root);
const mcpAllowedHosts = [
  `localhost:${port}`,
  `127.0.0.1:${port}`,
  new URL(publicUrl).host,
  ...(process.env.MCP_ALLOWED_HOSTS ?? "").split(",").map((h) => h.trim()).filter(Boolean),
];

const app = createApp(ds, { publicUrl, publicDir, mcpAllowedHosts, cache: process.env.NODE_ENV === "production" });

serve({ fetch: app.fetch, port, hostname }, () => {
  console.log(`byescaleira ${ds.version} em ${publicUrl} (escutando em ${hostname}:${port})`);
});
