import { describe, expect, it } from 'vitest';
import { nextIndex, typeahead, moveItem, shortcutLabel, matchShortcut } from '../../src/lib/keys';
import { place } from '../../src/lib/place';
import { search, score } from '../../src/lib/search';
import { relativeTime, money, plural, bytes, duration, initials, hueIndex, shortDate } from '../../src/lib/format';
import { contrast, mix, readableOn } from '../../src/lib/color';
import { placeTour, tourDue } from '../../src/lib/tourPlace';

describe('nextIndex', () => {
  it('moves and loops', () => {
    expect(nextIndex(0, 'ArrowDown', 3)).toBe(1);
    expect(nextIndex(2, 'ArrowDown', 3)).toBe(0);
    expect(nextIndex(0, 'ArrowUp', 3)).toBe(2);
    expect(nextIndex(2, 'ArrowDown', 3, { loop: false })).toBe(2);
  });
  it('skips disabled items and jumps', () => {
    expect(nextIndex(0, 'ArrowDown', 4, { disabled: (i) => i === 1 })).toBe(2);
    expect(nextIndex(2, 'Home', 4, { disabled: (i) => i === 0 })).toBe(1);
    expect(nextIndex(0, 'End', 4)).toBe(3);
  });
  it('respects orientation and RTL', () => {
    expect(nextIndex(0, 'ArrowRight', 3)).toBeNull();
    expect(nextIndex(0, 'ArrowRight', 3, { orientation: 'horizontal' })).toBe(1);
    expect(nextIndex(0, 'ArrowRight', 3, { orientation: 'horizontal', rtl: true })).toBe(2);
    expect(nextIndex(0, 'x', 3)).toBeNull();
    expect(nextIndex(0, 'ArrowDown', 0)).toBeNull();
  });
});

describe('typeahead and moveItem', () => {
  const labels = ['Apple', 'Banana', 'Blueberry', 'Cherry'];
  it('finds by prefix and cycles a repeated letter', () => {
    expect(typeahead(labels, 'bl', 0)).toBe(2);
    expect(typeahead(labels, 'b', 1)).toBe(2);
    expect(typeahead(labels, 'b', 2)).toBe(1);
    expect(typeahead(labels, 'z', 0)).toBe(-1);
  });
  it('moves items immutably', () => {
    const l = ['a', 'b', 'c'];
    expect(moveItem(l, 0, 2)).toEqual(['b', 'c', 'a']);
    expect(moveItem(l, 2, 0)).toEqual(['c', 'a', 'b']);
    expect(l).toEqual(['a', 'b', 'c']);
    expect(moveItem(l, 5, 0)).toEqual(l);
  });
});

describe('shortcuts', () => {
  it('labels in HIG order', () => {
    expect(shortcutLabel('shift+mod+k', true)).toBe('⇧⌘K');
    expect(shortcutLabel('mod+k', false)).toBe('Ctrl+K');
  });
  it('matches events', () => {
    const e = { key: 'k', metaKey: true, ctrlKey: false, altKey: false, shiftKey: false };
    expect(matchShortcut(e, 'mod+k', true)).toBe(true);
    expect(matchShortcut(e, 'mod+k', false)).toBe(false);
    expect(matchShortcut({ ...e, metaKey: false }, 'k', true)).toBe(true);
  });
});

describe('place', () => {
  const a = { top: 100, left: 100, width: 80, height: 30 };
  it('places below, start aligned', () => {
    const p = place(a, 200, 100, 1000, 800);
    expect(p).toMatchObject({ side: 'bottom', top: 136, left: 100 });
  });
  it('flips when there is no room', () => {
    const low = { ...a, top: 760 };
    expect(place(low, 200, 100, 1000, 800).side).toBe('top');
  });
  it('clamps inside the window', () => {
    const right = { ...a, left: 950 };
    const p = place(right, 200, 100, 1000, 800);
    expect(p.left + 200).toBeLessThanOrEqual(992);
  });
  it('flips start and end in RTL', () => {
    expect(place(a, 200, 100, 1000, 800, 'bottom-start', 6, 8, true).left).toBe(8); // end-aligned (100 + 80 - 200) then clamped to the edge
  });
});

