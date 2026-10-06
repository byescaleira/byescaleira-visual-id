#!/usr/bin/env node
/**
 * Gera, a partir de tokens/tokens.json (a fonte única), os tokens da web (CSS e Tailwind) e a tabela de valores
 * em Markdown que as outras plataformas seguem (skills/byescaleira-visual-id/reference/tokens.md).
 *
 *   node scripts/build.mjs           grava os arquivos gerados
 *   node scripts/build.mjs --check   não grava: falha se algum arquivo gerado estiver desatualizado
 *                                    ou se algum texto não passar o contraste mínimo (WCAG AA, 4,5:1)
 *
 * Sem dependências: só Node 20+.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const tokens = JSON.parse(readFileSync(join(root, "tokens/tokens.json"), "utf8"));
const check = process.argv.includes("--check");
const HEADER = "Gerado por scripts/build.mjs a partir de tokens/tokens.json. Não edite à mão.";

// ---------- Cor ----------

const solid = [...tokens.color.core, ...tokens.color.signal];
const roles = tokens.color.roles;
const byName = new Map(solid.map((c) => [c.name, c]));
const resolve = (name, theme) => {
  const role = roles.find((r) => r.name === name);
  if (role) return resolve(role.alias, theme);
  const c = byName.get(name);
  if (!c) throw new Error(`Cor desconhecida: ${name}`);
  return c[theme];
};
const allColors = [...solid.map((c) => c.name), ...roles.map((r) => r.name)];

const camel = (name) => name.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
const pascal = (name) => camel(name).replace(/^./, (c) => c.toUpperCase());
const hex = (h) => h.replace("#", "").toUpperCase();
const rgb = (h) => [0, 2, 4].map((i) => parseInt(hex(h).slice(i, i + 2), 16) / 255);

// ---------- Contraste (WCAG 2.x) ----------

const lum = (h) => {
  const [r, g, b] = rgb(h).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const contrastProblems = [];
for (const theme of tokens.color.themes) {
  // Texto que precisa de 4,5:1: os tons de tinta sobre papel e os sinais sobre papel e sobre o próprio fundo.
  const pairs = [
    ["ink", "paper"],
    ["ink-muted", "paper"],
    ["ink-faint", "paper"],
    ["ink-muted", "sunken"],
    ["on-accent", "accent"],
    ["warn", "paper"],
    ["warn", "warn-wash"],
    ["danger", "paper"],
    ["danger", "danger-wash"],
    ["ok", "paper"],
    ["ok", "ok-wash"],
  ];
  for (const [fg, bg] of pairs) {
    const ratio = contrast(resolve(fg, theme), resolve(bg, theme));
    if (ratio < 4.5) contrastProblems.push(`${fg} sobre ${bg} (${theme}): ${ratio.toFixed(2)}:1, mínimo 4,5:1`);
  }
}

// ---------- Tipografia ----------

const base = tokens.type.base;
const rem = (px) => `${+(px / base).toFixed(4)}rem`;
const styles = tokens.type.styles;
const fluid = (s) => (s.fluid ? `clamp(${rem(s.min)}, ${s.fluid}, ${rem(s.size)})` : rem(s.size));

// ---------- web/tokens.css ----------

function css() {
  const themeVars = (theme) => solid.map((c) => `  --${c.name}: ${c[theme]};`).join("\n");
  const changesInDark = solid.filter((c) => c.light !== c.dark);
  const darkVars = changesInDark.map((c) => `    --${c.name}: ${c.dark};`).join("\n");
  const lines = [
    `/* ${HEADER}`,
    " *",
    " * Preto e branco. A cor só aparece quando informa: sinais (warn, danger, ok) e cores de dado, nunca decoração.",
    " * Interação é tinta: accent, focus e on-accent apontam para ink e paper.",
    " * Tema: segue prefers-color-scheme; data-theme=\"light\" ou \"dark\" na raiz força um deles.",
    " */",
    ":root {",
    themeVars("light"),
    "",
    roles.map((r) => `  --${r.name}: var(--${r.alias});`).join("\n"),
    "",
    `  --sans: ${tokens.type.families.sans.web};`,
    `  --serif: ${tokens.type.families.serif.web};`,
    "",
    // Todo estilo vira --text-<nome> (text-base continua --text-base).
    styles.map((s) => `  --${s.name.startsWith("text-") ? s.name : `text-${s.name}`}: ${fluid(s)};`).join("\n"),
    "",
    tokens.space.map((s) => `  --${s.name}: ${s.value}px;`).join("\n"),
    "",
    tokens.radius.map((r) => `  --${r.name}: ${r.value}px;`).join("\n"),
    tokens.border.map((b) => `  --${b.name}: ${b.value}px;`).join("\n"),
    tokens.shadow.map((s) => `  --${s.name}: ${s.web};`).join("\n"),
    tokens.motion.map((m) => `  --${m.name}: ${m.ms}ms ${m.easing};`).join("\n"),
    tokens.layout.map((l) => `  --${l.name}: ${l.web};`).join("\n"),
    "",
    "  color-scheme: light;",
    "}",
    "",
    "@media (prefers-color-scheme: dark) {",
    "  :root:not([data-theme=\"light\"]) {",
    darkVars,
    "    color-scheme: dark;",
    "  }",
    "}",
    "",
    ":root[data-theme=\"dark\"] {",
    darkVars.replace(/^ {4}/gm, "  "),
    "  color-scheme: dark;",
    "}",
    "",
  ];
  return lines.join("\n");
}

