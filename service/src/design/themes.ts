import type { DesignSystem, Mode, Product, Season } from "./load.js";
import { slugify } from "../site/markdown.js";
import { activeSeason, type Period } from "./seasons.js";

/**
 * Um tema é o design system resolvido para um caso: o modo (claro ou escuro), o contraste (normal ou alto), o
 * produto (que acrescenta nome, símbolo e cores de dado) e a data especial. Os valores saem todos de tokens.json:
 * aqui só se escolhe a coluna certa e se resolvem os apelidos (accent = ink, focus = ink…).
 */

export const THEME_IDS = ["light", "dark", "light-high-contrast", "dark-high-contrast"] as const;
export type ThemeId = (typeof THEME_IDS)[number];

export const THEME_NAMES: Record<ThemeId, string> = {
  light: "Claro",
  dark: "Escuro",
  "light-high-contrast": "Claro com alto contraste",
  "dark-high-contrast": "Escuro com alto contraste",
};

export const isThemeId = (value: string): value is ThemeId => (THEME_IDS as readonly string[]).includes(value);

export interface ThemeQuery {
  id: ThemeId;
  product?: string | undefined;
  /** O id de uma data, "auto" (a data do dia `date`) ou "none". */
  season?: string | undefined;
  /** O dia, em aaaa-mm-dd, para `season: "auto"`. */
  date: string;
}

export class ThemeError extends Error {
  constructor(
    readonly code: "unknown_theme" | "unknown_product" | "unknown_season",
    message: string,
  ) {
    super(message);
  }
}

export interface ResolvedSeason {
  id: string;
  name: string;
  color: string;
  usage: string;
  period: Period | null;
}

export interface Theme {
  id: ThemeId;
  name: string;
  mode: Mode;
  contrast: "normal" | "more";
  version: string;
  product: { id: string; name: string; wordmark?: string | undefined; heroFormat?: Product["heroFormat"]; markUrl: string | null } | null;
  season: ResolvedSeason | null;
  color: Record<string, string>;
  dataColors: { name: string; token: string; value: string; note?: string | undefined }[];
  type: {
    families: Record<"sans" | "serif", string>;
    styles: Record<string, { family: "sans" | "serif"; px: number; minPx?: number | undefined; css: string; weight: number; lineHeight: number; tracking: string }>;
  };
  space: Record<string, number>;
  radius: Record<string, number>;
  border: Record<string, number>;
  shadow: Record<string, string>;
  motion: Record<string, { ms: number; easing: string }>;
  layout: Record<string, string>;
}

export function themeParts(id: ThemeId): { mode: Mode; contrast: "normal" | "more" } {
  return { mode: id.startsWith("dark") ? "dark" : "light", contrast: id.endsWith("high-contrast") ? "more" : "normal" };
}

/** As cores de um modo, com os apelidos resolvidos e, no alto contraste, os cinzas e os fios em tinta. */
export function resolveColors(ds: DesignSystem, mode: Mode, contrast: "normal" | "more"): Record<string, string> {
  const { core, signal, roles, highContrast } = ds.tokens.color;
  const solid = new Map([...core, ...signal].map((c) => [c.name, c[mode]]));
  if (contrast === "more") for (const [name, alias] of Object.entries(highContrast.aliases)) solid.set(name, solid.get(alias)!);
  const out: Record<string, string> = Object.fromEntries(solid);
  for (const role of roles) out[role.name] = solid.get(role.alias)!;
  return out;
}

/** No alto contraste, a data não aparece (reference/datas.md): o id ainda é conferido, mas o tema vem sem ela. */
export function resolveSeason(ds: DesignSystem, mode: Mode, contrast: "normal" | "more", season: string | undefined, date: string): ResolvedSeason | null {
  if (!season || season === "none") return null;
  const list = ds.tokens.seasons.list;
  let found: (Season & { period?: Period }) | null;
  if (season === "auto") found = activeSeason(list, date);
  else {
    found = list.find((s) => s.id === season) ?? null;
    if (!found) throw new ThemeError("unknown_season", `Data especial desconhecida: "${season}". Use auto, none ou uma destas: ${list.map((s) => s.id).join(", ")}.`);
  }
  if (!found || contrast === "more") return null;
  return { id: found.id, name: found.name, color: found[mode], usage: found.usage, period: found.period ?? null };
}

const rem = (px: number, base: number) => `${+(px / base).toFixed(4)}rem`;

