import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { operations, TAGS, type Operation } from "../api/openapi.js";
import type { DesignSystem } from "../design/load.js";
import { escape, renderPage, slugify, type Heading, type RenderedPage } from "./markdown.js";
import { page as shell, type SeasonMark } from "./layout.js";

/**
 * A documentação em /doc, no formato de um livro. As páginas vêm de dois lugares do repositório:
 * - a referência da skill (skills/byescaleira-visual-id/reference), que é a mesma documentação que o Claude lê;
 * - docs/, com o que é só do serviço (instalar, API, conector).
 * A "Referência da API" é gerada da especificação OpenAPI, e "Versões" é o CHANGELOG.md.
 */

export const SECTIONS: { title: string; pages: string[] }[] = [
  { title: "Começo", pages: ["introducao", "instalar", "principios"] },
  { title: "Fundamentos", pages: ["cor", "tipografia", "forma", "escrita", "marca", "datas", "tokens"] },
  { title: "Telas", pages: ["componentes", "web", "slides"] },
  { title: "Apps nativos", pages: ["apple", "android", "windows"] },
  { title: "API e conector", pages: ["api", "referencia-da-api", "conector"] },
  { title: "Manutenção", pages: ["mudar", "implantacao", "versoes"] },
];

export const ORDER = SECTIONS.flatMap((s) => s.pages);

export interface DocPage extends RenderedPage {
  slug: string;
  section: string;
  /** O arquivo de origem no repositório, para o link "Editar no GitHub". */
  file: string | null;
}

export interface Docs {
  get(slug: string): DocPage | null;
  pages: DocPage[];
  searchIndex: { slug: string; url: string; title: string; section: string; text: string }[];
}

const REPO_URL = "https://github.com/byescaleira/byescaleira-visual-id";

