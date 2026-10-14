import { describe, expect, it } from 'vitest';
import { pageSlots, pageRange } from '../../src/lib/pagination';

describe('pageSlots', () => {
  it('lists every page when few', () => {
    expect(pageSlots(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(pageSlots(3, 0)).toEqual([]);
  });
  it('keeps a fixed width with gaps', () => {
    expect(pageSlots(1, 20)).toEqual([1, 2, 3, 4, 5, 'gap', 20]);
    expect(pageSlots(10, 20)).toEqual([1, 'gap', 9, 10, 11, 'gap', 20]);
    expect(pageSlots(20, 20)).toEqual([1, 'gap', 16, 17, 18, 19, 20]);
    for (const p of [1, 4, 5, 10, 16, 17, 20]) expect(pageSlots(p, 20).length).toBe(7);
    expect(pageSlots(99, 20).at(-1)).toBe(20);
  });
  it('gives the shown range', () => {
    expect(pageRange(2, 20, 312)).toEqual([21, 40]);
    expect(pageRange(16, 20, 312)).toEqual([301, 312]);
    expect(pageRange(1, 20, 0)).toEqual([0, 0]);
  });
});
