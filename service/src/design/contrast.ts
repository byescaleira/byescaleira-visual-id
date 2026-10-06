/** Contraste WCAG 2.x, a mesma conta de scripts/build.mjs. */

const HEX = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

export function normalizeHex(value: string): string | null {
  const m = HEX.exec(value.trim());
  if (!m) return null;
  const h = m[1]!.length === 3 ? [...m[1]!].map((c) => c + c).join("") : m[1]!;
  return `#${h.toLowerCase()}`;
}

const channel = (h: string, i: number) => {
  const v = parseInt(h.slice(1 + i * 2, 3 + i * 2), 16) / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};

export const luminance = (h: string) => 0.2126 * channel(h, 0) + 0.7152 * channel(h, 1) + 0.0722 * channel(h, 2);

export function contrast(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p) as [number, number];
  return (x + 0.05) / (y + 0.05);
}

export interface ContrastReport {
  foreground: string;
  background: string;
  ratio: number;
  /** Texto comum: 4,5:1. É o mínimo do design system para todo texto. */
  text: boolean;
  /** Texto grande (24px, ou 18,7px em negrito): 3:1. */
  largeText: boolean;
  /** Marca gráfica e borda de controle: 3:1. */
  graphic: boolean;
}

export function contrastReport(foreground: string, background: string): ContrastReport {
  const ratio = contrast(foreground, background);
  return { foreground, background, ratio: Math.round(ratio * 100) / 100, text: ratio >= 4.5, largeText: ratio >= 3, graphic: ratio >= 3 };
}
