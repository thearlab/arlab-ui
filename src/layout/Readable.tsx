'use client';

import { useState, type ReactNode } from 'react';
import { Button } from '../Button';

export interface CopyBlockProps {
  /** The text to show and copy. */
  text: string;
  /** Called after a successful copy (a toast, usually). */
  onCopied?: () => void;
  label?: string;
}

/** A mono code block with a Copy button in its corner. */
export function CopyBlock({ text, onCopied, label = 'Copy' }: CopyBlockProps) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); setDone(true); onCopied?.(); window.setTimeout(() => setDone(false), 1500); } catch { /* clipboard unavailable */ }
  };
  return (
    <div className="arlab-copyblock">
      <pre className="arlab-code">{text}</pre>
      <Button size="sm" onClick={copy}>{done ? 'Copied' : label}</Button>
    </div>
  );
}

const label = (k: string) => k.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ').replace(/^./, (c) => c.toUpperCase());

/** Any structured value as a readable document: objects as labelled rows, arrays as lists, never JSON. */
export function ReadableDoc({ value, depth = 0 }: { value: unknown; depth?: number }): ReactNode {
  if (value === null || value === undefined || value === '') return <span className="arlab-readable-none">None</span>;
  if (typeof value !== 'object') return <span className="arlab-readable-val">{String(value)}</span>;
  if (Array.isArray(value)) {
    if (!value.length) return <span className="arlab-readable-none">None</span>;
    return (
      <ul className={['arlab-readable-list', depth ? '' : 'top'].filter(Boolean).join(' ')}>
        {value.map((x, i) => <li key={i}>{typeof x === 'object' && x !== null ? <ReadableDoc value={x} depth={depth + 1} /> : String(x)}</li>)}
      </ul>
    );
  }
  return (
    <dl className={['arlab-readable', depth ? '' : 'top'].filter(Boolean).join(' ')}>
      {Object.entries(value as Record<string, unknown>).map(([k, x]) => (
        <div key={k} className="arlab-readable-row">
          <dt>{label(k)}</dt>
          <dd><ReadableDoc value={x} depth={depth + 1} /></dd>
        </div>
      ))}
    </dl>
  );
}