describe('search', () => {
  const items = ['Engineering', 'Creative', 'Client servicing', 'Café menu'];
  it('ranks prefix matches first and ignores case and accents', () => {
    expect(search(items, 'c', (x) => x)).toEqual(['Creative', 'Client servicing', 'Café menu']);
    expect(search(items, 'cafe', (x) => x)).toEqual(['Café menu']);
    expect(search(items, 'serv cli', (x) => x)).toEqual(['Client servicing']);
    expect(search(items, '', (x) => x)).toEqual(items);
    expect(score('abc', 'z')).toBe(-1);
  });
});

describe('format', () => {
  const now = new Date('2026-10-14T12:00:00Z').getTime();
  it('relative time', () => {
    expect(relativeTime(now - 20_000, now)).toBe('just now');
    expect(relativeTime(now - 12 * 60_000, now)).toBe('12 min ago');
    expect(relativeTime(now - 3 * 3600_000, now)).toBe('3 h ago');
    expect(relativeTime(now - 26 * 3600_000, now)).toBe('yesterday');
    expect(relativeTime(now + 3 * 3600_000, now)).toBe('in 3 h');
    expect(relativeTime('nope', now)).toBe('');
    expect(shortDate('2026-09-03', now)).toBe('3 Sep');
  });
  it('numbers and words', () => {
    expect(money(0.004)).toBe('<$0.01');
    expect(money(20.5)).toBe('$20.50');
    expect(plural(1, 'run')).toBe('1 run');
    expect(plural(1394, 'run')).toBe('1,394 runs');
    expect(bytes(1536)).toBe('1.5 KB');
    expect(duration(130)).toBe('2 h 10 m');
    expect(initials('Nadia Fares')).toBe('NF');
    expect(initials('laure@thearlab.com')).toBe('L');
    expect(hueIndex('x')).toBeGreaterThanOrEqual(1);
    expect(hueIndex('x')).toBeLessThanOrEqual(8);
  });
});

describe('color', () => {
  it('computes WCAG contrast', () => {
    expect(contrast('#000000', '#FFFFFF')).toBeCloseTo(21, 0);
    expect(contrast('#777777', '#777777')).toBeCloseTo(1, 5);
    expect(mix('#000000', '#ffffff', 0.5)).toBe('#808080');
    expect(readableOn('#FFFFFF')).toBe('#1C1A2E');
    expect(readableOn('#000000')).toBe('#FFFFFF');
  });
});

describe('tour placement', () => {
  it('docks on phones and respects the preferred side', () => {
    expect(placeTour({ top: 10, left: 10, width: 10, height: 10 }, 300, 100, 390, 800).side).toBe('dock');
    expect(placeTour({ top: 300, left: 100, width: 40, height: 40 }, 300, 100, 1280, 800, 'right').side).toBe('right');
    expect(tourDue(2, 1, 1)).toBe(true);
    expect(tourDue(2, 2, 0)).toBe(false);
  });
});

import { addMonths, addDays, monthGrid, startOfWeek, weekDays, parseDate, parseTime, fromISO, lastDays, daysBetween } from '../../src/lib/dates';
describe('dates', () => {
  it('adds days and months, clamping the day', () => {
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01');
    expect(addMonths('2026-01-31', 1)).toBe('2026-02-28');
    expect(addMonths('2026-03-15', -3)).toBe('2025-12-15');
    expect(daysBetween('2026-10-01', '2026-10-14')).toBe(13);
  });
  it('builds weeks and a fixed 6x7 month', () => {
    expect(startOfWeek('2026-10-14')).toBe('2026-10-12');
    expect(startOfWeek('2026-10-14', 0)).toBe('2026-10-11');
    expect(weekDays('2026-10-14')[6]).toBe('2026-10-18');
    const g = monthGrid('2026-10-14');
    expect(g.length).toBe(6); expect(g[0].length).toBe(7);
    expect(g[0][0]).toBe('2026-09-28'); expect(g.flat()).toContain('2026-10-31');
    expect(lastDays(3, '2026-10-14')).toEqual(['2026-10-12', '2026-10-13', '2026-10-14']);
  });
  it('parses typed dates and times', () => {
    expect(parseDate('14/10/2026')).toBe('2026-10-14');
    expect(parseDate('14 Oct 2026')).toBe('2026-10-14');
    expect(parseDate('31/02/2026')).toBeNull();
    expect(fromISO('2026-13-01')).toBeNull();
    expect(parseTime('9')).toBe('09:00');
    expect(parseTime('9:30 pm')).toBe('21:30');
    expect(parseTime('0930')).toBe('09:30');
    expect(parseTime('25:00')).toBeNull();
  });
});
