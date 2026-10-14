// Which page buttons a pager shows: the first, the last, the current with `siblings` either side,
// and 'gap' markers where pages are skipped. Never more than siblings * 2 + 5 slots, so the pager
// does not change width as you page. Pure, unit tested.

export type PageSlot = number | 'gap';

export function pageSlots(current: number, count: number, siblings = 1): PageSlot[] {
  if (count <= 0) return [];
  const c = Math.min(Math.max(1, current), count);
  const total = siblings * 2 + 5;
  if (count <= total) return Array.from({ length: count }, (_, i) => i + 1);
  const left = Math.max(c - siblings, 1), right = Math.min(c + siblings, count);
  const showL = left > 3, showR = right < count - 2;
  if (!showL) return [...Array.from({ length: total - 2 }, (_, i) => i + 1), 'gap', count];
  if (!showR) return [1, 'gap', ...Array.from({ length: total - 2 }, (_, i) => count - (total - 3) + i)];
  return [1, 'gap', ...Array.from({ length: right - left + 1 }, (_, i) => left + i), 'gap', count];
}

/** "Showing 21 to 40 of 312" numbers for a page (1-based). */
export function pageRange(page: number, size: number, total: number): [number, number] {
  if (total <= 0) return [0, 0];
  const from = (page - 1) * size + 1;
  return [Math.min(from, total), Math.min(page * size, total)];
}
