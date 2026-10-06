import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize, sep } from "node:path";
import { Hono } from "hono";
import { apiRoutes } from "./api/routes.js";
import type { DesignSystem } from "./design/load.js";
import { activeSeason, isDay, today } from "./design/seasons.js";
import { handleMcp } from "./mcp/server.js";
import { buildDocs, docHtml, ORDER } from "./site/docs.js";
import { seasonAttrs, seasonBand, seasonMark, type SeasonMark } from "./site/layout.js";
import { escape } from "./site/markdown.js";
import { skillZip, SKILL_DIR } from "./site/skill-zip.js";

/**
 * design.byescaleira.com num processo só:
 *   /           a apresentação (public/index.html)
 *   /doc        a documentação, no formato de um livro
 *   /api        a API pública, só leitura (documentada em /doc/api e /api/openapi.json)
 *   /mcp        o conector da identidade para o Claude, só leitura e sem login
 *   /skill.zip  a skill para enviar ao claude.ai
 */

export interface AppOptions {
  publicUrl: string;
  /** Pasta com index.html e assets/. */
  publicDir: string;
  /** Cabeçalhos Host aceitos em /mcp (proteção contra DNS rebinding). Vazio: sem checagem. */
  mcpAllowedHosts?: string[];
  now?: () => Date;
  /** Fora de produção, nada fica em cache, para cada mudança aparecer na hora. */
  cache?: boolean;
}

const TYPES: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".txt": "text/plain; charset=utf-8",
};

const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src https://fonts.gstatic.com",
  "img-src 'self' data:",
  "connect-src 'self'",
  "base-uri 'none'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

export function createApp(ds: DesignSystem, options: AppOptions) {
  const app = new Hono();
  const now = options.now ?? (() => new Date());
  const tz = ds.tokens.seasons.timezone;
  const docs = buildDocs(ds);
  const zip = skillZip(ds);
  const cache = options.cache ?? true;
  const landingFile = join(options.publicDir, "index.html");
  const landingCached = readFileSync(landingFile, "utf8");
  /** Em produção, a apresentação é lida uma vez; fora dela, a cada pedido, para a edição aparecer na hora. */
  const landing = () => (cache ? landingCached : readFileSync(landingFile, "utf8"));
  const maxAge = (seconds: number) => (cache ? `public, max-age=${seconds}` : "no-store");

  /** A data especial da página: a do dia, ou a de `?data=aaaa-mm-dd` para ver como fica. */
  const seasonFor = (dateParam: string | undefined): SeasonMark | null => {
    const day = dateParam && isDay(dateParam) ? dateParam : today(tz, now());
    const s = activeSeason(ds.tokens.seasons.list, day);
    return s ? { id: s.id, name: s.name } : null;
  };

  app.use("*", async (c, next) => {
    await next();
    c.res.headers.set("X-Content-Type-Options", "nosniff");
    c.res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    if (c.res.headers.get("Content-Type")?.startsWith("text/html")) c.res.headers.set("Content-Security-Policy", CSP);
    if (!cache) c.res.headers.set("Cache-Control", "no-store");
  });

  app.route("/api", apiRoutes(ds, { publicUrl: options.publicUrl, now }));

  app.all("/mcp", (c) => handleMcp(ds, c.req.raw, options.mcpAllowedHosts));

  // ---------- Apresentação ----------

  app.get("/", (c) => {
    const season = seasonFor(c.req.query("data"));
    const html = landing()
      .replace('<html lang="pt-BR">', `<html lang="pt-BR"${seasonAttrs(season)}>`)
      .replace("<!--season-band-->", seasonBand(season))
      .replace("<!--season-mark-->", seasonMark(season))
      .replaceAll("{{version}}", escape(ds.version))
      .replaceAll("{{public-url}}", escape(options.publicUrl));
    return c.html(html, 200, { "Cache-Control": maxAge(300) });
  });

  // ---------- Documentação ----------

  const renderDoc = (slug: string, dateParam: string | undefined) => docHtml(docs, slug, { version: ds.version, season: seasonFor(dateParam), publicUrl: options.publicUrl });

  app.get("/doc", (c) => {
    const { status, html } = renderDoc(ORDER[0]!, c.req.query("data"));
    return c.html(html, status);
  });
  app.get("/doc/search.json", (c) => c.json(docs.searchIndex, 200, { "Cache-Control": "public, max-age=300" }));
  app.get("/doc/:slug", (c) => {
    const slug = c.req.param("slug").replace(/\/$/, "");
    if (slug === ORDER[0]) return c.redirect("/doc", 301);
    const { status, html } = renderDoc(slug, c.req.query("data"));
    return c.html(html, status);
  });

  // ---------- Arquivos ----------

  app.get("/skill.zip", (c) =>
    c.body(zip as Uint8Array<ArrayBuffer>, 200, {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${SKILL_DIR}.zip"`,
      "Cache-Control": "public, max-age=300",
    }),
  );
  app.get("/tokens.css", (c) => c.body(ds.css.tokens, 200, { "Content-Type": "text/css; charset=utf-8", "Cache-Control": "public, max-age=300" }));

  app.get("/llms.txt", (c) =>
    c.text(
      [
        "# Identidade visual byescaleira",
        "",
        "> Preto e branco. A cor só aparece quando informa. Tokens, regras e componentes para aplicar a mesma identidade na web, em slides e nos apps nativos.",
        "",
        "- [Regras (SKILL.md)](/api/v1/reference/skill): o que não muda e como trabalhar",
        "- [Tokens em JSON](/api/v1/tokens): a fonte única dos valores",
        "- [Conector MCP](/mcp): ferramentas só de leitura para o Claude",
        "",
        "## Referência",
        "",
        ...[...ds.reference.keys()].map((slug) => `- [${slug}](/api/v1/reference/${slug})`),
        "",
      ].join("\n"),
    ),
  );
  app.get("/robots.txt", (c) => c.text("User-agent: *\nAllow: /\n"));

  /** O arquivo de public/ pedido, ou null. Em produção, vem da memória: os arquivos não mudam com o serviço no ar. */
  const readPublic = (rel: string): Buffer | null => {
    const file = join(options.publicDir, rel);
    return existsSync(file) && statSync(file).isFile() ? readFileSync(file) : null;
  };
  const publicFiles = new Map<string, Buffer>();
  if (cache) {
    for (const rel of readdirSync(options.publicDir, { recursive: true }) as string[]) {
      if (TYPES[extname(rel)]) publicFiles.set(rel.split(sep).join("/"), readPublic(rel)!);
    }
  }

  app.get("/*", (c) => {
    const rel = normalize(c.req.path).replace(/^[/\\]+/, "").split(sep).join("/");
    if (!rel || rel.includes("..") || !TYPES[extname(rel)]) return c.notFound();
    const body = cache ? publicFiles.get(rel) : readPublic(rel);
    if (!body) return c.notFound();
    return c.body(body as Uint8Array<ArrayBuffer>, 200, { "Content-Type": TYPES[extname(rel)]!, "Cache-Control": maxAge(86400) });
  });

  app.notFound((c) => {
    const { html } = renderDoc("nao-existe", c.req.query("data"));
    return c.html(html.replace("Este endereço não tem página na documentação.", `Não há nada em ${escape(c.req.path)}.`), 404);
  });

  return app;
}

