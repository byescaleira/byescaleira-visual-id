import { Hono, type Context } from "hono";
import { cors } from "hono/cors";
import { normalizeHex, contrastReport } from "../design/contrast.js";
import type { DesignSystem } from "../design/load.js";
import { activeSeason, isDay, periodIn, today, upcomingSeasons } from "../design/seasons.js";
import { isThemeId, resolveColors, resolveTheme, THEME_IDS, THEME_NAMES, ThemeError, themeCss, themedMark, themeParts } from "../design/themes.js";
import { openApiDocument } from "./openapi.js";

/**
 * A API pública, em /api: só leitura, sem chave, com CORS aberto. Tudo sai do design system carregado ao subir o
 * serviço. Os erros dizem o que aconteceu e quais valores existem, no formato { error: { code, message } }.
 */

export interface ApiOptions {
  publicUrl: string;
  /** O relógio, para os testes fixarem o dia. */
  now?: () => Date;
}

type Status = 400 | 404;
const fail = (c: Context, status: Status, code: string, message: string) => c.json({ error: { code, message } }, status);

export function apiRoutes(ds: DesignSystem, options: ApiOptions) {
  const api = new Hono();
  const tz = ds.tokens.seasons.timezone;
  const now = options.now ?? (() => new Date());
  const seasons = ds.tokens.seasons.list;

  api.use("*", cors({ origin: "*", allowMethods: ["GET", "HEAD", "OPTIONS"] }));
  api.use("*", async (c, next) => {
    await next();
    if (c.res.status === 200 && !c.res.headers.has("Cache-Control")) c.res.headers.set("Cache-Control", "public, max-age=300");
    c.res.headers.set("X-Design-Version", ds.version);
  });

  /** O dia pedido em `date`, ou hoje. Inválido: null, e a rota responde 400. */
  const dayFrom = (c: Context): string | null => {
    const value = c.req.query("date");
    if (value === undefined || value === "") return today(tz, now());
    return isDay(value) ? value : null;
  };
  const badDay = (c: Context) => fail(c, 400, "invalid_date", `Data inválida: "${c.req.query("date")}". Use aaaa-mm-dd, por exemplo 2026-12-20.`);

  const index = (c: Context) =>
    c.json({
      name: "API da identidade visual byescaleira",
      version: ds.version,
      documentation: `${options.publicUrl}/doc/api`,
      openapi: `${options.publicUrl}/api/openapi.json`,
      mcp: `${options.publicUrl}/mcp`,
      links: {
        tokens: "/api/v1/tokens",
        tokensCss: "/api/v1/tokens.css",
        tailwindCss: "/api/v1/tailwind.css",
        themes: "/api/v1/themes",
        products: "/api/v1/products",
        seasons: "/api/v1/seasons",
        contrast: "/api/v1/contrast?foreground=ink-muted&background=paper",
        reference: "/api/v1/reference",
      },
    });

  api.get("/", index);
  api.get("/v1", index);
  api.get("/health", (c) => c.json({ ok: true, version: ds.version }, 200, { "Cache-Control": "no-store" }));
  api.get("/openapi.json", (c) => c.json(openApiDocument(ds, options.publicUrl)));

  // ---------- Tokens ----------

  api.get("/v1/tokens", (c) => c.body(ds.tokensRaw, 200, { "Content-Type": "application/json; charset=utf-8" }));
  api.get("/v1/tokens.css", (c) => c.body(ds.css.tokens, 200, { "Content-Type": "text/css; charset=utf-8" }));
  api.get("/v1/tailwind.css", (c) => c.body(ds.css.tailwind, 200, { "Content-Type": "text/css; charset=utf-8" }));

  // ---------- Temas ----------

  api.get("/v1/themes", (c) => {
    const day = today(tz, now());
    const current = activeSeason(seasons, day);
    return c.json({
      themes: THEME_IDS.map((id) => ({ id, name: THEME_NAMES[id], ...themeParts(id), json: `/api/v1/themes/${id}`, css: `/api/v1/themes/${id}.css` })),
      products: [...ds.products.values()].map((p) => ({ id: p.id, name: p.name, url: `/api/v1/products/${p.id}` })),
      seasons: {
        today: day,
        current: current ? { id: current.id, name: current.name, period: current.period } : null,
        list: seasons.map((s) => ({ id: s.id, name: s.name, url: `/api/v1/seasons/${s.id}` })),
      },
      combine: "/api/v1/themes/{theme}?product={product}&season={season|auto|none}&date={aaaa-mm-dd}",
    });
  });

  api.get("/v1/themes/:theme", (c) => {
    const raw = c.req.param("theme");
    const asCss = raw.endsWith(".css");
    const id = asCss ? raw.slice(0, -4) : raw;
    if (!isThemeId(id)) return fail(c, 404, "unknown_theme", `Tema desconhecido: "${id}". Use um destes: ${THEME_IDS.join(", ")}.`);
    const day = dayFrom(c);
    if (!day) return badDay(c);
    try {
      const theme = resolveTheme(ds, { id, product: c.req.query("product") || undefined, season: c.req.query("season") || "none", date: day });
      if (asCss) return c.body(themeCss(theme), 200, { "Content-Type": "text/css; charset=utf-8" });
      return c.json(theme);
    } catch (error) {
      if (error instanceof ThemeError) return fail(c, error.code === "unknown_season" ? 400 : 404, error.code, error.message);
      throw error;
    }
  });

  // ---------- Produtos ----------

  api.get("/v1/products", (c) =>
    c.json({
      products: [...ds.products.values()].map((p) => ({
        id: p.id,
        name: p.name,
        about: p.about,
        url: `/api/v1/products/${p.id}`,
        mark: p.markSvg ? `/api/v1/products/${p.id}/mark.svg` : null,
      })),
    }),
  );

  const unknownProduct = (c: Context, id: string) => fail(c, 404, "unknown_product", `Produto desconhecido: "${id}". Produtos: ${[...ds.products.keys()].join(", ")}.`);

  api.get("/v1/products/:id", (c) => {
    const product = ds.products.get(c.req.param("id"));
    if (!product) return unknownProduct(c, c.req.param("id"));
    const { markSvg, ...data } = product;
    return c.json({ ...data, markUrl: markSvg ? `/api/v1/products/${product.id}/mark.svg` : null, themes: THEME_IDS.map((t) => `/api/v1/themes/${t}?product=${product.id}`) });
  });

  api.get("/v1/products/:id/mark.svg", (c) => {
    const product = ds.products.get(c.req.param("id"));
    if (!product) return unknownProduct(c, c.req.param("id"));
    if (!product.markSvg) return fail(c, 404, "no_mark", `O produto "${product.id}" não tem símbolo.`);
    const mode = c.req.query("theme") === "dark" ? "dark" : "light";
    return c.body(themedMark(product.markSvg, resolveColors(ds, mode, "normal")), 200, { "Content-Type": "image/svg+xml" });
  });

  // ---------- Datas especiais ----------

  const describe = (s: (typeof seasons)[number], year: number) => ({
    id: s.id,
    name: s.name,
    usage: s.usage,
    color: { light: s.light, dark: s.dark },
    rule: s.easter ? { easter: s.easter } : { from: s.from, to: s.to },
    period: periodIn(s, year),
    css: `:root[data-season="${s.id}"]`,
  });
  /** A data em vigor, com o período que já veio de activeSeason. */
  const describeActive = (s: NonNullable<ReturnType<typeof activeSeason>>) => ({ ...describe(s, Number(s.period.start.slice(0, 4))), period: s.period });

  api.get("/v1/seasons", (c) => {
    const day = dayFrom(c);
    if (!day) return badDay(c);
    const year = Number(day.slice(0, 4));
    const current = activeSeason(seasons, day);
    return c.json({
      usage: ds.tokens.seasons.usage,
      timezone: tz,
      date: day,
      current: current ? describeActive(current) : null,
      upcoming: upcomingSeasons(seasons, day, 3).map((s) => ({ id: s.id, name: s.name, period: s.period })),
      list: seasons.map((s) => describe(s, year)),
    });
  });

  api.get("/v1/seasons/current", (c) => {
    const day = dayFrom(c);
    if (!day) return badDay(c);
    const current = activeSeason(seasons, day);
    return c.json({ date: day, season: current ? describeActive(current) : null });
  });

  api.get("/v1/seasons/:id", (c) => {
    const season = seasons.find((s) => s.id === c.req.param("id"));
    if (!season) return fail(c, 404, "unknown_season", `Data especial desconhecida: "${c.req.param("id")}". Datas: ${seasons.map((s) => s.id).join(", ")}.`);
    const yearText = c.req.query("year");
    const year = yearText ? Number(yearText) : Number(today(tz, now()).slice(0, 4));
    if (!Number.isInteger(year) || year < 1900 || year > 2200) return fail(c, 400, "invalid_year", `Ano inválido: "${yearText}". Use um ano entre 1900 e 2200.`);
    return c.json(describe(season, year));
  });

  // ---------- Ferramentas ----------

  api.get("/v1/contrast", (c) => {
    const themeId = c.req.query("theme") ?? "light";
    if (!isThemeId(themeId)) return fail(c, 400, "unknown_theme", `Tema desconhecido: "${themeId}". Use um destes: ${THEME_IDS.join(", ")}.`);
    const { mode, contrast } = themeParts(themeId);
    const colors = resolveColors(ds, mode, contrast);
    const pick = (name: "foreground" | "background") => {
      const value = c.req.query(name)?.trim() ?? "";
      return colors[value] ?? normalizeHex(value);
    };
    const fg = pick("foreground");
    const bg = pick("background");
    if (!fg || !bg) {
      return fail(c, 400, "invalid_color", "Informe foreground e background como hex (#5c5c5c) ou nome de token (ink-muted, paper).");
    }
    return c.json({ theme: themeId, ...contrastReport(fg, bg), minimum: { text: 4.5, graphic: 3 } });
  });

  // ---------- Referência ----------

  api.get("/v1/reference", (c) =>
    c.json({
      pages: [
        { page: "skill", title: "Skill (SKILL.md)", markdown: "/api/v1/reference/skill", html: "/doc" },
        ...[...ds.reference.values()].map((p) => ({
          page: p.slug,
          title: /^#\s+(.+)$/m.exec(p.source)?.[1] ?? p.slug,
          markdown: `/api/v1/reference/${p.slug}`,
          html: `/doc/${p.slug}`,
        })),
      ],
    }),
  );

  api.get("/v1/reference/:page", (c) => {
    const page = c.req.param("page");
    const source = page === "skill" ? ds.skill : ds.reference.get(page.replace(/\.md$/, ""))?.source;
    if (source === undefined) return fail(c, 404, "unknown_page", `Página desconhecida: "${page}". Páginas: skill, ${[...ds.reference.keys()].join(", ")}.`);
    return c.body(source, 200, { "Content-Type": "text/markdown; charset=utf-8" });
  });

  // Um sub-app montado com app.route não usa o próprio notFound: a rota curinga, por último, responde em JSON.
  api.all("*", (c) => fail(c, 404, "not_found", `Nada em ${c.req.path}. A lista de endereços está em /api/v1 e a documentação em /doc/api.`));

  return api;
}