export function resolveTheme(ds: DesignSystem, query: ThemeQuery): Theme {
  const { mode, contrast } = themeParts(query.id);
  const product = query.product ? ds.products.get(query.product) : undefined;
  if (query.product && !product) {
    throw new ThemeError("unknown_product", `Produto desconhecido: "${query.product}". Produtos: ${[...ds.products.keys()].join(", ")}.`);
  }
  const season = resolveSeason(ds, mode, contrast, query.season, query.date);
  const color = resolveColors(ds, mode, contrast);
  if (season) color.season = season.color;

  const t = ds.tokens;
  const base = t.type.base;
  const styles: Theme["type"]["styles"] = {};
  for (const s of t.type.styles) {
    styles[s.name] = {
      family: s.family,
      px: s.size,
      minPx: s.min,
      css: s.fluid ? `clamp(${rem(s.min!, base)}, ${s.fluid}, ${rem(s.size, base)})` : rem(s.size, base),
      weight: s.weight,
      lineHeight: s.lineHeight,
      tracking: s.tracking ? `${s.tracking}em` : "0",
    };
  }

  return {
    id: query.id,
    name: THEME_NAMES[query.id],
    mode,
    contrast,
    version: ds.version,
    product: product
      ? { id: product.id, name: product.name, wordmark: product.wordmark, heroFormat: product.heroFormat, markUrl: product.markSvg ? `/api/v1/products/${product.id}/mark.svg?theme=${mode}` : null }
      : null,
    season,
    color,
    dataColors: (product?.dataColors?.colors ?? []).map((c) => ({ name: c.name, token: `data-${slugify(c.name)}`, value: c.value, note: c.note })),
    type: { families: { sans: t.type.families.sans.web, serif: t.type.families.serif.web }, styles },
    space: Object.fromEntries(t.space.map((s) => [s.name, s.value])),
    radius: Object.fromEntries(t.radius.map((r) => [r.name, r.value])),
    border: Object.fromEntries(t.border.map((b) => [b.name, b.value])),
    shadow: Object.fromEntries(t.shadow.map((s) => [s.name, s.web])),
    motion: Object.fromEntries(t.motion.map((m) => [m.name, { ms: m.ms, easing: m.easing }])),
    layout: Object.fromEntries(t.layout.map((l) => [l.name, l.web])),
  };
}

/** O tema como variáveis CSS num `:root` só, já resolvidas: para quem quer um tema fixo, sem media queries. */
export function themeCss(theme: Theme): string {
  const styleVar = (name: string) => (name.startsWith("text-") ? name : `text-${name}`);
  const lines = [
    `/* byescaleira ${theme.version}, tema ${theme.id}${theme.product ? `, produto ${theme.product.id}` : ""}${theme.season ? `, data ${theme.season.id}` : ""}. Gerado pela API a partir de tokens/tokens.json. */`,
    ":root {",
    ...Object.entries(theme.color).map(([n, v]) => `  --${n}: ${v};`),
    ...theme.dataColors.map((c) => `  --${c.token}: ${c.value};`),
    "",
    `  --sans: ${theme.type.families.sans};`,
    `  --serif: ${theme.type.families.serif};`,
    ...Object.entries(theme.type.styles).map(([n, s]) => `  --${styleVar(n)}: ${s.css};`),
    "",
    ...Object.entries(theme.space).map(([n, v]) => `  --${n}: ${v}px;`),
    ...Object.entries(theme.radius).map(([n, v]) => `  --${n}: ${v}px;`),
    ...Object.entries(theme.border).map(([n, v]) => `  --${n}: ${v}px;`),
    ...Object.entries(theme.shadow).map(([n, v]) => `  --${n}: ${v};`),
    ...Object.entries(theme.motion).map(([n, m]) => `  --${n}: ${m.ms}ms ${m.easing};`),
    ...Object.entries(theme.layout).map(([n, v]) => `  --${n}: ${v};`),
    "",
    `  color-scheme: ${theme.mode};`,
    "}",
    "",
  ];
  return lines.join("\n");
}

/** O símbolo do produto no modo pedido: no escuro, o quadrado continua ink, ou seja, fica claro, e o sinal escuro. */
export function themedMark(svg: string, colors: Record<string, string>): string {
  return svg.replace(/fill="#000(000)?"/gi, `fill="${colors.ink}"`).replace(/stroke="#fff(fff)?"/gi, `stroke="${colors.paper}"`);
}
