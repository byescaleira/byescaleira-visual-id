import type { DesignSystem } from "../design/load.js";
import { THEME_IDS } from "../design/themes.js";

/**
 * A especificação OpenAPI 3.1 da API, servida em /api/openapi.json. É também a fonte da página "Referência da API"
 * na documentação: cada operação aqui vira uma seção lá, com os parâmetros, o exemplo e o botão de testar.
 */

export interface Operation {
  id: string;
  method: "get";
  path: string;
  tag: string;
  summary: string;
  description: string;
  params: { name: string; in: "path" | "query"; required?: boolean; description: string; enum?: string[]; example?: string }[];
  /** Os tipos de resposta, na ordem: o primeiro é o padrão. */
  responses: { status: number; type: string; description: string }[];
  /** Um caminho pronto para testar, com os parâmetros de exemplo. */
  example: string;
}

export const TAGS = [
  { name: "Tokens", description: "O tokens.json inteiro e o CSS gerado dele, como estão no repositório." },
  { name: "Temas", description: "O design system resolvido para um modo, um contraste, um produto e uma data especial." },
  { name: "Produtos", description: "A camada de cada produto: nome, símbolo, cores de dado e formato do destaque." },
  { name: "Datas especiais", description: "Os períodos das datas especiais e a data de um dia." },
  { name: "Ferramentas", description: "Conferências que ajudam a aplicar a identidade." },
  { name: "Referência", description: "As páginas da referência e a skill, em Markdown, para agentes e ferramentas." },
];

const themeParam = (ds: DesignSystem): Operation["params"] => [
  { name: "product", in: "query", description: "Acrescenta a camada de um produto: nome, símbolo e cores de dado.", enum: [...ds.products.keys()] },
  {
    name: "season",
    in: "query",
    description: "A data especial: o id de uma data, `auto` (a data do dia, ou nenhuma) ou `none`. Padrão: `none`.",
    enum: ["none", "auto", ...ds.tokens.seasons.list.map((s) => s.id)],
  },
  { name: "date", in: "query", description: "O dia para `season=auto`, em aaaa-mm-dd. Padrão: hoje, no fuso de São Paulo.", example: "2026-12-20" },
];

