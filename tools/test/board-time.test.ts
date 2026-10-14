import { describe, expect, it } from 'vitest';
import { findCard, moveCard, keyboardTarget, dropIndex, spotText } from '../../src/lib/kanban';
import { layoutDay, minutes } from '../../src/lib/calendar-layout';

const id = (x: { id: string }) => x.id;
const board = { a: [{ id: '1' }, { id: '2' }, { id: '3' }], b: [{ id: '4' }], c: [] as { id: string }[] };

describe('kanban', () => {
  it('finds cards', () => {
    expect(findCard(board, '3', id)).toEqual({ column: 'a', index: 2 });
    expect(findCard(board, 'x', id)).toBeNull();
  });
  it('moves within and across columns immutably', () => {
    expect(moveCard(board, '1', 'a', 2, id).a.map(id)).toEqual(['2', '3', '1']);
    const m = moveCard(board, '2', 'c', 0, id);
    expect(m.a.map(id)).toEqual(['1', '3']);
    expect(m.c.map(id)).toEqual(['2']);
    expect(board.a.length).toBe(3);
    expect(moveCard(board, '4', 'a', 99, id).a.map(id)).toEqual(['1', '2', '3', '4']);
    expect(moveCard(board, 'x', 'a', 0, id)).toBe(board);
    expect(moveCard(board, '1', 'zz', 0, id)).toBe(board);
  });
  it('computes keyboard targets', () => {
    const order = ['a', 'b', 'c'];
    expect(keyboardTarget(board, order, { column: 'a', index: 1 }, 'ArrowUp')).toEqual({ column: 'a', index: 0 });
    expect(keyboardTarget(board, order, { column: 'a', index: 0 }, 'ArrowUp')).toBeNull();
    expect(keyboardTarget(board, order, { column: 'a', index: 2 }, 'ArrowDown')).toBeNull();
    expect(keyboardTarget(board, order, { column: 'a', index: 2 }, 'ArrowRight')).toEqual({ column: 'b', index: 1 });
    expect(keyboardTarget(board, order, { column: 'b', index: 0 }, 'ArrowRight')).toEqual({ column: 'c', index: 0 });
    expect(keyboardTarget(board, order, { column: 'c', index: 0 }, 'ArrowRight')).toBeNull();
    expect(keyboardTarget(board, order, { column: 'b', index: 0 }, 'ArrowRight', true)).toEqual({ column: 'a', index: 0 });
    expect(keyboardTarget(board, order, { column: 'a', index: 2 }, 'Home')).toEqual({ column: 'a', index: 0 });
    expect(keyboardTarget(board, order, { column: 'a', index: 0 }, 'x')).toBeNull();
  });
  it('finds a drop index and says where', () => {
    expect(dropIndex([10, 50, 90], 5)).toBe(0);
    expect(dropIndex([10, 50, 90], 60)).toBe(2);
    expect(dropIndex([10, 50, 90], 100)).toBe(3);
    expect(dropIndex([], 100)).toBe(0);
    expect(spotText('Blocked', 1, 4)).toBe('Column Blocked, position 2 of 4.');
  });
});

describe('week layout', () => {
  it('converts times', () => { expect(minutes('09:30')).toBe(570); });
  it('puts overlapping events in lanes', () => {
    const l = layoutDay([
      { id: 'a', start: '09:00', end: '10:00' },
      { id: 'b', start: '09:30', end: '11:00' },
      { id: 'c', start: '10:00', end: '10:30' },
      { id: 'd', start: '12:00', end: '12:05' },
    ]);
    const by = Object.fromEntries(l.map((x) => [x.id, x]));
    expect(by.a).toMatchObject({ lane: 0, lanes: 2, top: 540, height: 60 });
    expect(by.b).toMatchObject({ lane: 1, lanes: 2 });
    expect(by.c).toMatchObject({ lane: 0, lanes: 2 });
    expect(by.d).toMatchObject({ lane: 0, lanes: 1, height: 15 });
  });
});
