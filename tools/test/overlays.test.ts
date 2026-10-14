import { describe, expect, it } from 'vitest';
import { parseMarkdown, parseInline, safeHref } from '../../src/lib/markdown';
import { groupMessages, dayTitle } from '../../src/lib/chat';

describe('safeHref', () => {
  it('keeps safe addresses', () => {
    for (const h of ['https://thearlab.com', 'http://x.y/a?b#c', 'mailto:a@b.c', 'tel:+961', '/browse/a.md', '#top', './x', '../y', 'page.md']) expect(safeHref(h)).toBe(h);
  });
  it('drops script, data and obfuscated schemes', () => {
    for (const h of ['javascript:alert(1)', 'JavaScript:alert(1)', ' javascript:alert(1)', 'java\tscript:alert(1)', 'java\nscript:x', '\u0001javascript:x', 'data:text/html,<script>', 'vbscript:x', 'file:///etc/passwd']) expect(safeHref(h)).toBeNull();
  });
});

describe('parseInline', () => {
  it('parses emphasis, code and links', () => {
    expect(parseInline('a **b** *c* `d` ~~e~~')).toEqual([
      { t: 'text', v: 'a ' }, { t: 'strong', c: [{ t: 'text', v: 'b' }] }, { t: 'text', v: ' ' }, { t: 'em', c: [{ t: 'text', v: 'c' }] },
      { t: 'text', v: ' ' }, { t: 'code', v: 'd' }, { t: 'text', v: ' ' }, { t: 'del', c: [{ t: 'text', v: 'e' }] },
    ]);
    expect(parseInline('[ARLAB](https://thearlab.com)')).toEqual([{ t: 'link', href: 'https://thearlab.com', c: [{ t: 'text', v: 'ARLAB' }] }]);
  });
  it('turns an unsafe link into plain text and keeps raw HTML as text', () => {
    expect(parseInline('[click](javascript:alert(1))')).toEqual([{ t: 'text', v: 'click' }]);
    expect(parseInline('[wiki](https://en.wikipedia.org/wiki/A_(b))')).toEqual([{ t: 'link', href: 'https://en.wikipedia.org/wiki/A_(b)', c: [{ t: 'text', v: 'wiki' }] }]);
    expect(parseInline('<img src=x onerror=alert(1)>')).toEqual([{ t: 'text', v: '<img src=x onerror=alert(1)>' }]);
    expect(parseInline('snake_case_name')).toEqual([{ t: 'text', v: 'snake_case_name' }]);
    expect(parseInline('\\*not em\\*')).toEqual([{ t: 'text', v: '*not em*' }]);
  });
  it('autolinks bare URLs without the trailing dot', () => {
    expect(parseInline('see https://a.com/x.')).toEqual([{ t: 'text', v: 'see ' }, { t: 'link', href: 'https://a.com/x', c: [{ t: 'text', v: 'https://a.com/x' }] }, { t: 'text', v: '.' }]);
  });
});

describe('parseMarkdown', () => {
  it('parses blocks', () => {
    const md = '# Title\n\nPara one\nstill one.\n\n- a\n- [x] b\n\n1. one\n2. two\n\n> quote\n\n```ts\nconst a = 1;\n```\n\n---\n\n| A | B |\n|:--|--:|\n| 1 | 2 |';
    const b = parseMarkdown(md);
    expect(b.map((x) => x.t)).toEqual(['h', 'p', 'list', 'list', 'quote', 'code', 'hr', 'table']);
    expect(b[1]).toEqual({ t: 'p', c: [{ t: 'text', v: 'Para one still one.' }] });
    expect((b[2] as any).items[1].checked).toBe(true);
    expect((b[3] as any).ordered).toBe(true);
    expect(b[5]).toEqual({ t: 'code', lang: 'ts', v: 'const a = 1;' });
    expect((b[7] as any).align).toEqual(['left', 'right']);
  });
  it('never produces an unsafe link anywhere', () => {
    const tree = JSON.stringify(parseMarkdown('[a](javascript:x)\n\n- [b](data:text/html,x)\n\n| [c](vbscript:y) |\n|---|\n| d |'));
    expect(tree).not.toMatch(/javascript:|data:|vbscript:/);
  });
});

describe('chat grouping', () => {
  const now = new Date('2026-10-14T12:00:00');
  const at = (h: number, m = 0, d = 14) => new Date(2026, 9, d, h, m).toISOString();
  it('groups by author and day', () => {
    const rows = groupMessages([
      { id: '1', from: 'them', author: 'Labby', time: at(9, 0, 13) },
      { id: '2', from: 'them', author: 'Labby', time: at(9, 2) },
      { id: '3', from: 'them', author: 'Labby', time: at(9, 4) },
      { id: '4', from: 'me', time: at(9, 5) },
      { id: '5', from: 'me', time: at(9, 30) },
    ], now);
    expect(rows.map((r) => r.day)).toEqual(['Yesterday', 'Today', null, null, null]);
    expect(rows.map((r) => r.first)).toEqual([true, true, false, true, true]);
    expect(rows.map((r) => r.last)).toEqual([true, false, true, true, true]);
  });
  it('names days', () => {
    expect(dayTitle(new Date('2026-10-14T08:00:00'), now)).toBe('Today');
    expect(dayTitle(new Date('2026-10-10T08:00:00'), now)).toBe('Sat 10 Oct');
  });
});