export function operations(ds: DesignSystem): Operation[] {
  const json = (description: string) => ({ status: 200, type: "application/json", description });
  const notFound = { status: 404, type: "application/json", description: "Não existe: a mensagem diz quais valores existem." };
  const bad = { status: 400, type: "application/json", description: "Parâmetro inválido: a mensagem diz o formato certo." };
  return [
    {
      id: "getTokens",
      method: "get",
      path: "/api/v1/tokens",
      tag: "Tokens",
      summary: "O tokens.json inteiro",
      description: "A fonte única da identidade, exatamente como está no repositório: cores nos dois temas, alto contraste, tipografia, espaço, raio, fio, sombra, movimento, layout e datas especiais, cada valor com a nota de uso.",
      params: [],
      responses: [json("O arquivo tokens/tokens.json.")],
      example: "/api/v1/tokens",
    },
    {
      id: "getTokensCss",
      method: "get",
      path: "/api/v1/tokens.css",
      tag: "Tokens",
      summary: "As variáveis CSS",
      description: "O web/tokens.css: claro e escuro pela preferência do sistema, alto contraste por `prefers-contrast` e as datas por `data-season`. É o mesmo arquivo do pacote npm.",
      params: [],
      responses: [{ status: 200, type: "text/css", description: "O web/tokens.css." }],
      example: "/api/v1/tokens.css",
    },
    {
      id: "getTailwindCss",
      method: "get",
      path: "/api/v1/tailwind.css",
      tag: "Tokens",
      summary: "O tema do Tailwind v4",
      description: "O web/tailwind.css, para importar depois do tokens.css. Desliga a paleta padrão do Tailwind.",
      params: [],
      responses: [{ status: 200, type: "text/css", description: "O web/tailwind.css." }],
      example: "/api/v1/tailwind.css",
    },
    {
      id: "listThemes",
      method: "get",
      path: "/api/v1/themes",
      tag: "Temas",
      summary: "Os temas, os produtos e as datas",
      description: "O que dá para combinar: os quatro temas (claro, escuro e os dois com alto contraste), os produtos e as datas especiais, com a data de hoje.",
      params: [],
      responses: [json("A lista, com o endereço de cada tema em JSON e em CSS.")],
      example: "/api/v1/themes",
    },
    {
      id: "getTheme",
      method: "get",
      path: "/api/v1/themes/{theme}",
      tag: "Temas",
      summary: "Um tema resolvido",
      description:
        "Todos os tokens com os valores do tema, já resolvidos: `accent` vira a cor de `ink`, no alto contraste os cinzas e os fios viram tinta, o produto acrescenta as cores de dado (`data-<nome>`) e a data acrescenta `season`. Termine o nome do tema em `.css` para receber as variáveis CSS num `:root` só.",
      params: [
        { name: "theme", in: "path", required: true, description: "O tema. Com `.css` no fim, a resposta é CSS.", enum: [...THEME_IDS, ...THEME_IDS.map((t) => `${t}.css`)], example: "dark" },
        ...themeParam(ds),
      ],
      responses: [json("O tema em JSON."), { status: 200, type: "text/css", description: "O tema em CSS, com o nome terminado em `.css`." }, notFound, bad],
      example: "/api/v1/themes/dark?product=clio&season=natal",
    },
    {
      id: "listProducts",
      method: "get",
      path: "/api/v1/products",
      tag: "Produtos",
      summary: "Os produtos",
      description: "Cada produto que usa a identidade, com o nome e o endereço dos detalhes.",
      params: [],
      responses: [json("A lista de produtos.")],
      example: "/api/v1/products",
    },
    {
      id: "getProduct",
      method: "get",
      path: "/api/v1/products/{product}",
      tag: "Produtos",
      summary: "Um produto",
      description: "O arquivo do produto (products/<id>/<id>.json): nome, marca escrita, sigla por extenso, formato do destaque e cores de dado.",
      params: [{ name: "product", in: "path", required: true, description: "O id do produto.", enum: [...ds.products.keys()], example: "clio" }],
      responses: [json("O produto."), notFound],
      example: "/api/v1/products/clio",
    },
    {
      id: "getProductMark",
      method: "get",
      path: "/api/v1/products/{product}/mark.svg",
      tag: "Produtos",
      summary: "O símbolo do produto",
      description: "O símbolo em SVG, só para ícone de app e de aba. No escuro, o quadrado continua ink, ou seja, fica claro.",
      params: [
        { name: "product", in: "path", required: true, description: "O id do produto.", enum: [...ds.products.keys()], example: "clio" },
        { name: "theme", in: "query", description: "O modo do símbolo. Padrão: `light`.", enum: ["light", "dark"] },
      ],
      responses: [{ status: 200, type: "image/svg+xml", description: "O símbolo." }, notFound],
      example: "/api/v1/products/clio/mark.svg?theme=dark",
    },
    {
      id: "listSeasons",
      method: "get",
      path: "/api/v1/seasons",
      tag: "Datas especiais",
      summary: "As datas especiais",
      description: "Todas as datas, com o período de cada uma no ano do dia pedido, a data em vigor e as próximas.",
      params: [{ name: "date", in: "query", description: "O dia de referência, em aaaa-mm-dd. Padrão: hoje.", example: "2026-12-20" }],
      responses: [json("As datas, a data em vigor e as próximas."), bad],
      example: "/api/v1/seasons",
    },
    {
      id: "getCurrentSeason",
      method: "get",
      path: "/api/v1/seasons/current",
      tag: "Datas especiais",
      summary: "A data especial de um dia",
      description: "A data em vigor no dia pedido, com a cor nos dois modos, ou `null` quando não há nenhuma.",
      params: [{ name: "date", in: "query", description: "O dia, em aaaa-mm-dd. Padrão: hoje, no fuso de São Paulo.", example: "2027-02-08" }],
      responses: [json("A data em vigor, ou null."), bad],
      example: "/api/v1/seasons/current?date=2027-02-08",
    },
    {
      id: "getSeason",
      method: "get",
      path: "/api/v1/seasons/{season}",
      tag: "Datas especiais",
      summary: "Uma data especial",
      description: "Uma data, com o período no ano pedido.",
      params: [
        { name: "season", in: "path", required: true, description: "O id da data.", enum: ds.tokens.seasons.list.map((s) => s.id), example: "carnaval" },
        { name: "year", in: "query", description: "O ano do período. Padrão: o ano de hoje.", example: "2027" },
      ],
      responses: [json("A data e o período."), notFound, bad],
      example: "/api/v1/seasons/carnaval?year=2027",
    },
    {
      id: "checkContrast",
      method: "get",
      path: "/api/v1/contrast",
      tag: "Ferramentas",
      summary: "Conferir o contraste",
      description: "O contraste entre duas cores, pela conta da WCAG 2.x. Aceita hex (`#5c5c5c`) ou nome de token (`ink-muted`), que é resolvido no `theme`. O design system exige 4,5:1 em todo texto.",
      params: [
        { name: "foreground", in: "query", required: true, description: "A cor do texto ou da marca: hex ou nome de token.", example: "ink-muted" },
        { name: "background", in: "query", required: true, description: "A cor do fundo: hex ou nome de token.", example: "paper" },
        { name: "theme", in: "query", description: "O tema em que os nomes de token são resolvidos. Padrão: `light`.", enum: [...THEME_IDS] },
      ],
      responses: [json("A razão e se passa para texto, texto grande e marca gráfica."), bad],
      example: "/api/v1/contrast?foreground=ink-muted&background=paper&theme=dark",
    },
    {
      id: "listReference",
      method: "get",
      path: "/api/v1/reference",
      tag: "Referência",
      summary: "As páginas da referência",
      description: "As páginas da referência da skill, com o endereço do Markdown de cada uma.",
      params: [],
      responses: [json("A lista de páginas.")],
      example: "/api/v1/reference",
    },
    {
      id: "getReferencePage",
      method: "get",
      path: "/api/v1/reference/{page}",
      tag: "Referência",
      summary: "Uma página da referência",
      description: "O Markdown de uma página da referência, como está no repositório. `skill` devolve o SKILL.md.",
      params: [{ name: "page", in: "path", required: true, description: "O nome da página.", enum: ["skill", ...ds.reference.keys()], example: "cor" }],
      responses: [{ status: 200, type: "text/markdown", description: "A página em Markdown." }, notFound],
      example: "/api/v1/reference/cor",
    },
  ];
}

