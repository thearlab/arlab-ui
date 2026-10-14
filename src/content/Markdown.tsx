'use client';
import { useMemo, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { parseMarkdown, type Block, type Inline } from '../lib/markdown';
import { CodeBlock } from './Code';

export interface MarkdownProps {
  /** Markdown text. Raw HTML in it is shown as text, never run. */
  children: string;
  /** Headings start at this level (default 2, so a page's own h1 stays the only one). */
  headingBase?: 1 | 2 | 3;
  /** Smaller type for side panels and chat. */
  compact?: boolean;
  className?: string;
}

const inl = (list: Inline[], key = ''): ReactNode[] => list.map((n, i) => {
  const k = `${key}${i}`;
  switch (n.t) {
    case 'text': return n.v;
    case 'strong': return <strong key={k}>{inl(n.c, k)}</strong>;
    case 'em': return <em key={k}>{inl(n.c, k)}</em>;
    case 'del': return <del key={k}>{inl(n.c, k)}</del>;
    case 'code': return <code key={k}>{n.v}</code>;
    case 'br': return <br key={k} />;
    case 'link': {
      const ext = /^https?:/i.test(n.href);
      return <a key={k} href={n.href} {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{inl(n.c, k)}{ext && <span className="ar-visually-hidden"> (opens in a new tab)</span>}</a>;
    }
  }
});

function blocks(list: Block[], base: number, key = ''): ReactNode[] {
  return list.map((b, i) => {
    const k = `${key}${i}`;
    switch (b.t) {
      case 'h': { const H = `h${Math.min(6, b.level + base - 1)}` as 'h2'; return <H key={k}>{inl(b.c, k)}</H>; }
      case 'p': return <p key={k}>{inl(b.c, k)}</p>;
      case 'code': return <CodeBlock key={k} code={b.v} language={b.lang || undefined} />;
      case 'hr': return <hr key={k} />;
      case 'quote': return <blockquote key={k}>{blocks(b.c, base, k)}</blockquote>;
      case 'list': {
        const items = b.items.map((it, j) => <li key={j} className={it.checked !== undefined ? 'ar-md-task' : undefined}>
          {it.checked !== undefined && <input type="checkbox" checked={it.checked} readOnly disabled aria-label={it.checked ? 'Done' : 'Not done'} />}{it.checked !== undefined ? <span>{inl(it.c, `${k}-${j}`)}</span> : inl(it.c, `${k}-${j}`)}</li>);
        return b.ordered ? <ol key={k} start={b.start !== 1 ? b.start : undefined}>{items}</ol> : <ul key={k}>{items}</ul>;
      }
      case 'table': return (
        <div key={k} className="ar-md-table"><div className="ar-md-table-scroll ar-scroll-x" tabIndex={0} role="region" aria-label="Table" data-scroll-x="">
          <table>
            <thead><tr>{b.head.map((h, j) => <th key={j} style={b.align[j] ? { textAlign: b.align[j]! } : undefined}>{inl(h, `${k}h${j}`)}</th>)}</tr></thead>
            <tbody>{b.rows.map((r, ri) => <tr key={ri}>{r.map((c, j) => <td key={j} style={b.align[j] ? { textAlign: b.align[j]! } : undefined}>{inl(c, `${k}r${ri}c${j}`)}</td>)}</tr>)}</tbody>
          </table>
        </div></div>
      );
    }
  });
}

/** Renders Markdown safely as React elements: headings, paragraphs, emphasis, code, links (safe
 * addresses only), lists and task lists, quotes, tables, rules. */
export function Markdown({ children, headingBase = 2, compact, className }: MarkdownProps) {
  const tree = useMemo(() => parseMarkdown(children ?? ''), [children]);
  return <div className={cx('ar-md', compact && 'ar-md--compact', className)}>{blocks(tree, headingBase)}</div>;
}

const label = (k: string) => k.replace(/[_-]+/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase());

export interface ReadableDataProps { value: unknown; className?: string }

/** Any JSON value as a readable document: objects as labelled rows, arrays as lists, empty as "None".
 * For agent and workflow results, never a JSON blob. */
export function ReadableData({ value, className }: ReadableDataProps) {
  return <div className={cx('ar-readable', className)}><Value v={value} depth={0} /></div>;
}
function Value({ v, depth }: { v: unknown; depth: number }): JSX.Element {
  if (v === null || v === undefined || v === '') return <span className="ar-readable-none">None</span>;
  if (typeof v === 'boolean') return <span>{v ? 'Yes' : 'No'}</span>;
  if (typeof v !== 'object') return <span className="ar-readable-text">{String(v)}</span>;
  if (Array.isArray(v)) {
    if (!v.length) return <span className="ar-readable-none">None</span>;
    return <ul className="ar-readable-list">{v.map((x, i) => <li key={i}><Value v={x} depth={depth + 1} /></li>)}</ul>;
  }
  const entries = Object.entries(v as Record<string, unknown>);
  if (!entries.length) return <span className="ar-readable-none">None</span>;
  return (
    <dl className={cx('ar-readable-dl', depth > 0 && 'ar-readable-dl--nested')}>
      {entries.map(([k, x]) => <div key={k} className="ar-readable-row"><dt>{label(k)}</dt><dd><Value v={x} depth={depth + 1} /></dd></div>)}
    </dl>
  );
}
