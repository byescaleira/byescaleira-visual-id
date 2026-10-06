import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { contrast } from "../src/design/contrast.js";
import { loadDesign } from "../src/design/load.js";
import { activeSeason, easter, periodIn } from "../src/design/seasons.js";
import { resolveTheme, THEME_IDS, themeCss } from "../src/design/themes.js";
import { buildDocs, ORDER } from "../src/site/docs.js";
import { crc32, skillZip } from "../src/site/skill-zip.js";

const root = fileURLToPath(new URL("../../", import.meta.url));
const publicDir = fileURLToPath(new URL("../public/", import.meta.url));
const ds = loadDesign(root);
/** Um dia fixo, sem data especial: 06/10/2026, ao meio-dia em São Paulo. */
const now = () => new Date("2026-10-06T15:00:00Z");
const app = createApp(ds, { publicUrl: "https://design.byescaleira.com", publicDir, now, cache: true });
const get = (path: string, init?: RequestInit) => app.request(path, init);
const season = (id: string) => ds.tokens.seasons.list.find((s) => s.id === id)!;

describe("datas especiais", () => {
  it("calcula o domingo de Páscoa", () => {
    expect(easter(2026)).toBe("2026-04-05");
    expect(easter(2027)).toBe("2027-03-28");
    expect(easter(2030)).toBe("2030-04-21");
  });

  it("conta o carnaval do sábado à Quarta-feira de Cinzas", () => {
    expect(periodIn(season("carnaval"), 2027)).toEqual({ start: "2027-02-06", end: "2027-02-10" });
    expect(new Date("2027-02-06T12:00:00Z").getUTCDay()).toBe(6);
    expect(new Date("2027-02-10T12:00:00Z").getUTCDay()).toBe(3);
  });

  it("acha a data de um dia, inclusive a que vira o ano", () => {
    const list = ds.tokens.seasons.list;
    expect(activeSeason(list, "2026-12-20")?.id).toBe("natal");
    expect(activeSeason(list, "2027-01-03")?.id).toBe("ano-novo");
    expect(activeSeason(list, "2026-12-26")?.id).toBe("ano-novo");
    expect(activeSeason(list, "2026-10-12")?.id).toBe("dia-das-criancas");
    expect(activeSeason(list, "2026-10-06")).toBeNull();
  });

  it("toda cor de data passa 4,5:1 sobre o papel nos dois modos", () => {
    for (const s of ds.tokens.seasons.list) {
      expect(contrast(s.light, "#ffffff")).toBeGreaterThanOrEqual(4.5);
      expect(contrast(s.dark, "#000000")).toBeGreaterThanOrEqual(4.5);
    }
  });
});

