// A small, safe Markdown parser: text in, a plain tree out. The renderer turns the tree into React
// elements, so nothing is ever injected as HTML. Raw HTML in the source stays literal text, and a link
// only keeps an http(s), mailto, tel or relative address. Pure, unit tested (XSS cases included).
// ponytail: one level of lists, no reference links or footnotes; add them when a real doc needs them.

export type Inline =
  | { t: 'text'; v: string }
  | { t: 'strong' | 'em' | 'del'; c: Inline[] }
  | { t: 'code'; v: string }
  | { t: 'link'; href: string; c: Inline[] }
  | { t: 'br' };

export type Block =
  | { t: 'h'; level: 1 | 2 | 3 | 4 | 5 | 6; c: Inline[] }
  | { t: 'p'; c: Inline[] }
  | { t: 'code'; lang: string; v: string }
  | { t: 'list'; ordered: boolean; start: number; items: { c: Inline[]; checked?: boolean }[] }
  | { t: 'quote'; c: Block[] }
  | { t: 'table'; head: Inline[][]; align: Array<'left' | 'center' | 'right' | null>; rows: Inline[][][] }
  | { t: 'hr' };

/** The address itself if it is safe to link to, else null. */
export function safeHref(href: string): string | null {
  // Browsers ignore control characters and whitespace inside a scheme ("java\tscript:"), so drop them first.
  const h = href.replace(/[\u0000- \u007f-\u009f]/g, '');
  if (!h) return null;
  const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(h);
  if (!scheme) return /^(\/|#|\?|\.\/|\.\.\/|[^:]*$)/.test(h) ? href.trim() : null;
  return ['http', 'https', 'mailto', 'tel'].includes(scheme[1].toLowerCase()) ? href.trim() : null;
}

export function parseInline(src: string): Inline[] {
  const out: Inline[] = [];
  let buf = '';
  const flush = () => { if (buf) { out.push({ t: 'text', v: buf }); buf = ''; } };
  let i = 0;
  while (i < src.length) {
    const ch = src[i], rest = src.slice(i);
    if (ch === '\\' && i + 1 < src.length && /[\\`*_[\]()#+\-.!~|>]/.test(src[i + 1])) { buf += src[i + 1]; i += 2; continue; }
    if (ch === '`') {
      const m = /^(`+)([\s\S]*?[^`])\1(?!`)/.exec(rest);
      if (m) { flush(); out.push({ t: 'code', v: m[2].trim() }); i += m[0].length; continue; }
    }
    if (rest.startsWith('**') || rest.startsWith('__')) {
      const d = rest.slice(0, 2), end = src.indexOf(d, i + 2);
      if (end > i + 2) { flush(); out.push({ t: 'strong', c: parseInline(src.slice(i + 2, end)) }); i = end + 2; continue; }
    }
    if (rest.startsWith('~~')) {
      const end = src.indexOf('~~', i + 2);
      if (end > i + 2) { flush(); out.push({ t: 'del', c: parseInline(src.slice(i + 2, end)) }); i = end + 2; continue; }
    }
    if ((ch === '*' || ch === '_') && src[i + 1] && src[i + 1] !== ' ' && !(ch === '_' && /\w/.test(src[i - 1] ?? ''))) {
      const end = src.indexOf(ch, i + 1);
      if (end > i + 1 && src[end - 1] !== ' ') { flush(); out.push({ t: 'em', c: parseInline(src.slice(i + 1, end)) }); i = end + 1; continue; }
    }
    if (ch === '[') {
      const m = /^\[((?:[^\]\\]|\\.)*)\]\(\s*<?((?:[^\s()<>]|\([^\s()<>]*\))*)>?(?:\s+"[^"]*")?\s*\)/.exec(rest);
      if (m) {
        flush();
        const href = safeHref(m[2]);
        const c = parseInline(m[1]);
        out.push(href ? { t: 'link', href, c } : { t: 'text', v: m[1] });
        i += m[0].length; continue;
      }
    }
    if (ch === '<') {
      const m = /^<((?:https?:\/\/|mailto:)[^\s<>]+)>/i.exec(rest);
      if (m && safeHref(m[1])) { flush(); out.push({ t: 'link', href: m[1], c: [{ t: 'text', v: m[1].replace(/^mailto:/i, '') }] }); i += m[0].length; continue; }
    }
    if (ch === 'h' && /^https?:\/\/[^\s<]+[^\s<.,;:!?)\]'"]/.test(rest) && !/\w/.test(src[i - 1] ?? '')) {
      const m = /^https?:\/\/[^\s<]+[^\s<.,;:!?)\]'"]/.exec(rest)!;
      flush(); out.push({ t: 'link', href: m[0], c: [{ t: 'text', v: m[0] }] }); i += m[0].length; continue;
    }
    if (ch === '\n') {
      if (buf.endsWith('  ') || buf.endsWith('\\')) { buf = buf.replace(/(\s{2,}|\\)$/, ''); flush(); out.push({ t: 'br' }); }
      else buf += ' ';
      i++; continue;
    }
    buf += ch; i++;
  }
  flush();
  return out;
}

const cells = (line: string) => line.trim().replace(/^\|/, '').replace(/\|$/, '').split(/(?<!\\)\|/).map((c) => c.trim().replace(/\\\|/g, '|'));

export function parseMarkdown(md: string): Block[] {
  const lines = md.replace(/\r\n?/g, '\n').replace(/\t/g, '    ').split('\n');
  const blocks: Block[] = [];
  let i = 0;
  const isBreak = (l: string) => /^\s*$/.test(l) || /^ {0,3}(#{1,6}\s|```|~~~|>|[-*+]\s|\d{1,9}[.)]\s)/.test(l) || /^ {0,3}([-*_])(\s*\1){2,}\s*$/.test(l);
  while (i < lines.length) {
    const l = lines[i];
    if (/^\s*$/.test(l)) { i++; continue; }
    let m: RegExpExecArray | null;
    if ((m = /^ {0,3}(```|~~~)\s*([\w+-]*)\s*$/.exec(l))) {
      const fence = m[1], body: string[] = []; i++;
      while (i < lines.length && !new RegExp(`^ {0,3}${fence}\\s*$`).test(lines[i])) body.push(lines[i++]);
      i++; blocks.push({ t: 'code', lang: m[2], v: body.join('\n') }); continue;
    }
    if ((m = /^ {0,3}(#{1,6})\s+(.*?)\s*#*\s*$/.exec(l))) { blocks.push({ t: 'h', level: m[1].length as 1, c: parseInline(m[2]) }); i++; continue; }
    if (/^ {0,3}([-*_])(\s*\1){2,}\s*$/.test(l)) { blocks.push({ t: 'hr' }); i++; continue; }
    if (/^ {0,3}>/.test(l)) {
      const body: string[] = [];
      while (i < lines.length && /^ {0,3}>/.test(lines[i])) body.push(lines[i++].replace(/^ {0,3}> ?/, ''));
      blocks.push({ t: 'quote', c: parseMarkdown(body.join('\n')) }); continue;
    }
    if ((m = /^ {0,3}([-*+]|\d{1,9}[.)])\s+/.exec(l))) {
      const ordered = /\d/.test(m[1]);
      const start = ordered ? parseInt(m[1], 10) : 1;
      const items: { c: Inline[]; checked?: boolean }[] = [];
      const re = ordered ? /^ {0,3}\d{1,9}[.)]\s+(.*)$/ : /^ {0,3}[-*+]\s+(.*)$/;
      while (i < lines.length) {
        const im = re.exec(lines[i]);
        if (!im) break;
        let text = im[1]; i++;
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !re.test(lines[i])) text += '\n' + lines[i++].trim();
        const task = /^\[([ xX])\]\s+(.*)$/s.exec(text);
        items.push(task ? { c: parseInline(task[2]), checked: task[1] !== ' ' } : { c: parseInline(text) });
        if (i < lines.length && /^\s*$/.test(lines[i]) && re.test(lines[i + 1] ?? '')) i++;
      }
      blocks.push({ t: 'list', ordered, start, items }); continue;
    }
    if (l.includes('|') && i + 1 < lines.length && /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(lines[i + 1])) {
      const head = cells(l);
      const align = cells(lines[i + 1]).map((c) => (/^:-+:$/.test(c) ? 'center' : /-:$/.test(c) ? 'right' : /^:-/.test(c) ? 'left' : null));
      i += 2;
      const rows: Inline[][][] = [];
      while (i < lines.length && lines[i].includes('|') && !/^\s*$/.test(lines[i])) {
        const r = cells(lines[i++]);
        rows.push(head.map((_, k) => parseInline(r[k] ?? '')));
      }
      blocks.push({ t: 'table', head: head.map(parseInline), align, rows }); continue;
    }
    const para: string[] = [l]; i++;
    while (i < lines.length && !isBreak(lines[i])) para.push(lines[i++]);
    const text = para.join('\n').trim();
    // Setext headings: a paragraph line underlined with === or ---.
    blocks.push({ t: 'p', c: parseInline(text) });
  }
  return blocks;
}
