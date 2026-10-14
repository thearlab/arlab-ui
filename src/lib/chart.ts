// Scales and paths for the charts, the heatmap and the virtualised table. Pure, unit tested.

/** Round numbers for an axis: 0..max split into about `count` steps (1, 2, 2.5, 5 x 10^n). */
export function niceTicks(max: number, count = 4): number[] {
  if (!(max > 0)) return [0];
  const raw = max / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw)!;
  const top = Math.ceil(max / step) * step;
  return Array.from({ length: Math.round(top / step) + 1 }, (_, i) => +(i * step).toFixed(10));
}

/** Map a domain value onto a pixel range. */
export const linear = (d0: number, d1: number, r0: number, r1: number) => (v: number) => (d1 === d0 ? r0 : r0 + ((v - d0) / (d1 - d0)) * (r1 - r0));

/** Heatmap shade, 0..1, on a square-root scale so small days still show. 0 or less is empty. */
export function shade(v: number | null | undefined, max: number): number {
  if (!v || v <= 0 || !(max > 0)) return 0;
  return Math.min(1, Math.sqrt(v / max));
}

/** A smooth path through points (monotone cubic, so it never overshoots between two values). */
export function smoothPath(pts: Array<[number, number]>): string {
  if (!pts.length) return '';
  if (pts.length === 1) return `M${pts[0][0]},${pts[0][1]}`;
  const n = pts.length, dx: number[] = [], m: number[] = [], t: number[] = [];
  for (let i = 0; i < n - 1; i++) { dx[i] = pts[i + 1][0] - pts[i][0]; m[i] = dx[i] ? (pts[i + 1][1] - pts[i][1]) / dx[i] : 0; }
  t[0] = m[0]; t[n - 1] = m[n - 2];
  for (let i = 1; i < n - 1; i++) t[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (m[i] === 0) { t[i] = 0; t[i + 1] = 0; continue; }
    const a = t[i] / m[i], b = t[i + 1] / m[i], h = a * a + b * b;
    if (h > 9) { const s = 3 / Math.sqrt(h); t[i] = s * a * m[i]; t[i + 1] = s * b * m[i]; }
  }
  let d = `M${r(pts[0][0])},${r(pts[0][1])}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += ` C${r(pts[i][0] + h)},${r(pts[i][1] + t[i] * h)} ${r(pts[i + 1][0] - h)},${r(pts[i + 1][1] - t[i + 1] * h)} ${r(pts[i + 1][0])},${r(pts[i + 1][1])}`;
  }
  return d;
}
const r = (v: number) => Math.round(v * 10) / 10;

/** Which rows of a fixed-height list to render: [start, end) plus spacer heights. */
export function windowRange(scrollTop: number, viewport: number, rowH: number, count: number, overscan = 6) {
  const start = Math.max(0, Math.floor(scrollTop / rowH) - overscan);
  const end = Math.min(count, Math.ceil((scrollTop + viewport) / rowH) + overscan);
  return { start, end, before: start * rowH, after: Math.max(0, (count - end) * rowH) };
}

export type SortDir = 'asc' | 'desc';
/** Stable sort by a value getter; strings compare case and accent blind, numbers numerically, empty last. */
export function sortBy<T>(rows: readonly T[], get: (r: T) => unknown, dir: SortDir = 'asc'): T[] {
  const k = dir === 'asc' ? 1 : -1;
  return rows
    .map((row, i) => ({ row, i, v: get(row) }))
    .sort((a, b) => {
      const ea = a.v === null || a.v === undefined || a.v === '', eb = b.v === null || b.v === undefined || b.v === '';
      if (ea || eb) return ea === eb ? a.i - b.i : ea ? 1 : -1;
      const c = typeof a.v === 'number' && typeof b.v === 'number' ? a.v - b.v
        : a.v instanceof Date && b.v instanceof Date ? a.v.getTime() - b.v.getTime()
        : String(a.v).localeCompare(String(b.v), undefined, { sensitivity: 'base', numeric: true });
      return c * k || a.i - b.i;
    })
    .map((x) => x.row);
}

/** Header checkbox state for a selection. */
export function selectionState(selected: number, total: number): boolean | 'mixed' {
  return selected === 0 ? false : selected >= total ? true : 'mixed';
}
