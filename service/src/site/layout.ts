import { escape } from "./markdown.js";

/**
 * A moldura das páginas do site: cabeçalho, barra do topo e a data especial. A apresentação (/) tem o próprio HTML,
 * em public/index.html, mas usa as mesmas peças (seasonAttrs, seasonMark) para a data.
 */

export interface SeasonMark {
  id: string;
  name: string;
}

/** O atributo da raiz que liga a cor da data (--season, em web/tokens.css). */
export const seasonAttrs = (season: SeasonMark | null) => (season ? ` data-season="${escape(season.id)}"` : "");

/** O fio de 3px no topo e o ponto de 8px com o nome da data, na barra do topo. Sempre com o nome escrito. */
export const seasonBand = (season: SeasonMark | null) => (season ? '<div class="season-band" aria-hidden="true"></div>' : "");
export const seasonMark = (season: SeasonMark | null) =>
  season ? `<span class="season-mark" title="Data especial"><span class="season-dot" aria-hidden="true"></span>${escape(season.name)}</span>` : "";

const ICON_SEARCH = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>';

export function head(opts: { title: string; description: string; publicUrl: string; path: string; version: string }) {
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(opts.title)}</title>
<meta name="description" content="${escape(opts.description)}">
<link rel="canonical" href="${escape(opts.publicUrl + opts.path)}">
<meta property="og:title" content="${escape(opts.title)}">
<meta property="og:description" content="${escape(opts.description)}">
<meta property="og:type" content="website">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400..900&family=Source+Serif+4:opsz,wght@8..60,400..700&display=swap">
<link rel="stylesheet" href="/tokens.css">
<link rel="stylesheet" href="/assets/site.css?v=${escape(opts.version)}">`;
}

export function topbar(opts: { variant: "docs" | "site"; season: SeasonMark | null; path: string }) {
  const current = (href: string) => (opts.path === href || (href !== "/" && opts.path.startsWith(href)) ? ' aria-current="page"' : "");
  const search =
    opts.variant === "docs"
      ? `<label class="search docs-search">
  <span class="sr-only">Buscar na documentação</span>
  ${ICON_SEARCH}
  <input id="doc-search" type="search" placeholder="Buscar na documentação" autocomplete="off">
</label>`
      : "";
  return `<header class="topbar${opts.variant === "docs" ? " topbar-docs" : ""}">
  <a class="brand-link" href="${opts.variant === "docs" ? "/doc" : "/"}"><span class="brand">byescaleira</span>${opts.variant === "docs" ? '<span class="brand-label">Documentação</span>' : ""}</a>
  ${search}
  <nav class="topnav" aria-label="Site">
    ${seasonMark(opts.season)}
    <a href="/"${current("/")}>Apresentação</a>
    <a href="/doc"${opts.path.startsWith("/doc") && !opts.path.startsWith("/doc/api") && !opts.path.startsWith("/doc/referencia") ? ' aria-current="page"' : ""}>Documentação</a>
    <a href="/doc/api"${opts.path.startsWith("/doc/api") || opts.path.startsWith("/doc/referencia") ? ' aria-current="page"' : ""}>API</a>
    <a class="btn btn-small" href="/#adicionar">Adicionar ao Claude</a>
  </nav>
  ${opts.variant === "docs" ? '<button type="button" class="btn btn-secondary btn-small docs-menu-button" aria-expanded="false" aria-controls="docs-nav">Menu</button>' : ""}
</header>`;
}

export function page(opts: {
  title: string;
  description: string;
  body: string;
  version: string;
  season: SeasonMark | null;
  publicUrl: string;
  path: string;
  variant: "docs" | "site";
  scripts?: string[];
}) {
  return `<!doctype html>
<html lang="pt-BR"${seasonAttrs(opts.season)}>
<head>
${head(opts)}
</head>
<body>
<a class="skip" href="#conteudo">Pular para o conteúdo</a>
${seasonBand(opts.season)}
${topbar({ variant: opts.variant, season: opts.season, path: opts.path })}
${opts.body}
${(opts.scripts ?? []).map((s) => `<script src="${s}?v=${escape(opts.version)}" defer></script>`).join("\n")}
</body>
</html>
`;
}
