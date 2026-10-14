// Board maths for Kanban: where a card is, moving it, keyboard moves, announcements. Pure, tested.

export type Columns<T> = Record<string, readonly T[]>;
export interface Spot { column: string; index: number }

/** Where card `id` sits, or null. */
export function findCard<T>(items: Columns<T>, id: string, getId: (x: T) => string): Spot | null {
  for (const column of Object.keys(items)) {
    const index = items[column].findIndex((x) => getId(x) === id);
    if (index >= 0) return { column, index };
  }
  return null;
}

/** Move card `id` to `toColumn` at `toIndex` (an index in the destination list after removal). Immutable. */
export function moveCard<T>(items: Columns<T>, id: string, toColumn: string, toIndex: number, getId: (x: T) => string): Columns<T> {
  const from = findCard(items, id, getId);
  if (!from || !(toColumn in items)) return items;
  const card = items[from.column][from.index];
  const out: Columns<T> = { ...items, [from.column]: items[from.column].filter((_, i) => i !== from.index) };
  const dest = out[toColumn].slice();
  dest.splice(Math.max(0, Math.min(toIndex, dest.length)), 0, card);
  out[toColumn] = dest;
  return out;
}

/** The spot an arrow key moves a lifted card to. Up and Down move within the column; Left and Right
 * go to the neighbouring column (in `order`, skipping collapsed ones), keeping the row where it can.
 * Returns null when the key does not move it. */
export function keyboardTarget<T>(items: Columns<T>, order: string[], at: Spot, key: string, rtl = false): Spot | null {
  const len = items[at.column]?.length ?? 0;
  if (key === 'ArrowUp') return at.index > 0 ? { ...at, index: at.index - 1 } : null;
  if (key === 'ArrowDown') return at.index < len - 1 ? { ...at, index: at.index + 1 } : null;
  if (key === 'Home') return at.index > 0 ? { ...at, index: 0 } : null;
  if (key === 'End') return at.index < len - 1 ? { ...at, index: len - 1 } : null;
  let step = key === 'ArrowRight' ? 1 : key === 'ArrowLeft' ? -1 : 0;
  if (!step) return null;
  if (rtl) step = -step;
  const c = order.indexOf(at.column) + step;
  if (c < 0 || c >= order.length) return null;
  const column = order[c];
  return { column, index: Math.min(at.index, items[column]?.length ?? 0) };
}

/** Insert index for a pointer at `y` over a column whose cards' vertical midpoints are `mids`. */
export const dropIndex = (mids: number[], y: number) => { const i = mids.findIndex((m) => y < m); return i < 0 ? mids.length : i; };

/** "Column Blocked, position 2 of 4." */
export const spotText = (title: string, index: number, count: number) => `Column ${title}, position ${index + 1} of ${count}.`;
