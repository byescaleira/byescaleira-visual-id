import type { DesignSystem } from "../design/load.js";

/**
 * A skill empacotada para o claude.ai e o app do Claude (Personalizar > Skills > enviar arquivo): um ZIP com a pasta
 * da skill no topo (byescaleira-visual-id/SKILL.md), como pede a documentação de skills. Vai junto o que a skill
 * lê fora do plugin: tokens.json, o CSS gerado e os produtos, em assets/.
 *
 * O ZIP é gravado sem compressão (método "store"): os arquivos são pequenos e assim não há dependência nenhuma.
 */

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

export function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of data) crc = CRC_TABLE[(crc ^ byte) & 0xff]! ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

export function zip(files: { path: string; content: string | Uint8Array }[], date = new Date(Date.UTC(2026, 0, 1))): Uint8Array {
  const encoder = new TextEncoder();
  const dosTime = (date.getUTCHours() << 11) | (date.getUTCMinutes() << 5) | Math.floor(date.getUTCSeconds() / 2);
  const dosDate = ((date.getUTCFullYear() - 1980) << 9) | ((date.getUTCMonth() + 1) << 5) | date.getUTCDate();
  const chunks: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;

  for (const file of files) {
    const name = encoder.encode(file.path);
    const data = typeof file.content === "string" ? encoder.encode(file.content) : file.content;
    const crc = crc32(data);

    const local = new DataView(new ArrayBuffer(30));
    local.setUint32(0, 0x04034b50, true);
    local.setUint16(4, 20, true);
    local.setUint16(6, 0x0800, true); // nomes em UTF-8
    local.setUint16(8, 0, true);
    local.setUint16(10, dosTime, true);
    local.setUint16(12, dosDate, true);
    local.setUint32(14, crc, true);
    local.setUint32(18, data.length, true);
    local.setUint32(22, data.length, true);
    local.setUint16(26, name.length, true);
    local.setUint16(28, 0, true);
    chunks.push(new Uint8Array(local.buffer), name, data);

    const entry = new DataView(new ArrayBuffer(46));
    entry.setUint32(0, 0x02014b50, true);
    entry.setUint16(4, 20, true);
    entry.setUint16(6, 20, true);
    entry.setUint16(8, 0x0800, true);
    entry.setUint16(10, 0, true);
    entry.setUint16(12, dosTime, true);
    entry.setUint16(14, dosDate, true);
    entry.setUint32(16, crc, true);
    entry.setUint32(20, data.length, true);
    entry.setUint32(24, data.length, true);
    entry.setUint16(28, name.length, true);
    entry.setUint32(42, offset, true);
    central.push(new Uint8Array(entry.buffer), name);

    offset += 30 + name.length + data.length;
  }

  const centralSize = central.reduce((n, c) => n + c.length, 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true);
  end.setUint16(8, files.length, true);
  end.setUint16(10, files.length, true);
  end.setUint32(12, centralSize, true);
  end.setUint32(16, offset, true);

  const all = [...chunks, ...central, new Uint8Array(end.buffer)];
  const out = new Uint8Array(all.reduce((n, c) => n + c.length, 0));
  let at = 0;
  for (const c of all) {
    out.set(c, at);
    at += c.length;
  }
  return out;
}

export const SKILL_DIR = "byescaleira-visual-id";

export function skillZip(ds: DesignSystem): Uint8Array {
  const files: { path: string; content: string }[] = [
    { path: `${SKILL_DIR}/SKILL.md`, content: ds.skill },
    ...[...ds.reference.values()].map((p) => ({ path: `${SKILL_DIR}/reference/${p.slug}.md`, content: p.source })),
    { path: `${SKILL_DIR}/assets/tokens.json`, content: ds.tokensRaw },
    { path: `${SKILL_DIR}/assets/tokens.css`, content: ds.css.tokens },
    { path: `${SKILL_DIR}/assets/tailwind.css`, content: ds.css.tailwind },
  ];
  for (const product of ds.products.values()) {
    const { markSvg, id, ...data } = product;
    files.push({ path: `${SKILL_DIR}/assets/products/${id}/${id}.json`, content: `${JSON.stringify(data, null, 2)}\n` });
    if (markSvg && data.mark) files.push({ path: `${SKILL_DIR}/assets/products/${id}/${data.mark}`, content: `${markSvg}\n` });
  }
  return zip(files);
}
