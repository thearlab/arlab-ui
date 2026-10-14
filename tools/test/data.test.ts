import { describe, expect, it } from 'vitest';
import { niceTicks, linear, shade, smoothPath, windowRange, sortBy, selectionState } from '../../src/lib/chart';

describe('chart helpers', () => {
  it('nice ticks', () => {
    expect(niceTicks(8)).toEqual([0, 2, 4, 6, 8]);
    expect(niceTicks(9.3)).toEqual([0, 2.5, 5, 7.5, 10]);
    expect(niceTicks(0)).toEqual([0]);
    expect(niceTicks(1394, 4).at(-1)).toBeGreaterThanOrEqual(1394);
  });
  it('linear and shade', () => {
    expect(linear(0, 10, 0, 100)(5)).toBe(50);
    expect(linear(2, 2, 7, 9)(5)).toBe(7);
    expect(shade(0, 10)).toBe(0);
    expect(shade(null, 10)).toBe(0);
    expect(shade(10, 10)).toBe(1);
    expect(shade(2.5, 10)).toBe(0.5);
    expect(shade(20, 10)).toBe(1);
  });
  it('smooth path', () => {
    expect(smoothPath([])).toBe('');
    expect(smoothPath([[0, 0]])).toBe('M0,0');
    const d = smoothPath([[0, 10], [10, 0], [20, 10]]);
    expect(d.startsWith('M0,10 C')).toBe(true);
    expect(d.match(/C/g)!.length).toBe(2);
  });
  it('window range', () => {
    expect(windowRange(0, 400, 40, 1000, 0)).toEqual({ start: 0, end: 10, before: 0, after: 39600 });
    const w = windowRange(4000, 400, 40, 1000, 2);
    expect(w.start).toBe(98); expect(w.end).toBe(112);
    expect(windowRange(0, 400, 40, 5).end).toBe(5);
  });
  it('sorts stably with empties last', () => {
    const rows = [{ n: 'b', v: 2 }, { n: 'A', v: null }, { n: 'a', v: 10 }, { n: 'c', v: 2 }];
    expect(sortBy(rows, (r) => r.v).map((r) => r.n)).toEqual(['b', 'c', 'a', 'A']);
    expect(sortBy(rows, (r) => r.v, 'desc').map((r) => r.n)).toEqual(['a', 'b', 'c', 'A']);
    expect(sortBy(['item 10', 'item 2'], (x) => x)).toEqual(['item 2', 'item 10']);
  });
  it('selection state', () => {
    expect(selectionState(0, 3)).toBe(false);
    expect(selectionState(2, 3)).toBe('mixed');
    expect(selectionState(3, 3)).toBe(true);
  });
});
