import { Marked, type Token, type Tokens } from "marked";

/**
 * As páginas da documentação são o Markdown do repositório (a referência da skill e docs/), escrito por nós: não há
 * conteúdo de terceiros. Além do Markdown comum:
 * - avisos no formato do GitHub (`> [!NOTE]`, `> [!IMPORTANT]`, `> [!WARNING]`), que viram os avisos do design system;
 * - links entre páginas (`cor.md#cores-de-dado`) viram links da documentação (`/doc/cor#cores-de-dado`);
 * - links para arquivos do repositório viram links do GitHub.
 */

export interface Heading {
  id: string;
  text: string;
  depth: 2 | 3;
}

export interface RenderedPage {
  title: string;
  lead: string;
  html: string;
  headings: Heading[];
  /** O texto puro, para a busca. */
  text: string;
}

export interface LinkContext {
  /** Os slugs que existem na documentação. */
  pages: Set<string>;
  /** O caminho do arquivo no repositório, para resolver links relativos (ex.: skills/byescaleira-visual-id/reference/cor.md). */
  file: string;
  repoUrl: string;
}

export const escape = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** Âncora legível: sem acento, minúsculas, hífen no lugar de espaço. */
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const plain = (s: string) =>
  s
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\*\*([^*]*)\*\*/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "");

const CALLOUTS: Record<string, string> = { NOTE: "notice", IMPORTANT: "notice", TIP: "notice", WARNING: "notice warn", CAUTION: "notice danger" };

/** Junta um caminho relativo ao diretório do arquivo, como o GitHub faz. */
function joinPath(file: string, href: string): string {
  const parts = file.split("/").slice(0, -1);
  for (const piece of href.split("/")) {
    if (piece === "..") parts.pop();
    else if (piece !== "." && piece !== "") parts.push(piece);
  }
  return parts.join("/");
}

export function resolveHref(href: string, ctx: LinkContext): { href: string; external: boolean } {
  if (/^(https?:|mailto:|claude-cli:)/.test(href)) return { href, external: href.startsWith("http") };
  if (href.startsWith("#")) return { href: `#${slugify(decodeURIComponent(href.slice(1)))}`, external: false };
  if (href.startsWith("/")) return { href, external: false };
  const [path = "", hash] = href.split("#");
  const target = joinPath(ctx.file, path);
  const name = target.split("/").pop()!.replace(/\.md$/, "");
  const anchor = hash ? `#${slugify(decodeURIComponent(hash))}` : "";
  if (target.endsWith(".md") && ctx.pages.has(name)) return { href: `/doc/${name}${anchor}`, external: false };
  if (target === "CHANGELOG.md") return { href: `/doc/versoes${anchor}`, external: false };
  return { href: `${ctx.repoUrl}/blob/main/${target}${hash ? `#${hash}` : ""}`, external: true };
}

function createMarked(headings: Heading[], ctx: LinkContext) {
  const used = new Map<string, number>();
  return new Marked({
    gfm: true,
    renderer: {
      heading({ tokens, depth, text }: Tokens.Heading) {
        const inner = this.parser.parseInline(tokens);
        let id = slugify(plain(text)) || "secao";
        const n = used.get(id) ?? 0;
        used.set(id, n + 1);
        if (n > 0) id = `${id}-${n + 1}`;
        if (depth === 2 || depth === 3) headings.push({ id, text: plain(text), depth });
        return `<h${depth} id="${id}"><a class="doc-anchor" href="#${id}" aria-label="Link para esta seção">#</a>${inner}</h${depth}>\n`;
      },
      code({ text }: Tokens.Code) {
        return `<div class="doc-code"><button type="button" class="doc-copy" data-copy>Copiar</button><pre><code>${escape(text)}</code></pre></div>\n`;
      },
      blockquote({ tokens }: Tokens.Blockquote) {
        const body = this.parser.parse(tokens);
        const m = /^<p>\[!(NOTE|IMPORTANT|TIP|WARNING|CAUTION)\]\s*/.exec(body);
        if (m) return `<div class="${CALLOUTS[m[1]!]} doc-callout"><p>${body.slice(m[0].length)}</div>\n`;
        return `<blockquote>${body}</blockquote>\n`;
      },
      table(token: Tokens.Table) {
        const cell = (c: Tokens.TableCell) => this.parser.parseInline(c.tokens);
        const head = `<tr>${token.header.map((c) => `<th>${cell(c)}</th>`).join("")}</tr>`;
        const body = token.rows.map((r) => `<tr>${r.map((c) => `<td>${cell(c)}</td>`).join("")}</tr>`).join("");
        return `<div class="doc-table"><table><thead>${head}</thead><tbody>${body}</tbody></table></div>\n`;
      },
      link({ href, tokens }: Tokens.Link) {
        const inner = this.parser.parseInline(tokens);
        const target = resolveHref(href, ctx);
        return `<a href="${escape(target.href)}"${target.external ? ' target="_blank" rel="noreferrer"' : ""}>${inner}</a>`;
      },
      html({ text }: Tokens.HTML | Tokens.Tag) {
        // O único HTML das páginas é o aviso de "gerado" no topo de tokens.md: não aparece.
        return /^<!--[\s\S]*-->\s*$/.test(text) ? "" : text;
      },
    },
  });
}

/** Separa o título (o `#`) e o primeiro parágrafo (o resumo) do resto da página. */
export function renderPage(source: string, ctx: LinkContext): RenderedPage {
  const headings: Heading[] = [];
  const marked = createMarked(headings, ctx);
  const tokens = marked.lexer(source);
  const content = tokens.filter((t) => t.type !== "space" && t.type !== "html");
  const first = content[0];
  const title = first?.type === "heading" && (first as Tokens.Heading).depth === 1 ? (first as Tokens.Heading).text : "";
  const second = title ? content[1] : undefined;
  const lead = second?.type === "paragraph" ? (second as Tokens.Paragraph).text : "";
  const skip = new Set<Token>([title ? first! : null, lead ? second! : null].filter((t): t is Token => t !== null));
  const rest = tokens.filter((t) => !skip.has(t)) as Token[] & { links: typeof tokens.links };
  rest.links = tokens.links;
  const html = marked.parser(rest);
  return {
    title: plain(title),
    lead: lead ? marked.parseInline(lead, { async: false }) : "",
    html,
    headings,
    text: plain(source.replace(/<!--[\s\S]*?-->/g, " ").replace(/```[\s\S]*?```/g, " ").replace(/[#>|*-]/g, " ")).replace(/\s+/g, " "),
  };
}
