'use client';
import { useEffect, useRef, useState } from 'react';
import { cx } from '../lib/cx';
import { Button } from '../core/Button';
import { IconButton } from '../core/IconButton';
import { CheckIcon, CopyIcon } from '../core/icons';

async function copyText(text: string): Promise<boolean> {
  try { await navigator.clipboard.writeText(text); return true; }
  catch {
    // Fallback for http pages and older browsers.
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    let ok = false; try { ok = document.execCommand('copy'); } catch { ok = false; }
    ta.remove(); return ok;
  }
}

export interface CopyButtonProps {
  /** What goes on the clipboard. */
  text: string;
  /** "Copy", "Copy link". */
  label?: string;
  /** icon: a square icon button (default). text: a small button with the words. */
  variant?: 'icon' | 'text';
  className?: string;
}

/** Copies text and says so ("Copied", announced) for two seconds. */
export function CopyButton({ text, label = 'Copy', variant = 'icon', className }: CopyButtonProps) {
  const [state, setState] = useState<'idle' | 'done' | 'fail'>('idle');
  const t = useRef<number>();
  useEffect(() => () => window.clearTimeout(t.current), []);
  const go = async () => {
    const ok = await copyText(text);
    setState(ok ? 'done' : 'fail');
    window.clearTimeout(t.current); t.current = window.setTimeout(() => setState('idle'), 2000);
  };
  const said = state === 'done' ? 'Copied' : state === 'fail' ? 'Could not copy. Select the text and copy it.' : '';
  return (
    <span className={cx('ar-copy', className)}>
      {variant === 'icon'
        ? <IconButton size="sm" label={state === 'done' ? 'Copied' : label} onClick={go}>{state === 'done' ? <CheckIcon /> : <CopyIcon />}</IconButton>
        : <Button size="sm" variant="ghost" icon={state === 'done' ? <CheckIcon /> : <CopyIcon />} onClick={go}>{state === 'done' ? 'Copied' : label}</Button>}
      <span role="status" className="ar-visually-hidden">{said}</span>
    </span>
  );
}

export interface CodeBlockProps {
  code: string;
  /** Shown as a label ("ts", "bash"). */
  language?: string;
  /** A file name or caption above the code. */
  title?: string;
  lineNumbers?: boolean;
  /** Start with long lines wrapped (a toggle lets people switch). */
  wrap?: boolean;
  /** Show the copy button (default true). */
  copy?: boolean;
  className?: string;
}

/** Code in the mono font. Long lines scroll inside the block (it takes keyboard focus to scroll) or wrap. */
export function CodeBlock({ code, language, title, lineNumbers, wrap: wrap0 = false, copy = true, className }: CodeBlockProps) {
  const [wrap, setWrap] = useState(wrap0);
  const lines = code.replace(/\n$/, '').split('\n');
  return (
    <figure className={cx('ar-code', className)} data-wrap={wrap || undefined}>
      <figcaption className="ar-code-bar">
        <span className="ar-code-title">{title ?? language ?? 'Code'}</span>
        {title && language && <span className="ar-code-lang">{language}</span>}
        <span className="ar-code-grow" />
        <Button size="sm" variant="ghost" aria-pressed={wrap} onClick={() => setWrap(!wrap)}>Wrap lines</Button>
        {copy && <CopyButton text={code} label="Copy code" />}
      </figcaption>
      <pre className="ar-code-pre ar-scroll-x" tabIndex={0} aria-label={title ?? (language ? `${language} code` : 'Code')} data-scroll-x="">
        <code>{lineNumbers
          ? lines.map((l, i) => <span key={i} className="ar-code-line"><span className="ar-code-num" aria-hidden="true">{i + 1}</span>{l || ' '}{'\n'}</span>)
          : code}</code>
      </pre>
    </figure>
  );
}
