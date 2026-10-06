import type { Season } from "./load.js";

/**
 * As datas especiais: em que dias cada uma vale. Os períodos vêm de tokens.json (`seasons.list`): `from` e `to` em
 * MM-DD, que podem virar o ano (o ano-novo vai de 26/12 a 06/01), ou `easter` com os dias contados do domingo de
 * Páscoa (o carnaval vai de -51 a -46). Se dois períodos se cruzam, vale o mais curto.
 */

export interface Period {
  start: string;
  end: string;
}

const iso = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (day: string, n: number) => {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return iso(d);
};
const daysBetween = (a: string, b: string) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000);

/** Domingo de Páscoa no calendário gregoriano (algoritmo de Meeus/Jones/Butcher). */
export function easter(year: number): string {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** O período da data que começa no ano dado. Um período que vira o ano termina no ano seguinte. */
export function periodIn(season: Season, year: number): Period {
  if (season.easter) {
    const sunday = easter(year);
    return { start: addDays(sunday, season.easter[0]), end: addDays(sunday, season.easter[1]) };
  }
  const start = `${year}-${season.from}`;
  const end = `${season.to! < season.from! ? year + 1 : year}-${season.to}`;
  return { start, end };
}

/** A data especial de um dia (aaaa-mm-dd), ou nenhuma. */
export function activeSeason(list: Season[], day: string): (Season & { period: Period }) | null {
  const year = Number(day.slice(0, 4));
  const hits: (Season & { period: Period })[] = [];
  for (const season of list) {
    // O ano anterior pega o período que virou o ano (ano-novo em 02/01).
    for (const y of [year - 1, year]) {
      const period = periodIn(season, y);
      if (period.start <= day && day <= period.end) hits.push({ ...season, period });
    }
  }
  hits.sort((a, b) => daysBetween(a.period.start, a.period.end) - daysBetween(b.period.start, b.period.end));
  return hits[0] ?? null;
}

/** As próximas datas a partir de um dia, na ordem, com o período de cada uma. */
export function upcomingSeasons(list: Season[], day: string, count = list.length): (Season & { period: Period })[] {
  const year = Number(day.slice(0, 4));
  const all = list.flatMap((season) => [year - 1, year, year + 1].map((y) => ({ ...season, period: periodIn(season, y) })));
  return all
    .filter((s) => s.period.end >= day)
    .sort((a, b) => a.period.start.localeCompare(b.period.start))
    .filter((s, i, arr) => arr.findIndex((o) => o.id === s.id) === i)
    .slice(0, count);
}

/** O dia de hoje no fuso das datas (America/Sao_Paulo), em aaaa-mm-dd. */
export function today(timeZone: string, now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

export const isDay = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`)) && iso(new Date(`${value}T00:00:00Z`)) === value;