export function buildDocs(ds: DesignSystem): Docs {
  const pages = new Map<string, DocPage>();
  const slugs = new Set(ORDER);
  const sectionOf = (slug: string) => SECTIONS.find((s) => s.pages.includes(slug))!.title;

  const sourceOf = (slug: string): { source: string; file: string } | null => {
    if (slug === "versoes") return { source: ds.changelog.replace(/^# Mudanças/, "# Versões\n\nO que mudou em cada versão da identidade. A versão está no tokens.json, no package.json e no plugin, e cada uma tem a tag vX.Y.Z no GitHub."), file: "CHANGELOG.md" };
    const ref = ds.reference.get(slug);
    if (ref) return { source: ref.source, file: `skills/byescaleira-visual-id/reference/${slug}.md` };
    const docFile = join(ds.root, "docs", `${slug}.md`);
    if (existsSync(docFile)) return { source: readFileSync(docFile, "utf8"), file: `docs/${slug}.md` };
    return null;
  };

  for (const slug of ORDER) {
    if (slug === "referencia-da-api") {
      pages.set(slug, { ...apiReference(ds), slug, section: sectionOf(slug), file: "service/src/api/openapi.ts" });
      continue;
    }
    const found = sourceOf(slug);
    if (!found) throw new Error(`Página da documentação sem arquivo: ${slug}`);
    const rendered = renderPage(found.source, { pages: slugs, file: found.file, repoUrl: REPO_URL });
    pages.set(slug, { ...rendered, slug, section: sectionOf(slug), file: found.file });
  }

  return {
    get: (slug) => pages.get(slug) ?? null,
    pages: [...pages.values()],
    searchIndex: [...pages.values()].map((p) => ({ slug: p.slug, url: pageUrl(p.slug), title: p.title, section: p.section, text: p.text })),
  };
}

export const pageUrl = (slug: string) => (slug === ORDER[0] ? "/doc" : `/doc/${slug}`);

/** A referência da API, gerada da especificação: uma seção por grupo, uma por operação, cada uma com "Testar". */
function apiReference(ds: DesignSystem): RenderedPage {
  const ops = operations(ds);
  const headings: Heading[] = [];
  const parts: string[] = [];
  for (const tag of TAGS) {
    const inTag = ops.filter((o) => o.tag === tag.name);
    if (!inTag.length) continue;
    const tagId = slugify(tag.name);
    headings.push({ id: tagId, text: tag.name, depth: 2 });
    parts.push(`<h2 id="${tagId}"><a class="doc-anchor" href="#${tagId}" aria-label="Link para esta seção">#</a>${escape(tag.name)}</h2>`, `<p>${escape(tag.description)}</p>`);
    for (const op of inTag) {
      headings.push({ id: op.id, text: op.summary, depth: 3 });
      parts.push(operationHtml(op));
    }
  }
  return {
    title: "Referência da API",
    lead: "Cada endereço da API, com os parâmetros e um exemplo que você testa aqui mesmo. A mesma coisa, para ferramentas, está em <a href=\"/api/openapi.json\">/api/openapi.json</a> (OpenAPI 3.1).",
    html: parts.join("\n"),
    headings,
    text: ops.map((o) => `${o.summary} ${o.path} ${o.description} ${o.params.map((p) => `${p.name} ${p.description}`).join(" ")}`).join(" "),
  };
}

function operationHtml(op: Operation): string {
  const code = (s: string) => `<code>${escape(s)}</code>`;
  const inline = (s: string) => escape(s).replace(/`([^`]+)`/g, "<code>$1</code>");
  const params = op.params.length
    ? `<div class="doc-table"><table><thead><tr><th>Parâmetro</th><th>Onde</th><th>O quê</th></tr></thead><tbody>${op.params
        .map(
          (p) =>
            `<tr><td>${code(p.name)}${p.required || p.in === "path" ? " <span class=\"tag\">obrigatório</span>" : ""}</td><td>${p.in === "path" ? "caminho" : "consulta"}</td><td>${inline(p.description)}${
              p.enum ? `<br><span class="muted">Valores: ${p.enum.map(code).join(", ")}</span>` : ""
            }</td></tr>`,
        )
        .join("")}</tbody></table></div>`
    : "";
  const responses = `<ul class="api-responses">${op.responses
    .map((r) => `<li><span class="tag">${r.status}</span><span>${code(r.type)}: ${inline(r.description)}</span></li>`)
    .join("")}</ul>`;
  return `<section class="api-op" aria-labelledby="${op.id}">
<h3 id="${op.id}"><a class="doc-anchor" href="#${op.id}" aria-label="Link para esta seção">#</a>${escape(op.summary)}</h3>
<p class="api-path"><span class="tag tag-ink">GET</span> ${code(op.path)}</p>
<p>${inline(op.description)}</p>
${params}
${responses}
<div class="api-try" data-try>
  <label class="api-try-label" for="try-${op.id}">Testar</label>
  <div class="api-try-row">
    <input id="try-${op.id}" class="field-input" type="text" value="${escape(op.example)}" spellcheck="false" autocomplete="off">
    <button type="button" class="btn" data-try-run>Enviar</button>
  </div>
  <div class="api-try-result" data-try-result hidden></div>
</div>
</section>`;
}

/** A página completa da documentação, com o menu, o artigo e o "Nesta página". */
export function docHtml(docs: Docs, slug: string, ctx: { version: string; season: SeasonMark | null; publicUrl: string }): { status: 200 | 404; html: string } {
  const doc = docs.get(slug);
  const index = ORDER.indexOf(slug);
  const prev = index > 0 ? docs.get(ORDER[index - 1]!) : null;
  const next = index >= 0 && index < ORDER.length - 1 ? docs.get(ORDER[index + 1]!) : null;

  const nav = SECTIONS.map(
    (section) => `<section class="docs-nav-section"><h2>${escape(section.title)}</h2><ul>${section.pages
      .map((s) => {
        const p = docs.get(s)!;
        return `<li><a href="${pageUrl(s)}"${s === slug ? ' aria-current="page"' : ""}>${escape(p.title)}</a></li>`;
      })
      .join("")}</ul></section>`,
  ).join("");

  const toc =
    doc && doc.headings.length > 0
      ? `<aside class="docs-toc" aria-label="Nesta página"><h2>Nesta página</h2><ul>${doc.headings
          .map((h) => `<li data-depth="${h.depth}"><a href="#${h.id}">${escape(h.text)}</a></li>`)
          .join("")}</ul></aside>`
      : "";

  const article = doc
    ? `<article class="doc-article">
  <p class="doc-section">${escape(doc.section)}</p>
  <h1>${escape(doc.title)}</h1>
  ${doc.lead ? `<p class="doc-lead">${doc.lead}</p>` : ""}
  <div class="doc-content">${doc.html}</div>
  <footer class="doc-foot">
    ${doc.file ? `<a href="${REPO_URL}/blob/main/${doc.file}" target="_blank" rel="noreferrer">Editar esta página no GitHub</a>` : ""}
  </footer>
  <nav class="doc-pager" aria-label="Outras páginas">
    ${prev ? `<a href="${pageUrl(prev.slug)}" class="doc-pager-prev"><span>Anterior</span>${escape(prev.title)}</a>` : "<span></span>"}
    ${next ? `<a href="${pageUrl(next.slug)}" class="doc-pager-next"><span>Próxima</span>${escape(next.title)}</a>` : ""}
  </nav>
</article>`
    : `<article class="doc-article">
  <h1>Página não encontrada</h1>
  <p class="doc-lead">Este endereço não tem página na documentação. Escolha uma no menu, busque acima ou volte ao começo.</p>
  <p><a class="btn" href="/doc">Ir para o começo</a></p>
</article>`;

  const body = `<div class="docs">
<div class="docs-body">
  <nav id="docs-nav" class="docs-nav" aria-label="Páginas da documentação">
    <div class="docs-results" id="docs-results" hidden aria-live="polite"></div>
    <div id="docs-sections">${nav}</div>
  </nav>
  <main class="docs-main" id="conteudo">${article}</main>
  ${toc}
</div>
</div>`;

  const title = doc ? `${doc.title} | Documentação byescaleira` : "Página não encontrada | Documentação byescaleira";
  return {
    status: doc ? 200 : 404,
    html: shell({
      title,
      description: doc ? plainLead(doc.lead) : "Página não encontrada.",
      body,
      version: ctx.version,
      season: ctx.season,
      publicUrl: ctx.publicUrl,
      path: pageUrl(slug),
      variant: "docs",
      scripts: ["/assets/doc.js"],
    }),
  };
}

const plainLead = (html: string) => html.replace(/<[^>]+>/g, "").slice(0, 200);
