import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * O design system lido do repositório, uma vez, ao subir o serviço. A fonte é sempre a mesma do pacote:
 * tokens/tokens.json, products/<id>/<id>.json, web/*.css e a referência da skill. O serviço não guarda valor nenhum.
 */

export type Mode = "light" | "dark";

export interface SolidColor {
  name: string;
  light: string;
  dark: string;
  usage: string;
}

export interface RoleColor {
  name: string;
  alias: string;
  usage: string;
}

export interface TypeStyle {
  name: string;
  family: "sans" | "serif";
  size: number;
  min?: number;
  fluid?: string;
  weight: number;
  lineHeight: number;
  tracking?: number;
  usage: string;
}

export interface Season {
  id: string;
  name: string;
  from?: string;
  to?: string;
  easter?: [number, number];
  light: string;
  dark: string;
  usage: string;
}

export interface Tokens {
  name: string;
  version: string;
  color: {
    themes: Mode[];
    core: SolidColor[];
    roles: RoleColor[];
    signal: SolidColor[];
    highContrast: { usage: string; aliases: Record<string, string> };
  };
  type: {
    base: number;
    families: Record<"sans" | "serif", { name: string; usage: string; web: string; npm: string; googleFonts: string; license: string }>;
    styles: TypeStyle[];
  };
  space: { name: string; value: number; usage: string }[];
  radius: { name: string; value: number; usage: string }[];
  border: { name: string; value: number; usage: string }[];
  shadow: { name: string; web: string; y: number; blur: number; opacity: number; usage: string }[];
  motion: { name: string; ms: number; easing: string; usage: string }[];
  layout: { name: string; web: string; value?: number; usage: string }[];
  seasons: { usage: string; timezone: string; when: string; list: Season[] };
}

export interface Product {
  id: string;
  name: string;
  about?: string;
  wordmark?: string;
  mark?: string;
  markNote?: string;
  expansion?: string[];
  language?: string;
  heroFormat?: { pattern: string; example: string; usage: string };
  dataColors?: { source?: string; meaning?: string; rule?: string; colors: { colorId?: string; name: string; value: string; note?: string }[] };
  /** O SVG do símbolo, lido de products/<id>/. */
  markSvg: string | null;
}

export interface ReferencePage {
  slug: string;
  /** O Markdown como está no repositório. */
  source: string;
}

export interface DesignSystem {
  root: string;
  version: string;
  tokens: Tokens;
  /** O JSON exatamente como está no arquivo, para servir sem reformatar. */
  tokensRaw: string;
  css: { tokens: string; tailwind: string };
  products: Map<string, Product>;
  skill: string;
  reference: Map<string, ReferencePage>;
  changelog: string;
}

const read = (root: string, path: string) => readFileSync(join(root, path), "utf8");

export function loadDesign(root: string): DesignSystem {
  const tokensRaw = read(root, "tokens/tokens.json");
  const tokens = JSON.parse(tokensRaw) as Tokens;

  const products = new Map<string, Product>();
  const productsDir = join(root, "products");
  for (const id of existsSync(productsDir) ? readdirSync(productsDir) : []) {
    const file = join(productsDir, id, `${id}.json`);
    if (!existsSync(file)) continue;
    const data = JSON.parse(readFileSync(file, "utf8")) as Omit<Product, "id" | "markSvg">;
    const markFile = data.mark ? join(productsDir, id, data.mark) : null;
    products.set(id, { ...data, id, markSvg: markFile && existsSync(markFile) ? readFileSync(markFile, "utf8").trim() : null });
  }

  const reference = new Map<string, ReferencePage>();
  const referenceDir = join(root, "skills/byescaleira-visual-id/reference");
  for (const file of readdirSync(referenceDir).filter((f) => f.endsWith(".md")).sort()) {
    const slug = file.replace(/\.md$/, "");
    reference.set(slug, { slug, source: readFileSync(join(referenceDir, file), "utf8") });
  }

  return {
    root,
    version: tokens.version,
    tokens,
    tokensRaw,
    css: { tokens: read(root, "web/tokens.css"), tailwind: read(root, "web/tailwind.css") },
    products,
    skill: read(root, "skills/byescaleira-visual-id/SKILL.md"),
    reference,
    changelog: read(root, "CHANGELOG.md"),
  };
}