describe("temas", () => {
  it("resolve os apelidos e o alto contraste", () => {
    const dark = resolveTheme(ds, { id: "dark", date: "2026-10-06" });
    expect(dark.color.paper).toBe("#000000");
    expect(dark.color.accent).toBe(dark.color.ink);
    const hc = resolveTheme(ds, { id: "light-high-contrast", date: "2026-10-06" });
    expect(hc.color["ink-muted"]).toBe(hc.color.ink);
    expect(hc.color.rule).toBe(hc.color.ink);
  });

  it("todo texto de todo tema passa 4,5:1", () => {
    for (const id of THEME_IDS) {
      const { color } = resolveTheme(ds, { id, date: "2026-10-06" });
      for (const fg of ["ink", "ink-muted", "ink-faint", "warn", "danger", "ok"]) expect(contrast(color[fg]!, color.paper!)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("no alto contraste, a data não aparece", () => {
    expect(resolveTheme(ds, { id: "dark-high-contrast", season: "natal", date: "2026-12-20" }).season).toBeNull();
    expect(ds.css.tokens).toContain(":root:root {");
    expect(ds.css.tokens).toContain("@media not (prefers-contrast: more)");
  });

  it("acrescenta o produto e a data", () => {
    const theme = resolveTheme(ds, { id: "light", product: "clio", season: "auto", date: "2026-12-20" });
    expect(theme.season?.id).toBe("natal");
    expect(theme.color.season).toBe(season("natal").light);
    expect(theme.dataColors.find((c) => c.name === "Sálvia")?.token).toBe("data-salvia");
    expect(themeCss(theme)).toContain("--data-salvia: #33b679;");
  });
});

describe("API", () => {
  it("serve o tokens.json como está", async () => {
    const res = await get("/api/v1/tokens");
    expect(res.status).toBe(200);
    expect(await res.text()).toBe(ds.tokensRaw);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
    expect(res.headers.get("X-Design-Version")).toBe(ds.version);
  });

  it("serve um tema em JSON e em CSS", async () => {
    const json = await (await get("/api/v1/themes/dark?product=clio&season=natal")).json();
    expect(json.color.paper).toBe("#000000");
    expect(json.season.color).toBe(season("natal").dark);
    const css = await get("/api/v1/themes/light-high-contrast.css");
    expect(css.headers.get("Content-Type")).toContain("text/css");
    expect(await css.text()).toContain("--ink-muted: #000000;");
  });

  it("explica o erro com os valores que existem", async () => {
    const theme = await get("/api/v1/themes/sepia");
    expect(theme.status).toBe(404);
    expect((await theme.json()).error.message).toContain("light, dark");
    const date = await get("/api/v1/seasons/current?date=31-12-2026");
    expect(date.status).toBe(400);
    expect((await get("/api/v1/themes/light?season=pascoela")).status).toBe(400);
    const missing = await get("/api/v1/nada");
    expect(missing.status).toBe(404);
    expect((await missing.json()).error.code).toBe("not_found");
  });

  it("dá a data de um dia e a de hoje", async () => {
    expect((await (await get("/api/v1/seasons/current?date=2027-02-08")).json()).season.id).toBe("carnaval");
    expect((await (await get("/api/v1/seasons/current")).json()).season).toBeNull();
  });

  it("confere contraste com token ou hex", async () => {
    const body = await (await get("/api/v1/contrast?foreground=ink-muted&background=%23ffffff")).json();
    expect(body.text).toBe(true);
    expect((await get("/api/v1/contrast?foreground=azul&background=paper")).status).toBe(400);
  });

  it("inverte o símbolo no escuro", async () => {
    const svg = await (await get("/api/v1/products/clio/mark.svg?theme=dark")).text();
    expect(svg).toContain('fill="#ffffff"');
    expect(svg).toContain('stroke="#000000"');
  });

  it("descreve todas as rotas na especificação", async () => {
    const spec = await (await get("/api/openapi.json")).json();
    expect(spec.openapi).toBe("3.1.0");
    expect(Object.keys(spec.paths)).toContain("/api/v1/themes/{theme}");
  });
});

describe("conector MCP", () => {
  const call = async (body: object) => {
    const res = await get("/mcp", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream", Host: "localhost" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, ...body }),
    });
    return res.json();
  };

  it("lista as ferramentas só de leitura", async () => {
    const { result } = await call({ method: "tools/list" });
    const names = result.tools.map((t: { name: string }) => t.name);
    expect(names).toEqual(["design_guide", "design_reference", "design_theme", "design_contrast", "design_find_token", "design_season"]);
    for (const tool of result.tools) expect(tool.annotations.readOnlyHint).toBe(true);
  });

  it("acha o token de um valor solto", async () => {
    const { result } = await call({ method: "tools/call", params: { name: "design_find_token", arguments: { value: "16px" } } });
    expect(result.content[0].text).toContain("space-4");
    const miss = await call({ method: "tools/call", params: { name: "design_find_token", arguments: { value: "#123456" } } });
    expect(miss.result.content[0].text).toContain("não está no design system");
  });
});

describe("site", () => {
  it("toda página da documentação existe e todo link interno leva a uma página", () => {
    const docs = buildDocs(ds);
    for (const slug of ORDER) expect(docs.get(slug), slug).not.toBeNull();
    const pages = new Set(ORDER);
    for (const page of docs.pages) {
      for (const [, slug] of page.html.matchAll(/href="\/doc\/([a-z-]+)/g)) expect(pages.has(slug!), `${page.slug} -> ${slug}`).toBe(true);
    }
  });

  it("a apresentação traz a data do dia e a versão", async () => {
    const html = await (await get("/?data=2026-12-20")).text();
    expect(html).toContain('data-season="natal"');
    expect(html).toContain('class="season-mark"');
    expect(html).not.toContain("{{version}}");
    const plain = await (await get("/")).text();
    expect(plain).not.toContain("data-season");
  });

  it("serve os arquivos de public/ da memória", async () => {
    const css = await get("/assets/site.css");
    expect(css.status).toBe(200);
    expect(css.headers.get("Content-Type")).toContain("text/css");
    expect((await get("/assets/../index.html")).status).toBe(404);
  });

  it("devolve 404 numa página que não existe", async () => {
    expect((await get("/doc/nada")).status).toBe(404);
    expect((await get("/qualquer/coisa")).status).toBe(404);
  });

  it("a skill.zip tem a pasta da skill no topo e os tokens", () => {
    const zip = skillZip(ds);
    const text = new TextDecoder("latin1").decode(zip);
    expect(text).toContain("byescaleira-visual-id/SKILL.md");
    expect(text).toContain("byescaleira-visual-id/assets/tokens.json");
    expect(text).not.toMatch(/PK\x03\x04[\s\S]{26}SKILL\.md/);
    expect(crc32(new TextEncoder().encode("123456789"))).toBe(0xcbf43926);
  });

  it("a descrição da skill cabe no limite de 1.024 caracteres", () => {
    const description = /^description:\s*(.+)$/m.exec(ds.skill)?.[1] ?? "";
    expect(description.length).toBeGreaterThan(0);
    expect(description.length).toBeLessThanOrEqual(1024);
  });
});