export function openApiDocument(ds: DesignSystem, publicUrl: string) {
  const paths: Record<string, Record<string, unknown>> = {};
  for (const op of operations(ds)) {
    const content = (type: string) =>
      type === "application/json" ? { [type]: { schema: { type: "object" } } } : { [type]: { schema: { type: "string" } } };
    const byStatus = new Map<number, { description: string; content: Record<string, unknown> }>();
    for (const r of op.responses) {
      const hit = byStatus.get(r.status);
      if (hit) Object.assign(hit.content, content(r.type));
      else byStatus.set(r.status, { description: r.description, content: content(r.type) });
    }
    paths[op.path] = {
      [op.method]: {
        operationId: op.id,
        tags: [op.tag],
        summary: op.summary,
        description: op.description,
        parameters: op.params.map((p) => ({
          name: p.name,
          in: p.in,
          required: p.in === "path" ? true : Boolean(p.required),
          description: p.description,
          schema: { type: "string", ...(p.enum ? { enum: p.enum } : {}) },
          ...(p.example ? { example: p.example } : {}),
        })),
        responses: Object.fromEntries([...byStatus].map(([status, r]) => [String(status), r])),
      },
    };
  }
  return {
    openapi: "3.1.0",
    info: {
      title: "API da identidade visual byescaleira",
      version: ds.version,
      description: "Os tokens, os temas, os produtos e as datas especiais da identidade visual byescaleira. Só leitura, pública e sem chave.",
      license: { name: "Todos os direitos reservados" },
    },
    servers: [{ url: publicUrl }],
    tags: TAGS,
    paths,
  };
}
