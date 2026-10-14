// Matching for Select, Combobox, the command menu and list search: case and accent blind, every
// word must match somewhere, results that start with the query rank first. Pure, unit tested.

export const fold = (s: string) => s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLocaleLowerCase();

/** A score for `text` against `query`: -1 means no match, higher is better. */
export function score(text: string, query: string): number {
  const q = fold(query).trim();
  if (!q) return 0;
  const t = fold(text);
  const words = q.split(/\s+/);
  if (!words.every((w) => t.includes(w))) return -1;
  if (t === q) return 100;
  if (t.startsWith(q)) return 80;
  if (t.split(/[\s\-_/.]+/).some((w) => w.startsWith(words[0]))) return 60;
  return 40 - Math.min(30, t.indexOf(words[0]));
}

/** Filter and rank items by query; the original order breaks ties. */
export function search<T>(items: readonly T[], query: string, text: (x: T) => string): T[] {
  if (!query.trim()) return items.slice();
  return items
    .map((x, i) => ({ x, i, s: score(text(x), query) }))
    .filter((r) => r.s >= 0)
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .map((r) => r.x);
}