// ---------- web/tailwind.css (Tailwind v4) ----------

function tailwind() {
  return [
    `/* ${HEADER}`,
    " *",
    " * Tailwind v4: importe depois de tokens.css. As cores apontam para as variáveis, então o tema escuro funciona",
    " * sozinho. Use bg-paper, text-ink, border-rule, text-warn, rounded-control… e nada fora destes nomes.",
    " */",
    "@theme inline {",
    "  --color-*: initial;",
    allColors.map((n) => `  --color-${n}: var(--${n});`).join("\n"),
    "  --color-transparent: transparent;",
    "  --color-current: currentColor;",
    "",
    "  --font-*: initial;",
    "  --font-sans: var(--sans);",
    "  --font-serif: var(--serif);",
    "",
    "  --radius-*: initial;",
    tokens.radius.map((r) => `  --radius-${r.name.replace("radius-", "")}: var(--${r.name});`).join("\n"),
    "",
    "  --shadow-*: initial;",
    "  --shadow-pop: var(--shadow-pop);",
    "",
    "  --spacing: 4px;",
    "}",
    "",
  ].join("\n");
}

// ---------- Referência em Markdown (para as plataformas sem código) ----------

function reference() {
  const row = (cells) => `| ${cells.join(" | ")} |`;
  const rgbText = (h) => rgb(h).map((v) => Math.round(v * 255)).join(", ");
  const colorRows = allColors.map((n) => {
    const role = roles.find((r) => r.name === n);
    const light = resolve(n, "light");
    const dark = resolve(n, "dark");
    const usage = (role ?? byName.get(n)).usage;
    return row([`\`${n}\``, `\`${light}\` (${rgbText(light)})`, `\`${dark}\` (${rgbText(dark)})`, role ? `= \`${role.alias}\`. ${usage}` : usage]);
  });
  const ratio = (fg, bg, theme) => contrast(resolve(fg, theme), resolve(bg, theme)).toFixed(1).replace(".", ",");
  const contrastRows = ["ink-muted", "ink-faint", "warn", "danger", "ok"].map((n) =>
    row([`\`${n}\` sobre \`paper\``, `${ratio(n, "paper", "light")}:1`, `${ratio(n, "paper", "dark")}:1`]),
  );
  const pt = (px) => +(px * 0.75).toFixed(1);
  const typeRows = styles.map((s) =>
    row([
      `\`${s.name}\``,
      tokens.type.families[s.family].name,
      s.min ? `${s.min}–${s.size}` : `${s.size}`,
      `${pt(s.min ?? s.size)}${s.min ? `–${pt(s.size)}` : ""}`,
      `${s.weight}`,
      `${s.lineHeight}`,
      s.tracking ? `${s.tracking}em` : "0",
      s.usage,
    ]),
  );
  return [
    `<!-- ${HEADER} -->`,
    "",
    "# Tokens: os valores",
    "",
    "Todos os valores da identidade visual, para aplicar em qualquer plataforma. Na web, use as variáveis de `web/tokens.css` em vez de copiar os números. Nas outras plataformas, crie os recursos nativos (cores com variante clara e escura, estilos de texto, espaços) **com estes nomes e estes valores**, nada além.",
    "",
    "## Cor",
    "",
    "Cada cor tem o valor do tema claro e do escuro. O escuro é o mesmo sistema invertido: `paper` e `ink` trocam de lugar e os sinais clareiam.",
    "",
    row(["Token", "Claro", "Escuro", "Uso"]),
    row(["---", "---", "---", "---"]),
    ...colorRows,
    "",
    "### Contraste (WCAG)",
    "",
    "`ink` sobre `paper` é 21:1 nos dois temas. O build falha se algum texto ficar abaixo de 4,5:1.",
    "",
    row(["Par", "Claro", "Escuro"]),
    row(["---", "---", "---"]),
    ...contrastRows,
    "",
    "## Tipografia",
    "",
    `- **${tokens.type.families.sans.name}** (\`sans\`): ${tokens.type.families.sans.usage} ${tokens.type.families.sans.license}; Google Fonts \`${tokens.type.families.sans.googleFonts}\`, npm \`${tokens.type.families.sans.npm}\`.`,
    `- **${tokens.type.families.serif.name}** (\`serif\`): ${tokens.type.families.serif.usage} ${tokens.type.families.serif.license}; Google Fonts \`${tokens.type.families.serif.googleFonts}\`, npm \`${tokens.type.families.serif.npm}\`.`,
    "",
    "Tamanhos em px (web, Android em sp, Windows em epx) e em pt (Apple: 1pt = 1px de layout; a coluna pt é para slides e documentos impressos, 1px = 0,75pt). Onde há dois valores, o tamanho é fluido entre o mínimo e o máximo conforme a largura.",
    "",
    row(["Estilo", "Família", "px", "pt (slides)", "Peso", "Entrelinha", "Espaçamento", "Uso"]),
    row(["---", "---", "---", "---", "---", "---", "---", "---"]),
    ...typeRows,
    "",
    "## Espaço",
    "",
    row(["Token", "Valor", "Uso"]),
    row(["---", "---", "---"]),
    ...tokens.space.map((s) => row([`\`${s.name}\``, `${s.value}`, s.usage])),
    "",
    "## Raio",
    "",
    row(["Token", "Valor", "Uso"]),
    row(["---", "---", "---"]),
    ...tokens.radius.map((r) => row([`\`${r.name}\``, r.value >= 999 ? "cápsula (metade da altura)" : `${r.value}`, r.usage])),
    "",
    "## Fio e marcas de dado",
    "",
    row(["Token", "Valor", "Uso"]),
    row(["---", "---", "---"]),
    ...tokens.border.map((b) => row([`\`${b.name}\``, `${b.value}`, b.usage])),
    "",
    "## Sombra",
    "",
    ...tokens.shadow.map((s) => `- \`${s.name}\`: deslocamento ${s.y} para baixo, desfoque ${s.blur}, preto a ${s.opacity * 100}%. ${s.usage}`),
    "",
    "## Movimento",
    "",
    row(["Token", "Duração", "Curva", "Uso"]),
    row(["---", "---", "---", "---"]),
    ...tokens.motion.map((m) => row([`\`${m.name}\``, `${m.ms}ms`, m.easing, m.usage])),
    "",
    "## Layout",
    "",
    row(["Token", "Valor", "Uso"]),
    row(["---", "---", "---"]),
    ...tokens.layout.map((l) => row([`\`${l.name}\``, `\`${l.web}\``, l.usage])),
    "",
  ].join("\n");
}

// ---------- Gravar ou conferir ----------

const outputs = {
  "web/tokens.css": css(),
  "web/tailwind.css": tailwind(),
  "skills/byescaleira-visual-id/reference/tokens.md": reference(),
};

const stale = [];
for (const [path, content] of Object.entries(outputs)) {
  const file = join(root, path);
  const current = existsSync(file) ? readFileSync(file, "utf8") : null;
  if (current === content) continue;
  if (check) stale.push(path);
  else {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, content);
    console.log(`gerado: ${path}`);
  }
}

if (contrastProblems.length > 0) {
  console.error(`Contraste insuficiente:\n- ${contrastProblems.join("\n- ")}`);
  process.exit(1);
}
if (stale.length > 0) {
  console.error(`Arquivos gerados desatualizados (rode node scripts/build.mjs):\n- ${stale.join("\n- ")}`);
  process.exit(1);
}
if (check) console.log("Tokens em dia e contrastes acima de 4,5:1.");
